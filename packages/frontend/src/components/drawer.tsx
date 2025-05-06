import CloseIcon from '@mui/icons-material/Close';
import {
  Box,
  DrawerProps,
  IconButton,
  Drawer as MUIDrawer,
  Stack,
  SxProps,
  Theme,
  ThemeProvider,
  Typography
} from '@mui/material';
import React from 'react';
import { useTheme } from '../theme';

interface VaultDrawerProps extends Omit<DrawerProps, 'title'> {
  readonly open: boolean;
  readonly onClose: () => void;
  readonly children: React.ReactNode;
  readonly title: React.ReactNode;
  readonly customAction?: React.ReactNode;
  readonly sx?: SxProps<Theme>;
}

export function Drawer({
  open,
  onClose,
  title,
  children,
  sx,
  customAction,
  ...props
}: VaultDrawerProps) {
  const theme = useTheme({ mode: 'light' });

  return (
    <ThemeProvider theme={theme}>
      <MUIDrawer
        anchor="right"
        open={open}
        onClose={onClose}
        transitionDuration={{ enter: 300, exit: 100 }}
        PaperProps={{
          sx: {
            minWidth: { xs: '100%', md: '562px' },
            maxWidth: { xs: '100%', md: '562px' },
            height: { xs: '100%', md: 'calc(100% - 32px)' },
            color: theme => theme.brandPalette.foreground.neutral,
            margin: theme => ({ xs: theme.spacing(0), md: theme.spacing(5) }),
            borderRadius: theme => ({ xs: `${theme.radius[0]}px`, md: `${theme.radius.l}px` }),
            background: theme => theme.brandPalette.background.neutral,
            '&::-webkit-scrollbar': { display: 'none' },
            overflowX: 'hidden',
            ...sx
          }
        }}
        {...props}
      >
        {open && (
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            className="drawerHeader"
            sx={{
              padding: theme => theme.spacing(8, 8, 5, 8),
              background: theme => theme.brandPalette.background.neutral,
              zIndex: theme => theme.zIndex.drawer + 1,
              position: 'sticky',
              top: '0px'
            }}
          >
            <Typography fontSize="1.75rem" fontWeight={400}>
              {title}
            </Typography>
            <Stack direction="row" alignItems="center" spacing={4}>
              {customAction}
              <IconButton
                aria-label="close"
                onClick={onClose}
                sx={{
                  color: theme => theme.brandPalette.foreground.neutral
                }}
              >
                <CloseIcon />
              </IconButton>
            </Stack>
          </Stack>
        )}
        <Box height="100%">{children}</Box>
      </MUIDrawer>
    </ThemeProvider>
  );
}
