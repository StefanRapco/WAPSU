import AccessTimeIcon from '@mui/icons-material/AccessTime';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import AssignmentIcon from '@mui/icons-material/Assignment';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import GroupIcon from '@mui/icons-material/Group';
import SettingsIcon from '@mui/icons-material/Settings';
import WarningIcon from '@mui/icons-material/Warning';
import { Box, CircularProgress, Grid, Paper, Stack, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { ToolCard } from '../components/dashboardCards';
import { SectionHeader } from '../components/header';
import { Typography as MyTypography } from '../components/typography';
import { Identity } from '../hooks/useIdentity';
import { useTaskMany } from '../hooks/useTaskMany';
import analyticsImage from '../images/analytics.png';
import settingsImage from '../images/settings.png';
import tasksImage from '../images/tasks.png';
import teamsImage from '../images/teams.png';

export function Dashboard(props: { identity: NonNullable<Identity> }) {
  const userName = props.identity.firstName;
  const navigate = useNavigate();

  const { data: taskMany, loading: taskManyLoading } = useTaskMany({ allUserTeams: true });

  return (
    <>
      <Grid container spacing={4}>
        <Grid item xs={12}>
          <SectionHeader>
            <Stack spacing={2}>
              <Typography variant="h2">Welcome back, {userName}! 👋</Typography>
              <Typography variant="body1" color="text.secondary">
                Here's what's happening with your tasks today.
              </Typography>
            </Stack>
          </SectionHeader>
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
                        {taskManyLoading ? (
                          <CircularProgress />
                        ) : (
                          taskMany?.items.filter(item => item.progress.value === 'completed').length
                        )}
                      </Typography>
                      <Typography variant="h6" fontWeight="500">
                        Completed Tasks
                      </Typography>
                      <Typography variant="body2" sx={{ opacity: 0.9 }}>
                        You're on track! Keep up the good work.
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
                        {taskManyLoading ? (
                          <CircularProgress />
                        ) : (
                          taskMany?.items.filter(item => item.progress.value === 'inProgress')
                            .length
                        )}
                      </Typography>
                      <Typography variant="h6" fontWeight="500">
                        Pending Tasks
                      </Typography>
                      <Typography variant="body2" sx={{ opacity: 0.9 }}>
                        Due within foreseeable future.
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
                        {taskManyLoading ? (
                          <CircularProgress />
                        ) : (
                          taskMany?.items.filter(
                            item =>
                              new Date(item.dueDate) < new Date() &&
                              item.progress.value !== 'completed'
                          ).length
                        )}
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
              // mt: 10,
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            <Typography variant="h5" gutterBottom>
              Getting Started
            </Typography>

            <Box sx={{ position: 'relative', mt: 4 }}>
              {/* Main Arrow Line */}
              <Box
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
                  <Box sx={{ position: 'relative', zIndex: 2 }} onClick={() => navigate('/tasks')}>
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
                      <MyTypography
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
                      </MyTypography>
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
                        Start with Tasks
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
                            Create and manage your tasks
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
                            Set priorities and due dates
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
                            Track your progress
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
                            Organize with labels
                          </Typography>
                        </Box>
                      </Stack>
                    </Paper>
                  </Box>
                </Grid>

                <Grid item xs={12} md={3}>
                  <Box sx={{ position: 'relative', zIndex: 2 }} onClick={() => navigate('/teams')}>
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
                      <MyTypography
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
                      </MyTypography>
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
                            Create or join teams
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                          <Box
                            sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: 'info.main' }}
                          />
                          <Typography variant="body1" color="text.secondary">
                            Assign tasks to members
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                          <Box
                            sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: 'info.main' }}
                          />
                          <Typography variant="body1" color="text.secondary">
                            Collaborate in real-time
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                          <Box
                            sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: 'info.main' }}
                          />
                          <Typography variant="body1" color="text.secondary">
                            Share resources
                          </Typography>
                        </Box>
                      </Stack>
                    </Paper>
                  </Box>
                </Grid>

                <Grid item xs={12} md={3}>
                  <Box
                    sx={{ position: 'relative', zIndex: 2 }}
                    onClick={() => navigate('/analytics')}
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
                      <MyTypography
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
                      </MyTypography>
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
                        Monitor Progress
                        <Box
                          sx={{
                            position: 'absolute',
                            right: 50,
                            top: '-60%',
                            transform: 'translateY(50%)'
                          }}
                        >
                          <AnalyticsIcon sx={{ fontSize: 96, color: 'warning.main' }} />
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
                            View performance metrics
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
                            Track team productivity
                          </Typography>
                        </Box>
                      </Stack>
                    </Paper>
                  </Box>
                </Grid>

                {props.identity.systemRole.value === 'admin' ? (
                  <Grid item xs={12} md={3}>
                    <Box
                      sx={{ position: 'relative', zIndex: 2 }}
                      onClick={() => navigate('/settings')}
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
                        <MyTypography
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
                        </MyTypography>
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
                          System Settings
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
                              Configure system preferences
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
                              Manage user roles
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
                              Set up integrations
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
                              Customize workflows
                            </Typography>
                          </Box>
                        </Stack>
                      </Paper>
                    </Box>
                  </Grid>
                ) : (
                  <Grid item xs={12} md={3}>
                    <Box
                      sx={{ position: 'relative', zIndex: 2 }}
                      onClick={() => navigate('/account-settings/personal-details')}
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
                        <MyTypography
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
                        </MyTypography>
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
                          Personal Details
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
                              Update your profile
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
                              Manage preferences
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
                              Set notification settings
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
                              Update security settings
                            </Typography>
                          </Box>
                        </Stack>
                      </Paper>
                    </Box>
                  </Grid>
                )}
              </Grid>
            </Box>
          </Paper>
        </Grid>

        {/* Main Tools Section */}
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
                  to="/tasks"
                  image={tasksImage}
                  title="Tasks"
                  leadText="Manage your tasks and track progress"
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <ToolCard
                  to="/teams"
                  image={teamsImage}
                  title="Teams"
                  leadText="Collaborate with your team members"
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <ToolCard
                  to="/analytics"
                  image={analyticsImage}
                  title="Analytics"
                  leadText="View insights and performance metrics"
                />
              </Grid>
              {props.identity.systemRole.value === 'admin' ? (
                <Grid item xs={12} sm={6} md={3}>
                  <ToolCard
                    to="/settings"
                    image={settingsImage}
                    title="Settings"
                    leadText="Configure system settings and preferences"
                  />
                </Grid>
              ) : (
                <Grid item xs={12} sm={6} md={3}>
                  <ToolCard
                    to="/account-settings/personal-details"
                    image={settingsImage}
                    title="Personal Details"
                    leadText="Manage your profile and preferences"
                  />
                </Grid>
              )}
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </>
  );
}
