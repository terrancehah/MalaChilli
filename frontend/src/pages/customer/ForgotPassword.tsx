import { useState } from 'react';
import { Link } from 'react-router-dom';
import { resetPasswordForEmail } from '../../services/api';
import toast, { Toaster } from 'react-hot-toast';
import { SEO } from '../../components/shared';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim()) {
      toast.error('Please enter your email address');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error('Please enter a valid email address');
      return;
    }

    setLoading(true);

    try {
      await resetPasswordForEmail(email);
      setEmailSent(true);
      toast.success('Password reset email sent! Check your inbox.');
    } catch (err: any) {
      console.error('Password reset error:', err);
      toast.error(err.message || 'Failed to send reset email. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <SEO title="Forgot Password" description="Reset your MakanTak password." />
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
            <p className="text-sm text-gray-600">Reset your password</p>
          </div>

          {!emailSent ? (
            <>
              {/* Instructions */}
              <div className="mb-6 text-center">
                <p className="text-sm text-gray-600">
                  Enter your email address and we'll send you a link to reset your password.
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    placeholder="your.email@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="input-field-minimal"
                    autoFocus
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-primary hover:bg-primary-dark text-white font-semibold py-3.5 px-8 rounded-pill transition-all duration-200 shadow-md hover:shadow-lg hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Sending...' : 'Send Reset Link'}
                </button>
              </form>

              {/* Back to Login */}
              <p className="text-center text-sm text-gray-600 mt-6">
                Remember your password?{' '}
                <Link to="/login" className="text-primary hover:text-primary-dark font-medium underline">
                  Back to Login
                </Link>
              </p>
            </>
          ) : (
            <>
              {/* Success Message */}
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                
                <h2 className="text-xl font-bold text-gray-900">Check Your Email</h2>
                
                <p className="text-sm text-gray-600">
                  We've sent a password reset link to:
                </p>
                <p className="text-sm font-semibold text-gray-900">{email}</p>
                
                <p className="text-xs text-gray-500 mt-4">
                  The link will expire in 1 hour. If you don't see the email, check your spam folder.
                </p>

                <div className="pt-4">
                  <Link 
                    to="/login"
                    className="text-primary hover:text-primary-dark font-medium underline text-sm"
                  >
                    Back to Login
                  </Link>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
