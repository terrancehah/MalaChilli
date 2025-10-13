import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { generateReferralCode, calculateAge } from '../lib/utils';

export default function RegisterPage() {
  const { restaurantSlug, referralCode } = useParams();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [birthday, setBirthday] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  
  // Referral code validation state
  const [validatingCode, setValidatingCode] = useState(false);
  const [codeValidation, setCodeValidation] = useState<{
    valid: boolean;
    restaurantId?: string;
    restaurantName?: string;
    uplineUserId?: string;
    uplineName?: string;
    error?: string;
  } | null>(null);
  
  const { signUp } = useAuth();

  // Validate referral code on mount
  useEffect(() => {
    const validateReferralCode = async () => {
      if (!restaurantSlug || !referralCode) return;
      
      setValidatingCode(true);
      try {
        // First, get restaurant by slug
        const { data: restaurant, error: restaurantError } = await supabase
          .from('restaurants')
          .select('id, name')
          .eq('slug', restaurantSlug)
          .single();
        
        if (restaurantError || !restaurant) {
          setCodeValidation({
            valid: false,
            error: 'Restaurant not found'
          });
          return;
        }
        
        // Validate referral code for this restaurant
        const { data: validation, error: validationError } = await supabase
          .rpc('validate_referral_code', {
            p_referral_code: referralCode,
            p_restaurant_id: restaurant.id
          });
        
        if (validationError) {
          console.error('Validation error:', validationError);
          setCodeValidation({
            valid: false,
            error: 'Failed to validate code'
          });
          return;
        }
        
        if (validation.valid) {
          setCodeValidation({
            valid: true,
            restaurantId: restaurant.id,
            restaurantName: restaurant.name,
            uplineUserId: validation.upline_user_id,
            uplineName: validation.upline_name
          });
        } else {
          setCodeValidation({
            valid: false,
            error: validation.error || 'Invalid referral code'
          });
        }
      } catch (err: any) {
        console.error('Error validating code:', err);
        setCodeValidation({
          valid: false,
          error: err.message || 'Failed to validate code'
        });
      } finally {
        setValidatingCode(false);
      }
    };
    
    validateReferralCode();
  }, [restaurantSlug, referralCode]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    if (!birthday) {
      setError('Please enter your birthday');
      return;
    }

    const age = calculateAge(birthday);
    if (age < 18) {
      setError('You must be at least 18 years old to register');
      return;
    }

    setLoading(true);

    try {
      const userReferralCode = generateReferralCode();
      const role = 'customer';
      
      const userData = await signUp(email, password, {
        full_name: fullName,
        birthday,
        age,
        referral_code: userReferralCode,
        role,
      });

      // If there's a valid referral code, save it
      if (codeValidation?.valid && codeValidation.restaurantId && codeValidation.uplineUserId) {
        try {
          const { error: saveError } = await supabase
            .from('saved_referral_codes')
            .insert({
              user_id: userData.id,
              restaurant_id: codeValidation.restaurantId,
              referral_code: referralCode,
              upline_user_id: codeValidation.uplineUserId,
              is_used: false
            });
          
          if (saveError) {
            console.error('Failed to save referral code:', saveError);
            // Don't fail signup if code save fails
          }
        } catch (codeError) {
          console.error('Error saving referral code:', codeError);
          // Don't fail signup if code save fails
        }
      }

      // Success! Show email confirmation message
      setEmailSent(true);
    } catch (err: any) {
      setError(err.message || 'Failed to create account');
    } finally {
      setLoading(false);
    }
  };

  // Show email confirmation message after successful signup
  if (emailSent) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-6 sm:space-y-8">
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 dark:bg-green-900/20 mb-4">
              <svg className="h-8 w-8 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white mb-4">
              Check your email!
            </h2>
            <p className="text-base text-gray-600 dark:text-gray-400 mb-2">
              We've sent a confirmation link to:
            </p>
            <p className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
              {email}
            </p>
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-md p-4 mb-6">
              <p className="text-sm text-blue-800 dark:text-blue-300">
                Click the link in the email to verify your account. Then you can sign in to access your dashboard.
              </p>
            </div>
            <Link
              to="/login"
              className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
              Go to Login
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-6 sm:space-y-8">
        <div>
          <h2 className="mt-6 text-center text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white">
            Create your account
          </h2>
          
          {/* Referral Code Validation Status */}
          {referralCode && (
            <div className="mt-4">
              {validatingCode ? (
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-md p-3">
                  <p className="text-sm text-blue-800 dark:text-blue-300 text-center">
                    🔍 Validating referral code...
                  </p>
                </div>
              ) : codeValidation?.valid ? (
                <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-md p-3">
                  <p className="text-sm text-green-800 dark:text-green-300 text-center font-medium">
                    ✅ Valid referral code for <strong>{codeValidation.restaurantName}</strong>
                  </p>
                  <p className="text-xs text-green-700 dark:text-green-400 text-center mt-1">
                    Referred by: {codeValidation.uplineName}
                  </p>
                </div>
              ) : codeValidation?.error ? (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-3">
                  <p className="text-sm text-red-800 dark:text-red-300 text-center font-medium">
                    ❌ {codeValidation.error}
                  </p>
                  <p className="text-xs text-red-700 dark:text-red-400 text-center mt-1">
                    You can still register, but the referral code won't be saved.
                  </p>
                </div>
              ) : null}
            </div>
          )}
          
          <p className="mt-4 text-center text-sm text-gray-600 dark:text-gray-400">
            Already have an account?{' '}
            <Link to="/login" className="font-medium text-primary dark:text-orange-400 hover:text-primary/90">
              Sign in
            </Link>
          </p>
        </div>

        <form className="mt-6 sm:mt-8 space-y-5 sm:space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Full Name
              </label>
              <input
                id="fullName"
                name="fullName"
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="appearance-none block w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 dark:placeholder-gray-500 text-gray-900 dark:text-white bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base touch-manipulation min-h-[44px]"
                placeholder="Your full name"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="appearance-none block w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 dark:placeholder-gray-500 text-gray-900 dark:text-white bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base touch-manipulation min-h-[44px]"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label htmlFor="birthday" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Birthday
              </label>
              <input
                id="birthday"
                name="birthday"
                type="date"
                required
                value={birthday}
                onChange={(e) => setBirthday(e.target.value)}
                max={new Date().toISOString().split('T')[0]}
                className="appearance-none block w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 dark:placeholder-gray-500 text-gray-900 dark:text-white bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base touch-manipulation min-h-[44px]"
              />
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">You must be 18 or older</p>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="appearance-none block w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 dark:placeholder-gray-500 text-gray-900 dark:text-white bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base touch-manipulation min-h-[44px]"
                placeholder="At least 6 characters"
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="appearance-none block w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 dark:placeholder-gray-500 text-gray-900 dark:text-white bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base touch-manipulation min-h-[44px]"
                placeholder="Confirm your password"
              />
            </div>

            {referralCode && (
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-md p-3">
                <p className="text-sm text-blue-800 dark:text-blue-300">
                  <strong>Referral Code:</strong> {referralCode}
                  <br />
                  <span className="text-xs text-blue-600 dark:text-blue-400">
                    You'll get 5% off your first visit!
                  </span>
                </p>
              </div>
            )}
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-base font-medium text-primary-foreground bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed touch-manipulation min-h-[44px]"
            >
              {loading ? 'Creating account...' : 'Create account'}
            </button>
          </div>

          <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
            By signing up, you agree to our{' '}
            <Link to="/terms" className="text-primary dark:text-orange-400 hover:text-primary/90 touch-manipulation">
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link to="/privacy" className="text-primary dark:text-orange-400 hover:text-primary/90 touch-manipulation">
              Privacy Policy
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
