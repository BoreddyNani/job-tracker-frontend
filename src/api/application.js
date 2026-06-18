import apiClient from './client';

export const getApplications = async () => {
  const { data } = await apiClient.get('/applications');
  return data;
};

export const createApplication = async (applicationData) => {
  const { data } = await apiClient.post('/applications', applicationData);
  return data;
};

export const updateApplication = async (id, applicationData) => {
  const { data } = await apiClient.patch(`/applications/${id}`, applicationData);
  return data;
};

export const deleteApplication = async (id) => {
  await apiClient.delete(`/applications/${id}`);
};

export const uploadResume = async (id, file, onProgress) => {
  const formData = new FormData();
  formData.append('resume', file);

  const { data } = await apiClient.post(`/applications/${id}/resume`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    onUploadProgress: (progressEvent) => {
      const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
      onProgress(percentCompleted);
    },
  });
  return data;
};