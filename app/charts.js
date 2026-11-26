// Grafik canvas murni — tanpa pustaka, tanpa jaringan.
// Menggambar grafik batang dan garis dengan sumbu, grid, label, dan nilai.
const TEAL = '#0f766e';
const AMBER = '#b45309';
const SLATE = '#334155';
const GRID = '#e2e8f0';

function setupCanvas(canvas, height) {
  const dpr = window.devicePixelRatio || 1;
  const width = canvas.clientWidth || canvas.parentElement.clientWidth || 600;
  canvas.width = Math.round(width * dpr);
  canvas.height = Math.round(height * dpr);
  canvas.style.height = height + 'px';
  const ctx = canvas.getContext('2d');
  ctx.scale(dpr, dpr);
  ctx.font = '12px system-ui, sans-serif';
  return { ctx, width, height };
}

function niceTicks(min, max, count) {
  const span = max - min || 1;
  const step = span / count;
  const mag = Math.pow(10, Math.floor(Math.log10(step)));
  const norm = step / mag;
  const nice = norm < 1.5 ? 1 : norm < 3.5 ? 2 : norm < 7.5 ? 5 : 10;
  const s = nice * mag;
  const lo = Math.floor(min / s) * s;
  const hi = Math.ceil(max / s) * s;
  const ticks = [];
  for (let v = lo; v <= hi + 1e-9; v += s) ticks.push(v);
  return ticks;
}

function drawAxes(ctx, box, ticks, fmt) {
  ctx.strokeStyle = GRID;
  ctx.fillStyle = SLATE;
  ctx.lineWidth = 1;
  ctx.textAlign = 'right';
  ctx.textBaseline = 'middle';
  for (const t of ticks) {
    const y = box.top + ((box.max - t) / (box.max - box.min)) * box.height;
    ctx.beginPath();
    ctx.moveTo(box.left, y);
    ctx.lineTo(box.left + box.width, y);
    ctx.stroke();
    ctx.fillText(fmt(t), box.left - 8, y);
  }
}

export function drawLineChart(canvas, series, opts) {
  const { ctx, width, height } = setupCanvas(canvas, opts.height || 280);
  const pad = { left: 56, right: 16, top: 16, bottom: 30 };
  const box = {
    left: pad.left,
    top: pad.top,
    width: width - pad.left - pad.right,
    height: height - pad.top - pad.bottom,
    min: opts.min,
    max: opts.max,
  };
  const values = series.map((p) => p.value);
  const lo = opts.min !== undefined ? opts.min : Math.min(...values, 0);
  const hi = opts.max !== undefined ? opts.max : Math.max(...values);
  box.min = lo;
  box.max = hi === lo ? lo + 1 : hi;
  const ticks = niceTicks(box.min, box.max, 4);
  drawAxes(ctx, box, ticks, opts.fmt || ((v) => String(Math.round(v * 100) / 100)));
  const x = (i) => box.left + (i / (series.length - 1)) * box.width;
  const y = (v) => box.top + ((box.max - v) / (box.max - box.min)) * box.height;
  // Garis nol yang tegas bila rentang melewati 0
  if (box.min < 0 && box.max > 0) {
    ctx.strokeStyle = '#94a3b8';
    ctx.beginPath();
    ctx.moveTo(box.left, y(0));
    ctx.lineTo(box.left + box.width, y(0));
    ctx.stroke();
  }
  ctx.strokeStyle = opts.color || TEAL;
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  series.forEach((p, i) => (i === 0 ? ctx.moveTo(x(i), y(p.value)) : ctx.lineTo(x(i), y(p.value))));
  ctx.stroke();
  ctx.fillStyle = opts.color || TEAL;
  series.forEach((p, i) => {
    ctx.beginPath();
    ctx.arc(x(i), y(p.value), 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = SLATE;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'bottom';
    ctx.fillText(opts.label(p), x(i), y(p.value) - 8);
    ctx.fillStyle = opts.color || TEAL;
  });
  ctx.fillStyle = SLATE;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'top';
  series.forEach((p, i) => ctx.fillText(String(p.year), x(i), box.top + box.height + 8));
  canvas.setAttribute('role', 'img');
  canvas.setAttribute('aria-label', opts.aria || 'Grafik garis');
}

export function drawBarChart(canvas, series, opts) {
  const { ctx, width, height } = setupCanvas(canvas, opts.height || 280);
  const pad = { left: 56, right: 16, top: 16, bottom: 30 };
  const box = {
    left: pad.left,
    top: pad.top,
    width: width - pad.left - pad.right,
    height: height - pad.top - pad.bottom,
  };
  const values = series.map((p) => p.value);
  const lo = Math.min(0, ...values);
  const hi = Math.max(...values);
  box.min = lo;
  box.max = hi === lo ? lo + 1 : hi;
  const ticks = niceTicks(box.min, box.max, 4);
  drawAxes(ctx, box, ticks, opts.fmt || ((v) => String(Math.round(v * 100) / 100)));
  const slot = box.width / series.length;
  const barW = Math.min(56, slot * 0.6);
  const y = (v) => box.top + ((box.max - v) / (box.max - box.min)) * box.height;
  const y0 = y(0);
  series.forEach((p, i) => {
    const cx = box.left + slot * i + slot / 2;
    const top = y(Math.max(p.value, 0));
    const bottom = p.value >= 0 ? y0 : y(p.value);
    ctx.fillStyle = p.color || opts.color || TEAL;
    ctx.fillRect(cx - barW / 2, top, barW, Math.max(1, bottom - top));
    ctx.fillStyle = SLATE;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'bottom';
    ctx.fillText(opts.label(p), cx, top - 5);
    ctx.textBaseline = 'top';
    ctx.fillText(String(p.year), cx, box.top + box.height + 8);
  });
  canvas.setAttribute('role', 'img');
  canvas.setAttribute('aria-label', opts.aria || 'Grafik batang');
}

export function drawGroupedBars(canvas, series, opts) {
  // series: [{year, a, b}] — dua batang per tahun (mis. ekspor vs impor)
  const { ctx, width, height } = setupCanvas(canvas, opts.height || 300);
  const pad = { left: 56, right: 16, top: 16, bottom: 30 };
  const box = {
    left: pad.left,
    top: pad.top,
    width: width - pad.left - pad.right,
    height: height - pad.top - pad.bottom,
  };
  const all = series.flatMap((p) => [p.a, p.b]);
  box.min = 0;
  box.max = Math.max(...all) * 1.08;
  const ticks = niceTicks(0, box.max, 4);
  drawAxes(ctx, box, ticks, opts.fmt || ((v) => String(Math.round(v))));
  const slot = box.width / series.length;
  const barW = Math.min(34, slot * 0.28);
  const y = (v) => box.top + ((box.max - v) / (box.max - box.min)) * box.height;
  const y0 = y(0);
  series.forEach((p, i) => {
    const cx = box.left + slot * i + slot / 2;
    ctx.fillStyle = TEAL;
    ctx.fillRect(cx - barW - 3, y(p.a), barW, y0 - y(p.a));
    ctx.fillStyle = AMBER;
    ctx.fillRect(cx + 3, y(p.b), barW, y0 - y(p.b));
    ctx.fillStyle = SLATE;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    ctx.fillText(String(p.year), cx, box.top + box.height + 8);
  });
  // Legenda
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = TEAL;
  ctx.fillRect(box.left, 4, 12, 12);
  ctx.fillStyle = SLATE;
  ctx.fillText(opts.labelA, box.left + 18, 10);
  const wA = ctx.measureText(opts.labelA).width;
  ctx.fillStyle = AMBER;
  ctx.fillRect(box.left + 24 + wA, 4, 12, 12);
  ctx.fillStyle = SLATE;
  ctx.fillText(opts.labelB, box.left + 42 + wA, 10);
  canvas.setAttribute('role', 'img');
  canvas.setAttribute('aria-label', opts.aria || 'Grafik batang berkelompok');
}
