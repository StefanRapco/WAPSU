import { Grid } from '@mui/material';
import { ReactNode } from 'react';
import { SectionHeader } from '../../components/header';
import { Typography } from '../../components/typography';

export function Settings(): ReactNode {
  return (
    <Grid container spacing={9}>
      <Grid item xs={12}>
        <SectionHeader>Admin Settings</SectionHeader>
      </Grid>

      <Grid item xs={12}>
        <Typography>
          <>TODO</>
        </Typography>
      </Grid>
    </Grid>
  );
}
