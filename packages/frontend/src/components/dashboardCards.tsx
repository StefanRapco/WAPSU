import {
  CardActionArea,
  CardContent,
  CardMedia,
  Card as MuiCard,
  SxProps,
  Typography,
  styled
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

interface CardProps {
  to: string;
  image: string;
  title: string;
  leadText: string;
}

export function ToolCard({
  to,
  image,
  title,
  leadText
}: Pick<CardProps, 'to' | 'image' | 'title' | 'leadText'>) {
  const sx: SxProps = {
    height: '100%',
    padding: 0,
    boxShadow: '0 2px 2px 0 rgba(0, 0, 0, 0.08)',
    transition: 'transform 0.14s ease, box-shadow 0.15s ease',
    '&:hover': {
      textDecoration: 'none',
      boxShadow: '0 4px 20px 0 rgba(0, 0, 0, 0.15)',
      transform: 'scale(1.02)'
    },
    '& .MuiCardActionArea-root': {
      minHeight: { lg: '400px' },
      display: { lg: 'flex' },
      flexDirection: { lg: 'row' },
      alignItems: { lg: 'center' },
      gap: { lg: '20px' },
      transition: 'transform 0.25s ease',
      '&:hover': {
        transform: 'scale(1.02)'
      },
      '&:active': {
        transform: 'scale(0.98)',
        transitionDuration: '0.05s, 0.05s'
      }
    },
    '& .MuiCardMedia-root': {
      width: { xs: '100%', lg: '300px' },
      height: { xs: '240px', lg: '100%' },
      borderRadius: '10px',
      objectFit: 'cover'
    }
  };

  const navigate = useNavigate();

  return (
    <StyledCard sx={sx}>
      <CardActionArea onClick={() => navigate(to)}>
        <StyledCardContent image={image} title={title} leadText={leadText} />
      </CardActionArea>
    </StyledCard>
  );
}

interface StyledCardContentProps {
  image: string;
  title: string;
  leadText: string;
}

function StyledCardContent(props: StyledCardContentProps) {
  return (
    <>
      <CardMedia component="img" image={props.image} />
      <CardContent sx={{ height: '100%', p: 3 }}>
        <Typography variant="h5" fontWeight="700" mb={2}>
          {props.title}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          {props.leadText}
        </Typography>
      </CardContent>
    </>
  );
}

const StyledCard = styled(MuiCard)({
  border: '1px solid',
  borderColor: 'rgba(0, 0, 0, 0.12)',
  borderRadius: '20px',
  '&:hover': {
    borderColor: 'rgba(0, 0, 0, 0.2)'
  }
});
