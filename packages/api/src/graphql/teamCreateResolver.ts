import { MutationTeamCreateArgs, Team } from '@app/frontend/src/gql-generated/graphql';
import { uuid } from '../helpers';
import { InvocationContext } from '../invocationContext';
import { prisma } from '../prisma';
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
            isOwner: true
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

  return toTeamSchema(team);
}
