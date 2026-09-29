import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';
import { supabase } from '../services/supabaseClient';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('cafe_auth_token'));
  const [loading, setLoading] = useState(true);

  // Initialize session
  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('cafe_auth_token');
      if (storedToken) {
        try {
          const res = await api.get('/auth/me');
          if (res.data?.user) {
            setUser(res.data.user);
            setProfile(res.data.profile);
          }
        } catch {
          // Token expired or invalid
          localStorage.removeItem('cafe_auth_token');
          setToken(null);
          setUser(null);
          setProfile(null);
        }
      }
      setLoading(false);
    };

    initAuth();

    // Supabase auth state change listener if supabase initialized
    if (supabase) {
      const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
        if (session?.access_token) {
          localStorage.setItem('cafe_auth_token', session.access_token);
          setToken(session.access_token);
          setUser(session.user);
        } else if (event === 'SIGNED_OUT') {
          localStorage.removeItem('cafe_auth_token');
          setToken(null);
          setUser(null);
          setProfile(null);
        }
      });

      return () => {
        subscription?.unsubscribe();
      };
    }
  }, []);

  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    const { token: newToken, user: newUser, profile: newProfile } = res.data;
    localStorage.setItem('cafe_auth_token', newToken);
    setToken(newToken);
    setUser(newUser);
    setProfile(newProfile);
    return res;
  };

  const register = async (email, password, fullName) => {
    const res = await api.post('/auth/register', { email, password, fullName });
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
    if (res.data?.profile) {
      setProfile(res.data.profile);
    }
    return res;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        token,
        loading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        updateProfile
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
