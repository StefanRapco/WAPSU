import { useQuery } from '@apollo/client';
import { gql } from '../gql-generated/gql';

interface TeamFilter {
  readonly term?: string;
  readonly page?: number;
  readonly pageSize?: number;
  readonly userId?: string[];
}

export function useTeamMany(filter?: TeamFilter) {
  const { data, loading, error, refetch } = useQuery(query, {
    variables: {
      input: {
        filter: {
          term: filter?.term,
          userId: filter?.userId
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
  return { data: data.teamMany, refetch, loading, error };
}

const query = gql(`
  query TeamManyQuery($input: TeamManyInput) {
    teamMany(input: $input) {
      items {
        id
        name
        avatar
        createdAt
        description
        users {
          items {
            id
            firstName
            lastName
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
      total
      hasMore
    }
  }
`);
