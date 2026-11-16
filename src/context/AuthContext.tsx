'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, Address } from '@/types';

interface AuthContextType {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isAuthModalOpen: boolean;
  openAuthModal: () => void;
  closeAuthModal: () => void;
  loginWithPhone: (phone: string, name?: string, address?: Address) => Promise<boolean>;
  logout: () => void;
  refreshUser: () => Promise<void>;
  updateAddress: (address: Address) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // Load user from localStorage if previously logged in
  useEffect(() => {
    async function loadInitialUser() {
      try {
        const savedUserId = localStorage.getItem('blinkit_user_id');
        if (savedUserId) {
          const res = await fetch(`/api/user?userId=${savedUserId}`);
          const data = await res.json();
          if (data.user) {
            setUser(data.user);
          } else {
            localStorage.removeItem('blinkit_user_id');
            setUser(null);
          }
        } else {
          setUser(null);
        }
      } catch (e) {
        console.error('Failed to load user session', e);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    }

    loadInitialUser();
  }, []);

  const loginWithPhone = async (phone: string, name?: string, address?: Address) => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, name, address }),
      });
      const data = await res.json();
      if (data.user) {
        setUser(data.user);
        localStorage.setItem('blinkit_user_id', data.user.id);
        setIsAuthModalOpen(false);
        return true;
      }
      return false;
    } catch (err) {
      console.error('Login error', err);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('blinkit_user_id');
  };

  const refreshUser = async () => {
    if (!user) return;
    try {
      const res = await fetch(`/api/user?userId=${user.id}`);
      const data = await res.json();
      if (data.user) {
        setUser(data.user);
      }
    } catch (err) {
      console.error('Failed to refresh user', err);
    }
  };

  const updateAddress = async (newAddress: Address) => {
    if (!user) return;
    const updatedUser = {
      ...user,
      addresses: [newAddress, ...user.addresses.filter((a) => a.id !== newAddress.id)],
    };
    setUser(updatedUser);
    await fetch('/api/user', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        phone: user.phone,
        name: user.name,
        address: newAddress,
      }),
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        isAuthModalOpen,
        openAuthModal: () => setIsAuthModalOpen(true),
        closeAuthModal: () => setIsAuthModalOpen(false),
        loginWithPhone,
        logout,
        refreshUser,
        updateAddress,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
