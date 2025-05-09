import { UserManyFilterInput, User as UserSchema } from '@app/frontend/src/gql-generated/graphql';
import { Prisma, SystemRole, TeamRole, User, UserStatus } from '@prisma/client';
import { InvocationContext } from '../../invocationContext';
import { prisma } from '../../prisma';
import { toTeamSchema } from './toTeamMapping';

export function toUserSchema(props: User): UserSchema {
  return {
    id: props.id,
    firstName: props.firstName,
    lastName: props.lastName,
    fullName: toUserFullName({ firstName: props.firstName, lastName: props.lastName }),
    email: props.email,
    isPasswordNull: props.password == null,
    systemRole: { label: prettifySystemRole(props.systemRole), value: props.systemRole },
    status: { label: prettifyUserStatus(props.status), value: props.status },
    // @ts-expect-error
    teams: async () => {
      const teamsDb = await prisma.team.findMany({
        where: {
          users: { some: { userId: props.id } }
        }
      });

      return teamsDb.map(toTeamSchema);
    }
  };
}

export function toUserFullName(props: { firstName: string; lastName: string }): string {
  return `${props.firstName} ${props.lastName}`;
}

export function prettifyTeamRole(role: TeamRole): string {
  if (role === 'owner') return 'Owner';
  if (role === 'ambassador') return 'Ambassador';
  if (role === 'member') return 'Member';
  throw new Error('Unknown team role');
}

export function prettifySystemRole(role: SystemRole): string {
  if (role === 'admin') return 'Admin';
  if (role === 'user') return 'User';
  throw new Error('Unknown system role');
}

export function prettifyUserStatus(status: UserStatus): string {
  if (status === 'active') return 'Active';
  if (status === 'archived') return 'Archived';
  if (status === 'invited') return 'Invited';
  throw new Error('Unknown user status');
}

export function toUserWhere({
  input: filter,
  identity
}: {
  input: UserManyFilterInput | undefined | null;
  identity: InvocationContext['identity'];
}): Prisma.UserWhereInput[] {
  const conditions: Prisma.UserWhereInput[] = new Array();

  if (filter == null) return conditions;

  if (filter.filterIdentity)
    conditions.push({
      id: { not: identity.id }
    });

  if (filter.onlyIdentity)
    conditions.push({
      id: { equals: identity.id }
    });

  if (filter.term != null && filter.term.length > 0) {
    const or: { OR: Prisma.UserWhereInput['OR'] } = { OR: new Array() };

    or.OR?.push(
      { firstName: { contains: filter.term } },
      { lastName: { contains: filter.term } },
      { email: { contains: filter.term } }
    );

    conditions.push(or);
  }

  if (filter.teamId != null && filter.teamId.filter(term => term !== '').length !== 0) {
    conditions.push({
      teams: {
        some: {
          teamId: { in: filter.teamId }
        }
      }
    });
  }

  if (filter.notTeamId != null && filter.notTeamId.filter(term => term !== '').length !== 0) {
    conditions.push({
      teams: { none: { teamId: { in: filter.notTeamId } } }
    });
  }

  if (filter.systemRole != null && filter.systemRole.length > 0) {
    conditions.push({
      systemRole: { in: filter.systemRole.map(role => role as SystemRole) }
    });
  }

  if (filter.status != null && filter.status.length > 0) {
    conditions.push({
      status: { in: filter.status.map(status => status as UserStatus) }
    });
  }

  return conditions;
}
