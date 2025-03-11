import { Box, Card, CardContent, Typography } from '@mui/material';
import { ReactNode } from 'react';

interface ChartCardProps {
  readonly title: string;
  readonly children: ReactNode;
  readonly maxWidth?: number;
}

export function ChartCard(props: ChartCardProps) {
  const maxWidth = ((): number => {
    if (props.maxWidth == null) return 550;
    return props.maxWidth;
  })();

  return (
    <Card
      sx={{
        maxWidth,
        mx: 'auto',
        p: 2,
        boxShadow: 3,
        borderRadius: 2
      }}
    >
      <CardContent>
        <Typography variant="h6" align="center" gutterBottom>
          {props.title}
        </Typography>
        <Box display="flex" justifyContent="center">
          {props.children}
        </Box>
      </CardContent>
    </Card>
  );
}
