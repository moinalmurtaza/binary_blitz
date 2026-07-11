import { Queue } from 'bullmq';
import { redisConnection } from '../config/redis';

export interface SubmissionJobData {
  submissionId: string;
  problemId: string;
  code: string;
  language: string;
}

export const submissionQueue = new Queue<SubmissionJobData>('submissions', {
  connection: redisConnection,
});

export async function addSubmissionJob(data: SubmissionJobData) {
  await submissionQueue.add(`submit_${data.submissionId}`, data, {
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 1000,
    },
  });
}
