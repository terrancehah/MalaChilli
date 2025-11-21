export const dashboardInfo = {
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
};

export const profile = {
  welcome: '欢迎回来',
  greeting: '你好',
  viewProfile: '查看个人资料',
  settings: '设置',
  logout: '退出登录',
};

export const stats = {
  totalEarned: '总收益',
  totalRedeemed: '总兑换',
  totalReferred: '总推荐',
  vcBalance: 'VC 余额',
  activeReferrals: '活跃推荐',
  totalSpent: '总消费',
};

export const recentTransactions = {
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
};

export const restaurantSorting = {
  recent: '最近',
  balance: '余额',
  visits: '访问次数',
};

export const promoteRestaurants = {
  title: '推广餐厅',
  subtitle: '分享您访问过的餐厅代码',
  noRestaurants: '还没有访问过的餐厅',
  noRestaurantsDesc: '访问餐厅并完成首次交易以开始推广！',
};

export const restaurantCard = {
  share: '分享餐厅',
  vcBalance: 'VC余额',
  totalSpent: '总消费',
  visits: '次访问',
  visit: '次访问',
  active: '活跃',
  earnUpTo: '可赚取高达',
  unrealized: '未实现收益',
  recentActivity: '最近活动',
};

export const shareSheet = {
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
};

export const transactionDetail = {
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
};

export const referralInfo = {
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
};

export const demo = {
  title: '演示仪表板',
  subtitle: '体验 MalaChilli',
  description: '这是一个演示仪表板，展示客户体验如何运作。',
  tryItOut: '试用',
  features: '功能',
  howItWorks: '如何运作',
  getStarted: '开始使用',
};

export const qrCode = {
  title: '您的二维码',
  subtitle: '交易时向工作人员出示此码',
  close: '关闭',
  idLabel: 'ID:',
};

export const settings = {
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
};
