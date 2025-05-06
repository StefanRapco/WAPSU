import { QueryTeamManyArgs, TeamManyOutput } from '@app/frontend/src/gql-generated/graphql';
import { InvocationContext } from '../invocationContext';
import { prisma } from '../prisma';
import { toTeamSchema, toTeamWhere } from './mapping/toTeamMapping';

export async function teamManyResolver(
  _,
  { input }: QueryTeamManyArgs,
  { identity }: InvocationContext
): Promise<TeamManyOutput> {
  const page = input?.page ?? { page: 0, pageSize: 5 };
  const where = toTeamWhere({ input: input?.filter, identity });

  const total = await prisma.team.count({
    where: { AND: where }
  });

  const teams = await prisma.team.findMany({
    where: { AND: where },
    skip: page.page * page.pageSize,
    take: page.pageSize + 1, // Take one extra to check if there are more
    orderBy: { name: 'asc' }
  });

  const hasMore = teams.length > page.pageSize;
  const items = teams.slice(0, page.pageSize).map(toTeamSchema);

  return {
    items,
    total,
    hasMore
  };
}
