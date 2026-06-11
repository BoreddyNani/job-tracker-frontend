import { useState } from 'react';
import useApplications from '../hooks/useApplications';
import ApplicationModal from '../components/ApplicationModal';

export default function Applications() {
  const { applications, isLoading, error, create, update, remove } = useApplications();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingApp, setEditingApp] = useState(null);

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
  };

  if (isLoading) return <div className="p-8 text-center">Loading applications...</div>;
  if (error) return <div className="p-8 text-center text-red-600">{error}</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Job Applications</h1>
        <button
          onClick={openAddModal}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 shadow-sm font-medium"
        >
          + Add Application
        </button>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-lg border-b border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Company</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Applied Date</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {applications.length === 0 ? (
              <tr>
                <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                  No applications yet. Click "Add Application" to get started!
                </td>
              </tr>
            ) : (
              applications.map((app) => (
                <tr key={app.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{app.company}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{app.role}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{getStatusBadge(app.status)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(app.appliedAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-4">
                    <button 
                      onClick={() => openEditModal(app)}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => remove(app.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <ApplicationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleModalSubmit}
        editingApp={editingApp}
      />
    </div>
  );
}