import { MenuItem as MuiMenuItem, SxProps, Theme, Typography } from '@mui/material';

interface MenuItemProps {
  readonly text: string;
  readonly sx?: SxProps<Theme>;
  readonly sxText?: SxProps<Theme>;
  readonly onClick?: () => void;
}

export function MenuItem(props: MenuItemProps) {
  return (
    <MuiMenuItem
      onClick={props.onClick}
      sx={{
        backgroundColor: theme => theme.brandPalette.background.neutral,
        padding: theme => theme.spacing(3, 5),
        ...props.sx
      }}
    >
      <Typography variant="bodyS" textAlign="center" sx={{ ...props.sxText }}>
        {props.text}
      </Typography>
    </MuiMenuItem>
  );
}
