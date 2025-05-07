import { Box, SxProps, Theme } from '@mui/material';
import { useNavigate } from 'react-router-dom';

interface LogoProps {
  readonly sx?: SxProps<Theme>;
}

export function LightModeLogo(props: LogoProps) {
  const navigate = useNavigate();
  return (
    <Box sx={{ ...props.sx, cursor: 'pointer' }} onClick={() => navigate('/')}>
      <svg
        width="120"
        height="32"
        viewBox="0 0 120 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M24 5C18.4772 5 14 9.47715 14 15C14 20.5228 18.4772 25 24 25C29.5228 25 34 20.5228 34 15C34 9.47715 29.5228 5 24 5Z"
          fill="#2196F3"
        />
        <path
          d="M24 9C20.6863 9 18 11.6863 18 15C18 18.3137 20.6863 21 24 21C27.3137 21 30 18.3137 30 15C30 11.6863 27.3137 9 24 9Z"
          fill="white"
        />
        <path
          d="M24 5V9M24 21V25M14 15H18M30 15H34"
          stroke="#2196F3"
          strokeWidth="1.25"
          strokeLinecap="round"
        />
        <text
          x="42"
          y="21"
          fill="#2196F3"
          style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: '18px',
            fontWeight: '600',
            letterSpacing: '-0.5px'
          }}
        >
          DoSync
        </text>
      </svg>
    </Box>
  );
}

export function DarkModeLogo(props: LogoProps) {
  const navigate = useNavigate();
  return (
    <Box sx={{ ...props.sx, cursor: 'pointer' }} onClick={() => navigate('/')}>
      <svg
        width="120"
        height="32"
        viewBox="0 0 120 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M24 5C18.4772 5 14 9.47715 14 15C14 20.5228 18.4772 25 24 25C29.5228 25 34 20.5228 34 15C34 9.47715 29.5228 5 24 5Z"
          fill="#90CAF9"
        />
        <path
          d="M24 9C20.6863 9 18 11.6863 18 15C18 18.3137 20.6863 21 24 21C27.3137 21 30 18.3137 30 15C30 11.6863 27.3137 9 24 9Z"
          fill="#1A1A1A"
        />
        <path
          d="M24 5V9M24 21V25M14 15H18M30 15H34"
          stroke="#90CAF9"
          strokeWidth="1.25"
          strokeLinecap="round"
        />
        <text
          x="42"
          y="21"
          fill="#90CAF9"
          style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: '18px',
            fontWeight: '600',
            letterSpacing: '-0.5px'
          }}
        >
          DoSync
        </text>
      </svg>
    </Box>
  );
}
