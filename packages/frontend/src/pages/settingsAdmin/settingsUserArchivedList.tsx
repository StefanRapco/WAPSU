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

export function SettingsUserArchivedList(): ReactNode {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [pageSize, setPageSize] = useState(5);

  const { data: archivedData } = useUserMany({
    status: ['archived'],
    term: search,
    page: page - 1,
    pageSize
  });

  const handlePageChange = (_event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  const handleRowsPerPageChange = (event: SelectChangeEvent<number>) => {
    setPageSize(Number(event.target.value));
    setPage(1);
  };

  return (
    <Grid container spacing={9}>
      <Grid item xs={12}>
        <SectionHeader breadcrumbs={[{ label: 'Settings' }, { label: 'Archived users' }]}>
          Archived users
        </SectionHeader>
      </Grid>

      <Grid item xs={12}>
        <Typography>
          <>
            This page displays all archived users in the system. Archived users no longer have
            access to the system but their data is preserved for reference. You can search through
            the list to find specific archived users.
          </>
        </Typography>
      </Grid>

      <Grid item xs={12}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h6">Archived Users</Typography>
          <SearchField
            size="small"
            placeholder="Search archived users..."
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
              </TableRow>
            </TableHead>
            <TableBody>
              {archivedData?.items.map(user => (
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
              count={Math.ceil((archivedData?.total ?? 0) / pageSize)}
              page={page}
              onChange={handlePageChange}
              color="primary"
              size="large"
            />
          </Box>
        </TableContainer>
      </Grid>
    </Grid>
  );
}
