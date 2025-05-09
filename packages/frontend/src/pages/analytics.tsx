import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WarningIcon from '@mui/icons-material/Warning';
import {
  Autocomplete,
  Box,
  CircularProgress,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  TextField,
  Typography
} from '@mui/material';
import { ReactNode, useMemo, useState } from 'react';
import { AreaChart } from '../components/charts/areaChart';
import { BarChartStacked } from '../components/charts/barChart';
import { ComposedChart } from '../components/charts/composedChart';
import { LineChart } from '../components/charts/lineChart';
import { PieChartBasic, PieChartEnhanced } from '../components/charts/pieChart';
import { RadarChart } from '../components/charts/radarChart';
import { ToolCard } from '../components/dashboardCards';
import { SectionHeader } from '../components/header';
import {
  useTaskCompletionAnalytics,
  useTaskDistributionAnalytics,
  useTaskHealthAnalytics,
  useTaskPriorityAnalytics,
  useTaskTimelineAnalytics,
  useTeamPerformanceAnalytics
} from '../hooks/useAnalytics';
import { useIdentity } from '../hooks/useIdentity';
import { useTeamMany } from '../hooks/useTeamMany';
import analyticsImage from '../images/analytics.png';

type ChartFilterType = 'all' | 'team' | 'individual';

interface ChartFilters {
  filterType: ChartFilterType;
  selectedTeam: string;
  startDate: Date;
  endDate: Date;
}

function EmptyStateCards({
  type,
  title,
  isTeam
}: {
  type: ChartFilterType;
  title: string;
  isTeam?: boolean;
}) {
  return (
    <Box sx={{ mt: 3 }}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <ToolCard
            to=""
            image={analyticsImage}
            title={title}
            leadText={
              isTeam
                ? 'No team performance data available. Select teams to compare.'
                : `No ${type === 'all' ? 'tasks' : type === 'team' ? 'team tasks' : 'individual tasks'} available for the selected period`
            }
          />
        </Grid>
      </Grid>
    </Box>
  );
}

export function Analytics(): ReactNode {
  const { identity } = useIdentity();
  const [selectedTeams, setSelectedTeams] = useState<Array<{ id: string; name: string }>>([]);

  const { data: teamsData } = useTeamMany({
    userId: [identity?.id ?? ''],
    pageSize: 1000
  });

  const teams = useMemo(() => teamsData?.items ?? [], [teamsData]);

  // Initialize filters for each chart
  const [taskCompletionFilters, setTaskCompletionFilters] = useState<ChartFilters>(() => ({
    filterType: 'all',
    selectedTeam: '',
    startDate: (() => {
      const date = new Date();
      date.setDate(date.getDate() - 30);
      return date;
    })(),
    endDate: new Date()
  }));

  const [taskDistributionFilters, setTaskDistributionFilters] = useState<ChartFilters>(() => ({
    filterType: 'all',
    selectedTeam: '',
    startDate: (() => {
      const date = new Date();
      date.setDate(date.getDate() - 30);
      return date;
    })(),
    endDate: new Date()
  }));

  const [taskPriorityFilters, setTaskPriorityFilters] = useState<ChartFilters>(() => ({
    filterType: 'all',
    selectedTeam: '',
    startDate: (() => {
      const date = new Date();
      date.setDate(date.getDate() - 30);
      return date;
    })(),
    endDate: new Date()
  }));

  const [taskTimelineFilters, setTaskTimelineFilters] = useState<ChartFilters>(() => ({
    filterType: 'all',
    selectedTeam: '',
    startDate: (() => {
      const date = new Date();
      date.setDate(date.getDate() - 30);
      return date;
    })(),
    endDate: new Date()
  }));

  const [taskHealthFilters, setTaskHealthFilters] = useState<ChartFilters>(() => ({
    filterType: 'all',
    selectedTeam: '',
    startDate: (() => {
      const date = new Date();
      date.setDate(date.getDate() - 30);
      return date;
    })(),
    endDate: new Date()
  }));

  const [teamPerformanceFilters, setTeamPerformanceFilters] = useState<{
    selectedTeams: string[];
    startDate: Date;
    endDate: Date;
  }>(() => ({
    selectedTeams: Array(5).fill(''),
    startDate: (() => {
      const date = new Date();
      date.setDate(date.getDate() - 30);
      return date;
    })(),
    endDate: new Date()
  }));

  const { data: taskCompletionData, loading: taskCompletionLoading } = useTaskCompletionAnalytics(
    taskCompletionFilters.filterType,
    taskCompletionFilters.filterType === 'team' ? taskCompletionFilters.selectedTeam : undefined,
    taskCompletionFilters.startDate,
    taskCompletionFilters.endDate
  );

  const { data: taskDistributionData, loading: taskDistributionLoading } =
    useTaskDistributionAnalytics(
      taskDistributionFilters.filterType,
      taskDistributionFilters.filterType === 'team'
        ? taskDistributionFilters.selectedTeam
        : undefined,
      taskDistributionFilters.startDate,
      taskDistributionFilters.endDate
    );

  const { data: taskPriorityData, loading: taskPriorityLoading } = useTaskPriorityAnalytics(
    taskPriorityFilters.filterType,
    taskPriorityFilters.filterType === 'team' ? taskPriorityFilters.selectedTeam : undefined,
    taskPriorityFilters.startDate,
    taskPriorityFilters.endDate
  );

  const { data: teamPerformanceData, loading: teamPerformanceLoading } =
    useTeamPerformanceAnalytics(
      teamPerformanceFilters.selectedTeams,
      teamPerformanceFilters.startDate,
      teamPerformanceFilters.endDate
    );

  const { data: taskTimelineData, loading: taskTimelineLoading } = useTaskTimelineAnalytics(
    taskTimelineFilters.filterType,
    taskTimelineFilters.filterType === 'team' ? taskTimelineFilters.selectedTeam : undefined,
    taskTimelineFilters.startDate,
    taskTimelineFilters.endDate
  );

  const { data: taskHealthData, loading: taskHealthLoading } = useTaskHealthAnalytics(
    taskHealthFilters.filterType,
    taskHealthFilters.filterType === 'team' ? taskHealthFilters.selectedTeam : undefined,
    taskHealthFilters.startDate,
    taskHealthFilters.endDate
  );

  const isLoading =
    taskCompletionLoading ||
    taskDistributionLoading ||
    taskPriorityLoading ||
    teamPerformanceLoading ||
    taskTimelineLoading ||
    taskHealthLoading;

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  console.log('Team Performance Data:', teamPerformanceData);

  const FilterControls = ({
    filters,
    setFilters
  }: {
    filters: ChartFilters;
    setFilters: (filters: ChartFilters) => void;
  }) => (
    <Box sx={{ display: 'flex', gap: 2, mb: 4, flexWrap: 'wrap' }}>
      <FormControl sx={{ minWidth: 200 }}>
        <InputLabel>View Type</InputLabel>
        <Select
          value={filters.filterType}
          label="View Type"
          onChange={e => setFilters({ ...filters, filterType: e.target.value as ChartFilterType })}
        >
          <MenuItem value="all">All Tasks</MenuItem>
          <MenuItem value="team">Team Tasks</MenuItem>
          <MenuItem value="individual">Individual Tasks</MenuItem>
        </Select>
      </FormControl>

      {filters.filterType === 'team' && (
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Select Team</InputLabel>
          <Select
            value={filters.selectedTeam}
            label="Select Team"
            onChange={e => setFilters({ ...filters, selectedTeam: e.target.value })}
          >
            {teams.map(team => (
              <MenuItem key={team.id} value={team.id}>
                {team.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      )}

      <TextField
        label="Start Date"
        type="date"
        value={filters.startDate.toISOString().split('T')[0]}
        onChange={e => {
          const newDate = new Date(e.target.value);
          if (newDate <= filters.endDate) {
            setFilters({ ...filters, startDate: newDate });
          }
        }}
        InputLabelProps={{ shrink: true }}
        sx={{ minWidth: 200 }}
      />

      <TextField
        label="End Date"
        type="date"
        value={filters.endDate.toISOString().split('T')[0]}
        onChange={e => {
          const newDate = new Date(e.target.value);
          if (newDate >= filters.startDate) {
            setFilters({ ...filters, endDate: newDate });
          }
        }}
        InputLabelProps={{ shrink: true }}
        sx={{ minWidth: 200 }}
      />
    </Box>
  );

  const TeamPerformanceControls = () => {
    return (
      <Box sx={{ display: 'flex', gap: 2, mb: 4, flexWrap: 'wrap' }}>
        <FormControl sx={{ minWidth: 200 }}>
          <Autocomplete
            multiple
            id="tags-outlined"
            options={teams}
            getOptionLabel={option => option.name}
            filterSelectedOptions
            value={selectedTeams}
            onChange={(_, newValue) => {
              if (newValue.length <= 5) {
                setSelectedTeams(newValue);
                setTeamPerformanceFilters(prev => ({
                  ...prev,
                  selectedTeams: newValue.map(team => team.id)
                }));
              }
            }}
            renderInput={params => (
              <TextField
                {...params}
                label="Select up to 5 teams"
                placeholder="Type to search..."
                sx={{
                  '& .MuiInputBase-input': {
                    color: 'black'
                  },
                  '& .MuiChip-root': {
                    color: 'black',
                    '& .MuiChip-deleteIcon': {
                      color: 'black'
                    }
                  }
                }}
              />
            )}
            ListboxProps={{
              style: {
                maxHeight: '200px',
                overflow: 'auto',
                color: 'black'
              }
            }}
          />
        </FormControl>

        <TextField
          label="Start Date"
          type="date"
          value={teamPerformanceFilters.startDate.toISOString().split('T')[0]}
          onChange={e => {
            const newDate = new Date(e.target.value);
            if (newDate <= teamPerformanceFilters.endDate) {
              setTeamPerformanceFilters(prev => ({ ...prev, startDate: newDate }));
            }
          }}
          InputLabelProps={{ shrink: true }}
          sx={{ minWidth: 200 }}
        />

        <TextField
          label="End Date"
          type="date"
          value={teamPerformanceFilters.endDate.toISOString().split('T')[0]}
          onChange={e => {
            const newDate = new Date(e.target.value);
            if (newDate >= teamPerformanceFilters.startDate) {
              setTeamPerformanceFilters(prev => ({ ...prev, endDate: newDate }));
            }
          }}
          InputLabelProps={{ shrink: true }}
          sx={{ minWidth: 200 }}
        />
      </Box>
    );
  };

  return (
    <>
      <Grid container spacing={6}>
        <Grid item xs={12}>
          <SectionHeader>Analytics</SectionHeader>
        </Grid>

        <Grid item xs={12}>
          <Paper elevation={3} sx={{ padding: 3 }}>
            <Typography variant="h5" gutterBottom>
              Task Analytics Overview
            </Typography>

            <Typography variant="body1" paragraph>
              Track your productivity and task management metrics. Each chart can be filtered
              independently.
            </Typography>

            {taskHealthData?.analyticsTaskHealth && (
              <Box sx={{ mt: 3 }}>
                <Typography variant="h6" gutterBottom sx={{ mb: 3, fontWeight: 600 }}>
                  Task Health Summary
                </Typography>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={3}>
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
                          {taskHealthData.analyticsTaskHealth.overdueTasks}
                        </Typography>
                        <Typography variant="h6" fontWeight="500">
                          Overdue Tasks
                        </Typography>
                        <Typography variant="body2" sx={{ opacity: 0.9 }}>
                          Tasks that have passed their due date
                        </Typography>
                      </Stack>
                    </Paper>
                  </Grid>
                  <Grid item xs={12} md={3}>
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
                          {taskHealthData.analyticsTaskHealth.dueToday}
                        </Typography>
                        <Typography variant="h6" fontWeight="500">
                          Due Today
                        </Typography>
                        <Typography variant="body2" sx={{ opacity: 0.9 }}>
                          Tasks that need attention today
                        </Typography>
                      </Stack>
                    </Paper>
                  </Grid>
                  <Grid item xs={12} md={3}>
                    <Paper
                      elevation={0}
                      sx={{
                        p: 4,
                        bgcolor: '#4d94ff',
                        color: 'white',
                        borderRadius: 2,
                        transition: 'all 0.3s ease',
                        position: 'relative',
                        overflow: 'hidden',
                        '&:hover': {
                          transform: 'translateY(-4px)',
                          boxShadow: '0 8px 24px rgba(77, 148, 255, 0.2)',
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
                        <CalendarTodayIcon sx={{ fontSize: 120 }} />
                      </Box>
                      <Stack spacing={2}>
                        <Typography variant="h3" fontWeight="700">
                          {taskHealthData.analyticsTaskHealth.dueThisWeek}
                        </Typography>
                        <Typography variant="h6" fontWeight="500">
                          Due This Week
                        </Typography>
                        <Typography variant="body2" sx={{ opacity: 0.9 }}>
                          Tasks due within the next 7 days
                        </Typography>
                      </Stack>
                    </Paper>
                  </Grid>
                  <Grid item xs={12} md={3}>
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
                          {Math.round(taskHealthData.analyticsTaskHealth.completionRate * 100)}%
                        </Typography>
                        <Typography variant="h6" fontWeight="500">
                          Completion Rate
                        </Typography>
                        <Typography variant="body2" sx={{ opacity: 0.9 }}>
                          Overall task completion rate
                        </Typography>
                      </Stack>
                    </Paper>
                  </Grid>
                </Grid>
              </Box>
            )}
          </Paper>
        </Grid>

        <Grid item xs={12} md={6} sx={{ mt: 4, mb: 4 }}>
          <Paper elevation={3} sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Task Completion Trend
            </Typography>
            <FilterControls filters={taskCompletionFilters} setFilters={setTaskCompletionFilters} />
            {taskCompletionData?.analyticsTaskCompletion.total === 0 ? (
              <EmptyStateCards type={taskCompletionFilters.filterType} title="Task Completion" />
            ) : (
              <Box sx={{ height: 400, mt: 4 }}>
                <LineChart data={taskCompletionData?.analyticsTaskCompletion.items} />
              </Box>
            )}
          </Paper>
        </Grid>

        <Grid item xs={12} md={6} sx={{ mt: 4, mb: 4 }}>
          <Paper elevation={3} sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Task Status Distribution
            </Typography>
            <FilterControls
              filters={taskDistributionFilters}
              setFilters={setTaskDistributionFilters}
            />
            {taskDistributionData?.analyticsTaskDistribution.total === 0 ? (
              <EmptyStateCards
                type={taskDistributionFilters.filterType}
                title="Task Distribution"
              />
            ) : (
              <Box sx={{ height: 400, mt: 4 }}>
                <PieChartEnhanced data={taskDistributionData?.analyticsTaskDistribution} />
              </Box>
            )}
          </Paper>
        </Grid>

        <Grid item xs={12} sx={{ mt: 4, mb: 4 }}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Task Health Dashboard
            </Typography>
            <FilterControls filters={taskHealthFilters} setFilters={setTaskHealthFilters} />
            {taskHealthData?.analyticsTaskHealth.completionRate === 0 &&
            taskHealthData?.analyticsTaskHealth.dueToday === 0 &&
            taskHealthData?.analyticsTaskHealth.dueThisWeek === 0 &&
            taskHealthData?.analyticsTaskHealth.overdueTasks === 0 ? (
              <EmptyStateCards type={taskHealthFilters.filterType} title="Task Health" />
            ) : (
              <Box sx={{ height: 400, mt: 4 }}>
                <ComposedChart data={taskHealthData?.analyticsTaskHealth} />
              </Box>
            )}
          </Paper>
        </Grid>

        <Grid item xs={12} md={6} sx={{ mt: 4, mb: 4 }}>
          <Paper elevation={3} sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Team Performance Comparison
            </Typography>
            <TeamPerformanceControls />
            {teamPerformanceData == null ? (
              <EmptyStateCards type="team" title="Team Performance" isTeam={false} />
            ) : teamPerformanceData?.analyticsTeamPerformance.items.every(
                item =>
                  item.completionRate === 0 &&
                  item.averageCompletionTime === 0 &&
                  item.onTimeDeliveryRate === 0 &&
                  item.activeTasksRatio === 0
              ) ? (
              <EmptyStateCards type="team" title="Team Performance" isTeam={false} />
            ) : (
              <Box sx={{ height: 400, mt: 4 }}>
                <RadarChart data={teamPerformanceData?.analyticsTeamPerformance.items} />
              </Box>
            )}
          </Paper>
        </Grid>

        <Grid item xs={12} md={6} sx={{ mt: 4, mb: 4 }}>
          <Paper elevation={3} sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Task Timeline
            </Typography>
            <FilterControls filters={taskTimelineFilters} setFilters={setTaskTimelineFilters} />
            {taskTimelineData?.analyticsTaskTimeline.items?.every(
              item => item.created === 0 && item.completed === 0
            ) ? (
              <EmptyStateCards type={taskTimelineFilters.filterType} title="Task Timeline" />
            ) : (
              <Box sx={{ height: 400, mt: 4 }}>
                <AreaChart data={taskTimelineData?.analyticsTaskTimeline.items} />
              </Box>
            )}
          </Paper>
        </Grid>

        <Grid item xs={12} md={6} sx={{ mt: 4, mb: 4 }}>
          <Paper elevation={3} sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Tasks by Priority
            </Typography>
            <FilterControls filters={taskPriorityFilters} setFilters={setTaskPriorityFilters} />
            {taskPriorityData?.analyticsTaskPriority.items?.every(
              item => item.notStarted === 0 && item.inProgress === 0 && item.completed === 0
            ) ? (
              <EmptyStateCards type={taskPriorityFilters.filterType} title="Task Priority" />
            ) : (
              <Box sx={{ height: 400, mt: 4 }}>
                <BarChartStacked data={taskPriorityData?.analyticsTaskPriority.items} />
              </Box>
            )}
          </Paper>
        </Grid>

        <Grid item xs={12} md={6} sx={{ mt: 4, mb: 4 }}>
          <Paper elevation={3} sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Overdue Tasks Distribution
            </Typography>
            <FilterControls
              filters={taskDistributionFilters}
              setFilters={setTaskDistributionFilters}
            />
            {taskDistributionData?.analyticsTaskDistribution.total === 0 ? (
              <EmptyStateCards
                type={taskDistributionFilters.filterType}
                title="Task Distribution"
              />
            ) : (
              <Box sx={{ height: 400, mt: 4 }}>
                <PieChartBasic data={taskDistributionData?.analyticsTaskDistribution} />
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>
    </>
  );
}
