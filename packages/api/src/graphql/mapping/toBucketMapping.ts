import {
  BucketManyFilterInput,
  Bucket as BucketSchema
} from '@app/frontend/src/gql-generated/graphql';
import { Bucket, Prisma } from '@prisma/client';
import { InvocationContext } from '../../invocationContext';
import { prisma } from '../../prisma';
import { toTaskSchema } from './toTaskMapping';
import { toTeamSchema } from './toTeamMapping';
import { toUserSchema } from './toUserMapping';

export function toBucketSchema(props: Bucket): BucketSchema {
  return {
    id: props.id,
    name: props.name,
    sortOrder: props.sortOrder,
    // @ts-expect-error
    team: async () => {
      if (props.teamId == null) return null;
      const team = await prisma.team.findUniqueOrThrow({
        where: { id: props.teamId }
      });
      return toTeamSchema(team);
    },
    // @ts-expect-error
    user: async () => {
      if (props.userId == null) return null;
      const user = await prisma.user.findUniqueOrThrow({
        where: { id: props.userId }
      });
      return toUserSchema(user);
    },
    // @ts-expect-error
    tasks: async () => {
      const tasks = await prisma.task.findMany({
        where: { bucketId: props.id },
        include: {
          assignees: true,
          comments: true,
          checklist: true
        },
        orderBy: { sortOrder: 'asc' }
      });
      return tasks.map(toTaskSchema);
    }
  };
}

export function toBucketWhere({
  input: filter,
  identity
}: {
  input: BucketManyFilterInput | undefined | null;
  identity: InvocationContext['identity'];
}): Prisma.BucketWhereInput[] {
  const conditions: Prisma.BucketWhereInput[] = new Array();

  if (filter == null) return conditions;

  if (filter.teamId) conditions.push({ teamId: filter.teamId });

  if (filter.userId) conditions.push({ userId: filter.userId });

  return conditions;
}
