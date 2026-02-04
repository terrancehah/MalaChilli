import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { showSuccessToast, showErrorToast } from '../ui/toast';
import { checkRateLimit, recordAttempt, clearRateLimit, getRemainingAttempts } from '../../lib/rate-limiter';

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
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  
  const { signIn } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Check rate limit before attempting login
    const rateLimitError = checkRateLimit('login');
    if (rateLimitError) {
      showErrorToast(rateLimitError);
      return;
    }

    setLoading(true);

    try {
      await signIn(formData.email, formData.password);
      // Clear rate limit on successful login
      clearRateLimit('login');
      showSuccessToast('Welcome back!');
      
      // Navigate immediately to dashboard
      // The router will handle the redirection to /customer/dashboard or /staff/dashboard based on role
      navigate('/dashboard');

      // Call onSuccess callback if provided (for modal close)
      if (onSuccess) {
        onSuccess();
      }
    } catch (err: any) {
      // Record failed attempt for rate limiting
      recordAttempt('login');
      const remaining = getRemainingAttempts('login');
      const baseError = err.message || 'Failed to login. Please check your credentials.';
      // Show remaining attempts warning if getting close to limit
      if (remaining <= 2 && remaining > 0) {
        showErrorToast(`${baseError} ${remaining} attempt${remaining !== 1 ? 's' : ''} remaining.`);
      } else {
        showErrorToast(baseError);
      }
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
            className="w-full"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
            Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              autoComplete="current-password"
              className="w-full pr-10"
              required
            />
            {/* Show/Hide password toggle button */}
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              )}
            </button>
          </div>
          <div className="flex items-center justify-between mt-3">
            {/* Remember me checkbox */}
            <div className="flex items-center">
              <input
                id="rememberMe"
                name="rememberMe"
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="h-4 w-4 text-primary border-gray-300 dark:border-gray-600 rounded focus:ring-primary"
              />
              <label
                htmlFor="rememberMe"
                className="ml-2 block text-sm text-gray-600 dark:text-gray-400"
              >
                Remember me
              </label>
            </div>
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

      {/* Tagline */}
      <div className="mt-8 text-center opacity-80">
        <p className="text-xs text-gray-500 dark:text-gray-400 italic">"Share the savings, grow the community"</p>
      </div>
    </>
  );
}
