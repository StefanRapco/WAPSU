import { Grid, Paper } from '@mui/material';
import { ReactNode } from 'react';
import { SectionHeader } from '../components/header';
import { Typography } from '../components/typography';

export function Analytics(): ReactNode {
  return (
    <Grid container spacing={9}>
      <Grid item xs={12}>
        <SectionHeader>Analytics</SectionHeader>
      </Grid>

      <Grid item xs={12}>
        <Typography>
          <>
            Teams help you collaborate efficiently by organizing tasks, assigning responsibilities,
            and tracking progress in one place. Each team can have multiple members, with roles and
            permissions to ensure smooth workflow management. Create a team, invite members, and
            start working together seamlessly!
          </>
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <Paper elevation={3} sx={{ padding: 3 }}>
          <Typography variant="h5" gutterBottom>
            Your Analytics Overview
          </Typography>

          <Typography variant="body1" paragraph>
            Welcome to your personal productivity dashboard! Here, you can track your progress and
            stay on top of your tasks. The analytics section provides insights into your task
            completion rates, time spent, and overall productivity.
          </Typography>

          <Typography sx={{ marginTop: 3 }} variant="h6">
            Task Completion
          </Typography>
          <Typography variant="body1" paragraph>
            You have completed <strong>15</strong> tasks out of <strong>20</strong> assigned this
            week. This gives you a completion rate of <strong>75%</strong>.
          </Typography>

          <Typography sx={{ marginTop: 3 }} variant="h6">
            Time Spent
          </Typography>
          <Typography variant="body1" paragraph>
            On average, you spend <strong>3 hours</strong> per task, totaling{' '}
            <strong>45 hours</strong> spent this week. You might want to consider improving your
            task efficiency.
          </Typography>

          <Typography sx={{ marginTop: 3 }} variant="h6">
            Upcoming Tasks
          </Typography>
          <Typography variant="body1" paragraph>
            You have <strong>5</strong> tasks remaining for the rest of the week. Stay focused and
            aim for completing them on time!
          </Typography>

          <Typography sx={{ marginTop: 3 }} variant="h6">
            Productivity Tip
          </Typography>
          <Typography variant="body1" paragraph>
            Try breaking down your larger tasks into smaller, more manageable steps. This approach
            can increase your focus and help you finish tasks faster.
          </Typography>
        </Paper>
      </Grid>
    </Grid>
  );
}
