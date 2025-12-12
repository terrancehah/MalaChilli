import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import toast from 'react-hot-toast';

interface LoginFormProps {
  onSuccess?: () => void;
  showSignUpLink?: boolean;
  onSwitchToSignUp?: () => void;
}

/**
 * Reusable login form component
 * Can be used in both modal and standalone page contexts
 */
export function LoginForm({ onSuccess, showSignUpLink = true, onSwitchToSignUp }: LoginFormProps) {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  
  const { signIn } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await signIn(formData.email, formData.password);
      toast.success('Welcome back!');
      
      // Navigate immediately to dashboard
      // The router will handle the redirection to /customer/dashboard or /staff/dashboard based on role
      navigate('/dashboard');

      // Call onSuccess callback if provided (for modal close)
      if (onSuccess) {
        onSuccess();
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to login. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <>
      {/* Login Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
            Email
          </label>
          <input
            type="email"
            name="email"
            placeholder="your.email@example.com"
            value={formData.email}
            onChange={handleChange}
            autoComplete="username"
            className="input-field-minimal"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
            Password
          </label>
          <input
            type="password"
            name="password"
            placeholder="••••••••"
            value={formData.password}
            onChange={handleChange}
            autoComplete="current-password"
            className="input-field-minimal"
            required
          />
          <div className="text-right mt-2">
            <Link
              to="/forgot-password"
              className="text-sm text-primary hover:text-primary-dark"
            >
              Forgot Password?
            </Link>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-white dark:bg-gray-700 border-2 border-primary text-primary hover:bg-primary/5 dark:hover:bg-gray-600 font-semibold py-3.5 px-8 rounded-pill transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>

      {/* Sign Up Section */}
      {showSignUpLink && (
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">Don't have an account?</p>
          {onSwitchToSignUp ? (
            <button
              onClick={onSwitchToSignUp}
              className="w-full bg-primary hover:bg-primary-dark text-white font-semibold py-3.5 px-8 rounded-pill transition-all duration-200 shadow-md hover:shadow-lg hover:-translate-y-0.5"
            >
              Sign Up
            </button>
          ) : (
            <Link to="/register">
              <button className="w-full bg-primary hover:bg-primary-dark text-white font-semibold py-3.5 px-8 rounded-pill transition-all duration-200 shadow-md hover:shadow-lg hover:-translate-y-0.5">
                Sign Up
              </button>
            </Link>
          )}
        </div>
      )}

      {/* Decorative Food Image Placeholder */}
      <div className="mt-8 text-center opacity-80">
        <p className="text-xs text-gray-500 dark:text-gray-400">🍛 Nasi Lemak • Satay • Teh Tarik 🍜</p>
      </div>
    </>
  );
}
