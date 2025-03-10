import { Box, Container as MuiContainer, styled } from '@mui/material';
import React from 'react';
import { NavigationBar, NavigationItem } from '../../components/navigation/navigationBar';

export function DefaultLayout(props: {
  readonly topBar?: React.ReactNode;
  readonly footer?: React.ReactNode;
  readonly children: React.ReactNode;
  readonly navigation: NavigationItem[];
}) {
  return (
    <Main>
      {props.topBar}
      <Box
        sx={{
          pt: props.topBar ? undefined : 7,
          display: 'flex',
          flexDirection: 'row',
          minHeight: '100vh'
        }}
      >
        <NavigationBar items={props.navigation} />
        <Box sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1, marginTop: '88px' }}>
          <Container>{props.children}</Container>
          {props.footer}
        </Box>
      </Box>
    </Main>
  );
}

const Main = styled('div')(({ theme }) => {
  return {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    flexGrow: 1,
    height: '100vh',
    backgroundColor: theme.palette.background.default
  };
});

const Container = styled(MuiContainer)(({ theme }) => {
  return {
    maxWidth: '1440px',
    [theme.breakpoints.up('md')]: {
      padding: theme.spacing(7, 9, 0, 9)
    },
    [theme.breakpoints.down('md')]: {
      padding: theme.spacing(7, 6, 0, 6)
    }
  };
});
