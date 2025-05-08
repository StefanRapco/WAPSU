import { useMutation } from '@apollo/client';
import { Box, Drawer, Stack, Typography } from '@mui/material';
import { Form, Formik } from 'formik';
import gql from 'graphql-tag';
import { useState } from 'react';
import * as yup from 'yup';
import { Task } from '../../gql-generated/graphql';
import { Button } from '../button';
import { DateField } from '../dateField';
import { SelectField } from '../selectField';
import { SnackbarError } from '../snackbarError';
import { TextField } from '../textField';

const taskEditMutation = gql(`
  mutation TaskEdit($input: TaskEditInput!) {
    taskEdit(input: $input) {
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
      tags {
        id
        name
      }
      bucket {
        id
        name
      }
    }
  }
`);

interface TaskEditProps {
  readonly open: boolean;
  readonly onClose: () => void;
  readonly onSubmit: () => void;
  readonly onError: (error: string) => void;
  readonly task: Task;
}

const validationSchema = yup.object({
  name: yup.string().required('Name is required'),
  notes: yup.string(),
  startDate: yup.date().nullable(),
  dueDate: yup.date().nullable(),
  progress: yup.string().oneOf(['notStarted', 'inProgress', 'completed']),
  priority: yup.string().oneOf(['low', 'medium', 'high', 'urgent'])
});

export function TaskEdit({ open, onClose, onSubmit, onError, task }: TaskEditProps) {
  const [editTask] = useMutation(taskEditMutation);
  const [mutationError, setMutationError] = useState<boolean>(false);

  return (
    <Drawer anchor="right" open={open} onClose={onClose}>
      <Box sx={{ width: 400, p: 3 }}>
        <Stack spacing={4}>
          <Typography variant="h5">Edit Task</Typography>

          <Formik
            initialValues={{
              name: task.name,
              notes: task.notes ?? '',
              startDate: task.startDate ? new Date(task.startDate) : null,
              dueDate: task.dueDate ? new Date(task.dueDate) : null,
              progress: task.progress.value,
              priority: task.priority.value
            }}
            validationSchema={validationSchema}
            onSubmit={async values => {
              try {
                await editTask({
                  variables: {
                    input: {
                      id: task.id,
                      name: values.name,
                      notes: values.notes ?? undefined,
                      startDate: values.startDate,
                      dueDate: values.dueDate,
                      progress: values.progress,
                      priority: values.priority
                    }
                  }
                });
                onSubmit();
              } catch (error) {
                setMutationError(true);
                onError('Failed to edit task');
              }
            }}
          >
            {({ handleSubmit }) => (
              <Form onSubmit={handleSubmit}>
                <Stack spacing={3}>
                  <TextField name="name" label="Task Name" />
                  <TextField name="notes" label="Notes" multiline rows={4} />
                  <DateField name="startDate" label="Start Date" />
                  <DateField name="dueDate" label="Due Date" />
                  <SelectField
                    name="progress"
                    label="Progress"
                    options={[
                      { label: 'Not Started', value: 'notStarted' },
                      { label: 'In Progress', value: 'inProgress' },
                      { label: 'Completed', value: 'completed' }
                    ]}
                  />
                  <SelectField
                    name="priority"
                    label="Priority"
                    options={[
                      { label: 'Low', value: 'low' },
                      { label: 'Medium', value: 'medium' },
                      { label: 'High', value: 'high' },
                      { label: 'Urgent', value: 'urgent' }
                    ]}
                  />

                  <Stack direction="row" spacing={2} justifyContent="flex-end">
                    <Button buttonText="Cancel" onClick={onClose} />
                    <Button buttonText="Save" type="submit" />
                  </Stack>
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
