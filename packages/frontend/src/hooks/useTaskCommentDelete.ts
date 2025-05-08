import { useMutation } from '@apollo/client';
import gql from 'graphql-tag';

const taskCommentDeleteMutation = gql(`
  mutation TaskCommentDelete($input: TaskCommentDeleteInput!) {
    taskCommentDelete(input: $input) {
        id
        comments {
          id
          content
          createdAt
        }
    }
  }
`);

export function useTaskCommentDelete(props?: { onCompleted: (values: any) => void }) {
  const [deleteComment, { loading }] = useMutation(taskCommentDeleteMutation, {
    onCompleted: values => props?.onCompleted?.(values)
  });

  return {
    deleteComment,
    loading
  };
}
