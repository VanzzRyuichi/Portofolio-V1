import React, { useEffect, useRef, useState } from 'react';
import HalftoneReveal from './components/HalftoneReveal';
import IntroOpening, { A_PATH, A_W, A_H } from './components/IntroOpening';
import GooeyNav from './components/GooeyNav';
import SpecularButton from './components/SpecularButton';
import GlowCursor from './components/GlowCursor';
import FlexCarousel from './components/FlexCarousel';
import LanguageToggle from './components/LanguageToggle';
import { TRANSLATIONS } from './translations';

const NAME = 'VANZZ'.split('');
const ACCENT = { backgroundImage: 'linear-gradient(90deg,#1d4ed8,#38bdf8)' };
const ACCENT_DARK = { backgroundImage: 'linear-gradient(90deg,#7ab8ff,#d3ecff)' };


// ── SKILL: logo SVG inline (tidak butuh internet) + persentase (ganti sesuai kemampuanmu)
const ICON = {
  html: (
    <svg viewBox="0 0 24 24" className="w-full h-full">
      <path fill="#E34F26" d="M3.5 2h17l-1.55 17.3L12 22l-6.95-2.7z" />
      <path fill="#EF652A" d="M12 3.9v16.4l5.6-1.8 1.3-14.6z" />
      <text x="12" y="15.4" textAnchor="middle" fontSize="9" fontWeight="800" fill="#fff" fontFamily="Arial,sans-serif">5</text>
    </svg>
  ),
  css: (
    <svg viewBox="0 0 24 24" className="w-full h-full">
      <path fill="#1572B6" d="M3.5 2h17l-1.55 17.3L12 22l-6.95-2.7z" />
      <path fill="#33A9DC" d="M12 3.9v16.4l5.6-1.8 1.3-14.6z" />
      <text x="12" y="15.4" textAnchor="middle" fontSize="9" fontWeight="800" fill="#fff" fontFamily="Arial,sans-serif">3</text>
    </svg>
  ),
  tailwind: (
    <svg viewBox="0 0 24 24" className="w-full h-full">
      <path fill="#06B6D4" d="M12 4.8c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.9.2 1.6.9 2.3 1.6C13.7 10.6 15 12 18 12c3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.9-.2-1.6-.9-2.3-1.6C16.3 6.2 15 4.8 12 4.8zM6 12c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.9.2 1.6.9 2.3 1.6 1.2 1.2 2.5 2.6 5.5 2.6 3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.9-.2-1.6-.9-2.3-1.6C10.3 13.4 9 12 6 12z" />
    </svg>
  ),
  js: (
    <svg viewBox="0 0 24 24" className="w-full h-full">
      <rect x="2" y="2" width="20" height="20" rx="2" fill="#F7DF1E" />
      <text x="20" y="19.5" textAnchor="end" fontSize="10.5" fontWeight="800" fill="#111" fontFamily="Arial,sans-serif">JS</text>
    </svg>
  ),
  express: (
    <svg viewBox="0 0 24 24" className="w-full h-full">
      <rect width="24" height="24" fill="#ffffff" rx="2" />
      <text x="12" y="16" textAnchor="middle" fontSize="13" fontWeight="900" fill="#000000" fontFamily="Arial,sans-serif">ex</text>
    </svg>
  ),
  php: (
    <svg viewBox="0 0 24 24" className="w-full h-full">
      <ellipse cx="12" cy="12" rx="11" ry="6.3" fill="#777BB4" />
      <text x="12" y="14.7" textAnchor="middle" fontSize="7.6" fontWeight="800" fontStyle="italic" fill="#fff" fontFamily="Arial,sans-serif">php</text>
    </svg>
  ),
};
const SKILLS = [
  { name: 'HTML', icon: 'html', pct: 95, color: '#E34F26', note: 'Semantic structure' },
  { name: 'CSS', icon: 'css', pct: 90, color: '#1572B6', note: 'Layouts & styling' },
  { name: 'Tailwind CSS', icon: 'tailwind', pct: 92, color: '#06B6D4', note: 'Rapid utility CSS' },
  { name: 'JS Vanilla', icon: 'js', pct: 88, color: '#E5C100', note: 'Core logic & DOM' },
  { name: 'Express.js', icon: 'express', pct: 85, color: '#000000', note: 'Backend REST API' },
  { name: 'PHP', icon: 'php', pct: 82, color: '#777BB4', note: 'Server-side engine' },
];

const TONES = [['#e6eefb', '#1e3a8a'], ['#e9ecf2', '#1f2937'], ['#e1f1fb', '#075985'], ['#ececf6', '#312e81']];
function Mock({ tone }) {
  const [bg, ac] = TONES[tone % TONES.length];
  return (
    <div className="relative w-full h-full overflow-hidden" style={{ background: bg }}>
      <div className="absolute left-[9%] right-[9%] top-[14%] bottom-0 rounded-t-2xl bg-white p-4 shadow-[0_12px_32px_rgba(0,0,0,.12)] transition-transform duration-500 group-hover:-translate-y-2">
        <div className="flex gap-1.5 mb-4">
          {[0, 1, 2].map((i) => <span key={i} className="w-1.5 h-1.5 rounded-full" style={{ background: ac, opacity: 0.35 }} />)}
        </div>
        <div className="h-3.5 w-2/3 rounded" style={{ background: ac }} />
        <div className="h-2 w-1/2 rounded mt-2.5" style={{ background: ac, opacity: 0.25 }} />
        <div className="grid grid-cols-3 gap-2.5 mt-5">
          {[0, 1, 2].map((i) => <div key={i} className="h-16 rounded-xl" style={{ background: bg }} />)}
        </div>
      </div>
    </div>
  );
}

// Muncul halus saat masuk layar
function Reveal({ children, delay = 0, className = '' }) {
  const ref = useRef(null);
  const [shown, setShown] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setShown(true); io.disconnect(); } }, { threshold: 0.15 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: shown ? 1 : 0,
        transform: shown ? 'translateY(0)' : 'translateY(32px)',
        transition: `opacity .9s ease ${delay}ms, transform .9s cubic-bezier(.2,.8,.2,1) ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

// Header section yang seragam (dipakai About, Skill, Project, Experience)
function SectionHead({ dark = false, accent, sub, right, className = '', children }) {
  return (
    <Reveal className={className}>
      <div className="flex items-end justify-between gap-6 flex-wrap">
        <div className="max-w-3xl">
          <h2
            className={`text-4xl md:text-6xl font-extrabold tracking-[-0.03em] leading-[1.06] ${dark ? 'text-white' : 'text-zinc-900'}`}
            style={{ fontFamily: "'Manrope','Plus Jakarta Sans',sans-serif" }}
          >
            {children}{' '}
            <span className="italic font-semibold text-transparent bg-clip-text pr-1" style={dark ? ACCENT_DARK : ACCENT}>{accent}</span>
          </h2>
          {sub && <p className={`mt-5 text-base md:text-lg max-w-xl ${dark ? 'text-white/55' : 'text-zinc-500'}`}>{sub}</p>}
        </div>
        {right}
      </div>
    </Reveal>
  );
}

// Timeline Experience: garis lurus atas→bawah yang terisi mengikuti scroll
function ExperienceTimeline({ items = [] }) {
  const wrap = useRef(null);
  const fill = useRef(null);
  const head = useRef(null);
  const itemRefs = useRef([]);
  const [active, setActive] = useState(0);

  useEffect(() => {
    let last = -1;
    const onScroll = () => {
      const el = wrap.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const y = Math.min(r.height, Math.max(0, window.innerHeight * 0.62 - r.top));
      if (fill.current) fill.current.style.height = y + 'px';
      if (head.current) {
        head.current.style.transform = `translate(-50%, ${y}px)`;
        head.current.style.opacity = y > 0 && y < r.height ? 1 : 0;
      }
      let n = 0;
      itemRefs.current.forEach((it) => { if (it && it.offsetTop + 14 <= y) n++; });
      if (n !== last) { last = n; setActive(n); }
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => { window.removeEventListener('scroll', onScroll); window.removeEventListener('resize', onScroll); };
  }, [items]);

  return (
    <div ref={wrap} className="relative">
      {/* garis */}
      <div aria-hidden="true" className="absolute top-0 bottom-0 left-2 md:left-[13.25rem] w-px bg-white/10">
        <div ref={fill} className="absolute top-0 left-1/2 -translate-x-1/2 w-[2px] rounded-full" style={{ height: 0, background: 'linear-gradient(to bottom, #3b82f6, #bfe3ff)' }} />
        <div ref={head} className="absolute top-0 left-1/2 -mt-1.5 w-3 h-3 rounded-full bg-sky-200" style={{ opacity: 0, boxShadow: '0 0 18px 4px rgba(120,190,255,.7)' }} />
      </div>

      {items.map((e, i) => {
        const on = i < active;
        return (
          <div
            key={e.role + i}
            ref={(el) => (itemRefs.current[i] = el)}
            className="relative pl-10 md:pl-0 md:grid md:grid-cols-[12rem_1fr] md:gap-x-10 pb-14 md:pb-20 last:pb-0"
            style={{ opacity: on ? 1 : 0.3, transform: on ? 'translateY(0)' : 'translateY(14px)', transition: 'opacity .7s ease, transform .7s cubic-bezier(.2,.8,.2,1)' }}
          >
            {/* titik */}
            <span
              aria-hidden="true"
              className="absolute top-1.5 left-0 md:left-[12.75rem] w-4 h-4 rounded-full border-2 transition-all duration-500"
              style={{ background: on ? '#bfe3ff' : '#050507', borderColor: on ? '#bfe3ff' : 'rgba(255,255,255,.25)', boxShadow: on ? '0 0 16px rgba(120,190,255,.8)' : 'none' }}
            />
            <span className="block text-xs font-mono tracking-[0.2em] uppercase text-white/45 md:text-right pt-2 mb-3 md:mb-0">{e.year}</span>
            <div>
              <h3 className="text-2xl md:text-4xl font-bold tracking-tight text-white">{e.role}</h3>
              <div className="mt-1 text-sm md:text-base text-sky-200/70">{e.org}</div>
              <p className="mt-4 text-base md:text-lg leading-relaxed text-white/55 max-w-2xl">{e.desc}</p>
              <div className="mt-5 flex flex-wrap gap-2">
                {e.tags.map((t) => (
                  <span key={t} className="px-3 py-1 rounded-full border border-white/15 text-[0.7rem] font-mono text-white/60">{t}</span>
                ))}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// Teks raksasa yang otomatis pas selebar layar
function FitText({ text }) {
  const box = useRef(null);
  const span = useRef(null);
  useEffect(() => {
    const fit = () => {
      const b = box.current, sp = span.current;
      if (!b || !sp) return;
      b.style.fontSize = '100px';
      const w = sp.getBoundingClientRect().width || 1;
      b.style.fontSize = (100 * b.clientWidth) / w + 'px';
    };
    fit();
    document.fonts?.ready.then(fit);
    window.addEventListener('resize', fit);
    return () => window.removeEventListener('resize', fit);
  }, []);
  return (
    <div
      ref={box}
      aria-hidden="true"
      className="w-full flex justify-center font-extrabold whitespace-nowrap select-none"
      style={{
        fontFamily: "'Manrope','Plus Jakarta Sans',sans-serif",
        letterSpacing: '-0.045em',
        lineHeight: 0.9,
        background: 'linear-gradient(to bottom, rgba(255,255,255,.95) 0%, rgba(255,255,255,.5) 50%, rgba(255,255,255,0) 100%)',
        WebkitBackgroundClip: 'text',
        backgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        color: 'transparent',
      }}
    >
      <span ref={span} className="inline-block">{text}</span>
    </div>
  );
}

const RING_C = 2 * Math.PI * 44;
function SkillCard({ sk, i }) {
  const ref = useRef(null);
  const [shown, setShown] = useState(false);
  const [num, setNum] = useState(0);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setShown(true); io.disconnect(); } }, { threshold: 0.25 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  useEffect(() => {
    if (!shown) return;
    const delay = i * 90, dur = 1400;
    let raf, start;
    const step = (t) => {
      if (!start) start = t;
      const p = Math.min(1, Math.max(0, (t - start - delay) / dur));
      setNum(Math.round(sk.pct * (1 - Math.pow(1 - p, 3))));
      if (t - start < dur + delay) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [shown, i, sk.pct]);

  return (
    <div
      ref={ref}
      style={{
        opacity: shown ? 1 : 0,
        transform: shown ? 'translateY(0)' : 'translateY(36px)',
        transition: `opacity .8s ease ${i * 90}ms, transform .8s cubic-bezier(.2,.8,.2,1) ${i * 90}ms`,
      }}
    >
      <div className="group relative overflow-hidden rounded-[1.75rem] bg-white border border-black/[0.06] px-4 pt-8 pb-7 flex flex-col items-center text-center shadow-[0_10px_30px_rgba(0,0,0,.05)] transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_24px_50px_rgba(0,0,0,.12)]">
        {/* glow warna brand saat hover */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ background: `radial-gradient(circle at 50% 0%, ${sk.color}26, transparent 70%)` }} />

        {/* cincin progress + logo */}
        <div className="relative w-[6.5rem] h-[6.5rem] md:w-28 md:h-28">
          <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full -rotate-90">
            <circle cx="50" cy="50" r="44" fill="none" stroke="#eeeeec" strokeWidth="5" />
            <circle
              cx="50" cy="50" r="44" fill="none" stroke={sk.color} strokeWidth="5" strokeLinecap="round"
              strokeDasharray={RING_C}
              strokeDashoffset={shown ? RING_C * (1 - sk.pct / 100) : RING_C}
              style={{ transition: `stroke-dashoffset 1.4s cubic-bezier(.2,.8,.2,1) ${i * 90}ms` }}
            />
          </svg>
          <div className="absolute inset-[18%] transition-transform duration-500 group-hover:scale-110">{ICON[sk.icon]}</div>
        </div>

        <h3 className="relative mt-6 text-lg md:text-xl font-bold tracking-tight text-zinc-900">{sk.name}</h3>
        <p className="relative mt-1 text-xs md:text-sm text-zinc-400">{sk.note}</p>
        <div className="relative mt-4 font-mono text-sm font-semibold px-3 py-1 rounded-full" style={{ color: sk.color, background: `${sk.color}18` }}>{num}%</div>
      </div>
    </div>
  );
}

function LogoA({ className = '' }) {
  return (
    <svg viewBox={`0 0 ${A_W} ${A_H}`} className={className} fill="currentColor" aria-hidden="true">
      <path d={A_PATH} />
    </svg>
  );
}

export default function App() {
  const [lang, setLang] = useState('en');
  const [introFinished, setIntroFinished] = useState(false);
  const [active, setActive] = useState('hero');
  const [menu, setMenu] = useState(false);
  const nameRef = useRef(null);
  const heroRef = useRef(null);
  const cardRef = useRef(null);
  const [photoLocked, setPhotoLocked] = useState(false); // true saat hero sedang "fokus ke foto" -> halftone dimatikan

  const t = TRANSLATIONS[lang] || TRANSLATIONS.en;
  const toggleLang = () => setLang((prev) => (prev === 'en' ? 'id' : 'en'));

  // Highlight link navbar sesuai section yang sedang terlihat
  useEffect(() => {
    const ids = [...t.nav.map((n) => n.id), 'contact'];
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: '-40% 0px -55% 0px' }
    );
    ids.forEach((id) => document.getElementById(id) && io.observe(document.getElementById(id)));
    return () => io.disconnect();
  }, [t.nav]);

  // Pas-kan ukuran VANZZ supaya selalu muat ~94% lebar layar (tidak terpotong di font/ukuran layar apa pun)
  useEffect(() => {
    const fit = () => {
      const h1 = nameRef.current;
      if (!h1) return;
      h1.style.fontSize = '100px';
      const w = h1.firstElementChild.getBoundingClientRect().width || 1;
      const size = Math.min((100 * window.innerWidth * 0.94) / w, window.innerHeight * 0.42);
      h1.style.fontSize = `${size}px`;
    };
    fit();
    document.fonts?.ready.then(fit);
    window.addEventListener('resize', fit);
    return () => window.removeEventListener('resize', fit);
  }, []);

  // Scroll-focus ala ScrollExpand: bg jadi hitam, foto jadi kartu bulat lalu melebar penuh (zoom ke wajah).
  // Semua nilai ditulis ke CSS var di elemen hero (tanpa re-render) + smoothing.
  useEffect(() => {
    const wrap = heroRef.current;
    if (!wrap) return;
    let cur = 0, target = 0, raf = 0, locked = false;
    const clamp = (v, lo = 0, hi = 1) => Math.min(hi, Math.max(lo, v));
    const ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
    const smooth = (t) => t * t * (3 - 2 * t);
    const calc = () => {
      const max = Math.max(1, wrap.offsetHeight - window.innerHeight);
      target = clamp(-wrap.getBoundingClientRect().top / max);
    };
    const apply = () => {
      const card = cardRef.current;
      if (!card) return;
      const vw = window.innerWidth, vh = window.innerHeight;
      const cw = card.offsetWidth, ch = card.offsetHeight;      // ukuran kartu (tidak terpengaruh transform)
      const S = Math.min(1.2, (0.96 * vw) / cw);                 // zoom maksimal ~1.2x (sorot kepala, tidak terlalu dekat)
      const topY = 0.107 * vh;                                    // sisi atas foto berhenti di bawah navbar
      const tyF = topY - (vh - ch / 2) + (S * ch) / 2;           // geser turun ke posisi akhir
      const q = clamp((cur - 0.05) / 0.75), e = ease(q);
      const sc = 1 + (S - 1) * e;
      wrap.style.setProperty('--sx', cur.toFixed(4));
      wrap.style.setProperty('--cs', sc.toFixed(4));
      wrap.style.setProperty('--cty', (tyF * e).toFixed(1) + 'px');
      wrap.style.setProperty('--bgo', clamp(cur / 0.3).toFixed(3));
    };
    const loop = () => {
      raf = 0;
      cur += (target - cur) * 0.14;
      if (Math.abs(target - cur) < 0.0008) cur = target;
      apply();
      const l = cur > 0.03;
      if (l !== locked) { locked = l; setPhotoLocked(l); }
      if (cur !== target) raf = requestAnimationFrame(loop);
    };
    const onScroll = () => { calc(); if (!raf) raf = requestAnimationFrame(loop); };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => { window.removeEventListener('scroll', onScroll); window.removeEventListener('resize', onScroll); cancelAnimationFrame(raf); };
  }, []);

  // GlowCursor (React Bits): tema mengikuti latar di bawah kursor.
  //  - section gelap (hero saat latar hitam, About, Experience, Contact) -> 'dark' (cahaya biru menyala)
  //  - section terang (Skill, Project, Gallery, hero awal)               -> 'light' (efek tinta)
  const [cursorTheme, setCursorTheme] = useState('light');
  const [coarsePointer] = useState(() => window.matchMedia?.('(pointer: coarse)').matches ?? false);
  useEffect(() => {
    const DARK = new Set(['about', 'experience', 'contact']);
    let x = window.innerWidth / 2, y = window.innerHeight / 2, raf = 0, current = 'light';
    const pick = () => {
      raf = 0;
      const section = document.elementFromPoint(x, y)?.closest?.('section, footer');
      let t = 'light';
      if (section) {
        if (section.id === 'hero') t = parseFloat(section.style.getPropertyValue('--bgo') || '0') > 0.5 ? 'dark' : 'light';
        else if (DARK.has(section.id)) t = 'dark';
      }
      if (t !== current) { current = t; setCursorTheme(t); }
    };
    const schedule = () => { if (!raf) raf = requestAnimationFrame(pick); };
    const onMove = (e) => { x = e.clientX; y = e.clientY; schedule(); };
    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('scroll', schedule, { passive: true });
    return () => { window.removeEventListener('pointermove', onMove); window.removeEventListener('scroll', schedule); cancelAnimationFrame(raf); };
  }, []);

  const rise = (delay = 0) => ({
    opacity: introFinished ? 1 : 0,
    transform: introFinished ? 'translateY(0)' : 'translateY(24px)',
    transition: `opacity .9s ease ${introFinished ? delay : 0}ms, transform .9s cubic-bezier(.2,.8,.2,1) ${introFinished ? delay : 0}ms`,
  });

  return (
    <div className="relative min-h-screen bg-[#fafaf8] text-[#111] font-body overflow-x-clip selection:bg-black selection:text-white">
      {/* Cahaya kursor (React Bits <GlowCursor />) — overlay layar penuh, tidak menghalangi klik */}
      <GlowCursor
        color={cursorTheme === 'dark' ? '#5f8bff' : '#2f55ff'}
        theme={cursorTheme}
        intensity={1.3}
        trailWidth={3}
        linger={1.4}
        glow={1.2}
        clickBurst
        quality={coarsePointer || window.innerWidth < 768 ? 'low' : 'high'}
        enabled={introFinished && !coarsePointer}
        style={{ position: 'fixed', inset: 0, zIndex: 9990, pointerEvents: 'none' }}
      />
      {!introFinished && <IntroOpening onFinish={() => setIntroFinished(true)} oncePerSession={false} />}

      {/* ── NAVBAR BUBBLE ── */}
      <header
        className="fixed top-4 md:top-6 inset-x-0 z-40 px-4 md:px-10 flex items-center justify-between pointer-events-none"
        style={{
          transform: introFinished ? 'translateY(0)' : 'translateY(-140%)',
          opacity: introFinished ? 1 : 0,
          transition: 'transform 1s cubic-bezier(.2,.8,.2,1) .1s, opacity .6s ease .1s',
        }}
      >
        <a href="#hero" aria-label="Home" className="pointer-events-auto w-12 h-12 rounded-full bg-black text-white ring-1 ring-white/25 grid place-items-center shadow-lg hover:scale-105 transition-transform">
          <LogoA className="w-6 h-6" />
        </a>

        <div className="pointer-events-auto hidden lg:block absolute left-1/2 -translate-x-1/2">
          <GooeyNav items={t.nav} activeId={active} />
        </div>

        <div className="pointer-events-auto flex items-center gap-2 md:gap-3">
          <LanguageToggle lang={lang} onToggle={toggleLang} />
          <SpecularButton href="#contact" className="hidden sm:inline-flex">
            {t.contactBtn} <span aria-hidden>↗</span>
          </SpecularButton>
          <button
            onClick={() => setMenu((m) => !m)}
            aria-label="Menu"
            className="lg:hidden w-12 h-12 rounded-full bg-white/80 backdrop-blur-xl border border-black/10 shadow-lg grid place-items-center text-lg hover:scale-105 active:scale-95 transition-all"
          >
            {menu ? '✕' : '☰'}
          </button>
        </div>

        {menu && (
          <div className="pointer-events-auto lg:hidden absolute top-16 right-4 left-4 p-2 rounded-3xl bg-white/90 backdrop-blur-xl border border-black/10 shadow-xl flex flex-col">
            {[...t.nav, { id: 'contact', label: t.contactBtn }].map((n) => (
              <a key={n.id} href={`#${n.id}`} onClick={() => setMenu(false)} className={`px-5 py-3 rounded-2xl text-sm font-semibold ${active === n.id ? 'bg-black text-white' : 'text-zinc-700'}`}>
                {n.label}
              </a>
            ))}
          </div>
        )}
      </header>

      {/* ── HERO ── */}
      <section id="hero" ref={heroRef} className="relative h-[200vh]">
      <div
        className="sticky top-0 isolate h-screen overflow-hidden bg-[#fafaf8]"
        style={{
          transform: 'scale(calc(1 + 0.16 * (1 - var(--intro-p, 0))))',
          willChange: 'transform',
        }}
      >
        {/* latar hitam yang muncul saat scroll */}
        <div className="absolute inset-0 bg-[#0e0d12] pointer-events-none" style={{ opacity: 'var(--bgo, 0)' }} />

        {/* Foto halftone: naik dari bawah saat opening (terikat --intro-p).
            Dekatkan kursor = titik halftone foto lain muncul, klik = foto berganti bolak-balik */}
        <div
          className="absolute inset-0 flex justify-center items-end"
          style={{
            clipPath: 'inset(calc(100% * (1 - var(--intro-p, 0))) 0 0 0)',
            filter: 'blur(calc(10px * (1 - var(--intro-p, 0))))',
            // saat latar hitam muncul, bagian bawah foto memudar jadi hitam (foto "terpotong")
            WebkitMaskImage: 'linear-gradient(to bottom, #000 calc(100% - var(--bgo, 0) * 34%), transparent 100%)',
            maskImage: 'linear-gradient(to bottom, #000 calc(100% - var(--bgo, 0) * 34%), transparent 100%)',
          }}
        >
          {/* sorot kepala: zoom terbatas (seperti contoh), tanpa kartu */}
          <div
            ref={cardRef}
            style={{
              transformOrigin: '50% 50%',
              transform: 'translate3d(0, var(--cty, 0px), 0) scale(var(--cs, 1))',
              willChange: 'transform',
            }}
          >
            <HalftoneReveal
              srcA="/gojo-cut-1.webp"
              srcB="/gojo-cut-2.webp"
              aspect="1024 / 1178"
              ready={introFinished}
              disabled={photoLocked}
              className="h-[64vh] md:h-[86vh]"
            />
          </div>
        </div>

        {/* Deskripsi (kiri): besar, editorial, muncul kata per kata */}
        <div
          className="absolute z-10 left-5 md:left-12 top-24 md:top-[20%] max-w-[17rem] md:max-w-[24rem]"
          style={{
            opacity: 'clamp(0, calc(1 - var(--sx, 0) * 5), 1)',
            transform: 'translate3d(calc(var(--sx, 0) * -110px), 0, 0)',
          }}
        >
          <div
            className="h-[3px] rounded-full bg-black mb-4 md:mb-6 origin-left"
            style={{
              width: '3.2rem',
              transform: introFinished ? 'scaleX(1)' : 'scaleX(0)',
              transition: `transform .9s cubic-bezier(.2,.8,.2,1) ${introFinished ? 700 : 0}ms`,
            }}
          />
          <p className="text-[1.65rem] md:text-[2.35rem] leading-[1.14] font-bold tracking-[-0.03em]">
            {t.heroWords.map(([w, key], i) => (
              <span key={`${lang}-${i}`} className="inline-block mr-[0.26em]" style={{ overflow: 'visible clip', paddingBottom: '0.08em' }}>
                <span
                  className={`inline-block ${key ? 'text-black' : 'text-zinc-400'}`}
                  style={{
                    transform: introFinished ? 'translateY(0)' : 'translateY(115%)',
                    transition: `transform .9s cubic-bezier(.2,.8,.2,1) ${introFinished ? 800 + i * 60 : 0}ms`,
                  }}
                >
                  {w}
                </span>
              </span>
            ))}
          </p>
        </div>

        {/* Tulisan Jepang vertikal 1 kolom (atas → bawah): Domain Expansion – Unlimited Void */}
        <div
          aria-label="Ryōiki Tenkai, Muryōkūsho"
          className="absolute z-10 right-4 md:right-14 top-24 md:top-[12%] flex gap-3 md:gap-5 select-none text-black"
          style={{
            // kedua elemen terungkap memanjang dari atas ke bawah
            clipPath: introFinished ? 'inset(0 0 0 0)' : 'inset(0 0 100% 0)',
            transition: `clip-path 2.2s cubic-bezier(.65,0,.2,1) ${introFinished ? 700 : 0}ms`,
            opacity: 'clamp(0, calc(1 - var(--sx, 0) * 5), 1)',
            transform: 'translate3d(calc(var(--sx, 0) * 110px), 0, 0)',
          }}
        >
          <span
            style={{
              writingMode: 'vertical-rl',
              fontFamily: "'Shippori Mincho B1','Noto Serif JP','Yu Mincho','Hiragino Mincho ProN',serif",
              fontWeight: 800,
              fontSize: 'clamp(1.9rem, min(4.4vw, 5.6vh), 4.8rem)',
              letterSpacing: '0.08em',
              lineHeight: 1,
            }}
          >
            領域展開　無量空処
          </span>
          <span className="w-[2px] bg-black/80 rounded-full" aria-hidden="true" />
        </div>

        {/* VANZZ besar: putih + mix-blend-difference → hitam di bg terang, otomatis putih saat menimpa jaket hitam */}
        <h1
          ref={nameRef}
          aria-label="VANZZ"
          className="absolute inset-x-0 bottom-[-0.07em] z-20 flex justify-center text-white mix-blend-difference select-none pointer-events-none"
          style={{
            fontFamily: "'Manrope','Plus Jakarta Sans',sans-serif",
            fontWeight: 800,
            letterSpacing: '-0.035em',
            lineHeight: 1,
            opacity: 'clamp(0, calc(1 - var(--sx, 0) * 6), 1)',
            transform: 'translate3d(0, calc(var(--sx, 0) * 22vh), 0)',
          }}
        >
          <span className="inline-flex" aria-hidden="true">
            {NAME.map((ch, i) => (
              // overflow hanya dipotong vertikal (efek naik), sisi kiri/kanan huruf tidak terpotong
              <span key={i} className="inline-block" style={{ overflow: 'visible clip' }}>
                <span
                  className="inline-block"
                  style={{
                    transform: introFinished ? 'translateY(0)' : 'translateY(115%)',
                    transition: `transform 1.1s cubic-bezier(.2,.8,.2,1) ${introFinished ? 250 + i * 130 : 0}ms`,
                  }}
                >
                  {ch}
                </span>
              </span>
            ))}
          </span>
        </h1>
      </div>
      </section>

      {/* ── ABOUT ── */}
      <section
        id="about"
        className="relative scroll-mt-0 overflow-hidden text-white px-6 md:px-16 pt-32 md:pt-44 pb-24 md:pb-36"
        style={{ background: 'linear-gradient(to bottom, #0e0d12 0, #050507 14rem, #050507 100%)' }}
      >
        {/* pola titik halus + cahaya biru, senada section lain */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0" style={{ backgroundImage: 'radial-gradient(rgba(255,255,255,.09) 1px, transparent 1px)', backgroundSize: '24px 24px', maskImage: 'radial-gradient(ellipse at 30% 45%, #000 15%, transparent 70%)', WebkitMaskImage: 'radial-gradient(ellipse at 30% 45%, #000 15%, transparent 70%)' }} />
        <div aria-hidden="true" className="pointer-events-none absolute -left-40 bottom-0 w-[36rem] h-[36rem] rounded-full blur-3xl opacity-40" style={{ background: 'radial-gradient(closest-side, rgba(70,150,255,.25), transparent)' }} />
        <div aria-hidden="true" className="pointer-events-none absolute -right-40 top-20 w-[30rem] h-[30rem] rounded-full blur-3xl opacity-30" style={{ background: 'radial-gradient(closest-side, rgba(120,190,255,.22), transparent)' }} />

        <div className="relative max-w-6xl mx-auto">
          <SectionHead dark accent={t.about.headAccent} className="mb-14 md:mb-20">
            {t.about.headPrefix}
          </SectionHead>

          <div className="grid md:grid-cols-[1.2fr_1fr] gap-10 md:gap-16 items-start">
            <Reveal delay={120}>
              <div className="space-y-6 text-lg md:text-xl leading-relaxed text-white/60 max-w-xl">
                <p>{t.about.p1}</p>
                <p>{t.about.p2}</p>
              </div>
              <div className="mt-9 flex flex-wrap gap-3">
                <a href="#work" className="inline-flex items-center gap-2 h-12 px-6 rounded-full bg-white text-black text-sm font-semibold hover:bg-sky-200 transition-colors">
                  {t.about.viewProjects} <span aria-hidden>→</span>
                </a>
                <a href="#contact" className="inline-flex items-center h-12 px-6 rounded-full border border-white/20 text-white/80 text-sm font-semibold hover:bg-white/10 hover:text-white transition-colors">
                  {t.contactBtn}
                </a>
              </div>
            </Reveal>

            <Reveal delay={220}>
              <dl className="rounded-3xl border border-white/10 bg-white/[0.03] backdrop-blur-sm">
                {t.about.info.map((i, idx) => (
                  <div key={i.k} className={`flex items-center justify-between gap-6 px-6 py-5 ${idx ? 'border-t border-white/10' : ''}`}>
                    <dt className="text-[0.7rem] font-mono tracking-[0.2em] uppercase text-white/40">{i.k}</dt>
                    <dd className="text-sm md:text-base font-semibold text-white/90 text-right">{i.v}</dd>
                  </div>
                ))}
              </dl>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── SKILL ── */}
      <section
        id="skill"
        className="relative scroll-mt-0 overflow-hidden py-24 md:py-36 px-6 md:px-16"
        style={{ background: 'linear-gradient(to bottom, #ffffff, #f6f6f4)' }}
      >
        {/* pola titik halus */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 opacity-[0.5]" style={{ backgroundImage: 'radial-gradient(rgba(0,0,0,.07) 1px, transparent 1px)', backgroundSize: '22px 22px', maskImage: 'radial-gradient(ellipse at center, #000 30%, transparent 75%)', WebkitMaskImage: 'radial-gradient(ellipse at center, #000 30%, transparent 75%)' }} />

        <div className="relative max-w-6xl mx-auto">
          <SectionHead accent={t.skills.accent} sub={t.skills.sub} className="mb-14 md:mb-20">
            {t.skills.head}
          </SectionHead>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {SKILLS.map((sk, i) => (
              <SkillCard
                key={sk.name}
                sk={{
                  ...sk,
                  note: t.skills.notes[sk.icon] || sk.note,
                }}
                i={i}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ── PROJECT ── */}
      <section id="work" className="scroll-mt-0 py-24 md:py-32 px-6 md:px-16" style={{ background: 'linear-gradient(to bottom, #f6f6f4, #e7e7e4)' }}>
        <div className="max-w-6xl mx-auto">
          <SectionHead
            accent={t.projects.accent}
            className="mb-10 md:mb-14"
            right={
              <a href="#work" className="inline-flex items-center gap-3 pl-6 pr-1.5 h-12 rounded-full bg-zinc-900 text-white text-sm font-semibold hover:bg-sky-600 transition-colors">
                {t.projects.viewAll}
                <span className="w-9 h-9 rounded-full bg-white text-zinc-900 grid place-items-center text-base">→</span>
              </a>
            }
          >
            {t.projects.head}
          </SectionHead>

          <div className="grid md:grid-cols-2 gap-5 md:gap-6">
            {t.projects.items.map((p, i) => (
              <Reveal key={p.title} delay={(i % 2) * 120}>
                <article className="group cursor-pointer rounded-[1.75rem] bg-white p-3 shadow-[0_10px_30px_rgba(0,0,0,.06)] hover:shadow-[0_18px_40px_rgba(0,0,0,.1)] transition-shadow">
                  <div className="h-56 md:h-64 rounded-2xl overflow-hidden">
                    {p.img ? <img src={p.img} alt={p.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" /> : <Mock tone={i} />}
                  </div>
                  <div className="px-2 pt-4 pb-2">
                    <div className="flex flex-wrap gap-2 mb-4">
                      {p.tags.map((tag) => (
                        <span key={tag} className="px-3 py-1 rounded-full bg-sky-50 border border-sky-200 text-[0.7rem] font-semibold text-sky-700">{tag}</span>
                      ))}
                    </div>
                    <div className="flex items-end justify-between gap-4">
                      <h3 className="text-lg md:text-xl font-bold leading-snug text-zinc-900 max-w-[18rem]">{p.title}</h3>
                      <span className="shrink-0 w-10 h-10 rounded-full bg-zinc-900 text-white grid place-items-center transition-all duration-300 group-hover:rotate-[-45deg] group-hover:bg-sky-600">→</span>
                    </div>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── GALLERY ── */}
      <section id="gallery" className="scroll-mt-0 bg-white py-24 md:py-36 overflow-hidden">
        <div className="max-w-6xl mx-auto px-6 md:px-16 mb-8 md:mb-12">
          <SectionHead
            accent={t.gallery.accent}
            sub={t.gallery.sub}
          >
            {t.gallery.head}
          </SectionHead>
        </div>

        <div className="w-full h-[560px] md:h-[640px] relative">
          <FlexCarousel
            items={t.gallery.items}
            preset="liquid"
            intro="rise"
            cardHeight={0.55}
            gap={16}
            radius={18}
            squeeze={0.2}
            focusOnClick
            captions
            autoplay
            interval={4}
          />
        </div>
      </section>

      {/* ── EXPERIENCE ── */}
      <section id="experience" className="scroll-mt-0 relative overflow-hidden text-white bg-[#050507] px-6 md:px-16 py-24 md:py-36">
        <div aria-hidden="true" className="pointer-events-none absolute -right-40 top-1/3 w-[36rem] h-[36rem] rounded-full blur-3xl opacity-40" style={{ background: 'radial-gradient(closest-side, rgba(70,150,255,.22), transparent)' }} />
        <div className="relative max-w-6xl mx-auto">
          <SectionHead dark accent={t.experience.accent} sub={t.experience.sub} className="mb-12 md:mb-16">
            {t.experience.head}
          </SectionHead>

          <ExperienceTimeline items={t.experience.items} />
        </div>
      </section>

      {/* ── CONTACT / FOOTER ── */}
      <footer id="contact" className="relative overflow-hidden bg-[#050507] text-white border-t border-white/10 px-6 md:px-16 pt-24 md:pt-32">
        <div aria-hidden="true" className="pointer-events-none absolute left-1/2 -translate-x-1/2 top-0 w-[46rem] h-[26rem] rounded-full blur-3xl opacity-40" style={{ background: 'radial-gradient(closest-side, rgba(70,150,255,.28), transparent)' }} />
        <div aria-hidden="true" className="pointer-events-none absolute inset-0" style={{ backgroundImage: 'radial-gradient(rgba(255,255,255,.07) 1px, transparent 1px)', backgroundSize: '24px 24px', maskImage: 'radial-gradient(ellipse at 50% 0%, #000 10%, transparent 65%)', WebkitMaskImage: 'radial-gradient(ellipse at 50% 0%, #000 10%, transparent 65%)' }} />

        <div className="relative max-w-6xl mx-auto">
          {/* CTA */}
          <Reveal>
            <h2 className="text-5xl sm:text-6xl md:text-[5.5rem] font-extrabold tracking-[-0.04em] leading-[1.02]" style={{ fontFamily: "'Manrope','Plus Jakarta Sans',sans-serif" }}>
              {t.footer.ctaHead1}<br />
              <span className="italic font-semibold text-transparent bg-clip-text pr-1" style={ACCENT_DARK}>{t.footer.ctaAccent}</span>
            </h2>
            <p className="mt-6 text-base md:text-lg text-white/55 max-w-xl">
              {t.footer.ctaSub}
            </p>
            <div className="mt-10 flex flex-wrap gap-3">
              <a href="mailto:vannryuichi@gmail.com" className="inline-flex items-center gap-3 h-14 pl-8 pr-2 rounded-full bg-white text-black font-semibold hover:bg-sky-200 transition-colors">
                vannryuichi@gmail.com
                <span className="w-10 h-10 rounded-full bg-black text-white grid place-items-center">↗</span>
              </a>
              <a href="#hero" className="inline-flex items-center h-14 px-8 rounded-full border border-white/20 text-white/80 font-semibold hover:bg-white/10 hover:text-white transition-colors">
                {t.footer.backToTop}
              </a>
            </div>
          </Reveal>

          {/* kolom info */}
          <div className="mt-20 md:mt-28 grid sm:grid-cols-3 gap-10 border-t border-white/10 pt-12">
            <div>
              <h4 className="text-[0.7rem] font-mono tracking-[0.25em] uppercase text-white/35 mb-5">{t.footer.menuTitle}</h4>
              <ul className="space-y-3">
                {t.nav.map((n) => (
                  <li key={n.id}><a href={`#${n.id}`} className="text-white/70 hover:text-white transition-colors">{n.label}</a></li>
                ))}
              </ul>
            </div>
             <div>
              <h4 className="text-[0.7rem] font-mono tracking-[0.25em] uppercase text-white/35 mb-5">{t.footer.socialTitle}</h4>
              <ul className="space-y-3">
                {[
                  ['GitHub', 'https://github.com/VanzRyuichi'],
                  ['Vanzz API', 'https://apiz.vsunsee.qzz.io'],
                  ['WhatsApp', 'https://wa.me/6288276746473']
                ].map(([l, u]) => (
                  <li key={l}>
                    <a href={u} target="_blank" rel="noopener noreferrer" className="group inline-flex items-center gap-1.5 text-white/70 hover:text-white transition-colors">
                      {l} <span className="opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all">↗</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-[0.7rem] font-mono tracking-[0.25em] uppercase text-white/35 mb-5">{t.footer.contactTitle}</h4>
              <ul className="space-y-3 text-white/70">
                <li>vannryuichi@gmail.com</li>
                <li>Indonesia</li>
                <li className="inline-flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,.8)]" /> {t.footer.status}</li>
              </ul>
            </div>
          </div>

          {/* bar bawah */}
          <div className="mt-16 flex flex-wrap items-center justify-between gap-4 text-xs font-mono text-white/35">
            <span>{t.footer.rights}</span>
            <span>{t.footer.madeWith}</span>
          </div>
        </div>

        {/* tulisan raksasa */}
        <div className="relative mt-10 md:mt-14 -mb-[0.04em] pointer-events-none">
          <FitText text="VANZZ DEV" />
        </div>
      </footer>
    </div>
  );
}