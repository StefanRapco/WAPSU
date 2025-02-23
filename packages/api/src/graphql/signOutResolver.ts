import { MutationSignOutArgs } from '@app/frontend/src/gql-generated/graphql';
import { clearAuthCookie, getUserIdByEmail } from '../auth';
import { InvocationContext } from '../invocationContext';

export async function signOutResolver(
  _,
  { input }: MutationSignOutArgs,
  { identity, response }: InvocationContext
): Promise<void> {
  const email = input.email.toLocaleLowerCase();
  await getUserIdByEmail(email);

  clearAuthCookie(response);
}
