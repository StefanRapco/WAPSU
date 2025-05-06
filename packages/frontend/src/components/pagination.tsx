import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import {
  Box,
  Divider,
  FormControl,
  IconButton,
  MenuItem,
  Select,
  SelectChangeEvent,
  Typography
} from '@mui/material';
import { ReactNode } from 'react';

interface PaginationProps {
  readonly total: number;
  readonly hasMore: boolean;
  readonly onPageChange: (page: number, rowsPerPage: number) => void;
  readonly rowsPerPageOptions?: number[];
  readonly page: number;
  readonly rowsPerPage: number;
  readonly bottomDivider?: boolean;
  readonly upperDivider?: boolean;
}

export function Pagination({
  total,
  hasMore,
  onPageChange,
  rowsPerPageOptions = [2, 5, 10, 25, 100],
  page,
  rowsPerPage,
  bottomDivider = false,
  upperDivider = false
}: PaginationProps): ReactNode {
  const handleRowsPerPageChange = (event: SelectChangeEvent<number>) => {
    const newRowsPerPage = Number(event.target.value);
    onPageChange(0, newRowsPerPage);
  };

  const handlePageChange = (newPage: number) => {
    onPageChange(newPage, rowsPerPage);
  };

  return (
    <>
      {upperDivider && (
        <Divider sx={{ borderColor: 'divider', borderStyle: 'solid', borderWidth: '1px 0 0 0' }} />
      )}
      <Box sx={{ display: 'flex', alignItems: 'center', p: 2, gap: 2, pl: 3 }}>
        <Typography sx={{ ml: 5 }}>Rows per page:</Typography>
        <FormControl size="small" sx={{ minWidth: 100 }}>
          <Select
            value={rowsPerPage}
            onChange={handleRowsPerPageChange}
            sx={{
              borderRadius: 1,
              border: '1px solid',
              borderColor: 'divider',
              color: '#000',
              '.MuiSelect-select': {
                py: 0.5
              }
            }}
          >
            {rowsPerPageOptions.map(option => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Box sx={{ flexGrow: 1 }} />
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <IconButton
            onClick={() => handlePageChange(Math.max(0, page - 1))}
            disabled={page === 0}
            sx={{ color: '#000' }}
          >
            <NavigateBeforeIcon />
          </IconButton>
          <Typography>{page + 1}</Typography>
          <IconButton
            onClick={() => handlePageChange(page + 1)}
            disabled={!hasMore}
            sx={{ color: '#000' }}
          >
            <NavigateNextIcon />
          </IconButton>
        </Box>
      </Box>
      {bottomDivider && (
        <Divider sx={{ borderColor: 'divider', borderStyle: 'solid', borderWidth: '1px 0 0 0' }} />
      )}
    </>
  );
}
