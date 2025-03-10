import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined';
import { Avatar as MuiAvatar, SxProps, Theme, Typography, TypographyTypeMap } from '@mui/material';
import React from 'react';

const sizes = ['xxs', 'xs', 's', 'm', 'l', 'xl', 'xxl'] as const;

type AvatarSizes = Record<
  (typeof sizes)[number],
  { readonly textVariant: TypographyTypeMap['props']['variant']; readonly styles: SxProps<Theme> }
>;

const sizesValues: AvatarSizes = {
  xxs: {
    textVariant: 'micro',
    styles: { width: '26px', height: '26px', '& svg': { width: '13.714px', height: '13.714px' } }
  },
  xs: {
    textVariant: 'bodyXs',
    styles: { width: '32px', height: '32px', '& svg': { width: '19.2px', height: '19.2px' } }
  },
  s: {
    textVariant: 'bodyS',
    styles: { width: '40px', height: '40px', '& svg': { width: '24px', height: '24px' } }
  },
  m: {
    textVariant: 'bodyL',
    styles: { width: '56px', height: '56px', '& svg': { width: '33.6px', height: '33.6px' } }
  },
  l: {
    textVariant: 'bodyL',
    styles: { width: '64px', height: '64px', '& svg': { width: '40px', height: '40px' } }
  },
  xl: {
    textVariant: 'h3',
    styles: { width: '80px', height: '80px', '& svg': { width: '48px', height: '48px' } }
  },
  xxl: {
    textVariant: 'h2',
    styles: { width: '120px', height: '120px', '& svg': { width: '72px', height: '72px' } }
  }
};

interface CircularAvatarProps {
  readonly size?: (typeof sizes)[number];
  readonly src?: string;
  readonly children?: React.ReactNode;
  readonly sx?: SxProps<Theme>;
  readonly alt?: string;
}

export function CircularAvatar({ size = 'xxs', children, sx, ...props }: CircularAvatarProps) {
  const styles = { ...sizesValues[size].styles, ...sx };

  return (
    <MuiAvatar sx={styles} {...props}>
      {children != null && (
        <Typography fontWeight={900} variant={sizesValues[size].textVariant}>
          {children}
        </Typography>
      )}
      {children == null && <PersonOutlinedIcon />}
    </MuiAvatar>
  );
}
