import { MutationUserUpdateArgs, User } from '@app/frontend/src/gql-generated/graphql';
import { InvocationContext } from '../invocationContext';
import { prisma } from '../prisma';
import { toUserSchema } from './mapping/toUserMapping';

export async function userUpdateResolver(
  _,
  { input }: MutationUserUpdateArgs,
  { identity }: InvocationContext
): Promise<User> {
  const user = await prisma.user.update({
    where: { id: input.id },
    data: {
      firstName: input.firstName ?? undefined,
      lastName: input.lastName ?? undefined,
      title: input.title ?? undefined,
      phoneNumber: input.phoneNumber ?? undefined,
      address: input.address ?? undefined
    }
  });

  return toUserSchema(user);
}
