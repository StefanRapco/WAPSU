import {
  Button as MuiButton,
  ButtonProps as MuiButtonProps,
  SxProps,
  Theme,
  Typography,
  TypographyTypeMap
} from '@mui/material';
import React, { ReactNode } from 'react';
import { isDarkMode } from '../theme';

interface ButtonProps {
  readonly size?: (typeof sizes)[number];
  readonly variant?: (typeof variants)[number];
  readonly children?: React.ReactNode;
  readonly disabled?: boolean;
  readonly startIcon?: React.ReactNode;
  readonly endIcon?: React.ReactNode;
  readonly disableButtonStyles?: boolean;
  readonly onlyIcon?: React.ReactNode;
  readonly type?: MuiButtonProps['type'];
  readonly form?: MuiButtonProps['form'];
  readonly sx?: MuiButtonProps['sx'];
  readonly onClick?: MuiButtonProps['onClick'];
  readonly component?: string;
}

export function Button({
  size = 'base',
  variant = 'accent',
  children,
  onlyIcon,
  disableButtonStyles,
  sx,
  ...props
}: ButtonProps) {
  const sizeStyles = (() => {
    if (onlyIcon) return sizesValues[size].iconOnlyStyles;
    if (disableButtonStyles) return sizesValues[size].disableButtonStyles;

    return sizesValues[size].styles;
  })();

  const variants = getVariantValues(variant);

  const variantStyles = disableButtonStyles ? variants.disableButtonStyles : variants.styles;

  const isDisabled = (() => {
    if (props.disabled && variant !== 'ghost') return disabledStyles;

    return {};
  })();

  const mergedStyles = { ...variantStyles, ...sizeStyles, ...isDisabled, ...sx };

  return (
    <MuiButton
      disableRipple
      disableElevation
      aria-modal
      sx={{ borderRadius: theme => theme.radius.full, ...mergedStyles }}
      {...props}
    >
      {((): ReactNode => {
        if (onlyIcon != null) return onlyIcon;

        if (children == null) return null;

        return (
          <Typography variant={sizesValues[size].textVariant} maxWidth="100%">
            {children}
          </Typography>
        );
      })()}
    </MuiButton>
  );
}

function getVariantValues(variant: (typeof variants)[number]): VariantSxProps {
  const isDark = isDarkMode();

  if (variant === 'accent')
    return {
      styles: {
        bgcolor: theme => theme.brandPalette.data.dimAccent,
        color: theme =>
          isDark
            ? theme.brandPalette.background.neutral
            : theme.brandPalette.foreground.neutralOnAccent,
        '&:hover': { bgcolor: theme => theme.brandPalette.data.inverseAccentFaded },
        '&:focus': { bgcolor: theme => theme.brandPalette.data.inverseAccentFaded }
      },
      disableButtonStyles: {
        color: theme => theme.brandPalette.foreground.accent,
        background: 'transparent !important'
      }
    };

  if (variant === 'destructive')
    return {
      styles: {
        bgcolor: theme => theme.brandPalette.background.negative,
        color: theme => theme.brandPalette.foreground.neutralOnAccent,
        '&:hover': { bgcolor: theme => theme.brandPalette.background.negativeHover },
        '&:focus': { bgcolor: theme => theme.brandPalette.background.negativeFocus }
      },
      disableButtonStyles: {
        color: theme => theme.brandPalette.foreground.disabled,
        background: 'transparent !important'
      }
    };

  if (variant === 'ghost')
    return {
      styles: {
        bgcolor: 'transparent',
        color: theme => theme.brandPalette.foreground.neutral,
        '&:hover': { bgcolor: theme => theme.brandPalette.background.secondaryHover },
        '&:focus': { bgcolor: theme => theme.brandPalette.background.secondaryFocus }
      },
      disableButtonStyles: {
        color: theme => theme.brandPalette.foreground.disabled,
        background: 'transparent !important'
      }
    };

  if (variant === 'primary')
    return {
      styles: {
        bgcolor: theme => theme.brandPalette.background.primary,
        color: theme => theme.brandPalette.foreground.inverse,
        '&:hover': { bgcolor: theme => theme.brandPalette.background.primaryHover },
        '&:focus': { bgcolor: theme => theme.brandPalette.background.primaryFocus }
      },
      disableButtonStyles: {
        color: theme => theme.brandPalette.foreground.neutral,
        background: 'transparent !important'
      }
    };

  if (variant === 'secondary')
    return {
      styles: {
        bgcolor: theme => theme.brandPalette.background.secondary,
        color: theme => theme.brandPalette.foreground.neutral,
        '&:hover': { bgcolor: theme => theme.brandPalette.background.secondaryHover },
        '&:focus': { bgcolor: theme => theme.brandPalette.background.secondaryFocus }
      },
      disableButtonStyles: {
        color: theme => theme.brandPalette.foreground.neutralFaded,
        background: 'transparent !important'
      }
    };

  if (variant === 'transparent')
    return {
      styles: {
        bgcolor: 'transparent',
        color: theme => theme.brandPalette.foreground.neutral,
        border: theme => `1px solid ${theme.brandPalette.border.secondary}`,
        '&:hover': { bgcolor: theme => theme.brandPalette.background.secondaryHover },
        '&:focus': { bgcolor: theme => theme.brandPalette.background.secondaryFocus }
      },
      disableButtonStyles: {
        color: theme => theme.brandPalette.foreground.neutralFaded,
        background: 'transparent !important'
      }
    };

  throw new Error('Button error!');
}

const variants = ['accent', 'primary', 'secondary', 'transparent', 'destructive', 'ghost'] as const;

type VariantSxProps = { styles: SxProps<Theme>; disableButtonStyles: SxProps<Theme> };

const sizes = ['sm', 'base', 'l', 'xl'] as const;

type SizeVariants = Record<
  (typeof sizes)[number],
  {
    readonly textVariant: TypographyTypeMap['props']['variant'];
    readonly styles: SxProps<Theme>;
    readonly disableButtonStyles: SxProps<Theme>;
    readonly iconOnlyStyles: SxProps<Theme>;
  }
>;

const sizesValues: SizeVariants = {
  sm: {
    textVariant: 'bodyXsEmphasis',
    styles: {
      padding: theme => theme.spacing(3, 4),
      '& .MuiButton-startIcon': { marginRight: theme => theme.spacing(1) }
    },
    disableButtonStyles: { padding: '0', minWidth: 'auto' },
    iconOnlyStyles: {
      padding: '6px',
      borderRadius: theme => theme.radius.full,
      minWidth: 'auto',
      '& svg': { width: '20px', height: '20px' }
    }
  },
  base: {
    textVariant: 'bodySEmphasis',
    styles: {
      padding: theme => theme.spacing(4, 5),
      '& .MuiButton-startIcon': { marginRight: theme => theme.spacing(1) },
      height: '40px'
    },
    disableButtonStyles: { padding: '0', minWidth: 'auto' },
    iconOnlyStyles: {
      padding: '10px',
      borderRadius: theme => theme.radius.full,
      minWidth: 'auto',
      '& svg': { width: '20px', height: '20px' }
    }
  },
  l: {
    textVariant: 'bodyMEmphasis',
    styles: {
      padding: theme => theme.spacing(4, 6),
      '& .MuiButton-startIcon': { marginRight: theme => theme.spacing(2) }
    },
    disableButtonStyles: { padding: '0', minWidth: 'auto' },
    iconOnlyStyles: {
      padding: '12px',
      borderRadius: theme => theme.radius.full,
      minWidth: 'auto',
      '& svg': { width: '24px', height: '24px' }
    }
  },
  xl: {
    textVariant: 'bodyMEmphasis',
    styles: {
      padding: theme => theme.spacing(5, 7),
      '& .MuiButton-startIcon': { marginRight: theme => theme.spacing(2) }
    },
    disableButtonStyles: { padding: '0', minWidth: 'auto' },
    iconOnlyStyles: {
      padding: '16px',
      borderRadius: theme => theme.radius.full,
      minWidth: 'auto',
      '& svg': { width: '24px', height: '24px' }
    }
  }
};

const disabledStyles: SxProps<Theme> = {
  bgcolor: theme => theme.brandPalette.background.disabled,
  color: theme => theme.brandPalette.foreground.disabled
};
