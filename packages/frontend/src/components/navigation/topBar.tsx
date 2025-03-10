import { AppBar, Box, Divider as MuiDivider, Stack, Toolbar, styled } from '@mui/material';
import { ReactNode } from 'react';

interface TopBarProps {
  readonly variant: 'default';
  readonly actions?: ReactNode;
  readonly desktopLogo: ReactNode;
  readonly position?: 'fixed' | 'sticky';
  readonly disableDivider?: boolean;
}

export function TopBar({ position = 'fixed', disableDivider = false, ...props }: TopBarProps) {
  return (
    <AppBar
      position={position}
      sx={{
        py: { xs: 5, md: 7 },
        px: { xs: 6, md: 8 },
        borderBottom: theme => `1px solid ${theme.brandPalette.border.neutralFaded}`
      }}
    >
      <Toolbar>
        <Stack
          direction="row"
          alignItems="center"
          spacing={{ xs: 5, md: 7 }}
          divider={disableDivider ? null : <Divider orientation="vertical" flexItem />}
        >
          <Stack component="span" direction="row" alignItems="center">
            <Left {...props} />
          </Stack>
        </Stack>
        <Stack direction="row" alignItems="center" spacing={5} sx={{ ml: 5 }}>
          <Right actions={props.actions} />
        </Stack>
      </Toolbar>
    </AppBar>
  );
}

function Left(props: TopBarProps) {
  return (
    <Stack display="flex" flexDirection="row" gap={7} alignItems="center">
      <Box sx={{ display: { xs: 'none', sm: 'flex' } }}>{props.desktopLogo}</Box>
    </Stack>
  );
}

function Right(props: { readonly actions?: ReactNode }) {
  if (props.actions == null) return;

  return <>{props.actions}</>;
}

const Divider = styled(MuiDivider)(() => ({
  borderBottomWidth: '1px',
  margin: '0px !important',
  backgroundColor: '#282832'
}));
