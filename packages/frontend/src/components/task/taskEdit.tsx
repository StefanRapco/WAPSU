import { useMutation } from '@apollo/client';
// import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import AddCircleOutlineRoundedIcon from '@mui/icons-material/AddCircleOutlineRounded';
import CheckCircleOutlineRoundedIcon from '@mui/icons-material/CheckCircleOutlineRounded';
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
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  Stack,
  TextField,
  Typography
} from '@mui/material';
import { format } from 'date-fns';
import { Form, Formik } from 'formik';
import gql from 'graphql-tag';
import { useState } from 'react';
import * as yup from 'yup';
import { Task } from '../../gql-generated/graphql';
import { useIdentity } from '../../hooks/useIdentity';
import { useTaskCommentCreate } from '../../hooks/useTaskCommentCreate';
import { useTaskCommentDelete } from '../../hooks/useTaskCommentDelete';
import { useTaskCommentEdit } from '../../hooks/useTaskCommentEdit';
import { DateField } from '../dateField';
import { SelectField } from '../selectField';
import { SnackbarError } from '../snackbarError';
import { SnackBarSuccess, snackbarUseEffect } from '../snackbarSuccess';
import { TextField as FormTextField } from '../textField';
import { UserSelect } from '../userSelect';

const taskChecklistCreateMutation = gql(`
  mutation TaskChecklistCreate($input: TaskChecklistCreateInput!) {
    taskChecklistCreate(input: $input) {
      id
      name
      createdAt
      completed
      sortOrder
      task {
        id
        checklist {
          id
          name
          createdAt
          completed
          sortOrder
        }
      }
    }
  }
`);

const taskChecklistEditMutation = gql(`
  mutation TaskChecklistEditEdit($input: TaskChecklistEditInput!) {
    taskChecklistEdit(input: $input) {
      id
      name
      createdAt
      completed
      sortOrder
      task {
        id
        checklist {
          id
          name
          createdAt
          completed
          sortOrder
        }
      }
    }
  }
`);

const taskChecklistDeleteMutation = gql(`
  mutation TaskChecklistDelete($input: TaskChecklistDeleteInput!) {
    taskChecklistDelete(input: $input) {
      id
      name
      createdAt
      sortOrder
      checklist {
        id
        name
        createdAt
        completed
        sortOrder
      }
    }
  }
`);

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
  readonly mode: 'user' | 'team';
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

export function TaskEdit({ open, onClose, onSubmit, onError, task, mode }: TaskEditProps) {
  const { identity } = useIdentity();
  const [editTask] = useMutation(taskEditMutation);
  const [comments, setComments] = useState<Task['comments']>(task.comments);
  // Checklist state and mutations
  const [checklist, setChecklist] = useState<Task['checklist']>(task.checklist);
  const [newChecklistItem, setNewChecklistItem] = useState('');
  const [editingChecklistId, setEditingChecklistId] = useState<string | null>(null);
  const [editingChecklistContent, setEditingChecklistContent] = useState('');

  const [deleteCommentId, setDeleteCommentId] = useState<string | null>(null);
  const [deleteChecklistItemId, setDeleteChecklistItemId] = useState<string | null>(null);

  const [mutationError, setMutationError] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string>('');

  const [newComment, setNewComment] = useState('');
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editingCommentContent, setEditingCommentContent] = useState('');

  snackbarUseEffect({
    success: Boolean(successMessage),
    error: mutationError,
    setSuccess: () => setSuccessMessage(''),
    setError: setMutationError
  });

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

  const [createChecklistItem] = useMutation(taskChecklistCreateMutation, {
    onCompleted: values => {
      setChecklist(values.taskChecklistCreate.task.checklist);
      setNewChecklistItem('');
      setSuccessMessage('Checklist item added successfully');
    }
  });

  const [editChecklistItem] = useMutation(taskChecklistEditMutation, {
    onCompleted: values => {
      setChecklist(values.taskChecklistEdit.task.checklist);
      setEditingChecklistId(null);
      setEditingChecklistContent('');
      setSuccessMessage('Checklist item updated successfully');
    }
  });

  const [deleteChecklistItem] = useMutation(taskChecklistDeleteMutation, {
    onCompleted: () => {
      setChecklist(checklist.filter(item => item.id !== deleteChecklistItemId));
      setDeleteChecklistItemId(null);
      setSuccessMessage('Checklist item deleted successfully');
    }
  });

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
      setSuccessMessage('Comment added successfully');
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
      if (result.data?.taskCommentEdit?.comments) {
        setComments(result.data.taskCommentEdit.comments);
        setEditingCommentId(null);
        setEditingCommentContent('');
      }
    } catch (error) {
      setMutationError(true);
      setEditingCommentId(null);
      setEditingCommentContent('');
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

  const handleAddChecklistItem = async () => {
    if (!newChecklistItem.trim()) return;
    try {
      await createChecklistItem({
        variables: {
          input: {
            name: newChecklistItem,
            taskId: task.id,
            sortOrder: checklist.length
          }
        }
      });
    } catch (error) {
      setMutationError(true);
    }
  };

  const handleEditChecklistItem = async (itemId: string) => {
    try {
      await editChecklistItem({
        variables: {
          input: {
            id: itemId,
            name: editingChecklistContent
          }
        }
      });
    } catch (error) {
      setMutationError(true);
    }
  };

  const handleDeleteChecklistItem = async (itemId: string) => {
    try {
      await deleteChecklistItem({
        variables: {
          input: {
            id: itemId
          }
        }
      });
    } catch (error) {
      setMutationError(true);
    }
  };

  const handleToggleChecklistItem = async (itemId: string, completed: boolean) => {
    try {
      await editChecklistItem({
        variables: {
          input: {
            id: itemId,
            completed
          }
        }
      });
    } catch (error) {
      setMutationError(true);
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
            {({ handleSubmit, values, setFieldValue, submitForm }) => (
              <Form onSubmit={handleSubmit} style={{ width: '100%' }}>
                <Stack spacing={4} sx={{ width: '100%' }}>
                  <Box sx={{ width: '90%' }}>
                    <FormTextField
                      name="name"
                      label="Task Name"
                      fullWidth
                      autofocus
                      sx={{ mt: 3 }}
                      onChange={() => submitForm()}
                    />
                  </Box>

                  <Box sx={{ width: '90%' }}>
                    <FormTextField
                      name="notes"
                      label="Notes"
                      multiline
                      rows={2}
                      fullWidth
                      onChange={() => submitForm()}
                    />
                  </Box>

                  <Stack direction="row" spacing={2} sx={{ width: '90%' }}>
                    <DateField name="startDate" label="Start Date" onChange={() => submitForm()} />
                    <DateField name="dueDate" label="Due Date" onChange={() => submitForm()} />
                  </Stack>

                  <Stack direction="row" spacing={2} sx={{ width: '90%' }}>
                    <SelectField
                      name="progress"
                      label="Progress"
                      onChange={() => submitForm()}
                      options={progressOptions.map(option => ({
                        label: option.label,
                        value: option.value,
                        icon: option.icon
                      }))}
                    />
                    <SelectField
                      name="priority"
                      label="Priority"
                      onChange={() => submitForm()}
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
                    <Box sx={{ width: '100%', minHeight: '300px' }}>
                      <UserSelect
                        onUserChange={async (assigneeIds: string[]) => {
                          try {
                            await editTask({
                              variables: {
                                input: {
                                  id: task.id,
                                  assigneeIds
                                }
                              }
                            });
                            onSubmit();
                          } catch (error) {
                            setMutationError(true);
                            onError('Failed to edit task');
                          }
                        }}
                        onlyIdentity={mode === 'user'}
                        initialSelectedUsers={task.assignees.map(assignee => assignee.id)}
                      />
                    </Box>
                  </Box>

                  <Divider sx={{ my: 2 }} />

                  <Box sx={{ width: '100%' }}>
                    <Typography variant="subtitle1" sx={{ mb: 2 }}>
                      Checklist
                    </Typography>
                    <Stack spacing={2} sx={{ width: '90%' }}>
                      {checklist.map(item => (
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
                          <IconButton
                            size="small"
                            onClick={() => handleToggleChecklistItem(item.id, !item.completed)}
                            sx={{
                              color: item.completed ? 'success.main' : 'text.secondary',
                              '&:hover': {
                                color: item.completed ? 'success.dark' : 'primary.main',
                                bgcolor: 'action.hover'
                              }
                            }}
                          >
                            {item.completed ? (
                              <CheckCircleRoundedIcon fontSize="small" />
                            ) : (
                              <CheckCircleOutlineRoundedIcon fontSize="small" />
                            )}
                          </IconButton>
                          {editingChecklistId === item.id ? (
                            <Stack direction="row" spacing={1} sx={{ flex: 1 }}>
                              <TextField
                                name="editChecklistItem"
                                label="Edit checklist item"
                                value={editingChecklistContent}
                                onChange={e => setEditingChecklistContent(e.target.value)}
                                onBlur={() => {
                                  if (editingChecklistContent.trim()) {
                                    handleEditChecklistItem(item.id);
                                  } else {
                                    setEditingChecklistId(null);
                                    setEditingChecklistContent('');
                                  }
                                }}
                                onKeyDown={e => {
                                  if (e.key === 'Enter' && editingChecklistContent.trim()) {
                                    handleEditChecklistItem(item.id);
                                  } else if (e.key === 'Escape') {
                                    setEditingChecklistId(null);
                                    setEditingChecklistContent('');
                                  }
                                }}
                                fullWidth
                                autoFocus
                                sx={{
                                  display: 'flex',
                                  '& .MuiOutlinedInput-root': {
                                    border: 'none',
                                    '& fieldset': { borderColor: 'black' },
                                    '&:hover fieldset': { borderColor: 'black' },
                                    '&.Mui-focused fieldset': { borderColor: 'black' }
                                  },
                                  '& .MuiInputLabel-root': {
                                    color: 'black'
                                  },
                                  '& .MuiInputLabel-root.Mui-focused': {
                                    color: 'black'
                                  }
                                }}
                              />
                            </Stack>
                          ) : (
                            <>
                              <Typography sx={{ flex: 1 }}>{item.name}</Typography>
                              <Stack direction="row" spacing={0.5}>
                                <IconButton
                                  size="small"
                                  onClick={() => {
                                    setEditingChecklistId(item.id);
                                    setEditingChecklistContent(item.name);
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
                                  onClick={() => {
                                    setDeleteChecklistItemId(item.id);
                                    handleDeleteChecklistItem(item.id);
                                  }}
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
                            </>
                          )}
                        </Box>
                      ))}
                    </Stack>

                    <Box sx={{ mt: 2, width: '90%', pl: 1 }}>
                      {newChecklistItem ? (
                        <TextField
                          name="newChecklistItem"
                          label="Add checklist item"
                          value={newChecklistItem}
                          onChange={e => setNewChecklistItem(e.target.value)}
                          onBlur={() => {
                            if (newChecklistItem.trim()) {
                              handleAddChecklistItem();
                            } else {
                              setNewChecklistItem('');
                            }
                          }}
                          onKeyDown={e => {
                            if (e.key === 'Enter' && newChecklistItem.trim()) {
                              handleAddChecklistItem();
                            }
                          }}
                          fullWidth
                          autoFocus
                          size="small"
                          variant="outlined"
                          sx={{
                            display: 'flex',
                            '& .MuiOutlinedInput-root': {
                              border: 'none',
                              '& fieldset': { borderColor: 'black' },
                              '&:hover fieldset': { borderColor: 'black' },
                              '&.Mui-focused fieldset': { borderColor: 'black' }
                            },
                            '& .MuiInputLabel-root': {
                              color: 'black'
                            },
                            '& .MuiInputLabel-root.Mui-focused': {
                              color: 'black'
                            }
                          }}
                        />
                      ) : (
                        <IconButton
                          size="small"
                          onClick={() => setNewChecklistItem(' ')}
                          sx={{
                            color: 'text.secondary',
                            '&:hover': {
                              color: 'primary.main',
                              bgcolor: 'action.hover'
                            }
                          }}
                        >
                          <AddCircleOutlineRoundedIcon fontSize="small" />
                        </IconButton>
                      )}
                    </Box>
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
                                onBlur={() => {
                                  if (editingCommentContent.trim()) {
                                    handleEditComment(comment.id);
                                  } else {
                                    setEditingCommentId(null);
                                    setEditingCommentContent('');
                                  }
                                }}
                                onKeyDown={e => {
                                  if (
                                    e.key === 'Enter' &&
                                    !e.shiftKey &&
                                    editingCommentContent.trim()
                                  ) {
                                    e.preventDefault();
                                    handleEditComment(comment.id);
                                  } else if (e.key === 'Escape') {
                                    setEditingCommentId(null);
                                    setEditingCommentContent('');
                                  }
                                }}
                                inputRef={input => {
                                  if (input) {
                                    input.focus();
                                    input.setSelectionRange(input.value.length, input.value.length);
                                  }
                                }}
                                sx={{
                                  display: 'flex',
                                  '& .MuiOutlinedInput-root': {
                                    border: 'none',
                                    '& fieldset': { borderColor: 'black' },
                                    '&:hover fieldset': { borderColor: 'black' },
                                    '&.Mui-focused fieldset': { borderColor: 'black' }
                                  },
                                  '& .MuiInputLabel-root': {
                                    color: 'black'
                                  },
                                  '& .MuiInputLabel-root.Mui-focused': {
                                    color: 'black'
                                  }
                                }}
                                multiline
                                rows={2}
                                fullWidth
                                autoFocus
                              />
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
                                {identity != null && comment.author.id === identity.id && (
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
                                )}
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
                          onBlur={() => {
                            if (newComment.trim()) {
                              handleAddComment();
                            } else {
                              setNewComment('');
                            }
                          }}
                          onKeyDown={e => {
                            if (e.key === 'Enter' && !e.shiftKey && newComment.trim()) {
                              e.preventDefault();
                              handleAddComment();
                            }
                          }}
                          sx={{
                            display: 'flex',
                            '& .MuiOutlinedInput-root': {
                              border: 'none',
                              '& fieldset': { borderColor: 'black' },
                              '&:hover fieldset': { borderColor: 'black' },
                              '&.Mui-focused fieldset': { borderColor: 'black' }
                            },
                            '& .MuiInputLabel-root': {
                              color: 'black'
                            },
                            '& .MuiInputLabel-root.Mui-focused': {
                              color: 'black'
                            }
                          }}
                        />
                      </Stack>
                    </Box>
                  </Box>
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
      <SnackBarSuccess
        open={Boolean(successMessage)}
        successMsg={successMessage}
        setSuccess={() => setSuccessMessage('')}
      />
    </Dialog>
  );
}
