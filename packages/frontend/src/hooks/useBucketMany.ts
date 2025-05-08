import { useQuery } from '@apollo/client';
import gql from 'graphql-tag';

interface BucketFilter {
  readonly teamId?: string;
  readonly userId?: string;
}

export function useBucketMany(filter?: BucketFilter) {
  const { data, loading, error, refetch } = useQuery(query, {
    variables: {
      input: {
        filter: {
          teamId: filter?.teamId,
          userId: filter?.userId
        }
      }
    }
  });
  if (loading) return { data: undefined, refetch, loading, error };
  if (data == null) return { data: null, refetch, loading, error };
  return { data: data.bucketMany, refetch, loading, error };
}

const query = gql(`
  query BucketManyQuery($input: BucketManyInput) {
    bucketMany(input: $input) {
      items {
        id
        name
        sortOrder
        tasks {
          id
          name
          notes
          createdAt
          startDate
          bucket {
            id
          }
          dueDate
          sortOrder
          progress {
            label
            value
          }
          priority {
            label
            value
          }
          assignees {
            id
            firstName
            lastName
            email
            fullName
            isPasswordNull
            status {
              label
              value
            }
            systemRole {
              label
              value
            }
            teams {
              id
              name
              description
              avatar
              createdAt
            }
          }
          comments {
            id
            content
            createdAt
            isEdited
            author {
              id
              firstName
              lastName
              email
              fullName
            }
          }
          checklist {
            id
            name
            createdAt
            completed
            sortOrder
          }
        }
      }
      total
      hasMore
    }
  }
`);
