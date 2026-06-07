import React, { useEffect, useRef, useState } from 'react';
import { Sparkles, Copy, Download, Check, ExternalLink, X } from 'lucide-react';

/**
 * AIExport — no-API "ask an AI about this research" helper.
 *
 * Bundles the full report text + a ready-made starter prompt. The reader can
 * copy it to the clipboard or download it as a .md, then paste into ChatGPT,
 * Claude, Gemini, etc. Everything is client-side — no API, no cost.
 *
 * props:
 *   title        — report title used in the export header
 *   reportText   — string OR array of { heading, text }
 *   filename     — download filename (without extension)
 *   starter      — optional override for the suggested prompt
 */
export default function AIExport({ title, reportText, filename = 'research-report', starter }) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const panelRef = useRef(null);

  const prompt =
    starter ||
    `I'm reading a research report titled "${title}". The full text is below. ` +
      `Please help me understand it: give me a plain-language summary, explain the ` +
      `methodology and how much to trust the findings, surface the strongest counterarguments, ` +
      `and then answer any follow-up questions I ask.`;

  const body = Array.isArray(reportText)
    ? reportText.map((r) => (r.heading ? `\n\n# ${r.heading}\n\n${r.text}` : r.text)).join('\n\n')
    : reportText;

  const fullText = `${prompt}\n\n${'='.repeat(60)}\n# ${title}\n${'='.repeat(60)}\n${body}\n`;

  useEffect(() => {
    if (!open) return;
    const onDoc = (e) => {
      if (panelRef.current && !panelRef.current.contains(e.target)) setOpen(false);
    };
    const onEsc = (e) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('mousedown', onDoc);
    document.addEventListener('keydown', onEsc);
    return () => {
      document.removeEventListener('mousedown', onDoc);
      document.removeEventListener('keydown', onEsc);
    };
  }, [open]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(fullText);
    } catch {
      // fallback
      const ta = document.createElement('textarea');
      ta.value = fullText;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  const download = () => {
    const blob = new Blob([fullText], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${filename}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const openChat = async (url) => {
    await copy();
    window.open(url, '_blank', 'noopener');
  };

  const wordCount = body ? body.trim().split(/\s+/).length : 0;

  return (
    <div className="relative" ref={panelRef}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="inline-flex items-center gap-2 rounded-full border px-4 py-2 font-mono text-[12px] font-medium uppercase tracking-wider transition-colors"
        style={{
          borderColor: 'var(--accent)',
          color: open ? '#fff' : 'var(--accent)',
          background: open ? 'var(--accent)' : 'transparent',
        }}
      >
        <Sparkles size={14} />
        Ask an AI
      </button>

      {open && (
        <div
          className="absolute right-0 z-50 mt-3 w-[min(92vw,380px)] rounded-xl border bg-[var(--paper-card)] p-5 shadow-[0_30px_60px_-20px_rgba(33,29,24,0.5)]"
          style={{ borderColor: 'var(--rule)' }}
        >
          <div className="flex items-start justify-between">
            <div>
              <div className="font-display text-[1.15rem] font-semibold leading-tight text-ink">
                Discuss this with any chatbot
              </div>
              <p className="mt-1 text-[0.85rem] leading-snug" style={{ color: 'var(--muted)' }}>
                Grab the full report (~{wordCount.toLocaleString()} words) plus a ready-made prompt,
                then paste it into your favourite AI. No login here, nothing tracked.
              </p>
            </div>
            <button onClick={() => setOpen(false)} className="ml-2 shrink-0 text-ink/40 hover:text-ink">
              <X size={16} />
            </button>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-2">
            <button
              onClick={copy}
              className="inline-flex items-center justify-center gap-2 rounded-lg px-3 py-2.5 text-[13px] font-medium text-white transition-transform active:scale-95"
              style={{ background: 'var(--accent)' }}
            >
              {copied ? <Check size={15} /> : <Copy size={15} />}
              {copied ? 'Copied!' : 'Copy prompt + text'}
            </button>
            <button
              onClick={download}
              className="inline-flex items-center justify-center gap-2 rounded-lg border px-3 py-2.5 text-[13px] font-medium transition-colors hover:bg-black/5"
              style={{ borderColor: 'var(--rule)', color: 'var(--ink)' }}
            >
              <Download size={15} />
              Download .md
            </button>
          </div>

          <div className="mt-4 border-t pt-3" style={{ borderColor: 'var(--rule)' }}>
            <div className="font-mono text-[10px] uppercase tracking-[0.18em]" style={{ color: 'var(--muted)' }}>
              Copy, then open
            </div>
            <div className="mt-2 flex flex-wrap gap-2">
              {[
                ['ChatGPT', 'https://chat.openai.com/'],
                ['Claude', 'https://claude.ai/new'],
                ['Gemini', 'https://gemini.google.com/app'],
              ].map(([name, url]) => (
                <button
                  key={name}
                  onClick={() => openChat(url)}
                  className="inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[12px] font-medium transition-colors hover:bg-black/5"
                  style={{ borderColor: 'var(--rule)', color: 'var(--ink)' }}
                >
                  {name}
                  <ExternalLink size={11} />
                </button>
              ))}
            </div>
            {copied && (
              <p className="mt-2 text-[0.78rem]" style={{ color: 'var(--accent)' }}>
                ✓ Copied — just paste (⌘V) into the chat that opened.
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
