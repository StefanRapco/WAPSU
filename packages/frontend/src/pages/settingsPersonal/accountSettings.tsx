import PasswordIcon from '@mui/icons-material/Password';
import SettingsAccessibilityIcon from '@mui/icons-material/SettingsAccessibility';
import { Box } from '@mui/material';
import { Navigate, Route, Routes } from 'react-router-dom';
import { SideBar } from '../../components/navigation/sideBar';
import { isDarkMode } from '../../theme';

export function AccountSettings() {
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
          <Route path="/personal-details" element={<>TODO: Personal details sections</>} />
          <Route path="/password" element={<>TODO: Password section</>} />
        </Routes>
      </Box>
    </Box>
  );
}
