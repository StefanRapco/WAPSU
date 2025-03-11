import { Card, CardContent, Grid, Paper, Stack } from '@mui/material';
import { BarChartStacked } from '../../components/charts/barChart';
import { ChartCard } from '../../components/charts/helpers/chartCard';
import { PieChartEnhanced } from '../../components/charts/pieChart';
import { SectionHeader } from '../../components/header';
import { Typography } from '../../components/typography';

export function TeamOverview() {
  return (
    <>
      <Grid container spacing={9}>
        <Grid item xs={12}>
          <SectionHeader
            breadcrumbs={[
              { label: 'Teams', to: '/teams' },
              { label: 'Team name' },
              { label: 'Team overview' }
            ]}
          >
            Team overview
          </SectionHeader>
        </Grid>

        <Grid item xs={12}>
          <Typography>
            Welcome to your team dashboard! Here, you can track ongoing projects, monitor task
            progress, and stay updated on team activities. Assign tasks, set deadlines, and
            collaborate seamlessly to keep productivity on track. Stay aligned with team goals and
            ensure everyone is on the same page. Let's get things done!
          </Typography>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6">Total tasks</Typography>
              <Typography variant="h4">120</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6">Completed Tasks</Typography>
              <Typography variant="h4">80</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6">Pending Tasks</Typography>
              <Typography variant="h4">40</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12}>
          <Paper style={{ padding: 20 }}>
            <Typography variant="h6" gutterBottom>
              Task Overview
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      <div style={{ marginTop: 20, marginRight: 20 }}>
        <Stack direction="row">
          <div style={{ minWidth: 0, width: '100%' }}>
            <ChartCard maxWidth={450} title="Title of BarChart">
              <BarChartStacked />
            </ChartCard>
          </div>
          <div style={{ minWidth: 0, width: '100%' }}>
            <ChartCard maxWidth={450} title="Title of PieChart">
              <PieChartEnhanced />
            </ChartCard>
          </div>
        </Stack>
      </div>
    </>
  );
}
