import { createBrowserRouter } from 'react-router-dom'
import HomePage from '../pages/HomePage'
import SignupPage from '../pages/auth/SignupPage'
import VerifyOtpPage from '../pages/auth/VerifyOtpPage'
import LoginPage from '../pages/auth/LoginPage'
import ForgotPasswordPage from '../pages/auth/ForgotPasswordPage'
import VerifyResetOtpPage from '../pages/auth/VerifyResetOtpPage'
import ResetPasswordPage from '../pages/auth/ResetPasswordPage'
import PublisherSignupPage from '../pages/publisher/PublisherSignupPage'
import ProtectedRoute from '../routes/ProtectedRoute'
import UserLayout from '../layouts/UserLayout'
import ExplorePage from '../pages/user/ExplorePage'
import PublisherLayout from '../layouts/PublisherLayout'
import PublisherDashboardPage from '../pages/publisher/PublisherDashboardPage'
import AdminLayout from '../layouts/AdminLayout'
import AdminDashboardPage from '../pages/admin/AdminDashboardPage'
import AdminPublishersPage from '../pages/admin/AdminPublishersPage'
import PublisherProfilePage from '../pages/publisher/PublisherProfilePage'

const router = createBrowserRouter([
  {
    path: '/',
    element: <HomePage />,
  },

  {
    path: '/signup',
    element: <SignupPage />,
  },
  {
    path: '/verify-otp',
    element: <VerifyOtpPage />,
  },
  {
  path: '/login',
  element: <LoginPage />,
  },
  {
  path: '/forgot-password',
  element: <ForgotPasswordPage />,
  },
  {
  path: '/verify-reset-otp',
  element: <VerifyResetOtpPage />,
  },
  {
  path: '/reset-password',
  element: <ResetPasswordPage />,
  },
  
  {
  path: '/publisher/signup',
  element: <PublisherSignupPage />,
  },
  {
    element: <ProtectedRoute allowedRoles={['user']} />,
    children: [
      {
        element: <UserLayout />,
        children: [
          {
            path: '/explore',
            element: <ExplorePage />,
          },
        ],
      },
    ],
  },
  {
    element: <ProtectedRoute allowedRoles={['publisher']} />,
    children: [
      {
        element: <PublisherLayout />,
        children: [
          {
            path: '/publisher/dashboard',
            element: <PublisherDashboardPage />,
          },
          {
            path: '/publisher/profile',
            element: <PublisherProfilePage />,
          },
        ],
      },
    ],
  },
  {
    element: <ProtectedRoute allowedRoles={['admin']} />,
    children: [
      {
        element: <AdminLayout />,
        children: [
          {
            path: '/admin/dashboard',
            element: <AdminDashboardPage />,
          },
          {
            path: '/admin/publishers',
            element: <AdminPublishersPage />,
          },
        ],
      },
    ],
  },

])

export default router