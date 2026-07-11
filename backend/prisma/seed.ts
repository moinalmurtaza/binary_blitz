import { PrismaClient, Role, Category, ResourceType, ContestStatus, SubmissionStatus, DayType } from '@prisma/client';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

async function main() {
  console.log('Seeding database with Supabase integration...');

  if (!supabaseUrl || !supabaseServiceKey) {
    console.error('CRITICAL ERROR: SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set in .env to run seeding.');
    process.exit(1);
  }

  // 1. Clean existing database records (excluding auth system)
  await prisma.studentProgress.deleteMany();
  await prisma.dayResource.deleteMany();
  await prisma.day.deleteMany();
  await prisma.week.deleteMany();
  await prisma.phase.deleteMany();
  await prisma.auditLog.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.chatMessage.deleteMany();
  await prisma.resource.deleteMany();
  await prisma.clarification.deleteMany();
  await prisma.submission.deleteMany();
  await prisma.contestProblem.deleteMany();
  await prisma.contest.deleteMany();
  await prisma.problem.deleteMany();
  await prisma.trainerProfile.deleteMany();
  await prisma.alumniProfile.deleteMany();
  await prisma.profile.deleteMany();

  // 2. Clean existing demo users in Supabase Auth
  console.log('→ Cleaning old demo users in Supabase Auth...');
  const { data: authUsersData, error: listError } = await supabaseAdmin.auth.admin.listUsers();
  if (listError) {
    console.error('Failed to list Supabase auth users:', listError.message);
  } else {
    const demoEmails = ['admin@nwu.edu.bd', 'trainer@nwu.edu.bd', 'student1@nwu.edu.bd', 'student2@nwu.edu.bd', 'alumni@nwu.edu.bd'];
    for (const email of demoEmails) {
      const match = authUsersData.users.find(u => u.email === email);
      if (match) {
        console.log(`  Deleting existing Supabase auth user: ${email}`);
        await supabaseAdmin.auth.admin.deleteUser(match.id);
      }
    }
  }

  // 3. Create Demo Accounts in Supabase Auth
  console.log('→ Creating new demo accounts in Supabase Auth...');
  const accounts = [
    { email: 'admin@nwu.edu.bd', password: 'password123', name: 'Admin User', role: 'ADMIN' },
    { email: 'trainer@nwu.edu.bd', password: 'password123', name: 'Dr. John Doe', role: 'TRAINER' },
    { email: 'student1@nwu.edu.bd', password: 'password123', name: 'Rahat Khan', role: 'STUDENT' },
    { email: 'student2@nwu.edu.bd', password: 'password123', name: 'Faria Yasmin', role: 'STUDENT' },
    { email: 'alumni@nwu.edu.bd', password: 'password123', name: 'Jane Smith', role: 'ALUMNI' }
  ];

  const createdAuthUsers: Record<string, string> = {}; // email -> id

  for (const acct of accounts) {
    const { data: authUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
      email: acct.email,
      password: acct.password,
      email_confirm: true,
      user_metadata: { name: acct.name, role: acct.role }
    });

    if (createError || !authUser.user) {
      console.error(`Failed to seed auth account ${acct.email}:`, createError?.message);
      process.exit(1);
    }
    console.log(`  Auth created: ${acct.email} (ID: ${authUser.user.id})`);
    createdAuthUsers[acct.email] = authUser.user.id;
  }

  // 4. Create database profiles for auth users
  console.log('→ Seeding Profiles table...');
  const adminId = createdAuthUsers['admin@nwu.edu.bd'];
  const trainerId = createdAuthUsers['trainer@nwu.edu.bd'];
  const student1Id = createdAuthUsers['student1@nwu.edu.bd'];
  const student2Id = createdAuthUsers['student2@nwu.edu.bd'];
  const alumniId = createdAuthUsers['alumni@nwu.edu.bd'];

  // Admin Profile
  await prisma.profile.create({
    data: {
      id: adminId,
      email: 'admin@nwu.edu.bd',
      name: 'Admin User',
      username: 'admin',
      role: Role.ADMIN,
      category: Category.EXECUTIVE_MEMBER,
      bio: 'Executive Admin of Comptron Club CP Platform',
      avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&h=150&q=80',
    }
  });

  // Trainer Profile
  await prisma.profile.create({
    data: {
      id: trainerId,
      email: 'trainer@nwu.edu.bd',
      name: 'Dr. John Doe',
      username: 'trainer',
      role: Role.TRAINER,
      category: Category.TRAINER,
      bio: 'Assistant Professor, CSE Dept. NWU Khulna',
      avatarUrl: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=150&h=150&q=80',
      handleCodeforces: 'tourist',
      handleGithub: 'johndoe',
      trainerProfile: {
        create: {
          research: 'Algorithms, Machine Learning and Game Theory',
          publications: [
            'Efficient Shortest Path Computation, Journal of CP 2024',
            'Advanced Data Structures in Competitive Programming, ICCS 2025'
          ],
          officeHours: 'Mon/Wed 10:00 AM - 12:00 PM',
          teachingSubjects: ['Data Structures', 'Design & Analysis of Algorithms', 'Discrete Mathematics'],
        }
      }
    }
  });

  // Alumni Profile
  await prisma.profile.create({
    data: {
      id: alumniId,
      email: 'alumni@nwu.edu.bd',
      name: 'Jane Smith',
      username: 'alumni',
      role: Role.ALUMNI,
      category: Category.ALUMNI,
      bio: 'Ex-NWU CSE Graduate. Software Engineer at Google.',
      avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&h=150&q=80',
      handleCodeforces: 'ecnerwala',
      handleGithub: 'janesmith',
      handleLinkedin: 'janesmith-swe',
      alumniProfile: {
        create: {
          currentCompany: 'Google (Munich, Germany)',
          mentorshipOpen: true,
          timeline: [
            { role: 'Software Engineer', company: 'Google', start: '2023', end: 'Present' },
            { role: 'Research Assistant', company: 'NWU Khulna', start: '2022', end: '2023' }
          ]
        }
      }
    }
  });

  // Student 1 Profile
  await prisma.profile.create({
    data: {
      id: student1Id,
      email: 'student1@nwu.edu.bd',
      name: 'Rahat Khan',
      username: 'student1',
      role: Role.STUDENT,
      category: Category.ICPC_TEAM,
      rating: 1540,
      bio: 'Competitive Programming enthusiast. NwU_Elite Team Member.',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&h=150&q=80',
      handleCodeforces: 'rahat_nwu',
      handleGithub: 'rahatkhan-nwu',
      department: 'Computer Science and Engineering',
      batch: '15th Batch',
      achievements: ['Ranked 45th in ICPC Dhaka Regional 2024', '1st Runner Up in NWU Intra University Contest 2025'],
    }
  });

  // Student 2 Profile
  await prisma.profile.create({
    data: {
      id: student2Id,
      email: 'student2@nwu.edu.bd',
      name: 'Faria Yasmin',
      username: 'student2',
      role: Role.STUDENT,
      category: Category.BEGINNER,
      rating: 980,
      bio: 'Freshman CSE student, learning competitive programming.',
      avatarUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150&h=150&q=80',
      handleCodeforces: 'faria_cse',
      department: 'Computer Science and Engineering',
      batch: '18th Batch',
    }
  });

  // 5. Create Problems
  console.log('→ Seeding Problems...');
  const problem1 = await prisma.problem.create({
    data: {
      title: 'A+B Problem',
      statement: 'Given two integers $A$ and $B$, compute their sum $A + B$.',
      constraints: '$-10^9 \\le A, B \\le 10^9$',
      timeLimitMs: 1000,
      memoryLimitMb: 256,
      difficulty: '800',
      tags: ['implementation', 'math'],
      solvedCount: 5,
      editorial: 'Simply read two integers $A$ and $B$, then print $A + B$.',
      testCases: [
        { input: '2 3\n', output: '5\n' },
        { input: '-1 5\n', output: '4\n' }
      ],
      creatorId: trainerId,
    }
  });

  const problem2 = await prisma.problem.create({
    data: {
      title: 'Odd or Even',
      statement: 'Given an integer $N$, determine whether it is even or odd.',
      constraints: '$-10^9 \\le N \\le 10^9$',
      timeLimitMs: 500,
      memoryLimitMb: 64,
      difficulty: '800',
      tags: ['implementation'],
      solvedCount: 3,
      editorial: 'Check the remainder of the number when divided by 2.',
      testCases: [
        { input: '4\n', output: 'Even\n' },
        { input: '7\n', output: 'Odd\n' }
      ],
      creatorId: trainerId,
    }
  });

  const problem3 = await prisma.problem.create({
    data: {
      title: 'Shortest Path (Dijkstra)',
      statement: 'Given a weighted directed graph, find the shortest path from vertex 1 to all other vertices.',
      constraints: '$1 \\le N \\le 10^5$, $1 \\le M \\le 2 \\times 10^5$',
      timeLimitMs: 2000,
      memoryLimitMb: 512,
      difficulty: '1500',
      tags: ['graphs', 'shortest paths', 'greedy'],
      solvedCount: 1,
      editorial: 'Use Dijkstra\'s algorithm with a priority queue (min-heap).',
      testCases: [
        { input: '4 4\n1 2 2\n2 3 3\n1 3 6\n3 4 1\n', output: '0 2 5 6\n' }
      ],
      creatorId: trainerId,
    }
  });

  // 6. Create Contests
  console.log('→ Seeding Contests...');
  const now = new Date();
  const pastContest = await prisma.contest.create({
    data: {
      title: 'NWU Intra University Programming Contest 2026',
      description: 'The annual competitive programming festival for NWU students.',
      startTime: new Date(now.getTime() - 24 * 60 * 60 * 1000),
      endTime: new Date(now.getTime() - 19 * 60 * 60 * 1000),
      durationSeconds: 18000,
      status: ContestStatus.ENDED,
      creatorId: trainerId,
      problems: {
        create: [
          { problemId: problem1.id, alias: 'A', score: 100 },
          { problemId: problem2.id, alias: 'B', score: 100 }
        ]
      }
    }
  });

  const runningContest = await prisma.contest.create({
    data: {
      title: 'Comptron Weekly Training Contest #1',
      description: 'Weekly practice contest organized by trainer John Doe.',
      startTime: new Date(now.getTime() - 1 * 60 * 60 * 1000),
      endTime: new Date(now.getTime() + 4 * 60 * 60 * 1000),
      durationSeconds: 18000,
      status: ContestStatus.RUNNING,
      creatorId: trainerId,
      problems: {
        create: [
          { problemId: problem2.id, alias: 'A', score: 100 },
          { problemId: problem3.id, alias: 'B', score: 200 }
        ]
      }
    }
  });

  // 7. Create Submissions
  console.log('→ Seeding Submissions...');
  await prisma.submission.create({
    data: {
      userId: student1Id,
      problemId: problem1.id,
      contestId: pastContest.id,
      language: 'cpp',
      code: '#include <iostream>\nusing namespace std;\nint main() {\n  long long a, b;\n  if(cin >> a >> b) cout << a + b << endl;\n  return 0;\n}',
      status: SubmissionStatus.ACCEPTED,
      runTimeMs: 15,
      memoryUsedKb: 2048,
    }
  });

  await prisma.submission.create({
    data: {
      userId: student2Id,
      problemId: problem2.id,
      contestId: runningContest.id,
      language: 'python',
      code: 'n = int(input())\nif n % 2 == 0:\n    print("Even")\nelse:\n    print("Odd")',
      status: SubmissionStatus.ACCEPTED,
      runTimeMs: 42,
      memoryUsedKb: 8192,
    }
  });

  // 8. Create Learning Hub Resources (Legacy)
  console.log('→ Seeding Learning Hub resources...');
  await prisma.resource.create({
    data: {
      title: 'Competitive Programmer\'s Handbook',
      type: ResourceType.BOOK,
      category: 'General CP',
      fileUrl: 'https://cses.fi/book/book.pdf',
      markdownContent: 'The Competitive Programmer\'s Handbook is a comprehensive introduction to modern competitive programming.',
      authorId: trainerId,
      tags: ['book', 'guide', 'basics'],
    }
  });

  // 9. Seeding CP Roadmap Tracker
  console.log('→ Seeding CP Roadmap Tracker Phases, Weeks, Days, and Resources...');
  const phase1 = await prisma.phase.create({
    data: {
      title: 'Phase 1: Basic Programming Paradigms',
      description: 'Introduction to standard competitive programming concepts, math, logic, and arrays.',
      phaseOrder: 1,
      startDate: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000), // started 7 days ago
      endDate: new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000), // ends in 14 days
    }
  });

  const phase2 = await prisma.phase.create({
    data: {
      title: 'Phase 2: Fundamental Data Structures & Sorting',
      description: 'Covering stacks, queues, sorting algorithms, binary search, and prefix sums.',
      phaseOrder: 2,
      startDate: new Date(now.getTime() + 15 * 24 * 60 * 60 * 1000),
      endDate: new Date(now.getTime() + 35 * 24 * 60 * 60 * 1000),
    }
  });

  // Phase 1 - Week 1
  const p1w1 = await prisma.week.create({
    data: {
      phaseId: phase1.id,
      weekNumber: 1,
      startDate: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000),
      endDate: new Date(now.getTime()),
    }
  });

  // Phase 1 - Week 2 (Current Week)
  const p1w2 = await prisma.week.create({
    data: {
      phaseId: phase1.id,
      weekNumber: 2,
      startDate: new Date(now.getTime()),
      endDate: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000),
    }
  });

  // Helper function to seed days for a week
  const seedWeekDays = async (weekId: string, startDate: Date, isCompletedForStudent: boolean = false) => {
    const dayTypes = [
      { num: 1, type: DayType.Theory, title: 'Time Complexity & Space Complexity', desc: 'Understanding asymptotic notations Big O, Omega, and Theta. Analyzing loop bounds.', status: 'Published' },
      { num: 2, type: DayType.Problem_Set, title: 'Problem Solving: Complexity Estimates', desc: 'Solve selected math and array problems to estimate execution time.', status: 'Published' },
      { num: 3, type: DayType.Theory, title: 'STL & Standard Containers', desc: 'Introduction to vector, set, map, pair, queue, and stack in C++ STL.', status: 'Published' },
      { num: 4, type: DayType.Problem_Set, title: 'STL practice problems', desc: 'Implementation of problems involving maps, vectors, and unique count checks.', status: 'Published' },
      { num: 5, type: DayType.Preparation, title: 'Preparation Day', desc: 'Review notes, clear backlogs, and practice debugging templates.', status: 'Published' },
      { num: 6, type: DayType.Contest, title: 'Weekly Contest #1', desc: 'Participate in the live weekly division contest.', status: 'Published' },
      { num: 7, type: DayType.Off_Day, title: 'Off Day', desc: 'Weekly break to relax and refresh.', status: 'Published' }
    ];

    for (const dt of dayTypes) {
      const dayDate = new Date(startDate.getTime());
      dayDate.setDate(dayDate.getDate() + (dt.num - 1));

      const day = await prisma.day.create({
        data: {
          weekId,
          dayNumber: dt.num,
          date: dayDate,
          type: dt.type,
          title: dt.title,
          description: dt.desc,
          status: dt.status,
        }
      });

      // Add resources
      if (dt.type === DayType.Theory) {
        await prisma.dayResource.create({
          data: {
            dayId: day.id,
            title: 'Lecture Slides: Big-O analysis',
            resourceType: 'Slide',
            url: 'https://docs.google.com/presentation/d/demo-big-o',
            description: 'Core concepts explaining time and space limits in competitive programming.'
          }
        });
        await prisma.dayResource.create({
          data: {
            dayId: day.id,
            title: 'CSES Time Complexity notes',
            resourceType: 'Notes',
            url: 'https://cses.fi/book/book.pdf#page=18',
            description: 'Reading guide for complexity definitions.'
          }
        });
      } else if (dt.type === DayType.Problem_Set) {
        await prisma.dayResource.create({
          data: {
            dayId: day.id,
            title: 'Practice Challenge: A+B Problem',
            resourceType: 'Problem Set',
            url: 'http://localhost:5173/problems',
            description: 'Warm-up implementation problem.'
          }
        });
      } else if (dt.type === DayType.Contest) {
        await prisma.dayResource.create({
          data: {
            dayId: day.id,
            title: 'Live Weekly Contest Arena',
            resourceType: 'Contest Link',
            url: 'http://localhost:5173/contests',
            description: 'Link to join the weekly division arena.'
          }
        });
      }

      // If requested, mark as completed for Student 1 (Rahat Khan)
      if (isCompletedForStudent) {
        await prisma.studentProgress.create({
          data: {
            studentId: student1Id,
            dayId: day.id,
            weekId,
            phaseId: phase1.id,
            completed: true
          }
        });
      }
    }
  };

  // Seed Week 1 (Completed for Student 1)
  console.log('  Seeding Week 1 sessions (completed by Rahat)...');
  const w1Start = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  await seedWeekDays(p1w1.id, w1Start, true);

  // Seed Week 2 (Not completed yet)
  console.log('  Seeding Week 2 sessions (upcoming/active)...');
  await seedWeekDays(p1w2.id, now, false);

  // Mark student 1's progress status in profile
  await prisma.profile.update({
    where: { id: student1Id },
    data: {
      currentPhase: 'Phase 1: Basic Programming Paradigms',
      currentWeek: 1,
      currentDay: 7,
      status: 'Active',
      batch: '15th Batch'
    }
  });

  console.log('Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
