import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';
import { demoAccounts } from '../services/mockData';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('foodrescue_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return demoAccounts.donor;
      }
    }
    return demoAccounts.donor; // default into donor role for immediate interactive experience
  });

  const [token, setToken] = useState(() => localStorage.getItem('foodrescue_token') || 'demo_jwt_token_2026');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      localStorage.setItem('foodrescue_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('foodrescue_user');
    }
  }, [user]);

  useEffect(() => {
    if (token) {
      localStorage.setItem('foodrescue_token', token);
    } else {
      localStorage.removeItem('foodrescue_token');
    }
  }, [token]);

  // Login with API fallback to mock accounts
  const login = async (email, password) => {
    setLoading(true);
    try {
      const res = await api.post('/auth/login', { email, password });
      if (res.data.success) {
        setUser(res.data.user);
        setToken(res.data.token);
        setLoading(false);
        return { success: true, user: res.data.user };
      }
    } catch (error) {
      // Fallback: Check mock demo accounts
      const matchedKey = Object.keys(demoAccounts).find(
        (key) => demoAccounts[key].email.toLowerCase() === email.toLowerCase()
      );
      if (matchedKey) {
        const demoUser = demoAccounts[matchedKey];
        setUser(demoUser);
        setToken('demo_token_' + matchedKey);
        setLoading(false);
        return { success: true, user: demoUser };
      }
    }
    setLoading(false);
    throw new Error('Invalid email or password. You can also use the 1-Click Demo Logins below!');
  };

  // Register with API fallback
  const register = async (userData) => {
    setLoading(true);
    try {
      const res = await api.post('/auth/register', userData);
      if (res.data.success) {
        setUser(res.data.user);
        setToken(res.data.token);
        setLoading(false);
        return { success: true, user: res.data.user };
      }
    } catch (error) {
      // Client-side fallback registration
      const newUser = {
        id: 'user_' + Date.now(),
        name: userData.name,
        email: userData.email,
        role: userData.role || 'donor',
        organizationName: userData.organizationName || '',
        phone: userData.phone || '',
        address: userData.address || 'Metro Center, City',
      };
      setUser(newUser);
      setToken('demo_token_' + newUser.id);
      setLoading(false);
      return { success: true, user: newUser };
    }
  };

  // 1-Click Demo Login
  const loginAsDemo = (roleKey) => {
    const target = demoAccounts[roleKey] || demoAccounts.donor;
    setUser(target);
    setToken('demo_token_' + roleKey);
    return target;
  };

  // Instant Role Switcher for hackathon testing
  const switchRole = (newRole) => {
    const target = demoAccounts[newRole] || {
      ...user,
      role: newRole,
      name: `${newRole.toUpperCase()} Representative`,
    };
    setUser(target);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('foodrescue_user');
    localStorage.removeItem('foodrescue_token');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        role: user?.role || 'donor',
        isAuthenticated: !!user,
        loading,
        login,
        register,
        logout,
        loginAsDemo,
        switchRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
