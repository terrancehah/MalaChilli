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
    unrealized: 'Pendapatan Belum Direalisasi',
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
    restaurant: 'Restoran',
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

  // Legal Pages - FAQ
  faq: {
    title: 'Soalan Lazim',
    subtitle: 'Cari jawapan kepada soalan lazim tentang MalaChilli',
    backToHome: 'Kembali ke Laman Utama',
    stillHaveQuestions: 'Masih ada soalan?',
    stillHaveQuestionsDesc: 'Tidak jumpa jawapan yang anda cari? Pasukan sokongan kami sedia membantu!',
    contactSupport: 'Hubungi Sokongan',
    
    q1: 'Apakah MalaChilli?',
    a1: 'MalaChilli adalah platform diskaun rujukan viral yang memberi ganjaran kepada anda kerana berkongsi dengan rakan. Apabila anda merujuk seseorang dan mereka membuat pembelian, anda memperoleh mata wang virtual yang boleh digunakan sebagai diskaun pada lawatan seterusnya!',
    
    q2: 'Bagaimana saya memperoleh mata wang virtual?',
    a2Title: 'Anda memperoleh mata wang virtual dalam dua cara:',
    a2Point1: 'Diskaun terjamin 5% pada pembelian pertama anda',
    a2Point2: '1% daripada setiap pembelian yang dibuat oleh orang yang anda rujuk (sehingga 3 peringkat)',
    a2Example: 'Contohnya: Jika rakan anda berbelanja RM100, anda memperoleh RM1. Jika rakan mereka berbelanja RM100, anda juga memperoleh RM1!',
    
    q3: 'Bagaimana saya berkongsi kod rujukan saya?',
    a3: 'Pergi ke papan pemuka anda dan tekan butang \'Kongsi\'. Anda boleh berkongsi kod QR unik atau pautan anda melalui WhatsApp, Facebook, atau mana-mana aplikasi pemesejan. Apabila seseorang mendaftar menggunakan pautan anda, mereka menjadi downline anda!',
    
    q4: 'Apakah diskaun maksimum yang boleh saya gunakan?',
    a4: 'Anda boleh menebus sehingga 20% daripada jumlah bil anda menggunakan mata wang virtual. Contohnya, pada bil RM100, anda boleh menggunakan sehingga RM20 daripada baki mata wang virtual anda.',
    
    q5: 'Adakah mata wang virtual saya luput?',
    a5: 'Ya, mata wang virtual luput 30 hari selepas anda memperolehnya. Anda akan menerima pemberitahuan e-mel 7 hari sebelum tamat tempoh untuk mengingatkan anda menggunakannya. Pastikan anda memeriksa baki anda dengan kerap!',
    
    q6: 'Bolehkah saya menggabungkan diskaun?',
    a6: 'Ya! Diskaun terjamin 5% kali pertama anda akan digunakan secara automatik, dan anda juga boleh menebus mata wang virtual (sehingga 20% daripada bil) di atas itu.',
    
    q7: 'Berapa banyak peringkat rujukan yang boleh saya perolehi?',
    a7: 'Anda memperoleh daripada sehingga 3 peringkat rujukan. Peringkat 1 adalah orang yang anda rujuk secara langsung, Peringkat 2 adalah orang yang mereka rujuk, dan Peringkat 3 adalah orang yang dirujuk oleh Peringkat 2. Setiap peringkat memberi anda 1% daripada pembelian mereka.',
    
    q8: 'Bagaimana saya menebus mata wang virtual saya?',
    a8: 'Hanya tunjukkan kod QR anda kepada kakitangan semasa membayar. Mereka akan mengimbas dan anda boleh memilih berapa banyak mata wang virtual untuk ditebus (sehingga 20% daripada bil anda). Diskaun digunakan serta-merta!',
    
    q9: 'Adakah data peribadi saya selamat?',
    a9: 'Ya! Kami mematuhi Akta Perlindungan Data Peribadi (PDPA) 2010 Malaysia. Kami hanya mengumpul maklumat yang diperlukan dan tidak berkongsi data anda dengan pihak ketiga tanpa kebenaran.',
    a9Link: 'Baca Dasar Privasi penuh kami untuk butiran lanjut.',
    
    q10: 'Bolehkah saya menggunakan mata wang virtual saya di mana-mana restoran?',
    a10: 'Pada masa ini, mata wang virtual adalah khusus untuk restoran di mana anda memperolehnya. Setiap restoran mempunyai program rujukan sendiri.',
    
    q11: 'Apa yang berlaku jika saya terlupa kata laluan saya?',
    a11: 'Klik \'Lupa Kata Laluan\' di halaman log masuk. Kami akan menghantar pautan tetapan semula kata laluan melalui e-mel. Ikuti pautan untuk mencipta kata laluan baharu.',
    
    q12: 'Bolehkah saya menukar tarikh lahir atau e-mel saya?',
    a12: 'Atas sebab keselamatan, tarikh lahir dan e-mel tidak boleh ditukar secara langsung. Sila hubungi pasukan sokongan kami jika anda perlu mengemaskini butiran ini.',
    
    q13: 'Mengapa saya perlu memberikan tarikh lahir saya?',
    a13: 'Kami memerlukan tarikh lahir anda untuk mengesahkan anda berumur 18 tahun ke atas (keperluan umur undang-undang) dan untuk menghantar tawaran istimewa hari lahir!',
    
    q14: 'Bagaimana saya memadam akaun saya?',
    a14: 'Untuk memadam akaun anda dan semua data yang berkaitan, sila hubungi pasukan sokongan kami di support@malachilli.com',
    a14Note: 'Nota: Memadam akaun anda akan membuang semua baki mata wang virtual dan sejarah rujukan anda.',
    
    q15: 'Bolehkah saya memindahkan mata wang virtual saya kepada orang lain?',
    a15: 'Tidak, mata wang virtual tidak boleh dipindahkan dan hanya boleh digunakan oleh pemegang akaun yang memperolehnya.',
    
    q16: 'Bagaimana jika pengimbas kod QR tidak berfungsi?',
    a16: 'Jika pengimbas QR mengalami masalah, kakitangan boleh memasukkan kod rujukan anda secara manual. Kod anda dipaparkan di bawah kod QR anda di papan pemuka.',
  },

  // Legal Pages - About Us
  about: {
    title: 'Tentang MalaChilli',
    subtitle: 'Merevolusikan kesetiaan restoran melalui rujukan viral',
    backToHome: 'Kembali ke Laman Utama',
    
    missionTitle: 'Misi Kami',
    missionText: 'Untuk memperkasakan restoran dan pelanggan melalui sistem rujukan menang-menang yang memberi ganjaran perkongsian, membina komuniti, dan menjadikan makan di luar lebih berpatutan untuk semua orang.',
    
    whatWeDoTitle: 'Apa Yang Kami Lakukan',
    whatWeDoPara1: 'MalaChilli adalah platform diskaun rujukan viral pertama Malaysia yang direka khusus untuk restoran. Kami membantu restoran mengembangkan pangkalan pelanggan mereka secara organik sambil memberi ganjaran kepada pelanggan setia kerana menyebarkan berita.',
    whatWeDoPara2: 'Tidak seperti program kesetiaan tradisional yang hanya memberi ganjaran pembelian individu, MalaChilli mencipta kesan rangkaian di mana semua orang mendapat manfaat. Apabila anda berkongsi kod rujukan anda dan rakan anda makan di restoran, anda memperoleh mata wang virtual. Apabila rakan mereka makan, anda memperoleh lagi - sehingga 3 peringkat!',
    
    coreValuesTitle: 'Nilai Teras Kami',
    transparencyTitle: 'Ketelusan',
    transparencyDesc: 'Peraturan yang jelas, pendapatan yang boleh dilihat, dan komunikasi yang jujur. Anda sentiasa tahu berapa banyak yang anda peroleh dan bila ia luput.',
    communityTitle: 'Komuniti',
    communityDesc: 'Membina hubungan melalui makanan. Setiap rujukan mengukuhkan komuniti dan membantu restoran tempatan berkembang maju.',
    growthTitle: 'Pertumbuhan',
    growthDesc: 'Menang-menang untuk semua orang. Restoran memperoleh pelanggan secara organik, dan pelanggan menjimatkan wang sambil berkongsi pengalaman makanan yang hebat.',
    simplicityTitle: 'Kesederhanaan',
    simplicityDesc: 'Mudah digunakan untuk semua orang. Kongsi kod, peroleh ganjaran, tebus diskaun. Tiada peraturan rumit atau terma tersembunyi.',
    
    howItWorksTitle: 'Bagaimana Ia Berfungsi',
    step1Title: 'Daftar & Dapatkan Kod Anda',
    step1Desc: 'Cipta akaun percuma anda dan terima kod rujukan unik dan kod QR dengan serta-merta.',
    step2Title: 'Kongsi Dengan Rakan',
    step2Desc: 'Kongsi kod anda melalui WhatsApp, Facebook, atau mana-mana aplikasi pemesejan. Rakan anda mendapat diskaun 5% pada lawatan pertama mereka!',
    step3Title: 'Peroleh Secara Automatik',
    step3Desc: 'Apabila rujukan anda makan, anda secara automatik memperoleh 1% daripada bil mereka sebagai mata wang virtual - sehingga 3 peringkat!',
    step4Title: 'Tebus & Jimat',
    step4Desc: 'Gunakan mata wang virtual anda untuk mendapat sehingga 20% diskaun pada hidangan seterusnya. Tunjukkan kod QR anda dan jimat serta-merta!',
    
    forRestaurantsTitle: 'Untuk Pemilik Restoran',
    forRestaurantsPara: 'MalaChilli membantu anda memperoleh pelanggan baharu pada sebahagian kecil daripada kos pemasaran tradisional. Daripada berbelanja untuk iklan, anda memberi ganjaran kepada pelanggan yang membawa rakan mereka.',
    forRestaurantsPoint1: 'Pertumbuhan organik melalui pemasaran dari mulut ke mulut',
    forRestaurantsPoint2: 'Papan pemuka analitik masa nyata untuk menjejak prestasi',
    forRestaurantsPoint3: 'Pengiraan diskaun automatik dan pengurusan mata wang virtual',
    forRestaurantsPoint4: 'Cerapan pelanggan dan alat segmentasi',
    partnerWithUs: 'Bekerjasama Dengan Kami',
    
    questionsTitle: 'Soalan atau Maklum Balas?',
    questionsDesc: 'Kami ingin mendengar daripada anda! Sama ada anda pelanggan atau pemilik restoran, hubungi kami.',
    viewFAQ: 'Lihat Soalan Lazim',
    contactUs: 'Hubungi Kami',
  },

  // Legal Pages - Contact
  contact: {
    title: 'Hubungi Kami',
    subtitle: 'Kami di sini untuk membantu! Hubungi kami dengan sebarang soalan atau maklum balas.',
    backToHome: 'Kembali ke Laman Utama',
    
    emailSupportTitle: 'Sokongan E-mel',
    emailSupportDesc: 'Untuk pertanyaan am dan sokongan',
    emailSupportAddress: 'support@malachilli.com',
    
    businessInquiriesTitle: 'Pertanyaan Perniagaan',
    businessInquiriesDesc: 'Perkongsian restoran dan kerjasama',
    businessInquiriesAddress: 'business@malachilli.com',
    
    phoneSupportTitle: 'Sokongan Telefon',
    phoneSupportDesc: 'Isnin-Jumaat, 9 PAGI-6 PETANG (GMT+8)',
    phoneSupportNumber: '+60 12-345 6789',
    
    officeLocationTitle: 'Lokasi Pejabat',
    officeLocationAddress: 'Kuala Lumpur, Malaysia',
    
    sendMessageTitle: 'Hantar Mesej Kepada Kami',
    nameLabel: 'Nama Anda',
    namePlaceholder: 'Ahmad Ali',
    emailLabel: 'Alamat E-mel',
    emailPlaceholder: 'ahmad@example.com',
    subjectLabel: 'Subjek',
    subjectPlaceholder: 'Pilih subjek',
    subjectGeneral: 'Pertanyaan Am',
    subjectSupport: 'Sokongan Teknikal',
    subjectAccount: 'Isu Akaun',
    subjectPartnership: 'Perkongsian Restoran',
    subjectFeedback: 'Maklum Balas',
    subjectOther: 'Lain-lain',
    messageLabel: 'Mesej',
    messagePlaceholder: 'Beritahu kami bagaimana kami boleh membantu...',
    sendButton: 'Hantar Mesej',
    sending: 'Menghantar...',
    
    noteTitle: 'Nota:',
    noteText: 'Kami biasanya membalas dalam masa 24-48 jam pada hari bekerja. Untuk perkara mendesak, sila hubungi talian sokongan kami.',
    
    quickLinksTitle: 'Sebelum menghubungi kami, anda mungkin jumpa jawapan di sini:',
    faqTitle: 'Soalan Lazim',
    faqDesc: 'Soalan lazim',
    aboutTitle: 'Tentang Kami',
    aboutDesc: 'Ketahui lebih lanjut tentang MalaChilli',
    privacyTitle: 'Dasar Privasi',
    privacyDesc: 'Bagaimana kami melindungi data anda',
    
    messageSent: 'Mesej berjaya dihantar! Kami akan menghubungi anda tidak lama lagi.',
    messageFailed: 'Gagal menghantar mesej. Sila cuba lagi atau e-mel kami secara langsung.',
    fillAllFields: 'Sila isi semua medan',
  },

  // Papan Pemuka Pemilik
  ownerDashboard: {
    title: 'Papan Pemuka Pemilik',
    settings: 'Tetapan',
    
    // Tab
    tabs: {
      viralPerformance: 'Prestasi Rujukan',
      businessMetrics: 'Metrik Perniagaan',
      customerInsights: 'Wawasan Pelanggan',
    },
    
    // Panel Pengurusan
    management: {
      title: 'Pengurusan',
      manageStaff: 'Urus Kakitangan',
      manageStaffDesc: 'Tambah, edit dan urus akaun kakitangan',
      manageBranches: 'Urus Cawangan',
      manageBranchesDesc: 'Tambah dan urus cawangan restoran',
      restaurantSettings: 'Tetapan Restoran',
      restaurantSettingsDesc: 'Kemas kini butiran dan keutamaan restoran',
    },
    
    // Tab Prestasi Rujukan
    viralPerformance: {
      viralityCoefficient: 'Pekali Rujukan',
      viralityCoefficientInfo: 'Mengukur keberkesanan setiap pelanggan bawa pelanggan baharu. Pekali > 1 bermakna pertumbuhan pesat. Formula: Jumlah Rujukan ÷ Bilangan Perujuk',
      
      networkSize: 'Saiz Rangkaian Rujukan',
      networkSizeInfo: 'Jumlah pelanggan yang sertai melalui rujukan, termasuk semua peringkat',
      totalDownlines: 'Jumlah Rujukan',
      
      networkDepth: 'Taburan Peringkat',
      networkDepthInfo: 'Taburan pelanggan mengikut peringkat rujukan. L1 = rujukan terus, L2 = rujukan peringkat 2, L3 = rujukan peringkat 3',
      level1: 'L1',
      level2: 'L2',
      level3: 'L3',
      
      savedCodesPipeline: 'Penukaran Kod Tersimpan',
      savedCodesPipelineInfo: 'Jejak pelanggan yang simpan kod restoran tapi belum datang. Kadar tinggi tunjuk pemasaran berkesan',
      totalSaved: 'Jumlah Simpan',
      unused: 'Belum Guna',
      converted: 'Sudah Datang',
      conversionRate: 'Kadar Penukaran',
      avgTimeToFirstVisit: 'Purata masa ke lawatan pertama',
      days: 'hari',
      
      topSharers: 'Perujuk Terbaik',
      topSharersInfo: 'Pelanggan setia yang aktif rujuk pelanggan baharu',
      downlines: 'rujukan',
      earned: 'diperoleh',
      noSharers: 'Tiada rujukan lagi',
      
      sharingActivity: 'Aktiviti Rujukan',
      sharingActivityInfo: 'Pecahan pelanggan mengikut tahap aktiviti rujukan',
      superSharers: 'Perujuk Hebat',
      superSharersDesc: '10+ rujukan',
      activeSharers: 'Perujuk Aktif',
      activeSharersDesc: '3-9 rujukan',
      passiveSharers: 'Perujuk Biasa',
      passiveSharersDesc: '1-2 rujukan',
      nonSharers: 'Tiada Rujukan',
      nonSharersDesc: '0 rujukan',
      
      // Subheadings/descriptions
      exponentialGrowth: 'Pertumbuhan pesat!',
      steadyGrowth: 'Pertumbuhan stabil',
      belowViralThreshold: 'Pertumbuhan perlahan',
      activeSharersCount: 'perujuk aktif',
      awaitingVisit: 'Tunggu Lawatan',
      saved: 'Disimpan',
      pending: 'Menunggu',
      done: 'Selesai',
      avgTime: 'Masa purata',
      comingSoon: '📊 Lebih banyak analitik viral akan datang: Visualisasi rangkaian, analisis tingkah laku perkongsian, penjejakan K-factor',
    },
    
    // Tab Metrik Perniagaan
    businessMetrics: {
      totalRevenue: 'Jumlah Hasil',
      totalRevenueInfo: 'Jumlah hasil sebelum tolak diskaun',
      
      netRevenue: 'Hasil Bersih',
      netRevenueInfo: 'Hasil sebenar selepas tolak semua diskaun (diskaun terjamin + tebusan mata wang maya)',
      
      totalTransactions: 'Bilangan Transaksi',
      totalTransactionsInfo: 'Jumlah transaksi yang berjaya dalam tempoh dipilih',
      
      avgBillAmount: 'Purata Jualan',
      avgBillAmountInfo: 'Purata nilai jualan bagi setiap pelanggan',
      
      totalDiscounts: 'Jumlah Diskaun',
      totalDiscountsInfo: 'Jumlah diskaun terjamin dan tebusan mata wang maya yang diberi kepada pelanggan',
      
      discountPercentage: 'Kadar Diskaun',
      discountPercentageInfo: 'Peratusan diskaun berbanding hasil. Kadar rendah tingkatkan keuntungan, tetapi diskaun tarik pelanggan baharu',
      
      revenueOverTime: 'Trend Jualan',
      revenueOverTimeInfo: 'Trend jualan harian termasuk jumlah hasil, hasil bersih dan diskaun',
      
      discountBreakdown: 'Pecahan Diskaun',
      discountBreakdownInfo: 'Bahagian diskaun terjamin (tetap) dan tebusan mata wang maya (ganjaran terkumpul)',
      guaranteedDiscount: 'Diskaun Terjamin',
      vcRedeemed: 'Tebusan VC',
      
      uplineRewards: 'Agihan Ganjaran Rujukan',
      uplineRewardsInfo: 'Ganjaran mata wang maya yang diberikan kepada pelanggan yang merujuk pelanggan baharu, mengikut peringkat rujukan',
      totalPaid: 'Jumlah Dibayar',
      avgReward: 'Purata',
      recipients: 'orang',
      rewards: 'ganjaran',
      
      // Subheadings/descriptions
      last30Days: '30 hari lepas',
      last14Days: '14 hari lepas',
      last7Days: '7 hari lepas',
      ofGross: 'daripada jumlah',
      avg: 'Purata',
      revenueVsDiscount: 'Hasil vs Diskaun',
      firstTimeDiscount: 'Diskaun pelanggan kali pertama',
      virtualCurrencyRedeemed: 'Mata wang maya ditebus',
      recentRevenueTrend: 'Trend Hasil Terkini',
      days7: '7h',
      days14: '14h',
      days30: '30h',
      noRewardsYet: 'Tiada ganjaran rujukan diagihkan lagi.',
      comingSoon: '📈 Lebih banyak analitik perniagaan akan datang: Carta hasil, peta haba waktu puncak, perbandingan cawangan, prestasi kakitangan',
    },
    
    // Tab Wawasan Pelanggan
    customerInsights: {
      totalCustomers: 'Jumlah Pelanggan',
      totalCustomersInfo: 'Jumlah pelanggan unik yang telah melawat restoran anda',
      
      activeCustomers: 'Pelanggan Aktif',
      activeCustomersInfo: 'Pelanggan yang melawat dalam 60 hari terakhir (Skor Kekinian ≥ 3)',
      
      atRiskCustomers: 'Berisiko',
      atRiskCustomersInfo: 'Pelanggan yang sebelumnya aktif tetapi tidak melawat baru-baru ini. Perlukan kempen penglibatan semula',
      ofTotal: 'daripada jumlah',
      
      avgLifetimeValue: 'Purata Nilai Seumur Hidup',
      avgLifetimeValueInfo: 'Purata jumlah perbelanjaan setiap pelanggan merentasi semua lawatan mereka',
      
      rfmSegmentation: 'Segmentasi Pelanggan (Analisis RFM)',
      rfmSegmentationInfo: `Analisis RFM menilai pelanggan pada tiga dimensi menggunakan kedudukan berasaskan persentil (skala 1-5):

• Kekinian (R): Berapa baru-baru ini mereka melawat?
  - Skor 5: 20% teratas pelawat terbaru (cth: dalam 30 hari terakhir)
  - Skor 4: Persentil 20-40% (cth: 31-60 hari lalu)
  - Skor 3: Persentil 40-60% (cth: 61-90 hari lalu)
  - Skor 2: Persentil 60-80% (cth: 91-180 hari lalu)
  - Skor 1: 20% terbawah paling lama (cth: >180 hari lalu)

• Kekerapan (F): Berapa kerap mereka melawat berbanding yang lain?
  - Skor 5: 20% teratas pelawat paling kerap
  - Skor 4: Persentil 20-40%
  - Skor 3: Persentil 40-60%
  - Skor 2: Persentil 60-80%
  - Skor 1: 20% terbawah paling jarang
  Nota: Skor adalah relatif kepada pangkalan pelanggan anda, bukan nombor mutlak

• Monetari (M): Berapa banyak mereka berbelanja berbanding yang lain?
  - Skor 5: 20% teratas pembelanja tertinggi
  - Skor 4: Persentil 20-40%
  - Skor 3: Persentil 40-60%
  - Skor 2: Persentil 60-80%
  - Skor 1: 20% terbawah pembelanja terendah

Definisi Segmen:
• Juara (R:5, F:4-5, M:4-5): Pelanggan terbaik - baru-baru ini, kerap, perbelanjaan tinggi
• Setia (R:3-5, F:3-5, M:3-5): Pelanggan tetap dengan tingkah laku konsisten
• Berpotensi (R:4-5, F:1-3, M:1-3): Pelanggan baru-baru ini menunjukkan janji
• Baharu (R:5, F:1, M:1-2): Pelawat kali pertama, perlukan penjagaan
• Berisiko (R:2-3, F:2-5, M:2-5): Sebelumnya aktif tetapi tidak melawat baru-baru ini
• Tidak Boleh Hilang (R:1-2, F:4-5, M:4-5): Pelanggan bernilai tinggi berisiko hilang
• Hibernasi (R:1-2, F:1-2, M:1-2): Pelanggan bernilai rendah tidak aktif
• Menjanjikan (R:3-4, F:1, M:1): Pelawat pertama kali baru-baru ini dengan potensi

Mengapa Persentil? Ini memastikan perbandingan adil apabila perniagaan anda berkembang. Pelanggan dengan 5 lawatan mungkin "kerap" untuk restoran baharu tetapi "jarang" untuk restoran yang mantap.`,
      rfmSegmentationSubtitle: 'Berdasarkan Kekinian, Kekerapan, dan nilai Monetari',
      
      champions: 'Juara',
      championsDesc: 'Pelanggan terbaik',
      loyal: 'Setia',
      loyalDesc: 'Pelawat tetap',
      potential: 'Bintang Meningkat',
      potentialDesc: 'Kesetiaan berkembang',
      newCustomers: 'Baru',
      newCustomersDesc: 'Kali pertama',
      atRisk: 'Berisiko',
      atRiskDesc: 'Perlukan perhatian',
      cantLose: 'Amaran VIP',
      cantLoseDesc: 'Nilai tinggi',
      hibernating: 'Tidak Aktif',
      hibernatingDesc: 'Tidak aktif',
      promising: 'Peneroka',
      promisingDesc: 'Menguji',
      
      segmentChampions: 'Juara',
      segmentChampionsInfo: 'Pelanggan VIP - melawat kerap, baru-baru ini, dan berbelanja paling banyak (R:5, F:5, M:5)',
      segmentLoyal: 'Pelanggan Setia',
      segmentLoyalInfo: 'Pelanggan tetap yang boleh dipercayai, kerap melawat dan berbelanja konsisten (R:4-5, F:4-5, M:4-5)',
      segmentPotentialLoyalists: 'Bintang Meningkat',
      segmentPotentialLoyalistsInfo: 'Pelanggan berulang baru-baru ini membina kesetiaan - pelihara mereka (R:4-5, F:2-3, M:2-3)',
      segmentNewCustomers: 'Pelanggan Baru',
      segmentNewCustomersInfo: 'Pelawat baharu membuat tanggapan pertama (R:5, F:1, M:1-2)',
      segmentPromising: 'Peneroka',
      segmentPromisingInfo: 'Pendatang baru yang ingin tahu menguji restoran anda - tukarkan mereka (R:3-4, F:1, M:1)',
      segmentAtRisk: 'Berisiko',
      segmentAtRiskInfo: 'Pelanggan tetap yang semakin pudar, dulu kerap melawat tetapi kini hilang (R:2-3, F:2-5, M:2-5)',
      segmentCantLoseThem: 'Amaran VIP',
      segmentCantLoseThemInfo: 'Pelanggan setia berbelanja tinggi berhenti melawat - menangkan mereka kembali! (R:1-2, F:4-5, M:4-5)',
      segmentHibernating: 'Tidak Aktif',
      segmentHibernatingInfo: 'Pelanggan berbelanja rendah yang sudah lama tidak melawat - mungkin hilang (R:1-2, F:1-2, M:1-2)',
      
      acquisitionSources: 'Sumber Perolehan Pelanggan',
      acquisitionSourcesInfo: 'Bagaimana pelanggan menemui restoran anda: melalui rujukan atau sebagai walk-in',
      referrals: 'Rujukan',
      walkIns: 'Walk-in',
      walkInsDesc: 'Pelanggan langsung',
      
      // Subheadings/descriptions
      active: 'aktif',
      acquisition: 'Pemerolehan',
      fromReferrals: 'Daripada rujukan',
      customers: 'pelanggan',
      perCustomer: 'Setiap pelanggan',
      customerAcquisitionSources: 'Sumber Pemerolehan Pelanggan',
      
      topCustomers: '10 Pelanggan Teratas mengikut Perbelanjaan',
      topCustomersInfo: 'Pelanggan bernilai tertinggi anda disusun mengikut jumlah perbelanjaan seumur hidup',
      visits: 'lawatan',
      noCustomers: 'Tiada data pelanggan tersedia lagi.',
      
      atRiskList: 'Pelanggan Berisiko (Perlukan Penglibatan Semula)',
      atRiskListInfo: 'Pelanggan yang sebelumnya aktif tetapi tidak kembali baru-baru ini. Pertimbangkan menghantar tawaran istimewa',
      lastVisit: 'Lawatan terakhir',
      daysAgo: 'hari lalu',
      reengagementTip: '💡 Petua: Hantar tawaran istimewa atau bonus kepada pelanggan ini untuk melibatkan mereka semula!',
      comingSoon: '👥 Lebih banyak pandangan pelanggan akan datang: Analisis pengekalan kohort, ramalan CLV, ramalan churn, corak kekerapan lawatan',
    },
    
    // Umum
    loading: 'Memuatkan data papan pemuka...',
    error: 'Gagal memuatkan data papan pemuka',
    retry: 'Cuba Lagi',
  },
};
