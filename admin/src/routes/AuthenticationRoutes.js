import { lazy } from 'react';
import Loadable from 'ui-component/Loadable';
import MinimalLayout from 'layout/MinimalLayout';
import ForgotPassword from 'views/pages/authentication/forgotPassword';
import ResetPassword from 'views/pages/authentication/resetPassword';

// Lazy load authentication components
const AuthLogin3 = Loadable(lazy(() => import('views/pages/authentication/authentication3/Login3')));
const AuthRegister3 = Loadable(lazy(() => import('views/pages/authentication/authentication3/Register3')));

const AuthenticationRoutes = {
  path: '/',
  element: <MinimalLayout />, // ✅ MinimalLayout for public auth pages
  children: [
    { path: 'login', element: <AuthLogin3 /> },
    { path: 'register', element: <AuthRegister3 /> },
    {path: 'forgot-password' , element: <ForgotPassword />},
    {path: 'reset-password/:id/:token' , element: <ResetPassword/>}
  ]
};

export default AuthenticationRoutes;
