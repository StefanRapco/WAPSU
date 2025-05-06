import { Card, CardContent, CardMedia, Grid, Stack } from '@mui/material';
import { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/button';
import { SectionHeader } from '../../components/header';
import { Typography } from '../../components/typography';

export function TeamList(): ReactNode {
  const navigate = useNavigate();
  const teams = [
    { id: 1, name: 'Development Team', members: 10, image: 'devImage' },
    { id: 2, name: 'Marketing Team', members: 7, image: 'marketingImage' },
    { id: 3, name: 'Design Team', members: 5, image: 'designImage' },
    { id: 4, name: 'HR Team', members: 4, image: 'hrImage' }
  ];

  return (
    <Grid container spacing={9}>
      <Grid item xs={12}>
        <SectionHeader>Teams</SectionHeader>
      </Grid>

      <Grid item xs={12}>
        <Typography>
          <>
            Teams help you collaborate efficiently by organizing tasks, assigning responsibilities,
            and tracking progress in one place. Each team can have multiple members, with roles and
            permissions to ensure smooth workflow management. Create a team, invite members, and
            start working together seamlessly!
          </>
        </Typography>
      </Grid>

      {teams.map(team => (
        <Grid key={team.id} item xs={4}>
          <Card>
            <CardMedia component="img" height="140" image={team.image} alt={team.name} />
            <CardContent>
              <Typography variant="h6">{team.name}</Typography>
              <Typography variant="body2" color="textSecondary">
                {team.members} Members
              </Typography>
              <Stack direction="row" mt={5} spacing={5}>
                <Button
                  buttonText="Visit team"
                  onClick={() => navigate(`${team.id}`)}
                  sx={{ minWidth: 200 }}
                />
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}
