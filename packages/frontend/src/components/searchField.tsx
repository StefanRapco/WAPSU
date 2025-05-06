import { Search as SearchIcon } from '@mui/icons-material';
import { TextField, TextFieldProps } from '@mui/material';
import { ReactNode } from 'react';

interface SearchFieldProps extends Omit<TextFieldProps, 'variant'> {
  readonly onSearchChange: (value: string) => void;
}

export function SearchField({ onSearchChange, ...props }: SearchFieldProps): ReactNode {
  return (
    <TextField
      placeholder="Search..."
      size="small"
      sx={{ minWidth: 300 }}
      InputProps={{
        startAdornment: <SearchIcon sx={{ color: 'text.secondary', mr: 1 }} />
      }}
      onChange={event => onSearchChange(event.target.value)}
      {...props}
    />
  );
}
