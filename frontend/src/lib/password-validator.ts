/**
 * Password validation utility.
 * Standardized password requirements across all auth forms.
 */

export interface PasswordValidationResult {
  isValid: boolean;
  errors: string[];
  strength: 'weak' | 'medium' | 'strong';
}

/**
 * Password requirements:
 * - Minimum 8 characters
 * - At least 1 uppercase letter
 * - At least 1 number
 */
export function validatePassword(password: string): PasswordValidationResult {
  const errors: string[] = [];

  // Check minimum length
  if (password.length < 8) {
    errors.push('Password must be at least 8 characters');
  }

  // Check for uppercase letter
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }

  // Check for number
  if (!/[0-9]/.test(password)) {
    errors.push('Password must contain at least one number');
  }

  // Calculate strength
  let strength: 'weak' | 'medium' | 'strong' = 'weak';
  if (errors.length === 0) {
    // All requirements met, check for additional strength factors
    const hasLowercase = /[a-z]/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    const isLong = password.length >= 12;

    const strengthScore = [hasLowercase, hasSpecialChar, isLong].filter(Boolean).length;

    if (strengthScore >= 2) {
      strength = 'strong';
    } else if (strengthScore >= 1) {
      strength = 'medium';
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
    strength,
  };
}

/**
 * Get a single error message for display (first error).
 */
export function getPasswordError(password: string): string {
  const result = validatePassword(password);
  return result.errors[0] || '';
}

/**
 * Get password requirements as a formatted string for display.
 */
export function getPasswordRequirements(): string {
  return 'Minimum 8 characters, 1 uppercase letter, 1 number';
}
