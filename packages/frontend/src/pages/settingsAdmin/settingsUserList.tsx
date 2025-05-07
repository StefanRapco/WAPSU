import {
  Box,
  Grid,
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
  TableRow
} from '@mui/material';
import { ReactNode, useState } from 'react';
import { SectionHeader } from '../../components/header';
import { SearchField } from '../../components/searchField';
import { Typography } from '../../components/typography';
import { useUserMany } from '../../hooks/useUserMany';

const ROWS_PER_PAGE_OPTIONS = [5, 10, 25, 50];

export function SettingsUserList(): ReactNode {
  const [adminPage, setAdminPage] = useState(1);
  const [userPage, setUserPage] = useState(1);
  const [adminSearch, setAdminSearch] = useState('');
  const [userSearch, setUserSearch] = useState('');
  const [adminPageSize, setAdminPageSize] = useState(5);
  const [userPageSize, setUserPageSize] = useState(5);

  const { data: adminData, loading: adminLoading } = useUserMany({
    adminRoleOnly: true,
    term: adminSearch,
    page: adminPage - 1,
    pageSize: adminPageSize
  });

  const { data: userData, loading: userLoading } = useUserMany({
    userRoleOnly: true,
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
    </Grid>
  );
}
