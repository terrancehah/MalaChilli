import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { supabase } from "../lib/supabase";
import { generateReferralCode, calculateAge } from "../lib/utils";
import { checkRateLimit, recordAttempt, clearRateLimit, getRemainingAttempts } from "../lib/rate-limiter";
import { validatePassword, getPasswordRequirements } from "../lib/password-validator";

export default function RegisterPage() {
  const { restaurantSlug, referralCode } = useParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [fullName, setFullName] = useState("");
  const [birthday, setBirthday] = useState("");
  const [error, setError] = useState("");
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
          .from("restaurants")
          .select("id, name")
          .eq("slug", restaurantSlug)
          .single();

        if (restaurantError || !restaurant) {
          setCodeValidation({
            valid: false,
            error: "Restaurant not found",
          });
          return;
        }

        // Validate referral code for this restaurant
        const { data: validation, error: validationError } = await supabase.rpc(
          "validate_referral_code",
          {
            p_referral_code: referralCode,
            p_restaurant_id: restaurant.id,
          }
        );

        if (validationError) {
          console.error("Validation error:", validationError);
          setCodeValidation({
            valid: false,
            error: "Failed to validate code",
          });
          return;
        }

        if (validation.valid) {
          setCodeValidation({
            valid: true,
            restaurantId: restaurant.id,
            restaurantName: restaurant.name,
            uplineUserId: validation.upline_user_id,
            uplineName: validation.upline_name,
          });
        } else {
          setCodeValidation({
            valid: false,
            error: validation.error || "Invalid referral code",
          });
        }
      } catch (err: any) {
        console.error("Error validating code:", err);
        setCodeValidation({
          valid: false,
          error: err.message || "Failed to validate code",
        });
      } finally {
        setValidatingCode(false);
      }
    };

    validateReferralCode();
  }, [restaurantSlug, referralCode]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Check rate limit before attempting signup
    const rateLimitError = checkRateLimit('signup');
    if (rateLimitError) {
      setError(rateLimitError);
      return;
    }

    // Validate password with standardized requirements
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
      setError(passwordValidation.errors[0]);
      return;
    }

    // Check passwords match
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (!birthday) {
      setError("Please enter your birthday");
      return;
    }

    const age = calculateAge(birthday);
    if (age < 18) {
      setError("You must be at least 18 years old to register");
      return;
    }

    setLoading(true);

    try {
      const userReferralCode = generateReferralCode();
      const role = "customer";

      const userData = await signUp(email, password, {
        full_name: fullName,
        birthday,
        referral_code: userReferralCode,
        role,
      });

      // If there's a valid referral code, save it
      if (
        codeValidation?.valid &&
        codeValidation.restaurantId &&
        codeValidation.uplineUserId
      ) {
        try {
          const { error: saveError } = await supabase
            .from("saved_referral_codes")
            .insert({
              user_id: userData.id,
              restaurant_id: codeValidation.restaurantId,
              referral_code: referralCode,
              upline_user_id: codeValidation.uplineUserId,
              is_used: false,
            });

          if (saveError) {
            console.error("Failed to save referral code:", saveError);
            // Don't fail signup if code save fails
          }
        } catch (codeError) {
          console.error("Error saving referral code:", codeError);
          // Don't fail signup if code save fails
        }
      }

      // Clear rate limit on successful signup
      clearRateLimit('signup');
      // Success! Show email confirmation message
      setEmailSent(true);
    } catch (err: any) {
      // Record failed attempt for rate limiting
      recordAttempt('signup');
      const remaining = getRemainingAttempts('signup');
      const baseError = err.message || "Failed to create account";
      if (remaining <= 1 && remaining > 0) {
        setError(`${baseError}. ${remaining} attempt remaining.`);
      } else {
        setError(baseError);
      }
    } finally {
      setLoading(false);
    }
  };

  // Show email confirmation message after successful signup
  if (emailSent) {
    return (
      <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden bg-gray-50 dark:bg-gray-900">
        <div className="max-w-md w-full glass-modal dark:bg-gray-800 dark:border-gray-700 p-8 text-center relative z-10">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 dark:bg-green-900/30 mb-4">
            <svg
              className="h-8 w-8 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h2 className="text-3xl font-display font-bold text-gray-900 dark:text-white mb-4">
            Check your email!
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-2">
            We've sent a confirmation link to:
          </p>
          <p className="text-lg font-semibold text-primary mb-6">{email}</p>
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6">
            <p className="text-sm text-blue-800 dark:text-blue-300">
              Click the link in the email to verify your account. Then you can
              sign in to access your dashboard.
            </p>
          </div>
          <Link to="/login" className="w-full btn-primary flex justify-center">
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden bg-gray-50 dark:bg-gray-900">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] rounded-full bg-primary/10 dark:bg-primary/5 blur-3xl"></div>
        <div className="absolute top-[10%] left-[10%] w-[20%] h-[20%] rounded-full bg-accent/10 dark:bg-accent/5 blur-3xl"></div>
      </div>

      <div className="max-w-md w-full space-y-8 glass-modal dark:bg-gray-800 dark:border-gray-700 p-8 sm:p-10 relative z-10">
        <div className="text-center">
          {/* Logo */}
          <img src="/logo.png" alt="MakanTak logo" className="h-20 w-20 mx-auto mb-4" />
          <h2 className="text-3xl font-display font-bold text-primary-dark dark:text-primary-light">
            Create Account
          </h2>

          {/* Referral Code Validation Status */}
          {referralCode && (
            <div className="mt-4">
              {validatingCode ? (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 animate-pulse">
                  <p className="text-sm text-blue-800 text-center">
                    🔍 Validating referral code...
                  </p>
                </div>
              ) : codeValidation?.valid ? (
                <div className="bg-green-50 border border-green-200 rounded-lg p-3 transform transition-all duration-500 hover:scale-105">
                  <p className="text-sm text-green-800 text-center font-medium flex items-center justify-center gap-2">
                    <span className="text-lg">🎉</span>
                    <span>
                      5% OFF at <strong>{codeValidation.restaurantName}</strong>
                    </span>
                  </p>
                  <p className="text-xs text-green-700 text-center mt-1">
                    Referred by: {codeValidation.uplineName}
                  </p>
                </div>
              ) : codeValidation?.error ? (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <p className="text-sm text-red-800 text-center font-medium">
                    ❌ {codeValidation.error}
                  </p>
                  <p className="text-xs text-red-700 text-center mt-1">
                    You can still register, but the referral code won't be
                    saved.
                  </p>
                </div>
              ) : null}
            </div>
          )}

          <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-semibold text-primary hover:text-primary-dark transition-colors"
            >
              Sign in
            </Link>
          </p>
        </div>

        <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg text-sm flex items-center">
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label
                htmlFor="fullName"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 ml-1"
              >
                Full Name
              </label>
              <input
                id="fullName"
                name="fullName"
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="glass-input w-full"
                placeholder="Your full name"
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 ml-1"
              >
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
                className="glass-input w-full"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label
                htmlFor="birthday"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 ml-1"
              >
                Birthday
              </label>
              <input
                id="birthday"
                name="birthday"
                type="date"
                required
                value={birthday}
                onChange={(e) => setBirthday(e.target.value)}
                max={new Date().toISOString().split("T")[0]}
                className="glass-input w-full"
              />
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400 ml-1">
                You must be 18 or older
              </p>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 ml-1"
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="glass-input w-full pr-10"
                  placeholder={getPasswordRequirements()}
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
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 ml-1"
              >
                Confirm Password
              </label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  autoComplete="new-password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="glass-input w-full pr-10"
                  placeholder="Confirm your password"
                />
                {/* Show/Hide confirm password toggle button */}
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
                  aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                >
                  {showConfirmPassword ? (
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
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary flex justify-center items-center"
            >
              {loading ? (
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              ) : null}
              {loading ? "Creating account..." : "Create Account"}
            </button>
          </div>

          <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
            By signing up, you agree to our{" "}
            <Link to="/terms" className="text-primary hover:underline">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link to="/privacy" className="text-primary hover:underline">
              Privacy Policy
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
