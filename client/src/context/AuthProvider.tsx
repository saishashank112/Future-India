import React, { useState } from 'react';
import { AuthContext } from './AuthContext';
import type { User } from './AuthContext';
import { getApiUrl } from '../config/api';

const SESSION_DURATION_MS = 24 * 60 * 60 * 1000; // 24 hours

const getStoredUser = (): User | null => {
  try {
    const saved = localStorage.getItem('exim_user');
    const expiryStr = localStorage.getItem('exim_user_expiry');
    if (!saved || !expiryStr) return null;
    const expiry = parseInt(expiryStr, 10);
    if (Date.now() > expiry) {
      // Session expired — clear storage
      localStorage.removeItem('exim_user');
      localStorage.removeItem('exim_user_expiry');
      return null;
    }
    return JSON.parse(saved);
  } catch {
    return null;
  }
};

const saveUser = (user: User) => {
  localStorage.setItem('exim_user', JSON.stringify(user));
  localStorage.setItem('exim_user_expiry', String(Date.now() + SESSION_DURATION_MS));
};

const clearUser = () => {
  localStorage.removeItem('exim_user');
  localStorage.removeItem('exim_user_expiry');
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => getStoredUser());

  const isAuthenticated = !!user;
  const isAdmin = user?.role === 'admin';

  const login = (email: string, pass: string) => {
    if (email === 'admin@futureindia.com' && pass === 'admin123') {
      const adminUser: User = { id: 0, name: 'Admin', email, phone: null, company_name: null, country: null, role: 'admin' };
      setUser(adminUser);
      saveUser(adminUser);
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    clearUser();
  };

  const signup = async (userData: { name: string, email: string, phone: string, password: string }) => {
    try {
      const res = await fetch(getApiUrl('/auth/signup'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });
      const data = await res.json();
      if (res.ok) {
        setUser(data.user);
        localStorage.setItem('exim_user', JSON.stringify(data.user));
        return { success: true };
      }
      return { success: false, error: data.error };
    } catch (error) {
      console.error('Signup Error:', error);
      return { success: false, error: 'System error' };
    }
  };

  const loginWithPassword = async (identifier: string, pass: string) => {
    try {
      const res = await fetch(getApiUrl('/auth/login'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier, password: pass }),
      });
      const data = await res.json();
      if (res.ok) {
        setUser(data.user);
        saveUser(data.user);
        return { success: true };
      }
      return { success: false, error: data.error };
    } catch (error) {
      console.error('Login Error:', error);
      return { success: false, error: 'System error' };
    }
  };

  const sendOtp = async (identifier: string, type: 'email' | 'phone') => {
    try {
      const res = await fetch(getApiUrl('/auth/otp/send'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier, type }),
      });
      return res.ok;
    } catch (error) {
      console.error('OTP Send Error:', error);
      return false;
    }
  };

  const verifyOtp = async (identifier: string, otp: string) => {
    try {
      const res = await fetch(getApiUrl('/auth/otp/verify'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier, otp }),
      });
      const data = await res.json();
      if (res.ok) {
        const userData: User = { ...data.user, role: 'user' };
        setUser(userData);
        saveUser(userData);
        return true;
      }
      return false;
    } catch (error) {
      console.error('OTP Verify Error:', error);
      return false;
    }
  };

  const updateProfile = async (profile: Partial<User>) => {
    if (!user) return false;
    try {
      const res = await fetch(getApiUrl(`/user/profile/${user.id}`), {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profile),
      });
      if (res.ok) {
        const newUser = { ...user, ...profile };
        setUser(newUser);
        saveUser(newUser);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Profile Update Error:', error);
      return false;
    }
  };

  return (
    <AuthContext.Provider value={{ 
      isAuthenticated, 
      isAdmin, 
      user, 
      login, 
      logout, 
      signup,
      loginWithPassword,
      sendOtp, 
      verifyOtp, 
      updateProfile 
    }}>
      {children}
    </AuthContext.Provider>
  );
};
