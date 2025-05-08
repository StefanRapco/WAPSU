import { useQuery } from '@apollo/client';
import { gql } from '../gql-generated/gql';

const taskQuery = gql(`
  query Task($id: ID!) {
    taskOne(id: $id) {
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
        fullName
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
          fullName
        }
        task {
          id
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
  }
`);

export function useTaskOne(id: string, skip?: boolean) {
  const { data, loading, error, refetch } = useQuery(taskQuery, {
    variables: { id },
    skip
  });

  return {
    data: data?.taskOne,
    loading,
    error,
    refetch
  };
}
