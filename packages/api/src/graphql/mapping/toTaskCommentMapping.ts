import { TaskComment as TaskCommentSchema } from '@app/frontend/src/gql-generated/graphql';
import { TaskComment } from '@prisma/client';
import { prisma } from '../../prisma';
import { toTaskSchema } from './toTaskMapping';
import { toUserSchema } from './toUserMapping';

export function toTaskCommentSchema(props: TaskComment): TaskCommentSchema {
  return {
    id: props.id,
    content: props.content,
    createdAt: props.createdAt,
    isEdited: props.isEdited,
    // @ts-expect-error
    task: async () => {
      const task = await prisma.task.findUniqueOrThrow({
        where: { id: props.taskId }
      });
      return toTaskSchema(task);
    },
    // @ts-expect-error
    author: async () => {
      const author = await prisma.user.findUniqueOrThrow({
        where: { id: props.authorId }
      });
      return toUserSchema(author);
    }
  };
}
