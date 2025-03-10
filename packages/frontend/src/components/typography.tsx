import { Typography as MuiTypography, TypographyProps } from '@mui/material';
import { ReactNode } from 'react';

export function Typography(props: TypographyProps): ReactNode {
  return (
    <MuiTypography sx={{ ...props.sx, color: theme => theme.palette.neutral.main }}>
      {props.children}
    </MuiTypography>
  );
}
