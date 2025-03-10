import {
  Breadcrumbs as MuiBreadcrumbs,
  Link as MuiLink,
  SxProps,
  Theme,
  Typography
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

export interface PageBreadcrumb {
  readonly label: string;
  readonly to?: string;
}

interface BreadcrumbsProps {
  readonly items: PageBreadcrumb[];
}

export function PageBreadcrumbs(props: BreadcrumbsProps) {
  const sx: SxProps<Theme> = { color: theme => theme.brandPalette.foreground.neutralFaded };

  return (
    <MuiBreadcrumbs separator={'/'} sx={sx}>
      {props.items.map((item, index) => {
        if (item.to != null) {
          return (
            <MuiLink
              component={RouterLink}
              to={item.to}
              underline="hover"
              sx={sx}
              variant="bodyXsEmphasis"
              key={index}
            >
              {item.label}
            </MuiLink>
          );
        }

        return (
          <Typography
            key={index}
            variant="bodyXsEmphasis"
            sx={{
              color:
                index === props.items.length - 1
                  ? theme => theme.brandPalette.foreground.neutral
                  : theme => theme.brandPalette.foreground.neutralFaded
            }}
          >
            {item.label}
          </Typography>
        );
      })}
    </MuiBreadcrumbs>
  );
}
