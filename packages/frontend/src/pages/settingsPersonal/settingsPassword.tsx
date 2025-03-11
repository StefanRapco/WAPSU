import CheckIcon from '@mui/icons-material/Check';
import { Box, Grid, Stack, Typography } from '@mui/material';
import { Form, Formik } from 'formik';
import { useEffect, useState } from 'react';
import * as yup from 'yup';
import { Button } from '../../components/button';
import { SectionHeader } from '../../components/header';
import { TextField } from '../../components/textField';
import { Identity } from '../../hooks/useIdentity';

interface PasswordProps {
  readonly identity: Pick<NonNullable<Identity>, 'id' | 'isPasswordNull'>;
}

export function SettingsPassword(props: PasswordProps) {
  return (
    <Stack spacing={9}>
      <SectionHeader breadcrumbs={[{ label: 'Account settings' }, { label: 'Password' }]}>
        <Box display="flex" flexDirection="column">
          <Typography variant="h2Bold">Password</Typography>
          <Typography>Update your password and how you log in</Typography>
        </Box>
      </SectionHeader>

      <PasswordForm identity={props.identity} />
    </Stack>
  );
}

function PasswordForm(props: PasswordProps) {
  const [isValid, setIsValid] = useState<boolean>(false);
  const requireCurrentPassword = !props.identity.isPasswordNull;

  const validationSchema = yup.object({
    currentPassword: requireCurrentPassword
      ? yup.string().required('Current password is a required field.')
      : yup.string().nullable(),
    newPassword: yup
      .string()
      .required('New password is a required field')
      .max(128, 'Max. 128 characters'),
    passwordConfirm: yup
      .string()
      .required('Confirm password is a required field.')
      .max(128, 'Max. 128 characters')
      .test('passwords-match', 'Passwords must match', function (value) {
        return this.parent.newPassword === value;
      })
  });

  return (
    <Stack>
      <Formik
        initialValues={{ currentPassword: '', newPassword: '', passwordConfirm: '' }}
        enableReinitialize
        validationSchema={validationSchema}
        onSubmit={async (values, { resetForm }) => {
          //   await props.onSubmit(values);
          //   resetForm();
        }}
      >
        {({ values, isSubmitting }) => {
          const matchPasswords =
            values.passwordConfirm?.trim() !== '' && values.passwordConfirm === values.newPassword;
          return (
            <Form>
              <Stack sx={{ maxWidth: '350px' }}>
                <Grid container spacing={6}>
                  {requireCurrentPassword && (
                    <Grid item xs={12}>
                      <TextField
                        name="currentPassword"
                        label="Current password"
                        placeholder="Password123!"
                        type="password"
                        error={false}
                        helperText={false}
                        autofocus
                      />
                    </Grid>
                  )}

                  <Grid item xs={12}>
                    <TextField
                      name="newPassword"
                      label="New password"
                      placeholder="Password123!"
                      type="password"
                      error={false}
                      helperText={false}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <PasswordQuality
                      password={values.newPassword}
                      setIsValid={setIsValid}
                      passwordConfirm={values.passwordConfirm}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      name="passwordConfirm"
                      label="Confirm new password"
                      placeholder="Password123!"
                      error={false}
                      helperText={false}
                      type="password"
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <PasswordMatch passwordMatch={matchPasswords} />
                  </Grid>
                </Grid>
              </Stack>

              <Box>
                <Button
                  type="submit"
                  disabled={isSubmitting || !isValid}
                  sx={{ mt: 3 }}
                  buttonText="Change password"
                />
              </Box>
            </Form>
          );
        }}
      </Formik>
    </Stack>
  );
}

function PasswordMatch({ passwordMatch }: { passwordMatch: boolean }) {
  return (
    <Box sx={{ mb: 3 }}>
      <Grid container mt={-5} spacing={1}>
        <Grid item xs={12} sm={12}>
          <Stack direction="row" alignItems="center" spacing={4} mt={2}>
            <CheckIcon sx={{ color: passwordMatch ? '#1ABC9C' : '#5A5A69', fontSize: 'inherit' }} />
            <Typography variant="bodyS" sx={{ color: passwordMatch ? '#1ABC9C' : '#5A5A69' }}>
              Both password must match
            </Typography>
          </Stack>
        </Grid>
      </Grid>
    </Box>
  );
}

interface PasswordQualityProps {
  readonly password: string;
  readonly passwordConfirm: string;
  readonly setIsValid: (isValid: boolean) => void;
}

function PasswordQuality({ password, setIsValid, passwordConfirm }: PasswordQualityProps) {
  const hasMinLength = password.length >= 12;
  const hasNumber = /[0-9]/.test(password);
  const hasOneUpperCaseCharacter = /[A-Z]/.test(password);
  const hasOneLowerCaseCharacter = /[a-z]/.test(password);
  const hasOneSpecialCharacter = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  const passwordsMatch = password === passwordConfirm;

  useEffect(() => {
    const isValid = passwordMeetsPolicy(password, [passwordsMatch]);
    setIsValid(isValid);
  }, [password, passwordConfirm]);

  return (
    <Box sx={{ mt: 3 }}>
      <Grid container mt={-5} spacing={1}>
        <Grid item xs={12} sm={12}>
          <Stack direction="row" alignItems="center" spacing={4} mt={2}>
            <CheckIcon
              sx={{
                color: hasMinLength ? '#1ABC9C' : '#5A5A69',
                fontSize: 'inherit'
              }}
            />
            <Typography
              variant="bodyS"
              sx={{
                color: hasMinLength ? '#1ABC9C' : '#5A5A69'
              }}
            >
              Min 12 characters
            </Typography>
          </Stack>
        </Grid>

        <Grid item xs={12} sm={12}>
          <Stack direction="row" alignItems="center" spacing={4}>
            <CheckIcon sx={{ color: hasNumber ? '#1ABC9C' : '#5A5A69', fontSize: 'inherit' }} />
            <Typography variant="bodyS" sx={{ color: hasNumber ? '#1ABC9C' : '#5A5A69' }}>
              One number
            </Typography>
          </Stack>
        </Grid>

        <Grid item xs={12} sm={12}>
          <Stack direction="row" alignItems="center" spacing={4}>
            <CheckIcon
              sx={{
                color: hasOneLowerCaseCharacter ? '#1ABC9C' : '#5A5A69',
                fontSize: 'inherit'
              }}
            />
            <Typography
              variant="bodyS"
              sx={{ color: hasOneLowerCaseCharacter ? '#1ABC9C' : '#5A5A69' }}
            >
              One lower-case character
            </Typography>
          </Stack>
        </Grid>

        <Grid item xs={12} sm={12}>
          <Stack direction="row" alignItems="center" spacing={4}>
            <CheckIcon
              sx={{
                color: hasOneUpperCaseCharacter ? '#1ABC9C' : '#5A5A69',
                fontSize: 'inherit'
              }}
            />
            <Typography
              variant="bodyS"
              sx={{ color: hasOneUpperCaseCharacter ? '#1ABC9C' : '#5A5A69' }}
            >
              One upper-case character
            </Typography>
          </Stack>
        </Grid>

        <Grid item xs={12} sm={12}>
          <Stack direction="row" alignItems="center" spacing={4}>
            <CheckIcon
              sx={{
                color: hasOneSpecialCharacter ? '#1ABC9C' : '#5A5A69',
                fontSize: 'inherit'
              }}
            />
            <Typography
              variant="bodyS"
              sx={{ color: hasOneSpecialCharacter ? '#1ABC9C' : '#5A5A69' }}
            >
              One special character
            </Typography>
          </Stack>
        </Grid>
      </Grid>
    </Box>
  );
}

function passwordMeetsPolicy(password: string, additionalPolicies: boolean[] = []) {
  const hasMinLength = password.length >= 12;
  const hasNumber = /[0-9]/.test(password);
  const hasOneUpperCaseCharacter = /[A-Z]/.test(password);
  const hasOneLowerCaseCharacter = /[a-z]/.test(password);

  return [
    hasMinLength,
    hasNumber,
    hasOneUpperCaseCharacter,
    hasOneLowerCaseCharacter,
    ...additionalPolicies
  ].every(value => value === true);
}
