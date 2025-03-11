import {
  Box,
  Card,
  CardContent,
  FormControlLabel,
  Grid,
  Stack,
  Switch,
  Typography
} from '@mui/material';
import { useState } from 'react';
import { SectionHeader } from '../../components/header';
import { Identity } from '../../hooks/useIdentity';

interface NotificationsProps {
  readonly identity: Pick<NonNullable<Identity>, 'id' | 'isPasswordNull'>;
}

export function SettingsNotifications(props: NotificationsProps) {
  const [settings, setSettings] = useState<Record<string, boolean>>(
    Object.fromEntries(notificationOptions.map(({ id }, index) => [id, index % 2 === 0]))
  );

  const handleToggle = (id: string) => {
    setSettings(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <Stack spacing={9}>
      <SectionHeader breadcrumbs={[{ label: 'Account settings' }, { label: 'Notifications' }]}>
        <Box display="flex" flexDirection="column">
          <Typography variant="h2Bold">Notifications</Typography>
          <Typography>
            Stay updated with your latest tasks, mentions, and project updates. Never miss an
            important update!
          </Typography>
        </Box>
      </SectionHeader>

      <Card sx={{ maxWidth: 700, mx: 'auto', my: 4, p: 2, boxShadow: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Notification Preferences
          </Typography>
          <Grid container spacing={2} columns={{ xs: 1, sm: 2, md: 3 }}>
            {notificationOptions.map(option => (
              <Grid item xs={1} key={option.id}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings[option.id]}
                      onChange={() => handleToggle(option.id)}
                      color="primary"
                    />
                  }
                  label={option.label}
                />
              </Grid>
            ))}
          </Grid>
        </CardContent>
      </Card>
    </Stack>
  );
}

const notificationOptions = [
  { id: 'email', label: 'Email Notifications' },
  { id: 'sms', label: 'SMS Notifications' },
  { id: 'push', label: 'Push Notifications' },
  { id: 'news', label: 'Newsletter Updates' },
  { id: 'security', label: 'Security Alerts' },
  { id: 'promotions', label: 'Promotional Offers' },
  { id: 'updates', label: 'App Updates' },
  { id: 'feedback', label: 'Feedback Requests' },
  { id: 'social', label: 'Social Mentions' },
  { id: 'system', label: 'System Warnings' },
  { id: 'test', label: 'System Testing' }
];
