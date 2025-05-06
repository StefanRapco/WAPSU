import { TeamManyFilterInput, Team as TeamSchema } from '@app/frontend/src/gql-generated/graphql';
import { Prisma, Team } from '@prisma/client';
import { InvocationContext } from '../../invocationContext';
import { prisma } from '../../prisma';
import { toUserSchema } from './toUserMapping';

export function toTeamSchema(props: Team): TeamSchema {
  return {
    id: props.id,
    name: props.name,
    avatar: props.avatar,
    createdAt: props.createdAt,
    // @ts-expect-error
    users: async () => {
      const users = await prisma.user.findMany({
        where: {
          teams: { some: { teamId: props.id } }
        }
      });

      return users.map(toUserSchema);
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

  return conditions;
}
