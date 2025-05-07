import { useMutation } from '@apollo/client';
import { gql } from '../gql-generated/gql';
import { TeamUserEditAction } from '../gql-generated/graphql';

export function useTeamUserManagement() {
  const [addUsers, { loading: addLoading, error: addError }] = useMutation(teamUserAddMutation);
  const [editUser, { loading: editLoading, error: editError }] = useMutation(teamUserEditMutation);

  return {
    addUsers: (teamId: string, userIds: string[]) =>
      addUsers({
        variables: {
          input: {
            teamId,
            userIds
          }
        }
      }),
    editUser: (teamId: string, userId: string, action: TeamUserEditAction) =>
      editUser({
        variables: {
          input: {
            teamId,
            userId,
            action
          }
        }
      }),
    loading: addLoading || editLoading,
    error: addError || editError
  };
}

const teamUserAddMutation = gql(`
    mutation TeamUserAdd($input: TeamUserAddInput!) {
      teamUserAdd(input: $input) {
        id
        name
        avatar
        createdAt
        users {
          items {
            id
            firstName
            lastName
            fullName
            email
            teamRole {
              label
              value
            }
          }
          total
          hasMore
        }
      }
    }
  `);

const teamUserEditMutation = gql(`
    mutation TeamUserEdit($input: TeamUserEditInput!) {
      teamUserEdit(input: $input) {
        id
        name
        avatar
        createdAt
        users {
          items {
            id
            firstName
            lastName
            fullName
            email
            teamRole {
              label
              value
            }
          }
          total
          hasMore
        }
      }
    }
  `);
