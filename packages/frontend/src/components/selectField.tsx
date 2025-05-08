import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import { ErrorMessage, Field, FieldProps } from 'formik';

interface SelectFieldProps {
  readonly name: string;
  readonly label: string;
  readonly options: Array<{ label: string; value: string }>;
  readonly required?: boolean;
  readonly disabled?: boolean;
}

export function SelectField({ name, label, options, required, disabled }: SelectFieldProps) {
  return (
    <Field name={name}>
      {({ field, form }: FieldProps) => (
        <FormControl fullWidth error={form.touched[name] && Boolean(form.errors[name])}>
          <InputLabel>{label}</InputLabel>
          <Select {...field} label={label} required={required} disabled={disabled}>
            {options.map(option => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
          {form.touched[name] && form.errors[name] && <ErrorMessage name={name} />}
        </FormControl>
      )}
    </Field>
  );
}
