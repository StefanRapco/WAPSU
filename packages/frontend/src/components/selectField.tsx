import { FormControl, InputLabel, MenuItem, Select, Stack, Typography } from '@mui/material';
import { ErrorMessage, Field, FieldProps } from 'formik';
import { ReactNode } from 'react';

interface SelectFieldProps {
  readonly name: string;
  readonly label: string;
  readonly options: Array<{ label: string; value: string; icon?: ReactNode }>;
  readonly required?: boolean;
  readonly disabled?: boolean;
  readonly onChange?: () => void;
}

export function SelectField({
  name,
  label,
  options,
  required,
  disabled,
  onChange
}: SelectFieldProps) {
  return (
    <Field name={name}>
      {({ field, form }: FieldProps) => (
        <FormControl fullWidth error={form.touched[name] && Boolean(form.errors[name])}>
          <InputLabel sx={{ color: 'black' }}>{label}</InputLabel>
          <Select
            {...field}
            label={label}
            required={required}
            onChange={e => {
              field.onChange(e);
              if (onChange != null) onChange();
            }}
            disabled={disabled}
            sx={{
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: 'black'
              },
              '&:hover .MuiOutlinedInput-notchedOutline': {
                borderColor: 'black'
              },
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                borderColor: 'black'
              },
              '& .MuiSelect-select': {
                display: 'flex',
                alignItems: 'center',
                gap: 1
              }
            }}
          >
            {options.map(option => (
              <MenuItem key={option.value} value={option.value}>
                <Stack direction="row" spacing={3} alignItems="center">
                  {option.icon}
                  <Typography>{option.label}</Typography>
                </Stack>
              </MenuItem>
            ))}
          </Select>
          {form.touched[name] && form.errors[name] && <ErrorMessage name={name} />}
        </FormControl>
      )}
    </Field>
  );
}
