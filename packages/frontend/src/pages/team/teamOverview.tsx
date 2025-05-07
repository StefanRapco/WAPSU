import { Box, Card, CardContent, Grid, Paper, Stack } from '@mui/material';
import { Form, Formik } from 'formik';
import { ReactNode, useState } from 'react';
import { useParams } from 'react-router-dom';
import * as yup from 'yup';
import { Button } from '../../components/button';
import { BarChartStacked } from '../../components/charts/barChart';
import { ChartCard } from '../../components/charts/helpers/chartCard';
import { PieChartEnhanced } from '../../components/charts/pieChart';
import { Drawer } from '../../components/drawer';
import { SectionHeader } from '../../components/header';
import { SnackbarError } from '../../components/snackbarError';
import { SnackBarSuccess } from '../../components/snackbarSuccess';
import { TextField } from '../../components/textField';
import { Typography } from '../../components/typography';
import { useTeamEdit } from '../../hooks/useTeamEdit';
import { useTeamOne } from '../../hooks/useTeamOne';
import { teamAvatarsArray } from '../../images/images';

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

  if (id == null) throw new Error('Team ID is required');

  const { data: team, refetch } = useTeamOne(id);
  const { editTeam, loading, error } = useTeamEdit();

  const handleOpenDrawer = () => {
    setIsDrawerOpen(true);
  };

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
