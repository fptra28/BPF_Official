const path = require('path');

/** @type {import('next-i18next').UserConfig} */
module.exports = {
  i18n: {
    defaultLocale: 'id',
    locales: ['id', 'en'],
    localeDetection: false,
    localePath: path.resolve('./public/locales'),
  },
  defaultNS: 'common',
  ns: [
    'common', 'aboutus', 'footer', 'produk', 'berita',
    'informasi', 'profil_perusahaan', 'market', 'pengumuman',
    'welcome', 'legalitas_bisnis', 'wakil_pialang', 'badan_regulasi',
    'fasilitas_layanan', 'penghargaan', 'sertifikat', 'video',
    'symbol-indeks', 'loco-london-gold', 'hubungi-kami', 'ilustrasi-transaksi', 'summer-winter',
    'economic-calendar', 'historical-data', 'mekanisme-perdagangan',
    'pivot-fibonacci', 'prosedur', 'header', 'analisis'
  ],
  fallbackLng: 'id',
  react: {
    useSuspense: false,
    transSupportBasicHtmlNodes: true,
    transKeepBasicHtmlNodesFor: ['br', 'strong', 'i', 'p', 'b', 'em'],
  },
  interpolation: {
    escapeValue: false,
  },
  preload: ['id', 'en'],
  saveMissing: true,
  returnObjects: true,
  compatibilityJSON: 'v3',
  reloadOnPrerender: process.env.NODE_ENV === 'development',
  debug: process.env.NODE_ENV === 'development',
};
