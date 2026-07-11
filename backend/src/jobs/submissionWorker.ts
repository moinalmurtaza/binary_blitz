import { Worker, Job } from 'bullmq';
import { redisConnection } from '../config/redis';
import prisma from '../config/db';
import { SubmissionStatus } from '@prisma/client';

interface SubmissionJobData {
  submissionId: string;
  problemId: string;
  code: string;
  language: string;
}

export const submissionWorker = new Worker<SubmissionJobData>(
  'submissions',
  async (job: Job<SubmissionJobData>) => {
    const { submissionId, problemId, code } = job.data;
    console.log(`[Worker] Started evaluating submission ${submissionId} for problem ${problemId}...`);

    try {
      // 1. Update status to RUNNING
      await prisma.submission.update({
        where: { id: submissionId },
        data: { status: SubmissionStatus.RUNNING },
      });

      // 2. Fetch the problem constraints and test cases
      const problem = await prisma.problem.findUnique({
        where: { id: problemId },
      });

      if (!problem) {
        throw new Error(`Problem ${problemId} not found`);
      }

      // Simulate compile and execution overhead (e.g. 1.2s delay)
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // 3. Inspect code for force-verdicts (to aid testing & verification)
      let finalStatus: SubmissionStatus = SubmissionStatus.ACCEPTED;
      let runTimeMs = Math.floor(Math.random() * 80) + 10; // random 10-90ms
      let memoryUsedKb = Math.floor(Math.random() * 4000) + 1024; // random 1-5MB
      let errorFeedback = null;

      if (code.includes('FORCE_TLE')) {
        finalStatus = SubmissionStatus.TIME_LIMIT_EXCEEDED;
        runTimeMs = problem.timeLimitMs + 100;
      } else if (code.includes('FORCE_WA')) {
        finalStatus = SubmissionStatus.WRONG_ANSWER;
      } else if (code.includes('FORCE_RTE')) {
        finalStatus = SubmissionStatus.RUNTIME_ERROR;
        errorFeedback = 'Segmentation fault (core dumped) at line 12';
      } else if (code.includes('FORCE_CE')) {
        finalStatus = SubmissionStatus.COMPILATION_ERROR;
        errorFeedback = 'g++: error: expected \';\' before \'return\'';
      } else if (code.includes('FORCE_MLE')) {
        finalStatus = SubmissionStatus.MEMORY_LIMIT_EXCEEDED;
        memoryUsedKb = (problem.memoryLimitMb * 1024) + 4096;
      }

      // 4. If compilation or matching passed, adjust solve count if ACCEPTED
      await prisma.$transaction(async (tx) => {
        const updatedSubmission = await tx.submission.update({
          where: { id: submissionId },
          data: {
            status: finalStatus,
            runTimeMs,
            memoryUsedKb,
            errorFeedback,
          },
        });

        if (finalStatus === SubmissionStatus.ACCEPTED) {
          await tx.problem.update({
            where: { id: problemId },
            data: { solvedCount: { increment: 1 } },
          });
        }

        return updatedSubmission;
      });

      console.log(`[Worker] Finished submission ${submissionId}. Verdict: ${finalStatus}`);
    } catch (error) {
      console.error(`[Worker] Error processing submission ${submissionId}:`, error);
      // Mark as runtime/compilation error on process crash
      await prisma.submission.update({
        where: { id: submissionId },
        data: {
          status: SubmissionStatus.RUNTIME_ERROR,
          errorFeedback: error instanceof Error ? error.message : 'Unknown evaluation error',
        },
      });
    }
  },
  {
    connection: redisConnection,
    concurrency: 2, // Process up to 2 submissions concurrently
  }
);

submissionWorker.on('failed', (job, err) => {
  console.error(`[Worker] Job ${job?.id} failed with error:`, err);
});
