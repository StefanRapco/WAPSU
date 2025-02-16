import { User } from '@app/frontend/src/gql-generated/graphql';
import { InvocationContext } from '../invocationContext';
import { prisma } from '../prisma';
import { toUserSchema } from './mapping/toUserMapping';

export async function identityResolver(
  _,
  __,
  { identity }: InvocationContext
): Promise<User | null> {
  if (identity == null) return null;

  const user = await prisma.user.findUniqueOrThrow({ where: { id: identity.id } });

  return toUserSchema(user);
}
