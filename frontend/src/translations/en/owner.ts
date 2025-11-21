export const ownerDashboard = {
  title: 'Owner Dashboard',
  settings: 'Settings',
  
  // Tabs
  tabs: {
    viralPerformance: 'Viral Performance',
    businessMetrics: 'Business Metrics',
    customerInsights: 'Customer Insights',
  },
  
  // Management Panel
  management: {
    title: 'Management',
    manageStaff: 'Manage Staff',
    manageStaffDesc: 'Add, edit, and manage staff accounts',
    manageBranches: 'Manage Branches',
    manageBranchesDesc: 'Add and manage restaurant branches',
    restaurantSettings: 'Restaurant Settings',
    restaurantSettingsDesc: 'Update restaurant details and preferences',
  },
  
  // Viral Performance Tab
  viralPerformance: {
    viralityCoefficient: 'Virality Coefficient',
    viralityCoefficientInfo: 'Measures how effectively each customer brings in new customers. A coefficient > 1 means exponential growth. Formula: Total Downlines ÷ Total Sharers',
    
    networkSize: 'Network Size',
    networkSizeInfo: 'Total number of customers who joined through referrals across all levels of your referral network',
    totalDownlines: 'Total Downlines',
    
    networkDepth: 'Network Depth',
    networkDepthInfo: 'Distribution of customers across referral levels. Level 1 = direct referrals, Level 2 = referrals of referrals, Level 3 = third-level referrals',
    level1: 'Level 1',
    level2: 'Level 2',
    level3: 'Level 3',
    
    savedCodesPipeline: 'Saved Codes Pipeline',
    savedCodesPipelineInfo: 'Tracks how many customers saved your restaurant code but haven\'t visited yet. High conversion rate indicates effective marketing',
    totalSaved: 'Total Saved',
    unused: 'Unused',
    converted: 'Converted',
    conversionRate: 'Conversion Rate',
    avgTimeToFirstVisit: 'Avg time to first visit',
    days: 'days',
    
    topSharers: 'Top Sharers',
    topSharersInfo: 'Your most valuable brand ambassadors who actively refer new customers',
    downlines: 'downlines',
    earned: 'earned',
    noSharers: 'No active sharers yet',
    
    sharingActivity: 'Sharing Activity',
    sharingActivityInfo: 'Breakdown of your customer base by referral activity level',
    superSharers: 'Super Sharers',
    superSharersDesc: '10+ referrals',
    activeSharers: 'Active Sharers',
    activeSharersDesc: '3-9 referrals',
    passiveSharers: 'Passive Sharers',
    passiveSharersDesc: '1-2 referrals',
    nonSharers: 'Non-Sharers',
    nonSharersDesc: 'No referrals',
    
    // Subheadings/descriptions
    exponentialGrowth: 'Exponential growth!',
    steadyGrowth: 'Steady growth',
    belowViralThreshold: 'Below viral threshold',
    activeSharersCount: 'active sharers',
    awaitingVisit: 'Awaiting Visit',
    saved: 'Saved',
    pending: 'Pending',
    done: 'Done',
    avgTime: 'Avg time',
    comingSoon: '📊 More viral analytics coming soon: Network visualization, sharing behavior analysis, K-factor tracking',
  },
  
  // Business Metrics Tab
  businessMetrics: {
    totalRevenue: 'Total Revenue',
    totalRevenueInfo: 'Gross revenue before any discounts or deductions',
    
    netRevenue: 'Net Revenue',
    netRevenueInfo: 'Revenue after deducting all discounts (guaranteed discounts + virtual currency redemptions)',
    
    totalTransactions: 'Total Transactions',
    totalTransactionsInfo: 'Total number of completed transactions in the selected period',
    
    avgBillAmount: 'Avg Bill Amount',
    avgBillAmountInfo: 'Average transaction value per customer visit',
    
    totalDiscounts: 'Total Discounts',
    totalDiscountsInfo: 'Combined value of guaranteed discounts and virtual currency redemptions given to customers',
    
    discountPercentage: 'Discount %',
    discountPercentageInfo: 'Percentage of revenue given as discounts. Lower is better for margins, but discounts drive customer acquisition',
    
    revenueOverTime: 'Revenue Over Time',
    revenueOverTimeInfo: 'Daily revenue trends showing gross revenue, net revenue, and discount amounts',
    
    discountBreakdown: 'Discount Breakdown',
    discountBreakdownInfo: 'Split between guaranteed discounts (fixed) and virtual currency redemptions (earned rewards)',
    guaranteedDiscount: 'Guaranteed Discount',
    vcRedeemed: 'VC Redeemed',
    
    uplineRewards: 'Upline Rewards Distribution',
    uplineRewardsInfo: 'Virtual currency rewards paid to customers who referred new customers, broken down by referral level',
    totalPaid: 'Total Paid',
    avgReward: 'Avg',
    recipients: 'recipients',
    rewards: 'rewards',
    
    // Subheadings/descriptions
    last30Days: 'Last 30 days',
    last14Days: 'Last 14 days',
    last7Days: 'Last 7 days',
    ofGross: 'of gross',
    avg: 'Avg',
    revenueVsDiscount: 'Revenue vs Discount',
    firstTimeDiscount: 'First-time customer discount',
    virtualCurrencyRedeemed: 'Virtual currency redeemed',
    recentRevenueTrend: 'Recent Revenue Trend',
    days7: '7d',
    days14: '14d',
    days30: '30d',
    noRewardsYet: 'No upline rewards distributed yet.',
    comingSoon: '📈 More business analytics coming soon: Revenue charts, peak hours heatmap, branch comparison, staff performance',
  },
  
  // Customer Insights Tab
  customerInsights: {
    totalCustomers: 'Total Customers',
    totalCustomersInfo: 'Total unique customers who have visited your restaurant',
    
    activeCustomers: 'Active Customers',
    activeCustomersInfo: 'Customers who visited in the last 60 days (Recency Score ≥ 3)',
    
    atRiskCustomers: 'At Risk',
    atRiskCustomersInfo: 'Previously active customers who haven\'t visited recently. Need re-engagement campaigns',
    ofTotal: 'of total',
    
    avgLifetimeValue: 'Avg Lifetime Value',
    avgLifetimeValueInfo: 'Average total spending per customer across all their visits',
    
    rfmSegmentation: 'Customer Segmentation (RFM Analysis)',
    rfmSegmentationInfo: `RFM Analysis scores customers on three dimensions using percentile-based ranking (1-5 scale):

• Recency (R): How recently did they visit?
  - Score 5: Top 20% most recent visitors (e.g., within last 30 days)
  - Score 4: 20-40% percentile (e.g., 31-60 days ago)
  - Score 3: 40-60% percentile (e.g., 61-90 days ago)
  - Score 2: 60-80% percentile (e.g., 91-180 days ago)
  - Score 1: Bottom 20% least recent (e.g., >180 days ago)

• Frequency (F): How often do they visit relative to others?
  - Score 5: Top 20% most frequent visitors
  - Score 4: 20-40% percentile
  - Score 3: 40-60% percentile
  - Score 2: 60-80% percentile
  - Score 1: Bottom 20% least frequent
  Note: Scores are relative to your customer base, not absolute numbers

• Monetary (M): How much do they spend relative to others?
  - Score 5: Top 20% highest spenders
  - Score 4: 20-40% percentile
  - Score 3: 40-60% percentile
  - Score 2: 60-80% percentile
  - Score 1: Bottom 20% lowest spenders

Segment Definitions:
• Champions (R:5, F:4-5, M:4-5): Your best customers - recent, frequent, high spenders
• Loyal (R:3-5, F:3-5, M:3-5): Regular customers with consistent behavior
• Potential Loyalists (R:4-5, F:1-3, M:1-3): Recent customers showing promise
• New Customers (R:5, F:1, M:1-2): First-time visitors, need nurturing
• At Risk (R:2-3, F:2-5, M:2-5): Previously active but haven't visited recently
• Can't Lose Them (R:1-2, F:4-5, M:4-5): High-value customers at risk of churning
• Hibernating (R:1-2, F:1-2, M:1-2): Inactive low-value customers
• Promising (R:3-4, F:1, M:1): Recent first-timers with potential

Why Percentiles? This ensures fair comparison as your business grows. A customer with 5 visits might be "frequent" for a new restaurant but "infrequent" for an established one.`,
    rfmSegmentationSubtitle: 'Based on Recency, Frequency, and Monetary value',
    
    walkIns: 'Walk-ins',
    walkInsDesc: 'Direct customers',
    
    // Subheadings/descriptions
    active: 'active',
    acquisition: 'Acquisition',
    fromReferrals: 'From referrals',
    customers: 'customers',
    perCustomer: 'Per customer',
    customerAcquisitionSources: 'Customer Acquisition Sources',
    
    champions: 'Champions',
    championsDesc: 'Best customers',
    loyal: 'Loyal',
    loyalDesc: 'Regular visitors',
    potential: 'Rising Stars',
    potentialDesc: 'Growing loyalty',
    newCustomers: 'New',
    newCustomersDesc: 'First-timers',
    atRisk: 'At Risk',
    atRiskDesc: 'Need attention',
    cantLose: 'VIP Alert',
    cantLoseDesc: 'High value',
    hibernating: 'Dormant',
    hibernatingDesc: 'Inactive',
    promising: 'Explorers',
    promisingDesc: 'Testing waters',
    
    // RFM Segment Full Names
    segmentChampions: 'Champions',
    segmentChampionsInfo: 'Your VIP customers - visit frequently, recently, and spend the most (R:5, F:5, M:5)',
    segmentLoyal: 'Loyal Customers',
    segmentLoyalInfo: 'Reliable regulars who visit often and spend consistently (R:4-5, F:4-5, M:4-5)',
    segmentPotentialLoyalists: 'Rising Stars',
    segmentPotentialLoyalistsInfo: 'Recent repeat customers building loyalty - nurture them (R:4-5, F:2-3, M:2-3)',
    segmentNewCustomers: 'New Customers',
    segmentNewCustomersInfo: 'Brand new visitors making their first impression (R:5, F:1, M:1-2)',
    segmentPromising: 'Explorers',
    segmentPromisingInfo: 'Curious newcomers testing your restaurant - convert them (R:3-4, F:1, M:1)',
    segmentAtRisk: 'At Risk',
    segmentAtRiskInfo: 'Fading regulars who used to visit often but slipping away (R:2-3, F:2-5, M:2-5)',
    segmentCantLoseThem: 'VIP Alert',
    segmentCantLoseThemInfo: 'High-spending loyalists who stopped visiting - win them back! (R:1-2, F:4-5, M:4-5)',
    segmentHibernating: 'Dormant',
    segmentHibernatingInfo: 'Long-gone low-spenders - likely lost to competitors (R:1-2, F:1-2, M:1-2)',
    
    acquisitionSources: 'Customer Acquisition Sources',
    acquisitionSourcesInfo: 'How customers discovered your restaurant: through referrals or as walk-ins',
    referrals: 'Referrals',
    
    topCustomers: 'Top 10 Customers by Spend',
    topCustomersInfo: 'Your highest-value customers ranked by total lifetime spending',
    visits: 'visits',
    noCustomers: 'No customer data available yet.',
    
    atRiskList: 'At-Risk Customers (Need Re-engagement)',
    atRiskListInfo: 'Customers who were previously active but haven\'t returned recently. Consider sending special offers',
    lastVisit: 'Last visit',
    daysAgo: 'days ago',
    reengagementTip: '💡 Tip: Send these customers a special offer or bonus to re-engage them!',
    comingSoon: '👥 More customer insights coming soon: Cohort retention analysis, CLV predictions, churn forecasting, visit frequency patterns',
  },
};
