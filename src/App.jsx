import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Import your Layout shell
import Layout from './components/Layout';

// Import all your page stubs
import Dashboard from './pages/Dashboard';
import Applications from './pages/Applications';
import Resume from './pages/Resume';
import Insights from './pages/Insights';
import Login from './pages/Login';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Route (No Sidebar/Layout wrapper) */}
        <Route path="/login" element={<Login />} />

        {/* Main App Routes (Wrapped inside the Layout shell) */}
        <Route path="/" element={<Layout />}>
          
          {/* Automatically redirect the root URL "/" to the dashboard */}
          <Route index element={<Navigate to="/dashboard" replace />} />
          
          {/* The nested pages that will inject into the <Outlet /> */}
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="applications" element={<Applications />} />
          <Route path="resume" element={<Resume />} />
          <Route path="insights" element={<Insights />} />
          
        </Route>
      </Routes>
    </BrowserRouter>
  );
}