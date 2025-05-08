import { MutationTaskCommentCreateArgs, Task } from '@app/frontend/src/gql-generated/graphql';
import { uuid } from '../helpers';
import { InvocationContext } from '../invocationContext';
import { prisma } from '../prisma';
import { toTaskSchema } from './mapping/toTaskMapping';

export async function taskCommentCreateResolver(
  _,
  { input }: MutationTaskCommentCreateArgs,
  { identity }: InvocationContext
): Promise<Task> {
  const { content, taskId } = input;

  const comment = await prisma.taskComment.create({
    data: {
      id: uuid(),
      content,
      taskId,
      authorId: identity.id,
      isEdited: false
    },
    select: { task: true }
  });

  return toTaskSchema(comment.task);
}
