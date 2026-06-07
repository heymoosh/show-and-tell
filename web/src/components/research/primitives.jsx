import React from 'react';
import { useInView, useCountUp } from './hooks';

/* Reveal — fades + slides children in when scrolled into view. */
export function Reveal({ children, delay = 0, className = '', as: Tag = 'div' }) {
  const [ref, visible] = useInView();
  return (
    <Tag
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(22px)',
        transition: `opacity 0.7s cubic-bezier(0.22,1,0.36,1) ${delay}ms, transform 0.7s cubic-bezier(0.22,1,0.36,1) ${delay}ms`,
        willChange: 'opacity, transform',
      }}
    >
      {children}
    </Tag>
  );
}

/* AnimatedNumber — counts up on scroll-in. */
export function AnimatedNumber({ value, decimals = 0, prefix = '', suffix = '', className = '' }) {
  const [ref, display] = useCountUp(value, { decimals });
  return (
    <span ref={ref} className={className}>
      {prefix}
      {display}
      {suffix}
    </span>
  );
}

/* Eyebrow — small mono label above a heading. */
export function Eyebrow({ children, className = '' }) {
  return (
    <div
      className={`font-mono text-[11px] uppercase tracking-[0.22em] ${className}`}
      style={{ color: 'var(--accent)' }}
    >
      {children}
    </div>
  );
}

/* SectionHeading — eyebrow + big display title + optional dek. */
export function SectionHeading({ eyebrow, title, dek, kicker }) {
  return (
    <header className="max-w-2xl">
      {eyebrow && <Eyebrow className="mb-3">{eyebrow}</Eyebrow>}
      <h2 className="font-display text-[clamp(1.9rem,4vw,3rem)] font-semibold leading-[1.05] tracking-tight text-ink">
        {title}
      </h2>
      {dek && (
        <p className="mt-4 text-[1.05rem] leading-relaxed" style={{ color: 'var(--muted)' }}>
          {dek}
        </p>
      )}
    </header>
  );
}

/* StatCallout — large number + label, used in grids. */
export function StatCallout({ value, decimals = 0, prefix = '', suffix = '', label, sub, animate = true, tone = 'accent' }) {
  const color = tone === 'neg' ? 'var(--neg)' : tone === 'ink' ? 'var(--ink)' : 'var(--accent)';
  return (
    <div className="border-t pt-4" style={{ borderColor: 'var(--rule)' }}>
      <div className="font-display text-[clamp(2.2rem,5vw,3.4rem)] font-semibold leading-none" style={{ color }}>
        {animate && typeof value === 'number' ? (
          <AnimatedNumber value={value} decimals={decimals} prefix={prefix} suffix={suffix} />
        ) : (
          <>{prefix}{value}{suffix}</>
        )}
      </div>
      <div className="mt-2 font-sans text-[0.95rem] font-medium text-ink" style={{ fontFamily: 'Newsreader, serif' }}>
        {label}
      </div>
      {sub && (
        <div className="mt-1 font-mono text-[11px] uppercase tracking-wider" style={{ color: 'var(--muted)' }}>
          {sub}
        </div>
      )}
    </div>
  );
}

/* PullQuote — large editorial quote with accent rule. */
export function PullQuote({ children, cite }) {
  return (
    <Reveal
      as="figure"
      className="my-12 border-l-4 pl-6 md:pl-8"
      // accent rule
    >
      <blockquote
        className="font-display text-[clamp(1.4rem,3vw,2.1rem)] font-light italic leading-[1.25]"
        style={{ color: 'var(--accent-ink)' }}
      >
        {children}
      </blockquote>
      {cite && (
        <figcaption className="mt-4 font-mono text-[11px] uppercase tracking-[0.18em]" style={{ color: 'var(--muted)' }}>
          — {cite}
        </figcaption>
      )}
    </Reveal>
  );
}

/* KeyFinding — a numbered finding card for the TL;DR grid. */
export function KeyFinding({ index, title, children, delay = 0 }) {
  return (
    <Reveal
      delay={delay}
      className="group relative rounded-lg border bg-[var(--paper-card)] p-6 transition-shadow hover:shadow-[0_18px_40px_-22px_rgba(33,29,24,0.5)]"
      // card
    >
      <div
        className="font-mono text-[12px] font-semibold"
        style={{ color: 'var(--accent)' }}
      >
        {String(index).padStart(2, '0')}
      </div>
      <h3 className="mt-3 font-display text-[1.3rem] font-semibold leading-tight text-ink">{title}</h3>
      <div className="mt-2 text-[0.98rem] leading-relaxed" style={{ color: '#3a342c' }}>
        {children}
      </div>
    </Reveal>
  );
}

/* Figure wrapper for a chart / interactive with caption. */
export function Figure({ children, caption, source, className = '' }) {
  return (
    <figure className={`my-2 ${className}`}>
      <div className="rounded-lg border bg-[var(--paper-card)] p-4 md:p-6" style={{ borderColor: 'var(--rule)' }}>
        {children}
      </div>
      {(caption || source) && (
        <figcaption className="mt-3 flex flex-wrap items-baseline justify-between gap-2">
          {caption && <span className="text-[0.9rem]" style={{ color: 'var(--muted)' }}>{caption}</span>}
          {source && (
            <span className="font-mono text-[10px] uppercase tracking-wider" style={{ color: 'var(--muted)' }}>
              {source}
            </span>
          )}
        </figcaption>
      )}
    </figure>
  );
}

/* Callout — boxed note (e.g. methodology nuance). */
export function Callout({ children, label = 'Note', tone = 'accent' }) {
  return (
    <aside
      className="my-8 rounded-lg border-l-4 px-5 py-4"
      style={{
        borderColor: tone === 'neg' ? 'var(--neg)' : 'var(--accent)',
        background: 'rgba(var(--accent-rgb), 0.06)',
      }}
    >
      <div className="font-mono text-[10px] uppercase tracking-[0.2em]" style={{ color: 'var(--accent)' }}>
        {label}
      </div>
      <div className="mt-2 text-[0.98rem] leading-relaxed" style={{ color: '#332e26' }}>
        {children}
      </div>
    </aside>
  );
}

/* Hairline divider with optional centered glyph. */
export function Rule({ glyph = '§' }) {
  return (
    <div className="my-14 flex items-center gap-4" aria-hidden="true">
      <span className="h-px flex-1" style={{ background: 'var(--rule)' }} />
      <span className="font-display text-sm" style={{ color: 'var(--muted)' }}>{glyph}</span>
      <span className="h-px flex-1" style={{ background: 'var(--rule)' }} />
    </div>
  );
}
