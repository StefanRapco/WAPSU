import WestIcon from '@mui/icons-material/West';
import { Stack, Typography } from '@mui/material';
import { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageBreadcrumb, PageBreadcrumbs } from './breadcrumbs';
import { Button } from './button';

interface SectionHeaderProps {
  readonly children: ReactNode;
  readonly action?: ReactNode;
  readonly badge?: ReactNode;
  readonly startIcon?: ReactNode;
  readonly breadcrumbs?: PageBreadcrumb[];
  readonly actionPosition?: 'backLink';
  readonly backLink?: {
    readonly to?: string;
    readonly label: string;
  };
}

export function SectionHeader({
  children,
  action,
  startIcon,
  badge,
  breadcrumbs = [],
  backLink,
  actionPosition
}: SectionHeaderProps) {
  const navigate = useNavigate();

  const renderSectionHeader = () => {
    if (typeof children !== 'string') return <>{children}</>;

    return (
      <Typography variant="h2" fontWeight={700}>
        {children}
      </Typography>
    );
  };

  return (
    <Stack direction="column" width="100%" gap={actionPosition === 'backLink' ? 8 : 3}>
      {breadcrumbs.length > 0 && <PageBreadcrumbs items={breadcrumbs} />}

      <Stack direction="row" justifyContent="space-between">
        {backLink != null && (
          <Stack direction="row" gap={3}>
            <Button
              buttonText={null}
              sx={{ size: 'sm' }}
              onClick={() => {
                if (backLink != null && backLink.to != null) {
                  navigate(backLink.to);
                  return;
                }

                navigate(-1);
              }}
              startIcon={<WestIcon />}
            >
              <Typography variant="bodyMEmphasis">{backLink.label}</Typography>
            </Button>
          </Stack>
        )}

        {actionPosition === 'backLink' && <SectionHeaderAction action={action} />}
      </Stack>

      <Stack
        direction={{ xs: 'column', md: 'row' }}
        justifyContent="space-between"
        alignItems="flex-start"
        width="100%"
        spacing={5}
      >
        <Stack direction="row" gap={4} alignItems="flex-start">
          {startIcon}
          {renderSectionHeader()}
          {badge}
        </Stack>

        {actionPosition == null && <SectionHeaderAction action={action} />}
      </Stack>
    </Stack>
  );
}

function SectionHeaderAction(props: Pick<SectionHeaderProps, 'action'>): ReactNode {
  if (props.action == null) return null;

  return (
    <Stack direction="row" gap={3} paddingTop={theme => theme.spacing(2)}>
      {props.action}
    </Stack>
  );
}
