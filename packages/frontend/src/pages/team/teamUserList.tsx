import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import CloseIcon from '@mui/icons-material/Close';
import {
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
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
import { ReactNode, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Button } from '../../components/button';
import { Drawer } from '../../components/drawer';
import { SectionHeader } from '../../components/header';
import { getInitials } from '../../components/navigation/accountMenu';
import { CircularAvatar } from '../../components/navigation/circularAvatar';
import { SearchField } from '../../components/searchField';
import { SnackBarSuccess } from '../../components/snackbarSuccess';
import { Typography } from '../../components/typography';
import { UserSelect } from '../../components/userSelect';
import { TeamUserEditAction } from '../../gql-generated/graphql';
import { useIdentity } from '../../hooks/useIdentity';
import { useTeamOne } from '../../hooks/useTeamOne';
import { useTeamUserManagement } from '../../hooks/useTeamUserManagement';

const ROWS_PER_PAGE_OPTIONS = [5, 10, 25, 50];

const rolePriority: Record<'owner' | 'ambassador' | 'member', number> = {
  owner: 0,
  ambassador: 1,
  member: 2
};

export function TeamUserList(): ReactNode {
  const { id } = useParams<{ id: string }>();
  const { identity } = useIdentity();
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string }>({
    open: false,
    message: ''
  });

  if (id == null) throw new Error('Team ID is required');

  const { data: team } = useTeamOne(id);
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  const [filterTerm, setFilterTerm] = useState<string>('');
  const [page, setPage] = useState<number>(1);
  const [rowsPerPage, setRowsPerPage] = useState<number>(5);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
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

  const { addUsers, editUser, loading } = useTeamUserManagement();

  const { data: teamUsers, refetch } = useTeamOne(id, {
    term: filterTerm,
    teamId: [id],
    page: 0,
    pageSize: 1000
  });

  const handlePageChange = (_event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  const handleRowsPerPageChange = (event: SelectChangeEvent<number>) => {
    setRowsPerPage(Number(event.target.value));
    setPage(1); // Reset to first page when changing rows per page
  };

  const handleSearchChange = (value: string) => {
    setFilterTerm(value);
    setPage(1); // Reset to first page when searching
  };

  const handleAddUsers = async () => {
    if (selectedUsers.length === 0) return;
    await addUsers(id, selectedUsers);
    setIsDrawerOpen(false);
    setSelectedUsers([]);
    refetch();
    setSnackbar({ open: true, message: 'Users added to team successfully' });
  };

  const handleRoleChange = async (userId: string, action: TeamUserEditAction) => {
    const targetUser = teamUsers?.users.items.find(u => u.id === userId);
    const currentUser = teamUsers?.users.items.find(u => u.id === identity?.id);

    if (!targetUser || !currentUser) return;

    // Check if this is an owner transfer
    if (
      action === 'upgrade' &&
      targetUser.teamRole.value === 'ambassador' &&
      currentUser.teamRole.value === 'owner'
    ) {
      setConfirmDialog({
        open: true,
        title: 'Transfer Ownership',
        message: 'Are you sure you want to transfer ownership? You will lose your owner role.',
        onConfirm: async () => {
          await editUser(id, userId, action as TeamUserEditAction);
          refetch();
          setConfirmDialog({ ...confirmDialog, open: false });
          setSnackbar({ open: true, message: 'Ownership transferred successfully' });
        }
      });
      return;
    }

    await editUser(id, userId, action as TeamUserEditAction);
    refetch();

    switch (action) {
      case 'upgrade':
        setSnackbar({ open: true, message: 'User role upgraded successfully' });
        break;
      case 'downgrade':
        setSnackbar({ open: true, message: 'User role downgraded successfully' });
        break;
      case 'remove':
        setSnackbar({ open: true, message: 'User removed from team successfully' });
        break;
    }
  };

  if (team == null) return null;

  const copy = [...(teamUsers?.users.items ?? [])];

  const sortedUsers = copy.sort((a, b) => {
    const roleDiff = rolePriority[a.teamRole.value] - rolePriority[b.teamRole.value];
    if (roleDiff !== 0) {
      return roleDiff;
    }
    return a.fullName.localeCompare(b.fullName);
  });

  // Apply pagination after sorting
  const paginatedUsers = sortedUsers.slice((page - 1) * rowsPerPage, page * rowsPerPage);

  return (
    <Grid container spacing={9}>
      <Grid item xs={12}>
        <SectionHeader
          breadcrumbs={[
            { label: 'Teams', to: '/teams' },
            { label: team.name, to: `/teams/${id}` },
            { label: 'Team users' }
          ]}
          action={<Button buttonText="Add user" onClick={() => setIsDrawerOpen(true)} />}
        >
          Team users
        </SectionHeader>
      </Grid>

      <Grid item xs={12}>
        <Box
          sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 4 }}
        >
          <Typography>
            <>
              Users are the core of your task manager, allowing individuals to create, assign, and
              complete tasks efficiently. Each user has their own account, with roles and
              permissions that determine their level of access within teams and projects. Sign up,
              invite others, and start managing your tasks effortlessly!
            </>
          </Typography>
          <SearchField
            placeholder="Search users..."
            value={filterTerm}
            onSearchChange={handleSearchChange}
          />
        </Box>
      </Grid>

      <Grid item xs={12}>
        <Typography variant="h6" sx={{ mb: 3 }}>
          Users
        </Typography>
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
                  <Typography>Role</Typography>
                </TableCell>
                <TableCell>
                  <Typography>Role Management</Typography>
                </TableCell>
                <TableCell>
                  <Typography>Remove User</Typography>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedUsers.map(user => (
                <TableRow key={user.id}>
                  <TableCell>
                    <Stack direction="row" alignItems="center" spacing={5}>
                      <CircularAvatar size="s">{getInitials(user.fullName)}</CircularAvatar>
                      <Typography>{user.fullName}</Typography>
                    </Stack>
                  </TableCell>
                  <TableCell>
                    <Typography>{user.email}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography>{user.teamRole.label}</Typography>
                  </TableCell>
                  <TableCell>
                    <Stack direction="row" spacing={1}>
                      <Tooltip
                        title={
                          user.teamRole.value === 'ambassador'
                            ? 'Upgrade to owner'
                            : 'Upgrade to ambassador'
                        }
                      >
                        <IconButton
                          size="small"
                          color="primary"
                          aria-label="upgrade role"
                          onClick={() => handleRoleChange(user.id, 'upgrade' as TeamUserEditAction)}
                          disabled={loading || user.teamRole.value === 'owner'}
                        >
                          <ArrowUpwardIcon />
                        </IconButton>
                      </Tooltip>

                      <Tooltip
                        title={
                          user.teamRole.value === 'owner'
                            ? 'Downgrade to ambassador'
                            : 'Downgrade to member'
                        }
                      >
                        <IconButton
                          size="small"
                          color="primary"
                          aria-label="downgrade role"
                          onClick={() =>
                            handleRoleChange(user.id, 'downgrade' as TeamUserEditAction)
                          }
                          disabled={loading || user.teamRole.value === 'member'}
                        >
                          <ArrowDownwardIcon />
                        </IconButton>
                      </Tooltip>
                    </Stack>
                  </TableCell>
                  <TableCell>
                    <Tooltip title="Remove user">
                      <IconButton
                        size="small"
                        color="error"
                        aria-label="remove user"
                        onClick={() => handleRoleChange(user.id, 'remove' as TeamUserEditAction)}
                        disabled={loading || user.teamRole.value === 'owner'}
                      >
                        <CloseIcon />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {teamUsers != null && teamUsers.users.items != null && (
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
              <Stack direction="row" spacing={1} alignItems="center" sx={{ ml: 3 }}>
                <Typography variant="body2" color="textSecondary" sx={{ whiteSpace: 'nowrap' }}>
                  Rows per page:
                </Typography>
                <Select
                  value={rowsPerPage}
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
              </Stack>

              <MuiPagination
                count={Math.ceil(sortedUsers.length / rowsPerPage)}
                page={page}
                onChange={handlePageChange}
                color="primary"
                size="large"
              />
            </Box>
          )}
        </TableContainer>
      </Grid>

      <Dialog
        open={confirmDialog.open}
        onClose={() => setConfirmDialog({ ...confirmDialog, open: false })}
      >
        <DialogTitle>{confirmDialog.title}</DialogTitle>
        <DialogContent>
          <DialogContentText>{confirmDialog.message}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            buttonText="Cancel"
            onClick={() => setConfirmDialog({ ...confirmDialog, open: false })}
          />
          <Button buttonText="Confirm" onClick={confirmDialog.onConfirm} />
        </DialogActions>
      </Dialog>

      <Drawer open={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} title="Add Users to Team">
        <Stack spacing={2} ml={8} mr={8}>
          <UserSelect
            onUserChange={values => setSelectedUsers(values)}
            filterIdentity
            notTeamId={[id]}
          />
          <Box sx={{ mt: 3 }}>
            <Button
              type="submit"
              disabled={selectedUsers == null || selectedUsers.length === 0 || loading}
              buttonText="Add Selected Users"
              onClick={handleAddUsers}
            />
          </Box>
        </Stack>
      </Drawer>

      <SnackBarSuccess
        open={snackbar.open}
        successMsg={snackbar.message}
        setSuccess={value => setSnackbar({ ...snackbar, open: value })}
      />
    </Grid>
  );
}
