import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

// Create axios instance
const api = axios.create({
  baseURL: import.meta.env.PROD 
    ? 'https://orvexia-backend.vercel.app/api/v1/users'
    : 'http://localhost:3000/api/v1/users',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include token from localStorage
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = async () => {
    try {
      const response = await api.get('/get-profile');
      if (response.data && response.data.status) {
        setUser(response.data.user);
      } else {
        setUser(null);
      }
    } catch (error) {
      // Don't log 401 errors - they're expected when not logged in
      if (error.response?.status !== 401) {
        console.error("Fetch user error:", error);
      }
      setUser(null);
      // Clear invalid token
      localStorage.removeItem('token');
    } finally {
      setLoading(false);
    }
  };

  // useEffect(() => {
  //   fetchUser();
  // }, []);

  const login = async (email, password) => {
    try {
      const response = await api.post('/login', { email, password });
      if (response.data.status) {
        // Store token if provided (fallback for cross-origin cookie issues)
        if (response.data.token) {
          localStorage.setItem('token', response.data.token);
        }
        await fetchUser();
        return response.data;
      }
      throw new Error(response.data.message || 'Login failed');
    } catch (error) {
      console.error("Login error:", error);
      throw error.response?.data || error;
    }
  };

  const signup = async (name, email, password) => {
    try {
      const response = await api.post('/register', { name, email, password });
      if (response.data.status) {
        // Auto login after signup
        await login(email, password);
        return response.data;
      }
      throw new Error(response.data.message || 'Signup failed');
    } catch (error) {
      console.error("Signup error:", error);
      throw error.response?.data || error;
    }
  };

  const logout = async () => {
    try {
      await api.post('/logout');
      setUser(null);
      localStorage.removeItem('token');
    } catch (error) {
      console.error("Logout error:", error);
      // Force logout on client even if server fails
      setUser(null);
      localStorage.removeItem('token');
    }
  };

  const value = {
    user,
    loading,
    login,
    signup,
    logout,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};