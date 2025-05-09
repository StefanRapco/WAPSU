import {
  MutationTeamUserEditArgs,
  Team,
  TeamUserEditAction
} from '@app/frontend/src/gql-generated/graphql';
import { TeamRole } from '@prisma/client';
import { InvocationContext } from '../invocationContext';
import { prisma } from '../prisma';
import { toTeamSchema } from './mapping/toTeamMapping';

export async function teamUserEditResolver(
  _,
  { input }: MutationTeamUserEditArgs,
  { identity }: InvocationContext
): Promise<Team> {
  const currentUser = await prisma.user.findUniqueOrThrow({
    where: { id: identity.id }
  });

  // System admins can perform any team user management action
  if (currentUser.systemRole !== 'admin') {
    const currentUserOnTeam = await prisma.userOnTeam.findUniqueOrThrow({
      where: { userId_teamId: { userId: identity.id, teamId: input.teamId } }
    });

    const targetUserOnTeam = await prisma.userOnTeam.findUniqueOrThrow({
      where: { userId_teamId: { userId: input.userId, teamId: input.teamId } }
    });

    if (currentUserOnTeam.teamRole === TeamRole.member)
      throw new Error('You do not have permission to modify team members');

    if (currentUserOnTeam.teamRole === TeamRole.ambassador) {
      if (
        input.action === TeamUserEditAction.Upgrade &&
        targetUserOnTeam.teamRole !== TeamRole.member
      )
        throw new Error('Ambassadors can only upgrade members to ambassador role');

      if (input.action === TeamUserEditAction.Downgrade && input.userId !== identity.id)
        throw new Error('Ambassadors can only downgrade themselves');

      if (
        input.action === TeamUserEditAction.Remove &&
        (targetUserOnTeam.teamRole === TeamRole.owner ||
          (targetUserOnTeam.teamRole === TeamRole.ambassador && input.userId !== identity.id))
      )
        throw new Error('Ambassadors can only remove themselves and members');
    }

    let newRole: TeamRole | undefined;

    if (input.action === TeamUserEditAction.Upgrade) {
      if (targetUserOnTeam.teamRole === TeamRole.member) newRole = TeamRole.ambassador;
      else if (
        targetUserOnTeam.teamRole === TeamRole.ambassador &&
        currentUserOnTeam.teamRole === TeamRole.owner
      )
        newRole = TeamRole.owner;
    } else if (input.action === TeamUserEditAction.Downgrade) {
      if (targetUserOnTeam.teamRole === TeamRole.ambassador) newRole = TeamRole.member;
      else if (targetUserOnTeam.teamRole === TeamRole.owner) newRole = TeamRole.ambassador;
    }

    const team = await prisma.team.update({
      where: { id: input.teamId },
      data: {
        users: {
          ...(input.action === TeamUserEditAction.Remove
            ? {
                delete: {
                  userId_teamId: {
                    userId: input.userId,
                    teamId: input.teamId
                  }
                }
              }
            : {
                update: {
                  where: {
                    userId_teamId: {
                      userId: input.userId,
                      teamId: input.teamId
                    }
                  },
                  data: {
                    teamRole: newRole
                  }
                }
              })
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

  let newRole: TeamRole | undefined;

  if (input.action === TeamUserEditAction.Upgrade) {
    const targetUserOnTeam = await prisma.userOnTeam.findUniqueOrThrow({
      where: { userId_teamId: { userId: input.userId, teamId: input.teamId } }
    });
    if (targetUserOnTeam.teamRole === TeamRole.member) newRole = TeamRole.ambassador;
    else if (targetUserOnTeam.teamRole === TeamRole.ambassador) newRole = TeamRole.owner;
  } else if (input.action === TeamUserEditAction.Downgrade) {
    const targetUserOnTeam = await prisma.userOnTeam.findUniqueOrThrow({
      where: { userId_teamId: { userId: input.userId, teamId: input.teamId } }
    });
    if (targetUserOnTeam.teamRole === TeamRole.ambassador) newRole = TeamRole.member;
    else if (targetUserOnTeam.teamRole === TeamRole.owner) newRole = TeamRole.ambassador;
  }

  const team = await prisma.team.update({
    where: { id: input.teamId },
    data: {
      users: {
        ...(input.action === TeamUserEditAction.Remove
          ? {
              delete: {
                userId_teamId: {
                  userId: input.userId,
                  teamId: input.teamId
                }
              }
            }
          : {
              update: {
                where: {
                  userId_teamId: {
                    userId: input.userId,
                    teamId: input.teamId
                  }
                },
                data: {
                  teamRole: newRole
                }
              }
            })
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
