import { Typography as MuiTypography, TypographyProps } from '@mui/material';
import { ReactNode } from 'react';

export function Typography(props: TypographyProps): ReactNode {
  const { sx, ...rest } = props;

  return (
    <MuiTypography {...rest} sx={{ ...sx, color: theme => theme.palette.neutral.main }}>
      {props.children}
    </MuiTypography>
  );
}
