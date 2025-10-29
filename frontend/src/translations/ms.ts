export const ms = {
  // Common
  common: {
    loading: 'Memuatkan...',
    save: 'Simpan',
    cancel: 'Batal',
    close: 'Tutup',
    confirm: 'Sahkan',
    delete: 'Padam',
    edit: 'Edit',
    back: 'Kembali',
    next: 'Seterusnya',
    submit: 'Hantar',
    search: 'Cari',
    filter: 'Tapis',
    sort: 'Susun',
    more: 'Lagi',
    less: 'Kurang',
    yes: 'Ya',
    no: 'Tidak',
    ok: 'OK',
    error: 'Ralat',
    success: 'Berjaya',
    warning: 'Amaran',
    info: 'Maklumat',
  },

  // Dashboard Header & Profile
  profile: {
    welcome: 'Selamat kembali',
    greeting: 'Hello',
    viewProfile: 'Lihat Profil',
    settings: 'Tetapan',
    logout: 'Log Keluar',
  },

  // Stats Card
  stats: {
    totalEarned: 'Jumlah Diperoleh',
    totalRedeemed: 'Jumlah Ditebus',
    totalReferred: 'Jumlah Rujukan',
    vcBalance: 'Baki VC',
    activeReferrals: 'Rujukan Aktif',
    totalSpent: 'Jumlah Perbelanjaan',
  },

  // Dashboard - Recent Transactions
  recentTransactions: {
    title: 'Transaksi Terkini',
    noTransactions: 'Tiada transaksi lagi. Mulakan makan di restoran rakan kongsi kami untuk mendapat ganjaran!',
    firstVisit: 'Lawatan Pertama!',
    discount: 'diskaun',
    vcUsed: 'VC digunakan',
    vcEarned: 'VC diperoleh',
    unrealized: 'Belum Direalisasi',
  },

  // Dashboard - Restaurant Sorting
  restaurantSorting: {
    recent: 'Terkini',
    balance: 'Baki',
    visits: 'Lawatan',
  },

  // Dashboard - Promote Restaurants
  promoteRestaurants: {
    title: 'Promosi Restoran',
    subtitle: 'Kongsi kod untuk restoran yang telah anda lawati',
    noRestaurants: 'Tiada restoran yang dilawati lagi',
    noRestaurantsDesc: 'Lawati restoran dan buat transaksi pertama anda untuk mula mempromosi!',
  },

  // Restaurant Card
  restaurantCard: {
    share: 'Kongsi Restoran',
    vcBalance: 'Baki VC',
    totalSpent: 'Jumlah Perbelanjaan',
    visits: 'lawatan',
    visit: 'lawatan',
    active: 'Aktif',
  },

  // Share Bottom Sheet
  shareSheet: {
    title: 'Kongsi',
    subtitle: 'Pilih cara anda ingin berkongsi restoran ini',
    referralLink: 'Pautan Rujukan',
    copyLink: 'Salin Pautan',
    linkCopied: 'Pautan Disalin!',
    shareViaSocial: 'Kongsi melalui Media Sosial',
    whatsapp: 'WhatsApp',
    facebook: 'Facebook',
    more: 'Lagi',
    promotionCode: 'Kod Promosi',
    copyCode: 'Salin Kod',
    codeCopied: 'Kod Disalin!',
    shareMessage: 'Hey! Saya suka {restaurant}. Sertai saya di sana dan dapatkan diskaun: {link}',
  },

  // Transaction Detail Sheet
  transactionDetail: {
    title: 'Butiran Transaksi',
    transactionTime: 'Masa Transaksi',
    branch: 'Cawangan',
    billAmount: 'Jumlah Bil',
    
    // Realized VC Earnings
    vcEarnedTitle: 'VC Diperoleh daripada Rujukan',
    vcEarnedDesc: 'Rujukan anda berbelanja di restoran ini dan anda memperoleh 1% VC',
    
    // Unrealized Potential Earnings
    unrealizedTitle: 'Potensi Pendapatan Belum Direalisasi',
    unrealizedDesc: 'Jika anda telah berkongsi kod anda dan rakan-rakan berbelanja jumlah yang sama:',
    level1Referral: 'Rujukan Tahap 1',
    level2Referral: 'Rujukan Tahap 2',
    level3Referral: 'Rujukan Tahap 3',
    totalReferrals: 'Jumlah (3 rujukan)',
    
    // Discounts Applied
    discountsTitle: 'Diskaun Digunakan',
    guaranteedDiscount: 'Diskaun Terjamin (5%)',
    vcRedeemed: 'VC Ditebus',
  },

  // Referral Info Modal
  referralInfo: {
    title: 'Cara Tahap Rujukan Berfungsi',
    howItWorks: 'Cara Ia Berfungsi:',
    howItWorksDesc: 'Setiap transaksi memperoleh 1% VC setiap tahap upline (maksimum 3 tahap). Beberapa orang di setiap tahap boleh menyumbang untuk mencapai potensi penuh.',
    
    level1Title: 'Tahap 1 - Rujukan Langsung',
    level1Desc: 'Orang yang menggunakan kod anda secara langsung. Setiap orang yang berbelanja menyumbang 1% daripada bil mereka ke tahap ini.',
    
    level2Title: 'Tahap 2 - Rujukan Tidak Langsung',
    level2Desc: 'Orang yang dirujuk oleh rujukan Tahap 1 anda. Setiap orang yang berbelanja menyumbang 1% daripada bil mereka ke tahap ini.',
    
    level3Title: 'Tahap 3 - Rangkaian Lanjutan',
    level3Desc: 'Orang yang dirujuk oleh rujukan Tahap 2 anda. Setiap orang yang berbelanja menyumbang 1% daripada bil mereka ke tahap ini.',
    
    upperLimit: 'Had atas: 1% daripada jumlah transaksi anda',
    
    exampleTitle: 'Contoh (Bil anda: RM 100):',
    maxPotential: 'Potensi maksimum setiap tahap:',
    level1Max: 'Tahap 1: Sehingga RM 1.00 (1% daripada RM 100)',
    level2Max: 'Tahap 2: Sehingga RM 1.00 (1% daripada RM 100)',
    level3Max: 'Tahap 3: Sehingga RM 1.00 (1% daripada RM 100)',
    totalPotential: 'Jumlah Potensi: RM 3.00',
    note: 'Nota:',
    noteDesc: 'Beberapa rujukan di setiap tahap boleh menyumbang sehingga had dicapai. Jika seorang tidak berbelanja cukup, yang lain boleh mengisi jurang.',
  },

  // Authentication
  auth: {
    // Login
    login: 'Log Masuk',
    loginTitle: 'Selamat Kembali',
    loginSubtitle: 'Log masuk ke akaun anda',
    email: 'E-mel',
    password: 'Kata Laluan',
    forgotPassword: 'Lupa Kata Laluan?',
    noAccount: 'Tiada akaun?',
    signUp: 'Daftar',
    loginButton: 'Log Masuk',
    loggingIn: 'Memasuki...',
    
    // Register
    register: 'Daftar',
    registerTitle: 'Cipta Akaun',
    registerSubtitle: 'Sertai MalaChilli hari ini',
    fullName: 'Nama Penuh',
    confirmPassword: 'Sahkan Kata Laluan',
    haveAccount: 'Sudah mempunyai akaun?',
    signIn: 'Log Masuk',
    registerButton: 'Cipta Akaun',
    registering: 'Mencipta akaun...',
    agreeToTerms: 'Dengan mendaftar, anda bersetuju dengan',
    termsOfService: 'Terma Perkhidmatan',
    and: 'dan',
    privacyPolicy: 'Dasar Privasi',
    
    // Forgot Password
    forgotPasswordTitle: 'Set Semula Kata Laluan',
    forgotPasswordSubtitle: 'Masukkan e-mel anda untuk menerima arahan set semula',
    sendResetLink: 'Hantar Pautan Set Semula',
    sending: 'Menghantar...',
    backToLogin: 'Kembali ke Log Masuk',
    resetEmailSent: 'E-mel set semula dihantar! Semak peti masuk anda.',
    
    // Reset Password
    resetPasswordTitle: 'Tetapkan Kata Laluan Baharu',
    resetPasswordSubtitle: 'Masukkan kata laluan baharu anda',
    newPassword: 'Kata Laluan Baharu',
    resetPasswordButton: 'Set Semula Kata Laluan',
    resetting: 'Menetapkan semula...',
    passwordResetSuccess: 'Kata laluan berjaya ditetapkan semula!',
    
    // Validation
    emailRequired: 'E-mel diperlukan',
    passwordRequired: 'Kata laluan diperlukan',
    nameRequired: 'Nama penuh diperlukan',
    passwordsNotMatch: 'Kata laluan tidak sepadan',
    invalidEmail: 'Alamat e-mel tidak sah',
    passwordTooShort: 'Kata laluan mestilah sekurang-kurangnya 6 aksara',
  },

  // Demo Dashboard
  demo: {
    title: 'Papan Pemuka Demo',
    subtitle: 'Alami MalaChilli',
    description: 'Ini adalah papan pemuka demo yang menunjukkan cara pengalaman pelanggan berfungsi.',
    tryItOut: 'Cuba Sekarang',
    features: 'Ciri-ciri',
    howItWorks: 'Cara Ia Berfungsi',
    getStarted: 'Mulakan',
  },

  // QR Code Modal
  qrCode: {
    title: 'Kod QR Anda',
    subtitle: 'Tunjukkan ini kepada kakitangan semasa membuat transaksi',
    close: 'Tutup',
    idLabel: 'ID:',
  },

  // Settings Panel
  settings: {
    title: 'Tetapan',
    profile: 'Profil',
    name: 'Nama',
    email: 'E-mel',
    memberSince: 'Ahli Sejak',
    notSet: 'Tidak ditetapkan',
    enterName: 'Masukkan nama anda',
    save: 'Simpan',
    saving: 'Menyimpan...',
    cancel: 'Batal',
    nameUpdated: 'Nama berjaya dikemas kini!',
    nameUpdateFailed: 'Gagal mengemas kini nama. Sila cuba lagi.',
    nameEmpty: 'Nama tidak boleh kosong',
    
    preferences: 'Keutamaan',
    language: 'Bahasa',
    notifications: 'Pemberitahuan',
    emailPreferences: 'Keutamaan e-mel',
    comingSoon: 'Akan datang',
    
    about: 'Tentang',
    privacyPolicy: 'Dasar Privasi',
    termsOfService: 'Terma Perkhidmatan',
    appVersion: 'Versi Aplikasi',
    
    logout: 'Log Keluar',
  },
};
