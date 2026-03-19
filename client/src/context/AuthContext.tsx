import { createContext, useContext } from 'react';

export interface User {
  id: number;
  name: string | null;
  email: string | null;
  phone: string | null;
  company_name: string | null;
  country: string | null;
  role: 'admin' | 'user';
}

export interface AuthContextType {
  isAuthenticated: boolean;
  isAdmin: boolean;
  user: User | null;
  login: (email: string, pass: string) => boolean; // For Admin
  logout: () => void;
  signup: (userData: { name: string, email: string, phone: string, password: string }) => Promise<{ success: boolean, error?: string }>;
  loginWithPassword: (identifier: string, pass: string) => Promise<{ success: boolean, error?: string }>;
  sendOtp: (identifier: string, type: 'email' | 'phone') => Promise<boolean>;
  verifyOtp: (identifier: string, otp: string) => Promise<boolean>;
  updateProfile: (profile: Partial<User>) => Promise<boolean>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
