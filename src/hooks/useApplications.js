import { useState, useEffect } from 'react';
import * as api from '../api/application';

export default function useApplications() {
  const [applications, setApplications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchApps = async () => {
      try {
        const data = await api.getApplications();
        setApplications(data);
      } catch (err) {
        setError('Failed to load applications.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchApps();
  }, []);

  const create = async (appData) => {
    const newApp = await api.createApplication(appData);
    // Add the new application to the top of the list
    setApplications((prev) => [newApp, ...prev]);
  };

  const update = async (id, appData) => {
    const updatedApp = await api.updateApplication(id, appData);
    setApplications((prev) => 
      prev.map((app) => (app.id === id ? updatedApp : app))
    );
  };

  const updateResumeUrl = (id, resumeUrl) => {
    setApplications((prev) =>
      prev.map((app) => (app.id === id ? { ...app, resumeUrl } : app))
    );
  };

  const remove = async (id) => {
    // 1. Optimistic Update: Instantly remove from UI
    const previousApps = [...applications];
    setApplications((prev) => prev.filter((app) => app.id !== id));

    try {
      // 2. Call the API in the background
      await api.deleteApplication(id);
    } catch (err) {
      // 3. Revert if the API call fails
      setApplications(previousApps);
      console.error("Failed to delete, reverting UI");
      throw err;
    }
  };

  return { applications, isLoading, error, create, update, updateResumeUrl, remove };
}