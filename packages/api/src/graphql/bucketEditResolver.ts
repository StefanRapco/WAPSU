import { Bucket, MutationBucketEditArgs } from '@app/frontend/src/gql-generated/graphql';
import { InvocationContext } from '../invocationContext';
import { prisma } from '../prisma';
import { toBucketSchema } from './mapping/toBucketMapping';

export async function bucketEditResolver(
  _,
  { input }: MutationBucketEditArgs,
  { identity }: InvocationContext
): Promise<Bucket> {
  const { id, name, sortOrder } = input;

  await handleSortOrder(id, sortOrder);

  const bucket = await prisma.bucket.update({
    where: { id },
    data: {
      name: name ?? undefined
    },
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

  return toBucketSchema(bucket);
}

async function handleSortOrder(bucketId: string, sortOrder: number | null | undefined) {
  const bucket = await prisma.bucket.findUniqueOrThrow({
    where: { id: bucketId },
    select: { sortOrder: true, userId: true, teamId: true }
  });

  if (bucket.userId == null && bucket.teamId == null)
    throw new Error('Bucket is not associated with a user or team');

  if (bucket.userId != null && bucket.teamId != null)
    throw new Error('Bucket is associated with both a user and a team');

  if (sortOrder == null) return;

  if (bucket.sortOrder === sortOrder) return;

  // userId buckets
  if (bucket.userId != null) {
    // move right
    if (bucket.sortOrder < sortOrder)
      await prisma.bucket.updateMany({
        where: {
          userId: bucket.userId,
          sortOrder: {
            gt: bucket.sortOrder,
            lte: sortOrder
          }
        },
        data: {
          sortOrder: {
            decrement: 1
          }
        }
      });

    // move left
    if (bucket.sortOrder > sortOrder)
      await prisma.bucket.updateMany({
        where: {
          userId: bucket.userId,
          sortOrder: {
            lt: bucket.sortOrder,
            gte: sortOrder
          }
        },
        data: {
          sortOrder: {
            increment: 1
          }
        }
      });

    await prisma.bucket.update({
      where: { id: bucketId },
      data: { sortOrder }
    });

    return;
  }

  // teamId buckets
  if (bucket.teamId != null) {
    // move right
    if (bucket.sortOrder < sortOrder)
      await prisma.bucket.updateMany({
        where: {
          teamId: bucket.teamId,
          sortOrder: {
            gt: bucket.sortOrder,
            lte: sortOrder
          }
        },
        data: {
          sortOrder: {
            decrement: 1
          }
        }
      });

    // move left
    if (bucket.sortOrder > sortOrder)
      await prisma.bucket.updateMany({
        where: {
          teamId: bucket.teamId,
          sortOrder: {
            lt: bucket.sortOrder,
            gte: sortOrder
          }
        },
        data: {
          sortOrder: {
            increment: 1
          }
        }
      });

    await prisma.bucket.update({
      where: { id: bucketId },
      data: { sortOrder }
    });
  }
}
