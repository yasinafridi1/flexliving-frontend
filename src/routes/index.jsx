import Login from '@pages/auth/Login';
import Dashboard from '@pages/private/Dashboard';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import RedirectRoute from '@routes/RedirectRoutes';
import DashboardLayout from '@layouts/DashboardLayout';
import Integration from '@pages/private/Integration.jsx';
import Review from '@pages/private/Review';

export default createBrowserRouter([
  {
    path: '/signin',
    element: (
      // <RedirectRoute>
      <Login />
      // </RedirectRoute>
    )
  },
  {
    path: '/',
    element: (
      // <PrivateRoutes>
      <DashboardLayout />
      // </PrivateRoutes>
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
      }
    ]
  }
]);
