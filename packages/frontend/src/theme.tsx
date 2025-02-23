import { alpha, createTheme as createMuiTheme, Slide } from '@mui/material';
import React, { useMemo } from 'react';
import { colorPrimitives, colorsDark, colorsLight, useConfig } from './config';

import { useModeContext } from './modeContext';

export const { brandPalette } = useConfig();

interface ThemeProps {
  readonly mode: 'light' | 'dark';
}

export function createTheme({ mode }: ThemeProps) {
  const spacing = [0, 2, 4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96, 120];

  const radius = {
    '0': 0,
    xs: 2,
    s: 4,
    m: 8,
    l: 16,
    xl: 24,
    full: 9999
  };

  const shadow = {
    none: '0px 0px 0px 0px rgba(0, 0, 0, 0)',
    sx: '0px 1px 2px 0px rgba(16, 24, 40, 0.05)',
    s: '0px 1px 2px 0px rgba(16, 24, 40, 0.06), 0px 1px 3px 0px rgba(16, 24, 40, 0.10)',
    m: '0px 2px 4px -2px rgba(16, 24, 40, 0.06), 0px 4px 8px -2px rgba(16, 24, 40, 0.10)',
    l: '0px 4px 6px -2px rgba(16, 24, 40, 0.03), 0px 12px 16px -4px rgba(16, 24, 40, 0.08)',
    xl: '0px 8px 8px -4px rgba(16, 24, 40, 0.03), 0px 20px 24px -4px rgba(16, 24, 40, 0.08)',
    xl2: '0px 24px 48px -12px rgba(16, 24, 40, 0.18)',
    xl3: '0px 32px 64px -12px rgba(16, 24, 40, 0.14)'
  };

  const breakpoints = {
    values: {
      xs: 0,
      sm: 490,
      md: 768,
      lg: 1040,
      xl: 1380
    }
  };

  const containerPadding = 'clamp(15px, 3vw, 50px)';

  const muiTheme = createMuiTheme({
    palette: {
      mode,
      neutral: {
        main: brandPalette[mode].foreground.neutral
      },
      error: {
        main: brandPalette[mode].foreground.negativeOffset
      },
      success: {
        main: brandPalette[mode].foreground.success
      },
      warning: {
        main: brandPalette[mode].foreground.warning
      },
      primary: {
        main: brandPalette[mode].foreground.accent
      },
      background: {
        default: brandPalette[mode].background.neutral,
        paper: brandPalette[mode].background.faded
      },
      grey: colorPrimitives.gray,
      text: {
        primary: brandPalette[mode].foreground.neutralOnAccent,
        secondary: brandPalette[mode].foreground.neutral,
        disabled: brandPalette[mode].foreground.disabled
      },
      action: {
        active: brandPalette[mode].foreground.neutralOnAccent,
        disabledBackground: brandPalette[mode].background.disabled,
        disabled: brandPalette[mode].foreground.disabled
      }
    },
    spacing: (factor: number | string) => {
      if (typeof factor === 'string') return factor;

      const index = Math.floor(factor);
      const currentSpace = spacing[index];
      const nextSpace = spacing[index + 1] || currentSpace * 2;
      const space = currentSpace + (nextSpace - currentSpace) * (factor - index);
      return `${space}px`;
    },
    radius,
    shadow,
    breakpoints,
    brandPalette: brandPalette[mode],
    typography: {
      fontFamily: [
        'PP Neue Montreal',
        'Inter',
        'sans-serif',
        'Lato',
        '-apple-system',
        'BlinkMacSystemFont',
        '"Segoe UI"',
        'Roboto',
        '"Helvetica Neue"',
        'Arial',
        'sans-serif',
        '"Apple Color Emoji"',
        '"Segoe UI Emoji"',
        '"Segoe UI Symbol"'
      ].join(','),
      h1: {
        lineHeight: '5.5rem',
        fontSize: '4.5rem',
        fontWeight: 400,
        letterSpacing: '1.44px'
      },
      h2: {
        lineHeight: '2.625rem',
        fontSize: '2.25rem',
        fontWeight: 400,
        letterSpacing: '0.72px'
      },
      h2Bold: {
        lineHeight: '2.625rem',
        fontSize: '2.25rem',
        fontWeight: 900,
        letterSpacing: '0.72px'
      },
      h3: {
        lineHeight: '2.25rem',
        fontSize: '2rem',
        fontWeight: 500,
        letterSpacing: '0.64px'
      },
      h4: {
        lineHeight: '1rem',
        fontSize: '1rem',
        fontWeight: 500,
        letterSpacing: '0.96px'
      },
      bodyLEmphasis: {
        lineHeight: '1.75rem',
        fontSize: '1.25rem',
        fontWeight: 500,
        letterSpacing: '0.6px'
      },
      bodyL: {
        lineHeight: '1.75rem',
        fontSize: '1.25rem',
        fontWeight: 400,
        letterSpacing: '0.6px'
      },
      bodyMEmphasis: {
        lineHeight: '1.5rem',
        fontSize: '1rem',
        fontWeight: 500,
        letterSpacing: '0.48px'
      },
      bodyM: {
        lineHeight: '1.5rem',
        fontSize: '1rem',
        fontWeight: 400,
        letterSpacing: '0.48px'
      },
      bodyMMedium: {
        lineHeight: '1.2rem',
        fontSize: '1rem',
        fontWeight: 500,
        letterSpacing: '0.48px'
      },
      bodySEmphasis: {
        lineHeight: '1.25rem',
        fontSize: '0.875rem',
        fontWeight: 500,
        letterSpacing: '0.42px'
      },
      bodyS: {
        lineHeight: '1.25rem',
        fontSize: '0.875rem',
        fontWeight: 400,
        letterSpacing: '0.42px'
      },
      bodyXsEmphasis: {
        lineHeight: '1rem',
        fontSize: '0.75rem',
        fontWeight: 500,
        letterSpacing: '0.6px'
      },
      bodyXs: {
        lineHeight: '1rem',
        fontSize: '0.75rem',
        fontWeight: 400,
        letterSpacing: '0.6px'
      },
      label: {
        lineHeight: '0.75rem',
        fontSize: '0.625rem',
        fontWeight: 500,
        letterSpacing: '0.8px'
      },
      micro: {
        lineHeight: '0.75rem',
        fontSize: '0.625rem',
        fontWeight: 500,
        letterSpacing: '0.5%px'
      }
    },
    components: {
      MuiTypography: {
        styleOverrides: {
          root: {}
        }
      },
      MuiCssBaseline: {
        styleOverrides: `
        @font-face {
          font-family: 'PP Neue Montreal';
          font-style: normal;
          font-display: swap;
          font-weight: 400;
          unicodeRange: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF;
        }

        @font-face {
          font-family: 'PP Neue Montreal';
          font-style: normal;
          font-display: swap;
          font-weight: 530;
          unicodeRange: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF;
        }

        body {
          color: ${brandPalette[mode].foreground.neutral};
        }

        ::-webkit-scrollbar{
          background: transparent;
          width: 5px;
        }

        ::-webkit-scrollbar-thumb {
          background: #888;
          border-radius: 15px;
        }
      `
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            backgroundColor: brandPalette[mode].background.neutral,
            color: brandPalette[mode].foreground.neutral,
            // padding: `${spacing[7]}px ${spacing[9]}px`,
            contain: 'content',
            border: 'none',
            boxShadow: 'none',

            '& .MuiToolbar-root': {
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: 0,
              minHeight: '40px !important'
            }
          }
        }
      },
      MuiContainer: {
        defaultProps: {
          maxWidth: false
        },
        styleOverrides: {
          root: {
            minWidth: '100%',
            paddingLeft: `${containerPadding}`,
            paddingRight: `${containerPadding}`
          },
          disableGutters: {
            paddingLeft: '0 !important',
            paddingRight: '0 !important'
          },
          /* Removes horizontal centering of containers */
          maxWidthXl: {
            marginLeft: 0
          },
          maxWidthLg: {
            marginLeft: 0
          },
          maxWidthMd: {
            marginLeft: 0
          }
        }
      },
      MuiRadio: {
        styleOverrides: {
          root: {
            padding: 6
          }
        }
      },
      MuiTable: {
        defaultProps: {
          size: 'small'
        },
        styleOverrides: {
          root: {
            borderRadius: '6px',
            borderCollapse: 'initial',
            overflow: 'clip',
            '& .MuiTableRow-root': {
              paddingRight: '24px'
            },

            '& .MuiTableCell-sizeSmall': {
              padding: '16px 24px'
            },
            '& .MuiTableCell-root': {
              borderBottom: `2px solid ${brandPalette[mode].background.neutral}`
            }
          }
        }
      },
      MuiTableHead: {
        styleOverrides: {
          root: {
            backgroundColor: brandPalette[200]
          }
        }
      },
      MuiTableCell: {
        styleOverrides: {
          root: {
            borderBottom: `1px solid ${brandPalette[mode].border.neutral}`
          }
        }
      },
      MuiTableBody: {
        styleOverrides: {
          root: {
            '& .MuiTableRow-root': {
              '&:last-of-type': {
                '& .MuiTableCell-root': {
                  border: 'none'
                }
              },
              '&.MuiTableRow-hover': {
                '&:hover': {
                  backgroundColor: alpha(brandPalette[mode].border.neutral, 0.25)
                }
              }
            }
          }
        }
      },
      MuiTabs: {
        defaultProps: {
          scrollButtons: true,
          allowScrollButtonsMobile: true
        },
        styleOverrides: {
          root: {
            overflow: 'visible'
          },
          flexContainer: {
            gap: spacing[4]
          },
          indicator: {
            display: 'none'
          }
        }
      },
      MuiTab: {
        defaultProps: {
          disableRipple: true
        },
        styleOverrides: {
          root: {
            textTransform: 'none',
            borderRadius: radius.full + 'px',
            padding: `${spacing[3]}px ${spacing[4]}px !important`,
            minWidth: 'auto !important',
            minHeight: 'auto !important',
            lineHeight: '1rem',
            fontSize: '0.75rem',
            fontWeight: 530,
            letterSpacing: '3%',

            '&:not(.Mui-selected):hover': {
              backgroundColor: brandPalette[mode].background.fadedHover
            },

            '&:not(.Mui-selected):focus': {
              backgroundColor: brandPalette[mode].background.fadedFocus
            },

            '&.Mui-selected': {
              backgroundColor: brandPalette[mode].background.secondaryActive,
              color: brandPalette[mode].foreground.inverse
            }
          }
        }
      },
      MuiPaper: {
        defaultProps: {
          variant: 'outlined'
        }
      },
      MuiTextField: {
        defaultProps: {
          variant: 'outlined',
          size: 'small'
        },
        styleOverrides: {
          root: {
            '& .MuiFormLabel-root': {
              fontSize: '0.875rem'
            },
            '& .MuiInputBase-root': {
              backgroundColor: '#fff'
            },
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: brandPalette[mode].background.inverseFaded
            }
          }
        }
      },
      MuiSnackbar: {
        defaultProps: {
          anchorOrigin: { vertical: 'bottom', horizontal: 'right' },
          TransitionComponent: props => <Slide {...props} direction="left" />
        }
      },
      MuiSlider: {
        defaultProps: {
          valueLabelDisplay: 'off'
        }
      },
      MuiLink: {
        defaultProps: {
          underline: 'hover',
          color: 'primary'
        },
        styleOverrides: {
          // Makes sure `<Link component="button"/>` looks the same like `<Link />`
          button: {
            verticalAlign: undefined,
            fontSize: 'inherit'
          },
          root: {
            cursor: 'pointer',
            fontWeight: 530,
            textDecoration: 'none',
            '&:hover': {
              textDecoration: 'underline'
            }
          }
        }
      },
      MuiDialog: {
        defaultProps: {
          maxWidth: 'xs',
          fullWidth: true
        },
        styleOverrides: {
          paper: {
            // Fix scroll issues
            '& > form': {
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column'
            }
          }
        }
      },
      MuiInputBase: {
        styleOverrides: {
          root: {
            width: '100%',
            borderRadius: radius.m + 'px',
            border: '1px solid transparent',
            transition: 'border 0.2s ease-in-out, background 0.2s ease-in-out',

            padding: spacing[4] + 'px',
            color: brandPalette[mode].foreground.neutral,
            backgroundColor: brandPalette[mode].background.secondary,

            input: {
              padding: 0,
              height: '20px !important',
              width: '100%'
            },
            'input::placeholder': {
              color: brandPalette[mode].foreground.placeholder,
              opacity: '1 !important'
            },

            '&.Mui-disabled input::placeholder': {
              color: brandPalette[mode].foreground.disabled
            },

            '&:hover': {
              backgroundColor: brandPalette[mode].background.secondaryHover
            },

            '&:focus-within': {
              borderColor: brandPalette[mode].border.active,
              backgroundColor: brandPalette[mode].background.neutral
            },

            '&.Mui-disabled': {
              backgroundColor: brandPalette[mode].background.secondaryHover,
              cursor: 'disabled'
            },

            '&.Mui-error': {
              // border: '1.5px solid transparent',
              borderColor: brandPalette[mode].border.negativeFaded
            },

            // TODO check hover styles of autofill
            'input:-webkit-autofill, input:-webkit-autofill:hover, input:-webkit-autofill:focus, input:-webkit-autofill:active':
              {
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: brandPalette[mode].foreground.neutral,
                transition: 'background-color 5000s ease-in-out 0s',
                WebkitBoxShadow: `none !important`,
                lineHeight: '1.25rem',
                fontSize: '0.875rem',
                fontWeight: 400,
                letterSpacing: '0.42px'
              },
            '& input[type=number]': {
              fontSize: '0.875rem',
              MozAppearance: 'textfield',
              '&::-webkit-outer-spin-button, &::-webkit-inner-spin-button': {
                WebkitAppearance: 'none',
                margin: 0
              }
            },
            '& input[type=tel]': {
              fontSize: '0.875rem'
            }
          }
        }
      },
      MuiDateCalendar: {
        styleOverrides: {
          root: {
            background: brandPalette[mode].background.neutral,
            boxShadow: shadow.l,
            borderRadius: radius.m + 'px',

            '.MuiPickersCalendarHeader-labelContainer': {
              fontWeight: '400'
            }
          }
        }
      },
      MuiDayCalendar: {
        styleOverrides: {
          weekDayLabel: {
            color: brandPalette[mode].foreground.neutralFaded,
            width: '32px'
          }
        }
      },
      MuiPickersArrowSwitcher: {
        styleOverrides: {
          button: {
            color: brandPalette[mode].foreground.neutral
          }
        }
      },
      MuiPickersCalendarHeader: {
        styleOverrides: {
          label: {
            color: brandPalette[mode].foreground.neutral,
            fontSize: '0.875rem',
            marginRight: '4px',
            fontWeight: '400'
          },
          switchViewButton: {
            color: brandPalette[mode].foreground.neutral
          }
        }
      },
      MuiPickersYear: {
        styleOverrides: {
          root: {
            color: brandPalette[mode].foreground.neutral,
            background: brandPalette[mode].background.neutral
          },
          yearButton: {
            color: brandPalette[mode].foreground.neutral,

            '&.Mui-selected': {
              background: brandPalette[mode].background.secondaryActive + '!important',
              color: brandPalette[mode].foreground.inverse
            }
          }
        }
      },
      MuiPickersMonth: {
        styleOverrides: {
          root: {
            color: brandPalette[mode].foreground.neutral,

            '&.Mui-selected': {
              background: brandPalette[mode].background.secondaryActive + '!important',
              color: brandPalette[mode].foreground.inverse
            }
          }
        }
      },
      MuiPickersDay: {
        dayDisabled: {
          color: '#ccc'
        },
        styleOverrides: {
          root: {
            color: brandPalette[mode].foreground.neutral,
            width: '32px',
            height: '32px',

            '&.Mui-selected': {
              background: brandPalette[mode].background.secondaryActive + '!important',
              color: brandPalette[mode].foreground.inverse
            }
          },
          today: {
            border: `1.5px solid ${brandPalette[mode].border.neutral} !important`
          }
        }
      },
      MuiChip: {
        styleOverrides: {
          root: {
            borderRadius: radius.xs + 'px',
            color: brandPalette[mode].foreground.inverse,
            padding: spacing[4],
            display: 'inline-flex',
            justifyContent: 'space-between',

            minHeight: '40px',
            minWidth: '200px'
          },
          label: {
            padding: 0
          },
          deleteIcon: {
            margin: 0,
            width: '16px',
            height: '16px',
            marginLeft: spacing[2] + 'px',
            color: brandPalette[mode].foreground.inverse
          }
        }
      },
      MuiSelect: {
        styleOverrides: {
          // @ts-ignore https://github.com/mui/material-ui/issues/25763
          root: {
            padding: 0,
            display: 'block',
            borderRadius: radius.m + 'px',
            width: '100%',

            '.MuiOutlinedInput-notchedOutline': {
              borderWidth: '0px !important'
            },

            '.MuiSelect-icon': {
              color: brandPalette[mode].foreground.inputIcon
            },
            '.MuiList-root': {
              marginTop: '8px',
              padding: '8px',
              borderRadius: radius.m + 'px'
            }
          },
          select: {
            maxWidth: '100%',
            width: 'auto !important',
            minHeight: 'auto !important',
            height: '20px',
            paddingTop: spacing[4] + 'px',
            paddingBottom: spacing[4] + 'px'
          }
        }
      },
      MuiList: {
        styleOverrides: {
          padding: {
            padding: 0
          }
        }
      },
      MuiMenuItem: {
        styleOverrides: {
          root: {
            padding: `${spacing[4]}px`,
            color: brandPalette[mode].foreground.neutral,
            fontSize: '0.875rem',

            transition: 'background-color 0.2s ease-in-out',

            '&.Mui-selected, &.Mui-selected:hover': {
              background: brandPalette[mode].background.secondaryHover
            }
          }
        }
      },
      MuiInputLabel: {
        styleOverrides: {
          root: {
            '& .MuiTypography-root': {
              marginBottom: spacing[2]
            }
          }
        }
      },
      MuiAvatar: {
        styleOverrides: {
          root: {
            color: brandPalette[mode].foreground.neutralFaded,
            backgroundColor: brandPalette[mode].background.faded,
            border: `1px solid ${brandPalette[mode].border.neutral}`
          }
        }
      },
      MuiFormControlLabel: {
        styleOverrides: {
          label: {
            fontSize: '0.9rem'
          }
        }
      },
      MuiStepLabel: {
        styleOverrides: {
          label: {
            fontSize: '1rem'
          }
        }
      },
      MuiStepIcon: {
        styleOverrides: {
          root: {
            width: '1.4em',
            height: '1.4em',
            '&.Mui-active': {
              color: brandPalette[mode].foreground.accent
            }
          }
        }
      },
      MuiDialogTitle: {
        styleOverrides: {
          root: {
            fontSize: '1.75rem',
            paddingLeft: '1.5rem',
            paddingRight: '1.5rem'
          }
        }
      },
      MuiDialogContent: {
        styleOverrides: {
          root: {
            paddingTop: '6px',
            paddingLeft: '1.5rem',
            paddingRight: '1.5rem'
          }
        }
      },
      MuiDialogContentText: {
        defaultProps: {
          marginBottom: 1
        }
      },
      MuiDialogActions: {
        styleOverrides: {
          root: {
            justifyContent: 'flex-start',
            paddingLeft: '1.5rem',
            paddingRight: '1.5rem',
            paddingBottom: '1.5rem'
          }
        }
      },
      MuiCheckbox: {
        defaultProps: {
          color: 'primary'
        }
      },
      MuiSwitch: {
        defaultProps: {
          color: 'success'
        }
      },
      MuiTooltip: {
        styleOverrides: {
          tooltip: {
            maxWidth: '600px'
          }
        }
      },
      MuiBreadcrumbs: {
        styleOverrides: {
          separator: {
            marginLeft: '.4rem',
            marginRight: '.4rem'
          },
          root: {
            '& .MuiSvgIcon-root': {
              fontSize: '1rem',
              marginRight: '0.5rem'
            }
          }
        }
      },
      MuiCard: {
        styleOverrides: {
          root: {
            border: `solid 1px ${brandPalette[mode].border.neutral}`,
            borderRadius: '6px',
            backgroundColor: '#FFFFFF'
          }
        }
      },
      MuiPagination: {
        styleOverrides: {
          root: {
            '& .Mui-selected': {
              backgroundColor: `${brandPalette[mode].background.secondaryActive}!important`,
              color: brandPalette[mode].foreground.inverse
            }
          }
        }
      },
      MuiPaginationItem: {
        styleOverrides: {
          root: {
            color: brandPalette[mode].foreground.neutralFaded
          }
        }
      },
      MuiAlert: {
        styleOverrides: {
          icon: {
            marginLeft: '6px',
            alignItems: 'center'
          },
          root: {
            border: 0,
            borderRadius: '6px',
            alignItems: 'center'
          },
          message: {
            padding: '2px 0',
            minWidth: '100%'
          }
        }
      },
      MuiIconButton: {
        defaultProps: {
          color: 'primary'
        },
        styleOverrides: {
          root: {
            '&:hover': {
              backgroundColor: brandPalette[mode].background.neutralHover
            },
            '&:focus': {
              background: 'transparent'
            }
          }
        }
      },
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: 'none'
          },
          startIcon: {
            marginLeft: 0
          }
        }
      },
      MuiCollapse: {
        styleOverrides: {
          root: {
            contain: 'content',
            transition: 'height 180ms cubic-bezier(.39,.34,.35,1) 0ms !important'
          }
        }
      },
      MuiDivider: {
        styleOverrides: {
          root: {
            borderColor: brandPalette[mode].border.neutralFaded
          }
        }
      },
      MuiSkeleton: {
        styleOverrides: {
          root: {
            backgroundColor: brandPalette[mode].border.neutralFaded
          }
        }
      }
    } as any
  });

  const theme = {
    ...muiTheme
  };

  return theme;
}

export function useTheme({ mode = 'light' }: { mode?: 'light' | 'dark' }) {
  return useMemo(() => {
    const theme = createTheme({
      mode
    });

    return theme;
  }, [mode]);
}

export const horizontalScrollbar = {
  '&::-webkit-scrollbar': {
    backgroundColor: brandPalette.dark.foreground.neutralFaded,
    height: '14px'
  },
  '&::-webkit-scrollbar-track': {
    backgroundColor: 'transparent'
  },
  '&::-webkit-scrollbar-thumb': {
    borderRadius: '200px',
    backgroundColor: `${alpha(brandPalette.dark.foreground.neutralFaded, 0.12)}`,
    border: 3,
    borderColor: brandPalette.dark.foreground.neutralFaded
  },
  '&::-webkit-scrollbar-thumb:focus': {
    backgroundColor: `${alpha(brandPalette.dark.foreground.neutralFaded, 0.2)}`
  },
  '&::-webkit-scrollbar-thumb:active': {
    backgroundColor: `${alpha(brandPalette.dark.foreground.neutralFaded, 0.2)}`
  },
  '&::-webkit-scrollbar-thumb:hover': {
    backgroundColor: `${alpha(brandPalette.dark.foreground.neutralFaded, 0.2)}`
  }
};

declare module '@mui/material/styles' {
  export interface Theme {}

  interface Theme {
    radius: {
      '0': number;
      xs: number;
      s: number;
      m: number;
      l: number;
      xl: number;
      full: number;
    };
    shadow: {
      none: string;
      sx: string;
      s: string;
      m: string;
      l: string;
      xl: string;
      xl2: string;
      xl3: string;
    };
    brandPalette: typeof colorsDark | typeof colorsLight;
  }

  interface ThemeOptions {
    radius?: {
      '0'?: number;
      xs?: number;
      s?: number;
      m?: number;
      l?: number;
      xl?: number;
      full?: number;
    };
    shadow?: {
      none?: string;
      sx?: string;
      s?: string;
      m?: string;
      l?: string;
      xl?: string;
      xl2?: string;
      xl3?: string;
    };
    brandPalette: typeof colorsDark | typeof colorsLight;
  }

  interface Palette {
    neutral: Palette['primary'];
  }

  interface PaletteOptions {
    neutral: PaletteOptions['primary'];
  }

  interface TypographyVariants {
    h1Bold: React.CSSProperties;
    h2Bold: React.CSSProperties;
    formCategory: React.CSSProperties;
    bodyLEmphasis: React.CSSProperties;
    bodyL: React.CSSProperties;
    bodyMEmphasis: React.CSSProperties;
    bodyM: React.CSSProperties;
    bodySEmphasis: React.CSSProperties;
    bodyS: React.CSSProperties;
    bodyXsEmphasis: React.CSSProperties;
    bodyXs: React.CSSProperties;
    label: React.CSSProperties;
    micro: React.CSSProperties;
  }

  interface TypographyVariantsOptions {
    h1Bold?: React.CSSProperties;
    h2Bold: React.CSSProperties;
    formCategory?: React.CSSProperties;
    bodyLEmphasis: React.CSSProperties;
    bodyL: React.CSSProperties;
    bodyMEmphasis: React.CSSProperties;
    bodyM: React.CSSProperties;
    bodyMMedium: React.CSSProperties;
    bodySEmphasis: React.CSSProperties;
    bodyS: React.CSSProperties;
    bodyXsEmphasis: React.CSSProperties;
    bodyXs: React.CSSProperties;
    label: React.CSSProperties;
    micro: React.CSSProperties;
  }
}

declare module '@mui/material/Typography' {
  interface TypographyPropsVariantOverrides {
    h2Bold: true;
    bodyLEmphasis: true;
    bodyL: true;
    bodyMEmphasis: true;
    bodyM: true;
    bodyMMedium: true;
    bodySEmphasis: true;
    bodyS: true;
    bodyXsEmphasis: true;
    bodyXs: true;
    label: true;
    micro: true;
  }
}

export function isDarkMode(): boolean {
  const [{ mode }] = useModeContext();
  return mode === 'dark';
}

export function isLightMode(): boolean {
  const [{ mode }] = useModeContext();
  return mode === 'light';
}
