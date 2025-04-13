import { useRoutes } from 'react-router-dom';
import AuthenticationRoutes from './AuthenticationRoutes';
import AdminRoutes from './AdminRoutes';
import SellerRoutes from './SellerRoutes';
import AuthRedirect from 'component/AuthRedirect';

// ✅ Use both authentication and protected routes
export default function ThemeRoutes() {
  return useRoutes([{path: "/", element: <AuthRedirect/>},AuthenticationRoutes,SellerRoutes, AdminRoutes]);
}
