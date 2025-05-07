import { useMutation } from '@apollo/client';
import { gql } from '../gql-generated/gql';

export function useTeamEdit() {
  const [editTeam, { loading, error }] = useMutation(teamEditMutation);

  return {
    editTeam: (
      teamId: string,
      name: string | undefined,
      description: string | null | undefined,
      avatar: string | undefined
    ) =>
      editTeam({
        variables: {
          input: {
            teamId,
            name,
            description,
            avatar
          }
        }
      }),
    loading,
    error
  };
}

const teamEditMutation = gql(`
  mutation TeamEdit($input: TeamEditInput!) {
    teamEdit(input: $input) {
      id
      name
      description
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
