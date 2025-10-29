export const zh = {
  // Common
  common: {
    loading: '加载中...',
    save: '保存',
    cancel: '取消',
    close: '关闭',
    confirm: '确认',
    delete: '删除',
    edit: '编辑',
    back: '返回',
    next: '下一步',
    submit: '提交',
    search: '搜索',
    filter: '筛选',
    sort: '排序',
    more: '更多',
    less: '更少',
    yes: '是',
    no: '否',
    ok: '确定',
    error: '错误',
    success: '成功',
    warning: '警告',
    info: '信息',
  },

  // Dashboard Header & Profile
  profile: {
    welcome: '欢迎回来',
    greeting: '你好',
    viewProfile: '查看个人资料',
    settings: '设置',
    logout: '退出登录',
  },

  // Stats Card
  stats: {
    totalEarned: '总收益',
    totalRedeemed: '总兑换',
    totalReferred: '总推荐',
    vcBalance: 'VC 余额',
    activeReferrals: '活跃推荐',
    totalSpent: '总消费',
  },

  // Dashboard - Recent Transactions
  recentTransactions: {
    title: '最近交易',
    noTransactions: '还没有交易记录。开始在我们的合作餐厅用餐以赚取奖励！',
    firstVisit: '首次光临！',
    discount: '折扣',
    vcUsed: '已使用 VC',
    vcEarned: '已赚取 VC',
    unrealized: '未实现',
  },

  // Dashboard - Restaurant Sorting
  restaurantSorting: {
    recent: '最近',
    balance: '余额',
    visits: '访问次数',
  },

  // Dashboard - Promote Restaurants
  promoteRestaurants: {
    title: '推广餐厅',
    subtitle: '分享您访问过的餐厅代码',
    noRestaurants: '还没有访问过的餐厅',
    noRestaurantsDesc: '访问餐厅并完成首次交易以开始推广！',
  },

  // Restaurant Card
  restaurantCard: {
    share: '分享餐厅',
    vcBalance: 'VC 余额',
    totalSpent: '总消费',
    visits: '次访问',
    visit: '次访问',
    active: '活跃',
  },

  // Share Bottom Sheet
  shareSheet: {
    title: '分享',
    subtitle: '选择您想要分享此餐厅的方式',
    referralLink: '推荐链接',
    copyLink: '复制链接',
    linkCopied: '链接已复制！',
    shareViaSocial: '通过社交媒体分享',
    whatsapp: 'WhatsApp',
    facebook: 'Facebook',
    more: '更多',
    promotionCode: '促销代码',
    copyCode: '复制代码',
    codeCopied: '代码已复制！',
    shareMessage: '嘿！我喜欢{restaurant}。和我一起去那里并获得折扣：{link}',
  },

  // Transaction Detail Sheet
  transactionDetail: {
    title: '交易详情',
    transactionTime: '交易时间',
    branch: '分店',
    billAmount: '账单金额',
    
    // Realized VC Earnings
    vcEarnedTitle: '从推荐人赚取的 VC',
    vcEarnedDesc: '您的推荐人在此餐厅消费，您赚取了 1% VC',
    
    // Unrealized Potential Earnings
    unrealizedTitle: '未实现的潜在收益',
    unrealizedDesc: '如果您分享了代码且朋友消费了相同金额：',
    level1Referral: '一级推荐',
    level2Referral: '二级推荐',
    level3Referral: '三级推荐',
    totalReferrals: '总计（3 个推荐）',
    
    // Discounts Applied
    discountsTitle: '已应用折扣',
    guaranteedDiscount: '保证折扣（5%）',
    vcRedeemed: '已兑换 VC',
  },

  // Referral Info Modal
  referralInfo: {
    title: '推荐级别如何运作',
    howItWorks: '运作方式：',
    howItWorksDesc: '每笔交易每个上线级别赚取 1% VC（最多 3 级）。每个级别的多人可以贡献以达到全部潜力。',
    
    level1Title: '一级 - 直接推荐',
    level1Desc: '直接使用您代码的人。每个消费的人向此级别贡献其账单的 1%。',
    
    level2Title: '二级 - 间接推荐',
    level2Desc: '由您的一级推荐人推荐的人。每个消费的人向此级别贡献其账单的 1%。',
    
    level3Title: '三级 - 扩展网络',
    level3Desc: '由您的二级推荐人推荐的人。每个消费的人向此级别贡献其账单的 1%。',
    
    upperLimit: '上限：您交易金额的 1%',
    
    exampleTitle: '示例（您的账单：RM 100）：',
    maxPotential: '每级最大潜力：',
    level1Max: '一级：最多 RM 1.00（RM 100 的 1%）',
    level2Max: '二级：最多 RM 1.00（RM 100 的 1%）',
    level3Max: '三级：最多 RM 1.00（RM 100 的 1%）',
    totalPotential: '总潜力：RM 3.00',
    note: '注意：',
    noteDesc: '每个级别的多个推荐可以贡献直到达到限制。如果一个人消费不够，其他人可以填补差距。',
  },

  // Authentication
  auth: {
    // Login
    login: '登录',
    loginTitle: '欢迎回来',
    loginSubtitle: '登录到您的账户',
    email: '电子邮件',
    password: '密码',
    forgotPassword: '忘记密码？',
    noAccount: '还没有账户？',
    signUp: '注册',
    loginButton: '登录',
    loggingIn: '登录中...',
    
    // Register
    register: '注册',
    registerTitle: '创建账户',
    registerSubtitle: '今天加入 MalaChilli',
    fullName: '全名',
    confirmPassword: '确认密码',
    haveAccount: '已有账户？',
    signIn: '登录',
    registerButton: '创建账户',
    registering: '创建账户中...',
    agreeToTerms: '注册即表示您同意我们的',
    termsOfService: '服务条款',
    and: '和',
    privacyPolicy: '隐私政策',
    
    // Forgot Password
    forgotPasswordTitle: '重置密码',
    forgotPasswordSubtitle: '输入您的电子邮件以接收重置说明',
    sendResetLink: '发送重置链接',
    sending: '发送中...',
    backToLogin: '返回登录',
    resetEmailSent: '重置邮件已发送！请查看您的收件箱。',
    
    // Reset Password
    resetPasswordTitle: '设置新密码',
    resetPasswordSubtitle: '输入您的新密码',
    newPassword: '新密码',
    resetPasswordButton: '重置密码',
    resetting: '重置中...',
    passwordResetSuccess: '密码重置成功！',
    
    // Validation
    emailRequired: '电子邮件为必填项',
    passwordRequired: '密码为必填项',
    nameRequired: '全名为必填项',
    passwordsNotMatch: '密码不匹配',
    invalidEmail: '无效的电子邮件地址',
    passwordTooShort: '密码必须至少 6 个字符',
  },

  // Demo Dashboard
  demo: {
    title: '演示仪表板',
    subtitle: '体验 MalaChilli',
    description: '这是一个演示仪表板，展示客户体验如何运作。',
    tryItOut: '试用',
    features: '功能',
    howItWorks: '如何运作',
    getStarted: '开始使用',
  },

  // QR Code Modal
  qrCode: {
    title: '您的二维码',
    subtitle: '交易时向工作人员出示此码',
    close: '关闭',
    idLabel: 'ID:',
  },

  // Settings Panel
  settings: {
    title: '设置',
    profile: '个人资料',
    name: '姓名',
    email: '电子邮件',
    memberSince: '会员自',
    notSet: '未设置',
    enterName: '输入您的姓名',
    save: '保存',
    saving: '保存中...',
    cancel: '取消',
    nameUpdated: '姓名更新成功！',
    nameUpdateFailed: '更新姓名失败。请重试。',
    nameEmpty: '姓名不能为空',
    
    preferences: '偏好设置',
    language: '语言',
    notifications: '通知',
    emailPreferences: '电子邮件偏好',
    comingSoon: '即将推出',
    
    about: '关于',
    privacyPolicy: '隐私政策',
    termsOfService: '服务条款',
    appVersion: '应用版本',
    
    logout: '退出登录',
  },
};
