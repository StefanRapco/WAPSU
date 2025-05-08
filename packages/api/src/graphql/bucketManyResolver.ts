import { BucketManyOutput, QueryBucketManyArgs } from '@app/frontend/src/gql-generated/graphql';
import { InvocationContext } from '../invocationContext';
import { prisma } from '../prisma';
import { toBucketSchema, toBucketWhere } from './mapping/toBucketMapping';

export async function bucketManyResolver(
  _,
  { input }: QueryBucketManyArgs,
  { identity }: InvocationContext
): Promise<BucketManyOutput> {
  const where = toBucketWhere({ input: input?.filter, identity });

  const buckets = await prisma.bucket.findMany({
    where: { AND: where },
    orderBy: { sortOrder: 'asc' },
    include: {
      team: true,
      user: true,
      tasks: {
        include: {
          assignees: true,
          comments: true,
          checklist: true
        },
        orderBy: { sortOrder: 'asc' }
      }
    }
  });

  return {
    items: buckets.map(toBucketSchema),
    total: buckets.length,
    hasMore: false
  };
}
