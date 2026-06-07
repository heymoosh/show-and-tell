import React from 'react';
import { ArrowLeft, ChevronDown } from 'lucide-react';
import { THEMES, themeVars } from './theme';
import { useScrollSpy } from './hooks';
import AIExport from './AIExport';

/* Section — a scroll-anchored block. Pages compose these as children. */
export function Section({ id, children, className = '', width = 'reading' }) {
  const max =
    width === 'wide' ? 'max-w-6xl' : width === 'mid' ? 'max-w-4xl' : 'max-w-3xl';
  return (
    <section id={id} className={`scroll-mt-24 px-6 md:px-10 ${className}`}>
      <div className={`mx-auto ${max}`}>{children}</div>
    </section>
  );
}

export default function ResearchLayout({
  theme = 'capitalism',
  eyebrow,
  title,
  dek,
  sections = [],
  heroMeta = [],
  reportText,
  exportTitle,
  exportFilename,
  exportStarter,
  onBack,
  children,
}) {
  const t = THEMES[theme] || THEMES.capitalism;
  const ids = sections.map((s) => s.id);
  const active = useScrollSpy(ids.length ? ids : ['__none__']);

  const jump = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="research-root research-grain min-h-screen" style={themeVars(theme)}>
      {/* Sticky header — back, section nav, export always reachable */}
      <header
        className="sticky top-0 z-40 border-b backdrop-blur-md"
        style={{ borderColor: 'var(--rule)', background: 'rgba(243,238,226,0.82)' }}
      >
        <div className="mx-auto flex max-w-6xl items-center gap-4 px-4 py-3 md:px-8">
          <button
            onClick={onBack}
            className="inline-flex shrink-0 items-center gap-1.5 font-mono text-[12px] uppercase tracking-wider transition-colors hover:text-[color:var(--accent)]"
            style={{ color: 'var(--muted)' }}
          >
            <ArrowLeft size={14} />
            <span className="hidden sm:inline">Show &amp; Tell</span>
          </button>

          <span className="hidden h-4 w-px shrink-0 md:block" style={{ background: 'var(--rule)' }} />
          <span
            className="hidden shrink-0 font-mono text-[11px] uppercase tracking-[0.18em] md:block"
            style={{ color: 'var(--accent)' }}
          >
            {t.label}
          </span>

          {/* Section nav */}
          <nav className="ml-auto flex min-w-0 items-center gap-1 overflow-x-auto md:ml-2 md:flex-1 md:justify-center">
            {sections.map((s) => (
              <button
                key={s.id}
                onClick={() => jump(s.id)}
                className="relative shrink-0 px-2.5 py-1 font-mono text-[11px] uppercase tracking-wider transition-colors"
                style={{ color: active === s.id ? 'var(--accent)' : 'var(--muted)' }}
              >
                {s.label}
                {active === s.id && (
                  <span
                    className="absolute inset-x-2 -bottom-[1px] h-[2px] rounded-full"
                    style={{ background: 'var(--accent)' }}
                  />
                )}
              </button>
            ))}
          </nav>

          <div className="ml-auto shrink-0 md:ml-0">
            <AIExport
              title={exportTitle || title}
              reportText={reportText}
              filename={exportFilename}
              starter={exportStarter}
            />
          </div>
        </div>
      </header>

      {/* Hero */}
      <section
        className="relative overflow-hidden px-6 py-20 md:px-10 md:py-28"
        style={{ background: t.heroBg, color: '#f4ecdf' }}
      >
        {/* atmospheric accent glow */}
        <div
          className="pointer-events-none absolute -right-32 -top-32 h-[460px] w-[460px] rounded-full opacity-30 blur-3xl"
          style={{ background: t.accent }}
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute -bottom-40 -left-24 h-[360px] w-[360px] rounded-full opacity-20 blur-3xl"
          style={{ background: t.accent }}
          aria-hidden="true"
        />
        <div className="relative mx-auto max-w-4xl">
          {eyebrow && (
            <div
              className="font-mono text-[12px] uppercase tracking-[0.28em] animate-fade-in"
              style={{ color: t.accent, filter: 'brightness(1.7)' }}
            >
              {eyebrow}
            </div>
          )}
          <h1
            className="mt-5 font-display text-[clamp(2.4rem,7vw,5.2rem)] font-semibold leading-[0.98] tracking-[-0.02em] animate-fade-up"
            style={{ animationDelay: '80ms' }}
          >
            {title}
          </h1>
          {dek && (
            <p
              className="mt-6 max-w-2xl font-serif text-[clamp(1.05rem,2.2vw,1.4rem)] leading-relaxed text-[#e6dcc9]/90 animate-fade-up"
              style={{ animationDelay: '220ms' }}
            >
              {dek}
            </p>
          )}

          {heroMeta.length > 0 && (
            <div
              className="mt-12 grid grid-cols-2 gap-x-8 gap-y-6 border-t pt-8 sm:grid-cols-4 animate-fade-up"
              style={{ borderColor: 'rgba(244,236,223,0.18)', animationDelay: '360ms' }}
            >
              {heroMeta.map((m, i) => (
                <div key={i}>
                  <div className="font-display text-[clamp(1.6rem,3.4vw,2.4rem)] font-semibold leading-none" style={{ color: '#fff' }}>
                    {m.value}
                  </div>
                  <div className="mt-2 font-mono text-[10px] uppercase tracking-wider text-[#e6dcc9]/60">
                    {m.label}
                  </div>
                </div>
              ))}
            </div>
          )}

          {sections.length > 0 && (
            <button
              onClick={() => jump(sections[0].id)}
              className="mt-14 inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.2em] text-[#e6dcc9]/70 transition-colors hover:text-white animate-fade-in"
              style={{ animationDelay: '520ms' }}
            >
              <ChevronDown size={15} className="animate-float-slow" />
              Start reading
            </button>
          )}
        </div>
      </section>

      {/* Body */}
      <main className="relative z-10 py-16 md:py-24">
        <div className="flex flex-col gap-20 md:gap-28">{children}</div>
      </main>

      {/* Footer */}
      <footer className="border-t px-6 py-10 md:px-10" style={{ borderColor: 'var(--rule)' }}>
        <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div className="font-mono text-[11px] uppercase tracking-wider" style={{ color: 'var(--muted)' }}>
            {t.label} · Show &amp; Tell
          </div>
          <button
            onClick={onBack}
            className="font-mono text-[11px] uppercase tracking-wider transition-colors hover:text-[color:var(--accent)]"
            style={{ color: 'var(--muted)' }}
          >
            ← Back to all projects
          </button>
        </div>
      </footer>
    </div>
  );
}
