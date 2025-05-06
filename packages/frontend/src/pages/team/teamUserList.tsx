import {
  Grid,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@mui/material';
import { ReactNode, useState } from 'react';
import { Button } from '../../components/button';
import { Drawer } from '../../components/drawer';
import { SectionHeader } from '../../components/header';
import { getInitials } from '../../components/navigation/accountMenu';
import { CircularAvatar } from '../../components/navigation/circularAvatar';
import { Pagination } from '../../components/pagination';
import { Typography } from '../../components/typography';
import { UserSelect } from '../../components/userSelect';
import { useUserMany } from '../../hooks/useUserMany';

interface User {
  readonly id: number;
  readonly name: string;
  readonly email: string;
  readonly role: string;
}

export function TeamUserList(): ReactNode {
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  const [filterTerm, setFilterTerm] = useState<string>('');
  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(5);

  const { data: teamUsers } = useUserMany({
    term: filterTerm,
    page,
    pageSize: rowsPerPage
  });

  const handleAddUsers = (selectedUserIds: string[]) => {
    alert(`Selected users: ${selectedUserIds}`);
  };

  return (
    <Grid container spacing={9}>
      <Grid item xs={12}>
        <SectionHeader
          breadcrumbs={[
            { label: 'Teams', to: '/teams' },
            { label: 'Team name' },
            { label: 'Team users' }
          ]}
          action={<Button buttonText="Add user" onClick={() => setIsDrawerOpen(true)} />}
        >
          Team users
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
            <Pagination
              total={teamUsers.total}
              hasMore={teamUsers.hasMore}
              page={page}
              rowsPerPage={rowsPerPage}
              onPageChange={(newPage, newRowsPerPage) => {
                setPage(newPage);
                setRowsPerPage(newRowsPerPage);
              }}
              upperDivider
            />
          )}
        </TableContainer>
      </Grid>

      <Drawer open={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} title="Add Users to Team">
        <UserSelect
          onSubmit={values => {
            handleAddUsers(values);
            setIsDrawerOpen(false);
          }}
        />
      </Drawer>
    </Grid>
  );
}
