import { faker } from '@faker-js/faker';
import { uuid } from '../src/helpers';
import { Prisma, prisma } from '../src/prisma';

const teamAvatars = [
  'adrian',
  'aidan',
  'alexander',
  'chase',
  'christopher',
  'eden',
  'eliza',
  'jameson',
  'jessica',
  'jocelyn',
  'key',
  'kingston',
  'leah',
  'liam',
  'lighting',
  'mackanzie',
  'maria',
  'nolan',
  'robert',
  'ryan',
  'ryker'
] as const;

export async function seedRandomTeams(count = 10) {
  console.info('🌱 Seeding random teams...');

  const users = await prisma.user.findMany();

  if (users.length === 0) throw new Error('❌ No users found. Please seed users first.');

  const teams: Prisma.TeamCreateInput[] = Array.from({ length: count }, () => {
    const teamName = faker.company.name();

    const numMembers = faker.number.int({ min: 2, max: 5 });
    const teamMembers = faker.helpers.arrayElements(users, numMembers);

    const avatar = faker.helpers.arrayElement(teamAvatars);

    return {
      id: uuid(),
      name: teamName,
      avatar,
      createdAt: new Date(),
      users: {
        create: teamMembers.map((user, index) => ({
          userId: user.id,
          isOwner: index === 0,
          teamRole: index === 0 ? 'owner' : 'member',
          joinedAt: new Date()
        }))
      }
    };
  });

  try {
    for (const team of teams) {
      await prisma.team.create({
        data: team
      });
    }

    console.info(`✅ Successfully seeded ${teams.length} random teams`);
  } catch (error) {
    console.error('❌ Error seeding random teams:', error);
  } finally {
    await prisma.$disconnect();
  }
}
