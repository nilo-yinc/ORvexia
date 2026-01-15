import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

// Create axios instance
const api = axios.create({
  baseURL: import.meta.env.PROD 
    ? 'https://orvexia-backend.vercel.app/api/v1/users'
    : '/api/v1/users',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

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
      // If 401 or other error, user is not logged in
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const login = async (email, password) => {
    try {
      const response = await api.post('/login', { email, password });
      if (response.data.status) {
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
    } catch (error) {
      console.error("Logout error:", error);
      // Force logout on client even if server fails
      setUser(null);
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