import { faker } from '@faker-js/faker';
import { TaskPriority, TaskProgress } from '@prisma/client';
import { uuid } from '../src/helpers';
import { prisma } from '../src/prisma';

export async function seedRandomTasksInTeams(count = 50) {
  console.info('🌱 Seeding random tasks in teams...');

  // Get all teams
  const teams = await prisma.team.findMany({
    include: {
      buckets: true,
      users: {
        include: {
          user: true
        }
      }
    }
  });

  if (teams.length === 0) throw new Error('❌ No teams found. Please seed teams first.');

  // For each team, create random tasks
  for (const team of teams) {
    if (team.buckets.length === 0) {
      console.warn(`⚠️ No buckets found for team ${team.name}. Skipping...`);
      continue;
    }

    const teamMembers = team.users.map(u => u.user);
    if (teamMembers.length === 0) {
      console.warn(`⚠️ No members found for team ${team.name}. Skipping...`);
      continue;
    }

    // Create tasks for each bucket in the team
    for (const bucket of team.buckets) {
      const tasksToCreate = Math.floor(count / team.buckets.length);

      for (let i = 0; i < tasksToCreate; i++) {
        const taskName = faker.company.catchPhrase();
        const taskNotes = faker.lorem.paragraph();

        // Random dates
        const startDate = faker.date.past();
        const dueDate = faker.date.future({ refDate: startDate });

        // Random progress and priority
        const progress = faker.helpers.arrayElement(Object.values(TaskProgress));
        const priority = faker.helpers.arrayElement(Object.values(TaskPriority));

        // Random number of assignees (1-3)
        const numAssignees = faker.number.int({ min: 1, max: Math.min(3, teamMembers.length) });
        const assignees = faker.helpers.arrayElements(teamMembers, numAssignees);

        // Create the task
        const task = await prisma.task.create({
          data: {
            id: uuid(),
            name: taskName,
            notes: taskNotes,
            startDate,
            dueDate,
            sortOrder: i,
            progress,
            priority,
            bucketId: bucket.id,
            assignees: {
              connect: assignees.map(a => ({ id: a.id }))
            }
          }
        });

        // Add random number of checklist items (2-5)
        const numChecklistItems = faker.number.int({ min: 2, max: 5 });
        for (let j = 0; j < numChecklistItems; j++) {
          await prisma.taskChecklist.create({
            data: {
              id: uuid(),
              name: faker.lorem.sentence(),
              sortOrder: j,
              completed: faker.datatype.boolean(),
              taskId: task.id
            }
          });
        }

        // Add random number of comments (1-3)
        const numComments = faker.number.int({ min: 1, max: 3 });
        for (let j = 0; j < numComments; j++) {
          const commentAuthor = faker.helpers.arrayElement(teamMembers);
          await prisma.taskComment.create({
            data: {
              id: uuid(),
              content: faker.lorem.paragraph(),
              isEdited: faker.datatype.boolean(),
              taskId: task.id,
              authorId: commentAuthor.id
            }
          });
        }
      }
    }
  }

  console.info('✅ Successfully seeded random tasks in teams');
  await prisma.$disconnect();
}
