import { createContext, useContext, useState, useEffect } from 'react';
import { getFromStorage, setToStorage, removeFromStorage } from '../utils/helpers';

const AuthContext = createContext();

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

  useEffect(() => {
    const storedUser = getFromStorage('user');
    if (storedUser) {
      setUser(storedUser);
    }
    setLoading(false);
  }, []);

  const login = async (emailOrData, password) => {
    // Handle both formats: login(email, password) or login({ email, name })
    let email, name;
    if (typeof emailOrData === 'string') {
      email = emailOrData;
      name = email.split('@')[0];
    } else if (emailOrData && typeof emailOrData === 'object') {
      email = emailOrData.email || emailOrData;
      name = emailOrData.name || email.split('@')[0];
    } else {
      email = 'user@example.com';
      name = 'User';
    }

    const mockUser = {
      id: '1',
      email: email,
      name: name,
      avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=200',
      role: 'Admin',
    };

    setUser(mockUser);
    setToStorage('user', mockUser);
    return mockUser;
  };

  const signup = async (name, email, password) => {
    const mockUser = {
      id: Date.now().toString(),
      email: email,
      name: name,
      avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=200',
      role: 'User',
    };

    setUser(mockUser);
    setToStorage('user', mockUser);
    return mockUser;
  };

  const logout = () => {
    setUser(null);
    removeFromStorage('user');
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