import React, { useRef } from 'react';

/**
 * <SpecularButton href>Contact me</SpecularButton>
 * Tombol kaca hitam dengan kilau "specular": cahaya mengikuti kursor di permukaan & tepi tombol,
 * plus kilatan diagonal yang menyapu secara berkala.
 */
const CSS = `
.sb{position:relative;isolation:isolate;display:inline-flex;align-items:center;gap:.5rem;height:3rem;padding:0 1.5rem;border-radius:9999px;overflow:hidden;color:#fff;font-size:.875rem;font-weight:600;text-decoration:none;white-space:nowrap;cursor:pointer;
 background:linear-gradient(180deg,#2a2a31 0%,#0a0a0d 100%);
 box-shadow:inset 0 1px 0 rgba(255,255,255,.22),inset 0 -1px 0 rgba(0,0,0,.6),0 10px 26px rgba(0,0,0,.32);
 transition:transform .25s ease,box-shadow .25s ease}
.sb:hover{transform:translateY(-1px);box-shadow:inset 0 1px 0 rgba(255,255,255,.3),inset 0 -1px 0 rgba(0,0,0,.6),0 14px 32px rgba(0,0,0,.4)}
.sb:active{transform:scale(.97)}
.sb-surface{position:absolute;inset:0;z-index:-1;border-radius:inherit;pointer-events:none;opacity:var(--so,0);transition:opacity .3s ease;
 background:radial-gradient(120px circle at var(--sx,50%) var(--sy,-30%),rgba(255,255,255,.3),transparent 65%)}
.sb-rim{position:absolute;inset:0;z-index:-1;border-radius:inherit;padding:1px;pointer-events:none;opacity:calc(.3 + var(--so,0)*.7);transition:opacity .3s ease;
 background:radial-gradient(80px circle at var(--sx,50%) var(--sy,50%),rgba(255,255,255,.95),rgba(255,255,255,.08) 70%);
 -webkit-mask:linear-gradient(#000 0 0) content-box,linear-gradient(#000 0 0);-webkit-mask-composite:xor;mask:linear-gradient(#000 0 0) content-box exclude,linear-gradient(#000 0 0)}
.sb-sweep{position:absolute;top:0;bottom:0;left:-60%;width:40%;z-index:-1;pointer-events:none;transform:skewX(-18deg);
 background:linear-gradient(105deg,transparent 20%,rgba(255,255,255,.3) 50%,transparent 80%);animation:sb-sweep 4s ease-in-out infinite}
@keyframes sb-sweep{0%,55%{left:-60%}100%{left:140%}}
.sb-label{display:inline-flex;align-items:center;gap:.5rem;position:relative}
`;

export default function SpecularButton({ href, children, className = '', ...rest }) {
  const ref = useRef(null);
  const move = (e) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty('--sx', `${e.clientX - r.left}px`);
    el.style.setProperty('--sy', `${e.clientY - r.top}px`);
  };
  const enter = (e) => { move(e); ref.current?.style.setProperty('--so', 1); };
  const leave = () => ref.current?.style.setProperty('--so', 0);
  const Tag = href ? 'a' : 'button';
  return (
    <>
      <style>{CSS}</style>
      <Tag ref={ref} href={href} className={`sb ${className}`} onPointerEnter={enter} onPointerMove={move} onPointerLeave={leave} {...rest}>
        <span className="sb-surface" aria-hidden="true" />
        <span className="sb-rim" aria-hidden="true" />
        <span className="sb-sweep" aria-hidden="true" />
        <span className="sb-label">{children}</span>
      </Tag>
    </>
  );
}
