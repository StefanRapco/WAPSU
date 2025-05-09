import { TaskManyFilterInput, Task as TaskSchema } from '@app/frontend/src/gql-generated/graphql';
import { Prisma, Task, TaskPriority, TaskProgress } from '@prisma/client';
import { InvocationContext } from '../../invocationContext';
import { prisma } from '../../prisma';
import { toBucketSchema } from './toBucketMapping';
import { toUserSchema } from './toUserMapping';

export function toTaskSchema(props: Task): TaskSchema {
  return {
    id: props.id,
    name: props.name,
    notes: props.notes,
    createdAt: props.createdAt,
    startDate: props.startDate,
    dueDate: props.dueDate,
    sortOrder: props.sortOrder,
    progress: { label: prettifyTaskProgress(props.progress), value: props.progress },
    priority: { label: prettifyTaskPriority(props.priority), value: props.priority },
    // @ts-expect-error
    assignees: async () => {
      const assignees = await prisma.user.findMany({
        where: { tasksAssignee: { some: { id: props.id } } }
      });
      return assignees.map(toUserSchema);
    },
    // @ts-expect-error
    comments: async () => {
      const comments = await prisma.taskComment.findMany({
        where: { taskId: props.id },
        orderBy: { createdAt: 'desc' },
        include: {
          author: true
        }
      });
      return comments.map(comment => ({
        id: comment.id,
        content: comment.content,
        createdAt: comment.createdAt,
        isEdited: comment.isEdited,
        task: toTaskSchema(props),
        author: toUserSchema(comment.author)
      }));
    },
    // @ts-expect-error
    checklist: async () => {
      const checklist = await prisma.taskChecklist.findMany({
        where: { taskId: props.id },
        orderBy: { sortOrder: 'asc' }
      });
      return checklist.map(item => ({
        id: item.id,
        name: item.name,
        createdAt: item.createdAt,
        completed: item.completed,
        sortOrder: item.sortOrder,
        task: toTaskSchema(props)
      }));
    },
    // @ts-expect-error
    bucket: async () => {
      const bucket = await prisma.bucket.findUniqueOrThrow({
        where: { id: props.bucketId }
      });
      return toBucketSchema(bucket);
    }
  };
}

export function toTaskWhere({
  input: filter,
  identity
}: {
  input: TaskManyFilterInput | undefined | null;
  identity: InvocationContext['identity'];
}): Prisma.TaskWhereInput[] {
  const conditions: Prisma.TaskWhereInput[] = new Array();

  if (filter == null) return conditions;

  if (filter.bucketId) conditions.push({ bucketId: filter.bucketId });

  if (filter.assigneeId) conditions.push({ assignees: { some: { id: filter.assigneeId } } });

  if (filter.progress && filter.progress.length > 0)
    conditions.push({ progress: { in: filter.progress } });

  if (filter.priority && filter.priority.length > 0)
    conditions.push({ priority: { in: filter.priority } });

  if (filter.term && filter.term.length > 0)
    conditions.push({
      OR: [{ name: { contains: filter.term } }, { notes: { contains: filter.term } }]
    });

  if (filter.userId) conditions.push({ bucket: { userId: filter.userId } });

  if (filter.teamId) conditions.push({ bucket: { teamId: filter.teamId } });

  return conditions;
}

export function prettifyTaskProgress(progress: TaskProgress) {
  if (progress === TaskProgress.notStarted) return 'Not Started';
  if (progress === TaskProgress.inProgress) return 'In Progress';
  if (progress === TaskProgress.completed) return 'Completed';

  throw new Error(`Unknown task progress: ${progress}`);
}

export function prettifyTaskPriority(priority: TaskPriority) {
  if (priority === TaskPriority.low) return 'Low';
  if (priority === TaskPriority.medium) return 'Medium';
  if (priority === TaskPriority.high) return 'High';
  if (priority === TaskPriority.urgent) return 'Urgent';

  throw new Error(`Unknown task priority: ${priority}`);
}
