import { MutationUserUpdateArgs, User } from '@app/frontend/src/gql-generated/graphql';
import { InvocationContext } from '../invocationContext';
import { prisma } from '../prisma';
import { toUserSchema } from './mapping/toUserMapping';

export async function userUpdateResolver(
  _,
  { id }: MutationUserUpdateArgs,
  { identity }: InvocationContext
): Promise<User> {
  const user = await prisma.user.update({
    where: { id },
    data: {}
  });

  return toUserSchema(user);
}
