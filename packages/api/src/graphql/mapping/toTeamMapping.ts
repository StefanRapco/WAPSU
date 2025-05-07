import { TeamManyFilterInput, Team as TeamSchema } from '@app/frontend/src/gql-generated/graphql';
import { Prisma, Team } from '@prisma/client';
import { InvocationContext } from '../../invocationContext';
import { prisma } from '../../prisma';
import { prettifySystemRole, prettifyTeamRole, toUserFullName } from './toUserMapping';

export function toTeamSchema(props: Team): TeamSchema {
  return {
    id: props.id,
    name: props.name,
    description: props.description,
    avatar: props.avatar,
    createdAt: props.createdAt,
    // @ts-expect-error
    users: async (_, { identity }: InvocationContext, { variableValues }: any) => {
      const page = variableValues.input.page ?? { page: 0, pageSize: 5 };

      const where: Prisma.UserWhereInput[] = new Array();

      where.push({ teams: { some: { teamId: props.id } } });

      if (
        variableValues.input.filter != null &&
        variableValues.input.filter.term != null &&
        variableValues.input.filter.term.length > 0
      )
        where.push({
          OR: [
            { firstName: { contains: variableValues.input.filter.term } },
            { lastName: { contains: variableValues.input.filter.term } },
            { email: { contains: variableValues.input.filter.term } }
          ]
        });

      const total = await prisma.user.count({
        where: { AND: where }
      });

      const users = await prisma.user.findMany({
        where: { AND: where },
        skip: page.page * page.pageSize,
        take: page.pageSize + 1,
        orderBy: { firstName: 'asc' }
      });

      const hasMore = users.length > page.pageSize;

      return {
        items: users.map(item => ({
          id: item.id,
          firstName: item.firstName,
          lastName: item.lastName,
          fullName: toUserFullName({ firstName: item.firstName, lastName: item.lastName }),
          email: item.email,
          teamRole: async () => {
            const teamRole = await prisma.userOnTeam.findUniqueOrThrow({
              where: { userId_teamId: { userId: item.id, teamId: props.id } },
              select: { teamRole: true }
            });

            return { label: prettifyTeamRole(teamRole.teamRole), value: teamRole.teamRole };
          },
          systemRole: { label: prettifySystemRole(item.systemRole), value: item.systemRole }
        })),
        total,
        hasMore
      };
    }
  };
}

export function toTeamWhere({
  input: filter,
  identity
}: {
  input: TeamManyFilterInput | undefined | null;
  identity: InvocationContext['identity'];
}): Prisma.TeamWhereInput[] {
  const conditions: Prisma.TeamWhereInput[] = new Array();

  if (filter == null) return conditions;

  if (filter.term != null && filter.term.length > 0) {
    conditions.push({
      OR: [{ name: { contains: filter.term } }]
    });
  }

  if (filter.userId != null && filter.userId.length > 0) {
    conditions.push({
      users: { some: { userId: { in: filter.userId } } }
    });
  }

  return conditions;
}
