import apiClient from './client';

export const getResumeTips = async (jobDescription, currentResume) => {
    
  const { data } = await apiClient.post('/ai/resume-tips', {
    jobDescription,
    currentResume
  });
  return data; // This contains your { tips: "..." } from Gemini
};