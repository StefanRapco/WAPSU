import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Stack,
  SxProps,
  Theme,
  Toolbar,
  Typography
} from '@mui/material';
import React from 'react';
import { NavLink } from 'react-router-dom';
import { isDarkMode } from '../../theme';

interface SideBarProps {
  readonly navItems: SideNavItem[];
}

export function SideBar(props: SideBarProps) {
  return (
    <Box component="nav" sx={sideBarStyle}>
      <Stack display="flex" flexDirection="row">
        <Toolbar />
        <List
          disablePadding
          sx={{ mt: { xs: theme => `${theme.spacing(7)} !important`, md: '0px !important' } }}
        >
          {props.navItems.map((navItem, index) => (
            <NavItem key={index} {...navItem} />
          ))}
        </List>
      </Stack>
    </Box>
  );
}

interface SideNavItem {
  readonly label: string;
  readonly to?: string;
  readonly icon?: React.ReactNode;
  readonly end?: boolean;
}

function NavItem({ icon, to = '/', label, end = true }: SideNavItem) {
  const navItemStyles = toItemStyles();
  return (
    <ListItem disablePadding>
      <ListItemButton component={NavLink} sx={navItemStyles} disableRipple to={to} end={end}>
        {icon != null && <ListItemIcon sx={{ minWidth: 'auto', mr: 4 }}>{icon}</ListItemIcon>}
        <ListItemText primary={<Typography variant="bodyMEmphasis">{label}</Typography>} />
      </ListItemButton>
    </ListItem>
  );
}

const sideBarStyle: SxProps<Theme> = {
  height: '100%',
  minWidth: '256px',
  bgcolor: theme => theme.brandPalette.background.neutral,
  display: { xs: 'none', md: 'block' }
};

function toItemStyles(): SxProps<Theme> {
  const isModeDark = isDarkMode();

  return {
    padding: theme => theme.spacing(3, 4),
    mb: theme => theme.spacing(2),
    width: '100%',
    transition: 'all 0.3s ease-in-out',
    minWidth: '200px',
    color: theme => theme.brandPalette.foreground.neutralFaded,
    borderRadius: theme => theme.radius.m + 'px',
    '&:focus': {
      backgroundColor: theme => theme.brandPalette.background.fadedFocus
    },
    '&:hover': {
      backgroundColor: theme => theme.brandPalette.background.fadedHover
    },
    '&.active': {
      backgroundColor: theme => theme.brandPalette.background.secondary,
      color: theme => theme.brandPalette.foreground.neutral,
      svg: {
        color: theme => theme.brandPalette.foreground.inverse
      }
    },
    '&.active svg': {
      color: isModeDark ? 'white' : 'black'
    },
    svg: {
      color: theme => theme.brandPalette.foreground.neutralFaded,
      fontSize: '24px'
    }
  };
}
