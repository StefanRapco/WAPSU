import { Menu } from '@mui/material';
import React from 'react';

interface StyledMenuProps {
  readonly children: React.ReactNode;
  readonly anchorEl: HTMLElement | null;
  readonly setAnchorEl: (value: HTMLElement | null) => void;
}

export function StyledMenu(props: StyledMenuProps) {
  return (
    <Menu
      id="menu-appbar"
      anchorEl={props.anchorEl}
      keepMounted
      open={Boolean(props.anchorEl)}
      onClose={() => props.setAnchorEl(null)}
      sx={{
        mt: '45px',
        '& .MuiMenu-paper': {
          background: theme => theme.brandPalette.background.neutral,
          borderRadius: theme => `${theme.radius.l + 'px'} ${theme.radius.l + 'px'} 0px 0px`,
          border: theme => `1px solid ${theme.brandPalette.border.neutralFaded}`,
          boxShadow:
            '0px 8px 8px -4px rgba(16, 24, 40, 0.03), 0px 20px 24px -4px rgba(16, 24, 40, 0.08)'
        }
      }}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right'
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right'
      }}
    >
      {props.children}
    </Menu>
  );
}
