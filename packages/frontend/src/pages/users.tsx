import {
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@mui/material';
import { ReactNode } from 'react';
import { SectionHeader } from '../components/header';
import { Typography } from '../components/typography';

export function Users(): ReactNode {
  const users = [
    { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Admin' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'User' },
    { id: 3, name: 'Alice Johnson', email: 'alice@example.com', role: 'Editor' },
    { id: 4, name: 'Bob Brown', email: 'bob@example.com', role: 'Viewer' }
  ];

  return (
    <Grid container spacing={9}>
      <Grid item xs={12}>
        <SectionHeader>Users</SectionHeader>
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
              {users.map(user => (
                <TableRow key={user.id}>
                  <TableCell>
                    <Typography>{user.name}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography>{user.email}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography>{user.role}</Typography>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Grid>
    </Grid>
  );
}
