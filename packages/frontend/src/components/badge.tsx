import { Box, SxProps, Theme, Typography } from '@mui/material';
import React from 'react';
import { isDarkMode } from '../theme';

export const badgeVariants = [
  'default',
  'highlight',
  'positive',
  'negative',
  'notice',
  'warning',
  'alert'
] as const;

type Variants = Record<(typeof badgeVariants)[number], SxProps<Theme>>;

interface BadgeProps {
  readonly variant?: (typeof badgeVariants)[number];
  readonly notification: number | string;
  readonly sx?: SxProps<Theme>;
  readonly icon?: React.ReactNode;
  readonly textTransform?: string;
}

export function Badge(props: BadgeProps) {
  const isModeDark = isDarkMode();
  const variant = props.variant ?? 'default';

  const processedNotification = ((): string => {
    if (typeof props.notification === 'string') return props.notification.trim();

    return props.notification.toLocaleString();
  })();

  const variantsValues: Variants = {
    default: {
      background: 'transparent'
    },
    highlight: {
      background: '#4F76FF'
    },
    positive: {
      background: '#1ABC9C'
    },
    negative: {
      background: ((): string => (isModeDark ? '#FB7572' : '#DA5B5B'))()
    },
    warning: {
      background: ((): string => (isModeDark ? '#FEDA7B' : '#DFAB22'))()
    },
    notice: {
      background: ((): string => (isModeDark ? '#F2FF67' : '#B0BF00'))()
    },
    alert: {
      background: ((): string => (isModeDark ? '#FFA77B' : '#E47754'))()
    }
  };

  const dynamicBorderStyle = ((): SxProps<Theme> => {
    if (variant !== 'default') return {};

    return {
      border: isModeDark ? '1px solid #5A5A69' : '1px solid #DCDCE6'
    };
  })();

  const textColor = ((): string => {
    if (variant === 'default') return isModeDark ? '#FFFFFF' : '#000000';

    return isModeDark ? '#000000' : '#FFFFFF';
  })();

  const mergedStyles = {
    ...badgeStyles,
    ...variantsValues[variant],
    ...dynamicBorderStyle,
    ...props.sx
  };

  return (
    <Box sx={mergedStyles}>
      {props.icon != null && (
        <Box component="span" gap={3}>
          {props.icon}
        </Box>
      )}
      <Typography
        variant="label"
        component="p"
        sx={{
          color: textColor,
          textTransform: props.textTransform ?? 'none',
          letterSpacing: '0.5px',
          fontSize: '0.775rem'
        }}
      >
        {processedNotification}
      </Typography>
    </Box>
  );
}

const badgeStyles: SxProps<Theme> = {
  height: 'auto',
  display: 'flex',
  alignItems: 'center',
  flexDirection: 'row',
  gap: 3,
  p: theme => theme.spacing(3, 4),
  borderRadius: theme => theme.radius.full + 'px',
  maxHeight: '20px'
};
