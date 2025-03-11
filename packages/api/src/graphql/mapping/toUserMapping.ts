import { User as UserSchema } from '@app/frontend/src/gql-generated/graphql';
import { User } from '@prisma/client';

export function toUserSchema(props: User): UserSchema {
  return {
    __typename: 'User',
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
