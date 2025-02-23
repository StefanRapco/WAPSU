import { MutationSignInCodeCompleteArgs } from '@app/frontend/src/gql-generated/graphql';
import { generateToken, isCorrectPassword, setAuthCookie } from '../auth';
import { InvocationContext } from '../invocationContext';
import { prisma } from '../prisma';

export async function signInCodeCompleteResolver(
  _,
  { input }: MutationSignInCodeCompleteArgs,
  { response }: InvocationContext
): Promise<void> {
  const email = input.email.toLocaleLowerCase();

  const user = await prisma.user.findUniqueOrThrow({
    where: { email },
    select: { mfa: true, id: true, email: true, firstName: true, lastName: true }
  });

  if (user.mfa == null) throw new Error("User MFA can't be null when signing in with code");

  const isPasswordCorrect = await isCorrectPassword(input.code, user.mfa);

  if (!isPasswordCorrect) throw new Error('Code is not correct');

  await prisma.user.update({ where: { id: user.id }, data: { mfa: null } });

  const token = generateToken({
    id: user.id,
    email: user.email,
    fullName: `${user.firstName} ${user.lastName}`
  });

  setAuthCookie(response, token);
}
