import NotificationsIcon from '@mui/icons-material/Notifications';
import PasswordIcon from '@mui/icons-material/Password';
import SettingsAccessibilityIcon from '@mui/icons-material/SettingsAccessibility';
import { Box } from '@mui/material';
import { Navigate, Route, Routes } from 'react-router-dom';
import { SideBar } from '../../components/navigation/sideBar';
import { Identity } from '../../hooks/useIdentity';
import { isDarkMode } from '../../theme';
import { SettingsNotifications } from './settingsNotifications';
import { SettingsPassword } from './settingsPassword';
import { SettingsPersonalDetails } from './settingsPersonalDetails';

interface AccountSettingsProps {
  readonly identity: Pick<
    NonNullable<Identity>,
    'id' | 'firstName' | 'lastName' | 'email' | 'fullName' | 'isPasswordNull'
  >;
}

export function AccountSettingsIndex(props: AccountSettingsProps) {
  const isModeDark = isDarkMode();

  return (
    <Box sx={{ display: 'flex' }}>
      <SideBar
        navItems={[
          {
            label: 'Personal details',
            to: '/account-settings/personal-details',
            icon: <SettingsAccessibilityIcon sx={{ color: isModeDark ? 'white' : 'black' }} />
          },
          {
            label: 'Password',
            to: '/account-settings/password',
            icon: <PasswordIcon sx={{ color: isModeDark ? 'white' : 'black' }} />
          },
          {
            label: 'Notifications',
            to: '/account-settings/notifications',
            icon: <NotificationsIcon sx={{ color: isModeDark ? 'white' : 'black' }} />
          }
        ]}
      />

      <Box
        component="main"
        sx={{
          flex: 1,
          padding: 2
        }}
      >
        <Routes>
          <Route path="" element={<Navigate to="personal-details" replace />} />
          <Route
            path="/personal-details"
            element={<SettingsPersonalDetails identity={props.identity} />}
          />
          <Route path="/password" element={<SettingsPassword identity={props.identity} />} />
          <Route
            path="/notifications"
            element={<SettingsNotifications identity={props.identity} />}
          />
        </Routes>
      </Box>
    </Box>
  );
}
