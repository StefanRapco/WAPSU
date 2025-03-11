import { Box, SxProps, Theme } from '@mui/material';
import { useNavigate } from 'react-router-dom';

interface LogoProps {
  readonly sx?: SxProps<Theme>;
}

export function LightModeLogo(props: LogoProps) {
  const navigate = useNavigate();
  return (
    <Box sx={{ ...props.sx, cursor: 'pointer' }} onClick={() => navigate('/')}>
      LOGO
    </Box>
  );
}

export function DarkModeLogo(props: LogoProps) {
  const navigate = useNavigate();
  return (
    <Box sx={{ ...props.sx, cursor: 'pointer' }} onClick={() => navigate('/')}>
      LOGO
    </Box>
  );
}
