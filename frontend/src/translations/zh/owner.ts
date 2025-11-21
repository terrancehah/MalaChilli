export const ownerDashboard = {
  title: '业主仪表板',
  settings: '设置',
  
  // 标签页
  tabs: {
    viralPerformance: '推荐传播',
    businessMetrics: '业务指标',
    customerInsights: '客户洞察',
  },
  
  // 管理面板
  management: {
    title: '管理',
    manageStaff: '员工管理',
    manageStaffDesc: '添加、编辑和管理员工账户',
    manageBranches: '分店管理',
    manageBranchesDesc: '添加和管理餐厅分店',
    restaurantSettings: '餐厅设置',
    restaurantSettingsDesc: '更新餐厅详情和偏好设置',
  },
  
  // 推荐传播标签页
  viralPerformance: {
    viralityCoefficient: '传播系数',
    viralityCoefficientInfo: '衡量每位顾客带来新顾客的效率。系数 > 1 代表呈指数增长。计算公式：推荐总人数 ÷ 推荐者人数',
    
    networkSize: '推荐网络规模',
    networkSizeInfo: '通过推荐加入的顾客总数，包含所有推荐层级',
    totalDownlines: '推荐总人数',
    
    networkDepth: '推荐层级分布',
    networkDepthInfo: '顾客在各推荐层级的分布情况。L1 = 直接推荐，L2 = 二级推荐，L3 = 三级推荐',
    level1: 'L1',
    level2: 'L2',
    level3: 'L3',
    
    savedCodesPipeline: '保存码转化漏斗',
    savedCodesPipelineInfo: '追踪保存了餐厅码但尚未到店的潜在顾客。转化率高说明营销效果好',
    totalSaved: '保存总数',
    unused: '未使用',
    converted: '已转化',
    conversionRate: '转化率',
    avgTimeToFirstVisit: '平均首次到店时间',
    days: '天',
    
    topSharers: '推荐达人榜',
    topSharersInfo: '积极推荐新顾客的品牌传播者',
    downlines: '推荐人数',
    earned: '已赚取',
    noSharers: '暂无推荐记录',
    
    sharingActivity: '推荐活跃度',
    sharingActivityInfo: '按推荐活跃程度划分的顾客分布',
    superSharers: '超级推荐者',
    superSharersDesc: '10人以上',
    activeSharers: '活跃推荐者',
    activeSharersDesc: '3-9人',
    passiveSharers: '普通推荐者',
    passiveSharersDesc: '1-2人',
    nonSharers: '未推荐',
    nonSharersDesc: '0人',
    
    // Subheadings/descriptions
    exponentialGrowth: '爆发式增长！',
    steadyGrowth: '稳步增长',
    belowViralThreshold: '增长较慢',
    activeSharersCount: '位推荐者',
    awaitingVisit: '待到店',
    saved: '已保存',
    pending: '待处理',
    done: '已完成',
    avgTime: '平均时长',
    comingSoon: '📊 更多传播分析即将推出：网络可视化、分享行为分析、K因子追踪',
  },
  
  // 业务指标标签页
  businessMetrics: {
    totalRevenue: '总收入',
    totalRevenueInfo: '扣除折扣前的营业总额',
    
    netRevenue: '净收入',
    netRevenueInfo: '扣除所有折扣后的实际收入（含保证折扣及虚拟货币兑换）',
    
    totalTransactions: '交易笔数',
    totalTransactionsInfo: '所选时段内完成的交易总笔数',
    
    avgBillAmount: '平均客单价',
    avgBillAmountInfo: '每位顾客单次消费的平均金额',
    
    totalDiscounts: '折扣总额',
    totalDiscountsInfo: '发放给顾客的保证折扣及虚拟货币兑换总金额',
    
    discountPercentage: '折扣率',
    discountPercentageInfo: '折扣占营业额的百分比。折扣率越低利润越高，但适度折扣有助于吸引顾客',
    
    revenueOverTime: '营收趋势',
    revenueOverTimeInfo: '每日营收变化趋势，包含总收入、净收入及折扣金额',
    
    discountBreakdown: '折扣构成',
    discountBreakdownInfo: '保证折扣（固定优惠）与虚拟货币兑换（累积奖励）的分布情况',
    guaranteedDiscount: '保证折扣',
    vcRedeemed: '虚拟货币兑换',
    
    uplineRewards: '推荐奖励分布',
    uplineRewardsInfo: '发放给推荐新客户的虚拟货币奖励，按推荐层级统计',
    totalPaid: '总发放金额',
    avgReward: '平均',
    recipients: '人',
    rewards: '笔',
    
    // Subheadings/descriptions
    last30Days: '最近30天',
    last14Days: '最近14天',
    last7Days: '最近7天',
    ofGross: '占总收入',
    avg: '平均',
    revenueVsDiscount: '收入 vs 折扣',
    firstTimeDiscount: '首次消费折扣',
    virtualCurrencyRedeemed: '虚拟货币兑换',
    recentRevenueTrend: '近期营收趋势',
    days7: '7天',
    days14: '14天',
    days30: '30天',
    noRewardsYet: '暂无推荐奖励发放记录。',
    comingSoon: '📈 更多业务分析即将推出：营收图表、高峰时段热图、分店对比、员工表现',
  },
  
  // 客户洞察标签页
  customerInsights: {
    totalCustomers: '总客户数',
    totalCustomersInfo: '访问过您餐厅的唯一客户总数',
    
    activeCustomers: '活跃客户',
    activeCustomersInfo: '在过去60天内访问的客户（最近度评分 ≥ 3）',
    
    atRiskCustomers: '风险客户',
    atRiskCustomersInfo: '以前活跃但最近没有访问的客户。需要重新参与活动',
    ofTotal: '占总数的',
    
    avgLifetimeValue: '平均终身价值',
    avgLifetimeValueInfo: '每位客户在所有访问中的平均总消费',
    
    rfmSegmentation: '客户细分（RFM分析）',
    rfmSegmentationInfo: `RFM分析使用基于百分位的排名在三个维度上对客户评分（1-5分制）：

• 最近度 (R)：他们最近访问是什么时候？
  - 评分 5：前20%最近访客（例如：最近30天内）
  - 评分 4：20-40%百分位（例如：31-60天前）
  - 评分 3：40-60%百分位（例如：61-90天前）
  - 评分 2：60-80%百分位（例如：91-180天前）
  - 评分 1：后20%最久未访问（例如：>180天前）

• 频率 (F)：相对于其他客户，他们访问的频率如何？
  - 评分 5：前20%最频繁访客
  - 评分 4：20-40%百分位
  - 评分 3：40-60%百分位
  - 评分 2：60-80%百分位
  - 评分 1：后20%最不频繁
  注意：评分是相对于您的客户群，而非绝对数字

• 货币价值 (M)：相对于其他客户，他们消费多少？
  - 评分 5：前20%最高消费者
  - 评分 4：20-40%百分位
  - 评分 3：40-60%百分位
  - 评分 2：60-80%百分位
  - 评分 1：后20%最低消费者

细分定义：
• 冠军 (R:5, F:4-5, M:4-5)：您最好的客户 - 最近、频繁、高消费
• 忠诚 (R:3-5, F:3-5, M:3-5)：行为一致的常客
• 潜力 (R:4-5, F:1-3, M:1-3)：最近的客户显示潜力
• 新客户 (R:5, F:1, M:1-2)：首次访客，需要培养
• 风险 (R:2-3, F:2-5, M:2-5)：以前活跃但最近没有访问
• 不能失去 (R:1-2, F:4-5, M:4-5)：有流失风险的高价值客户
• 休眠 (R:1-2, F:1-2, M:1-2)：不活跃的低价值客户
• 有前途 (R:3-4, F:1, M:1)：最近的首次访客有潜力

为什么使用百分位？这确保随着业务增长进行公平比较。访问5次的客户对于新餐厅可能是"频繁"的，但对于成熟餐厅则是"不频繁"的。`,
    rfmSegmentationSubtitle: '基于最近度、频率和货币价值',
    
    walkIns: '到店',
    walkInsDesc: '直接顾客',
    
    // Subheadings/descriptions
    active: '活跃',
    acquisition: '获客渠道',
    fromReferrals: '来自推荐',
    customers: '位顾客',
    perCustomer: '每位顾客',
    customerAcquisitionSources: '顾客来源渠道',
    
    champions: '顶级',
    championsDesc: '最优质客户',
    loyal: '忠诚',
    loyalDesc: '常客',
    potential: '成长之星',
    potentialDesc: '忠诚度增长',
    newCustomers: '新客户',
    newCustomersDesc: '首次访客',
    atRisk: '风险',
    atRiskDesc: '需要关注',
    cantLose: 'VIP警报',
    cantLoseDesc: '高价值',
    hibernating: '沉睡',
    hibernatingDesc: '不活跃',
    promising: '探索者',
    promisingDesc: '尝试中',
    
    // RFM Segment Full Names
    segmentChampions: '顶级客户',
    segmentChampionsInfo: 'VIP客户 - 最近常光顾且消费最高 (R:5, F:5, M:5)',
    segmentLoyal: '忠诚客户',
    segmentLoyalInfo: '可靠的常客，经常光顾且消费稳定 (R:4-5, F:4-5, M:4-5)',
    segmentPotentialLoyalists: '成长之星',
    segmentPotentialLoyalistsInfo: '最近的回头客，忠诚度正在增长 - 需要培养 (R:4-5, F:2-3, M:2-3)',
    segmentNewCustomers: '新客户',
    segmentNewCustomersInfo: '全新访客，留下第一印象 (R:5, F:1, M:1-2)',
    segmentPromising: '探索者',
    segmentPromisingInfo: '好奇的新客，正在尝试您的餐厅 - 转化他们 (R:3-4, F:1, M:1)',
    segmentAtRisk: '流失风险',
    segmentAtRiskInfo: '曾经的常客，但正在流失 (R:2-3, F:2-5, M:2-5)',
    segmentCantLoseThem: 'VIP警报',
    segmentCantLoseThemInfo: '高消费忠客停止光顾 - 赢回他们！ (R:1-2, F:4-5, M:4-5)',
    segmentHibernating: '沉睡客户',
    segmentHibernatingInfo: '低消费且久未光顾 - 可能已流失 (R:1-2, F:1-2, M:1-2)',
    
    acquisitionSources: '客户获取来源渠道',
    acquisitionSourcesInfo: '顾客如何发现您的餐厅：通过推荐或直接到店',
    referrals: '推荐',
    
    topCustomers: '消费前10名客户',
    topCustomersInfo: '按终身总消费排名的最高价值客户',
    visits: '次访问',
    noCustomers: '暂无客户数据。',
    
    atRiskList: '风险客户（需要重新参与）',
    atRiskListInfo: '以前活跃但最近没有回来的客户。考虑发送特别优惠',
    lastVisit: '最后访问',
    daysAgo: '天前',
    reengagementTip: '💡 提示：向这些顾客发送特别优惠或奖励以重新吸引他们！',
    comingSoon: '👥 更多顾客洞察即将推出：队列留存分析、CLV预测、流失预测、访问频率模式',
  },
};
