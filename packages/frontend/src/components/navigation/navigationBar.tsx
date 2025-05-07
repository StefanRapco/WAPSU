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
  Toolbar
} from '@mui/material';
import React, { ReactNode } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { isDarkMode } from '../../theme';
import { Typography } from '../typography';

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
        const validSections: NavSection[] = ['/', '/teams', '/analytics', '/tasks'];

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
  const navigate = useNavigate();

  if (props.to === undefined) {
    return (
      <ListItem
        disablePadding
        sx={{ width: 'auto', height: '50px', mb: 2 }}
        onClick={props.onClick}
      >
        <ListItemButton
          sx={{
            ...navItemStyles,
            width: '50px',
            height: '50px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
          }}
          disableRipple
        >
          <ListItemIcon
            sx={{
              minWidth: 'auto',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              '& svg': { fontSize: '28px' }
            }}
          >
            {props.icon}
          </ListItemIcon>
        </ListItemButton>
        <Box
          onClick={() => {
            if (props.to == null) return;
            navigate(props.to);
          }}
        >
          <Typography
            variant="bodyS"
            sx={{
              ml: 3,
              color: theme => theme.brandPalette.foreground.neutralFaded,
              whiteSpace: 'nowrap',
              fontSize: '16px',
              fontFamily: 'Inter, sans-serif',
              fontWeight: 500,
              cursor: 'pointer'
            }}
          >
            {props.label}
          </Typography>
        </Box>
      </ListItem>
    );
  }

  if (props.to === '/') {
    return (
      <Stack direction="row" alignItems="center">
        {((): ReactNode => {
          return (
            <ListItem
              disablePadding
              sx={{ width: 'auto', height: '50px', mb: 2 }}
              onClick={props.onClick}
            >
              <ListItemButton
                sx={{
                  ...navItemStyles,
                  width: '100%',
                  height: '50px',
                  display: 'flex',
                  justifyContent: 'flex-start',
                  alignItems: 'center',
                  px: 2
                }}
                disableRipple
                component={NavLink}
                to={props.to}
                end
              >
                <ListItemIcon
                  sx={{
                    minWidth: 'auto',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    '& svg': { fontSize: '28px' }
                  }}
                >
                  {props.icon}
                </ListItemIcon>
                <Typography
                  variant="bodyS"
                  sx={{
                    ml: 3,
                    color: 'inherit',
                    whiteSpace: 'nowrap',
                    fontSize: '16px',
                    fontFamily: 'Inter, sans-serif',
                    fontWeight: 500,
                    cursor: 'pointer'
                  }}
                >
                  {props.label}
                </Typography>
              </ListItemButton>
            </ListItem>
          );
        })()}
      </Stack>
    );
  }

  return (
    <ListItem disablePadding sx={{ width: 'auto', height: '50px', mb: 2 }} onClick={props.onClick}>
      <ListItemButton
        sx={{
          ...navItemStyles,
          width: '100%',
          height: '50px',
          display: 'flex',
          justifyContent: 'flex-start',
          alignItems: 'center',
          px: 2
        }}
        disableRipple
        component={NavLink}
        to={props.to}
      >
        <ListItemIcon
          sx={{
            minWidth: 'auto',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            '& svg': { fontSize: '28px' }
          }}
        >
          {props.icon}
        </ListItemIcon>
        <Typography
          variant="bodyS"
          sx={{
            ml: 3,
            color: 'inherit',
            whiteSpace: 'nowrap',
            fontSize: '16px',
            fontFamily: 'Inter, sans-serif',
            fontWeight: 500,
            cursor: 'pointer'
          }}
        >
          {props.label}
        </Typography>
      </ListItemButton>
    </ListItem>
  );
}

const minNavBarWidth = '200px';

function toNavItemStyles(): SxProps<Theme> {
  const isModeDark = isDarkMode();

  return {
    p: 0,
    height: '48px',
    width: 'auto',
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
    borderRadius: theme => theme.radius.m + 'px',
    transition: 'all 0.3s ease-in-out',
    pointerEvents: 'auto',
    color: theme => theme.brandPalette.foreground.neutralFaded,
    '&:focus': {
      backgroundColor: theme => theme.brandPalette.background.fadedFocus
    },
    '&:hover': {
      backgroundColor: theme => theme.brandPalette.background.fadedHover
    },
    '&.active': {
      backgroundColor: 'black',
      color: 'white',
      '& svg': {
        color: 'white'
      },
      '& .MuiTypography-root': {
        color: 'white'
      }
    },
    svg: {
      color: theme => theme.brandPalette.foreground.neutralFaded,
      fontSize: '28px'
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
