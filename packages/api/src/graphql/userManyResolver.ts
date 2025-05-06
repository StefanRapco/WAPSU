import { QueryUserManyArgs, UserManyOutput } from '@app/frontend/src/gql-generated/graphql';
import { InvocationContext } from '../invocationContext';
import { prisma } from '../prisma';
import { toUserSchema, toUserWhere } from './mapping/toUserMapping';

export async function userManyResolver(
  _,
  { input }: QueryUserManyArgs,
  { identity }: InvocationContext
): Promise<UserManyOutput> {
  const page = input?.page ?? { page: 0, pageSize: 5 };

  const where = toUserWhere({ input: input?.filter, identity });

  const total = await prisma.user.count({
    where: { AND: where }
  });

  const users = await prisma.user.findMany({
    where: { AND: where },
    skip: page.page * page.pageSize,
    take: page.pageSize + 1, // Take one extra to check if there are more
    orderBy: { firstName: 'asc' }
  });

  const hasMore = users.length > page.pageSize;
  const items = users.slice(0, page.pageSize).map(toUserSchema);

  return {
    items,
    total,
    hasMore
  };
}
