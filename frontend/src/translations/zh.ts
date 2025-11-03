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
    unrealized: '未实现收益',
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

  // Legal Pages - FAQ
  faq: {
    title: '常见问题',
    subtitle: '查找有关MalaChilli的常见问题答案',
    backToHome: '返回首页',
    stillHaveQuestions: '还有问题？',
    stillHaveQuestionsDesc: '找不到您要找的答案？我们的支持团队随时为您服务！',
    contactSupport: '联系支持',
    
    q1: '什么是MalaChilli？',
    a1: 'MalaChilli是一个病毒式推荐折扣平台，奖励您与朋友分享。当您推荐某人并且他们进行购买时，您将获得虚拟货币，可用作下次访问的折扣！',
    
    q2: '如何赚取虚拟货币？',
    a2Title: '您可以通过两种方式赚取虚拟货币：',
    a2Point1: '首次购买保证5%折扣',
    a2Point2: '您推荐的人每次购买的1%（最多3级）',
    a2Example: '例如：如果您的朋友消费RM100，您赚取RM1。如果他们的朋友消费RM100，您也赚取RM1！',
    
    q3: '如何分享我的推荐码？',
    a3: '转到您的仪表板并点击"分享"按钮。您可以通过WhatsApp、Facebook或任何消息应用分享您的唯一二维码或链接。当有人使用您的链接注册时，他们就成为您的下线！',
    
    q4: '我可以使用的最大折扣是多少？',
    a4: '您可以使用虚拟货币兑换账单金额的最多20%。例如，在RM100的账单上，您最多可以使用RM20的虚拟货币余额。',
    
    q5: '我的虚拟货币会过期吗？',
    a5: '是的，虚拟货币在您赚取后30天过期。您将在到期前7天收到电子邮件通知提醒您使用它。请务必定期检查您的余额！',
    
    q6: '我可以组合折扣吗？',
    a6: '可以！您的首次5%保证折扣会自动应用，您还可以在此基础上兑换虚拟货币（最多账单的20%）。',
    
    q7: '我可以从多少级推荐中赚取？',
    a7: '您可以从最多3级推荐中赚取。第1级是您直接推荐的人，第2级是他们推荐的人，第3级是第2级推荐的人。每一级都为您赚取其购买的1%。',
    
    q8: '如何兑换我的虚拟货币？',
    a8: '付款时只需向工作人员出示您的二维码。他们会扫描，您可以选择兑换多少虚拟货币（最多账单的20%）。折扣立即应用！',
    
    q9: '我的个人数据安全吗？',
    a9: '是的！我们遵守马来西亚2010年个人数据保护法（PDPA）。我们只收集必要的信息，未经同意不会与第三方共享您的数据。',
    a9Link: '阅读我们的完整隐私政策了解详情。',
    
    q10: '我可以在任何餐厅使用我的虚拟货币吗？',
    a10: '目前，虚拟货币特定于您赚取它的餐厅。每家餐厅都有自己的推荐计划。',
    
    q11: '如果我忘记密码怎么办？',
    a11: '在登录页面点击"忘记密码"。我们会通过电子邮件向您发送密码重置链接。按照链接创建新密码。',
    
    q12: '我可以更改我的生日或电子邮件吗？',
    a12: '出于安全原因，生日和电子邮件无法直接更改。如果您需要更新这些详细信息，请联系我们的支持团队。',
    
    q13: '为什么我需要提供我的生日？',
    a13: '我们需要您的生日来验证您年满18岁（法定年龄要求）并向您发送特别的生日优惠！',
    
    q14: '如何删除我的账户？',
    a14: '要删除您的账户和所有相关数据，请联系我们的支持团队：support@malachilli.com',
    a14Note: '注意：删除您的账户将删除您所有的虚拟货币余额和推荐历史记录。',
    
    q15: '我可以将我的虚拟货币转让给其他人吗？',
    a15: '不可以，虚拟货币不可转让，只能由赚取它的账户持有人使用。',
    
    q16: '如果二维码扫描器不工作怎么办？',
    a16: '如果二维码扫描器有问题，工作人员可以手动输入您的推荐码。您的代码显示在仪表板上二维码下方。',
  },

  // Legal Pages - About Us
  about: {
    title: '关于MalaChilli',
    subtitle: '通过病毒式推荐革新餐厅忠诚度',
    backToHome: '返回首页',
    
    missionTitle: '我们的使命',
    missionText: '通过双赢的推荐系统赋能餐厅和顾客，奖励分享，建立社区，让每个人的外出就餐更实惠。',
    
    whatWeDoTitle: '我们做什么',
    whatWeDoPara1: 'MalaChilli是马来西亚首个专为餐厅设计的病毒式推荐折扣平台。我们帮助餐厅有机地增长客户群，同时奖励忠实客户传播信息。',
    whatWeDoPara2: '与仅奖励个人购买的传统忠诚度计划不同，MalaChilli创造了一个网络效应，让每个人都受益。当您分享推荐码并且您的朋友在餐厅用餐时，您会赚取虚拟货币。当他们的朋友用餐时，您再次赚取 - 最多3级！',
    
    coreValuesTitle: '我们的核心价值观',
    transparencyTitle: '透明度',
    transparencyDesc: '明确的规则、可见的收入和诚实的沟通。您始终确切知道您赚了多少以及何时过期。',
    communityTitle: '社区',
    communityDesc: '通过食物建立联系。每次推荐都加强社区并帮助当地餐厅蓬勃发展。',
    growthTitle: '增长',
    growthDesc: '对每个人都是双赢。餐厅有机地获得客户，客户在分享美食体验的同时省钱。',
    simplicityTitle: '简单',
    simplicityDesc: '每个人都易于使用。分享代码，赚取奖励，兑换折扣。没有复杂的规则或隐藏条款。',
    
    howItWorksTitle: '如何运作',
    step1Title: '注册并获取您的代码',
    step1Desc: '创建您的免费账户，立即获得唯一的推荐码和二维码。',
    step2Title: '与朋友分享',
    step2Desc: '通过WhatsApp、Facebook或任何消息应用分享您的代码。您的朋友首次访问可享受5%折扣！',
    step3Title: '自动赚取',
    step3Desc: '当您的推荐用餐时，您会自动赚取其账单的1%作为虚拟货币 - 最多3级！',
    step4Title: '兑换并节省',
    step4Desc: '使用您的虚拟货币在下一餐获得最多20%的折扣。出示您的二维码，立即节省！',
    
    forRestaurantsTitle: '为餐厅老板',
    forRestaurantsPara: 'MalaChilli帮助您以传统营销成本的一小部分获得新客户。您不是在广告上花钱，而是奖励带来朋友的客户。',
    forRestaurantsPoint1: '通过口碑营销实现有机增长',
    forRestaurantsPoint2: '实时分析仪表板跟踪性能',
    forRestaurantsPoint3: '自动折扣计算和虚拟货币管理',
    forRestaurantsPoint4: '客户洞察和细分工具',
    partnerWithUs: '与我们合作',
    
    questionsTitle: '有问题或反馈？',
    questionsDesc: '我们很想听到您的声音！无论您是客户还是餐厅老板，请与我们联系。',
    viewFAQ: '查看常见问题',
    contactUs: '联系我们',
  },

  // Legal Pages - Contact
  contact: {
    title: '联系我们',
    subtitle: '我们在这里为您服务！如有任何问题或反馈，请与我们联系。',
    backToHome: '返回首页',
    
    emailSupportTitle: '电子邮件支持',
    emailSupportDesc: '一般咨询和支持',
    emailSupportAddress: 'support@malachilli.com',
    
    businessInquiriesTitle: '商务咨询',
    businessInquiriesDesc: '餐厅合作伙伴关系和协作',
    businessInquiriesAddress: 'business@malachilli.com',
    
    phoneSupportTitle: '电话支持',
    phoneSupportDesc: '周一至周五，上午9点至下午6点（GMT+8）',
    phoneSupportNumber: '+60 12-345 6789',
    
    officeLocationTitle: '办公地点',
    officeLocationAddress: '吉隆坡，马来西亚',
    
    sendMessageTitle: '给我们发送消息',
    nameLabel: '您的姓名',
    namePlaceholder: '张三',
    emailLabel: '电子邮件地址',
    emailPlaceholder: 'zhang@example.com',
    subjectLabel: '主题',
    subjectPlaceholder: '选择主题',
    subjectGeneral: '一般咨询',
    subjectSupport: '技术支持',
    subjectAccount: '账户问题',
    subjectPartnership: '餐厅合作伙伴',
    subjectFeedback: '反馈',
    subjectOther: '其他',
    messageLabel: '消息',
    messagePlaceholder: '告诉我们如何帮助您...',
    sendButton: '发送消息',
    sending: '发送中...',
    
    noteTitle: '注意：',
    noteText: '我们通常在工作日的24-48小时内回复。如有紧急事项，请致电我们的支持热线。',
    
    quickLinksTitle: '在联系我们之前，您可能会在这里找到答案：',
    faqTitle: '常见问题',
    faqDesc: '常见问题',
    aboutTitle: '关于我们',
    aboutDesc: '了解更多关于MalaChilli',
    privacyTitle: '隐私政策',
    privacyDesc: '我们如何保护您的数据',
    
    messageSent: '消息发送成功！我们会尽快与您联系。',
    messageFailed: '发送消息失败。请重试或直接通过电子邮件联系我们。',
    fillAllFields: '请填写所有字段',
  },
};
