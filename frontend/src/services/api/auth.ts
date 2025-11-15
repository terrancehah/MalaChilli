/**
 * Authentication API service.
 * Centralizes all Supabase authentication operations.
 */

import { supabase } from '../../lib/supabase';
import type { User } from '../../types/database.types';

/**
 * Sign up a new user with email and password.
 * Creates both auth user and user profile in database.
 */
export async function signUpUser(
  email: string,
  password: string,
  userData: Partial<User>
): Promise<{ id: string }> {
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
    if (
      error.message.includes('already registered') ||
      error.message.includes('User already registered')
    ) {
      throw new Error(
        'This email is already registered. Please login or use a different email.'
      );
    }
    throw error;
  }

  if (!data.user) {
    throw new Error('Failed to create user');
  }

  // Generate referral code
  const referralCode = `CHILLI-${Math.random()
    .toString(36)
    .substring(2, 8)
    .toUpperCase()}`;

  // Insert user profile (only fields that exist in database schema)
  const { error: profileError } = await supabase.from('users').insert({
    id: data.user.id,
    email: data.user.email,
    full_name: userData.full_name || data.user.email?.split('@')[0],
    birthday: userData.birthday || null,
    referral_code: referralCode,
    role: userData.role || 'customer',
    email_verified: data.user.email_confirmed_at ? true : false,
  });

  if (profileError) throw profileError;

  // Return user ID for referral code saving
  return { id: data.user.id };
}

/**
 * Sign in an existing user with email and password.
 * Returns the user profile data.
 */
export async function signInUser(
  email: string,
  password: string
): Promise<User> {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    // Better error message for unconfirmed email
    if (error.message.includes('Email not confirmed')) {
      throw new Error(
        'Please confirm your email address before signing in. Check your inbox for the confirmation link.'
      );
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

    return userData;
  }

  throw new Error('User not found');
}

/**
 * Sign out the current user.
 */
export async function signOutUser(): Promise<void> {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

/**
 * Request a password reset email for the given email address.
 */
export async function resetPasswordForEmail(email: string): Promise<void> {
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/reset-password`,
  });

  if (error) throw error;
}

/**
 * Get the current session.
 */
export async function getCurrentSession() {
  const { data, error } = await supabase.auth.getSession();
  if (error) throw error;
  return data.session;
}

/**
 * Fetch user profile by user ID.
 */
export async function fetchUserProfile(userId: string): Promise<User> {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) throw error;
  return data;
}

/**
 * Update user profile with allowed fields only.
 */
export async function updateUserProfile(
  userId: string,
  updates: Partial<User>
): Promise<void> {
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
}
