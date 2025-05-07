import { useQuery } from '@apollo/client';
import { gql } from '../gql-generated/gql';

interface UserFilter {
  readonly term?: string;
  readonly teamId?: string[];
  readonly notTeamId?: string[];
  readonly filterIdentity?: boolean;
  readonly page?: number;
  readonly pageSize?: number;
  readonly adminRoleOnly?: boolean;
  readonly userRoleOnly?: boolean;
}

export function useUserMany(filter?: UserFilter) {
  const { data, loading, error, refetch } = useQuery(query, {
    variables: {
      input: {
        filter: {
          teamId: filter?.teamId,
          notTeamId: filter?.notTeamId,
          term: filter?.term,
          filterIdentity: filter?.filterIdentity,
          adminRoleOnly: filter?.adminRoleOnly,
          userRoleOnly: filter?.userRoleOnly
        },
        page: {
          page: filter?.page ?? 0,
          pageSize: filter?.pageSize ?? 5
        }
      }
    },
    fetchPolicy: 'cache-and-network'
  });
  if (loading) return { data: undefined, refetch, loading, error };
  if (data == null) return { data: null, refetch, loading, error };
  return { data: data.userMany, refetch, loading, error };
}

const query = gql(`
    query UserManyQuery($input: UserManyInput) {
      userMany(input: $input) {
        items {
          id
          firstName
          lastName
          fullName
          email
        }
        total
        hasMore
      }
    }
  `);
