import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCurrentSession, signOutUser } from '../../services/api';
import { supabase } from '../../lib/supabase';
import toast, { Toaster } from 'react-hot-toast';

export default function ResetPassword() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [validSession, setValidSession] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user has a valid recovery session
    getCurrentSession().then((session) => {
      if (session) {
        setValidSession(true);
      } else {
        toast.error('Invalid or expired reset link');
        setTimeout(() => navigate('/forgot-password'), 2000);
      }
    }).catch(() => {
      toast.error('Invalid or expired reset link');
      setTimeout(() => navigate('/forgot-password'), 2000);
    });
  }, [navigate]);

  const validatePassword = (pwd: string): string => {
    if (pwd.length < 8) return 'Password must be at least 8 characters';
    if (!/[A-Z]/.test(pwd)) return 'Password must contain at least one uppercase letter';
    if (!/[0-9]/.test(pwd)) return 'Password must contain at least one number';
    return '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    const passwordError = validatePassword(password);
    if (passwordError) {
      toast.error(passwordError);
      return;
    }

    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.auth.updateUser({
        password: password
      });

      if (error) throw error;

      toast.success('Password updated successfully! Redirecting to login...');
      
      // Sign out and redirect to login
      await signOutUser();
      setTimeout(() => navigate('/login'), 2000);
      
    } catch (err: any) {
      console.error('Password reset error:', err);
      toast.error(err.message || 'Failed to reset password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!validSession) {
    return (
      <div className="min-h-screen auth-gradient-bg flex items-center justify-center p-6">
        <div className="text-center text-white">
          <p>Validating reset link...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Toaster position="top-right" toastOptions={{
        duration: 4000,
        style: {
          background: '#fff',
          color: '#111827',
        },
        success: {
          iconTheme: {
            primary: '#0A5F0A',
            secondary: '#fff',
          },
        },
        error: {
          iconTheme: {
            primary: '#DC2626',
            secondary: '#fff',
          },
        },
      }} />
      
      <div className="min-h-screen auth-gradient-bg flex items-center justify-center p-6">
        <div className="w-full max-w-md bg-white rounded-card shadow-2xl p-12">
          {/* Logo */}
          <div className="text-center mb-10">
            <h1 className="font-display text-5xl mb-2">
              <span className="text-gray-900">Makan</span>
              <span className="text-primary">Tak</span>
            </h1>
            <p className="text-sm text-gray-600">Create a new password</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                New Password <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-field-minimal"
                autoFocus
              />
              <p className="text-gray-500 text-xs mt-1">
                Minimum 8 characters, 1 uppercase, 1 number
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Confirm Password <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="input-field-minimal"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary hover:bg-primary-dark text-white font-semibold py-3.5 px-8 rounded-pill transition-all duration-200 shadow-md hover:shadow-lg hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Updating Password...' : 'Reset Password'}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
