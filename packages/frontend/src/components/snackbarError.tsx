import { ApolloError } from '@apollo/client';
import CloseIcon from '@mui/icons-material/Close';
import { IconButton, Snackbar as MuiSnackbar, SnackbarProps } from '@mui/material';

interface SnackbarErrorInterface {
  readonly apolloErrors: Array<ApolloError | undefined>;
  readonly mutationError: boolean;
  readonly setMutationError: (value: boolean) => void;
}

export function SnackbarError(props: SnackbarErrorInterface & SnackbarProps) {
  const { apolloErrors, mutationError, setMutationError, sx, ...rest } = props;
  return (
    <MuiSnackbar
      {...rest}
      sx={{
        ...sx,
        '& .MuiSnackbarContent-root': {
          backgroundColor: '#f44336',
          color: 'white'
        }
      }}
      open={props.apolloErrors.some(item => item != null) && props.mutationError}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      transitionDuration={{ appear: 100, enter: 100, exit: 100 }}
      message={((): string =>
        props.apolloErrors.find(item => item != null)?.message ?? 'Unknown error message')()}
      action={
        <IconButton aria-label="delete" onClick={() => props.setMutationError(false)}>
          <CloseIcon color="action" />
        </IconButton>
      }
    />
  );
}
