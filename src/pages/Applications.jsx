import { useState, useMemo, useCallback } from 'react';
import useApplications from '../hooks/useApplications';
import ApplicationModal from '../components/ApplicationModal';
import ResumeUploader from '../components/ResumeUploader';

const ALL_STATUSES = ["APPLIED", "SCREEN", "INTERVIEW", "OFFER", "REJECTED", "WITHDRAWN"];

export default function Applications() {
  const { applications, isLoading, error, create, update, updateResumeUrl, remove } = useApplications();
  
  // --- State ---
  // Simplified from a Set to a single string for the dropdown
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [searchRaw, setSearchRaw] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingApp, setEditingApp] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [applicationToDelete, setApplicationToDelete] = useState(null);

  // --- Handlers ---
  const getStatusBadge = (status) => {
    const badges = {
      APPLIED: 'bg-blue-100 text-blue-800',
      SCREEN: 'bg-amber-100 text-amber-800',
      INTERVIEW: 'bg-purple-100 text-purple-800',
      OFFER: 'bg-green-100 text-green-800',
      REJECTED: 'bg-red-100 text-red-800',
      WITHDRAWN: 'bg-gray-100 text-gray-800'
    };
    const style = badges[status] || 'bg-gray-100 text-gray-800';
    return (
      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${style}`}>
        {status}
      </span>
    );
  };

  const openAddModal = () => {
    setEditingApp(null);
    setIsModalOpen(true);
  };

  const openEditModal = (app) => {
    setEditingApp(app);
    setIsModalOpen(true);
  };

  const handleModalSubmit = async (formData) => {
    if (editingApp) {
      await update(editingApp.id, formData);
    } else {
      await create(formData);
    }
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const handleUploadSuccess = (appId, resumeUrl) => {
  updateResumeUrl(appId, resumeUrl)

};

  const confirmDelete = async () => {
    if (!applicationToDelete) return;
    try {
      await remove(applicationToDelete);
      setApplicationToDelete(null);
    } catch (error) {
      console.error("Delete failed", error);
    }
  };

  // --- Filtering & Search Logic ---
  const debounceSearch = useCallback((value) => {
    const t = setTimeout(() => setSearchQuery(value), 300);
    return () => clearTimeout(t);
  }, []);

  const handleSearchChange = (e) => {
    setSearchRaw(e.target.value);
    debounceSearch(e.target.value);
  };

  // Updated to reset the single string dropdown
  const clearAll = () => {
    setFilterStatus('ALL');
    setSearchRaw(""); 
    setSearchQuery("");
  };

  // Updated to check the single dropdown value
  const filtered = useMemo(() => {
    const q = searchQuery.toLowerCase();
    if (!applications) return []; 
    
    return applications.filter(app => {
      const matchesSearch = app.company.toLowerCase().includes(q) || app.role.toLowerCase().includes(q);
      const matchesStatus = filterStatus === 'ALL' || app.status === filterStatus;
      
      return matchesSearch && matchesStatus;
    });
  }, [applications, filterStatus, searchQuery]);

  // --- Render logic ---
  if (isLoading) return <div className="p-8 text-center text-gray-600">Loading applications...</div>;
  if (error) return <div className="p-8 text-center text-red-600">{error}</div>;

  return (
    <div className="space-y-6 max-w-6xl mx-auto p-6">
      
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Job Applications</h1>
        <button
          onClick={openAddModal}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 shadow-sm font-medium"
        >
          + Add Application
        </button>
      </div>

      {/* --- SIDE-BY-SIDE Filter & Search Bar --- */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex flex-col sm:flex-row gap-4 items-center">
        
        {/* Search (Takes up remaining space using flex-1) */}
        <div className="w-full flex-1">
          <input 
            value={searchRaw} 
            onChange={handleSearchChange}
            placeholder="Search by company or role..."
            className="w-full border border-gray-300 rounded-md px-4 py-2 text-sm focus:ring-blue-500 focus:border-blue-500" 
          />
        </div>
        
        {/* Dropdown Filter */}
        <div className="w-full sm:w-64 flex items-center gap-3">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-4 py-2 text-sm focus:ring-blue-500 focus:border-blue-500 bg-white cursor-pointer"
          >
            <option value="ALL">All Statuses</option>
            {ALL_STATUSES.map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
          
          {/* Optional Clear Button */}
          {(searchRaw !== '' || filterStatus !== 'ALL') && (
            <button 
              onClick={clearAll} 
              className="text-sm text-gray-500 hover:text-gray-900 whitespace-nowrap underline"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Count */}
      <p className="text-sm text-gray-500 font-medium">
        Showing {filtered.length} of {applications?.length || 0} applications
      </p>

      {/* --- Main Table --- */}
      <div className="bg-white shadow overflow-x-auto sm:rounded-lg border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Company</th>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Role</th>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Applied Date</th>
              <th className="px-6 py-3 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan="5" className="px-6 py-12 text-center text-gray-500 text-sm">
                  No applications found matching your filters.
                </td>
              </tr>
            ) : (
              filtered.map((app) => (
                <tr key={app.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">{app.company}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{app.role}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{getStatusBadge(app.status)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(app.appliedAt).toLocaleDateString()}
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-4 flex items-center justify-end">
  
                    {/* Inject the new Uploader Component */}
                    <ResumeUploader application={app} onUploadSuccess={handleUploadSuccess} />

                    <button onClick={() => openEditModal(app)} className="text-indigo-600 hover:text-indigo-900">
                      Edit
                    </button>
                    <button onClick={() => setApplicationToDelete(app.id)} className="text-red-600 hover:text-red-900">
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* --- Modals & Toasts --- */}
      <ApplicationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleModalSubmit}
        editingApp={editingApp}
      />

      {applicationToDelete && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex justify-center items-center">
          <div className="bg-white p-6 border w-full max-w-sm shadow-xl rounded-xl">
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="bg-red-100 p-3 rounded-full">
                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900">Delete Application</h3>
              <p className="text-gray-500 text-sm">Are you sure you want to delete this? This action cannot be undone.</p>
              <div className="flex justify-center space-x-3 w-full pt-4">
                <button onClick={() => setApplicationToDelete(null)} className="flex-1 py-2 px-4 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                  Cancel
                </button>
                <button onClick={confirmDelete} className="flex-1 py-2 px-4 border border-transparent rounded-lg text-sm font-medium text-white bg-red-600 hover:bg-red-700">
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showSuccess && (
        <div className="fixed top-5 right-5 z-50 animate-fade-in-down">
          <div className="bg-green-600 text-white px-6 py-4 rounded-xl shadow-lg flex items-center space-x-3">
            <svg className="w-6 h-6 text-green-100" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
            <div className="font-medium text-lg">Success!</div>
          </div>
        </div>
      )}
    </div>
  );
}