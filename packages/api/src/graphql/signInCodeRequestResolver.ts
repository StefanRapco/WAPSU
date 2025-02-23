import { MutationSignInCodeRequestArgs } from '@app/frontend/src/gql-generated/graphql';
import { generateNumericCode, getUserIdByEmail, hashPassword } from '../auth';
import { prisma } from '../prisma';

export async function signInCodeRequestResolver(
  _,
  { input }: MutationSignInCodeRequestArgs
): Promise<void> {
  const email = input.email.toLocaleLowerCase();
  const { id } = await getUserIdByEmail(email);

  const code = generateNumericCode(6);
  const mfa = await hashPassword(code);

  console.info(code);

  await prisma.user.update({ where: { id }, data: { mfa } });

  // await sendEmail({
  //   htmlContent: codeSignInEmail({ code }),
  //   subject: 'DoSync sign in request',
  //   to: [email]
  // });
}
