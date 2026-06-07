import React, { useState } from 'react';
import { ArrowUpRight } from 'lucide-react';

/**
 * ResearchPortal — a framed "interactive report" card that sits on the workbench
 * alongside the simulation portals. CSS + inline-SVG art (no image assets needed).
 */

function Motif({ kind, accent }) {
  if (kind === 'capitalism') {
    // ranking podium — ascending bars, crown on the tallest
    return (
      <svg viewBox="0 0 120 80" className="h-full w-full">
        <g fill={accent}>
          <rect x="14" y="46" width="20" height="26" rx="2" opacity="0.45" />
          <rect x="50" y="22" width="20" height="50" rx="2" />
          <rect x="86" y="38" width="20" height="34" rx="2" opacity="0.7" />
        </g>
        <path d="M52 16 l4 6 4-6 4 6 4-6 v-0 h-16 z" fill={accent} transform="translate(-2,-2)" />
        <path d="M55 13l5 5 5-5-1.5 9h-7z" fill={accent} />
      </svg>
    );
  }
  if (kind === 'innovation') {
    // gauge / dial with needle
    return (
      <svg viewBox="0 0 120 80" className="h-full w-full">
        <path d="M18 66 A42 42 0 0 1 102 66" fill="none" stroke={accent} strokeOpacity="0.3" strokeWidth="8" strokeLinecap="round" />
        <path d="M18 66 A42 42 0 0 1 78 30" fill="none" stroke={accent} strokeWidth="8" strokeLinecap="round" />
        <line x1="60" y1="66" x2="84" y2="40" stroke={accent} strokeWidth="3.5" strokeLinecap="round" />
        <circle cx="60" cy="66" r="6" fill={accent} />
      </svg>
    );
  }
  // inequality — inverted-U curve with peak dot
  return (
    <svg viewBox="0 0 120 80" className="h-full w-full">
      <path d="M14 66 Q60 6 106 66" fill="none" stroke={accent} strokeWidth="3.5" strokeLinecap="round" />
      <line x1="14" y1="70" x2="106" y2="70" stroke={accent} strokeOpacity="0.3" strokeWidth="2" />
      <circle cx="60" cy="24" r="5.5" fill={accent} />
      <circle cx="92" cy="50" r="3.5" fill={accent} opacity="0.5" />
      <circle cx="30" cy="52" r="3.5" fill={accent} opacity="0.5" />
    </svg>
  );
}

export default function ResearchPortal({
  kind, title, tag, accent, accentSoft, onClick, rotate = 0, className = '',
}) {
  const [hover, setHover] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      data-testid={`research-portal-${kind}`}
      aria-label={`Open ${title}`}
      className={`group relative block text-left ${className}`}
      style={{
        transform: hover ? 'translateY(-10px) rotate(0deg)' : `rotate(${rotate}deg)`,
        transition: 'transform 0.35s cubic-bezier(0.22,1,0.36,1)',
      }}
    >
      {/* frame */}
      <div
        className="rounded-[10px] p-2.5"
        style={{
          background: 'linear-gradient(160deg,#fbf7ee,#ece3d2)',
          boxShadow: hover
            ? '0 34px 56px -18px rgba(0,0,0,0.55)'
            : '0 18px 34px -14px rgba(0,0,0,0.4)',
          border: '1px solid rgba(0,0,0,0.12)',
        }}
      >
        {/* art window */}
        <div
          className="relative flex h-32 items-center justify-center overflow-hidden rounded-[6px] px-8"
          style={{ background: accentSoft, borderBottom: `3px solid ${accent}` }}
        >
          <div className="h-20 w-28 transition-transform duration-500" style={{ transform: hover ? 'scale(1.08)' : 'scale(1)' }}>
            <Motif kind={kind} accent={accent} />
          </div>
          <span
            className="absolute left-2.5 top-2.5 font-mono text-[9px] uppercase tracking-[0.18em]"
            style={{ color: accent }}
          >
            {tag}
          </span>
        </div>

        {/* plaque */}
        <div className="flex items-center justify-between gap-2 px-1.5 pb-1 pt-3">
          <span
            className="font-display text-[1.02rem] font-semibold leading-tight"
            style={{ color: '#26211b', fontFamily: 'Fraunces, Georgia, serif' }}
          >
            {title}
          </span>
          <ArrowUpRight
            size={16}
            style={{ color: accent, opacity: hover ? 1 : 0.5, transform: hover ? 'translate(2px,-2px)' : 'none', transition: 'all 0.3s' }}
          />
        </div>
      </div>
    </button>
  );
}
