import { MutationUserRoleUpdateArgs, User } from '@app/frontend/src/gql-generated/graphql';
import { InvocationContext } from '../invocationContext';
import { prisma } from '../prisma';
import { toUserSchema } from './mapping/toUserMapping';

export async function userRoleUpdateResolver(
  _,
  { input }: MutationUserRoleUpdateArgs,
  { identity }: InvocationContext
): Promise<User> {
  const currentUser = await prisma.user.findUniqueOrThrow({
    where: { id: identity.id }
  });

  if (currentUser.systemRole !== 'admin') throw new Error('Only admins can update user roles');

  const targetUser = await prisma.user.findUniqueOrThrow({
    where: { id: input.userId }
  });

  if (input.systemRole === 'user' && targetUser.systemRole === 'admin') {
    const adminCount = await prisma.user.count({
      where: { systemRole: 'admin' }
    });

    if (adminCount <= 1) {
      throw new Error('Cannot downgrade the last admin in the system');
    }
  }

  const user = await prisma.user.update({
    where: { id: input.userId },
    data: { systemRole: input.systemRole }
  });

  return toUserSchema(user);
}
