export const merchantDashboard = {
  title: 'Papan Pemuka Pemilik',
  settings: 'Tetapan',
  
  // Tabs
  tabs: {
    viralPerformance: 'Prestasi Rujukan',
    businessMetrics: 'Metrik Perniagaan',
    customerInsights: 'Wawasan Pelanggan',
  },
  
  // Management Panel
  management: {
    title: 'Pengurusan',
    manageStaff: 'Urus Kakitangan',
    manageStaffDesc: 'Tambah, edit dan urus akaun kakitangan',
    manageBranches: 'Urus Cawangan',
    manageBranchesDesc: 'Tambah dan urus cawangan restoran',
    restaurantSettings: 'Tetapan Restoran',
    restaurantSettingsDesc: 'Kemas kini butiran dan keutamaan restoran',
  },
  
  // Viral Performance Tab
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
    networkGrowthTrend: 'Trend Pertumbuhan Rangkaian',
    comingSoon: '📊 Lebih banyak analitik viral akan datang: Visualisasi rangkaian, analisis tingkah laku perkongsian, penjejakan K-factor',
  },
  
  // Business Metrics Tab
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
    comingSoon: '📈 Lebih banyak analitik akan datang: Carta hasil, peta haba waktu puncak, perbandingan cawangan, prestasi kakitangan',
    
    // Transactions Tab
    transactions: {
      searchPlaceholder: 'Cari Pelanggan, E-mel atau ID Transaksi...',
      filter: {
        today: 'Hari Ini',
        '7d': '7 Hari',
        '30d': '30 Hari',
        all: 'Semua'
      },
      columns: {
        date: 'Tarikh & Masa',
        customer: 'Pelanggan',
        branch: 'Cawangan',
        amount: 'Jumlah Bil',
        discount: 'Diskaun',
        net: 'Jumlah Bersih',
        status: 'Status'
      },
      status: {
        firstVisit: 'Lawatan Pertama',
        returning: 'Berulang'
      },
      noData: 'Tiada transaksi dijumpai untuk tempoh yang dipilih.',
      showing: 'Menunjukkan',
      of: 'daripada',
      results: 'keputusan'
    },
  },
  
  // Customer Insights Tab
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
    
    walkIns: 'Walk-in',
    walkInsDesc: 'Pelanggan langsung',
    
    // Subheadings/descriptions
    active: 'aktif',
    acquisition: 'Pemerolehan',
    fromReferrals: 'Daripada rujukan',
    customers: 'pelanggan',
    perCustomer: 'Setiap pelanggan',
    customerAcquisitionSources: 'Sumber Pemerolehan Pelanggan',
    
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
    
    // RFM Segment Full Names
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
};
