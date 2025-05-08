import { DatePicker } from '@mui/x-date-pickers';
import { ErrorMessage, Field, FieldProps } from 'formik';

interface DateFieldProps {
  readonly name: string;
  readonly label: string;
  readonly required?: boolean;
  readonly disabled?: boolean;
}

export function DateField({ name, label, required, disabled }: DateFieldProps) {
  return (
    <Field name={name}>
      {({ field, form }: FieldProps) => (
        <DatePicker
          label={label}
          value={field.value}
          onChange={value => form.setFieldValue(name, value)}
          disabled={disabled}
          slotProps={{
            textField: {
              required,
              fullWidth: true,
              error: form.touched[name] && Boolean(form.errors[name]),
              helperText:
                form.touched[name] && form.errors[name] ? <ErrorMessage name={name} /> : undefined
            }
          }}
        />
      )}
    </Field>
  );
}
