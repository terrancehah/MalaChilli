import { createContext, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import type { Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import type { User } from '../types/database.types';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signUp: (email: string, password: string, userData: Partial<User>) => Promise<{ id: string }>;
  signIn: (email: string, password: string) => Promise<User>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateProfile: (userId: string, updates: Partial<User>) => Promise<void>;
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
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) throw error;
      setUser(data);
    } catch (error) {
      console.error('Error fetching user profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string, userData: Partial<User>): Promise<{ id: string }> => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: userData,
        emailRedirectTo: `${window.location.origin}/login`,
      },
    });

    if (error) {
      // Improve error message for duplicate email
      if (error.message.includes('already registered') || error.message.includes('User already registered')) {
        throw new Error('This email is already registered. Please login or use a different email.');
      }
      throw error;
    }
    
    if (!data.user) {
      throw new Error('Failed to create user');
    }
    
    // Create user profile in database
    // Generate referral code
    const referralCode = `CHILLI-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
    
    // Insert user profile (only fields that exist in database schema)
    const { error: profileError } = await supabase
      .from('users')
      .insert({
        id: data.user.id,
        email: data.user.email,
        full_name: userData.full_name || data.user.email?.split('@')[0],
        birthday: userData.birthday || null,
        referral_code: referralCode,
        role: userData.role || 'customer',
        email_verified: data.user.email_confirmed_at ? true : false,
      });

    if (profileError) throw profileError;
    
    // Only fetch profile if email is confirmed, otherwise user needs to verify first
    if (data.user.email_confirmed_at) {
      await fetchUserProfile(data.user.id);
    }
    
    // Return user ID for referral code saving
    return { id: data.user.id };
  };

  const signIn = async (email: string, password: string): Promise<User> => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      // Better error message for unconfirmed email
      if (error.message.includes('Email not confirmed')) {
        throw new Error('Please confirm your email address before signing in. Check your inbox for the confirmation link.');
      }
      throw error;
    }
    
    // Fetch user profile immediately after sign in
    if (data.user) {
      const { data: userData, error: profileError } = await supabase
        .from('users')
        .select('*')
        .eq('id', data.user.id)
        .single();

      if (profileError) {
        throw new Error('User profile not found. Please contact support.');
      }
      
      setUser(userData);
      return userData;
    }
    
    throw new Error('User not found');
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    setUser(null);
    setSession(null);
  };

  const resetPassword = async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    if (error) throw error;
  };

  const updateProfile = async (userId: string, updates: Partial<User>) => {
    // Only allow updating specific fields
    const allowedFields: (keyof User)[] = ['full_name', 'birthday'];
    const filteredUpdates: Record<string, any> = {};
    
    allowedFields.forEach((field) => {
      if (field in updates && updates[field] !== undefined) {
        filteredUpdates[field] = updates[field];
      }
    });

    const { error } = await supabase
      .from('users')
      .update(filteredUpdates)
      .eq('id', userId);

    if (error) throw error;

    // Refresh user profile after update
    await fetchUserProfile(userId);
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
