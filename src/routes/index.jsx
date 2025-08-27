import Login from '@pages/auth/Login';
import Dashboard from '@pages/private/Dashboard';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import RedirectRoute from '@routes/RedirectRoutes';
import DashboardLayout from '@layouts/DashboardLayout';
import Integration from '@pages/private/Integration.jsx';
import Review from '@pages/private/Review';
import Profile from '@pages/private/Profile';
import RedirectRoutes from '@routes/RedirectRoutes';
import PrivateRoutes from './PrivateRoutes';
import Register from '@pages/auth/Register';

export default createBrowserRouter([
  {
    path: '/signin',
    element: (
      <RedirectRoutes>
        <Login />
      </RedirectRoutes>
    )
  },
  {
    path: '/signup',
    element: (
      <RedirectRoutes>
        <Register />
      </RedirectRoutes>
    )
  },
  {
    path: '/',
    element: (
      <PrivateRoutes>
        <DashboardLayout />
      </PrivateRoutes>
    ),
    children: [
      {
        path: '/',
        element: <Dashboard />
      },
      {
        path: '/dashboard',
        element: <Navigate to='/' replace />
      },
      {
        path: '/integration',
        element: <Integration />
      },
      {
        path: '/reviews',
        element: <Review />
      },
      {
        path: '/profile',
        element: <Profile />
      }
    ]
  }
]);
