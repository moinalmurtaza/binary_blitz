/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../../services/api';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: string;       // ADMIN | TRAINER | STUDENT | ALUMNI | GUEST
  category: string;
  rating: number;
  avatarUrl?: string;
  handleCodeforces?: string;
  handleGithub?: string;
  handleLinkedin?: string;
  batch?: string;
  currentPhase?: string;
  currentWeek?: number;
  currentDay?: number;
}

interface AuthContextType {
  user: UserProfile | null;
  login: (email: string, password: string) => Promise<UserProfile>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  isLoading: boolean;
}

interface RegisterData {
  email: string;
  password: string;
  name: string;
  handleCodeforces?: string;
  handleGithub?: string;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function getRoleRedirectPath(role: string): string {
  switch (role) {
    case 'ADMIN':   return '/admin';
    case 'TRAINER': return '/dashboard';
    default:        return '/dashboard';
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Restore session from stored token on mount / page refresh
  const restoreSession = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setIsLoading(false);
      return;
    }
    try {
      const res = await api.get('/auth/me');
      setUser(res.data.user as UserProfile);
    } catch {
      // Token expired or invalid — clear it
      localStorage.removeItem('token');
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    restoreSession();
  }, [restoreSession]);

  const login = async (email: string, password: string): Promise<UserProfile> => {
    // MOCK LOGIN: Bypassing backend to allow frontend dashboard testing
    let assignedRole = 'ADMIN';
    let assignedName = 'Admin User';
    
    if (email.toLowerCase().includes('student')) {
      assignedRole = 'STUDENT';
      assignedName = 'Student User';
    } else if (email.toLowerCase().includes('trainer')) {
      assignedRole = 'TRAINER';
      assignedName = 'Trainer User';
    }

    const mockProfile: UserProfile = {
      id: `mock-${assignedRole.toLowerCase()}-id`,
      name: assignedName,
      email: email,
      role: assignedRole,
      category: assignedRole.charAt(0) + assignedRole.slice(1).toLowerCase(),
      rating: assignedRole === 'STUDENT' ? 1400 : 3000,
    };
    localStorage.setItem('token', 'mock-token');
    setUser(mockProfile);
    return mockProfile;
  };

  const register = async (data: RegisterData) => {
    const res = await api.post('/auth/register', data);
    const { token, user: profile } = res.data;
    if (token) {
      // Some Supabase setups skip email confirmation — auto-login if token returned
      localStorage.setItem('token', token);
      setUser(profile as UserProfile);
    }
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } catch {
      // Ignore logout API errors — still clear local state
    }
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        logout,
        isAuthenticated: !!user,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
