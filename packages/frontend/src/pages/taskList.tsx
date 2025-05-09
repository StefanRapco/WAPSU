import { useMutation } from '@apollo/client';
import { Box, Stack, Typography } from '@mui/material';
import gql from 'graphql-tag';
import { useState } from 'react';
import { ConfirmDialog } from '../components/confirmDialog';
import { SectionHeader } from '../components/header';
import { SearchField } from '../components/searchField';
import { SnackbarError } from '../components/snackbarError';
import { SnackBarSuccess, snackbarUseEffect } from '../components/snackbarSuccess';
import { KanbanBoard } from '../components/task/kanbanBoard';
import { TaskCreate } from '../components/task/taskCreate';
import { TaskEdit } from '../components/task/taskEdit';
import { Task } from '../gql-generated/graphql';
import { useBucketMany } from '../hooks/useBucketMany';
import { Identity } from '../hooks/useIdentity';
import { useTaskMany } from '../hooks/useTaskMany';

const taskDeleteMutation = gql(`
  mutation TaskDelete($input: TaskDeleteInput!) {
    taskDelete(input: $input)
  }
`);

const taskChecklistEditMutation = gql(`
  mutation TaskChecklistEdit($input: TaskChecklistEditInput!) {
    taskChecklistEdit(input: $input) {
      id
      name
      createdAt
      completed
      sortOrder
      task {
        id
      }
    }
  }
`);

const taskMoveMutation = gql(`
  mutation TaskMove($input: TaskEditInput!) {
    taskEdit(input: $input) {
      id
      bucket {
        id
      }
      sortOrder
    }
  }
`);

const bucketCreateMutation = gql(`
  mutation BucketCreate($input: BucketCreateInput!) {
    bucketCreate(input: $input) {
      id
      name
      tasks {
        id
      }
    }
  }
`);

const bucketEditMutation = gql(`
  mutation BucketEdit($input: BucketEditInput!) {
    bucketEdit(input: $input) {
      id
      name
      sortOrder
    }
  }
`);

const taskCreateMutation = gql`
  mutation TaskCreateList($input: TaskCreateInput!) {
    taskCreate(input: $input) {
      id
      name
      notes
      bucket {
        id
      }
      sortOrder
    }
  }
`;

const bucketDeleteMutation = gql(`
  mutation BucketDelete($input: BucketDeleteInput!) {
    bucketDelete(input: $input)
  }
`);

export function TaskList(props: { identity: NonNullable<Identity> }) {
  const [isCreateDrawerOpen, setIsCreateDrawerOpen] = useState(false);
  const [isEditDrawerOpen, setIsEditDrawerOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [selectedBucketId, setSelectedBucketId] = useState<string | null>(null);
  const [filterTerm, setFilterTerm] = useState('');
  const [error, setError] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string>('');
  const [isCreateBucketDialogOpen, setIsCreateBucketDialogOpen] = useState(false);

  const {
    data: bucketData,
    refetch: bucketRefetch,
    error: bucketError
  } = useBucketMany({ userId: props.identity.id });
  const { data: taskData, error: taskError } = useTaskMany({
    term: filterTerm
  });

  const [deleteTask, { error: deleteError }] = useMutation(taskDeleteMutation);
  const [editChecklistItem, { error: checklistError }] = useMutation(taskChecklistEditMutation);
  const [moveTask, { error: moveError }] = useMutation(taskMoveMutation);
  const [createBucket, { error: createBucketError }] = useMutation(bucketCreateMutation);
  const [editBucket, { error: editBucketError }] = useMutation(bucketEditMutation);
  const [createTask, { error: createTaskError }] = useMutation(taskCreateMutation);
  const [deleteBucket, { error: deleteBucketError }] = useMutation(bucketDeleteMutation);

  snackbarUseEffect({
    success,
    error,
    setSuccess: value => setSuccess(value),
    setError: value => setError(value)
  });

  const handleTaskCreate = async () => {
    setIsCreateDrawerOpen(false);
    setSelectedBucketId(null);
    await bucketRefetch();
    setSuccessMessage('Task created successfully');
    setSuccess(true);
  };

  const handleTaskCreateError = (error: string) => {
    setError(true);
  };

  const handleTaskEdit = async () => {
    await bucketRefetch();
    setSuccessMessage('Task updated successfully');
    setSuccess(true);
  };

  const handleTaskEditError = (error: string) => {
    setError(true);
  };

  const handleTaskDelete = async () => {
    if (!selectedTask) return;

    try {
      await deleteTask({
        variables: {
          input: {
            id: selectedTask.id
          }
        }
      });
      setIsDeleteDialogOpen(false);
      setSelectedTask(null);
      await bucketRefetch();
      setSuccessMessage('Task deleted successfully');
      setSuccess(true);
    } catch (error) {
      setError(true);
    }
  };

  const handleChecklistItemToggle = async (item: any) => {
    try {
      await editChecklistItem({
        variables: {
          input: {
            id: item.id,
            completed: !item.completed
          }
        }
      });
      await bucketRefetch();
      setSuccessMessage('Checklist item updated successfully');
      setSuccess(true);
    } catch (error) {
      setError(true);
    }
  };

  const handleTaskMove = async (taskId: string, destinationBucketId: string, newIndex: number) => {
    try {
      await moveTask({
        variables: {
          input: {
            id: taskId,
            bucketId: destinationBucketId,
            sortOrder: newIndex
          }
        }
      });
      await bucketRefetch();
      setSuccessMessage('Task moved successfully');
      setSuccess(true);
    } catch (error) {
      setError(true);
    }
  };

  const handleCreateBucket = async (name: string) => {
    if (!name.trim()) return;

    try {
      await createBucket({
        variables: {
          input: {
            name: name.trim(),
            userId: props.identity.id
          }
        }
      });
      await bucketRefetch();
      setSuccessMessage('Bucket created successfully');
      setSuccess(true);
    } catch (error) {
      setError(true);
    }
  };

  const handleCreateTask = async (bucketId: string, name: string) => {
    try {
      await createTask({
        variables: {
          input: {
            name,
            bucketId,
            userId: props.identity.id
          }
        }
      });
      await bucketRefetch();
      setSuccessMessage('Task created successfully');
      setSuccess(true);
    } catch (error) {
      setError(true);
    }
  };

  const handleBucketMove = async (bucketId: string, newSortOrder: number) => {
    try {
      await editBucket({
        variables: {
          input: {
            id: bucketId,
            sortOrder: newSortOrder
          }
        }
      });
      await bucketRefetch();
      setSuccessMessage('Bucket moved successfully');
      setSuccess(true);
    } catch (error) {
      setError(true);
    }
  };

  const handleBucketEdit = async (bucketId: string, name: string) => {
    try {
      await editBucket({
        variables: {
          input: {
            id: bucketId,
            name
          }
        }
      });
      await bucketRefetch();
      setSuccessMessage('Bucket updated successfully');
      setSuccess(true);
    } catch (error) {
      setError(true);
    }
  };

  const handleBucketDelete = async (bucketId: string) => {
    try {
      await deleteBucket({
        variables: {
          input: {
            id: bucketId
          }
        }
      });
      await bucketRefetch();
      setSuccessMessage('Bucket deleted successfully');
      setSuccess(true);
    } catch (error) {
      setError(true);
    }
  };

  return (
    <Box>
      <SectionHeader>
        <Stack direction="row" alignItems="center" width="100%" spacing={2}>
          <Typography variant="h2" fontWeight={700}>
            Tasks
          </Typography>
        </Stack>
      </SectionHeader>

      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        width="100%"
        spacing={2}
        sx={{ mb: 5 }}
      >
        <Typography sx={{ mb: 4 }}>
          Stay organized by setting deadlines, prioritizing your tasks, and completing them one by
          one. You'll be more productive and focused as you accomplish each item on your list!
        </Typography>

        <SearchField
          value={filterTerm}
          onSearchChange={setFilterTerm}
          placeholder="Search tasks..."
          sx={{ width: 300 }}
        />
      </Stack>

      {filterTerm && (!taskData?.items || taskData.items.length === 0) ? (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            py: 8,
            px: 4,
            bgcolor: 'grey.50',
            borderRadius: 2
          }}
        >
          <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
            No tasks found
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Try adjusting your search term or create a new task
          </Typography>
        </Box>
      ) : (
        <KanbanBoard
          buckets={
            filterTerm
              ? (taskData?.items.reduce((acc: any[], task) => {
                  const bucket = acc.find(b => b.id === task.bucket.id);
                  if (bucket) {
                    bucket.tasks.push(task);
                  } else {
                    acc.push({
                      ...task.bucket,
                      tasks: [task]
                    });
                  }
                  return acc;
                }, []) ?? [])
              : (bucketData?.items ?? [])
          }
          disabled={Boolean(filterTerm)}
          onTaskEdit={task => {
            setSelectedTask(task);
            setIsEditDrawerOpen(true);
          }}
          onTaskDelete={task => {
            setSelectedTask(task);
            setIsDeleteDialogOpen(true);
          }}
          onChecklistItemToggle={handleChecklistItemToggle}
          onViewComments={task => {
            setSelectedTask(task);
          }}
          onCreateTask={handleCreateTask}
          onTaskMove={handleTaskMove}
          onCreateBucket={handleCreateBucket}
          onBucketMove={handleBucketMove}
          onBucketEdit={handleBucketEdit}
          onBucketDelete={handleBucketDelete}
          onSuccess={setSuccessMessage}
        />
      )}

      <TaskCreate
        open={isCreateDrawerOpen}
        onClose={() => {
          setIsCreateDrawerOpen(false);
          setSelectedBucketId(null);
        }}
        onSubmit={handleTaskCreate}
        onError={handleTaskCreateError}
        userId={props.identity.id}
        bucketId={selectedBucketId ?? undefined}
      />

      {selectedTask && (
        <>
          <TaskEdit
            open={isEditDrawerOpen}
            onClose={() => {
              setIsEditDrawerOpen(false);
              setSelectedTask(null);
            }}
            onSubmit={handleTaskEdit}
            onError={handleTaskEditError}
            task={selectedTask}
          />

          <ConfirmDialog
            open={isDeleteDialogOpen}
            onClose={() => {
              setIsDeleteDialogOpen(false);
              setSelectedTask(null);
            }}
            onConfirm={handleTaskDelete}
            title="Delete Task"
            message="Are you sure you want to delete this task? This action cannot be undone."
          />
        </>
      )}
      <ConfirmDialog
        open={isCreateBucketDialogOpen}
        onClose={() => setIsCreateBucketDialogOpen(false)}
        title="Create New Bucket"
        message="Are you sure you want to create a new bucket?"
        onConfirm={() => handleCreateBucket('New Bucket')}
      />
      <SnackBarSuccess
        open={success}
        successMsg={successMessage}
        setSuccess={value => setSuccess(value)}
      />
      <SnackbarError
        mutationError={error}
        setMutationError={value => setError(value)}
        apolloErrors={[
          bucketError,
          taskError,
          deleteError,
          checklistError,
          moveError,
          createBucketError,
          editBucketError,
          createTaskError,
          deleteBucketError
        ]}
      />
    </Box>
  );
}
