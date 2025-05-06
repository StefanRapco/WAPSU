import { UserManyFilterInput, User as UserSchema } from '@app/frontend/src/gql-generated/graphql';
import { Prisma, User } from '@prisma/client';
import { InvocationContext } from '../../invocationContext';

export function toUserSchema(props: User): UserSchema {
  return {
    id: props.id,
    firstName: props.firstName,
    lastName: props.lastName,
    fullName: toUserFullName({ firstName: props.firstName, lastName: props.lastName }),
    email: props.email,
    isPasswordNull: props.password == null
  };
}

function toUserFullName(props: { firstName: string; lastName: string }): string {
  return `${props.firstName} ${props.lastName}`;
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

  return conditions;
}
