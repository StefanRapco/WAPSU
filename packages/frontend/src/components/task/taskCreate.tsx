import { useMutation } from '@apollo/client';
import { Box, Stack } from '@mui/material';
import { Form, Formik } from 'formik';
import { useState } from 'react';
import * as yup from 'yup';
import { gql } from '../../gql-generated/gql';
import { Button } from '../button';
import { Drawer } from '../drawer';
import { SnackbarError } from '../snackbarError';
import { TextField } from '../textField';

const taskCreateMutation = gql(`
  mutation TaskCreate($input: TaskCreateInput!) {
    taskCreate(input: $input) {
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
      }
      comments {
        id
        content
        createdAt
        isEdited
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

interface TaskCreateProps {
  readonly open: boolean;
  readonly onClose: () => void;
  readonly onSubmit: () => void;
  readonly onError: (error: string) => void;
  readonly teamId?: string;
  readonly userId?: string;
  readonly bucketId: string;
}

const validationSchema = yup.object({
  name: yup.string().required('Name is required')
});

export function TaskCreate({
  open,
  onClose,
  onSubmit,
  onError,
  teamId,
  userId,
  bucketId
}: TaskCreateProps) {
  const [createTask] = useMutation(taskCreateMutation);
  const [mutationError, setMutationError] = useState<boolean>(false);

  return (
    <Drawer open={open} onClose={onClose} title="Create Task">
      <Box sx={{ p: 3 }}>
        <Formik
          initialValues={{
            name: ''
          }}
          validationSchema={validationSchema}
          onSubmit={async values => {
            try {
              await createTask({
                variables: {
                  input: {
                    name: values.name,
                    bucketId,
                    userId,
                    teamId
                  }
                }
              });
              onSubmit();
            } catch (error) {
              setMutationError(true);
              onError('Failed to create task');
            }
          }}
        >
          {({ handleSubmit }) => (
            <Form onSubmit={handleSubmit}>
              <Stack spacing={3}>
                <TextField name="name" label="Task Name" />

                <Stack direction="row" spacing={2} justifyContent="flex-end">
                  <Button buttonText="Cancel" onClick={onClose} />
                  <Button buttonText="Create" type="submit" />
                </Stack>
              </Stack>
            </Form>
          )}
        </Formik>
      </Box>

      <SnackbarError
        mutationError={mutationError}
        setMutationError={setMutationError}
        apolloErrors={[]}
      />
    </Drawer>
  );
}
