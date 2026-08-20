/* ==================================================================
   QR encoder — byte mode, ECC level M, versions 1-10.
   Self-contained, no dependencies. Carried over from the v1 prototype.
   ================================================================== */

const EC_M = {
  1: [10, 1, 16, 0, 0], 2: [16, 1, 28, 0, 0], 3: [26, 1, 44, 0, 0],
  4: [18, 2, 32, 0, 0], 5: [24, 2, 43, 0, 0], 6: [16, 4, 27, 0, 0],
  7: [18, 4, 31, 0, 0], 8: [22, 2, 38, 2, 39], 9: [22, 3, 36, 2, 37],
  10: [26, 4, 43, 1, 44],
};
const ALIGN = {
  1: [], 2: [6, 18], 3: [6, 22], 4: [6, 26], 5: [6, 30],
  6: [6, 34], 7: [6, 22, 38], 8: [6, 24, 42], 9: [6, 26, 46], 10: [6, 28, 50],
};
const EXP = new Array(512), LOG = new Array(256);
(function () {
  let x = 1;
  for (let i = 0; i < 255; i++) { EXP[i] = x; LOG[x] = i; x <<= 1; if (x & 0x100) x ^= 0x11d; }
  for (let i = 255; i < 512; i++) EXP[i] = EXP[i - 255];
})();
const gmul = (a, b) => (a === 0 || b === 0 ? 0 : EXP[LOG[a] + LOG[b]]);

function genPoly(n) {
  let poly = [1];
  for (let i = 0; i < n; i++) {
    const next = new Array(poly.length + 1).fill(0);
    for (let j = 0; j < poly.length; j++) {
      next[j] ^= gmul(poly[j], 1);
      next[j + 1] ^= gmul(poly[j], EXP[i]);
    }
    poly = next;
  }
  return poly;
}
function eccOf(data, n) {
  const gen = genPoly(n), res = new Array(n).fill(0);
  for (const d of data) {
    const f = d ^ res[0];
    res.shift(); res.push(0);
    for (let i = 0; i < n; i++) res[i] ^= gmul(gen[i + 1], f);
  }
  return res;
}
const dataCw = (v) => { const [, b1, d1, b2, d2] = EC_M[v]; return b1 * d1 + b2 * d2; };
function pickVersion(len) {
  for (let v = 1; v <= 10; v++) {
    const cci = v < 10 ? 8 : 16;
    if (4 + cci + len * 8 <= dataCw(v) * 8) return v;
  }
  return null;
}
function encodeData(bytes, v) {
  const bits = [];
  const push = (val, n) => { for (let i = n - 1; i >= 0; i--) bits.push((val >> i) & 1); };
  push(0b0100, 4);
  push(bytes.length, v < 10 ? 8 : 16);
  for (const b of bytes) push(b, 8);
  const cap = dataCw(v) * 8;
  for (let i = 0; i < 4 && bits.length < cap; i++) bits.push(0);
  while (bits.length % 8) bits.push(0);
  const cw = [];
  for (let i = 0; i < bits.length; i += 8) {
    let b = 0;
    for (let j = 0; j < 8; j++) b = (b << 1) | bits[i + j];
    cw.push(b);
  }
  const pad = [0xec, 0x11];
  let k = 0;
  while (cw.length < dataCw(v)) cw.push(pad[k++ % 2]);
  return cw;
}
function interleave(cw, v) {
  const [ecn, b1, d1, b2, d2] = EC_M[v];
  const blocks = [];
  let p = 0;
  for (let i = 0; i < b1; i++) { blocks.push(cw.slice(p, p + d1)); p += d1; }
  for (let i = 0; i < b2; i++) { blocks.push(cw.slice(p, p + d2)); p += d2; }
  const eccs = blocks.map((b) => eccOf(b, ecn));
  const out = [];
  const maxD = Math.max(...blocks.map((b) => b.length));
  for (let i = 0; i < maxD; i++) for (const b of blocks) if (i < b.length) out.push(b[i]);
  for (let i = 0; i < ecn; i++) for (const e of eccs) out.push(e[i]);
  return out;
}
function buildMatrix(v) {
  const size = 17 + v * 4;
  const m = Array.from({ length: size }, () => new Array(size).fill(null));
  const set = (r, c, val) => { if (r >= 0 && c >= 0 && r < size && c < size) m[r][c] = val; };
  const finder = (r, c) => {
    for (let i = -1; i <= 7; i++) for (let j = -1; j <= 7; j++) {
      const rr = r + i, cc = c + j;
      if (rr < 0 || cc < 0 || rr >= size || cc >= size) continue;
      const on = (i >= 0 && i <= 6 && (j === 0 || j === 6)) ||
        (j >= 0 && j <= 6 && (i === 0 || i === 6)) ||
        (i >= 2 && i <= 4 && j >= 2 && j <= 4);
      set(rr, cc, on ? 1 : 0);
    }
  };
  finder(0, 0); finder(0, size - 7); finder(size - 7, 0);
  for (let i = 8; i < size - 8; i++) { const on = i % 2 === 0 ? 1 : 0; set(6, i, on); set(i, 6, on); }
  const al = ALIGN[v];
  for (const r of al) for (const c of al) {
    if ((r === 6 && c === 6) || (r === 6 && c === size - 7) || (r === size - 7 && c === 6)) continue;
    for (let i = -2; i <= 2; i++) for (let j = -2; j <= 2; j++)
      set(r + i, c + j, Math.max(Math.abs(i), Math.abs(j)) !== 1 ? 1 : 0);
  }
  set(size - 8, 8, 1);
  if (v >= 7) {
    for (let i = 0; i < 18; i++) {
      const r = Math.floor(i / 3), c = i % 3;
      set(size - 11 + c, r, 0); set(r, size - 11 + c, 0);
    }
  }
  for (let i = 0; i < 9; i++) {
    if (m[8][i] === null) set(8, i, 0);
    if (m[i][8] === null) set(i, 8, 0);
  }
  for (let i = 0; i < 8; i++) {
    if (m[8][size - 1 - i] === null) set(8, size - 1 - i, 0);
    if (m[size - 1 - i][8] === null) set(size - 1 - i, 8, 0);
  }
  return m;
}
function placeData(m, res, cw) {
  const size = m.length, bits = [];
  for (const b of cw) for (let i = 7; i >= 0; i--) bits.push((b >> i) & 1);
  let idx = 0, up = true;
  for (let col = size - 1; col > 0; col -= 2) {
    if (col === 6) col--;
    for (let n = 0; n < size; n++) {
      const row = up ? size - 1 - n : n;
      for (const c of [col, col - 1]) {
        if (res[row][c]) continue;
        m[row][c] = idx < bits.length ? bits[idx] : 0;
        idx++;
      }
    }
    up = !up;
  }
}
const MASKS = [
  (r, c) => (r + c) % 2 === 0,
  (r) => r % 2 === 0,
  (r, c) => c % 3 === 0,
  (r, c) => (r + c) % 3 === 0,
  (r, c) => (Math.floor(r / 2) + Math.floor(c / 3)) % 2 === 0,
  (r, c) => ((r * c) % 2) + ((r * c) % 3) === 0,
  (r, c) => (((r * c) % 2) + ((r * c) % 3)) % 2 === 0,
  (r, c) => (((r + c) % 2) + ((r * c) % 3)) % 2 === 0,
];
function applyMask(m, res, k) {
  const out = m.map((r) => r.slice());
  for (let r = 0; r < m.length; r++) for (let c = 0; c < m.length; c++)
    if (!res[r][c] && MASKS[k](r, c)) out[r][c] ^= 1;
  return out;
}
function placeFormat(m, k) {
  const size = m.length;
  const data = k;
  let rem = data;
  for (let i = 0; i < 10; i++) rem = (rem << 1) ^ (((rem >> 9) & 1) * 0b10100110111);
  const bits = ((data << 10) | rem) ^ 0b101010000010010;
  const get = (i) => (bits >> (14 - i)) & 1;
  for (let i = 0; i <= 5; i++) m[8][i] = get(i);
  m[8][7] = get(6); m[8][8] = get(7); m[7][8] = get(8);
  for (let i = 9; i <= 14; i++) m[14 - i][8] = get(i);
  for (let i = 0; i <= 7; i++) m[size - 1 - i][8] = get(i);
  for (let i = 8; i <= 14; i++) m[8][size - 15 + i] = get(i);
  m[size - 8][8] = 1;
}
function placeVersion(m, v) {
  if (v < 7) return;
  const size = m.length;
  let rem = v;
  for (let i = 0; i < 12; i++) rem = (rem << 1) ^ (((rem >> 11) & 1) * 0b1111100100101);
  const bits = (v << 12) | rem;
  for (let i = 0; i < 18; i++) {
    const bit = (bits >> i) & 1;
    const r = Math.floor(i / 3), c = i % 3;
    m[size - 11 + c][r] = bit;
    m[r][size - 11 + c] = bit;
  }
}
function penalty(m) {
  const n = m.length;
  let score = 0;
  for (let i = 0; i < n; i++) {
    for (const line of [m[i], m.map((r) => r[i])]) {
      let run = 1;
      for (let j = 1; j < n; j++) {
        if (line[j] === line[j - 1]) run++;
        else { if (run >= 5) score += 3 + (run - 5); run = 1; }
      }
      if (run >= 5) score += 3 + (run - 5);
    }
  }
  for (let r = 0; r < n - 1; r++) for (let c = 0; c < n - 1; c++) {
    const v = m[r][c];
    if (v === m[r][c + 1] && v === m[r + 1][c] && v === m[r + 1][c + 1]) score += 3;
  }
  const p1 = [1, 0, 1, 1, 1, 0, 1, 0, 0, 0, 0], p2 = [0, 0, 0, 0, 1, 0, 1, 1, 1, 0, 1];
  const scan = (line) => {
    for (let i = 0; i + 11 <= n; i++) {
      const seg = line.slice(i, i + 11);
      if (p1.every((v, k) => v === seg[k]) || p2.every((v, k) => v === seg[k])) score += 40;
    }
  };
  for (let i = 0; i < n; i++) { scan(m[i]); scan(m.map((r) => r[i])); }
  let dark = 0;
  for (const row of m) for (const v of row) dark += v;
  score += Math.floor(Math.abs((dark * 100) / (n * n) - 50) / 5) * 10;
  return score;
}
function qrMatrix(text) {
  const bytes = Array.from(new TextEncoder().encode(text));
  const v = pickVersion(bytes.length);
  if (!v) return null;
  const cw = interleave(encodeData(bytes, v), v);
  const template = buildMatrix(v);
  const res = template.map((row) => row.map((c) => c !== null));
  const base = template.map((row) => row.map((c) => (c === null ? 0 : c)));
  placeData(base, res, cw);
  let best = null, bestScore = Infinity;
  for (let k = 0; k < 8; k++) {
    const cand = applyMask(base, res, k);
    placeFormat(cand, k);
    placeVersion(cand, v);
    const s = penalty(cand);
    if (s < bestScore) { bestScore = s; best = cand; }
  }
  return best;
}

export { qrMatrix };
