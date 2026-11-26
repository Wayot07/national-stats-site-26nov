// Router + tampilan DataNusa — Portal Statistik Indonesia.
// Semua angka berasal dari data.js (BPS) dan dirender di sini.
import {
  HEADLINE, POPULATION, GDP_GROWTH, GDP_NOMINAL, INFLATION, UNEMPLOYMENT,
  POVERTY, TRADE, WELFARE, SECTORS, TOP_EXPORTS, PROVINCES, RELEASES, YEARS,
} from './data.js';
import { drawLineChart, drawBarChart, drawGroupedBars } from './charts.js';

const app = document.getElementById('app');
const pendingBinds = [];
const fmtID = (n, d = 1) => n.toLocaleString('id-ID', { minimumFractionDigits: d, maximumFractionDigits: d });
const fmtPct = (n) => fmtID(n, 2) + '%';
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

function sourceLine(text) {
  return `<p class="source">Sumber: ${esc(text)}</p>`;
}

function kpiCards() {
  return `<section class="kpis" aria-label="Angka utama">
    ${Object.values(HEADLINE).map((h) => `
      <article class="kpi"><div class="kpi-value">${h.value}</div>
      <div class="kpi-label">${h.label}</div>
      <div class="kpi-source">${h.source}</div></article>`).join('')}
  </section>`;
}

function navCards() {
  const cards = [
    ['#/penduduk', 'Penduduk', 'Jumlah penduduk 2020–2024 dan sebaran provinsi'],
    ['#/ekonomi', 'Ekonomi', 'Pertumbuhan PDB, PDB nominal, dan inflasi'],
    ['#/kerja', 'Ketenagakerjaan', 'Pengangguran dan lapangan pekerjaan utama'],
    ['#/miskin', 'Kemiskinan & Kesejahteraan', 'Kemiskinan, rasio gini, dan IPM'],
    ['#/dagang', 'Perdagangan', 'Ekspor, impor, dan komoditas utama'],
    ['#/daerah', 'Daerah / Provinsi', 'Perbandingan 16 provinsi'],
    ['#/publikasi', 'Publikasi & Data', 'Rilis resmi dan publikasi BPS'],
  ];
  return `<section class="cards">${cards.map(([href, t, d]) => `
    <a class="card" href="${href}"><h3>${t}</h3><p>${d}</p><span class="card-go">Buka →</span></a>`).join('')}</section>`;
}

// ---------- Beranda ----------
function viewHome() {
  const top5 = [...PROVINCES].sort((a, b) => b.pop - a.pop).slice(0, 5);
  return `
  <section class="hero">
    <h1>Statistik Indonesia, satu tempat.</h1>
    <p class="lede">Angka-angka resmi tentang penduduk, ekonomi, pekerjaan, kemiskinan,
    dan perdagangan Indonesia — dari Badan Pusat Statistik, disajikan agar mudah dibaca
    di layar besar maupun di ponsel.</p>
  </section>
  ${kpiCards()}
  <section class="panel">
    <h2>Pertumbuhan ekonomi 2020–2024</h2>
    <canvas id="chart-home-gdp" height="280"></canvas>
    ${sourceLine('Badan Pusat Statistik (BPS), Berita Resmi Statistik — pertumbuhan PDB y-on-y.')}
  </section>
  <section class="panel">
    <h2>Provinsi terpadat</h2>
    <table class="tbl"><thead><tr><th>Provinsi</th><th>Penduduk (juta)</th><th>Kemiskinan (%)</th></tr></thead>
    <tbody>${top5.map((p) => `<tr><td><a href="#/daerah">${esc(p.name)}</a></td><td>${fmtID(p.pop)}</td><td>${fmtID(p.poverty)}</td></tr>`).join('')}</tbody></table>
    ${sourceLine('BPS, proyeksi penduduk 2024 dan Profil Kemiskinan September 2024.')}
    <p><a class="btn" href="#/daerah">Lihat semua provinsi →</a></p>
  </section>
  ${navCards()}`;
}

// ---------- Tabel yang bisa diurutkan + dicari ----------
function sortableTable(id, columns, rows, renderRow) {
  // columns: [{key, label, numeric}]
  let sortKey = columns[0].key;
  let sortDir = 1;
  const state = { query: '' };
  function render() {
    const q = state.query.trim().toLowerCase();
    let list = rows.filter((r) => !q || columns.some((c) => String(r[c.key]).toLowerCase().includes(q)));
    list = [...list].sort((a, b) => {
      const av = a[sortKey];
      const bv = b[sortKey];
      return (typeof av === 'number' && typeof bv === 'number' ? av - bv : String(av).localeCompare(String(bv), 'id')) * sortDir;
    });
    const body = document.getElementById(id + '-body');
    if (body) body.innerHTML = list.map(renderRow).join('') || `<tr><td colspan="${columns.length}">Tidak ada data yang cocok.</td></tr>`;
    document.querySelectorAll(`#${id} th[data-key]`).forEach((th) => {
      const k = th.dataset.key;
      th.classList.toggle('sorted-asc', k === sortKey && sortDir === 1);
      th.classList.toggle('sorted-desc', k === sortKey && sortDir === -1);
    });
  }
  const html = `<div class="table-tools">
      <label>Cari <input type="search" id="${id}-search" placeholder="Ketik untuk menyaring…" aria-label="Cari di tabel"></label>
      <span class="hint">Klik judul kolom untuk mengurutkan.</span>
    </div>
    <div class="table-wrap"><table class="tbl" id="${id}"><thead><tr>
      ${columns.map((c) => `<th data-key="${c.key}" class="${c.numeric ? 'num' : ''}" tabindex="0" role="button" aria-label="Urutkan berdasarkan ${c.label}">${c.label}</th>`).join('')}
    </tr></thead><tbody id="${id}-body"></tbody></table></div>`;
  return { html, bind() {
    document.getElementById(id + '-search').addEventListener('input', (e) => { state.query = e.target.value; render(); });
    document.querySelectorAll(`#${id} th[data-key]`).forEach((th) => {
      const go = () => {
        const k = th.dataset.key;
        if (sortKey === k) sortDir *= -1; else { sortKey = k; sortDir = 1; }
        render();
      };
      th.addEventListener('click', go);
      th.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); go(); } });
    });
    render();
  } };
}

// ---------- Penduduk ----------
function viewPopulation() {
  const t = sortableTable('tbl-prov', [
    { key: 'name', label: 'Provinsi' },
    { key: 'capital', label: 'Ibu kota' },
    { key: 'pop', label: 'Penduduk 2024 (juta)', numeric: true },
    { key: 'poverty', label: 'Kemiskinan Sep 2024 (%)', numeric: true },
  ], PROVINCES, (p) => `<tr><td>${esc(p.name)}</td><td>${esc(p.capital)}</td><td class="num">${fmtID(p.pop)}</td><td class="num">${fmtID(p.poverty)}</td></tr>`);
  pendingBinds.push(t.bind);
  return `
  <h1>Penduduk</h1>
  <p class="lede">Indonesia berpenduduk <strong>281,6 juta jiwa</strong> pada 2024 — negara
  keempat terpadat di dunia. Lebih dari separuh penduduk tinggal di Pulau Jawa.</p>
  ${kpiCards()}
  <section class="panel">
    <h2>Jumlah penduduk 2020–2024 (juta jiwa)</h2>
    <canvas id="chart-pop" height="280"></canvas>
    ${sourceLine('BPS — Sensus Penduduk 2020 dan proyeksi penduduk. Angka 2021–2024 adalah proyeksi.')}
  </section>
  <section class="panel">
    <h2>Lihat satu tahun</h2>
    <label>Tahun <select id="year-pop">${YEARS.map((y) => `<option ${y === 2024 ? 'selected' : ''}>${y}</option>`).join('')}</select></label>
    <p id="year-pop-out" class="big-number"></p>
    ${sourceLine('BPS — jumlah penduduk menurut tahun.')}
  </section>
  <section class="panel">
    <h2>Provinsi</h2>
    ${t.html}
    ${sourceLine('BPS — proyeksi penduduk 2024; tingkat kemiskinan September 2024. Tabel dapat diurutkan dan dicari.')}
  </section>`;
}

// ---------- Ekonomi ----------
function viewEconomy() {
  return `
  <h1>Ekonomi</h1>
  <p class="lede">PDB Indonesia 2024 mencapai <strong>Rp22.139 triliun</strong> dengan
  pertumbuhan <strong>5,03%</strong>. Inflasi Desember 2024 tercatat 1,57% (y-on-y).</p>
  <section class="panel">
    <h2>Pertumbuhan PDB</h2>
    <div class="tabs" role="tablist">
      <button class="tab active" data-tab="growth" role="tab" aria-selected="true">Pertumbuhan (%)</button>
      <button class="tab" data-tab="nominal" role="tab" aria-selected="false">PDB nominal (Rp triliun)</button>
      <button class="tab" data-tab="inflation" role="tab" aria-selected="false">Inflasi (%)</button>
    </div>
    <canvas id="chart-eco" height="280"></canvas>
    <p id="chart-eco-note" class="source"></p>
  </section>
  <section class="panel">
    <h2>Tabel data ekonomi</h2>
    <div class="table-wrap"><table class="tbl"><thead><tr><th>Tahun</th><th class="num">Pertumbuhan PDB (%)</th><th class="num">PDB (Rp triliun)</th><th class="num">Inflasi Des (%)</th></tr></thead>
    <tbody>${YEARS.map((y, i) => `<tr><td>${y}</td><td class="num">${fmtPct(GDP_GROWTH[i].value)}</td><td class="num">${GDP_NOMINAL[i].value.toLocaleString('id-ID')}</td><td class="num">${fmtPct(INFLATION[i].value)}</td></tr>`).join('')}</tbody></table></div>
    ${sourceLine('BPS — Berita Resmi Statistik; PDB harga berlaku; inflasi Desember y-on-y.')}
  </section>`;
}

// ---------- Ketenagakerjaan ----------
function viewWork() {
  const t = sortableTable('tbl-sector', [
    { key: 'sector', label: 'Lapangan pekerjaan utama' },
    { key: 'share', label: 'Pangsa pekerja (%)', numeric: true },
  ], SECTORS, (s) => `<tr><td>${esc(s.sector)}</td><td class="num">${fmtID(s.share)}</td></tr>`);
  pendingBinds.push(t.bind);
  return `
  <h1>Ketenagakerjaan</h1>
  <p class="lede">Tingkat Pengangguran Terbuka turun ke <strong>4,91%</strong> pada Agustus 2024,
  dari 7,07% pada Agustus 2020. Pertanian masih menyerap pekerja terbanyak.</p>
  <section class="panel">
    <h2>Pengangguran terbuka, Agustus 2020–2024 (%)</h2>
    <canvas id="chart-work" height="280"></canvas>
    ${sourceLine('BPS — Survei Angkatan Kerja Nasional (Sakernas), Agustus.')}
  </section>
  <section class="panel">
    <h2>Di mana orang Indonesia bekerja</h2>
    ${t.html}
    ${sourceLine('BPS — Sakernas Agustus 2024; pangsa dibulatkan, total 100%. Tabel dapat diurutkan dan dicari.')}
  </section>`;
}

// ---------- Kemiskinan ----------
function viewPoverty() {
  return `
  <h1>Kemiskinan &amp; Kesejahteraan</h1>
  <p class="lede">Tingkat kemiskinan turun ke <strong>8,57%</strong> pada September 2024 —
  terendah dalam sejarah pencatatan BPS. Indeks Pembangunan Manusia mencapai 75,02.</p>
  ${kpiCards()}
  <section class="panel">
    <h2>Kemiskinan, September 2020–2024 (%)</h2>
    <canvas id="chart-poor" height="280"></canvas>
    ${sourceLine('BPS — Profil Kemiskinan di Indonesia, September.')}
  </section>
  <section class="panel">
    <h2>Kesejahteraan menurut tahun</h2>
    <label>Tahun <select id="year-welfare">${YEARS.map((y) => `<option ${y === 2024 ? 'selected' : ''}>${y}</option>`).join('')}</select></label>
    <p id="year-welfare-out" class="big-number"></p>
    ${sourceLine('BPS — rasio gini Maret dan Indeks Pembangunan Manusia (IPM).')}
  </section>`;
}

// ---------- Perdagangan ----------
function viewTrade() {
  return `
  <h1>Perdagangan</h1>
  <p class="lede">Ekspor 2024 mencapai <strong>US$264,7 miliar</strong> dan impor
  <strong>US$233,7 miliar</strong> — surplus perdagangan <strong>US$31,0 miliar</strong>.</p>
  <section class="panel">
    <h2>Ekspor vs impor 2020–2024 (miliar US$)</h2>
    <canvas id="chart-trade" height="300"></canvas>
    ${sourceLine('BPS — Statistik Perdagangan Luar Negeri.')}
  </section>
  <section class="panel">
    <h2>Komoditas ekspor utama 2024</h2>
    <ol class="list">${TOP_EXPORTS.map((e) => `<li><strong>${esc(e.komoditas)}</strong> — ${esc(e.catatan)}</li>`).join('')}</ol>
    ${sourceLine('BPS — urutan komoditas ekspor utama menurut nilai.')}
  </section>
  <section class="panel">
    <h2>Neraca perdagangan per tahun</h2>
    <label>Tahun <select id="year-trade">${YEARS.map((y) => `<option ${y === 2024 ? 'selected' : ''}>${y}</option>`).join('')}</select></label>
    <p id="year-trade-out" class="big-number"></p>
    ${sourceLine('BPS — ekspor, impor, dan surplus dihitung dari keduanya.')}
  </section>`;
}

// ---------- Daerah ----------
function viewRegions() {
  const t = sortableTable('tbl-regions', [
    { key: 'name', label: 'Provinsi' },
    { key: 'pop', label: 'Penduduk 2024 (juta)', numeric: true },
    { key: 'poverty', label: 'Kemiskinan (%)', numeric: true },
  ], PROVINCES, (p) => `<tr data-name="${esc(p.name)}"><td>${esc(p.name)}</td><td class="num">${fmtID(p.pop)}</td><td class="num">${fmtID(p.poverty)}</td></tr>`);
  pendingBinds.push(t.bind);
  return `
  <h1>Daerah / Provinsi</h1>
  <p class="lede">Bandingkan 16 provinsi: penduduk terbanyak sampai tingkat kemiskinan tertinggi.
  Klik sebuah baris untuk melihat rinciannya.</p>
  <section class="panel">
    <h2>Perbandingan provinsi</h2>
    ${t.html}
    <div id="region-detail" class="detail" aria-live="polite"><p>Klik salah satu baris tabel untuk melihat rincian provinsi.</p></div>
    ${sourceLine('BPS — proyeksi penduduk 2024; tingkat kemiskinan September 2024.')}
  </section>`;
}

// ---------- Publikasi ----------
function viewPublications() {
  return `
  <h1>Publikasi &amp; Data</h1>
  <p class="lede">Rilis resmi yang dipakai di situs ini. Semua publikasi diterbitkan
  Badan Pusat Statistik dan dapat dicari menurut judul atau disaring menurut tahun.</p>
  <section class="panel">
    <label>Cari publikasi <input type="search" id="pub-search" placeholder="Mis. kemiskinan, PDB…" aria-label="Cari publikasi"></label>
    <label>Tahun <select id="pub-year"><option value="">Semua tahun</option>${[...new Set(RELEASES.map((r) => r.year))].sort((a, b) => b - a).map((y) => `<option>${y}</option>`).join('')}</select></label>
    <ul class="list" id="pub-list"></ul>
    <p id="pub-count" class="source"></p>
    ${sourceLine('Badan Pusat Statistik (BPS) — daftar rilis dan publikasi.')}
  </section>`;
}

// ---------- Router ----------
const ROUTES = {
  '': { view: viewHome, after: () => drawLineChart(document.getElementById('chart-home-gdp'), GDP_GROWTH, { label: (p) => fmtPct(p.value), aria: 'Pertumbuhan PDB 2020 sampai 2024' }) },
  penduduk: { view: viewPopulation, after: () => {
    drawBarChart(document.getElementById('chart-pop'), POPULATION, { label: (p) => fmtID(p.value), fmt: (v) => String(Math.round(v)), aria: 'Jumlah penduduk 2020 sampai 2024' });
    const sel = document.getElementById('year-pop');
    const out = document.getElementById('year-pop-out');
    const show = () => {
      const y = Number(sel.value);
      const row = POPULATION.find((p) => p.year === y);
      out.textContent = `Tahun ${y}: ${fmtID(row.value)} juta jiwa`;
    };
    sel.addEventListener('change', show);
    show();
  } },
  ekonomi: { view: viewEconomy, after: () => {
    const notes = {
      growth: 'BPS — pertumbuhan PDB y-on-y, 2020–2024. Tahun 2020 minus karena pandemi COVID-19.',
      nominal: 'BPS — PDB atas dasar harga berlaku, 2020–2024 (Rp triliun).',
      inflation: 'BPS — inflasi Desember y-on-y; lonjakan 2022 mengikuti kenaikan harga BBM bersubsidi.',
    };
    const draw = (key) => {
      const data = key === 'growth' ? GDP_GROWTH : key === 'nominal' ? GDP_NOMINAL : INFLATION;
      const label = key === 'nominal' ? (p) => p.value.toLocaleString('id-ID') : (p) => fmtPct(p.value);
      const fmt = key === 'nominal' ? (v) => v.toLocaleString('id-ID') : undefined;
      drawLineChart(document.getElementById('chart-eco'), data, { label, fmt, aria: 'Grafik ekonomi' });
      document.getElementById('chart-eco-note').textContent = 'Sumber: ' + notes[key];
    };
    let current = 'growth';
    draw(current);
    document.querySelectorAll('.tab[data-tab]').forEach((btn) => btn.addEventListener('click', () => {
      document.querySelectorAll('.tab[data-tab]').forEach((b) => { b.classList.remove('active'); b.setAttribute('aria-selected', 'false'); });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');
      current = btn.dataset.tab;
      draw(current);
    }));
  } },
  kerja: { view: viewWork, after: () => {
    drawLineChart(document.getElementById('chart-work'), UNEMPLOYMENT, { label: (p) => fmtPct(p.value), aria: 'Pengangguran terbuka 2020 sampai 2024' });
  } },
  miskin: { view: viewPoverty, after: () => {
    drawLineChart(document.getElementById('chart-poor'), POVERTY, { label: (p) => fmtPct(p.value), aria: 'Tingkat kemiskinan 2020 sampai 2024' });
    const sel = document.getElementById('year-welfare');
    const out = document.getElementById('year-welfare-out');
    const show = () => {
      const y = Number(sel.value);
      const row = WELFARE.find((w) => w.year === y);
      out.textContent = `Tahun ${y}: rasio gini ${fmtID(row.gini, 3)} · IPM ${fmtID(row.ipm)}`;
    };
    sel.addEventListener('change', show);
    show();
  } },
  dagang: { view: viewTrade, after: () => {
    drawGroupedBars(document.getElementById('chart-trade'), TRADE.map((t) => ({ year: t.year, a: t.ekspor, b: t.impor })), { labelA: 'Ekspor', labelB: 'Impor', fmt: (v) => String(Math.round(v)), aria: 'Ekspor dan impor 2020 sampai 2024' });
    const sel = document.getElementById('year-trade');
    const out = document.getElementById('year-trade-out');
    const show = () => {
      const y = Number(sel.value);
      const row = TRADE.find((t) => t.year === y);
      const surplus = row.ekspor - row.impor;
      out.textContent = `Tahun ${y}: ekspor US$${fmtID(row.ekspor)} miliar · impor US$${fmtID(row.impor)} miliar · surplus US$${fmtID(surplus)} miliar`;
    };
    sel.addEventListener('change', show);
    show();
  } },
  daerah: { view: viewRegions, after: () => {
    const detail = document.getElementById('region-detail');
    // Delegasi: baris dibuat ulang saat tabel diurutkan/dicari.
    document.getElementById('tbl-regions-body').addEventListener('click', (e) => {
      const tr = e.target.closest('tr[data-name]');
      if (!tr) return;
      const p = PROVINCES.find((x) => x.name === tr.dataset.name);
      if (!p) return;
      const share = (p.pop / 281.6) * 100;
      detail.innerHTML = `<h3>${esc(p.name)}</h3>
        <p>Ibu kota: <strong>${esc(p.capital)}</strong> · Penduduk 2024: <strong>${fmtID(p.pop)} juta jiwa</strong>
        (${fmtID(share)}% dari penduduk Indonesia) · Tingkat kemiskinan September 2024: <strong>${fmtID(p.poverty)}%</strong>.</p>
        <p class="source">Sumber: BPS — proyeksi penduduk 2024; Profil Kemiskinan September 2024.</p>`;
      detail.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    });
  } },
  publikasi: { view: viewPublications, after: () => {
    const list = document.getElementById('pub-list');
    const count = document.getElementById('pub-count');
    const search = document.getElementById('pub-search');
    const yearSel = document.getElementById('pub-year');
    const render = () => {
      const q = search.value.trim().toLowerCase();
      const y = yearSel.value;
      const items = RELEASES.filter((r) => (!q || r.title.toLowerCase().includes(q)) && (!y || String(r.year) === y));
      list.innerHTML = items.map((r) => `<li><strong>${esc(r.title)}</strong> — ${r.source}, ${r.year}</li>`).join('') || '<li>Tidak ada publikasi yang cocok.</li>';
      count.textContent = `Menampilkan ${items.length} dari ${RELEASES.length} publikasi.`;
    };
    search.addEventListener('input', render);
    yearSel.addEventListener('change', render);
    render();
  } },
};

let currentRoute = '';
function render() {
  const hash = (location.hash || '#/').replace(/^#\/?/, '').split('?')[0];
  const route = ROUTES[hash] ? hash : '';
  currentRoute = route;
  app.innerHTML = ROUTES[route].view();
  document.querySelectorAll('nav a').forEach((a) => {
    const r = a.getAttribute('href').replace(/^#\/?/, '');
    a.classList.toggle('active', r === route);
    if (r === route) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current');
  });
  ROUTES[route].after();
  pendingBinds.splice(0).forEach((fn) => fn());
  window.scrollTo(0, 0);
}

window.addEventListener('hashchange', render);
let resizeTimer = null;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => { if (ROUTES[currentRoute]) ROUTES[currentRoute].after(); }, 150);
});

render();
