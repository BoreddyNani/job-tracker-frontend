import {useState} from 'react';
import { getResumeTips } from '../api/resume';
export default function useResumeTips() {
  const [tips, setTips] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const getTips = async (jobDescription, currentResume) => {
    setIsLoading(true); setError(null); setTips(null);
    try {
      const res = await getResumeTips(jobDescription, currentResume );
      setTips(res.tips);
    } catch (err) {
      setError("Failed to get tips. Please try again.");
    } finally { setIsLoading(false); }
  };

  return { tips, isLoading, error, getTips };
}