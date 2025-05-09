import AccessTimeIcon from '@mui/icons-material/AccessTime';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import AssignmentIcon from '@mui/icons-material/Assignment';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import GroupIcon from '@mui/icons-material/Group';
import SettingsIcon from '@mui/icons-material/Settings';
import WarningIcon from '@mui/icons-material/Warning';
import { Box, Grid, Paper, Stack } from '@mui/material';
import { Form, Formik } from 'formik';
import { ReactNode, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import * as yup from 'yup';
import { Button } from '../../components/button';
import { ToolCard } from '../../components/dashboardCards';
import { Drawer } from '../../components/drawer';
import { SectionHeader } from '../../components/header';
import { SnackbarError } from '../../components/snackbarError';
import { SnackBarSuccess } from '../../components/snackbarSuccess';
import { TextField } from '../../components/textField';
import { Typography } from '../../components/typography';
import { useTaskMany } from '../../hooks/useTaskMany';
import { useTeamEdit } from '../../hooks/useTeamEdit';
import { useTeamOne } from '../../hooks/useTeamOne';
import analyticsImage from '../../images/analytics.png';
import { teamAvatarsArray } from '../../images/images';
import settingsImage from '../../images/settings.png';
import tasksImage from '../../images/tasks.png';
import teamsImage from '../../images/teams.png';

const validationSchema = yup.object({
  name: yup.string().required('Name is required'),
  description: yup.string(),
  avatar: yup.string().required('Avatar is required')
});

export function TeamOverview(): ReactNode {
  const { id } = useParams<{ id: string }>();
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string }>({
    open: false,
    message: ''
  });
  const [mutationError, setMutationError] = useState<boolean>(false);
  const navigate = useNavigate();

  if (id == null) throw new Error('Team ID is required');

  const { data: team, refetch } = useTeamOne(id);
  const { editTeam, loading, error } = useTeamEdit();

  const taskMany = useTaskMany({ teamId: id });

  const handleSubmit = async (values: { name: string; description: string; avatar: string }) => {
    if (team == null) return;
    try {
      await editTeam(
        id,
        values.name ?? undefined,
        values.description == null || values.description === ''
          ? null
          : team.description === values.description
            ? undefined
            : values.description,
        values.avatar ?? undefined
      );
      setIsDrawerOpen(false);
      refetch();
      setSnackbar({ open: true, message: 'Team updated successfully' });
    } catch (err) {
      setMutationError(true);
    }
  };

  if (team == null) return null;

  return (
    <>
      <Grid container spacing={9}>
        <Grid item xs={12}>
          <SectionHeader
            breadcrumbs={[
              { label: 'Teams', to: '/teams' },
              { label: team.name, to: `/teams/${id}` },
              { label: 'Team overview' }
            ]}
            action={<Button buttonText="Edit team" onClick={() => setIsDrawerOpen(true)} />}
          >
            <Stack direction="row" alignItems="center" gap={2} spacing={3}>
              <Typography variant="h2" fontWeight={700}>
                {team.name}
              </Typography>
              <Grid item key={team.id}>
                <Box
                  component="img"
                  src={teamAvatarsArray.find(avatar => avatar.id === team.avatar)?.src}
                  sx={{
                    width: 60,
                    height: 60,
                    borderRadius: '50%',
                    cursor: 'pointer',
                    '&:hover': {
                      opacity: 0.8
                    }
                  }}
                />
              </Grid>
            </Stack>
          </SectionHeader>
        </Grid>

        <Grid item xs={12}>
          <Typography>{team.description ?? 'No description found...'}</Typography>
        </Grid>

        {/* Enhanced Tasks Overview */}
        <Grid item xs={12}>
          <Paper elevation={0} sx={{ p: 4, bgcolor: 'background.paper' }}>
            <Stack spacing={3}>
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Typography variant="h5" fontWeight="600">
                  Tasks Overview
                </Typography>
              </Stack>

              <Box sx={{ width: '100%' }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1}>
                  <Typography variant="body2" color="text.secondary">
                    Overall Progress
                  </Typography>
                </Stack>
              </Box>

              <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                  <Paper
                    elevation={0}
                    sx={{
                      p: 4,
                      bgcolor: '#00b359',
                      color: 'white',
                      borderRadius: 2,
                      transition: 'all 0.3s ease',
                      position: 'relative',
                      overflow: 'hidden',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: '0 8px 24px rgba(0, 179, 89, 0.2)',
                        '& .task-icon': {
                          transform: 'scale(1.1) rotate(-5deg)',
                          opacity: 0.2
                        }
                      }
                    }}
                  >
                    <Box
                      className="task-icon"
                      sx={{
                        position: 'absolute',
                        right: -20,
                        top: -20,
                        opacity: 0.15,
                        transition: 'all 0.3s ease'
                      }}
                    >
                      <CheckCircleIcon sx={{ fontSize: 120 }} />
                    </Box>
                    <Stack spacing={2}>
                      <Typography variant="h3" fontWeight="700">
                        {
                          taskMany.data?.items.filter(item => item.progress.value === 'completed')
                            .length
                        }
                      </Typography>
                      <Typography variant="h6" fontWeight="500">
                        Completed Tasks
                      </Typography>
                      <Typography variant="body2" sx={{ opacity: 0.9 }}>
                        Team is performing well! Keep up the momentum.
                      </Typography>
                    </Stack>
                  </Paper>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Paper
                    elevation={0}
                    sx={{
                      p: 4,
                      bgcolor: '#ffb366',
                      color: 'white',
                      borderRadius: 2,
                      transition: 'all 0.3s ease',
                      position: 'relative',
                      overflow: 'hidden',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: '0 8px 24px rgba(255, 179, 102, 0.2)',
                        '& .task-icon': {
                          transform: 'scale(1.1) rotate(-5deg)',
                          opacity: 0.2
                        }
                      }
                    }}
                  >
                    <Box
                      className="task-icon"
                      sx={{
                        position: 'absolute',
                        right: -20,
                        top: -20,
                        opacity: 0.15,
                        transition: 'all 0.3s ease'
                      }}
                    >
                      <AccessTimeIcon sx={{ fontSize: 120 }} />
                    </Box>
                    <Stack spacing={2}>
                      <Typography variant="h3" fontWeight="700">
                        {
                          taskMany.data?.items.filter(item => item.progress.value === 'inProgress')
                            .length
                        }
                      </Typography>
                      <Typography variant="h6" fontWeight="500">
                        Pending Tasks
                      </Typography>
                      <Typography variant="body2" sx={{ opacity: 0.9 }}>
                        Tasks in progress and upcoming.
                      </Typography>
                    </Stack>
                  </Paper>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Paper
                    elevation={0}
                    sx={{
                      p: 4,
                      bgcolor: '#ff4d4d',
                      color: 'white',
                      borderRadius: 2,
                      transition: 'all 0.3s ease',
                      position: 'relative',
                      overflow: 'hidden',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: '0 8px 24px rgba(255, 77, 77, 0.2)',
                        '& .task-icon': {
                          transform: 'scale(1.1) rotate(-5deg)',
                          opacity: 0.2
                        }
                      }
                    }}
                  >
                    <Box
                      className="task-icon"
                      sx={{
                        position: 'absolute',
                        right: -20,
                        top: -20,
                        opacity: 0.15,
                        transition: 'all 0.3s ease'
                      }}
                    >
                      <WarningIcon sx={{ fontSize: 120 }} />
                    </Box>
                    <Stack spacing={2}>
                      <Typography variant="h3" fontWeight="700">
                        {
                          taskMany.data?.items.filter(
                            item =>
                              new Date(item.dueDate) > new Date() &&
                              item.progress.value !== 'completed'
                          ).length
                        }
                      </Typography>
                      <Typography variant="h6" fontWeight="500">
                        Overdue Tasks
                      </Typography>
                      <Typography variant="body2" sx={{ opacity: 0.9 }}>
                        Requires immediate attention!
                      </Typography>
                    </Stack>
                  </Paper>
                </Grid>
              </Grid>
            </Stack>
          </Paper>
        </Grid>

        {/* Progress Guide Section */}
        <Grid item xs={12}>
          <Paper
            elevation={0}
            sx={{
              p: 4,
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            <Typography variant="h5" gutterBottom>
              Team Management Guide
            </Typography>

            <Box sx={{ position: 'relative', mt: 4 }}>
              {/* Main Arrow Line */}
              <Box
                component="div"
                sx={{
                  position: 'absolute',
                  top: '60%',
                  left: 0,
                  right: 0,
                  height: '2px',
                  bgcolor: 'grey.300',
                  transform: 'translateY(-50%)',
                  zIndex: 1
                }}
              />

              {/* Guide Sections */}
              <Grid container spacing={6}>
                <Grid item xs={12} md={3}>
                  <Box
                    sx={{ position: 'relative', zIndex: 2 }}
                    onClick={() => setIsDrawerOpen(true)}
                  >
                    <Paper
                      elevation={0}
                      sx={{
                        p: 3,
                        bgcolor: 'white',
                        borderRadius: 2,
                        height: '175px',
                        position: 'relative',
                        border: '1px solid',
                        borderColor: 'grey.200',
                        transition: 'all 0.2s ease-in-out',
                        '&:hover': {
                          transform: 'translateY(-4px)',
                          boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
                          borderColor: 'grey.300'
                        }
                      }}
                    >
                      <Typography
                        variant="h6"
                        sx={{
                          position: 'absolute',
                          top: -12,
                          right: 16,
                          bgcolor: 'white',
                          px: 2,
                          py: 0.5,
                          color: 'text.primary',
                          fontWeight: 600,
                          border: '1px solid',
                          borderColor: 'grey.200',
                          borderRadius: 2,
                          boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
                        }}
                      >
                        Step 1
                      </Typography>
                      <Typography
                        variant="h5"
                        gutterBottom
                        sx={{
                          fontWeight: 700,
                          background: 'linear-gradient(45deg, #000 30%, #333 90%)',
                          backgroundClip: 'text',
                          textFillColor: 'transparent',
                          WebkitBackgroundClip: 'text',
                          WebkitTextFillColor: 'transparent',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          position: 'relative',
                          mb: 6
                        }}
                      >
                        Team Setup
                        <Box
                          sx={{
                            position: 'absolute',
                            right: 50,
                            top: '-60%',
                            transform: 'translateY(50%)'
                          }}
                        >
                          <SettingsIcon sx={{ fontSize: 96, color: 'primary.main' }} />
                        </Box>
                      </Typography>
                      <Stack spacing={2}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                          <Box
                            sx={{
                              width: 6,
                              height: 6,
                              borderRadius: '50%',
                              bgcolor: 'primary.main'
                            }}
                          />
                          <Typography variant="body1" color="text.secondary">
                            Set team description
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                          <Box
                            sx={{
                              width: 6,
                              height: 6,
                              borderRadius: '50%',
                              bgcolor: 'primary.main'
                            }}
                          />
                          <Typography variant="body1" color="text.secondary">
                            Choose team avatar
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                          <Box
                            sx={{
                              width: 6,
                              height: 6,
                              borderRadius: '50%',
                              bgcolor: 'primary.main'
                            }}
                          />
                          <Typography variant="body1" color="text.secondary">
                            Define team goals
                          </Typography>
                        </Box>
                      </Stack>
                    </Paper>
                  </Box>
                </Grid>

                <Grid item xs={12} md={3}>
                  <Box
                    sx={{ position: 'relative', zIndex: 2 }}
                    onClick={() => navigate(`/teams/${id}/team-users`)}
                  >
                    <Paper
                      elevation={0}
                      sx={{
                        p: 3,
                        bgcolor: 'white',
                        borderRadius: 2,
                        height: '175px',
                        position: 'relative',
                        border: '1px solid',
                        borderColor: 'grey.200',
                        transition: 'all 0.2s ease-in-out',
                        '&:hover': {
                          transform: 'translateY(-4px)',
                          boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
                          borderColor: 'grey.300'
                        }
                      }}
                    >
                      <Typography
                        variant="h6"
                        sx={{
                          position: 'absolute',
                          top: -12,
                          right: 16,
                          bgcolor: 'white',
                          px: 2,
                          py: 0.5,
                          color: 'text.primary',
                          fontWeight: 600,
                          border: '1px solid',
                          borderColor: 'grey.200',
                          borderRadius: 2,
                          boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
                        }}
                      >
                        Step 2
                      </Typography>
                      <Typography
                        variant="h5"
                        gutterBottom
                        sx={{
                          fontWeight: 700,
                          background: 'linear-gradient(45deg, #000 30%, #333 90%)',
                          backgroundClip: 'text',
                          textFillColor: 'transparent',
                          WebkitBackgroundClip: 'text',
                          WebkitTextFillColor: 'transparent',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          position: 'relative',
                          mb: 6
                        }}
                      >
                        Build Your Team
                        <Box
                          sx={{
                            position: 'absolute',
                            right: 50,
                            top: '-60%',
                            transform: 'translateY(50%)'
                          }}
                        >
                          <GroupIcon sx={{ fontSize: 96, color: 'info.main' }} />
                        </Box>
                      </Typography>
                      <Stack spacing={2}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                          <Box
                            sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: 'info.main' }}
                          />
                          <Typography variant="body1" color="text.secondary">
                            Invite team members
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                          <Box
                            sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: 'info.main' }}
                          />
                          <Typography variant="body1" color="text.secondary">
                            Organize departments
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                          <Box
                            sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: 'info.main' }}
                          />
                          <Typography variant="body1" color="text.secondary">
                            Set team structure
                          </Typography>
                        </Box>
                      </Stack>
                    </Paper>
                  </Box>
                </Grid>

                <Grid item xs={12} md={3}>
                  <Box
                    sx={{ position: 'relative', zIndex: 2 }}
                    onClick={() => navigate(`/teams/${id}/team-users`)}
                  >
                    <Paper
                      elevation={0}
                      sx={{
                        p: 3,
                        bgcolor: 'white',
                        borderRadius: 2,
                        height: '175px',
                        position: 'relative',
                        border: '1px solid',
                        borderColor: 'grey.200',
                        transition: 'all 0.2s ease-in-out',
                        '&:hover': {
                          transform: 'translateY(-4px)',
                          boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
                          borderColor: 'grey.300'
                        }
                      }}
                    >
                      <Typography
                        variant="h6"
                        sx={{
                          position: 'absolute',
                          top: -12,
                          right: 16,
                          bgcolor: 'white',
                          px: 2,
                          py: 0.5,
                          color: 'text.primary',
                          fontWeight: 600,
                          border: '1px solid',
                          borderColor: 'grey.200',
                          borderRadius: 2,
                          boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
                        }}
                      >
                        Step 3
                      </Typography>
                      <Typography
                        variant="h5"
                        gutterBottom
                        sx={{
                          fontWeight: 700,
                          background: 'linear-gradient(45deg, #000 30%, #333 90%)',
                          backgroundClip: 'text',
                          textFillColor: 'transparent',
                          WebkitBackgroundClip: 'text',
                          WebkitTextFillColor: 'transparent',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          position: 'relative',
                          mb: 6
                        }}
                      >
                        Role Management
                        <Box
                          sx={{
                            position: 'absolute',
                            right: 50,
                            top: '-60%',
                            transform: 'translateY(50%)'
                          }}
                        >
                          <AdminPanelSettingsIcon sx={{ fontSize: 96, color: 'warning.main' }} />
                        </Box>
                      </Typography>
                      <Stack spacing={2}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                          <Box
                            sx={{
                              width: 6,
                              height: 6,
                              borderRadius: '50%',
                              bgcolor: 'warning.main'
                            }}
                          />
                          <Typography variant="body1" color="text.secondary">
                            Assign team roles
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                          <Box
                            sx={{
                              width: 6,
                              height: 6,
                              borderRadius: '50%',
                              bgcolor: 'warning.main'
                            }}
                          />
                          <Typography variant="body1" color="text.secondary">
                            Manage permissions
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                          <Box
                            sx={{
                              width: 6,
                              height: 6,
                              borderRadius: '50%',
                              bgcolor: 'warning.main'
                            }}
                          />
                          <Typography variant="body1" color="text.secondary">
                            Update member status
                          </Typography>
                        </Box>
                      </Stack>
                    </Paper>
                  </Box>
                </Grid>

                <Grid item xs={12} md={3}>
                  <Box
                    sx={{ position: 'relative', zIndex: 2 }}
                    onClick={() => navigate(`/teams/${id}/team-tasks`)}
                  >
                    <Paper
                      elevation={0}
                      sx={{
                        p: 3,
                        bgcolor: 'white',
                        borderRadius: 2,
                        height: '175px',
                        position: 'relative',
                        border: '1px solid',
                        borderColor: 'grey.200',
                        transition: 'all 0.2s ease-in-out',
                        '&:hover': {
                          transform: 'translateY(-4px)',
                          boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
                          borderColor: 'grey.300'
                        }
                      }}
                    >
                      <Typography
                        variant="h6"
                        sx={{
                          position: 'absolute',
                          top: -12,
                          right: 16,
                          bgcolor: 'white',
                          px: 2,
                          py: 0.5,
                          color: 'text.primary',
                          fontWeight: 600,
                          border: '1px solid',
                          borderColor: 'grey.200',
                          borderRadius: 2,
                          boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
                        }}
                      >
                        Step 4
                      </Typography>
                      <Typography
                        variant="h5"
                        gutterBottom
                        sx={{
                          fontWeight: 700,
                          background: 'linear-gradient(45deg, #000 30%, #333 90%)',
                          backgroundClip: 'text',
                          textFillColor: 'transparent',
                          WebkitBackgroundClip: 'text',
                          WebkitTextFillColor: 'transparent',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          position: 'relative',
                          mb: 6
                        }}
                      >
                        Task Management
                        <Box
                          sx={{
                            position: 'absolute',
                            right: 50,
                            top: '-60%',
                            transform: 'translateY(50%)'
                          }}
                        >
                          <AssignmentIcon sx={{ fontSize: 96, color: 'success.main' }} />
                        </Box>
                      </Typography>
                      <Stack spacing={2}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                          <Box
                            sx={{
                              width: 6,
                              height: 6,
                              borderRadius: '50%',
                              bgcolor: 'success.main'
                            }}
                          />
                          <Typography variant="body1" color="text.secondary">
                            Assign tasks to members
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                          <Box
                            sx={{
                              width: 6,
                              height: 6,
                              borderRadius: '50%',
                              bgcolor: 'success.main'
                            }}
                          />
                          <Typography variant="body1" color="text.secondary">
                            Track progress in real-time
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                          <Box
                            sx={{
                              width: 6,
                              height: 6,
                              borderRadius: '50%',
                              bgcolor: 'success.main'
                            }}
                          />
                          <Typography variant="body1" color="text.secondary">
                            Collaborate with comments
                          </Typography>
                        </Box>
                      </Stack>
                    </Paper>
                  </Box>
                </Grid>
              </Grid>
            </Box>
          </Paper>
        </Grid>

        {/* Quick Access Section */}
        <Grid item xs={12}>
          <Paper
            elevation={0}
            sx={{
              p: 4,
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            <Typography variant="h5" gutterBottom>
              Quick Access
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6} md={3}>
                <ToolCard
                  to={`/teams/${id}/team-tasks`}
                  image={tasksImage}
                  title="Tasks"
                  leadText="Manage team tasks and track progress"
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <ToolCard
                  to={`/teams/${id}/team-users`}
                  image={teamsImage}
                  title="Team Members"
                  leadText="View and manage team members"
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <ToolCard
                  to={`/teams/${id}/team-users`}
                  image={analyticsImage}
                  title="Structure"
                  leadText="View team structure"
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <ToolCard
                  to=""
                  image={settingsImage}
                  title="Team Settings"
                  leadText="Configure team preferences"
                  onClick={() => setIsDrawerOpen(true)}
                />
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>

      <Drawer open={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} title="Edit Team">
        <Formik
          initialValues={{
            name: team.name,
            description: team.description ?? '',
            avatar: team.avatar
          }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ values, setFieldValue }) => (
            <Form>
              <Stack spacing={4} ml={8} mr={8} mt={4}>
                <TextField name="name" label="Name" />
                <TextField name="description" label="Description" multiline rows={4} />
                <Box>
                  <Typography variant="subtitle1" sx={{ mb: 1 }}>
                    Team Avatar
                  </Typography>

                  <Grid container spacing={2} sx={{ mb: 3 }}>
                    {teamAvatarsArray.map(avatar => (
                      <Grid item key={avatar.id}>
                        <Box
                          component="img"
                          src={avatar.src}
                          alt={avatar.id}
                          sx={{
                            width: 60,
                            height: 60,
                            borderRadius: '50%',
                            cursor: 'pointer',
                            border: values.avatar === avatar.id ? '3px solid #1976d2' : 'none',
                            '&:hover': {
                              opacity: 0.8
                            }
                          }}
                          onClick={() => setFieldValue('avatar', avatar.id)}
                        />
                      </Grid>
                    ))}
                  </Grid>
                </Box>
                <Box sx={{ mt: 3 }}>
                  <Button type="submit" disabled={loading} buttonText="Save Changes" />
                </Box>
              </Stack>
            </Form>
          )}
        </Formik>
      </Drawer>

      <SnackBarSuccess
        open={snackbar.open}
        successMsg={snackbar.message}
        setSuccess={value => setSnackbar({ ...snackbar, open: value })}
      />

      <SnackbarError
        apolloErrors={[error]}
        mutationError={mutationError}
        setMutationError={setMutationError}
      />
    </>
  );
}
