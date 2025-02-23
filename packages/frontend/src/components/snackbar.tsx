import { ApolloError } from '@apollo/client';
import CloseIcon from '@mui/icons-material/Close';
import { IconButton, Snackbar as MuiSnackbar, SnackbarProps } from '@mui/material';

interface SnackbarErrorInterface {
  readonly apolloErrors: Array<ApolloError | undefined>;
  readonly mutationError: boolean;
  readonly setMutationError: (value: boolean) => void;
}

export function Snackbar(props: SnackbarErrorInterface & SnackbarProps) {
  const { apolloErrors, mutationError, setMutationError, ...rest } = props;
  return (
    <MuiSnackbar
      {...rest}
      open={props.apolloErrors.some(item => item != null) && props.mutationError}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      autoHideDuration={5000}
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
