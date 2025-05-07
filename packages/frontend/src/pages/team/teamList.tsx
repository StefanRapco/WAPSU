import { Box, Grid, Pagination } from '@mui/material';
import { ReactNode, useState } from 'react';
import { Button } from '../../components/button';
import { SectionHeader } from '../../components/header';
import { SearchField } from '../../components/searchField';
import { SnackbarError } from '../../components/snackbarError';
import { SnackBarSuccess, snackbarUseEffect } from '../../components/snackbarSuccess';
import { TeamCard } from '../../components/teamCard';
import { TeamCreate } from '../../components/teamCreate';
import { Typography } from '../../components/typography';
import { Identity } from '../../hooks/useIdentity';
import { useTeamMany } from '../../hooks/useTeamMany';

const ITEMS_PER_PAGE = 16;

export function TeamList(props: { identity: NonNullable<Identity> }): ReactNode {
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const { data, refetch } = useTeamMany({
    page: page - 1,
    pageSize: ITEMS_PER_PAGE,
    term: searchTerm,
    userId: [props.identity.id]
  });

  const handleTeamCreate = () => {
    setIsDrawerOpen(false);
    setSuccess(true);
    refetch();
  };

  const handleTeamCreateError = () => {
    setError(true);
  };

  const handlePageChange = (_event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setPage(1); // Reset to first page when searching
  };

  snackbarUseEffect({
    success,
    error,
    setSuccess: value => setSuccess(value),
    setError: value => setError(value)
  });

  const totalPages = data ? Math.ceil(data.total / ITEMS_PER_PAGE) : 0;

  return (
    <Grid container spacing={9}>
      <Grid item xs={12}>
        <SectionHeader
          action={<Button buttonText="Create Team" onClick={() => setIsDrawerOpen(true)} />}
        >
          Teams
        </SectionHeader>
      </Grid>

      <Grid item xs={12}>
        <Box
          sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 4 }}
        >
          <Typography sx={{ flex: 1 }}>
            <>
              Teams help you collaborate efficiently by organizing tasks, assigning
              responsibilities, and tracking progress in one place. Each team can have multiple
              members, with roles and permissions to ensure smooth workflow management. Create a
              team, invite members, and start working together seamlessly!
            </>
          </Typography>
          <SearchField
            placeholder="Search teams..."
            value={searchTerm}
            onSearchChange={handleSearchChange}
          />
        </Box>
      </Grid>

      <TeamCreate
        open={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        onSubmit={handleTeamCreate}
        onError={handleTeamCreateError}
      />

      <Grid item xs={12}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            minHeight: 'calc(100vh - 400px)'
          }}
        >
          <Box sx={{ flexGrow: 1 }}>
            <Grid container spacing={4}>
              {data?.items.map(team => (
                <Grid key={team.id} item xs={12} sm={6} md={1.5}>
                  <TeamCard team={team} />
                </Grid>
              ))}
            </Grid>
          </Box>

          {totalPages > 1 && (
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                mt: 4,
                pt: 2
              }}
            >
              <Pagination
                count={totalPages}
                page={page}
                onChange={handlePageChange}
                color="primary"
                size="large"
              />
            </Box>
          )}
        </Box>
      </Grid>

      <SnackBarSuccess
        open={success}
        successMsg="Team created successfully"
        setSuccess={value => setSuccess(value)}
      />

      <SnackbarError
        mutationError={error}
        setMutationError={value => setError(value)}
        apolloErrors={[]}
      />
    </Grid>
  );
}
