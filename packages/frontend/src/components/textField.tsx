import { Visibility, VisibilityOff } from '@mui/icons-material';
import {
  IconButton,
  InputAdornment,
  TextField as MuiTextField,
  SxProps,
  Theme
} from '@mui/material';
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
  readonly multiline?: boolean;
  readonly rows?: number;
  readonly fullWidth?: boolean;
  readonly sx?: SxProps<Theme>;
  readonly value?: string;
  readonly onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function TextField({
  type = 'text',
  variant = 'outlined',
  autofocus = false,
  multiline = false,
  rows,
  value,
  onChange,
  ...props
}: TextFieldProps) {
  const [showPassword, setShowPassword] = useState<boolean>(false);

  return (
    <Field name={props.name}>
      {({ field }: FieldProps) => (
        <MuiTextField
          {...field}
          {...props}
          value={value ?? field.value}
          onChange={e => {
            field.onChange(e);
            onChange?.(e as React.ChangeEvent<HTMLInputElement>);
          }}
          autoFocus={autofocus}
          multiline={multiline}
          rows={rows}
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
            },
            ...props.sx
          }}
          helperText={props.helperText ? <ErrorMessage name={props.name} /> : undefined}
          error={props.error}
        />
      )}
    </Field>
  );
}
