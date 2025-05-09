import { useMutation } from '@apollo/client';
import { gql } from '../gql-generated/gql';

const taskCommentCreateMutation = gql(`
  mutation TaskCommentCreate($input: TaskCommentCreateInput!) {
    taskCommentCreate(input: $input) {
      id
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
    }
  }
`);

export function useTaskCommentCreate(props?: { onCompleted: (values: any) => void }) {
  const [createComment, { loading, error }] = useMutation(taskCommentCreateMutation, {
    onCompleted: values => props?.onCompleted?.(values)
  });

  return {
    createComment,
    loading,
    error
  };
}
