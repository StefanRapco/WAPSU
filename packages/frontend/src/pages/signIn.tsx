import { useApolloClient, useMutation } from '@apollo/client';
import { Box, Container, Stack, useMediaQuery } from '@mui/material';
import { Form, Formik } from 'formik';
import { useState } from 'react';
import * as yup from 'yup';
import { Button } from '../components/button';
import { LightModeLogo } from '../components/logos';
import { SnackbarError } from '../components/snackbarError';
import { TextField } from '../components/textField';
import { Typography } from '../components/typography';
import { gql } from '../gql-generated/gql';
import { identityQuery } from '../hooks/useIdentity';

export function SignIn() {
  const client = useApolloClient();
  const matches = useMediaQuery('(min-width:600px)');
  const [error, setError] = useState<boolean>(false);
  const [screen, setScreen] = useState<{
    type: 'signInCode' | 'signInCodeComplete' | 'signInPassword';
  }>({
    type: 'signInCode'
  });

  const [signInCode, { error: signInError }] = useMutation(signInCodeMutation, {
    onError: () => setError(true),
    onCompleted: () => setScreen({ type: 'signInCodeComplete' })
  });

  const [signInCodeComplete, { error: signInCompleteError }] = useMutation(
    signInCodeCompleteMutation,
    {
      onError: () => setError(true),
      onCompleted: async () => {
        await client.refetchQueries({ include: [identityQuery] });
        setScreen({ type: 'signInCode' });
      }
    }
  );

  const [signInPassword, { error: signInPasswordError }] = useMutation(signInPasswordMutation, {
    onError: () => setError(true),
    onCompleted: async () => {
      await client.refetchQueries({ include: [identityQuery] });
    }
  });

  const validationSchema = yup.object({
    email: yup.string().email('Invalid email format').required('Email is required'),
    code:
      screen.type === 'signInCodeComplete'
        ? yup.string().required('Code is a required field')
        : yup.string().nullable(),
    password:
      screen.type === 'signInPassword'
        ? yup.string().required('Password is a required field')
        : yup.string().nullable()
  });

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh'
        }}
      >
        <Stack
          sx={{
            padding: theme => theme.spacing(9),
            borderRadius: matches ? '16px' : '',
            border: matches ? '1px solid #282832' : 'none',
            width: '300px'
          }}
          spacing={5}
        >
          <LightModeLogo sx={{ width: '70px', marginRight: 10 }} />
          <Typography variant="h4" sx={{ mb: 2 }}>
            Welcome back!
          </Typography>

          <Typography sx={{ mb: 2 }}>Sign in to DoSync.</Typography>

          <Formik
            initialValues={{ email: '', code: '', password: '' }}
            enableReinitialize
            validationSchema={validationSchema}
            onSubmit={async values => {
              if (screen.type === 'signInCode') {
                await signInCode({ variables: { input: { email: values.email } } });
                return;
              }

              if (screen.type === 'signInPassword') {
                await signInPassword({
                  variables: { input: { email: values.email, password: values.password } }
                });
                return;
              }

              await signInCodeComplete({
                variables: { input: { email: values.email, code: values.code } }
              });
            }}
          >
            {({ isSubmitting, touched, errors }) => (
              <Form>
                <Stack spacing={5}>
                  <TextField
                    name="email"
                    label="Email"
                    placeholder="Enter your email here"
                    autofocus
                    helperText={touched.email}
                    error={touched.email && errors.email != null}
                  />

                  {screen.type === 'signInCodeComplete' && (
                    <TextField
                      name="code"
                      label="Code"
                      placeholder="Enter your code here"
                      helperText={touched.code}
                      error={touched.code && errors.code != null}
                    />
                  )}
                  {screen.type === 'signInPassword' && (
                    <TextField
                      name="password"
                      label="Password"
                      type="password"
                      placeholder="Enter your password here"
                      helperText={touched.password}
                      error={touched.password && errors.password != null}
                    />
                  )}
                </Stack>
                <Stack marginTop={4} spacing={3} alignItems="center">
                  <Button
                    fullWidth
                    type="submit"
                    disabled={isSubmitting}
                    buttonText={((): string => {
                      if (screen.type === 'signInCode') return 'Send a code';
                      return isSubmitting ? 'Signing In...' : 'Sign In';
                    })()}
                  />
                  <Button
                    fullWidth
                    disabled={isSubmitting}
                    buttonText={
                      screen.type === 'signInCode' || screen.type === 'signInCodeComplete'
                        ? 'Sign in by password'
                        : 'Sign in by code'
                    }
                    onClick={() => {
                      if (screen.type === 'signInCode') setScreen({ type: 'signInPassword' });
                      if (screen.type === 'signInPassword') setScreen({ type: 'signInCode' });
                    }}
                  />
                </Stack>
              </Form>
            )}
          </Formik>
        </Stack>
      </Box>

      <SnackbarError
        mutationError={error}
        setMutationError={value => setError(value)}
        apolloErrors={[signInError, signInCompleteError, signInPasswordError]}
      />
    </Container>
  );
}

const signInCodeMutation = gql(`
  mutation SignInCode($input: SignInCodeRequestInput!) {
    signInCodeRequest(input: $input) 
  }
`);

const signInCodeCompleteMutation = gql(`
  mutation SignInCodeComplete($input: SignInCodeCompleteInput!) {
    signInCodeComplete(input: $input)
  }
`);

const signInPasswordMutation = gql(`
  mutation SignInPassword($input: SignInPasswordInput!) {
    signInPassword(input: $input)
  }
`);
