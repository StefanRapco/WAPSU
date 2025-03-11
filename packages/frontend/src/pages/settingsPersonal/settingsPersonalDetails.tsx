import { useMutation } from '@apollo/client';
import { Box, Grid, Stack, Typography } from '@mui/material';
import { Form, Formik } from 'formik';
import { useState } from 'react';
import * as yup from 'yup';
import { Badge } from '../../components/badge';
import { Button } from '../../components/button';
import { SectionHeader } from '../../components/header';
import { getInitials } from '../../components/navigation/accountMenu';
import { CircularAvatar } from '../../components/navigation/circularAvatar';
import { SnackbarError } from '../../components/snackbarError';
import { SnackBarSuccess, snackbarUseEffect } from '../../components/snackbarSuccess';
import { TextField } from '../../components/textField';
import { gql } from '../../gql-generated';
import { Identity, identityQuery } from '../../hooks/useIdentity';

interface PersonalDetailsProps {
  readonly identity: Pick<
    NonNullable<Identity>,
    'id' | 'firstName' | 'lastName' | 'email' | 'fullName'
  >;
}

export function SettingsPersonalDetails(props: PersonalDetailsProps) {
  const validationSchema = yup.object({
    firstName: yup.string().required('First name is a required field.'),
    lastName: yup
      .string()
      .required('Last name is a required field')
      .max(128, 'Max. 128 characters'),
    email: yup.string().required('Email is a required field.').max(128, 'Max. 128 characters')
  });

  const [error, setError] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);

  const [update, { error: updateError }] = useMutation(mutation, {
    refetchQueries: [identityQuery],
    onCompleted: () => setSuccess(true),
    onError: () => setError(true)
  });

  snackbarUseEffect({
    error,
    success,
    setError: value => setError(value),
    setSuccess: value => setSuccess(value)
  });

  return (
    <Stack gap={8}>
      <SectionHeader
        breadcrumbs={[{ label: 'Account settings' }, { label: 'Personal details' }]}
        badge={
          <Badge
            variant="positive"
            notification="Active"
            // notification={data.userOne.status.label.toUpperCase()}
          />
        }
      >
        <Stack direction="row" gap={4} alignItems="center">
          <CircularAvatar size="m">{getInitials(props.identity.fullName)}</CircularAvatar>
          <Typography variant="bodyLEmphasis">{props.identity.fullName}</Typography>
        </Stack>
      </SectionHeader>
      <Box display="flex" flexDirection="column">
        <Typography>Update your personal information.</Typography>
      </Box>

      <Formik
        initialValues={{
          firstName: props.identity.firstName,
          lastName: props.identity.lastName,
          email: props.identity.email
        }}
        enableReinitialize
        validationSchema={validationSchema}
        onSubmit={async values => {
          await update({
            variables: { input: { firstName: values.firstName, lastName: values.lastName } }
          });
        }}
      >
        {({ isSubmitting }) => {
          return (
            <Form>
              <Stack sx={{ maxWidth: '400px' }}>
                <Grid container spacing={6}>
                  <Grid item xs={6}>
                    <TextField
                      name="firstName"
                      label="First name"
                      placeholder="David"
                      error={false}
                      helperText={false}
                    />
                  </Grid>

                  <Grid item xs={6}>
                    <TextField
                      name="lastName"
                      label="Last name"
                      placeholder="Drake"
                      error={false}
                      helperText={false}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      disabled
                      name="email"
                      label="Email"
                      error={false}
                      helperText={false}
                    />
                  </Grid>
                </Grid>
              </Stack>

              <Box>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  sx={{ mt: 5 }}
                  buttonText="Save details"
                />
              </Box>
            </Form>
          );
        }}
      </Formik>

      <SnackBarSuccess
        open={success}
        successMsg="Personal data successfully updated"
        setSuccess={value => setSuccess(value)}
      />

      <SnackbarError
        mutationError={error}
        setMutationError={value => setError(value)}
        apolloErrors={[updateError]}
      />
    </Stack>
  );
}

const mutation = gql(`
  mutation IdentityUpdate($input: IdentityUpdateInput!) {
    identityUpdate(input: $input){
      id
      firstName
      lastName
    }
  }
`);
