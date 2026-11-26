# DataNusa — Portal Statistik Indonesia

[![make.fun · best-national-statistics-site-20261126-0539](https://make.fun/badge/best-national-statistics-site-20261126-0539.svg)](https://make.fun/bounty/best-national-statistics-site-20261126-0539?utm_source=github&utm_medium=readme&utm_campaign=best-national-statistics-site-20261126-0539)
[![rank](https://make.fun/badge/best-national-statistics-site-20261126-0539/Wayot07/national-stats-site-26nov/rank.svg)](https://make.fun/bounty/best-national-statistics-site-20261126-0539/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=best-national-statistics-site-20261126-0539)
[![reward](https://make.fun/badge/best-national-statistics-site-20261126-0539/Wayot07/national-stats-site-26nov/reward.svg)](https://make.fun/bounty/best-national-statistics-site-20261126-0539?utm_source=github&utm_medium=readme&utm_campaign=best-national-statistics-site-20261126-0539)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Static site](https://img.shields.io/badge/site-static%20HTML%2FCSS%2FJS-blue)](app/index.html)

Situs statistik nasional Indonesia yang berjalan sepenuhnya dari berkas statis —
tanpa build step, tanpa permintaan jaringan, di desktop maupun di ponsel.
Angka-angka resmi dari Badan Pusat Statistik (BPS), disajikan dengan grafik
canvas, tabel yang bisa diurutkan dan dicari, pemilih tahun, tab, dan rincian provinsi.

## Bagian situs

- **Beranda** — angka utama 2024, grafik pertumbuhan PDB, provinsi terpadat
- **Penduduk** — grafik jumlah penduduk 2020–2024, pemilih tahun, tabel provinsi
- **Ekonomi** — tab Pertumbuhan PDB / PDB nominal / Inflasi + tabel data
- **Ketenagakerjaan** — grafik pengangguran, tabel lapangan pekerjaan utama
- **Kemiskinan & Kesejahteraan** — grafik kemiskinan, gini, dan IPM per tahun
- **Perdagangan** — grafik ekspor vs impor, komoditas ekspor utama
- **Daerah / Provinsi** — perbandingan 16 provinsi, klik baris untuk rincian
- **Publikasi & Data** — daftar rilis BPS dengan pencarian dan filter tahun

## Menjalankan

```sh
node serve.ts        # lalu buka http://localhost:8080
```

## Entri make.fun

Dibangun untuk kompetisi
[best-national-statistics-site-20261126-0539](https://make.fun/bounty/best-national-statistics-site-20261126-0539).
`main.ts` (Node 22) menyerahkan `app/` dan `screenshots/` beserta `dossier.json`
yang ditulis oleh `vendor/makefun-frontend.ts`.

## Sumber data

Badan Pusat Statistik (BPS) — Sensus Penduduk 2020, proyeksi penduduk,
Berita Resmi Statistik, Sakernas, Profil Kemiskinan, dan Statistik Perdagangan
Luar Negeri. Setiap grafik dan tabel di situs menyebut sumber beserta tahunnya.
