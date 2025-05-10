import { MutationUserInviteResendArgs } from '@app/frontend/src/gql-generated/graphql';
import { sendEmail } from '../email/email';
import { userInviteEmail } from '../email/userInvite';
import { InvocationContext } from '../invocationContext';
import { prisma } from '../prisma';

export async function userInviteResendResolver(
  _,
  { input }: MutationUserInviteResendArgs,
  { identity }: InvocationContext
): Promise<void> {
  const currentUser = await prisma.user.findUniqueOrThrow({
    where: { id: identity.id }
  });

  if (currentUser.systemRole !== 'admin') throw new Error('Only admins can resend invitations');

  const user = await prisma.user.findUniqueOrThrow({
    where: { id: input.userId },
    select: { email: true, status: true, firstName: true }
  });

  if (user.status !== 'invited') throw new Error('User is not in invited status');

  await sendEmail({
    htmlContent: userInviteEmail({ userFirstName: user.firstName }),
    subject: 'Welcome to DoSync!',
    to: [user.email]
  });
}
