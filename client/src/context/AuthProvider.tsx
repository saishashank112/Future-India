import React, { useState } from 'react';
import { AuthContext } from './AuthContext';
import type { User } from './AuthContext';
import { getApiUrl } from '../config/api';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('exim_user');
    return saved ? JSON.parse(saved) : null;
  });

  const isAuthenticated = !!user;
  const isAdmin = user?.role === 'admin';

  const login = (email: string, pass: string) => {
    if (email === 'admin@futureindia.com' && pass === 'admin123') {
      const adminUser: User = { id: 0, name: 'Admin', email, phone: null, company_name: null, country: null, role: 'admin' };
      setUser(adminUser);
      localStorage.setItem('exim_user', JSON.stringify(adminUser));
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('exim_user');
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
        localStorage.setItem('exim_user', JSON.stringify(data.user));
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
        localStorage.setItem('exim_user', JSON.stringify(userData));
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
        localStorage.setItem('exim_user', JSON.stringify(newUser));
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
