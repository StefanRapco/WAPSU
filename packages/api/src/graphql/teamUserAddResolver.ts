import { MutationTeamUserAddArgs, Team } from '@app/frontend/src/gql-generated/graphql';
import { TeamRole } from '@prisma/client';
import { InvocationContext } from '../invocationContext';
import { prisma } from '../prisma';
import { toTeamSchema } from './mapping/toTeamMapping';

export async function teamUserAddResolver(
  _,
  { input }: MutationTeamUserAddArgs,
  { identity }: InvocationContext
): Promise<Team> {
  const currentUser = await prisma.user.findUniqueOrThrow({
    where: { id: identity.id }
  });

  if (currentUser.systemRole !== 'admin') {
    const userOnTeam = await prisma.userOnTeam.findUniqueOrThrow({
      where: { userId_teamId: { userId: identity.id, teamId: input.teamId } }
    });

    if (userOnTeam.teamRole === TeamRole.member)
      throw new Error('You do not have permission to add users to this team');
  }

  const team = await prisma.team.update({
    where: { id: input.teamId },
    data: {
      users: {
        create: input.userIds.map(userId => ({
          userId,
          teamRole: TeamRole.member
        }))
      }
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
