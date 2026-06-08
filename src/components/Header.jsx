import { useLocation, useNavigate } from 'react-router-dom';

export default function Header({ setIsSidebarOpen }) {
  const location = useLocation();
  const navigate = useNavigate();

  // Helper function to capitalize the current route path for the title
  const getPageTitle = () => {
    const path = location.pathname.substring(1); // removes the leading slash
    if (!path) return 'Dashboard';
    return path.charAt(0).toUpperCase() + path.slice(1);
  };

  const handleLogout = () => {
    // 1. Clear out local storage
    localStorage.removeItem('token');
    
    // 2. Redirect back to the login stub
    navigate('/login');
  };

  return (
    <header className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between md:px-8">
      
      {/* Left side: Hamburger (Mobile) + Page Title (Desktop) */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => setIsSidebarOpen(true)}
          className="md:hidden text-gray-500 hover:text-gray-700 focus:outline-none"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        
        <h2 className="text-xl font-semibold text-gray-800">
          {getPageTitle()}
        </h2>
      </div>

      {/* Right side: Avatar + Logout */}
      <div className="flex items-center gap-4">
        {/* Placeholder Avatar Initials */}
        <div className="h-9 w-9 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold border border-blue-200">
          TB
        </div>
        
        <button
          onClick={handleLogout}
          className="text-sm font-medium text-gray-500 hover:text-red-600 transition-colors"
        >
          Logout
        </button>
      </div>
      
    </header>
  );
}