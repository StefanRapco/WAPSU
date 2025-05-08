import { useMutation } from '@apollo/client';
// import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import FlagIcon from '@mui/icons-material/Flag';
import NotStartedIcon from '@mui/icons-material/NotStarted';
import PlayCircleIcon from '@mui/icons-material/PlayCircle';
import PriorityHighIcon from '@mui/icons-material/PriorityHigh';
import {
  Box,
  Checkbox,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  Snackbar,
  Stack,
  Typography
} from '@mui/material';
import { format } from 'date-fns';
import { Form, Formik } from 'formik';
import gql from 'graphql-tag';
import { useState } from 'react';
import * as yup from 'yup';
import { Task } from '../../gql-generated/graphql';
import { useTaskCommentCreate } from '../../hooks/useTaskCommentCreate';
import { useTaskCommentDelete } from '../../hooks/useTaskCommentDelete';
import { useTaskCommentEdit } from '../../hooks/useTaskCommentEdit';
import { Button } from '../button';
import { DateField } from '../dateField';
import { SelectField } from '../selectField';
import { SnackbarError } from '../snackbarError';
import { TextField } from '../textField';
import { UserSelect } from '../userSelect';

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

const progressOptions = [
  {
    label: 'Not Started',
    value: 'notStarted',
    icon: <NotStartedIcon sx={{ color: 'warning.main' }} />
  },
  {
    label: 'In Progress',
    value: 'inProgress',
    icon: <PlayCircleIcon sx={{ color: 'red' }} />
  },
  {
    label: 'Completed',
    value: 'completed',
    icon: <CheckCircleRoundedIcon sx={{ color: 'success.main' }} />
  }
];

const priorityOptions = [
  { label: 'Low', value: 'low', icon: <FlagIcon sx={{ color: 'success.main' }} /> },
  { label: 'Medium', value: 'medium', icon: <FlagIcon sx={{ color: 'warning.main' }} /> },
  { label: 'High', value: 'high', icon: <FlagIcon sx={{ color: 'error.main' }} /> },
  { label: 'Urgent', value: 'urgent', icon: <PriorityHighIcon sx={{ color: 'red' }} /> }
];

export function TaskEdit({ open, onClose, onSubmit, onError, task }: TaskEditProps) {
  const [editTask] = useMutation(taskEditMutation);
  const [comments, setComments] = useState<Task['comments']>(task.comments);
  const [deleteCommentId, setDeleteCommentId] = useState<string | null>(null);
  const { createComment } = useTaskCommentCreate({
    onCompleted: values => {
      setComments(values.taskCommentCreate.comments);
      setSuccessMessage('Comment added successfully');
    }
  });
  const { editComment } = useTaskCommentEdit({
    onCompleted: values => {
      setComments(values.taskCommentEdit.comments);
      setSuccessMessage('Comment updated successfully');
    }
  });
  const { deleteComment } = useTaskCommentDelete({
    onCompleted: values => {
      setComments(comments.filter(comment => comment.id !== deleteCommentId));
      setDeleteCommentId(null);
      setSuccessMessage('Comment deleted successfully');
    }
  });
  const [mutationError, setMutationError] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string>('');
  const [selectedAssignees, setSelectedAssignees] = useState<string[]>(
    task.assignees.map(assignee => assignee.id)
  );
  const [newComment, setNewComment] = useState('');
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editingCommentContent, setEditingCommentContent] = useState('');

  const handleAddComment = async () => {
    if (!newComment.trim()) return;
    try {
      await createComment({
        variables: {
          input: {
            content: newComment,
            taskId: task.id
          }
        }
      });
      setNewComment('');
    } catch (error) {
      setMutationError(true);
    }
  };

  const handleEditComment = async (commentId: string) => {
    try {
      const result = await editComment({
        variables: {
          input: {
            id: commentId,
            content: editingCommentContent
          }
        }
      });
      if (result.data?.taskCommentEdit?.task?.comments) {
        setComments(result.data.taskCommentEdit.task.comments);
      }
      setEditingCommentId(null);
      setEditingCommentContent('');
    } catch (error) {
      setMutationError(true);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    try {
      setDeleteCommentId(commentId);
      await deleteComment({
        variables: {
          input: {
            id: commentId
          }
        }
      });
    } catch (error) {
      setMutationError(true);
      setDeleteCommentId(null);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          maxHeight: '80vh'
        }
      }}
    >
      <Box sx={{ ml: 5 }}>
        <DialogTitle sx={{ p: 3, pb: 5, mt: 5 }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography variant="h5">Edit Task</Typography>
            <IconButton
              onClick={onClose}
              sx={{
                color: 'text.secondary',
                '&:hover': {
                  color: 'text.primary',
                  bgcolor: 'action.hover'
                }
              }}
            >
              <CloseIcon />
            </IconButton>
          </Stack>
        </DialogTitle>

        <DialogContent sx={{ p: 5, pt: 0, '&.MuiDialogContent-root': { width: '100%' } }}>
          <Formik
            initialValues={{
              name: task.name,
              notes: task.notes ?? '',
              startDate: task.startDate ? new Date(task.startDate) : null,
              dueDate: task.dueDate ? new Date(task.dueDate) : null,
              progress: task.progress.value,
              priority: task.priority.value
            }}
            enableReinitialize
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
                      priority: values.priority,
                      assigneeIds: selectedAssignees
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
            {({ handleSubmit, values, setFieldValue }) => (
              <Form onSubmit={handleSubmit} style={{ width: '100%' }}>
                <Stack spacing={4} sx={{ width: '100%' }}>
                  <Box sx={{ width: '90%' }}>
                    <TextField name="name" label="Task Name" fullWidth autofocus sx={{ mt: 3 }} />
                  </Box>

                  <Box sx={{ width: '90%' }}>
                    <TextField name="notes" label="Notes" multiline rows={4} fullWidth />
                  </Box>

                  <Stack direction="row" spacing={2} sx={{ width: '90%' }}>
                    <DateField name="startDate" label="Start Date" />
                    <DateField name="dueDate" label="Due Date" />
                  </Stack>

                  <Stack direction="row" spacing={2} sx={{ width: '90%' }}>
                    <SelectField
                      name="progress"
                      label="Progress"
                      options={progressOptions.map(option => ({
                        label: option.label,
                        value: option.value,
                        icon: option.icon
                      }))}
                    />
                    <SelectField
                      name="priority"
                      label="Priority"
                      options={priorityOptions.map(option => ({
                        label: option.label,
                        value: option.value,
                        icon: option.icon
                      }))}
                    />
                  </Stack>

                  <Box sx={{ width: '90%' }}>
                    <Typography variant="subtitle1" sx={{ mb: 2 }}>
                      Assignees
                    </Typography>
                    <UserSelect
                      onUserChange={setSelectedAssignees}
                      filterIdentity
                      initialSelectedUsers={task.assignees.map(assignee => assignee.id)}
                    />
                  </Box>

                  <Divider sx={{ my: 2 }} />

                  <Box sx={{ width: '100%' }}>
                    <Typography variant="subtitle1" sx={{ mb: 2 }}>
                      Checklist
                    </Typography>
                    <Stack spacing={2}>
                      {task.checklist.map(item => (
                        <Box
                          key={item.id}
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 2,
                            p: 1,
                            borderRadius: 1,
                            '&:hover': {
                              bgcolor: 'action.hover'
                            }
                          }}
                        >
                          <Checkbox
                            checked={item.completed}
                            onChange={async e => {
                              try {
                                await editTask({
                                  variables: {
                                    input: {
                                      id: task.id,
                                      checklist: task.checklist.map(i => ({
                                        id: i.id,
                                        completed: i.id === item.id ? e.target.checked : i.completed
                                      }))
                                    }
                                  }
                                });
                              } catch (error) {
                                setMutationError(true);
                                onError('Failed to update checklist item');
                              }
                            }}
                          />
                          <Typography>{item.name}</Typography>
                        </Box>
                      ))}
                    </Stack>
                  </Box>

                  <Divider sx={{ my: 2 }} />

                  <Box sx={{ width: '100%' }}>
                    <Typography variant="subtitle1" sx={{ mb: 2 }}>
                      Comments
                    </Typography>
                    <Stack spacing={2} sx={{ width: '90%' }}>
                      {comments.map(comment => (
                        <Box
                          key={comment.id}
                          sx={{
                            p: 2,
                            borderRadius: 1,
                            bgcolor: 'background.paper',
                            border: '1px solid',
                            borderColor: 'divider',
                            '&:hover': {
                              borderColor: 'primary.main',
                              boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
                            }
                          }}
                        >
                          {editingCommentId === comment.id ? (
                            <Stack spacing={1}>
                              <TextField
                                name="editComment"
                                label="Edit comment"
                                value={editingCommentContent}
                                onChange={e => setEditingCommentContent(e.target.value)}
                                multiline
                                rows={2}
                                fullWidth
                              />
                              <Stack direction="row" spacing={1} justifyContent="flex-end">
                                <Button
                                  buttonText="Cancel"
                                  onClick={() => {
                                    setEditingCommentId(null);
                                    setEditingCommentContent('');
                                  }}
                                />
                                <Button
                                  buttonText="Save"
                                  onClick={() => handleEditComment(comment.id)}
                                />
                              </Stack>
                            </Stack>
                          ) : (
                            <>
                              <Typography
                                variant="body2"
                                sx={{
                                  mb: 1,
                                  whiteSpace: 'pre-wrap',
                                  wordBreak: 'break-word'
                                }}
                              >
                                {comment.content}
                              </Typography>
                              <Stack
                                direction="row"
                                justifyContent="space-between"
                                alignItems="center"
                                sx={{
                                  mt: 1,
                                  pt: 1,
                                  borderTop: '1px solid',
                                  borderColor: 'divider'
                                }}
                              >
                                <Typography
                                  variant="caption"
                                  sx={{
                                    color: 'text.secondary',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 0.5
                                  }}
                                >
                                  {comment.author.fullName} •{' '}
                                  {format(new Date(comment.createdAt), 'MMM d, yyyy h:mm a')}
                                  {comment.isEdited && (
                                    <Box
                                      component="span"
                                      sx={{
                                        ml: 0.5,
                                        color: 'text.secondary',
                                        fontStyle: 'italic'
                                      }}
                                    >
                                      (edited)
                                    </Box>
                                  )}
                                </Typography>
                                <Stack direction="row" spacing={0.5}>
                                  <IconButton
                                    size="small"
                                    onClick={() => {
                                      setEditingCommentId(comment.id);
                                      setEditingCommentContent(comment.content);
                                    }}
                                    sx={{
                                      color: 'text.secondary',
                                      '&:hover': {
                                        color: 'primary.main',
                                        bgcolor: 'action.hover'
                                      }
                                    }}
                                  >
                                    <EditIcon fontSize="small" />
                                  </IconButton>
                                  <IconButton
                                    size="small"
                                    onClick={() => handleDeleteComment(comment.id)}
                                    sx={{
                                      color: 'text.secondary',
                                      '&:hover': {
                                        color: 'error.main',
                                        bgcolor: 'action.hover'
                                      }
                                    }}
                                  >
                                    <DeleteIcon fontSize="small" />
                                  </IconButton>
                                </Stack>
                              </Stack>
                            </>
                          )}
                        </Box>
                      ))}
                    </Stack>

                    <Box sx={{ mt: 3, mb: 5, width: '90%' }}>
                      <Stack direction="row" spacing={5} alignItems="center">
                        <TextField
                          name="newComment"
                          label="Add a comment"
                          multiline
                          rows={3}
                          fullWidth
                          value={newComment}
                          onChange={e => setNewComment(e.target.value)}
                        />
                        <Button
                          buttonText="Add Comment"
                          onClick={handleAddComment}
                          sx={{ mt: 1 }}
                        />
                      </Stack>
                    </Box>
                  </Box>

                  <Stack
                    direction="row"
                    spacing={2}
                    justifyContent="flex-end"
                    sx={{ width: '95%' }}
                  >
                    <Button buttonText="Cancel" onClick={onClose} />
                    <Button buttonText="Save Changes" type="submit" />
                  </Stack>
                </Stack>
              </Form>
            )}
          </Formik>
        </DialogContent>
      </Box>

      <SnackbarError
        mutationError={mutationError}
        setMutationError={setMutationError}
        apolloErrors={[]}
      />
      <Snackbar
        open={Boolean(successMessage)}
        autoHideDuration={3000}
        onClose={() => setSuccessMessage('')}
        message={successMessage}
        sx={{
          '& .MuiSnackbarContent-root': {
            bgcolor: 'success.main',
            color: 'success.contrastText'
          }
        }}
      />
    </Dialog>
  );
}
