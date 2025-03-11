import CloseIcon from '@mui/icons-material/Close';
import { IconButton, Snackbar as MuiSnackbar, SnackbarProps } from '@mui/material';
import { useEffect } from 'react';

interface SnackbarSuccessInterface {
  readonly open: boolean;
  readonly successMsg: string;
  readonly setSuccess: (value: boolean) => void;
}

export function SnackBarSuccess(props: SnackbarSuccessInterface & SnackbarProps) {
  const { open, successMsg, setSuccess: setMutationError, sx, ...rest } = props;
  return (
    <MuiSnackbar
      {...rest}
      sx={{
        ...sx,
        '& .MuiSnackbarContent-root': {
          backgroundColor: 'green',
          color: 'white'
        }
      }}
      open={open}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      message={successMsg}
      transitionDuration={{ appear: 100, enter: 100, exit: 100 }}
      action={
        <IconButton aria-label="delete" onClick={() => props.setSuccess(false)}>
          <CloseIcon color="action" />
        </IconButton>
      }
    />
  );
}

interface SnackbarUseEffectProps {
  readonly success: boolean;
  readonly error: boolean;
  readonly setSuccess: (value: boolean) => void;
  readonly setError: (value: boolean) => void;
}

export function snackbarUseEffect(props: SnackbarUseEffectProps) {
  return useEffect(() => {
    if (!props.success && !props.error) return;

    if (props.success) {
      const timer = setTimeout(() => props.setSuccess(false), 5000);
      return () => clearTimeout(timer);
    }
    if (props.error) {
      const timer = setTimeout(() => props.setError(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [props.success, props.error]);
}
