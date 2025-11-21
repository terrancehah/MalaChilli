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

  // Time Ago
  timeAgo: {
    today: '今天',
    yesterday: '昨天',
    daysAgo: '{count} 天前',
    weekAgo: '1 周前',
    weeksAgo: '{count} 周前',
    monthAgo: '1 个月前',
    monthsAgo: '{count} 个月前',
  },

  // Dashboard Info Modals
  dashboardInfo: {
    restaurantInfo: {
      title: '如何运作',
      item1: '光顾餐厅并完成交易即可解锁该餐厅的推广资格',
      item2: '首次光顾时会自动生成您的专属推荐码',
      item3: '通过 WhatsApp、Facebook 分享链接，或直接复制链接分享给朋友',
      item4: '当有人使用您的链接并在该餐厅完成首次交易时，你们双方都能获得虚拟货币奖励',
    },
    currencyInfo: {
      title: '餐厅专属虚拟货币',
      item1: '<strong>餐厅专属：</strong> 每家餐厅都有独立的虚拟货币余额',
      item2: '通过推荐朋友到特定餐厅赚取虚拟货币',
      item3: '从某家餐厅赚取的货币只能在该餐厅兑换使用',
      item4: '这确保了公平分配，防止跨餐厅滥用',
      item5: '<strong>已赚取：</strong> 您在该餐厅通过推荐赚取的虚拟货币总额',
      item6: '<strong>已兑换：</strong> 您在该餐厅已使用的折扣总额',
    },
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
    noTransactions: '还没有交易记录',
    firstVisit: '首次光顾！',
    discount: '折扣',
    vcUsed: '已使用VC',
    vcEarned: '赚取VC',
    unrealized: '未实现收益',
    unrealizedDesc: '分享您的代码以解锁此潜在收益',
    viewDetails: '查看完整详情',
    tapToView: '点击查看详情',
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
    vcBalance: 'VC余额',
    totalSpent: '总消费',
    visits: '次访问',
    visit: '次访问',
    active: '活跃',
    earnUpTo: '可赚取高达',
    unrealized: '未实现收益',
    recentActivity: '最近活动',
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
    restaurant: '餐厅',
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

  // 员工仪表板
  staffDashboard: {
    title: '员工门户',
    subtitle: '员工门户',
    settings: '设置',
    
    // 快捷操作
    quickActions: '快捷操作',
    scanForCheckout: '扫码结账',
    menuItems: '菜单项目',
    editCustomer: '编辑顾客',
    scanReceipt: '扫描收据',
    viewTransactions: '查看交易',
    
    // 顾客验证
    customerVerified: '顾客已验证',
    welcomeBack: '欢迎回来',
    firstVisit: '首次光临！',
    birthdayBonus: '生日奖励！',
    continueToCheckout: '继续结账',
    
    // 结账
    checkout: '结账',
    billAmount: '账单金额',
    enterBillAmount: '输入账单金额',
    availableBalance: '可用余额',
    redeemAmount: '兑换金额',
    enterRedeemAmount: '输入兑换金额',
    maxRedeemable: '最多可兑换',
    summary: '摘要',
    originalAmount: '原始金额',
    discount: '折扣 (5%)',
    vcRedeemed: '已兑换 VC',
    finalAmount: '最终金额',
    processCheckout: '处理结账',
    processing: '处理中...',
    
    // 交易成功
    transactionSuccess: '交易成功！',
    transactionId: '交易编号',
    customer: '顾客',
    vcEarned: '获得 VC',
    birthdayBonusEarned: '生日奖励',
    done: '完成',
    
    // 顾客查找
    lookupCustomer: '查找顾客',
    searchByEmail: '按电子邮件或姓名搜索',
    search: '搜索',
    scanQR: '扫描二维码',
    noCustomerFound: '未找到顾客',
    
    // 编辑顾客
    editCustomerTitle: '编辑顾客',
    fullName: '全名',
    email: '电子邮件',
    birthday: '生日',
    optional: '可选',
    saveChanges: '保存更改',
    saving: '保存中...',
    
    // 二维码扫描器
    scanCustomerQR: '扫描顾客二维码',
    pointCamera: '将相机对准顾客的二维码',
    cancel: '取消',
    
    // 收据 OCR
    scanReceiptTitle: '扫描收据',
    uploadReceipt: '上传收据',
    takePhoto: '拍照',
    processingReceipt: '处理中...',
    extracting: '正在从收据中提取数据...',
    
    // 菜单管理
    menuManagement: '菜单管理',
    items: '项',
    available: '可用',
    import: '导入',
    export: '导出',
    add: '添加',
    totalItems: '总项目数',
    availableItems: '可用',
    lowStock: '库存不足',
    categories: '类别',
    searchPlaceholder: '按名称或类别搜索...',
    allItems: '所有项目',
    meatPoultry: '肉类与家禽',
    seafood: '海鲜',
    vegetables: '蔬菜',
    processed: '加工食品',
    noodlesRice: '面条与米饭',
    herbsSpices: '香草与香料',
    others: '其他',
    bulkActions: '批量操作',
    selected: '已选',
    delete: '删除',
    toggleAvailability: '切换可用性',
    sortBy: '排序方式',
    name: '名称',
    price: '价格',
    stock: '库存',
    category: '类别',
    viewMode: '视图',
    list: '列表',
    grid: '网格',
    noItems: '未找到菜单项目',
    noItemsDesc: '从添加第一个菜单项目或从 CSV 导入开始',
    
    // 菜单项目表单
    addMenuItem: '添加菜单项目',
    editMenuItem: '编辑菜单项目',
    itemName: '项目名称',
    required: '必填',
    itemNamePlaceholder: '例如：鸡胸肉、老虎虾',
    itemNameHint: '使用与收据上显示的名称相同，以便更好地进行 OCR 匹配',
    priceRM: '价格 (RM)',
    unit: '单位',
    unitPlaceholder: 'Kg、包、盒',
    nutritionalInfo: '营养信息 (每100克)',
    calories: '卡路里',
    protein: '蛋白质 (克)',
    fat: '脂肪 (克)',
    inventory: '库存',
    stockQuantity: '库存数量',
    lowStockAlert: '低库存警报',
    availableForSale: '可供销售',
    toggleUnavailable: '切换以标记项目为不可用',
    notes: '备注',
    notesPlaceholder: '附加备注或描述...',
    addItem: '添加项目',
    updateItem: '更新项目',
    
    // 菜单项目导入
    importMenuItems: '导入菜单项目',
    howToImport: '如何导入',
    importStep1: '下载下面的 CSV 模板（包含格式说明和示例）',
    importStep2: '填写您的菜单项目 - 名称和类别为必填项',
    importStep3: '保留说明行（以 # 开头）以供参考 - 导入时将被忽略',
    importStep4: '上传完成的 CSV 文件',
    importStep5: '查看任何验证错误并修复它们',
    importStep6: '点击导入以将项目添加到您的菜单',
    csvFormatPreview: 'CSV 格式预览：',
    formatLine1: '第一行：列标题（必需）',
    formatLine2: '第二行：说明（可选，将被跳过）',
    formatLine3: '后续行：您的菜单项目',
    downloadTemplate: '下载 CSV 模板',
    uploadCSV: '上传 CSV 文件',
    clickToUpload: '点击上传 CSV 文件',
    maxFileSize: '最大文件大小：5MB',
    validationErrors: '验证错误',
    importComplete: '导入完成',
    successfullyImported: '成功导入',
    failed: '失败',
    totalProcessed: '总处理数',
    validCategories: '有效类别：',
    importItems: '导入项目',
    
    // 交易页面
    transactions: '交易',
    transaction: '笔交易',
    period: '时期',
    oneDay: '1 天',
    sevenDays: '7 天',
    thirtyDays: '30 天',
    all: '全部',
    date: '日期',
    amount: '金额',
    noTransactions: '所选时期内未找到交易',
    totalAmount: '总金额',
    
    // 设置
    profile: '个人资料',
    memberSince: '会员自',
    preferences: '偏好设置',
    language: '语言',
    notifications: '通知',
    about: '关于',
    privacyPolicy: '隐私政策',
    termsOfService: '服务条款',
    appVersion: '应用版本',
    logout: '登出',
    
    // 提示消息
    customerNotFound: '未找到顾客。请检查二维码并重试。',
    transactionFailed: '处理交易失败',
    customerUpdated: '顾客详情更新成功！',
    receiptScanned: '收据已扫描！',
    itemsMatched: '项已匹配',
    confidence: '置信度',

    ocr: {
      linkSuccess: '收据已关联到 {customer} 的交易！(相差 {timeDiff}) | {items} 项 | 置信度: {confidence}%',
      scanSuccess: '收据已扫描！金额: RM {amount}{itemsText} | 置信度: {confidence}% | ⚠️ 未找到匹配交易 - 请先创建交易',
      linkError: '收据已扫描但关联失败: {error}',
      refreshError: '刷新客户数据失败',
    },

    noItemsToExport: '没有可导出的项目',
    exportedItems: '已导出',
    exportFailed: '导出项目失败。请重试。',
    menuItemAdded: '菜单项目添加成功',
    menuItemUpdated: '菜单项目更新成功',
    failedToSave: '保存项目失败',
    
    // 错误消息
    error: '错误',
    tryAgain: '请重试',
    loadingError: '加载数据失败',
    noRestaurant: '您的账户未分配餐厅',
    
    // 交易详情表
    detailSheetTitle: '交易详情',
    detailCustomer: '顾客',
    detailBreakdown: '明细',
    detailReceiptItems: '收据项目',
    detailNoItems: '未提取项目',
    detailFirstVisit: '首次光临',
    detailReceiptScanned: '收据已扫描',
  },

  // 业主仪表板
  ownerDashboard: {
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
  
  // 业务指标标签页 (duplicate - removing)
  /*businessMetrics: {
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
    walkIns: '到店',
    walkInsDesc: '直接顾客',
    
    // Subheadings/descriptions
    last30Days: '最近30天',
    ofGross: '占总收入',
    avg: '平均',
    revenueVsDiscount: '收入 vs 折扣',
    firstTimeDiscount: '首次消费折扣',
    virtualCurrencyRedeemed: '虚拟货币兑换',
  },*/
  
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
    walkIns: '到店',
    walkInsDesc: '直接顾客',
    
    // Subheadings/descriptions
    active: '活跃',
    acquisition: '获客渠道',
    fromReferrals: '来自推荐',
    customers: '位顾客',
    perCustomer: '每位顾客',
    customerAcquisitionSources: '顾客来源渠道',
    
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
    
    // 通用
    loading: '加载仪表板数据...',
    error: '加载仪表板数据失败',
    retry: '重试',
  },
};
