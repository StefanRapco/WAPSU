import {
  Box,
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  Stack,
  SxProps,
  Theme,
  Toolbar,
  Tooltip
} from '@mui/material';
import React, { ReactNode } from 'react';
import { NavLink } from 'react-router-dom';
import { isDarkMode } from '../../theme';

export type NavSection = '/' | '/teams' | '/users' | '/settings' | '/analytics' | '/tasks';

export interface NavigationItem {
  readonly icon: React.ReactNode;
  readonly label?: string;
  readonly to?: NavSection;
  readonly onClick?: () => void;
  readonly onClose?: () => void;
  readonly slot: 'main' | 'settings';
}

export function NavigationBar(props: { items: NavigationItem[] }) {
  const sections = [
    {
      items: ((): NavigationItem[] => {
        const validSections: NavSection[] = ['/', '/users', '/teams', '/analytics', '/tasks'];

        return props.items.filter(item => item.to != null && validSections.includes(item.to));
      })()
    }
  ];

  const settingsItems = props.items.filter(item => item.slot === 'settings');

  return <NavBar sections={sections} settingsItems={settingsItems} />;
}

interface NavBarProps {
  readonly settingsItems: NavigationItem[];
  readonly sections: Array<{ readonly items: NavigationItem[] }>;
}

function NavBar(props: NavBarProps) {
  const isModeDark = isDarkMode();

  return (
    <Box
      component="nav"
      sx={{
        ...navBarDesktopStyle,
        width: minNavBarWidth,
        transition: 'width 0.5s ease, box-shadow 0.3s ease, opacity 0.5s ease',
        boxShadow: 'none'
      }}
    >
      <Stack
        sx={{
          minHeight: 'calc(100vh - 120px) !important',
          position: 'fixed',
          overflow: 'auto',
          bgcolor: theme => theme.brandPalette.background.neutral,
          width: 'auto',
          py: 2,
          px: '25px',
          top: '38px',
          bottom: '0px',
          zIndex: theme => theme.zIndex.appBar - 1,
          left: 0,
          borderRight: theme => `1px solid ${theme.brandPalette.border.neutralFaded}`,
          transition: 'width 0.5s ease'
        }}
        direction="column"
        justifyContent="space-between"
      >
        <Toolbar />
        <List disablePadding>
          {props.sections.map((section, sectionIndex) => (
            <React.Fragment key={sectionIndex}>
              {section.items.map((item, itemIndex) => (
                <NavItem key={itemIndex} {...item} />
              ))}
              {sectionIndex < props.sections.length - 1 && (
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '24px',
                    px: 0
                  }}
                >
                  {((): ReactNode => {
                    if (section.items.length === 0) return null;

                    return (
                      <Divider
                        sx={{
                          borderColor: theme =>
                            isModeDark
                              ? theme.brandPalette.foreground.inverseFaded
                              : theme.brandPalette.border.neutralInverse,
                          borderWidth: '1px',
                          width: '50%'
                        }}
                      />
                    );
                  })()}
                </Box>
              )}
            </React.Fragment>
          ))}
        </List>

        <List sx={{ marginTop: 'auto !important' }} disablePadding>
          {props.settingsItems.map((item, index) => (
            <NavItem {...item} key={`setting-${index}`} />
          ))}
        </List>
      </Stack>
    </Box>
  );
}

function NavItem(props: NavigationItem) {
  const navItemStyles = toNavItemStyles();

  if (props.to === undefined) {
    return (
      <ListItem
        disablePadding
        sx={{ width: '48px', height: '48px', mb: 2 }}
        onClick={props.onClick}
      >
        <ListItemButton sx={navItemStyles} disableRipple>
          <ListItemIcon sx={{ minWidth: 'auto' }}>{props.icon}</ListItemIcon>
        </ListItemButton>
      </ListItem>
    );
  }

  if (props.to === '/') {
    return (
      <Stack direction="row" alignItems="center">
        {((): ReactNode => {
          return (
            <Tooltip title={props.label} arrow placement="right">
              <ListItem
                disablePadding
                sx={{ width: '48px', height: '48px', mb: 2 }}
                onClick={props.onClick}
              >
                <ListItemButton
                  sx={navItemStyles}
                  disableRipple
                  component={NavLink}
                  to={props.to}
                  end
                >
                  <ListItemIcon sx={{ minWidth: 'auto' }}>{props.icon}</ListItemIcon>
                </ListItemButton>
              </ListItem>
            </Tooltip>
          );
        })()}
      </Stack>
    );
  }

  return (
    <Stack direction="row" alignItems="center">
      {((): ReactNode => {
        return (
          <Tooltip title={props.label} arrow placement="right">
            <ListItem
              disablePadding
              sx={{ width: '48px', height: '48px', mb: 2 }}
              onClick={props.onClick}
            >
              <ListItemButton sx={navItemStyles} disableRipple component={NavLink} to={props.to}>
                <ListItemIcon sx={{ minWidth: 'auto' }}>{props.icon}</ListItemIcon>
              </ListItemButton>
            </ListItem>
          </Tooltip>
        );
      })()}
    </Stack>
  );
}

const minNavBarWidth = '104px';

function toNavItemStyles(): SxProps<Theme> {
  const isModeDark = isDarkMode();

  return {
    p: 0,
    height: '48px',
    width: '48px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: theme => theme.radius.m + 'px',
    transition: 'all 0.3s ease-in-out',
    pointerEvents: 'auto',
    '&:focus': {
      backgroundColor: theme => theme.brandPalette.background.fadedFocus
    },
    '&:hover': {
      backgroundColor: theme => theme.brandPalette.background.fadedHover
    },
    '&.active': {
      backgroundColor: theme => theme.brandPalette.background.secondaryActive
    },
    '&.active svg': {
      color: isModeDark ? 'black' : 'white'
    },
    svg: {
      color: theme => theme.brandPalette.foreground.neutralFaded,
      fontSize: '22px'
    }
  };
}

const navBarDesktopStyle: SxProps<Theme> = {
  minWidth: minNavBarWidth,
  height: 'calc(100vh - 87px)',
  position: 'relative',
  overflowX: 'hidden',
  bgcolor: theme => theme.brandPalette.background.neutral,
  display: { xs: 'none', md: 'flex' }
};
