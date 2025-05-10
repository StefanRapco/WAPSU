import { useMutation } from '@apollo/client';
import SendIcon from '@mui/icons-material/Send';
import {
  Box,
  Grid,
  IconButton,
  MenuItem,
  Pagination as MuiPagination,
  Paper,
  Select,
  SelectChangeEvent,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip
} from '@mui/material';
import { Form, Formik } from 'formik';
import { ReactNode, useState } from 'react';
import * as yup from 'yup';
import { Button } from '../../components/button';
import { Drawer } from '../../components/drawer';
import { SectionHeader } from '../../components/header';
import { SearchField } from '../../components/searchField';
import { SnackbarError } from '../../components/snackbarError';
import { SnackBarSuccess, snackbarUseEffect } from '../../components/snackbarSuccess';
import { TextField } from '../../components/textField';
import { Typography } from '../../components/typography';
import { gql } from '../../gql-generated/gql';
import { useUserMany } from '../../hooks/useUserMany';

const ROWS_PER_PAGE_OPTIONS = [5, 10, 25, 50];

const USER_INVITE_MUTATION = gql(`
  mutation UserInvite($input: UserInviteInput!) {
    userInvite(input: $input) {
      id
      firstName
      lastName
      email
      status { label value }
    }
  }
`);

const USER_INVITE_RESEND_MUTATION = gql(`
  mutation UserInviteResend($input: UserInviteResendInput!) {
    userInviteResend(input: $input)
  }
`);

const inviteValidationSchema = yup.object({
  firstName: yup.string().required('First name is required'),
  lastName: yup.string().required('Last name is required'),
  email: yup.string().email('Invalid email').required('Email is required')
});

export function SettingsUserInvitedList(): ReactNode {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [pageSize, setPageSize] = useState(5);
  const [mutationError, setMutationError] = useState(false);
  const [mutationSuccess, setMutationSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const { data: invitedUsers, refetch } = useUserMany({
    status: ['invited'],
    term: search,
    page: page - 1,
    pageSize
  });

  const [inviteUser, { loading: inviteLoading, error: inviteError }] = useMutation(
    USER_INVITE_MUTATION,
    {
      onCompleted: () => {
        setIsDrawerOpen(false);
        setSuccessMessage('User invited successfully');
        setMutationSuccess(true);
        refetch();
      },
      onError: () => {
        setSuccessMessage('Failed to invite user');
        setMutationError(true);
      }
    }
  );

  const [resendInvite, { loading: resendLoading, error: resendError }] = useMutation(
    USER_INVITE_RESEND_MUTATION,
    {
      onCompleted: () => {
        setSuccessMessage('Invitation resent successfully');
        setMutationSuccess(true);
        refetch();
      },
      onError: () => {
        setSuccessMessage('Failed to resend invitation');
        setMutationError(true);
      }
    }
  );

  const handlePageChange = (_event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  const handleRowsPerPageChange = (event: SelectChangeEvent<number>) => {
    setPageSize(Number(event.target.value));
    setPage(1);
  };

  const handleResendInvitation = async (userId: string) => {
    try {
      await resendInvite({ variables: { input: { userId } } });
    } catch (error) {
      setMutationError(true);
    }
  };

  snackbarUseEffect({
    success: mutationSuccess,
    error: mutationError,
    setSuccess: setMutationSuccess,
    setError: setMutationError
  });

  return (
    <Grid container spacing={9}>
      <Grid item xs={12}>
        <SectionHeader
          breadcrumbs={[{ label: 'Settings' }, { label: 'Invited users' }]}
          action={<Button buttonText="Invite User" onClick={() => setIsDrawerOpen(true)} />}
        >
          Invited users
        </SectionHeader>
      </Grid>

      <Grid item xs={12}>
        <Typography>
          <>
            Manage pending user invitations. These are users who have been invited to join the
            system but haven't completed their registration yet. You can view their invitation
            status and manage their access.
          </>
        </Typography>
      </Grid>

      <Grid item xs={12}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h6">Pending Invitations</Typography>
          <SearchField
            size="small"
            placeholder="Search invited users..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            onSearchChange={setSearch}
            sx={{ width: '300px' }}
          />
        </Box>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  <Typography>Name</Typography>
                </TableCell>
                <TableCell>
                  <Typography>Email</Typography>
                </TableCell>
                <TableCell>
                  <Typography>Status</Typography>
                </TableCell>
                <TableCell>
                  <Typography>Actions</Typography>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {invitedUsers?.items.map(user => (
                <TableRow key={user.id}>
                  <TableCell>
                    <Typography>{user.fullName}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography>{user.email}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography>{user.status.label}</Typography>
                  </TableCell>
                  <TableCell>
                    <Tooltip title="Resend invitation">
                      <IconButton
                        size="small"
                        color="primary"
                        aria-label="resend invitation"
                        onClick={() => handleResendInvitation(user.id)}
                        disabled={resendLoading}
                      >
                        <SendIcon />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              p: 2,
              mt: 2,
              borderTop: '1px solid rgba(0, 0, 0, 0.12)'
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, ml: 3 }}>
              <Typography variant="body2" color="textSecondary" sx={{ whiteSpace: 'nowrap' }}>
                Rows per page:
              </Typography>
              <Select
                value={pageSize}
                onChange={handleRowsPerPageChange}
                size="small"
                sx={{ minWidth: 80 }}
              >
                {ROWS_PER_PAGE_OPTIONS.map(option => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </Select>
            </Box>
            <MuiPagination
              count={Math.ceil((invitedUsers?.total ?? 0) / pageSize)}
              page={page}
              onChange={handlePageChange}
              color="primary"
              size="large"
            />
          </Box>
        </TableContainer>
      </Grid>

      <Drawer open={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} title="Invite User">
        <Formik
          initialValues={{ firstName: '', lastName: '', email: '' }}
          validationSchema={inviteValidationSchema}
          onSubmit={async (values, { setSubmitting }) => {
            await inviteUser({ variables: { input: values } });
            setSubmitting(false);
          }}
        >
          {({ values, errors, touched, handleChange, handleBlur, handleSubmit, isSubmitting }) => (
            <Form onSubmit={handleSubmit}>
              <Stack sx={{ maxWidth: '400px' }}>
                <Grid container spacing={6} marginLeft={5}>
                  <Grid item xs={6}>
                    <TextField
                      label="First Name"
                      name="firstName"
                      error={!!(touched.firstName && errors.firstName)}
                      helperText={!!(touched.firstName && errors.firstName)}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      label="Last Name"
                      name="lastName"
                      error={!!(touched.lastName && errors.lastName)}
                      helperText={!!(touched.lastName && errors.lastName)}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      label="Email"
                      name="email"
                      error={!!(touched.email && errors.email)}
                      helperText={!!(touched.email && errors.email)}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Button
                      type="submit"
                      buttonText="Send Invitation"
                      disabled={isSubmitting || inviteLoading}
                    />
                  </Grid>
                </Grid>
              </Stack>
            </Form>
          )}
        </Formik>
      </Drawer>

      <SnackBarSuccess
        open={mutationSuccess}
        successMsg={successMessage}
        setSuccess={setMutationSuccess}
      />

      <SnackbarError
        mutationError={mutationError}
        setMutationError={setMutationError}
        apolloErrors={[inviteError, resendError]}
      />
    </Grid>
  );
}
