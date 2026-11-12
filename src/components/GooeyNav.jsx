import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';

/**
 * <GooeyNav items activeId />
 * Navbar "gooey": pil putih menggeser ke menu aktif + ledakan partikel yang menyatu seperti cairan.
 * Efek gooey memakai filter SVG (blur + alpha threshold) sehingga jalan di background terang maupun gelap.
 * - items    : [{ id, label }]  -> link ke #id
 * - activeId : id section yang sedang aktif (dari scroll-spy)
 */
const CSS = `
.gn-nav{position:relative;border-radius:9999px;background:rgba(10,10,14,.92);backdrop-filter:blur(16px);-webkit-backdrop-filter:blur(16px);box-shadow:0 8px 30px rgba(0,0,0,.18),inset 0 0 0 1px rgba(255,255,255,.1)}
.gn-ul{position:relative;z-index:1;display:flex;gap:.25rem;padding:.375rem;margin:0;list-style:none}
.gn-li{position:relative;border-radius:9999px;color:rgba(255,255,255,.72);transition:color .3s ease .1s;white-space:nowrap}
.gn-li a{display:block;padding:.5rem 1.25rem;border-radius:9999px;font-size:.875rem;font-weight:600;color:inherit;text-decoration:none;user-select:none}
.gn-li:hover{color:#fff}
.gn-li.is-active,.gn-li.is-active:hover{color:#0a0a0e}
.gn-blob{position:absolute;z-index:0;pointer-events:none;opacity:0;filter:url(#gn-goo);transition:left .4s cubic-bezier(.4,0,.2,1),top .4s cubic-bezier(.4,0,.2,1),width .4s cubic-bezier(.4,0,.2,1),height .4s cubic-bezier(.4,0,.2,1),opacity .3s ease}
.gn-pill{position:absolute;inset:0;border-radius:9999px;background:#fff}
.gn-pop .gn-pill{animation:gn-pop .35s ease both}
@keyframes gn-pop{from{transform:scale(.8)}to{transform:scale(1)}}
.gn-particle,.gn-point{display:block;opacity:0;width:20px;height:20px;border-radius:9999px;transform-origin:center}
.gn-particle{--time:5s;position:absolute;top:calc(50% - 10px);left:calc(50% - 10px);animation:gn-particle var(--time) ease 1 -350ms}
.gn-point{background:var(--color);opacity:1;animation:gn-point var(--time) ease 1 -350ms}
@keyframes gn-particle{
 0%{transform:rotate(0deg) translate(var(--start-x),var(--start-y));opacity:1;animation-timing-function:cubic-bezier(.55,0,1,.45)}
 70%{transform:rotate(calc(var(--rotate)*.5)) translate(calc(var(--end-x)*1.2),calc(var(--end-y)*1.2));opacity:1;animation-timing-function:ease}
 85%{transform:rotate(calc(var(--rotate)*.66)) translate(var(--end-x),var(--end-y));opacity:1}
 100%{transform:rotate(calc(var(--rotate)*1.2)) translate(calc(var(--end-x)*.5),calc(var(--end-y)*.5));opacity:1}
}
@keyframes gn-point{
 0%{transform:scale(0);opacity:0;animation-timing-function:cubic-bezier(.55,0,1,.45)}
 25%{transform:scale(calc(var(--scale)*.25))}
 38%{opacity:1}
 65%{transform:scale(var(--scale));opacity:1;animation-timing-function:ease}
 85%{transform:scale(var(--scale));opacity:1}
 100%{transform:scale(0);opacity:0}
}
`;

const noise = (n = 1) => n / 2 - Math.random() * n;
const getXY = (distance, i, total) => {
  const angle = ((360 + noise(8)) / total) * i * (Math.PI / 180);
  return [distance * Math.cos(angle), distance * Math.sin(angle)];
};

export default function GooeyNav({
  items,
  activeId,
  animationTime = 600,
  particleCount = 15,
  particleDistances = [90, 10],
  particleR = 100,
  timeVariance = 300,
  colors = ['#ffffff', '#7ab8ff', '#38bdf8', '#bfe3ff'],
}) {
  const ulRef = useRef(null);
  const blobRef = useRef(null);
  const liRefs = useRef([]);
  const indexOf = (id) => items.findIndex((i) => i.id === id);
  const [current, setCurrent] = useState(() => indexOf(activeId));
  const activeRef = useRef(activeId);
  activeRef.current = activeId;
  const lock = useRef(false);
  const idleT = useRef(0);
  const lastBurst = useRef(0);
  const mounted = useRef(false);

  // ikuti section aktif (scroll-spy), kecuali sedang menunggu hasil klik
  useEffect(() => { if (!lock.current) setCurrent(indexOf(activeId)); }, [activeId]);

  // setelah klik: kunci sampai scroll berhenti, lalu sinkron lagi
  useEffect(() => {
    const onScroll = () => {
      if (!lock.current) return;
      clearTimeout(idleT.current);
      idleT.current = setTimeout(() => { lock.current = false; setCurrent(indexOf(activeRef.current)); }, 180);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => { window.removeEventListener('scroll', onScroll); clearTimeout(idleT.current); };
  }, []);

  const place = () => {
    const li = liRefs.current[current], b = blobRef.current;
    if (!b) return;
    if (!li) { b.style.opacity = 0; return; }
    b.style.opacity = 1;
    b.style.left = li.offsetLeft + 'px';
    b.style.top = li.offsetTop + 'px';
    b.style.width = li.offsetWidth + 'px';
    b.style.height = li.offsetHeight + 'px';
  };
  useLayoutEffect(place, [current]);
  useEffect(() => {
    const ro = new ResizeObserver(place);
    ulRef.current && ro.observe(ulRef.current);
    document.fonts?.ready.then(place);
    return () => ro.disconnect();
  }, [current]);

  const makeParticles = (el) => {
    el.style.setProperty('--time', `${animationTime * 2 + timeVariance}ms`);
    for (let i = 0; i < particleCount; i++) {
      const t = animationTime * 2 + noise(timeVariance * 2);
      const rot = noise(particleR / 10);
      const p = {
        start: getXY(particleDistances[0], particleCount - i, particleCount),
        end: getXY(particleDistances[1] + noise(7), particleCount - i, particleCount),
        scale: 1 + noise(0.2),
        color: colors[Math.floor(Math.random() * colors.length)],
        rotate: rot > 0 ? (rot + particleR / 20) * 10 : (rot - particleR / 20) * 10,
      };
      setTimeout(() => {
        const particle = document.createElement('span');
        const point = document.createElement('span');
        particle.className = 'gn-particle';
        particle.style.setProperty('--start-x', `${p.start[0]}px`);
        particle.style.setProperty('--start-y', `${p.start[1]}px`);
        particle.style.setProperty('--end-x', `${p.end[0]}px`);
        particle.style.setProperty('--end-y', `${p.end[1]}px`);
        particle.style.setProperty('--time', `${t}ms`);
        particle.style.setProperty('--scale', `${p.scale}`);
        particle.style.setProperty('--rotate', `${p.rotate}deg`);
        point.className = 'gn-point';
        point.style.setProperty('--color', p.color);
        point.style.setProperty('--scale', `${p.scale}`);
        particle.appendChild(point);
        el.appendChild(particle);
        setTimeout(() => { try { el.removeChild(particle); } catch { /* sudah terhapus */ } }, t);
      }, 30);
    }
  };

  // ledakan partikel tiap pindah menu
  useEffect(() => {
    if (!mounted.current) { mounted.current = true; return; }
    const b = blobRef.current;
    if (!b || current < 0) return;
    const now = performance.now();
    if (now - lastBurst.current < 350) return;
    lastBurst.current = now;
    b.classList.remove('gn-pop'); void b.offsetWidth; b.classList.add('gn-pop');
    makeParticles(b);
  }, [current]);

  const onClick = (i) => {
    lock.current = true;
    clearTimeout(idleT.current);
    idleT.current = setTimeout(() => { lock.current = false; setCurrent(indexOf(activeRef.current)); }, 1300);
    setCurrent(i);
  };

  return (
    <>
      <style>{CSS}</style>
      <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden="true" focusable="false">
        <defs>
          <filter id="gn-goo" x="-150%" y="-400%" width="400%" height="900%" colorInterpolationFilters="sRGB">
            <feGaussianBlur in="SourceGraphic" stdDeviation="6" result="blur" />
            <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 19 -9" />
          </filter>
        </defs>
      </svg>
      <nav className="gn-nav" aria-label="Navigasi utama">
        <span ref={blobRef} className="gn-blob" aria-hidden="true"><span className="gn-pill" /></span>
        <ul ref={ulRef} className="gn-ul">
          {items.map((it, i) => (
            <li key={it.id} ref={(el) => (liRefs.current[i] = el)} className={`gn-li ${i === current ? 'is-active' : ''}`}>
              <a href={`#${it.id}`} onClick={() => onClick(i)}>{it.label}</a>
            </li>
          ))}
        </ul>
      </nav>
    </>
  );
}
