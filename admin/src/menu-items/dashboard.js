// assets
import { DashboardCustomizeTwoTone } from '@mui/icons-material';
import { IconDashboard } from '@tabler/icons';

// constant
const icons = { IconDashboard,  DashboardCustomizeTwoTone};

// ==============================|| DASHBOARD MENU ITEMS ||============================== //

const dashboard = {
  id: 'dashboard',
  title: 'Dashboard',
  type: 'group',
  children: [
    {
      id: 'default',
      title: 'Dashboard',
      type: 'item',
      url: '/dashboard',
      icon: icons.DashboardCustomizeTwoTone,
      breadcrumbs: false,
      roles:[0 , 1]
    }
  ]
};

export default dashboard;
