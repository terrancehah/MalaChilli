export const dashboardInfo = {
  restaurantInfo: {
    title: 'How It Works',
    item1: 'Visit a restaurant and make a transaction to unlock promotion for that restaurant',
    item2: 'Your unique referral code is automatically created when you make your first visit',
    item3: 'Share your referral link with friends via WhatsApp, Facebook, or copy the link',
    item4: 'When someone uses your link and makes their first transaction at that restaurant, you both earn virtual currency',
  },
  currencyInfo: {
    title: 'Restaurant-Specific Virtual Currency',
    item1: '<strong>Restaurant-Specific:</strong> Each restaurant has its own separate virtual currency balance',
    item2: 'Earn virtual currency by referring friends to specific restaurants',
    item3: 'Currency earned from one restaurant can only be redeemed at that same restaurant',
    item4: 'This ensures fair distribution and prevents exploitation across different restaurants',
    item5: '<strong>Earned:</strong> Total virtual currency you\'ve earned from referrals at this restaurant',
    item6: '<strong>Redeemed:</strong> Total amount you\'ve used for discounts at this restaurant',
  },
};

export const profile = {
  welcome: 'Welcome back',
  greeting: 'Hello',
  viewProfile: 'View Profile',
  settings: 'Settings',
  logout: 'Sign out',
};

export const stats = {
  totalEarned: 'Total Earned',
  totalRedeemed: 'Total Redeemed',
  totalReferred: 'Total Referred',
  vcBalance: 'VC Balance',
  activeReferrals: 'Active Referrals',
  totalSpent: 'Total Spent',
};

export const recentTransactions = {
  title: 'Recent Transactions',
  noTransactions: 'No transactions yet',
  firstVisit: 'First Visit!',
  discount: 'Discount',
  vcUsed: 'VC Used',
  vcEarned: 'VC Earned',
  unrealized: 'Unrealized Earnings',
  unrealizedDesc: 'Share your code to unlock this potential earning',
  viewDetails: 'View Full Details',
  tapToView: 'Tap to view details',
};

export const restaurantSorting = {
  recent: 'Recent',
  balance: 'Balance',
  visits: 'Visits',
};

export const promoteRestaurants = {
  title: 'Promote Restaurants',
  subtitle: 'Share codes for restaurants you\'ve visited',
  noRestaurants: 'No visited restaurants yet',
  noRestaurantsDesc: 'Visit a restaurant and make your first transaction to start promoting!',
};

export const restaurantCard = {
  share: 'Share Restaurant',
  vcBalance: 'VC Balance',
  totalSpent: 'Total Spent',
  visits: 'visits',
  visit: 'visit',
  active: 'Active',
  earnUpTo: 'Earn up to',
  unrealized: 'unrealized',
  recentActivity: 'Recent Activity',
};

export const shareSheet = {
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
};

export const transactionDetail = {
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
};

export const referralInfo = {
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
};

export const demo = {
  title: 'Demo Dashboard',
  subtitle: 'Experience MakanTak',
  description: 'This is a demo dashboard showing how the customer experience works.',
  tryItOut: 'Try It Out',
  features: 'Features',
  howItWorks: 'How It Works',
  getStarted: 'Get Started',
};

export const qrCode = {
  title: 'Your QR Code',
  subtitle: 'Show this to staff when making a transaction',
  close: 'Close',
  idLabel: 'ID:',
};

export const settings = {
  title: 'Settings',
  profile: 'Profile',
  name: 'Name',
  email: 'Email',
  restaurant: 'Restaurant',
  memberSince: 'Member Since',
  notSet: 'Not set',
  enterName: 'Enter your name',
  save: 'Save',
  saving: 'Saving...',
  cancel: 'Cancel',
  nameUpdated: 'Name updated successfully!',
  nameEmpty: 'Name cannot be empty',
  nameUpdateFailed: 'Failed to update name',
  deleteAccount: 'Delete Account',
  deleteConfirmTitle: 'Delete Account?',
  deleteConfirmDesc: 'This action cannot be undone. You\'ll lose all earned VC and referral history.',
  confirmDelete: 'Yes, Delete My Account',
  deleteFailed: 'Failed to delete account. Please try again.',
  preferences: 'Preferences',
  language: 'Language',
  notifications: 'Notifications',
  emailPreferences: 'Email preferences',
  comingSoon: 'Coming soon',
  about: 'About',
  privacyPolicy: 'Privacy Policy',
  termsOfService: 'Terms of Service',
  appVersion: 'App Version',
  logout: 'Sign Out',
};
