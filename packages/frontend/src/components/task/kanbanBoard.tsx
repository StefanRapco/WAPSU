import DeleteIcon from '@mui/icons-material/Delete';
import { Box, IconButton, Paper, Stack, TextField, Tooltip, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useEffect, useRef, useState } from 'react';
import { DragDropContext, Draggable, Droppable, DropResult } from 'react-beautiful-dnd';
import { Bucket, Task } from '../../gql-generated/graphql';
import { Button } from '../button';
import { ConfirmDialog } from '../confirmDialog';
import { TaskCard } from '../taskCard';
import { CreateBucketButton } from './createBucketButton';
import { CreateTaskCard } from './createTaskCard';

interface KanbanBoardProps {
  readonly buckets: Bucket[];
  readonly disabled?: boolean;
  readonly onTaskEdit: (task: Task) => void;
  readonly onTaskDelete: (task: Task) => void;
  readonly onChecklistItemToggle: (item: any) => void;
  readonly onViewComments: (task: Task) => void;
  readonly onCreateTask: (bucketId: string, name: string) => void;
  readonly onTaskMove: (taskId: string, destinationBucketId: string, sortOrder: number) => void;
  readonly onCreateBucket: (name: string) => void;
  readonly onBucketMove: (bucketId: string, sortOrder: number) => void;
  readonly onBucketEdit: (bucketId: string, name: string) => void;
  readonly onBucketDelete: (bucketId: string) => void;
  readonly onSuccess?: (message: string) => void;
}

function EmptyState({ onCreateBucket }: { onCreateBucket: (name: string) => void }) {
  const theme = useTheme();

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'left',
        py: 8,
        px: 4,
        bgcolor: 'grey.50',
        borderRadius: 2,
        border: `1px dashed ${theme.palette.grey[300]}`,
        width: '100%',
        maxWidth: 400,
        mt: 4
      }}
    >
      <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
        No Buckets Yet
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 4, textAlign: 'center' }}>
        Create your first bucket to start organizing your tasks!
      </Typography>
      <CreateBucketButton onCreateBucket={onCreateBucket} />
    </Box>
  );
}

export function KanbanBoard(props: KanbanBoardProps) {
  const [creatingTaskInBucket, setCreatingTaskInBucket] = useState<string | null>(null);
  const [editingBucketId, setEditingBucketId] = useState<string | null>(null);
  const [editingBucketName, setEditingBucketName] = useState('');
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [bucketToDelete, setBucketToDelete] = useState<Bucket | null>(null);
  const textFieldRef = useRef<HTMLInputElement>(null);
  const theme = useTheme();

  useEffect(() => {
    if (editingBucketId && textFieldRef.current) {
      textFieldRef.current.focus();
    }
  }, [editingBucketId]);

  const handleDragEnd = (result: DropResult) => {
    if (props.disabled) return;

    const { destination, draggableId, type } = result;

    if (destination == null) return;

    if (type === 'COLUMN') {
      props.onBucketMove(draggableId, destination.index);
      return;
    }

    props.onTaskMove(draggableId, destination.droppableId, destination.index);
  };

  const handleBucketNameEdit = (bucketId: string, currentName: string) => {
    setEditingBucketId(bucketId);
    setEditingBucketName(currentName);
  };

  const handleBucketDelete = (bucket: Bucket) => {
    setBucketToDelete(bucket);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (bucketToDelete) {
      props.onBucketDelete(bucketToDelete.id);
      setIsDeleteDialogOpen(false);
      setBucketToDelete(null);
    }
  };

  if (props.buckets.length === 0 && !props.disabled) {
    return <EmptyState onCreateBucket={props.onCreateBucket} />;
  }

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Droppable
        droppableId="all-columns"
        direction="horizontal"
        type="COLUMN"
        isDropDisabled={props.disabled}
      >
        {provided => (
          <Box
            ref={provided.innerRef}
            {...provided.droppableProps}
            sx={{
              display: 'flex',
              gap: 6,
              p: 3,
              overflowX: 'auto',
              '&::-webkit-scrollbar': {
                height: '8px'
              },
              '&::-webkit-scrollbar-track': {
                background: theme.palette.grey[100],
                borderRadius: '4px'
              },
              '&::-webkit-scrollbar-thumb': {
                background: theme.palette.grey[300],
                borderRadius: '4px',
                '&:hover': {
                  background: theme.palette.grey[400]
                }
              }
            }}
          >
            {props.buckets.map((bucket, index) => (
              <Draggable
                key={bucket.id}
                draggableId={bucket.id}
                index={index}
                isDragDisabled={props.disabled}
              >
                {(provided, snapshot) => (
                  <Box
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    sx={{
                      minWidth: 320,
                      maxWidth: 320,
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 2,
                      transform: snapshot.isDragging
                        ? provided.draggableProps?.style?.transform
                        : 'none'
                    }}
                  >
                    <Stack
                      direction="row"
                      alignItems="center"
                      spacing={3}
                      {...provided.dragHandleProps}
                      sx={{ width: '100%', justifyContent: 'space-between' }}
                    >
                      <Stack direction="row" spacing={1} alignItems="center">
                        {editingBucketId === bucket.id ? (
                          <TextField
                            inputRef={textFieldRef}
                            size="small"
                            value={editingBucketName}
                            onChange={e => setEditingBucketName(e.target.value)}
                            onBlur={() => {
                              if (editingBucketName.trim()) {
                                props.onBucketEdit(bucket.id, editingBucketName);
                              }
                              setEditingBucketId(null);
                            }}
                            onKeyDown={e => {
                              if (e.key === 'Enter' && editingBucketName.trim()) {
                                props.onBucketEdit(bucket.id, editingBucketName);
                                setEditingBucketId(null);
                              }
                              if (e.key === 'Escape') {
                                setEditingBucketId(null);
                              }
                            }}
                            placeholder="Enter bucket name..."
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
                        ) : (
                          <Typography
                            variant="h6"
                            fontWeight={600}
                            onClick={() => handleBucketNameEdit(bucket.id, bucket.name)}
                            sx={{
                              cursor: 'pointer',
                              '&:hover': { opacity: 0.7 },
                              maxWidth: 200,
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap'
                            }}
                          >
                            {bucket.name}
                          </Typography>
                        )}
                        <Tooltip
                          title={`${bucket.tasks.length < 9 ? bucket.tasks.length : '9+'} tasks`}
                          placement="right"
                        >
                          <Typography
                            variant="body2"
                            sx={{
                              color: theme.palette.grey[600],
                              bgcolor: theme.palette.grey[100],
                              px: 3,
                              py: 0.5,
                              borderRadius: 1
                            }}
                          >
                            {bucket.tasks.length <= 9 ? bucket.tasks.length : '9+'}
                          </Typography>
                        </Tooltip>
                      </Stack>
                      <Tooltip title="Delete bucket">
                        <IconButton
                          size="small"
                          onClick={() => handleBucketDelete(bucket)}
                          sx={{
                            color: 'text.secondary',
                            '&:hover': {
                              color: 'error.main',
                              bgcolor: 'error.50'
                            }
                          }}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Stack>

                    <Button
                      buttonText="Add Task"
                      onClick={() => setCreatingTaskInBucket(bucket.id)}
                      size="small"
                      sx={{
                        mb: 3,
                        bgcolor: theme.palette.primary[50],
                        '&:hover': {
                          bgcolor: theme.palette.primary[100]
                        }
                      }}
                    />

                    <Paper
                      elevation={1}
                      sx={{
                        height: 1100,
                        display: 'flex',
                        flexDirection: 'column',
                        border: `1px solid ${theme.palette.grey[200]}`,
                        borderRadius: 2,
                        bgcolor: theme.palette.background.paper,
                        overflow: 'hidden',
                        boxShadow: `0 2px 4px ${theme.palette.grey[200]}`
                      }}
                    >
                      <Droppable
                        droppableId={bucket.id}
                        type="TASK"
                        isDropDisabled={props.disabled}
                      >
                        {(provided, snapshot) => (
                          <Box
                            ref={provided.innerRef}
                            {...provided.droppableProps}
                            sx={{
                              height: '100%',
                              overflowY: 'auto',
                              p: 2,
                              display: 'flex',
                              flexDirection: 'column',
                              gap: 2,
                              bgcolor: snapshot.isDraggingOver
                                ? theme.palette.grey[100]
                                : 'transparent',
                              transition: 'background-color 0.2s ease',
                              '&::-webkit-scrollbar': {
                                width: '8px'
                              },
                              '&::-webkit-scrollbar-track': {
                                background: 'transparent'
                              },
                              '&::-webkit-scrollbar-thumb': {
                                background: theme.palette.grey[300],
                                borderRadius: '4px',
                                '&:hover': {
                                  background: theme.palette.grey[400]
                                }
                              }
                            }}
                          >
                            {creatingTaskInBucket === bucket.id && (
                              <CreateTaskCard
                                onCreateTask={name => {
                                  props.onCreateTask(bucket.id, name);
                                  setCreatingTaskInBucket(null);
                                }}
                                onCancel={() => setCreatingTaskInBucket(null)}
                              />
                            )}
                            {bucket.tasks.map((task, index) => (
                              <Draggable
                                key={task.id}
                                draggableId={task.id}
                                index={index}
                                isDragDisabled={props.disabled}
                              >
                                {(provided, snapshot) => (
                                  <Box
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                    sx={{
                                      transform: snapshot.isDragging
                                        ? provided.draggableProps?.style?.transform
                                        : 'none'
                                    }}
                                  >
                                    <TaskCard
                                      task={task}
                                      onEdit={() => props.onTaskEdit(task)}
                                      onDelete={() => props.onTaskDelete(task)}
                                      onChecklistItemToggle={props.onChecklistItemToggle}
                                      onSuccess={props.onSuccess}
                                    />
                                  </Box>
                                )}
                              </Draggable>
                            ))}
                            {provided.placeholder}
                          </Box>
                        )}
                      </Droppable>
                    </Paper>
                  </Box>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
            {props.buckets.length > 0 && !props.disabled && (
              <Box sx={{ minWidth: 320, maxWidth: 320, p: 2 }}>
                <CreateBucketButton onCreateBucket={props.onCreateBucket} />
              </Box>
            )}
          </Box>
        )}
      </Droppable>
      <ConfirmDialog
        open={isDeleteDialogOpen}
        onClose={() => {
          setIsDeleteDialogOpen(false);
          setBucketToDelete(null);
        }}
        onConfirm={handleConfirmDelete}
        title="Delete Bucket"
        message={`Are you sure you want to delete bucket "${bucketToDelete?.name}"? 
        This will also delete all tasks in this bucket and their associated data: (comments, checklists, et cetera). 
        This action cannot be undone.`}
      />
    </DragDropContext>
  );
}
