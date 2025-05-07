import { useQuery } from '@apollo/client';
import { gql } from '../gql-generated/gql';

interface TeamOneFilter {
  readonly term?: string;
  readonly teamId?: string[];
  readonly notTeamId?: string[];
  readonly filterIdentity?: boolean;
  readonly page?: number;
  readonly pageSize?: number;
}

export function useTeamOne(id: string, filter?: TeamOneFilter) {
  const { data, loading, error, refetch } = useQuery(query, {
    variables: {
      id,
      input: {
        filter: {
          teamId: filter?.teamId,
          notTeamId: filter?.notTeamId,
          term: filter?.term,
          filterIdentity: filter?.filterIdentity
        },
        page: {
          page: filter?.page ?? 0,
          pageSize: filter?.pageSize ?? 5
        }
      }
    }
  });
  if (loading) return { data: undefined, refetch, loading, error };
  if (data == null) return { data: null, refetch, loading, error };
  return { data: data.teamOne, refetch, loading, error };
}

const query = gql(`
  query TeamOneQuery($id: ID!, $input: UserManyInput) {
    teamOne(id: $id) {
      id
      name
      avatar
      description
      createdAt
      users(input: $input) {
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
