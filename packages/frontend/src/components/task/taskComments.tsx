import { useMutation } from '@apollo/client';
import { Box, Drawer, Stack, Typography } from '@mui/material';
import { format } from 'date-fns';
import { Form, Formik } from 'formik';
import gql from 'graphql-tag';
import { useState } from 'react';
import * as yup from 'yup';
import { Task } from '../../gql-generated/graphql';
import { Button } from '../button';
import { SnackbarError } from '../snackbarError';
import { TextField } from '../textField';

const taskCommentCreateMutation = gql(`
  mutation TaskCommentCreate($input: TaskCommentCreateInput!) {
    taskCommentCreate(input: $input) {
      id
      content
      createdAt
      isEdited
    }
  }
`);

interface TaskCommentsProps {
  readonly open: boolean;
  readonly onClose: () => void;
  readonly task: Task;
}

const validationSchema = yup.object({
  content: yup.string().required('Comment is required')
});

export function TaskComments({ open, onClose, task }: TaskCommentsProps) {
  const [createComment] = useMutation(taskCommentCreateMutation);
  const [mutationError, setMutationError] = useState<boolean>(false);

  return (
    <Drawer anchor="right" open={open} onClose={onClose}>
      <Box sx={{ width: 400, p: 3 }}>
        <Stack spacing={4}>
          <Typography variant="h5">Comments</Typography>

          <Stack spacing={2}>
            {task.comments.map(comment => (
              <Box key={comment.id} sx={{ pl: 2, borderLeft: '2px solid', borderColor: 'divider' }}>
                <Typography variant="body2">{comment.content}</Typography>
                <Typography variant="caption" color="text.secondary">
                  {format(new Date(comment.createdAt), 'MMM d, yyyy')}
                  {comment.isEdited && ' (edited)'}
                </Typography>
              </Box>
            ))}
          </Stack>

          <Formik
            initialValues={{ content: '' }}
            validationSchema={validationSchema}
            onSubmit={async (values, { resetForm }) => {
              try {
                await createComment({
                  variables: {
                    input: {
                      content: values.content,
                      taskId: task.id
                    }
                  }
                });
                resetForm();
              } catch (error) {
                setMutationError(true);
              }
            }}
          >
            {({ handleSubmit }) => (
              <Form onSubmit={handleSubmit}>
                <Stack spacing={2}>
                  <TextField name="content" label="Add a comment" multiline rows={3} />
                  <Button buttonText="Post Comment" type="submit" />
                </Stack>
              </Form>
            )}
          </Formik>
        </Stack>
      </Box>

      <SnackbarError
        mutationError={mutationError}
        setMutationError={setMutationError}
        apolloErrors={[]}
      />
    </Drawer>
  );
}
