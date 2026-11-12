import React, { useEffect, useRef } from 'react';

/**
 * <HalftoneReveal srcA srcB />
 * Dua foto bertukar lewat pola titik halftone (kisi 45°).
 *  - Dekatkan kursor  : titik-titik foto lain tumbuh di sekitar kursor (spotlight halftone).
 *  - Klik             : gelombang titik melebar dari titik klik sampai foto berganti penuh.
 *  - Klik lagi        : kembali ke foto semula (selalu bergantian A <-> B).
 * Titik di area gelap muncul lebih dulu, area terang belakangan (seperti cetak halftone sungguhan).
 * Foto dengan background putih dicampur pakai 'multiply' sehingga menyatu dengan warna `bg`.
 */
const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const smooth = (t) => t * t * (3 - 2 * t);
const easeInOut = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

export default function HalftoneReveal({
  srcA,
  srcB,
  aspect = '1024 / 1178',
  cell = 11,            // jarak antar titik (px CSS) -> makin kecil makin halus
  hoverRadius = 0.2,    // radius spotlight hover (relatif lebar foto)
  duration = 1300,      // durasi gelombang klik (ms)
  ready = true,
  disabled = false,     // true = efek hover & klik dimatikan (mis. saat scroll-focus pada foto)         // false = klik dikunci (mis. saat opening masih berjalan)
  className = '',
  style,
  label = 'Ganti foto',
}) {
  const wrapRef = useRef(null);
  const canvasRef = useRef(null);
  const readyRef = useRef(ready);
  readyRef.current = ready;
  const disabledRef = useRef(disabled);
  disabledRef.current = disabled;
  const ctrl = useRef(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const layer = document.createElement('canvas');
    const lctx = layer.getContext('2d');
    const mask = document.createElement('canvas');
    const nmask = document.createElement('canvas');
    const nctx = nmask.getContext('2d');
    const mctx = mask.getContext('2d', { willReadFrequently: true });

    const S = {
      imgs: [null, null], shown: 0, w: 0, h: 0, s: 1,
      xs: null, ys: null, dark: [null, null], v: null,
      px: 0, py: 0, inside: false, wave: null, raf: 0, last: 0, dead: false,
    };

    const build = () => {
      if (!S.imgs[0] || !S.imgs[1]) return;
      const rect = wrap.getBoundingClientRect();
      if (rect.width < 2) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = Math.round(rect.width * dpr);
      const h = Math.round(rect.height * dpr);
      canvas.width = layer.width = mask.width = nmask.width = w;
      canvas.height = layer.height = mask.height = nmask.height = h;
      S.w = w; S.h = h; S.s = cell * dpr;

      // kisi titik diputar 45°
      const s = S.s, c = Math.SQRT1_2, N = Math.ceil(Math.hypot(w, h) / s) + 2;
      const xs = [], ys = [];
      for (let i = -N; i <= N; i++) {
        for (let j = -N; j <= N; j++) {
          const x = w / 2 + (i * c - j * c) * s;
          const y = h / 2 + (i * c + j * c) * s;
          if (x > -s && x < w + s && y > -s && y < h + s) { xs.push(x); ys.push(y); }
        }
      }
      S.xs = Float32Array.from(xs); S.ys = Float32Array.from(ys);
      S.v = new Float32Array(xs.length);

      // gelap-terang tiap titik dari tiap foto (untuk urutan kemunculan halftone)
      for (let k = 0; k < 2; k++) {
        mctx.globalCompositeOperation = 'source-over';
        mctx.fillStyle = '#fff';
        mctx.fillRect(0, 0, w, h);
        mctx.drawImage(S.imgs[k], 0, 0, w, h);
        const d = mctx.getImageData(0, 0, w, h).data;
        const arr = new Float32Array(xs.length);
        for (let n = 0; n < xs.length; n++) {
          const px = clamp(Math.round(S.xs[n]), 0, w - 1), py = clamp(Math.round(S.ys[n]), 0, h - 1);
          const o = (py * w + px) * 4;
          arr[n] = 1 - (0.299 * d[o] + 0.587 * d[o + 1] + 0.114 * d[o + 2]) / 255;
        }
        S.dark[k] = arr;
      }
      S.wave = null;
      render();
    };

    const render = () => {
      if (!S.v) return;
      const { w, h, s } = S;
      const other = 1 - S.shown, dark = S.dark[other], rMax = s * 0.8;

      lctx.globalCompositeOperation = 'source-over';
      lctx.clearRect(0, 0, w, h);
      lctx.drawImage(S.imgs[S.shown], 0, 0, w, h);

      let any = false;
      mctx.globalCompositeOperation = 'source-over';
      mctx.clearRect(0, 0, w, h);
      mctx.fillStyle = '#fff';
      mctx.beginPath();
      for (let n = 0; n < S.v.length; n++) {
        const v = S.v[n];
        if (v < 0.01) continue;
        const vv = clamp(v * 1.35 - 0.35 * (1 - dark[n]));
        if (vv < 0.02) continue;
        const r = rMax * Math.sqrt(vv);
        mctx.moveTo(S.xs[n] + r, S.ys[n]);
        mctx.arc(S.xs[n], S.ys[n], r, 0, Math.PI * 2);
        any = true;
      }
      if (any) {
        mctx.fill();
        // 1) hapus foto lama di dalam titik
        lctx.globalCompositeOperation = 'destination-out';
        lctx.drawImage(mask, 0, 0);
        // 2) foto baru hanya di dalam titik
        nctx.globalCompositeOperation = 'source-over';
        nctx.clearRect(0, 0, w, h);
        nctx.drawImage(S.imgs[other], 0, 0, w, h);
        nctx.globalCompositeOperation = 'destination-in';
        nctx.drawImage(mask, 0, 0);
        lctx.globalCompositeOperation = 'source-over';
        lctx.drawImage(nmask, 0, 0);
      }

      ctx.clearRect(0, 0, w, h); // transparan -> foto yang sudah dipotong menyatu dengan background apa pun
      ctx.drawImage(layer, 0, 0);
    };

    const tick = (now) => {
      S.raf = 0;
      if (S.dead || !S.v) return;
      const dt = Math.min(0.05, (now - (S.last || now)) / 1000) || 0.016;
      S.last = now;
      const { w, h } = S;
      const Rh = hoverRadius * w;
      const wv = S.wave;
      let p = 0, front = 0, band = 1;
      if (wv) {
        p = clamp((now - wv.t0) / duration);
        band = 0.24 * wv.R;
        front = easeInOut(p) * (wv.R + band);
      }
      const up = 1 - Math.pow(1 - 0.3, dt * 60);
      const down = 1 - Math.pow(1 - 0.12, dt * 60);
      let maxV = 0, minV = 1;
      for (let n = 0; n < S.v.length; n++) {
        const x = S.xs[n], y = S.ys[n];
        let target = 0;
        if (S.inside) {
          const d = Math.hypot(x - S.px, y - S.py);
          target = smooth(clamp(1 - d / Rh)) * 0.85;
        }
        if (wv) {
          const d = Math.hypot(x - wv.x, y - wv.y);
          const tw = p >= 1 ? 1 : smooth(clamp((front - d) / band));
          if (tw > target) target = tw;
        }
        const v = S.v[n];
        const nv = v + (target - v) * (target > v ? up : down);
        S.v[n] = nv;
        if (nv > maxV) maxV = nv;
        if (nv < minV) minV = nv;
      }
      if (wv && p >= 1 && minV > 0.985) {
        S.shown = 1 - S.shown; // foto berganti penuh
        S.v.fill(0);
        S.wave = null;
        maxV = 0;
      }
      render();
      if (S.inside || S.wave || maxV > 0.004) S.raf = requestAnimationFrame(tick);
    };
    const kick = () => { if (!S.raf && !S.dead) { S.last = 0; S.raf = requestAnimationFrame(tick); } };

    const pos = (e) => {
      const r = wrap.getBoundingClientRect();
      const has = typeof e.clientX === 'number' && (e.clientX !== 0 || e.clientY !== 0);
      return {
        x: ((has ? e.clientX - r.left : r.width / 2) / r.width) * S.w,
        y: ((has ? e.clientY - r.top : r.height / 2) / r.height) * S.h,
      };
    };
    const onMove = (e) => {
      if (disabledRef.current) return; const p = pos(e); S.px = p.x; S.py = p.y; S.inside = e.pointerType !== 'touch'; kick(); };
    const onLeave = () => { S.inside = false; kick(); };
    const trigger = (e) => {
      if (disabledRef.current || !readyRef.current || S.wave || !S.v) return;
      const p = pos(e);
      const R = Math.hypot(Math.max(p.x, S.w - p.x), Math.max(p.y, S.h - p.y));
      S.wave = { x: p.x, y: p.y, R, t0: performance.now() };
      kick();
    };
    const onKey = (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); trigger({}); } };

    ctrl.current = { sync: () => { if (disabledRef.current) S.inside = false; kick(); } };
    wrap.addEventListener('pointermove', onMove);
    wrap.addEventListener('pointerenter', onMove);
    wrap.addEventListener('pointerleave', onLeave);
    wrap.addEventListener('click', trigger);
    wrap.addEventListener('keydown', onKey);

    let ro;
    Promise.all([loadImage(srcA), loadImage(srcB)]).then(([a, b]) => {
      if (S.dead) return;
      S.imgs = [a, b];
      build();
      let t;
      ro = new ResizeObserver(() => { clearTimeout(t); t = setTimeout(() => !S.dead && build(), 150); });
      ro.observe(wrap);
    });

    return () => {
      S.dead = true;
      cancelAnimationFrame(S.raf);
      ro?.disconnect();
      wrap.removeEventListener('pointermove', onMove);
      wrap.removeEventListener('pointerenter', onMove);
      wrap.removeEventListener('pointerleave', onLeave);
      wrap.removeEventListener('click', trigger);
      wrap.removeEventListener('keydown', onKey);
    };
  }, [srcA, srcB, cell, hoverRadius, duration]);

  useEffect(() => { ctrl.current?.sync(); }, [disabled]);

  return (
    <div
      ref={wrapRef}
      role="button"
      tabIndex={0}
      aria-label={label}
      className={`relative ${disabled ? 'cursor-default' : 'cursor-pointer'} outline-none select-none ${className}`}
      style={{ aspectRatio: aspect, ...style }}
    >
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
    </div>
  );
}