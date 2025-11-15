/**
 * API service layer barrel export.
 * Centralizes all Supabase data access operations.
 * 
 * Usage:
 * ```typescript
 * import { signInUser, fetchCustomerTransactions } from '@/services/api';
 * 
 * const user = await signInUser(email, password);
 * const transactions = await fetchCustomerTransactions(user.id);
 * ```
 * 
 * Benefits:
 * - Single source of truth for data access
 * - Consistent error handling
 * - Easier testing via mocking
 * - Type-safe API calls
 * - Preparation for generated Supabase types
 */

// Authentication operations
export {
  signUpUser,
  signInUser,
  signOutUser,
  resetPasswordForEmail,
  getCurrentSession,
  fetchUserProfile,
  updateUserProfile,
} from './auth';

// Customer operations
export {
  fetchVisitedRestaurants,
  fetchWalletBalancesByRestaurant,
  fetchWalletBalance,
  fetchCustomerReferralCodes,
  fetchReferralCount,
  fetchCustomerById,
  checkFirstVisit,
  validateReferralCode,
  saveReferralCode,
} from './customers';

// Transaction operations
export {
  fetchCustomerTransactions,
  fetchBranchTransactions,
  fetchVCEarnedFromTransaction,
  createTransaction,
} from './transactions';
