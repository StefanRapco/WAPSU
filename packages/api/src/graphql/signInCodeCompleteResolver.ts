import { MutationSignInCodeCompleteArgs } from '@app/frontend/src/gql-generated/graphql';
import { Response } from 'express';
import { generateToken, setAuthCookie } from '../auth';
import { prisma } from '../prisma';

export async function signInCodeCompleteResolver(
  _,
  { input }: MutationSignInCodeCompleteArgs,
  { res }: { res: Response }
): Promise<void> {
  const email = input.email.toLocaleLowerCase();

  const user = await prisma.user.findUniqueOrThrow({
    where: { email }
  });

  // clearAuthCookie(response);

  // const token = generateToken({
  //   id: user.id,
  //   email: user.email,
  //   fullName: `${user.firstName} ${user.lastName}`
  // });

  // setAuthCookie(response, token);

  // const token = generateToken(user.id);
  // setAuthCookie(res, token);
  // console.log(await isCorrectPassword('Password123!', user.password));

  // await sendEmail({
  //   htmlContent: codeSignInEmail({ code: '42134' }),
  //   subject: 'SignInCodeTest',
  //   to: ['stefanrapco@gmail.com']
  // });

  const token = generateToken({
    id: user.id,
    email: user.email,
    fullName: `${user.firstName} ${user.lastName}`
  });

  setAuthCookie(res, token);
}
