import { Bucket, MutationBucketCreateArgs } from '@app/frontend/src/gql-generated/graphql';
import { uuid } from '../helpers';
import { InvocationContext } from '../invocationContext';
import { prisma } from '../prisma';
import { toBucketSchema } from './mapping/toBucketMapping';

export async function bucketCreateResolver(
  _,
  { input }: MutationBucketCreateArgs,
  { identity }: InvocationContext
): Promise<Bucket> {
  const { name, teamId, userId } = input;

  if (teamId == null && userId == null) throw new Error('Either teamId or userId must be provided');

  if (teamId != null && userId != null) throw new Error('Cannot provide both teamId and userId');

  const buckets = await (async () => {
    if (userId != null) return prisma.bucket.findMany({ where: { userId } });
    if (teamId != null) return prisma.bucket.findMany({ where: { teamId } });

    throw new Error('Either userId or teamId must be provided');
  })();

  const bucket = await prisma.bucket.create({
    data: {
      id: uuid(),
      name,
      sortOrder: buckets.length,
      ...(teamId != null ? { teamId } : {}),
      ...(userId != null ? { userId } : {})
    },
    include: {
      team: true,
      user: true,
      tasks: {
        include: {
          assignees: true,
          tags: true,
          comments: true,
          checklist: true
        },
        orderBy: { sortOrder: 'asc' }
      }
    }
  });

  return toBucketSchema(bucket);
}
