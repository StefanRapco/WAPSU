import { MutationSignInPasswordArgs } from '@app/frontend/src/gql-generated/graphql';
import { generateToken, isCorrectPassword, setAuthCookie } from '../auth';
import { InvocationContext } from '../invocationContext';
import { prisma } from '../prisma';

export async function signInPasswordResolver(
  _,
  { input }: MutationSignInPasswordArgs,
  { response }: InvocationContext
): Promise<void> {
  const email = input.email.toLocaleLowerCase();

  const user = await prisma.user.findUniqueOrThrow({
    where: { email },
    select: { id: true, email: true, firstName: true, lastName: true, password: true }
  });

  if (user.password == null)
    throw new Error('Your password is not set, please use the code method first.');

  const isPasswordCorrect = await isCorrectPassword(input.password, user.password);

  if (!isPasswordCorrect) throw new Error('Incorrect password!');

  const token = generateToken({
    id: user.id,
    email: user.email,
    fullName: `${user.firstName} ${user.lastName}`
  });

  setAuthCookie(response, token);
}
