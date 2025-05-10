import { MutationUserInviteArgs, User } from '@app/frontend/src/gql-generated/graphql';
import { sendEmail } from '../email/email';
import { userInviteEmail } from '../email/userInvite';
import { uuid } from '../helpers';
import { InvocationContext } from '../invocationContext';
import { prisma } from '../prisma';
import { toUserSchema } from './mapping/toUserMapping';

export async function userInviteResolver(
  _,
  { input }: MutationUserInviteArgs,
  { identity }: InvocationContext
): Promise<User> {
  const currentUser = await prisma.user.findUniqueOrThrow({
    where: { id: identity.id }
  });

  if (currentUser.systemRole !== 'admin') throw new Error('Only admins can invite users');

  // Check if user with this email already exists
  const existingUser = await prisma.user.findUnique({
    where: { email: input.email.toLowerCase() }
  });

  if (existingUser) throw new Error('User with this email already exists');

  const user = await prisma.user.create({
    data: {
      id: uuid(),
      email: input.email.toLowerCase(),
      firstName: input.firstName,
      lastName: input.lastName,
      status: 'invited'
    }
  });

  await sendEmail({
    htmlContent: userInviteEmail({ userFirstName: user.firstName }),
    subject: 'Welcome to DoSync!',
    to: [user.email]
  });

  return toUserSchema(user);
}
