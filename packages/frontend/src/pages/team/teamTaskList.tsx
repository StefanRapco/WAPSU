import DeleteIcon from '@mui/icons-material/Delete';
import {
  Box,
  Checkbox,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Paper
} from '@mui/material';
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { SectionHeader } from '../../components/header';
import { Typography } from '../../components/typography';
import { useTeamOne } from '../../hooks/useTeamOne';

export function TeamTaskList() {
  const { id } = useParams<{ id: string }>();

  if (id == null) throw new Error('Team ID is required');

  const { data } = useTeamOne(id);

  const [tasks, setTasks] = useState([
    { id: 1, name: 'Complete project report', dueDate: '2025-03-10', completed: false },
    { id: 2, name: 'Prepare presentation for meeting', dueDate: '2025-03-12', completed: false },
    { id: 3, name: 'Respond to emails', dueDate: '2025-03-07', completed: true }
  ]);

  const handleToggleCompleted = (taskId: number) => {
    setTasks(
      tasks.map(task => (task.id === taskId ? { ...task, completed: !task.completed } : task))
    );
  };

  const handleDeleteTask = (taskId: number) => {
    setTasks(tasks.filter(task => task.id !== taskId));
  };

  if (data == null) return null;

  return (
    <>
      <Grid container spacing={9}>
        <Grid item xs={12}>
          <SectionHeader
            breadcrumbs={[
              { label: 'Teams', to: '/teams' },
              { label: data.name, to: `/teams/${id}` },
              { label: 'Team tasks' }
            ]}
          >
            Team tasks
          </SectionHeader>
        </Grid>

        <Grid item xs={12}>
          <Typography>
            Stay organized by setting deadlines, prioritizing your tasks, and completing them one by
            one. You'll be more productive and focused as you accomplish each item on your list!
          </Typography>
        </Grid>

        <Grid item xs={12}>
          <Box>
            <Paper elevation={3} sx={{ padding: 3 }}>
              <Typography variant="h5" gutterBottom>
                Team Tasks
              </Typography>

              <List>
                {tasks.map(task => (
                  <ListItem key={task.id} sx={{ display: 'flex', alignItems: 'center' }}>
                    <Checkbox
                      checked={task.completed}
                      onChange={() => handleToggleCompleted(task.id)}
                      sx={{ marginRight: 2 }}
                    />
                    <ListItemText
                      primary={task.name}
                      secondary={`Due: ${task.dueDate}`}
                      sx={{
                        textDecoration: task.completed ? 'line-through' : 'none',
                        color: task.completed ? 'gray' : 'black'
                      }}
                    />
                    <IconButton onClick={() => handleDeleteTask(task.id)} color="error">
                      <DeleteIcon />
                    </IconButton>
                  </ListItem>
                ))}
              </List>

              {tasks.length === 0 && (
                <Typography variant="body1" sx={{ marginTop: 2, color: 'gray' }}>
                  No tasks available. Start adding some tasks to stay organized.
                </Typography>
              )}
            </Paper>
          </Box>
        </Grid>
      </Grid>
    </>
  );
}
