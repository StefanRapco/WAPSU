import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import CommentIcon from '@mui/icons-material/Comment';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import FlagIcon from '@mui/icons-material/Flag';
import NotStartedIcon from '@mui/icons-material/NotStarted';
import PersonIcon from '@mui/icons-material/Person';
import PlayCircleIcon from '@mui/icons-material/PlayCircle';
import PriorityHighIcon from '@mui/icons-material/PriorityHigh';
import {
  Avatar,
  AvatarGroup,
  Box,
  Card,
  CardContent,
  Checkbox,
  IconButton,
  Stack,
  Tooltip,
  Typography,
  alpha,
  useTheme
} from '@mui/material';
import { format } from 'date-fns';
import { ReactNode } from 'react';
import { Task, TaskChecklist } from '../gql-generated/graphql';
import { getInitials } from './navigation/accountMenu';
import { CircularAvatar } from './navigation/circularAvatar';

interface TaskCardProps {
  readonly task: Task;
  readonly onEdit?: (task: Task) => void;
  readonly onDelete?: (task: Task) => void;
  readonly onChecklistItemToggle?: (item: TaskChecklist) => void;
  readonly isEditing?: boolean;
  readonly customContent?: ReactNode;
  readonly onSuccess?: (message: string) => void;
}

export function TaskCard({
  task,
  onEdit,
  onDelete,
  onChecklistItemToggle,
  isEditing = false,
  customContent,
  onSuccess
}: TaskCardProps) {
  const theme = useTheme();
  const remainingMembers = task.assignees.length - 4;

  if (isEditing) {
    return (
      <Card
        sx={{
          bgcolor: theme.palette.background.paper,
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

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return theme.palette.error.main;
      case 'high':
        return theme.palette.error.main;
      case 'medium':
        return theme.palette.warning.main;
      default:
        return theme.palette.success.main;
    }
  };

  const getProgressColor = (progress: string) => {
    switch (progress) {
      case 'completed':
        return theme.palette.success.main;
      case 'inProgress':
        return theme.palette.error.main;
      default:
        return theme.palette.warning.main;
    }
  };

  const getProgressIcon = (progress: string) => {
    switch (progress) {
      case 'completed':
        return <CheckCircleRoundedIcon sx={{ fontSize: 16 }} />;
      case 'inProgress':
        return <PlayCircleIcon sx={{ fontSize: 16 }} />;
      default:
        return <NotStartedIcon sx={{ fontSize: 16 }} />;
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return <PriorityHighIcon sx={{ fontSize: 16 }} />;
      case 'high':
      case 'medium':
      case 'low':
        return <FlagIcon sx={{ fontSize: 16 }} />;
      default:
        return <FlagIcon sx={{ fontSize: 16 }} />;
    }
  };

  return (
    <Card
      sx={{
        bgcolor: alpha(theme.palette.background.paper, 0.8),
        backdropFilter: 'blur(8px)',
        border: '1px solid',
        borderColor: alpha(theme.palette.divider, 0.1),
        borderRadius: 2,
        transition: 'all 0.3s ease',
        position: 'relative',
        overflow: 'visible',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
          borderColor: alpha(theme.palette.divider, 0.2),
          '& .task-actions': {
            opacity: 1
          }
        },
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          width: 4,
          height: '100%',
          bgcolor: getPriorityColor(task.priority.value),
          borderTopLeftRadius: 8,
          borderBottomLeftRadius: 8
        }
      }}
    >
      <CardContent sx={{ pt: 2.5, pl: 3, mb: -5, height: '100%' }}>
        <Stack spacing={2.5} height="100%">
          <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
            <Typography
              variant="body1"
              fontWeight={600}
              sx={{
                color: theme => theme.palette.neutral.main,
                maxWidth: '80%',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                fontSize: '1rem'
              }}
            >
              {task.name}
            </Typography>
            <Stack
              direction="row"
              spacing={0.5}
              className="task-actions"
              sx={{
                opacity: 0,
                transition: 'opacity 0.2s ease'
              }}
            >
              {onEdit && (
                <Tooltip title="Edit task">
                  <IconButton
                    size="small"
                    onClick={() => onEdit(task)}
                    sx={{
                      color: theme.palette.text.secondary,
                      '&:hover': {
                        color: theme.palette.primary.main,
                        bgcolor: alpha(theme.palette.primary.main, 0.1)
                      }
                    }}
                  >
                    <EditIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              )}
              {onDelete && (
                <Tooltip title="Delete task">
                  <IconButton
                    size="small"
                    onClick={() => onDelete(task)}
                    sx={{
                      color: theme.palette.text.secondary,
                      '&:hover': {
                        color: theme.palette.error.main,
                        bgcolor: alpha(theme.palette.error.main, 0.1)
                      }
                    }}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              )}
            </Stack>
          </Stack>

          {task.notes ? (
            <Typography
              variant="body2"
              sx={{
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                lineHeight: 1.4,
                fontSize: '0.875rem',
                color: theme.palette.text.secondary
              }}
            >
              {task.notes}
            </Typography>
          ) : (
            <Typography
              variant="body2"
              sx={{
                color: theme.palette.text.disabled,
                fontSize: '0.875rem',
                fontStyle: 'italic'
              }}
            >
              No description provided
            </Typography>
          )}

          {task.checklist.length > 0 ? (
            <Stack spacing={1}>
              {task.checklist.map(item => (
                <Stack
                  key={item.id}
                  direction="row"
                  spacing={1}
                  alignItems="center"
                  sx={{
                    bgcolor: item.completed
                      ? alpha(theme.palette.success.main, 0.1)
                      : 'transparent',
                    p: 0.5,
                    borderRadius: 1,
                    transition: 'background-color 0.2s ease'
                  }}
                >
                  <Checkbox
                    size="small"
                    checked={item.completed}
                    onChange={() => {
                      onChecklistItemToggle?.(item);
                      onSuccess?.('Checklist item updated successfully');
                    }}
                    sx={{
                      color: 'black',
                      '&.Mui-checked': {
                        color: theme.palette.success.main
                      }
                    }}
                  />
                  <Typography
                    variant="body2"
                    sx={{
                      textDecoration: item.completed ? 'line-through' : 'none',
                      color: item.completed
                        ? theme.palette.text.disabled
                        : theme.palette.text.secondary,
                      flex: 1,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      fontSize: '0.875rem'
                    }}
                  >
                    {item.name}
                  </Typography>
                </Stack>
              ))}
            </Stack>
          ) : (
            <Typography
              variant="body2"
              sx={{
                color: theme.palette.text.disabled,
                fontSize: '0.875rem',
                fontStyle: 'italic'
              }}
            >
              No checklist items
            </Typography>
          )}

          <Stack
            direction="row"
            spacing={0.5}
            alignItems="center"
            flexWrap="wrap"
            gap={1}
            sx={{
              pt: 1,
              borderTop: '1px solid',
              borderColor: alpha(theme.palette.divider, 0.1)
            }}
          >
            {task.assignees.length > 0 ? (
              <>
                <AvatarGroup
                  sx={{
                    '& .MuiAvatar-root': {
                      width: 28,
                      height: 28,
                      border: '2px solid white',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                      transition: 'transform 0.2s ease',
                      '&:hover': {
                        transform: 'scale(1.1)',
                        zIndex: 2
                      },
                      marginLeft: '-5px'
                    }
                  }}
                >
                  {task.assignees.slice(0, 4).map(assignee => (
                    <Tooltip
                      key={assignee.id}
                      title={
                        <Box sx={{ p: 1 }}>
                          <Stack direction="row" spacing={2} alignItems="center">
                            <Avatar
                              alt={`${assignee.firstName} ${assignee.lastName}`}
                              sx={{ width: 40, height: 40 }}
                            >
                              <CircularAvatar size="s">
                                {getInitials(`${assignee.firstName} ${assignee.lastName}`)}
                              </CircularAvatar>
                            </Avatar>
                            <Box>
                              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                {assignee.firstName} {assignee.lastName}
                              </Typography>
                              <Typography variant="caption" color="textSecondary">
                                {assignee.email}
                              </Typography>
                            </Box>
                          </Stack>
                        </Box>
                      }
                      arrow
                      componentsProps={{
                        tooltip: {
                          sx: {
                            bgcolor: 'background.paper',
                            color: 'text.primary',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                            '& .MuiTooltip-arrow': {
                              color: 'background.paper'
                            }
                          }
                        }
                      }}
                    >
                      <Avatar
                        alt={`${assignee.firstName} ${assignee.lastName}`}
                        sx={{ width: 32, height: 32 }}
                      >
                        <CircularAvatar size="s">
                          {getInitials(`${assignee.firstName} ${assignee.lastName}`)}
                        </CircularAvatar>
                      </Avatar>
                    </Tooltip>
                  ))}
                </AvatarGroup>

                {remainingMembers > 0 && (
                  <>
                    <Tooltip
                      title={
                        <Box sx={{ p: 1 }}>
                          <Stack direction="row" spacing={2} alignItems="center">
                            <Box>
                              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                {`+${remainingMembers} assignees`}
                              </Typography>
                            </Box>
                          </Stack>
                        </Box>
                      }
                      arrow
                      componentsProps={{
                        tooltip: {
                          sx: {
                            bgcolor: 'background.paper',
                            color: 'text.primary',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                            '& .MuiTooltip-arrow': {
                              color: 'background.paper'
                            }
                          }
                        }
                      }}
                    >
                      <Avatar
                        sx={{
                          width: 32,
                          height: 32,
                          marginLeft: '-12px'
                        }}
                      >
                        <CircularAvatar size="s">
                          {remainingMembers <= 9 ? `+${remainingMembers}` : '9+'}
                        </CircularAvatar>
                      </Avatar>
                    </Tooltip>
                  </>
                )}
              </>
            ) : (
              <Stack direction="row" spacing={1} alignItems="center">
                <PersonIcon sx={{ fontSize: 16, color: theme.palette.text.disabled }} />
                <Typography
                  variant="body2"
                  sx={{
                    color: theme.palette.text.disabled,
                    fontSize: '0.75rem'
                  }}
                >
                  No assignees
                </Typography>
              </Stack>
            )}

            {task.dueDate ? (
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 0.5,
                  px: 1.5,
                  py: 0.5,
                  borderRadius: 1,
                  bgcolor:
                    new Date(task.dueDate) < new Date()
                      ? alpha(theme.palette.error.main, 0.1)
                      : alpha(theme.palette.grey[100], 0.8),
                  color:
                    new Date(task.dueDate) < new Date()
                      ? theme.palette.error.main
                      : theme.palette.text.secondary
                }}
              >
                <CalendarTodayIcon sx={{ fontSize: 16 }} />
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: 500,
                    fontSize: '0.75rem'
                  }}
                >
                  {format(new Date(task.dueDate), 'MMM d, yyyy')}
                </Typography>
              </Box>
            ) : (
              <Stack direction="row" spacing={1} alignItems="center">
                <CalendarTodayIcon sx={{ fontSize: 16, color: theme.palette.text.disabled }} />
                <Typography
                  variant="body2"
                  sx={{
                    color: theme.palette.text.disabled,
                    fontSize: '0.75rem'
                  }}
                >
                  No due date
                </Typography>
              </Stack>
            )}

            {task.comments.length > 0 ? (
              <Stack direction="row" spacing={1} alignItems="center">
                <Typography
                  variant="body2"
                  sx={{
                    color: 'black',
                    fontSize: '0.75rem'
                  }}
                >
                  {`${task.comments.length <= 9 ? task.comments.length : '9+'}`}
                </Typography>
                <CommentIcon sx={{ fontSize: 16, color: theme.palette.text.disabled }} />
              </Stack>
            ) : (
              <Stack direction="row" spacing={1} alignItems="center">
                <CommentIcon sx={{ fontSize: 16, color: theme.palette.text.disabled }} />
                <Typography
                  variant="body2"
                  sx={{
                    color: theme.palette.text.disabled,
                    fontSize: '0.75rem'
                  }}
                >
                  No comments
                </Typography>
              </Stack>
            )}
          </Stack>

          <Stack
            direction="row"
            spacing={1}
            flexWrap="wrap"
            gap={1}
            sx={{
              pt: 2,
              borderTop: '1px solid',
              borderColor: alpha(theme.palette.divider, 0.1)
            }}
          >
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 0.5,
                px: 1.5,
                py: 0.75,
                borderRadius: 1.5,
                bgcolor: alpha(getProgressColor(task.progress.value), 0.1),
                color: getProgressColor(task.progress.value),
                border: '1px solid',
                borderColor: alpha(getProgressColor(task.progress.value), 0.2),
                transition: 'all 0.2s ease',
                '&:hover': {
                  bgcolor: alpha(getProgressColor(task.progress.value), 0.15),
                  transform: 'translateY(-1px)'
                }
              }}
            >
              {getProgressIcon(task.progress.value)}
              <Typography
                variant="body2"
                sx={{
                  fontWeight: 600,
                  fontSize: '0.75rem',
                  letterSpacing: '0.02em'
                }}
              >
                {task.progress.label}
              </Typography>
            </Box>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 0.5,
                px: 1.5,
                py: 0.75,
                borderRadius: 1.5,
                bgcolor: alpha(getPriorityColor(task.priority.value), 0.1),
                color: getPriorityColor(task.priority.value),
                border: '1px solid',
                borderColor: alpha(getPriorityColor(task.priority.value), 0.2),
                transition: 'all 0.2s ease',
                '&:hover': {
                  bgcolor: alpha(getPriorityColor(task.priority.value), 0.15),
                  transform: 'translateY(-1px)'
                }
              }}
            >
              {getPriorityIcon(task.priority.value)}
              <Typography
                variant="body2"
                sx={{
                  fontWeight: 600,
                  fontSize: '0.75rem',
                  letterSpacing: '0.02em'
                }}
              >
                {task.priority.label}
              </Typography>
            </Box>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
}
