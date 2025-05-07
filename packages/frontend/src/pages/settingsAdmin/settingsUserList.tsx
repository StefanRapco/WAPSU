import ArchiveIcon from '@mui/icons-material/Archive';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import {
  Box,
  Grid,
  IconButton,
  MenuItem,
  Pagination as MuiPagination,
  Paper,
  Select,
  SelectChangeEvent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip
} from '@mui/material';
import { ReactNode, useState } from 'react';
import { ConfirmDialog } from '../../components/confirmDialog';
import { SectionHeader } from '../../components/header';
import { SearchField } from '../../components/searchField';
import { SnackbarError } from '../../components/snackbarError';
import { SnackBarSuccess, snackbarUseEffect } from '../../components/snackbarSuccess';
import { Typography } from '../../components/typography';
import { SystemRole } from '../../gql-generated/graphql';
import { useIdentity } from '../../hooks/useIdentity';
import { useUserArchive } from '../../hooks/useUserArchive';
import { useUserMany } from '../../hooks/useUserMany';
import { useUserRoleManagement } from '../../hooks/useUserRoleManagement';

const ROWS_PER_PAGE_OPTIONS = [5, 10, 25, 50];

export function SettingsUserList(): ReactNode {
  const [adminPage, setAdminPage] = useState(1);
  const [userPage, setUserPage] = useState(1);
  const [adminSearch, setAdminSearch] = useState('');
  const [userSearch, setUserSearch] = useState('');
  const [adminPageSize, setAdminPageSize] = useState(5);
  const [userPageSize, setUserPageSize] = useState(5);
  const [mutationError, setMutationError] = useState(false);
  const [mutationSuccess, setMutationSuccess] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
  }>({
    open: false,
    title: '',
    message: '',
    onConfirm: () => {}
  });

  const { identity } = useIdentity();
  const { updateRole, loading: roleLoading, error: roleError } = useUserRoleManagement();
  const { archiveUser, loading: archiveLoading, error: archiveError } = useUserArchive();

  const { data: adminData, refetch: refetchAdmins } = useUserMany({
    systemRole: ['admin'],
    status: ['active'],
    term: adminSearch,
    page: adminPage - 1,
    pageSize: adminPageSize
  });

  const { data: userData, refetch: refetchUsers } = useUserMany({
    systemRole: ['user'],
    status: ['active'],
    term: userSearch,
    page: userPage - 1,
    pageSize: userPageSize
  });

  const handleAdminPageChange = (_event: React.ChangeEvent<unknown>, value: number) => {
    setAdminPage(value);
  };

  const handleUserPageChange = (_event: React.ChangeEvent<unknown>, value: number) => {
    setUserPage(value);
  };

  const handleAdminRowsPerPageChange = (event: SelectChangeEvent<number>) => {
    setAdminPageSize(Number(event.target.value));
    setAdminPage(1);
  };

  const handleUserRowsPerPageChange = (event: SelectChangeEvent<number>) => {
    setUserPageSize(Number(event.target.value));
    setUserPage(1);
  };

  const handleRoleChange = async (userId: string, newRole: SystemRole) => {
    const isDowngradingAdmin = newRole === 'user';
    const remainingAdmins = adminData?.items.filter(u => u.id !== userId).length ?? 0;

    if (isDowngradingAdmin && remainingAdmins === 0) {
      setConfirmDialog({
        open: true,
        title: 'Cannot Downgrade Last Admin',
        message: 'You cannot downgrade the last admin in the system.',
        onConfirm: () => setConfirmDialog({ ...confirmDialog, open: false })
      });
      return;
    }

    if (isDowngradingAdmin) {
      setConfirmDialog({
        open: true,
        title: 'Downgrade Admin',
        message: 'Are you sure you want to downgrade this user from admin to member?',
        onConfirm: async () => {
          try {
            await updateRole(userId, newRole);
            refetchAdmins();
            refetchUsers();
            setConfirmDialog({ ...confirmDialog, open: false });
            setMutationSuccess(true);
          } catch (error) {
            setMutationError(true);
          }
        }
      });
      return;
    }

    setConfirmDialog({
      open: true,
      title: 'Upgrade to Admin',
      message: 'Are you sure you want to upgrade this user to admin?',
      onConfirm: async () => {
        try {
          await updateRole(userId, newRole);
          refetchAdmins();
          refetchUsers();
          setConfirmDialog({ ...confirmDialog, open: false });
          setMutationSuccess(true);
        } catch (error) {
          setMutationError(true);
        }
      }
    });
  };

  const handleArchive = async (userId: string) => {
    setConfirmDialog({
      open: true,
      title: 'Archive User',
      message:
        'Are you sure you want to archive this user? They will no longer be able to access the system.',
      onConfirm: async () => {
        try {
          await archiveUser(userId);
          refetchAdmins();
          refetchUsers();
          setConfirmDialog({ ...confirmDialog, open: false });
          setMutationSuccess(true);
        } catch (error) {
          setMutationError(true);
        }
      }
    });
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
        <SectionHeader breadcrumbs={[{ label: 'Settings' }, { label: 'System users' }]}>
          System users
        </SectionHeader>
      </Grid>

      <Grid item xs={12}>
        <Typography>
          <>
            Users are the core of your task manager, allowing individuals to create, assign, and
            complete tasks efficiently. Each user has their own account, with roles and permissions
            that determine their level of access within teams and projects. Sign up, invite others,
            and start managing your tasks effortlessly!
          </>
        </Typography>
      </Grid>

      <Grid item xs={12}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h6">Admins</Typography>
          <SearchField
            size="small"
            placeholder="Search admins..."
            value={adminSearch}
            onChange={e => setAdminSearch(e.target.value)}
            onSearchChange={setAdminSearch}
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
                  <Typography>Actions</Typography>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {adminData?.items.map(user => (
                <TableRow key={user.id}>
                  <TableCell>
                    <Typography>{user.fullName}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography>{user.email}</Typography>
                  </TableCell>
                  <TableCell>
                    {user.id !== identity?.id && (
                      <Tooltip title="Downgrade to member">
                        <IconButton
                          onClick={() => handleRoleChange(user.id, 'user' as SystemRole)}
                          disabled={roleLoading || archiveLoading}
                        >
                          <ArrowDownwardIcon />
                        </IconButton>
                      </Tooltip>
                    )}
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
                value={adminPageSize}
                onChange={handleAdminRowsPerPageChange}
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
              count={Math.ceil((adminData?.total ?? 0) / adminPageSize)}
              page={adminPage}
              onChange={handleAdminPageChange}
              color="primary"
              size="large"
            />
          </Box>
        </TableContainer>
      </Grid>

      <Grid item xs={12}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h6">Users</Typography>
          <SearchField
            size="small"
            placeholder="Search users..."
            value={userSearch}
            onChange={e => setUserSearch(e.target.value)}
            onSearchChange={setUserSearch}
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
                  <Typography>Actions</Typography>
                </TableCell>
                <TableCell>
                  <Typography>Archive</Typography>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {userData?.items.map(user => (
                <TableRow key={user.id}>
                  <TableCell>
                    <Typography>{user.fullName}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography>{user.email}</Typography>
                  </TableCell>
                  <TableCell>
                    <Tooltip title="Upgrade to admin">
                      <IconButton
                        onClick={() => handleRoleChange(user.id, 'admin' as SystemRole)}
                        disabled={roleLoading || archiveLoading}
                      >
                        <ArrowUpwardIcon />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                  <TableCell>
                    <Tooltip title="Archive user">
                      <IconButton onClick={() => handleArchive(user.id)} disabled={archiveLoading}>
                        <ArchiveIcon />
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
                value={userPageSize}
                onChange={handleUserRowsPerPageChange}
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
              count={Math.ceil((userData?.total ?? 0) / userPageSize)}
              page={userPage}
              onChange={handleUserPageChange}
              color="primary"
              size="large"
            />
          </Box>
        </TableContainer>
      </Grid>

      <ConfirmDialog
        open={confirmDialog.open}
        title={confirmDialog.title}
        message={confirmDialog.message}
        onConfirm={confirmDialog.onConfirm}
        onClose={() => setConfirmDialog({ ...confirmDialog, open: false })}
      />

      <SnackbarError
        apolloErrors={[roleError, archiveError]}
        mutationError={mutationError}
        setMutationError={setMutationError}
      />

      <SnackBarSuccess
        open={mutationSuccess}
        successMsg="Operation completed successfully"
        setSuccess={setMutationSuccess}
      />
    </Grid>
  );
}
