import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import {
  AvatarGroup,
  Card,
  CardContent,
  Checkbox,
  IconButton,
  Stack,
  Typography
} from '@mui/material';
import { format } from 'date-fns';
import { ReactNode } from 'react';
import { Task, TaskChecklist } from '../gql-generated/graphql';
import { Badge } from './badge';
import { Button } from './button';
import { getInitials } from './navigation/accountMenu';
import { CircularAvatar } from './navigation/circularAvatar';

interface TaskCardProps {
  readonly task: Task;
  readonly onEdit?: (task: Task) => void;
  readonly onDelete?: (task: Task) => void;
  readonly onChecklistItemToggle?: (item: TaskChecklist) => void;
  readonly onViewComments?: (task: Task) => void;
  readonly isEditing?: boolean;
  readonly customContent?: ReactNode;
}

export function TaskCard({
  task,
  onEdit,
  onDelete,
  onChecklistItemToggle,
  onViewComments,
  isEditing = false,
  customContent
}: TaskCardProps) {
  if (isEditing) {
    return (
      <Card
        sx={{
          bgcolor: 'background.paper',
          border: '1px solid',
          borderColor: 'grey.200',
          borderRadius: 2,
          '&:hover': {
            borderColor: 'grey.300'
          }
        }}
      >
        <CardContent sx={{ p: 2 }}>{customContent}</CardContent>
      </Card>
    );
  }

  return (
    <Card
      sx={{
        bgcolor: 'background.paper',
        border: '1px solid',
        borderColor: 'grey.200',
        borderRadius: 2,
        '&:hover': {
          borderColor: 'grey.300'
        }
      }}
    >
      <CardContent sx={{ p: 2 }}>
        <Stack spacing={2}>
          <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
            <Typography variant="body1" fontWeight={500}>
              {task.name}
            </Typography>
            <Stack direction="row" spacing={1}>
              {onEdit && (
                <IconButton size="small" onClick={() => onEdit(task)}>
                  <EditIcon fontSize="small" />
                </IconButton>
              )}
              {onDelete && (
                <IconButton size="small" onClick={() => onDelete(task)}>
                  <DeleteIcon fontSize="small" />
                </IconButton>
              )}
            </Stack>
          </Stack>

          {task.notes && (
            <Typography variant="body2" color="text.secondary">
              {task.notes}
            </Typography>
          )}

          {task.checklist.length > 0 && (
            <Stack spacing={1}>
              {task.checklist.map(item => (
                <Stack key={item.id} direction="row" spacing={1} alignItems="center">
                  <Checkbox
                    size="small"
                    checked={item.completed}
                    onChange={() => onChecklistItemToggle?.(item)}
                  />
                  <Typography
                    variant="body2"
                    sx={{
                      textDecoration: item.completed ? 'line-through' : 'none',
                      color: item.completed ? 'text.disabled' : 'text.primary'
                    }}
                  >
                    {item.name}
                  </Typography>
                </Stack>
              ))}
            </Stack>
          )}

          <Stack direction="row" spacing={2} alignItems="center">
            {task.assignees.length > 0 && (
              <AvatarGroup max={3} sx={{ '& .MuiAvatar-root': { width: 24, height: 24 } }}>
                {task.assignees.map(assignee => (
                  <CircularAvatar key={assignee.id} size="s">
                    {getInitials(`${assignee.firstName} ${assignee.lastName}`)}
                  </CircularAvatar>
                ))}
              </AvatarGroup>
            )}

            {task.dueDate && (
              <Typography variant="caption" color="text.secondary">
                Due {format(new Date(task.dueDate), 'MMM d, yyyy')}
              </Typography>
            )}

            {task.comments.length > 0 && (
              <Button
                buttonText={`${task.comments.length} comments`}
                onClick={() => onViewComments?.(task)}
                size="small"
                variant="text"
              />
            )}
          </Stack>

          <Stack direction="row" spacing={1}>
            <Badge notification={task.progress.label} />
            <Badge notification={task.priority.label} />
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
}
