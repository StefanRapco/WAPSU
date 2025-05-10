import { useMutation } from '@apollo/client';
import {
  Box,
  Card,
  CardContent,
  FormControlLabel,
  Grid,
  Stack,
  Switch,
  Typography
} from '@mui/material';
import { useState } from 'react';
import { SectionHeader } from '../../components/header';
import { SnackbarError } from '../../components/snackbarError';
import { SnackBarSuccess, snackbarUseEffect } from '../../components/snackbarSuccess';
import { gql } from '../../gql-generated/gql';
import { Identity } from '../../hooks/useIdentity';

interface NotificationsProps {
  readonly identity: Pick<
    NonNullable<Identity>,
    'id' | 'isPasswordNull' | 'individualNotifications' | 'teamNotifications'
  >;
}

const userUpdateMutation = gql(`
  mutation UserUpdate($input: UserUpdateInput!) {
    userUpdate(input: $input) {
      id
      firstName
      lastName
      email
      individualNotifications
      teamNotifications
      title
      phoneNumber
      address
    }
  }
`);

export function SettingsNotifications(props: NotificationsProps) {
  const [mutationError, setMutationError] = useState(false);
  const [mutationSuccess, setMutationSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const [userUpdate, { error, loading }] = useMutation(userUpdateMutation, {
    onCompleted: () => {
      setSuccessMessage('Notification preferences updated successfully');
      setMutationSuccess(true);
    },
    onError: () => {
      setMutationError(true);
    }
  });

  snackbarUseEffect({
    success: mutationSuccess,
    error: mutationError,
    setSuccess: setMutationSuccess,
    setError: setMutationError
  });

  return (
    <Stack spacing={9}>
      <SectionHeader breadcrumbs={[{ label: 'Account settings' }, { label: 'Notifications' }]}>
        <Box display="flex" flexDirection="column">
          <Typography variant="h2" fontWeight={700}>
            Notifications
          </Typography>
          <Typography>
            Stay updated with your latest tasks, mentions, and project updates. Never miss an
            important update!
          </Typography>
        </Box>
      </SectionHeader>

      <Card sx={{ maxWidth: 700, mx: 'auto', my: 4, p: 2, boxShadow: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Notification preferences:
          </Typography>
          <Grid container spacing={2} columns={{ xs: 1, sm: 2, md: 3 }}>
            <Grid item xs={2} key={'personal'}>
              <FormControlLabel
                control={<Switch checked={true} color="primary" disabled />}
                label="Personal Account Notifications"
              />
            </Grid>
            <Grid item xs={2} key={'individual'}>
              <FormControlLabel
                control={
                  <Switch
                    checked={props.identity.individualNotifications}
                    disabled={loading}
                    onChange={() =>
                      userUpdate({
                        variables: {
                          input: {
                            id: props.identity.id,
                            individualNotifications: !props.identity.individualNotifications
                          }
                        }
                      })
                    }
                    color="primary"
                  />
                }
                label="Tasks Notifications"
              />
            </Grid>
            <Grid item xs={2} key={'team'}>
              <FormControlLabel
                control={
                  <Switch
                    checked={props.identity.teamNotifications}
                    disabled={loading}
                    onChange={() =>
                      userUpdate({
                        variables: {
                          input: {
                            id: props.identity.id,
                            teamNotifications: !props.identity.teamNotifications
                          }
                        }
                      })
                    }
                    color="primary"
                  />
                }
                label="Team Notifications"
              />
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <SnackBarSuccess
        open={mutationSuccess}
        successMsg={successMessage}
        setSuccess={setMutationSuccess}
      />

      <SnackbarError
        mutationError={mutationError}
        setMutationError={setMutationError}
        apolloErrors={[error]}
      />
    </Stack>
  );
}
