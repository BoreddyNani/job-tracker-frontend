import { Navigate, Outlet } from 'react-router-dom';

export default function ProtectedRoute() {
  const token = localStorage.getItem('token');

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Render the nested routes (Layout -> Dashboard, Applications, etc.)
  return <Outlet />;
}