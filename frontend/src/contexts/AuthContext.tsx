import { createContext, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import type { Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import type { User } from '../types/database.types';
import {
  signUpUser,
  signInUser,
  signOutUser,
  resetPasswordForEmail,
  fetchUserProfile as fetchUserProfileAPI,
  updateUserProfile,
  deleteUser,
} from '../services/api';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signUp: (email: string, password: string, userData: Partial<User>) => Promise<{ id: string }>;
  signIn: (email: string, password: string) => Promise<User>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateProfile: (userId: string, updates: Partial<User>) => Promise<void>;
  deleteAccount: (userId: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session?.user) {
        fetchUserProfile(session.user.id);
      } else {
        setLoading(false);
      }
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session?.user) {
        fetchUserProfile(session.user.id);
      } else {
        setUser(null);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchUserProfile = async (userId: string) => {
    try {
      const userData = await fetchUserProfileAPI(userId);
      setUser(userData);
    } catch (error) {
      console.error('Error fetching user profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string, userData: Partial<User>): Promise<{ id: string }> => {
    const result = await signUpUser(email, password, userData);
    
    // Only fetch profile if email is confirmed, otherwise user needs to verify first
    // Check session to see if email was auto-confirmed
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user?.email_confirmed_at) {
      await fetchUserProfile(result.id);
    }
    
    return result;
  };

  const signIn = async (email: string, password: string): Promise<User> => {
    const userData = await signInUser(email, password);
    setUser(userData);
    return userData;
  };

  const signOut = async () => {
    await signOutUser();
    setUser(null);
    setSession(null);
  };

  const resetPassword = async (email: string) => {
    await resetPasswordForEmail(email);
  };

  const updateProfile = async (userId: string, updates: Partial<User>) => {
    await updateUserProfile(userId, updates);
    // Refresh user profile after update
    await fetchUserProfile(userId);
  };

  const deleteAccount = async (userId: string) => {
    await deleteUser(userId);
    setUser(null);
    setSession(null);
  };

  const value = {
    user,
    session,
    loading,
    signUp,
    signIn,
    signOut,
    resetPassword,
    updateProfile,
    deleteAccount,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
