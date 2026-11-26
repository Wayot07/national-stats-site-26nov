// Data statistik Indonesia — angka publik Badan Pusat Statistik (BPS),
// dibulatkan ke satu-dua desimal. Setiap tampilan menyebut sumber + tahun.
// Estimasi/proyeksi diberi label jelas. Tidak ada angka yang diarang-arang.
export const SOURCES = {
  bps: 'Badan Pusat Statistik (BPS)',
  note: 'Angka dibulatkan; lihat catatan sumber di bawah setiap grafik dan tabel.',
};

export const YEARS = [2020, 2021, 2022, 2023, 2024];

// Jumlah penduduk (juta jiwa) — Sensus Penduduk 2020 + proyeksi BPS
export const POPULATION = [
  { year: 2020, value: 270.2 },
  { year: 2021, value: 272.3 },
  { year: 2022, value: 275.8 },
  { year: 2023, value: 278.7 },
  { year: 2024, value: 281.6 },
];

// Pertumbuhan ekonomi, % y-on-y — BPS, Berita Resmi Statistik
export const GDP_GROWTH = [
  { year: 2020, value: -2.07 },
  { year: 2021, value: 3.7 },
  { year: 2022, value: 5.31 },
  { year: 2023, value: 5.05 },
  { year: 2024, value: 5.03 },
];

// PDB harga berlaku (Rp triliun) — BPS
export const GDP_NOMINAL = [
  { year: 2020, value: 15434 },
  { year: 2021, value: 16976 },
  { year: 2022, value: 19588 },
  { year: 2023, value: 20892 },
  { year: 2024, value: 22139 },
];

// Inflasi Desember y-on-y, % — BPS
export const INFLATION = [
  { year: 2020, value: 1.68 },
  { year: 2021, value: 1.87 },
  { year: 2022, value: 5.51 },
  { year: 2023, value: 2.61 },
  { year: 2024, value: 1.57 },
];

// Tingkat Pengangguran Terbuka, Agustus, % — BPS (Sakernas)
export const UNEMPLOYMENT = [
  { year: 2020, value: 7.07 },
  { year: 2021, value: 6.49 },
  { year: 2022, value: 5.86 },
  { year: 2023, value: 5.32 },
  { year: 2024, value: 4.91 },
];

// Tingkat kemiskinan, September, % — BPS
export const POVERTY = [
  { year: 2020, value: 10.19 },
  { year: 2021, value: 9.71 },
  { year: 2022, value: 9.57 },
  { year: 2023, value: 9.36 },
  { year: 2024, value: 8.57 },
];

// Ekspor & impor (miliar US$) — BPS / Kementerian Perdagangan
export const TRADE = [
  { year: 2020, ekspor: 163.2, impor: 141.6 },
  { year: 2021, ekspor: 231.6, impor: 196.2 },
  { year: 2022, ekspor: 291.9, impor: 237.5 },
  { year: 2023, ekspor: 258.8, impor: 221.9 },
  { year: 2024, ekspor: 264.7, impor: 233.7 },
];

// Rasio gini (Maret) dan IPM — BPS
export const WELFARE = [
  { year: 2020, gini: 0.381, ipm: 71.94 },
  { year: 2021, gini: 0.384, ipm: 72.29 },
  { year: 2022, gini: 0.381, ipm: 73.37 },
  { year: 2023, gini: 0.379, ipm: 74.39 },
  { year: 2024, gini: 0.379, ipm: 75.02 },
];

// Penduduk menurut lapangan pekerjaan utama, Agustus 2024, % — BPS (Sakernas)
export const SECTORS = [
  { sector: 'Pertanian, kehutanan, dan perikanan', share: 28.5 },
  { sector: 'Perdagangan besar dan eceran', share: 18.9 },
  { sector: 'Industri pengolahan', share: 13.9 },
  { sector: 'Penyediaan akomodasi dan makan minum', share: 7.3 },
  { sector: 'Konstruksi', share: 7.5 },
  { sector: 'Jasa lainnya', share: 23.9 },
];

// Komoditas ekspor utama 2024 (tanpa nilai per komoditas — urutan menurut BPS)
export const TOP_EXPORTS = [
  { komoditas: 'Batu bara', catatan: 'Komoditas ekspor terbesar Indonesia' },
  { komoditas: 'Minyak kelapa sawit (CPO) dan turunannya', catatan: 'Ekspor utama sektor perkebunan' },
  { komoditas: 'Besi dan baja', catatan: 'Tumbuh pesat dari hilirisasi nikel' },
  { komoditas: 'Peralatan listrik dan elektronik', catatan: 'Ekspor manufaktur bernilai tambah' },
  { komoditas: 'Karet dan barang dari karet', catatan: 'Ekspor utama sektor pertanian' },
];

// Provinsi: penduduk 2024 (juta jiwa, proyeksi BPS) + tingkat kemiskinan Sep 2024 (%)
export const PROVINCES = [
  { name: 'Jawa Barat', pop: 50.35, poverty: 7.46, capital: 'Bandung' },
  { name: 'Jawa Timur', pop: 41.81, poverty: 10.35, capital: 'Surabaya' },
  { name: 'Jawa Tengah', pop: 37.89, poverty: 10.47, capital: 'Semarang' },
  { name: 'Sumatera Utara', pop: 16.03, poverty: 8.14, capital: 'Medan' },
  { name: 'Banten', pop: 12.43, poverty: 5.84, capital: 'Serang' },
  { name: 'DKI Jakarta', pop: 10.68, poverty: 4.14, capital: 'Jakarta' },
  { name: 'Sulawesi Selatan', pop: 9.46, poverty: 8.3, capital: 'Makassar' },
  { name: 'Lampung', pop: 9.22, poverty: 10.69, capital: 'Bandar Lampung' },
  { name: 'Sumatera Selatan', pop: 8.84, poverty: 11.78, capital: 'Palembang' },
  { name: 'Riau', pop: 6.64, poverty: 6.68, capital: 'Pekanbaru' },
  { name: 'Kalimantan Barat', pop: 5.8, poverty: 6.79, capital: 'Pontianak' },
  { name: 'Sumatera Barat', pop: 5.76, poverty: 5.78, capital: 'Padang' },
  { name: 'Aceh', pop: 5.48, poverty: 12.64, capital: 'Banda Aceh' },
  { name: 'Nusa Tenggara Barat', pop: 5.68, poverty: 12.11, capital: 'Mataram' },
  { name: 'Kalimantan Timur', pop: 3.89, poverty: 6.11, capital: 'Samarinda' },
  { name: 'Papua Pegunungan', pop: 1.47, poverty: 33.97, capital: 'Wamena' },
];

// Publikasi / rilis (judul + tahun + sumber)
export const RELEASES = [
  { title: 'Berita Resmi Statistik: Pertumbuhan Ekonomi Indonesia 2024', year: 2025, source: 'BPS' },
  { title: 'Statistik Indonesia 2025', year: 2025, source: 'BPS' },
  { title: 'Profil Kemiskinan di Indonesia, September 2024', year: 2025, source: 'BPS' },
  { title: 'Keadaan Ketenagakerjaan Indonesia, Agustus 2024', year: 2024, source: 'BPS' },
  { title: 'Indeks Pembangunan Manusia 2024', year: 2024, source: 'BPS' },
  { title: 'Statistik Perdagangan Luar Negeri Indonesia 2024', year: 2025, source: 'BPS' },
  { title: 'Hasil Sensus Penduduk 2020', year: 2021, source: 'BPS' },
  { title: 'Proyeksi Penduduk Indonesia 2020–2050', year: 2023, source: 'BPS' },
];

export const HEADLINE = {
  population: { value: '281,6 jt', label: 'Penduduk 2024', source: 'BPS, proyeksi' },
  gdp: { value: 'Rp22.139 T', label: 'PDB 2024 (harga berlaku)', source: 'BPS' },
  growth: { value: '5,03%', label: 'Pertumbuhan ekonomi 2024', source: 'BPS' },
  inflation: { value: '1,57%', label: 'Inflasi Des 2024 (y-on-y)', source: 'BPS' },
  unemployment: { value: '4,91%', label: 'Pengangguran, Agu 2024', source: 'BPS' },
  poverty: { value: '8,57%', label: 'Kemiskinan, Sep 2024', source: 'BPS' },
};
