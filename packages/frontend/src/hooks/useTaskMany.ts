import { useQuery } from '@apollo/client';
import gql from 'graphql-tag';

interface TaskFilter {
  readonly term?: string;
}

export function useTaskMany(filter?: TaskFilter) {
  const { data, loading, error, refetch } = useQuery(query, {
    variables: {
      input: {
        filter: {
          term: filter?.term
        }
      }
    }
  });
  if (loading) return { data: undefined, refetch, loading, error };
  if (data == null) return { data: null, refetch, loading, error };
  return { data: data.taskMany, refetch, loading, error };
}

const query = gql(`
  query TaskManyQuery($input: TaskManyInput) {
    taskMany(input: $input) {
      items {
        id
        name
        notes
        createdAt
        startDate
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
        bucket {
          id
          name
        }
      }
      total
      hasMore
    }
  }
`);
