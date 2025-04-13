// material-ui
import { Typography } from '@mui/material';

// project imports
import NavGroup from './NavGroup';
import menuItem from 'menu-items';

// ==============================|| SIDEBAR MENU LIST ||============================== //

const MenuList = () => {
  // Retrieve sellerRole from localStorage and parse it to an integer
  const sellerRole = parseInt(localStorage.getItem("sellerRole"), 10);

  const basePath = sellerRole === 0 ? '/admin' : '/seller';

  const filterMenuByRole = (items, role, basePath) => {
    return items
      .filter((item) => !item.roles || item.roles.includes(role)) // Show if no roles specified or role is included
      .map((item) => ({
        ...item,
        url: item.url ? `${basePath}${item.url}` : undefined, // Prepend base path to URL
        children: item.children ? filterMenuByRole(item.children, role, basePath) : undefined // Recursively filter children
      }))
      .filter((item) => item.children === undefined || item.children.length > 0); // Remove empty groups
  };

  // Get filtered menu based on user role
  const filteredItems = filterMenuByRole(menuItem.items, sellerRole, basePath);

  const navItems = filteredItems.map((item) => {
    switch (item.type) {
      case 'group':
        return <NavGroup key={item.id} item={item} />;
      default:
        return (
          <Typography key={item.id} variant="h6" color="error" align="center">
            Menu Items Error
          </Typography>
        );
    }
  });

  return <>{navItems}</>;
};

export default MenuList;
