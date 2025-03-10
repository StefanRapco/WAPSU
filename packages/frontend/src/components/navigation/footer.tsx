import { Box, Stack, SxProps, Theme, Typography } from '@mui/material';

export type FooterVariant = 'default' | 'simple';

export function Footer(props: { variant: FooterVariant }) {
  return (
    <Box component="footer" sx={footerStyles}>
      <Box sx={{ mb: { xs: 4, md: 0 }, display: props.variant === 'simple' ? 'none' : 'block' }}>
        <>Left side addition in default type</>
      </Box>
      <Stack direction="row" spacing={5}></Stack>
      <Typography variant="bodyXs">
        &copy; {new Date().getUTCFullYear()} DoSync. All rights reserved.
      </Typography>
    </Box>
  );
}

const footerStyles: SxProps<Theme> = {
  display: 'flex',
  flexDirection: { xs: 'column', md: 'row' },
  justifyContent: 'space-between',
  alignItems: { xs: 'flex-start', md: 'center' },
  minHeight: '80px',
  marginBottom: { xs: '80px', sm: 0 },
  bgcolor: 'background.default',
  marginTop: 'auto',
  p: theme => theme.spacing(7, 6),
  color: theme => theme.brandPalette.foreground.inverseFaded,
  gap: theme => theme.spacing(5)
};
