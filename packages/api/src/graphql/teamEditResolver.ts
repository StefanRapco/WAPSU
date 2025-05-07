import { MutationTeamEditArgs, Team } from '@app/frontend/src/gql-generated/graphql';
import { InvocationContext } from '../invocationContext';
import { prisma } from '../prisma';
import { toTeamSchema } from './mapping/toTeamMapping';

export async function teamEditResolver(
  _,
  { input }: MutationTeamEditArgs,
  { identity }: InvocationContext
): Promise<Team> {
  const currentUser = await prisma.user.findUniqueOrThrow({
    where: { id: identity.id }
  });

  if (currentUser.systemRole !== 'admin') {
    const userOnTeam = await prisma.userOnTeam.findUniqueOrThrow({
      where: { userId_teamId: { userId: identity.id, teamId: input.teamId } }
    });

    if (userOnTeam.teamRole !== 'owner' && userOnTeam.teamRole !== 'ambassador')
      throw new Error('You do not have permission to edit this team');
  }

  const team = await prisma.team.update({
    where: { id: input.teamId },
    data: {
      name: input.name ?? undefined,
      description: input.description,
      avatar: input.avatar ?? undefined
    },
    include: {
      users: {
        include: {
          user: true
        }
      }
    }
  });

  return toTeamSchema(team);
}
