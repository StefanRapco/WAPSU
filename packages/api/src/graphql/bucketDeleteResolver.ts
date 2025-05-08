import { MutationBucketDeleteArgs } from '@app/frontend/src/gql-generated/graphql';
import { InvocationContext } from '../invocationContext';
import { prisma } from '../prisma';

export async function bucketDeleteResolver(
  _,
  { input }: MutationBucketDeleteArgs,
  { identity }: InvocationContext
): Promise<void> {
  const { id } = input;

  // Get the bucket to find its sort order
  const bucket = await prisma.bucket.findUniqueOrThrow({
    where: { id },
    select: { sortOrder: true, userId: true, teamId: true }
  });

  // Delete all tasks in the bucket first (this will cascade delete related items)
  await prisma.task.deleteMany({
    where: { bucketId: id }
  });

  // Delete the bucket
  await prisma.bucket.delete({
    where: { id }
  });

  // Update sort orders of remaining buckets
  if (bucket.userId != null) {
    await prisma.bucket.updateMany({
      where: {
        userId: bucket.userId,
        sortOrder: {
          gt: bucket.sortOrder
        }
      },
      data: {
        sortOrder: {
          decrement: 1
        }
      }
    });
  } else if (bucket.teamId != null) {
    await prisma.bucket.updateMany({
      where: {
        teamId: bucket.teamId,
        sortOrder: {
          gt: bucket.sortOrder
        }
      },
      data: {
        sortOrder: {
          decrement: 1
        }
      }
    });
  }
}
