import { Visibility, VisibilityOff } from '@mui/icons-material';
import { IconButton, InputAdornment, TextField as MuiTextField } from '@mui/material';
import { ErrorMessage, Field, FieldProps } from 'formik';
import { useState } from 'react';

interface TextFieldProps {
  readonly name: string;
  readonly label: string;
  readonly type?: 'text' | 'password';
  readonly variant?: 'outlined' | 'filled' | 'standard';
  readonly placeholder?: string;
  readonly helperText?: boolean;
  readonly error?: boolean;
  readonly autofocus?: boolean;
  readonly disabled?: boolean;
}

export function TextField({
  type = 'text',
  variant = 'outlined',
  autofocus = false,
  ...props
}: TextFieldProps) {
  const [showPassword, setShowPassword] = useState<boolean>(false);

  return (
    <Field name={props.name}>
      {({ field }: FieldProps) => (
        <MuiTextField
          {...field}
          {...props}
          autoFocus={autofocus}
          type={((): TextFieldProps['type'] => {
            if (type === 'text') return 'text';
            if (type === 'password' && showPassword) return 'text';
            if (type === 'password' && !showPassword) return 'password';

            throw new Error('TextField - unknown type');
          })()}
          InputProps={{
            endAdornment:
              type === 'password' ? (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                    {showPassword ? (
                      <VisibilityOff sx={{ color: 'black' }} />
                    ) : (
                      <Visibility sx={{ color: 'black' }} />
                    )}
                  </IconButton>
                </InputAdornment>
              ) : undefined
          }}
          sx={{
            display: 'flex',
            '& .MuiOutlinedInput-root': {
              border: 'none',
              '& fieldset': { borderColor: 'black' },
              '&:hover fieldset': { borderColor: 'black' },
              '&.Mui-focused fieldset': { borderColor: 'black' }
            },
            '& .MuiInputLabel-root': {
              color: 'black'
            },
            '& .MuiInputLabel-root.Mui-focused': {
              color: 'black'
            }
          }}
          helperText={props.helperText ? <ErrorMessage name={props.name} /> : undefined}
          error={props.error}
        />
      )}
    </Field>
  );
}
