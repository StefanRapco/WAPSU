import AssignmentIcon from '@mui/icons-material/Assignment';
import GroupsIcon from '@mui/icons-material/Groups';
import SpaceDashboardIcon from '@mui/icons-material/SpaceDashboard';
import { Box } from '@mui/material';
import { ReactNode } from 'react';
import { Navigate, Route, Routes, useParams } from 'react-router-dom';
import { SideBar } from '../../components/navigation/sideBar';
import { isDarkMode } from '../../theme';
import { TeamOverview } from './teamOverview';
import { TeamTaskList } from './teamTaskList';
import { TeamUserList } from './teamUserList';

export function TeamIndex(): ReactNode {
  const isModeDark = isDarkMode();
  const { id } = useParams();

  return (
    <Box sx={{ display: 'flex' }}>
      <SideBar
        navItems={[
          {
            label: 'Team overview',
            to: `/teams/${id}/team-overview`,
            icon: <SpaceDashboardIcon sx={{ color: isModeDark ? 'white' : 'black' }} />
          },
          {
            label: 'Team tasks',
            to: `/teams/${id}/team-tasks`,
            icon: <AssignmentIcon sx={{ color: isModeDark ? 'white' : 'black' }} />
          },
          {
            label: 'Team users',
            to: `/teams/${id}/team-users`,
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
          <Route path="" element={<Navigate to="team-overview" replace />} />
          <Route path="/team-overview" element={<TeamOverview />} />
          <Route path="/team-tasks" element={<TeamTaskList />} />
          <Route path="/team-users" element={<TeamUserList />} />
        </Routes>
      </Box>
    </Box>
  );
}
