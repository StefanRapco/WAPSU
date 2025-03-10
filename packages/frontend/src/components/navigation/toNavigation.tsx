import AssignmentIcon from '@mui/icons-material/Assignment';
import BarChartIcon from '@mui/icons-material/BarChart';
import FolderSharedIcon from '@mui/icons-material/FolderShared';
import GroupsIcon from '@mui/icons-material/Groups';
import SpaceDashboardIcon from '@mui/icons-material/SpaceDashboard';
import TuneIcon from '@mui/icons-material/Tune';
import { NavigationItem } from './navigationBar';

export function toNavigation(): NavigationItem[] {
  const dashboard: NavigationItem = {
    icon: <SpaceDashboardIcon />,
    to: '/',
    label: 'Dashboard',
    slot: 'main'
  };

  const sectionConfig: Array<
    Pick<NavigationItem, 'icon' | 'to' | 'label'> & {
      readonly sectionId: string;
    }
  > = [
    {
      sectionId: 'tasks',
      icon: <AssignmentIcon />,
      to: '/tasks',
      label: 'Tasks'
    },
    {
      sectionId: 'teams',
      icon: <FolderSharedIcon />,
      to: '/teams',
      label: 'Teams'
    },
    {
      sectionId: 'users',
      icon: <GroupsIcon />,
      to: '/users',
      label: 'Users'
    },
    {
      sectionId: 'analytics',
      icon: <BarChartIcon />,
      to: '/analytics',
      label: 'Analytics'
    }
  ] as const;

  const navigation: NavigationItem[] = [
    dashboard,
    ...sectionConfig.map(({ sectionId, icon, to, label }) =>
      ensureSection({
        sectionId,
        item: { icon, to, label, slot: 'main' }
      })
    )
  ];

  navigation.push({
    icon: <TuneIcon />,
    to: '/settings',
    label: 'Settings',
    slot: 'settings'
  });

  return navigation;
}

function ensureSection(props: {
  readonly item: NavigationItem;
  readonly sectionId: string;
}): NavigationItem {
  return props.item;
}
