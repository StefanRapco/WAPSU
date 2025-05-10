import { MutationUserArchiveArgs, User } from '@app/frontend/src/gql-generated/graphql';
import { sendEmail } from '../email/email';
import { userArchivedEmail } from '../email/userArchived';
import { InvocationContext } from '../invocationContext';
import { prisma } from '../prisma';
import { toUserSchema } from './mapping/toUserMapping';

export async function userArchiveResolver(
  _,
  { input }: MutationUserArchiveArgs,
  { identity }: InvocationContext
): Promise<User> {
  const currentUser = await prisma.user.findUniqueOrThrow({
    where: { id: identity.id }
  });

  if (currentUser.systemRole !== 'admin') throw new Error('Only admins can archive users');

  const targetUser = await prisma.user.findUniqueOrThrow({
    where: { id: input.userId }
  });

  if (targetUser.systemRole === 'admin') {
    const adminCount = await prisma.user.count({
      where: { systemRole: 'admin' }
    });

    if (adminCount <= 1) {
      throw new Error('Cannot archive the last admin in the system');
    }
  }

  const user = await prisma.user.update({
    where: { id: input.userId },
    data: { status: 'archived' }
  });

  await sendEmail({
    htmlContent: userArchivedEmail({ userFirstName: user.firstName }),
    subject: 'Your DoSync account has been archived',
    to: [user.email]
  });

  return toUserSchema(user);
}
