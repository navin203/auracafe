import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('cafe_auth_token'));
  const [loading, setLoading] = useState(true);

  // Initialize session from saved JWT
  useEffect(() => {
    let isMounted = true;

    const initAuth = async () => {
      const storedToken = localStorage.getItem('cafe_auth_token');
      if (storedToken) {
        try {
          const res = await api.get('/auth/me');
          const payload = res?.data || res;
          const currentUser = payload?.user;
          const currentProfile = payload?.profile || (currentUser ? {
            id: currentUser.id,
            email: currentUser.email,
            full_name: currentUser.user_metadata?.full_name || currentUser.email?.split('@')[0]
          } : null);

          if (isMounted && currentUser) {
            setUser(currentUser);
            setProfile(currentProfile);
          }
        } catch (err) {
          console.warn('Session verification notice:', err.message);
          const msg = (err.message || '').toLowerCase();
          // Clear only if token is explicitly invalid or expired
          if (msg.includes('401') || msg.includes('token') || msg.includes('jwt') || msg.includes('unauthorized') || msg.includes('expired')) {
            if (isMounted) {
              localStorage.removeItem('cafe_auth_token');
              setToken(null);
              setUser(null);
              setProfile(null);
            }
          }
        }
      }

      if (isMounted) {
        setLoading(false);
      }
    };

    initAuth();

    return () => {
      isMounted = false;
    };
  }, []);

  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    const payload = res?.data || res;
    const newToken = payload?.token || payload?.session?.access_token || res?.token;
    const newUser = payload?.user || res?.user;
    const newProfile = payload?.profile || (newUser ? {
      id: newUser.id,
      email: newUser.email || email,
      full_name: newUser.user_metadata?.full_name || email.split('@')[0]
    } : null);

    if (newToken) {
      localStorage.setItem('cafe_auth_token', newToken);
      setToken(newToken);
    }
    if (newUser) {
      setUser(newUser);
      setProfile(newProfile);
    }
    return res;
  };

  const register = async (email, password, fullName) => {
    const res = await api.post('/auth/register', { email, password, fullName });
    const payload = res?.data || res;
    const newToken = payload?.token || payload?.session?.access_token || res?.token;
    const newUser = payload?.user || res?.user;
    const newProfile = payload?.profile || (newUser ? {
      id: newUser.id,
      email: newUser.email || email,
      full_name: fullName || newUser.user_metadata?.full_name || email.split('@')[0]
    } : null);

    if (newToken && newUser) {
      localStorage.setItem('cafe_auth_token', newToken);
      setToken(newToken);
      setUser(newUser);
      setProfile(newProfile);
    }
    return res;
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } catch {
      // Continue cleanup regardless
    }
    localStorage.removeItem('cafe_auth_token');
    setToken(null);
    setUser(null);
    setProfile(null);
  };

  const updateProfile = async (updates) => {
    const res = await api.put('/user/profile', updates);
    const payload = res?.data || res;
    if (payload?.profile) {
      setProfile(payload.profile);
    }
    return res;
  };

  const value = {
    user,
    profile,
    token,
    loading,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    updateProfile
  };

  return (
    <AuthContext.Provider value={value}>
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
