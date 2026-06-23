import { useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import apiClient from '../api/client';

export default function useAuth() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUser(decoded);
      } catch (error) {
        localStorage.removeItem('token');
        setUser(null);
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email, password) => {
    const { data } = await apiClient.post('/auth/login', { email, password });
    localStorage.setItem('token', data.token);
    setUser(jwtDecode(data.token));
    navigate('/dashboard');
  };

  const register =async(email, name, password) =>{
    const {data} = await apiClient.post('/auth/register', {email,name,password});
    localStorage.setItem('token', data.token)
    navigate('/login')
  }

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    navigate('/login');
  };

  
  const refetchUser = async () => {
    try {
      const { data } = await apiClient.get('/auth/me');
      localStorage.setItem('token', data.token);
      setUser(jwtDecode(data.token));
    } catch (error) {
      console.error("Failed to refresh user token", error);
    }
  };

  // Make sure to export refetchUser so the Dashboard can use it!
  return { user, isLoading, login, logout, refetchUser , register };
}