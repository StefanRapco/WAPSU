import { MutationTeamUserAddArgs, Team } from '@app/frontend/src/gql-generated/graphql';
import { TeamRole } from '@prisma/client';
import { sendEmail } from '../email/email';
import { teamInviteEmail } from '../email/teamInvite';
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

  // Send notifications to users who have team notifications enabled
  const usersToNotify = await prisma.user.findMany({
    where: {
      id: {
        in: input.userIds
      },
      teamNotifications: true
    },
    select: {
      email: true,
      firstName: true,
      teamNotifications: true
    }
  });

  const toNotify = usersToNotify.filter(user => user.teamNotifications);

  for (const user of toNotify) {
    await sendEmail({
      to: [user.email],
      subject: 'You have been added to a team',
      htmlContent: teamInviteEmail({
        userFirstName: user.firstName,
        teamName: team.name
      })
    });
  }

  return toTeamSchema(team);
}
