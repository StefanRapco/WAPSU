import { Card, CardContent, Grid, Paper, Stack } from '@mui/material';
import { BarChart } from '../components/charts/barChart';
import { LineChart } from '../components/charts/lineChart';
import { SectionHeader } from '../components/header';
import { Typography } from '../components/typography';

export function Dashboard() {
  return (
    <>
      <Grid container spacing={9}>
        <Grid item xs={12}>
          <SectionHeader>Dashboard</SectionHeader>
        </Grid>

        <Grid item xs={12}>
          <Typography>
            Welcome to DoSync! Stay organized, boost your productivity, and keep track of all your
            tasks in one place. Easily create, manage, and complete tasks with just a few clicks!
          </Typography>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6">Total individual tasks</Typography>
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

      <div style={{ marginTop: 20 }}>
        <Stack direction="row">
          <div style={{ minWidth: 0, width: '100%' }}>
            <LineChart />
          </div>
          <div style={{ minWidth: 0, width: '100%' }}>
            <BarChart />
          </div>
        </Stack>
      </div>
    </>
  );
}
