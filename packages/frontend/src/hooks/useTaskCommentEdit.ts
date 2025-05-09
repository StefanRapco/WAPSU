import { useMutation } from '@apollo/client';
import { gql } from '../gql-generated/gql';

const taskCommentEditMutation = gql(`
  mutation TaskCommentEdit($input: TaskCommentEditInput!) {
    taskCommentEdit(input: $input) {
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
        }
      
    }
  }
`);

export function useTaskCommentEdit(props?: { onCompleted: (values: any) => void }) {
  const [editComment, { loading }] = useMutation(taskCommentEditMutation, {
    onCompleted: values => props?.onCompleted?.(values)
  });

  return {
    editComment,
    loading
  };
}
