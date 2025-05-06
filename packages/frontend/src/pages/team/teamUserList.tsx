import {
  Box,
  Grid,
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
  TableRow
} from '@mui/material';
import { ReactNode, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Button } from '../../components/button';
import { Drawer } from '../../components/drawer';
import { SectionHeader } from '../../components/header';
import { getInitials } from '../../components/navigation/accountMenu';
import { CircularAvatar } from '../../components/navigation/circularAvatar';
import { SearchField } from '../../components/searchField';
import { Typography } from '../../components/typography';
import { UserSelect } from '../../components/userSelect';
import { useTeamOne } from '../../hooks/useTeamOne';
import { useUserMany } from '../../hooks/useUserMany';

const ROWS_PER_PAGE_OPTIONS = [5, 10, 25, 50];

export function TeamUserList(): ReactNode {
  const { id } = useParams<{ id: string }>();

  if (id == null) throw new Error('Team ID is required');

  const { data: team } = useTeamOne(id);
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  const [filterTerm, setFilterTerm] = useState<string>('');
  const [page, setPage] = useState<number>(1);
  const [rowsPerPage, setRowsPerPage] = useState<number>(5);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);

  const { data: teamUsers } = useUserMany({
    term: filterTerm,
    teamId: [id],
    page: page - 1,
    pageSize: rowsPerPage
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

  if (team == null) return null;

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
              </TableRow>
            </TableHead>
            <TableBody>
              {teamUsers?.items.map(user => (
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
                    <Typography>{'ROLEE'}</Typography>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {teamUsers != null && (
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
                count={Math.ceil(teamUsers.total / rowsPerPage)}
                page={page}
                onChange={handlePageChange}
                color="primary"
                size="large"
              />
            </Box>
          )}
        </TableContainer>
      </Grid>

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
              disabled={selectedUsers == null || selectedUsers.length === 0}
              buttonText="Add Selected Users"
              onClick={() => setIsDrawerOpen(false)}
            />
          </Box>
        </Stack>
      </Drawer>
    </Grid>
  );
}
