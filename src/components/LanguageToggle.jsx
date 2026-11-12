import React from 'react';

/**
 * <LanguageToggle lang="en" | "id" onToggle={() => {}} />
 * Tombol pengubah bahasa EN / ID dengan gaya pill kaca modern (senada dengan SpecularButton / GooeyNav),
 * memiliki efek sliding active indicator, ikon globe, dan transisi halus.
 */
export default function LanguageToggle({ lang = 'en', onToggle, className = '' }) {
  const isEn = lang === 'en';

  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={`Switch language to ${isEn ? 'Indonesian' : 'English'}`}
      className={`group relative inline-flex items-center h-12 p-1 rounded-full bg-[rgba(10,10,14,0.92)] text-white backdrop-blur-xl border border-white/15 shadow-[0_8px_24px_rgba(0,0,0,0.25)] select-none cursor-pointer transition-all duration-300 hover:border-white/30 hover:scale-[1.02] active:scale-[0.97] ${className}`}
    >
      {/* Sliding indicator pill */}
      <span
        className="absolute top-1 bottom-1 w-[calc(50%-4px)] rounded-full bg-white transition-all duration-300 cubic-bezier(0.2,0.8,0.2,1) shadow-sm"
        style={{
          left: isEn ? '4px' : 'calc(50%)',
        }}
        aria-hidden="true"
      />

      {/* EN option */}
      <span
        className={`relative z-10 flex items-center justify-center gap-1 min-w-[2.75rem] px-2 text-xs font-bold tracking-wider transition-colors duration-200 ${
          isEn ? 'text-[#0a0a0e]' : 'text-white/60 group-hover:text-white'
        }`}
      >
        <span className="text-[10px] opacity-75">🇬🇧</span> EN
      </span>

      {/* ID option */}
      <span
        className={`relative z-10 flex items-center justify-center gap-1 min-w-[2.75rem] px-2 text-xs font-bold tracking-wider transition-colors duration-200 ${
          !isEn ? 'text-[#0a0a0e]' : 'text-white/60 group-hover:text-white'
        }`}
      >
        <span className="text-[10px] opacity-75">🇮🇩</span> ID
      </span>
    </button>
  );
}

