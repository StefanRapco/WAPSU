import { MutationTeamCreateArgs, Team } from '@app/frontend/src/gql-generated/graphql';
import { sendEmail } from '../email/email';
import { teamInviteEmail } from '../email/teamInvite';
import { uuid } from '../helpers';
import { InvocationContext } from '../invocationContext';
import { prisma, TeamRole } from '../prisma';
import { toTeamSchema } from './mapping/toTeamMapping';

export async function teamCreateResolver(
  _,
  { input }: MutationTeamCreateArgs,
  { identity }: InvocationContext
): Promise<Team> {
  const team = await prisma.team.create({
    data: {
      id: uuid(),
      name: input.name,
      avatar: input.avatar,
      users: {
        create: [
          {
            userId: identity.id,
            isOwner: true,
            teamRole: TeamRole.owner
          },
          ...(input.userIds?.map(userId => ({
            userId
          })) ?? [])
        ]
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

  const users = await prisma.user.findMany({
    where: {
      id: {
        in: input.userIds ?? []
      }
    },
    select: {
      teamNotifications: true,
      email: true,
      firstName: true
    }
  });

  const toNotify = users.filter(user => user.teamNotifications);

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
