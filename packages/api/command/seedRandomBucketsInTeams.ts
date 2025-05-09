import { faker } from '@faker-js/faker';
import { uuid } from '../src/helpers';
import { prisma } from '../src/prisma';

// Common bucket names that make sense in a task management context
const DEFAULT_BUCKET_NAMES = [
  'To Do',
  'In Progress',
  'Review',
  'Done',
  'Backlog',
  'Planning',
  'Blocked',
  'Testing',
  'Deployment',
  'Documentation'
];

export async function seedRandomBucketsInTeams(count = 5) {
  console.info('🌱 Seeding random buckets in teams...');

  // Get all teams
  const teams = await prisma.team.findMany();

  if (teams.length === 0) throw new Error('❌ No teams found. Please seed teams first.');

  // For each team, create random buckets
  for (const team of teams) {
    // First, create default buckets
    for (let i = 0; i < Math.min(DEFAULT_BUCKET_NAMES.length, count); i++) {
      await prisma.bucket.create({
        data: {
          id: uuid(),
          name: DEFAULT_BUCKET_NAMES[i],
          sortOrder: i,
          teamId: team.id
        }
      });
    }

    // If we need more buckets than default names, create random ones
    if (count > DEFAULT_BUCKET_NAMES.length) {
      const remainingCount = count - DEFAULT_BUCKET_NAMES.length;

      for (let i = 0; i < remainingCount; i++) {
        const bucketName = faker.helpers.arrayElement([
          faker.company.buzzPhrase(),
          faker.commerce.department(),
          faker.helpers.arrayElement([
            'Sprint Goals',
            'Feature Requests',
            'Bug Fixes',
            'Enhancements',
            'Research',
            'Design',
            'QA',
            'Production',
            'Staging',
            'Development'
          ])
        ]);

        await prisma.bucket.create({
          data: {
            id: uuid(),
            name: bucketName,
            sortOrder: DEFAULT_BUCKET_NAMES.length + i,
            teamId: team.id
          }
        });
      }
    }
  }

  console.info('✅ Successfully seeded random buckets in teams');
  await prisma.$disconnect();
}
