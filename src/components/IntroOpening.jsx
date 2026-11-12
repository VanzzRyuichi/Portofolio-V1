import React, { useEffect, useRef, useState } from 'react';

// =========================================================================
// DURASI (ms) — ubah di sini untuk mempercepat / memperlambat tiap tahap
// =========================================================================
export const INTRO_TIMINGS = {
  SLICE_START: 300,       // potongan tengah A mulai muncul
  SLICE_DUR: 450,
  EXPAND_START: 850,      // langsung memanjang ke atas & bawah jadi A penuh
  EXPAND_DUR: 1100,
  ANTICIPATE_START: 2150, // A "menarik napas" sedikit mengecil sebelum menyelam
  ANTICIPATE_DUR: 300,
  ZOOM_START: 2450,       // kamera menyelam masuk ke dalam A
  ZOOM_DUR: 1500,
};

// Bentuk A hasil trace dari screenshot (koordinat lokal, tinggi 131, lebar 97.7)
export const A_PATH = 'M10 12 H33 L50 65 L67 12 H90 L61 90 H39 Z';
export const A_W = 100;
export const A_H = 100;
const POLE = { x: 50, y: 76 };
const POLE_R = 11.5;
const SLICE_H = 18;

function bezier(x1, y1, x2, y2) {
  const cx = 3 * x1, bx = 3 * (x2 - x1) - cx, ax = 1 - cx - bx;
  const cy = 3 * y1, by = 3 * (y2 - y1) - cy, ay = 1 - cy - by;
  const X = (t) => ((ax * t + bx) * t + cx) * t;
  const Y = (t) => ((ay * t + by) * t + cy) * t;
  const dX = (t) => (3 * ax * t + 2 * bx) * t + cx;
  return (x) => {
    if (x <= 0) return 0;
    if (x >= 1) return 1;
    let t = x;
    for (let i = 0; i < 8; i++) {
      const d = X(t) - x;
      if (Math.abs(d) < 1e-5) break;
      const s = dX(t);
      if (Math.abs(s) < 1e-6) break;
      t -= d / s;
    }
    return Y(t);
  };
}
const easeSlice = bezier(0.2, 0.8, 0.3, 1);
const easeExpand = bezier(0.65, 0, 0.2, 1);
const easeBreath = bezier(0.45, 0, 0.55, 1);
const easeZoom = bezier(0.6, 0, 0.2, 1);
const clamp = (v) => Math.min(1, Math.max(0, v));
const smooth = (v) => v * v * (3 - 2 * v);

export default function IntroOpening({ onFinish, oncePerSession = false }) {
  const [done, setDone] = useState(false);
  const worldRef = useRef(null);
  const letterRef = useRef(null);
  const clipRef = useRef(null);
  const finishRef = useRef(onFinish);
  finishRef.current = onFinish;

  useEffect(() => {
    const root = document.documentElement;
    const T = INTRO_TIMINGS;

    const skip =
      window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
      (oncePerSession && sessionStorage.getItem('has_seen_intro') === 'true');
    if (skip) {
      root.style.setProperty('--intro-p', '1');
      setDone(true);
      finishRef.current?.();
      return;
    }

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    root.style.setProperty('--intro-p', '0');

    const W = window.innerWidth;
    const H = window.innerHeight;
    const u = Math.min(W * 0.46, 260) / A_W; // px per unit
    const cx = W / 2;
    const cy = H / 2;
    const startX = cx + u * (POLE.x - A_W / 2);
    const startY = cy + u * (POLE.y - A_H / 2);
    const sFinal = (Math.hypot(W, H) / 2) * 1.1 / (POLE_R * u);
    const sLow = 0.93;
    const t0 = performance.now();
    let raf;

    const tick = (now) => {
      const t = now - t0;

      // 1) potongan tengah muncul -> 2) memanjang jadi A penuh
      const sl = easeSlice(clamp((t - T.SLICE_START) / T.SLICE_DUR));
      const ex = easeExpand(clamp((t - T.EXPAND_START) / T.EXPAND_DUR));
      const h = SLICE_H * sl + (A_H + 20 - SLICE_H) * ex;
      clipRef.current?.setAttribute('y', A_H / 2 - h / 2);
      clipRef.current?.setAttribute('height', h);

      // 3) antisipasi kecil, 4) menyelam: zoom eksponensial + kamera geser ke titik tebal A
      const a = easeBreath(clamp((t - T.ANTICIPATE_START) / T.ANTICIPATE_DUR));
      const p = clamp((t - T.ZOOM_START) / T.ZOOM_DUR);
      const q = easeZoom(p);
      let s = 1 - (1 - sLow) * a;
      if (p > 0) s = sLow * Math.pow(sFinal / sLow, q);
      const px = startX + (cx - startX) * q;
      const py = startY + (cy - startY) * q;
      worldRef.current?.setAttribute(
        'transform',
        `translate(${px} ${py}) scale(${u * s}) translate(${-POLE.x} ${-POLE.y})`
      );

      // 5) isi hitam A memudar -> hero terlihat "di dalam" huruf A
      const fade = smooth(clamp((p - 0.1) / 0.4));
      letterRef.current?.setAttribute('opacity', 1 - fade);
      root.style.setProperty('--intro-p', q.toFixed(4)); // dipakai hero untuk scale

      if (t < T.ZOOM_START + T.ZOOM_DUR) {
        raf = requestAnimationFrame(tick);
      } else {
        root.style.setProperty('--intro-p', '1');
        document.body.style.overflow = prevOverflow;
        if (oncePerSession) sessionStorage.setItem('has_seen_intro', 'true');
        setDone(true);
        finishRef.current?.();
      }
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      document.body.style.overflow = prevOverflow;
    };
  }, [oncePerSession]);

  if (done) return null;

  return (
    <svg
      className="fixed inset-0 z-[9999] pointer-events-none"
      width="100%"
      height="100%"
      aria-hidden="true"
    >
      <defs>
        <clipPath id="intro-reveal">
          <rect ref={clipRef} x="-10" y={A_H / 2} width={A_W + 20} height="0" />
        </clipPath>
      </defs>
      <g ref={worldRef}>
        {/* Lembar putih dengan lubang berbentuk A (hero terlihat lewat lubang ini) */}
        <path
          fill="#fff"
          fillRule="evenodd"
          d={`M-1500 -1500 H1500 V1500 H-1500 Z ${A_PATH}`}
        />
        {/* Isi huruf: kertas putih + tinta hitam (di-clip untuk animasi memanjang) */}
        <g ref={letterRef}>
          <path d={A_PATH} fill="#fff" stroke="#fff" strokeWidth="0.8" strokeLinejoin="round" />
          <path d={A_PATH} fill="#000" clipPath="url(#intro-reveal)" />
        </g>
      </g>
    </svg>
  );
}
