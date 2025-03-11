import GroupsIcon from '@mui/icons-material/Groups';
import { Box } from '@mui/material';
import { ReactNode } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { SideBar } from '../../components/navigation/sideBar';
import { isDarkMode } from '../../theme';
import { SettingsUserList } from './settingsUserList';

export function SettingsIndex(): ReactNode {
  const isModeDark = isDarkMode();

  return (
    <Box sx={{ display: 'flex' }}>
      <SideBar
        navItems={[
          {
            label: 'System users',
            to: '/settings/system-users',
            icon: <GroupsIcon sx={{ color: isModeDark ? 'white' : 'black' }} />
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
          <Route path="" element={<Navigate to="system-users" replace />} />
          <Route path="/system-users" element={<SettingsUserList />} />
        </Routes>
      </Box>
    </Box>
  );
}
