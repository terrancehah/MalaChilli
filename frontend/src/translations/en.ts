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
    unrealized: 'Unrealized Earning',
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

  // Legal Pages - FAQ
  faq: {
    title: 'Frequently Asked Questions',
    subtitle: 'Find answers to common questions about MalaChilli',
    backToHome: 'Back to Home',
    stillHaveQuestions: 'Still have questions?',
    stillHaveQuestionsDesc: 'Can\'t find the answer you\'re looking for? Our support team is here to help!',
    contactSupport: 'Contact Support',
    
    q1: 'What is MalaChilli?',
    a1: 'MalaChilli is a viral referral discount platform that rewards you for sharing with friends. When you refer someone and they make a purchase, you earn virtual currency that can be used as discounts on your next visit!',
    
    q2: 'How do I earn virtual currency?',
    a2Title: 'You earn virtual currency in two ways:',
    a2Point1: 'Guaranteed 5% discount on your first purchase',
    a2Point2: '1% of every purchase made by people you refer (up to 3 levels deep)',
    a2Example: 'For example: If your friend spends RM100, you earn RM1. If their friend spends RM100, you also earn RM1!',
    
    q3: 'How do I share my referral code?',
    a3: 'Go to your dashboard and tap the \'Share\' button. You can share your unique QR code or link via WhatsApp, Facebook, or any messaging app. When someone signs up using your link, they become your downline!',
    
    q4: 'What\'s the maximum discount I can use?',
    a4: 'You can redeem up to 20% of your bill amount using virtual currency. For example, on a RM100 bill, you can use up to RM20 of your virtual currency balance.',
    
    q5: 'Does my virtual currency expire?',
    a5: 'Yes, virtual currency expires 30 days after you earn it. You\'ll receive an email notification 7 days before expiry to remind you to use it. Make sure to check your balance regularly!',
    
    q6: 'Can I combine discounts?',
    a6: 'Yes! Your first-time 5% guaranteed discount is automatically applied, and you can also redeem virtual currency (up to 20% of bill) on top of that.',
    
    q7: 'How many levels of referrals can I earn from?',
    a7: 'You earn from up to 3 levels of referrals. Level 1 is people you directly refer, Level 2 is people they refer, and Level 3 is people referred by Level 2. Each level earns you 1% of their purchases.',
    
    q8: 'How do I redeem my virtual currency?',
    a8: 'Simply show your QR code to the staff when paying. They\'ll scan it and you can choose how much virtual currency to redeem (up to 20% of your bill). The discount is applied immediately!',
    
    q9: 'Is my personal data safe?',
    a9: 'Yes! We comply with Malaysia\'s Personal Data Protection Act (PDPA) 2010. We only collect necessary information and never share your data with third parties without consent.',
    a9Link: 'Read our full Privacy Policy for details.',
    
    q10: 'Can I use my virtual currency at any restaurant?',
    a10: 'Currently, virtual currency is specific to the restaurant where you earned it. Each restaurant has its own referral program.',
    
    q11: 'What happens if I forget my password?',
    a11: 'Click \'Forgot Password\' on the login page. We\'ll send you a password reset link via email. Follow the link to create a new password.',
    
    q12: 'Can I change my birthday or email?',
    a12: 'For security reasons, birthday and email cannot be changed directly. Please contact our support team if you need to update these details.',
    
    q13: 'Why do I need to provide my birthday?',
    a13: 'We require your birthday to verify you\'re 18 or older (legal age requirement) and to send you special birthday offers!',
    
    q14: 'How do I delete my account?',
    a14: 'To delete your account and all associated data, please contact our support team at support@malachilli.com',
    a14Note: 'Note: Deleting your account will remove all your virtual currency balance and referral history.',
    
    q15: 'Can I transfer my virtual currency to someone else?',
    a15: 'No, virtual currency is non-transferable and can only be used by the account holder who earned it.',
    
    q16: 'What if the QR code scanner doesn\'t work?',
    a16: 'If the QR scanner has issues, staff can manually enter your referral code. Your code is displayed below your QR code on the dashboard.',
  },

  // Legal Pages - About Us
  about: {
    title: 'About MalaChilli',
    subtitle: 'Revolutionizing restaurant loyalty through viral referrals',
    backToHome: 'Back to Home',
    
    missionTitle: 'Our Mission',
    missionText: 'To empower restaurants and customers through a win-win referral system that rewards sharing, builds community, and makes dining out more affordable for everyone.',
    
    whatWeDoTitle: 'What We Do',
    whatWeDoPara1: 'MalaChilli is Malaysia\'s first viral referral discount platform designed specifically for restaurants. We help restaurants grow their customer base organically while rewarding loyal customers for spreading the word.',
    whatWeDoPara2: 'Unlike traditional loyalty programs that only reward individual purchases, MalaChilli creates a network effect where everyone benefits. When you share your referral code and your friends dine at the restaurant, you earn virtual currency. When their friends dine, you earn again - up to 3 levels deep!',
    
    coreValuesTitle: 'Our Core Values',
    transparencyTitle: 'Transparency',
    transparencyDesc: 'Clear rules, visible earnings, and honest communication. You always know exactly how much you\'ve earned and when it expires.',
    communityTitle: 'Community',
    communityDesc: 'Building connections through food. Every referral strengthens the community and helps local restaurants thrive.',
    growthTitle: 'Growth',
    growthDesc: 'Win-win for everyone. Restaurants gain customers organically, and customers save money while sharing great food experiences.',
    simplicityTitle: 'Simplicity',
    simplicityDesc: 'Easy to use for everyone. Share a code, earn rewards, redeem discounts. No complicated rules or hidden terms.',
    
    howItWorksTitle: 'How It Works',
    step1Title: 'Sign Up & Get Your Code',
    step1Desc: 'Create your free account and receive a unique referral code and QR code instantly.',
    step2Title: 'Share With Friends',
    step2Desc: 'Share your code via WhatsApp, Facebook, or any messaging app. Your friends get 5% off their first visit!',
    step3Title: 'Earn Automatically',
    step3Desc: 'When your referrals dine, you automatically earn 1% of their bill as virtual currency - up to 3 levels deep!',
    step4Title: 'Redeem & Save',
    step4Desc: 'Use your virtual currency to get up to 20% off your next meal. Show your QR code and save instantly!',
    
    forRestaurantsTitle: 'For Restaurant Owners',
    forRestaurantsPara: 'MalaChilli helps you acquire new customers at a fraction of traditional marketing costs. Instead of spending on ads, you reward customers who bring in their friends.',
    forRestaurantsPoint1: 'Organic growth through word-of-mouth marketing',
    forRestaurantsPoint2: 'Real-time analytics dashboard to track performance',
    forRestaurantsPoint3: 'Automated discount calculations and virtual currency management',
    forRestaurantsPoint4: 'Customer insights and segmentation tools',
    partnerWithUs: 'Partner With Us',
    
    questionsTitle: 'Questions or Feedback?',
    questionsDesc: 'We\'d love to hear from you! Whether you\'re a customer or restaurant owner, get in touch.',
    viewFAQ: 'View FAQ',
    contactUs: 'Contact Us',
  },

  // Legal Pages - Contact
  contact: {
    title: 'Contact Us',
    subtitle: 'We\'re here to help! Reach out with any questions or feedback.',
    backToHome: 'Back to Home',
    
    emailSupportTitle: 'Email Support',
    emailSupportDesc: 'For general inquiries and support',
    emailSupportAddress: 'support@malachilli.com',
    
    businessInquiriesTitle: 'Business Inquiries',
    businessInquiriesDesc: 'Restaurant partnerships and collaborations',
    businessInquiriesAddress: 'business@malachilli.com',
    
    phoneSupportTitle: 'Phone Support',
    phoneSupportDesc: 'Mon-Fri, 9AM-6PM (GMT+8)',
    phoneSupportNumber: '+60 12-345 6789',
    
    officeLocationTitle: 'Office Location',
    officeLocationAddress: 'Kuala Lumpur, Malaysia',
    
    sendMessageTitle: 'Send Us a Message',
    nameLabel: 'Your Name',
    namePlaceholder: 'John Doe',
    emailLabel: 'Email Address',
    emailPlaceholder: 'john@example.com',
    subjectLabel: 'Subject',
    subjectPlaceholder: 'Select a subject',
    subjectGeneral: 'General Inquiry',
    subjectSupport: 'Technical Support',
    subjectAccount: 'Account Issues',
    subjectPartnership: 'Restaurant Partnership',
    subjectFeedback: 'Feedback',
    subjectOther: 'Other',
    messageLabel: 'Message',
    messagePlaceholder: 'Tell us how we can help...',
    sendButton: 'Send Message',
    sending: 'Sending...',
    
    noteTitle: 'Note:',
    noteText: 'We typically respond within 24-48 hours during business days. For urgent matters, please call our support line.',
    
    quickLinksTitle: 'Before contacting us, you might find answers here:',
    faqTitle: 'FAQ',
    faqDesc: 'Common questions',
    aboutTitle: 'About Us',
    aboutDesc: 'Learn more about MalaChilli',
    privacyTitle: 'Privacy Policy',
    privacyDesc: 'How we protect your data',
    
    messageSent: 'Message sent successfully! We\'ll get back to you soon.',
    messageFailed: 'Failed to send message. Please try again or email us directly.',
    fillAllFields: 'Please fill in all fields',
  },
};
