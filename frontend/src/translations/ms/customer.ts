export const dashboardInfo = {
  restaurantInfo: {
    title: 'Bagaimana Ia Berfungsi',
    item1: 'Lawati restoran dan buat transaksi untuk membuka kunci promosi restoran tersebut',
    item2: 'Kod rujukan unik anda dicipta secara automatik apabila anda membuat lawatan pertama',
    item3: 'Kongsi pautan rujukan anda dengan rakan melalui WhatsApp, Facebook, atau salin pautan',
    item4: 'Apabila seseorang menggunakan pautan anda dan membuat transaksi pertama di restoran tersebut, anda berdua memperoleh mata wang maya',
  },
  currencyInfo: {
    title: 'Mata Wang Maya Khusus Restoran',
    item1: '<strong>Khusus Restoran:</strong> Setiap restoran mempunyai baki mata wang maya yang berasingan',
    item2: 'Peroleh mata wang maya dengan merujuk rakan ke restoran tertentu',
    item3: 'Mata wang yang diperoleh daripada satu restoran hanya boleh ditebus di restoran yang sama',
    item4: 'Ini memastikan pengagihan yang adil dan mencegah penyalahgunaan merentas restoran yang berbeza',
    item5: '<strong>Diperoleh:</strong> Jumlah mata wang maya yang anda peroleh daripada rujukan di restoran ini',
    item6: '<strong>Ditebus:</strong> Jumlah yang telah anda gunakan untuk diskaun di restoran ini',
  },
};

export const profile = {
  welcome: 'Selamat kembali',
  greeting: 'Hello',
  viewProfile: 'Lihat Profil',
  settings: 'Tetapan',
  logout: 'Log Keluar',
};

export const stats = {
  totalEarned: 'Jumlah Diperoleh',
  totalRedeemed: 'Jumlah Ditebus',
  totalReferred: 'Jumlah Rujukan',
  vcBalance: 'Baki VC',
  activeReferrals: 'Rujukan Aktif',
  totalSpent: 'Jumlah Perbelanjaan',
};

export const recentTransactions = {
  title: 'Transaksi Terkini',
  noTransactions: 'Tiada transaksi lagi. Mulakan makan di restoran rakan kongsi kami untuk mendapat ganjaran!',
  firstVisit: 'Lawatan Pertama!',
  discount: 'diskaun',
  vcUsed: 'VC digunakan',
  vcEarned: 'VC diperoleh',
  unrealized: 'Pendapatan Belum Direalisasi',
  unrealizedDesc: 'Kongsi kod anda untuk membuka kunci pendapatan berpotensi ini',
  viewDetails: 'Lihat Butiran Penuh',
  tapToView: 'Ketik untuk lihat butiran',
};

export const restaurantSorting = {
  recent: 'Terkini',
  balance: 'Baki',
  visits: 'Lawatan',
};

export const promoteRestaurants = {
  title: 'Promosi Restoran',
  subtitle: 'Kongsi kod untuk restoran yang telah anda lawati',
  noRestaurants: 'Tiada restoran yang dilawati lagi',
  noRestaurantsDesc: 'Lawati restoran dan buat transaksi pertama anda untuk mula mempromosi!',
};

export const restaurantCard = {
  share: 'Kongsi Restoran',
  vcBalance: 'Baki VC',
  totalSpent: 'Jumlah Perbelanjaan',
  visits: 'lawatan',
  visit: 'lawatan',
  active: 'Aktif',
  earnUpTo: 'Peroleh sehingga',
  unrealized: 'belum direalisasi',
  recentActivity: 'Aktiviti Terkini',
};

export const shareSheet = {
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
};

export const transactionDetail = {
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
};

export const referralInfo = {
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
};

export const demo = {
  title: 'Papan Pemuka Demo',
  subtitle: 'Alami MalaChilli',
  description: 'Ini adalah papan pemuka demo yang menunjukkan cara pengalaman pelanggan berfungsi.',
  tryItOut: 'Cuba Sekarang',
  features: 'Ciri-ciri',
  howItWorks: 'Cara Ia Berfungsi',
  getStarted: 'Mulakan',
};

export const qrCode = {
  title: 'Kod QR Anda',
  subtitle: 'Tunjukkan ini kepada kakitangan semasa membuat transaksi',
  close: 'Tutup',
  idLabel: 'ID:',
};

export const settings = {
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
  nameUpdateFailed: 'Gagal mengemas kini nama',
  nameEmpty: 'Nama tidak boleh kosong',
  deleteAccount: 'Padam Akaun',
  deleteConfirmTitle: 'Padam Akaun?',
  deleteConfirmDesc: 'Tindakan ini tidak boleh dibuat asal. Anda akan kehilangan semua mata yang diperoleh dan sejarah rujukan.',
  confirmDelete: 'Ya, Padam Akaun Saya',
  deleteFailed: 'Gagal memadam akaun. Sila cuba lagi.',
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
};
