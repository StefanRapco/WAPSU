import { useQuery } from '@apollo/client';
import { gql } from '../gql-generated/gql';

export function useTeamOne(id: string) {
  const { data, loading, error, refetch } = useQuery(query, {
    variables: { id }
  });
  if (loading) return { data: undefined, refetch, loading, error };
  if (data == null) return { data: null, refetch, loading, error };
  return { data: data.teamOne, refetch, loading, error };
}

const query = gql(`
  query TeamOneQuery($id: ID!) {
    teamOne(id: $id) {
      id
      name
      avatar
      createdAt
      users {
        id
        firstName
        lastName
        fullName
        email
      }
    }
  }
`);
