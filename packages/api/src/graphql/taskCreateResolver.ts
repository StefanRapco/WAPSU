import { MutationTaskCreateArgs, Task } from '@app/frontend/src/gql-generated/graphql';
import { uuid } from '../helpers';
import { InvocationContext } from '../invocationContext';
import { prisma } from '../prisma';
import { toTaskSchema } from './mapping/toTaskMapping';

export async function taskCreateResolver(
  _,
  { input }: MutationTaskCreateArgs,
  { identity }: InvocationContext
): Promise<Task> {
  const { name, bucketId, userId, teamId } = input;

  if (userId == null && teamId == null) throw new Error('Either userId or teamId must be provided');

  if (userId != null && teamId != null) throw new Error('Cannot provide both userId and teamId');

  const bucket = await prisma.bucket.findUniqueOrThrow({
    where: { id: bucketId },
    select: { tasks: true }
  });

  const task = await prisma.task.create({
    data: {
      id: uuid(),
      name,
      sortOrder: bucket.tasks.length,
      bucketId
    },
    include: {
      assignees: true,
      comments: true,
      checklist: true
    }
  });

  return toTaskSchema(task);
}
