import { useMutation } from '@apollo/client';
import { gql } from '../gql-generated/gql';
import { SystemRole } from '../gql-generated/graphql';

export function useUserRoleManagement() {
  const [updateRole, { loading, error }] = useMutation(userRoleUpdateMutation);

  return {
    updateRole: (userId: string, systemRole: SystemRole) =>
      updateRole({
        variables: {
          input: {
            userId,
            systemRole
          }
        }
      }),
    loading,
    error
  };
}

const userRoleUpdateMutation = gql(`
  mutation UserRoleUpdate($input: UserRoleUpdateInput!) {
    userRoleUpdate(input: $input) {
      id
      firstName
      lastName
      fullName
      email
      systemRole {
        label
        value
      }
    }
  }
`);
