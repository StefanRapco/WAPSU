import { QueryTeamOneArgs, Team } from '@app/frontend/src/gql-generated/graphql';
import { InvocationContext } from '../invocationContext';
import { prisma } from '../prisma';
import { toTeamSchema } from './mapping/toTeamMapping';

export async function teamOneResolver(
  _,
  { id }: QueryTeamOneArgs,
  { identity }: InvocationContext
): Promise<Team> {
  const team = await prisma.team.findUniqueOrThrow({
    where: { id }
  });

  return toTeamSchema(team);
}
