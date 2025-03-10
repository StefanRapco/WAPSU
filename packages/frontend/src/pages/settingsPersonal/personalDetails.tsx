import { Box, Grid, Stack, Typography } from '@mui/material';
import { Form, Formik } from 'formik';
import * as yup from 'yup';
import { Badge } from '../../components/badge';
import { Button } from '../../components/button';
import { SectionHeader } from '../../components/header';
import { getInitials } from '../../components/navigation/accountMenu';
import { CircularAvatar } from '../../components/navigation/circularAvatar';
import { TextField } from '../../components/textField';
import { Identity } from '../../hooks/useIdentity';

interface PersonalDetailsProps {
  readonly identity: Pick<
    NonNullable<Identity>,
    'id' | 'firstName' | 'lastName' | 'email' | 'fullName'
  >;
}

export function PersonalDetails(props: PersonalDetailsProps) {
  const validationSchema = yup.object({
    firstName: yup.string().required('First name is a required field.'),
    lastName: yup
      .string()
      .required('Last name is a required field')
      .max(128, 'Max. 128 characters'),
    email: yup.string().required('Email is a required field.').max(128, 'Max. 128 characters')
  });

  return (
    <Stack gap={8}>
      <SectionHeader
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
        <Typography>Update your personal information</Typography>
      </Box>

      <Formik
        initialValues={{
          firstName: props.identity.firstName,
          lastName: props.identity.lastName,
          email: props.identity.email
        }}
        enableReinitialize
        validationSchema={validationSchema}
        onSubmit={async (values, { resetForm }) => {
          //   await props.onSubmit(values);
          //   resetForm();
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
    </Stack>
  );
}
