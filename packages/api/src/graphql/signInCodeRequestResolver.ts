import { MutationSignInCodeRequestArgs } from '@app/frontend/src/gql-generated/graphql';
import { generateNumericCode, getUserIdByEmail, hashPassword } from '../auth';
import { codeSignInEmail } from '../email/codeSignIn';
import { sendEmail } from '../email/email';
import { prisma } from '../prisma';

export async function signInCodeRequestResolver(
  _,
  { input }: MutationSignInCodeRequestArgs
): Promise<void> {
  const email = input.email.toLocaleLowerCase();
  const { id } = await getUserIdByEmail(email);

  const user = await prisma.user.findUniqueOrThrow({ where: { id }, select: { status: true } });

  if (user.status === 'archived') throw new Error('User is archived!');

  const code = generateNumericCode(6);
  const mfa = await hashPassword(code);

  console.info(code);

  await prisma.user.update({ where: { id }, data: { mfa } });

  await sendEmail({
    htmlContent: codeSignInEmail({ code }),
    subject: 'DoSync sign in request',
    to: [email]
  });
}
