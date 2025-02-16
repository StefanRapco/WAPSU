import { QueryUserOneArgs, User } from '@app/frontend/src/gql-generated/graphql';
import { InvocationContext } from '../invocationContext';
import { prisma } from '../prisma';
import { toUserSchema } from './mapping/toUserMapping';

export async function userOneResolver(
  _,
  { id }: QueryUserOneArgs,
  { identity, response }: InvocationContext
): Promise<User> {
  const user = await prisma.user.findUniqueOrThrow({
    where: { id }
  });

  return toUserSchema(user);
}
