import { ButtonProps, Button as MuiButton } from '@mui/material';
import { ReactNode } from 'react';

interface ButtonPropsA extends ButtonProps {
  readonly buttonText: ReactNode;
}

export function Button({ buttonText, ...props }: ButtonPropsA) {
  return (
    <MuiButton {...props} variant={props.variant ?? 'contained'} color={props.color ?? 'info'}>
      {buttonText}
      {props.children}
    </MuiButton>
  );
}
