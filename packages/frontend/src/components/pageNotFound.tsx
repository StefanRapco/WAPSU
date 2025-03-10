import { Stack, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Button } from './button';

export function PageNotFound() {
  const navigate = useNavigate();

  return (
    <Stack justifyItems="center" alignItems="center" sx={{ height: 'calc(100vh - 207px)' }}>
      <Stack spacing={7} sx={{ maxWidth: '640px', margin: 'auto' }}>
        <Typography variant="h2">Page not found</Typography>
        <Typography variant="bodySEmphasis">
          The page you are looking for might be temporarily unavailable or does not exist. Try
          'Refreshing' the page or get in touch if the issue persists.
        </Typography>

        <Stack direction="row" justifyContent="start">
          <Button onClick={() => navigate('/')} buttonText="Go to Dashboard" />
        </Stack>
      </Stack>
    </Stack>
  );
}
