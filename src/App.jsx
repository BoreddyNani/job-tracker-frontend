import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectRoute';
import Dashboard from './pages/Dashboard';
import Applications from './pages/Applications';
import Resume from './pages/Resume';
import Insights from './pages/Insights';
import Login from './pages/Login';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />

        {/* Wrap the Layout in ProtectedRoute */}
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<Layout />}>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="applications" element={<Applications />} />
            <Route path="resume" element={<Resume />} />
            <Route path="insights" element={<Insights />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}