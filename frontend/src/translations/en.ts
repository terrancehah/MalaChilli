export const en = {
  // Common
  common: {
    loading: 'Loading...',
    save: 'Save',
    cancel: 'Cancel',
    close: 'Close',
    confirm: 'Confirm',
    delete: 'Delete',
    edit: 'Edit',
    back: 'Back',
    next: 'Next',
    submit: 'Submit',
    search: 'Search',
    filter: 'Filter',
    sort: 'Sort',
    more: 'More',
    less: 'Less',
    yes: 'Yes',
    no: 'No',
    ok: 'OK',
    error: 'Error',
    success: 'Success',
    warning: 'Warning',
    info: 'Info',
  },

  // Dashboard Header & Profile
  profile: {
    welcome: 'Welcome back',
    greeting: 'Hello',
    viewProfile: 'View Profile',
    settings: 'Settings',
    logout: 'Logout',
  },

  // Stats Card
  stats: {
    totalEarned: 'Total Earned',
    totalRedeemed: 'Total Redeemed',
    totalReferred: 'Total Referred',
    vcBalance: 'VC Balance',
    activeReferrals: 'Active Referrals',
    totalSpent: 'Total Spent',
  },

  // Dashboard - Recent Transactions
  recentTransactions: {
    title: 'Recent Transactions',
    noTransactions: 'No transactions yet. Start dining at our partner restaurants to earn rewards!',
    firstVisit: 'First Visit!',
    discount: 'discount',
    vcUsed: 'VC used',
    vcEarned: 'VC earned',
    unrealized: 'Unrealized',
  },

  // Dashboard - Restaurant Sorting
  restaurantSorting: {
    recent: 'Recent',
    balance: 'Balance',
    visits: 'Visits',
  },

  // Dashboard - Promote Restaurants
  promoteRestaurants: {
    title: 'Promote Restaurants',
    subtitle: 'Share codes for restaurants you\'ve visited',
    noRestaurants: 'No visited restaurants yet',
    noRestaurantsDesc: 'Visit a restaurant and make your first transaction to start promoting!',
  },

  // Restaurant Card
  restaurantCard: {
    share: 'Share Restaurant',
    vcBalance: 'VC Balance',
    totalSpent: 'Total Spent',
    visits: 'visits',
    visit: 'visit',
    active: 'Active',
  },

  // Share Bottom Sheet
  shareSheet: {
    title: 'Share',
    subtitle: 'Choose how you\'d like to share this restaurant',
    referralLink: 'Referral Link',
    copyLink: 'Copy Link',
    linkCopied: 'Link Copied!',
    shareViaSocial: 'Share via Social Media',
    whatsapp: 'WhatsApp',
    facebook: 'Facebook',
    more: 'More',
    promotionCode: 'Promotion Code',
    copyCode: 'Copy Code',
    codeCopied: 'Code Copied!',
    shareMessage: 'Hey! I love {restaurant}. Join me there and get a discount: {link}',
  },

  // Transaction Detail Sheet
  transactionDetail: {
    title: 'Transaction Details',
    transactionTime: 'Transaction Time',
    branch: 'Branch',
    billAmount: 'Bill Amount',
    
    // Realized VC Earnings
    vcEarnedTitle: 'VC Earned from Downlines',
    vcEarnedDesc: 'Your referrals spent at this restaurant and you earned 1% VC',
    
    // Unrealized Potential Earnings
    unrealizedTitle: 'Unrealized Potential Earnings',
    unrealizedDesc: 'If you had shared your code and friends spent the same amount:',
    level1Referral: 'Level 1 referral',
    level2Referral: 'Level 2 referral',
    level3Referral: 'Level 3 referral',
    totalReferrals: 'Total (3 referrals)',
    
    // Discounts Applied
    discountsTitle: 'Discounts Applied',
    guaranteedDiscount: 'Guaranteed Discount (5%)',
    vcRedeemed: 'VC Redeemed',
  },

  // Referral Info Modal
  referralInfo: {
    title: 'How Referral Levels Work',
    howItWorks: 'How It Works:',
    howItWorksDesc: 'Each transaction earns 1% VC per upline level (max 3 levels). Multiple people at each level can contribute to reach the full potential.',
    
    level1Title: 'Level 1 - Direct Referrals',
    level1Desc: 'People who use your code directly. Each person who spends contributes 1% of their bill to this level.',
    
    level2Title: 'Level 2 - Indirect Referrals',
    level2Desc: 'People referred by your Level 1 referrals. Each person who spends contributes 1% of their bill to this level.',
    
    level3Title: 'Level 3 - Extended Network',
    level3Desc: 'People referred by your Level 2 referrals. Each person who spends contributes 1% of their bill to this level.',
    
    upperLimit: 'Upper limit: 1% of your transaction amount',
    
    exampleTitle: 'Example (Your bill: RM 100):',
    maxPotential: 'Maximum potential per level:',
    level1Max: 'Level 1: Up to RM 1.00 (1% of RM 100)',
    level2Max: 'Level 2: Up to RM 1.00 (1% of RM 100)',
    level3Max: 'Level 3: Up to RM 1.00 (1% of RM 100)',
    totalPotential: 'Total Potential: RM 3.00',
    note: 'Note:',
    noteDesc: 'Multiple referrals at each level can contribute until the limit is reached. If one person doesn\'t spend enough, others can fill the gap.',
  },

  // Authentication
  auth: {
    // Login
    login: 'Login',
    loginTitle: 'Welcome Back',
    loginSubtitle: 'Sign in to your account',
    email: 'Email',
    password: 'Password',
    forgotPassword: 'Forgot Password?',
    noAccount: 'Don\'t have an account?',
    signUp: 'Sign Up',
    loginButton: 'Sign In',
    loggingIn: 'Signing in...',
    
    // Register
    register: 'Register',
    registerTitle: 'Create Account',
    registerSubtitle: 'Join MalaChilli today',
    fullName: 'Full Name',
    confirmPassword: 'Confirm Password',
    haveAccount: 'Already have an account?',
    signIn: 'Sign In',
    registerButton: 'Create Account',
    registering: 'Creating account...',
    agreeToTerms: 'By signing up, you agree to our',
    termsOfService: 'Terms of Service',
    and: 'and',
    privacyPolicy: 'Privacy Policy',
    
    // Forgot Password
    forgotPasswordTitle: 'Reset Password',
    forgotPasswordSubtitle: 'Enter your email to receive reset instructions',
    sendResetLink: 'Send Reset Link',
    sending: 'Sending...',
    backToLogin: 'Back to Login',
    resetEmailSent: 'Reset email sent! Check your inbox.',
    
    // Reset Password
    resetPasswordTitle: 'Set New Password',
    resetPasswordSubtitle: 'Enter your new password',
    newPassword: 'New Password',
    resetPasswordButton: 'Reset Password',
    resetting: 'Resetting...',
    passwordResetSuccess: 'Password reset successfully!',
    
    // Validation
    emailRequired: 'Email is required',
    passwordRequired: 'Password is required',
    nameRequired: 'Full name is required',
    passwordsNotMatch: 'Passwords do not match',
    invalidEmail: 'Invalid email address',
    passwordTooShort: 'Password must be at least 6 characters',
  },

  // Demo Dashboard
  demo: {
    title: 'Demo Dashboard',
    subtitle: 'Experience MalaChilli',
    description: 'This is a demo dashboard showing how the customer experience works.',
    tryItOut: 'Try It Out',
    features: 'Features',
    howItWorks: 'How It Works',
    getStarted: 'Get Started',
  },

  // QR Code Modal
  qrCode: {
    title: 'Your QR Code',
    subtitle: 'Show this to staff when making a transaction',
    close: 'Close',
    idLabel: 'ID:',
  },

  // Settings Panel
  settings: {
    title: 'Settings',
    profile: 'Profile',
    name: 'Name',
    email: 'Email',
    memberSince: 'Member Since',
    notSet: 'Not set',
    enterName: 'Enter your name',
    save: 'Save',
    saving: 'Saving...',
    cancel: 'Cancel',
    nameUpdated: 'Name updated successfully!',
    nameUpdateFailed: 'Failed to update name. Please try again.',
    nameEmpty: 'Name cannot be empty',
    
    preferences: 'Preferences',
    language: 'Language',
    notifications: 'Notifications',
    emailPreferences: 'Email preferences',
    comingSoon: 'Coming soon',
    
    about: 'About',
    privacyPolicy: 'Privacy Policy',
    termsOfService: 'Terms of Service',
    appVersion: 'App Version',
    
    logout: 'Logout',
  },
};
