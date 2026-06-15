import React from 'react';
import {
  LineChart, Line, ScatterChart, Scatter, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Cell,
} from 'recharts';

/**
 * Analytics — presentational charts/tables driven entirely by the statistical
 * `ensemble` produced by engine.runEnsemble(). No simulation logic lives here.
 *
 * Exports:
 *   <ClimaxEvidence />  — the focused inline evidence shown at the story's climax
 *   <DeepAnalytics />   — the full "for the curious" panel (collapsed by default)
 */

const AXIS = { stroke: '#6f6a61', fontSize: 11, fontFamily: 'IBM Plex Mono, monospace' };
const GRID = 'rgba(255,255,255,0.06)';
const TOOLTIP_STYLE = {
  background: '#15121b',
  border: '1px solid rgba(232,184,75,0.25)',
  borderRadius: 8,
  fontFamily: 'IBM Plex Mono, monospace',
  fontSize: 12,
  color: '#ece6da',
};

function rClass(r) {
  const a = Math.abs(r ?? 0);
  if (a >= 0.7) return 'ys-r-strong';
  if (a >= 0.5) return 'ys-r-mod';
  return 'ys-r-weak';
}
const fmtR = (r) => (r == null ? '—' : r.toFixed(3));

function Loading({ label = 'Running 2,000,000-trade ensemble…' }) {
  return (
    <div className="ys-chart" style={{ display: 'grid', placeItems: 'center', minHeight: 220 }}>
      <span className="ys-num" style={{ color: '#6f6a61', fontSize: 13 }}>{label}</span>
    </div>
  );
}

/* ----------------------------------------------------------------------- */
/* Climax: the single most important piece of evidence, surfaced inline.    */
/* ----------------------------------------------------------------------- */
export function ClimaxEvidence({ ensemble }) {
  if (!ensemble) return <Loading />;
  const { survival, checkpoints, survivalScatter } = ensemble;
  // Strongest early→final correlation we observed (lock-in tightens over time).
  const strongest = [...checkpoints].filter((c) => c.r != null).sort((a, b) => Math.abs(b.r) - Math.abs(a.r))[0];

  return (
    <div className="ys-grid2" style={{ alignItems: 'stretch' }}>
      <div className="ys-chart">
        <div className="ttl">Survival time vs. final wealth · log₁₀</div>
        <ResponsiveContainer width="100%" height={240}>
          <ScatterChart margin={{ top: 8, right: 16, bottom: 24, left: 4 }}>
            <CartesianGrid stroke={GRID} />
            <XAxis
              type="number" dataKey="survival" name="Survival (trades/agent)"
              tick={AXIS} stroke={AXIS.stroke}
              label={{ value: 'rounds survived', position: 'insideBottom', offset: -12, fill: '#6f6a61', fontSize: 10, fontFamily: AXIS.fontFamily }}
            />
            <YAxis type="number" dataKey="logFinal" name="log₁₀ final wealth" tick={AXIS} stroke={AXIS.stroke} />
            <Tooltip contentStyle={TOOLTIP_STYLE} cursor={{ stroke: 'rgba(232,184,75,0.3)' }} />
            <Scatter data={survivalScatter}>
              {survivalScatter.map((d, i) => (
                <Cell key={i} fill={d.ruined ? 'rgba(224,85,107,0.7)' : 'rgba(232,184,75,0.85)'} />
              ))}
            </Scatter>
          </ScatterChart>
        </ResponsiveContainer>
      </div>

      <div className="ys-panel gold" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <div className="ys-bigstat" style={{ textAlign: 'left' }}>
          <div className="n">{survival.correlation == null ? '—' : survival.correlation.toFixed(2)}</div>
          <div className="cap">correlation: survival time → final wealth</div>
        </div>
        <p className="ys-body" style={{ marginTop: '1.2rem' }}>
          Of {survival.total.toLocaleString()} identical agents, <strong className="ys-gold">{survival.aliveCount.toLocaleString()}</strong> never
          hit the ruin floor — and they hold almost everything. The <strong className="ys-rose">{survival.ruinedCount.toLocaleString()}</strong> who
          dropped out are stuck near zero. It was never about <em>winning more</em>: everyone wins half their coin flips. It's about{' '}
          <strong>never hitting bottom</strong>.
        </p>
        {strongest && (
          <p className="ys-body" style={{ marginTop: '0.4rem', fontSize: '0.95rem' }}>
            And position hardens as it runs: by <span className="ys-num ys-gold">~{strongest.perAgentTrades}</span> trades
            per agent, an agent's standing already explains{' '}
            <span className={`ys-num ${rClass(strongest.r)}`}>{Math.round(strongest.r * strongest.r * 100)}%</span> of
            where it finishes — and only tightens from there.
          </p>
        )}
      </div>
    </div>
  );
}

/* ----------------------------------------------------------------------- */
/* Deep analytics: the full evidence locker, collapsed by default.          */
/* ----------------------------------------------------------------------- */
export function DeepAnalytics({ ensemble }) {
  if (!ensemble) return <Loading />;
  const { giniHistory, survival, checkpoints, earlyVsFinal, earlyCheckpointPerAgent, leadership, finalGini, finalTop1, params } = ensemble;

  return (
    <div style={{ display: 'grid', gap: '1.2rem' }}>
      <p className="ys-disclaimer">
        Ensemble: {params.numAgents.toLocaleString()} identical agents, {params.totalTrades.toLocaleString()} fair
        trades, fixed stake = {params.transferPercent}% of the poorer agent. Same rule as the bubbles above — just a
        bigger population so the statistics are clean. The “ruin floor” (1% of starting wealth) is a reporting
        threshold, not a rule of the model: stakes scale with wealth, so an agent’s balance approaches zero but never
        exactly reaches it.
      </p>

      <div className="ys-grid2">
        <div className="ys-chart">
          <div className="ttl">Inequality over time · Gini & top-1% share</div>
          <ResponsiveContainer width="100%" height={230}>
            <LineChart data={giniHistory} margin={{ top: 8, right: 16, bottom: 18, left: -8 }}>
              <CartesianGrid stroke={GRID} />
              <XAxis dataKey="t" tick={AXIS} stroke={AXIS.stroke} label={{ value: 'trades / agent', position: 'insideBottom', offset: -10, fill: '#6f6a61', fontSize: 10, fontFamily: AXIS.fontFamily }} />
              <YAxis tick={AXIS} stroke={AXIS.stroke} domain={[0, 100]} />
              <Tooltip contentStyle={TOOLTIP_STYLE} />
              <Line type="monotone" dataKey="gini" stroke="#e8b84b" strokeWidth={2} dot={false} name="Gini ×100" />
              <Line type="monotone" dataKey="top1" stroke="#58c5bf" strokeWidth={2} dot={false} name="Top 1% share" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="ys-chart">
          <div className="ttl">Survival curve · % of agents above the ruin floor</div>
          <ResponsiveContainer width="100%" height={230}>
            <LineChart data={survival.curve} margin={{ top: 8, right: 16, bottom: 18, left: -8 }}>
              <CartesianGrid stroke={GRID} />
              <XAxis dataKey="t" tick={AXIS} stroke={AXIS.stroke} label={{ value: 'trades / agent', position: 'insideBottom', offset: -10, fill: '#6f6a61', fontSize: 10, fontFamily: AXIS.fontFamily }} />
              <YAxis tick={AXIS} stroke={AXIS.stroke} domain={[0, 100]} />
              <Tooltip contentStyle={TOOLTIP_STYLE} />
              <Line type="monotone" dataKey="alivePercent" stroke="#e0556b" strokeWidth={2} dot={false} name="% surviving" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="ys-grid2">
        <div className="ys-chart">
          <div className="ttl">Early wealth (~{earlyCheckpointPerAgent} trades/agent) vs. final wealth</div>
          <ResponsiveContainer width="100%" height={230}>
            <ScatterChart margin={{ top: 8, right: 16, bottom: 24, left: 4 }}>
              <CartesianGrid stroke={GRID} />
              <XAxis type="number" dataKey="early" name="early $" tick={AXIS} stroke={AXIS.stroke} label={{ value: 'early wealth ($)', position: 'insideBottom', offset: -12, fill: '#6f6a61', fontSize: 10, fontFamily: AXIS.fontFamily }} />
              <YAxis type="number" dataKey="final" name="final $" tick={AXIS} stroke={AXIS.stroke} />
              <Tooltip contentStyle={TOOLTIP_STYLE} cursor={{ stroke: 'rgba(232,184,75,0.3)' }} />
              <Scatter data={earlyVsFinal} fill="rgba(232,184,75,0.7)" />
            </ScatterChart>
          </ResponsiveContainer>
        </div>

        <div className="ys-panel">
          <h3>When are fates sealed?</h3>
          <p className="ys-body" style={{ fontSize: '0.95rem', marginBottom: '0.8rem' }}>
            Correlation between each agent’s <em>early</em> wealth and its <em>final</em> wealth. The earlier this
            climbs toward 1.0, the sooner the ranking is locked.
          </p>
          <table className="ys-table">
            <thead>
              <tr><th>Trades / agent</th><th>r (early → final)</th><th>Variance explained</th></tr>
            </thead>
            <tbody>
              {checkpoints.map((c) => (
                <tr key={c.perAgentTrades}>
                  <td className="ys-num">{c.perAgentTrades}</td>
                  <td className={`ys-num ${rClass(c.r)}`}>{fmtR(c.r)}</td>
                  <td className="ys-num ys-r-weak">{c.r == null ? '—' : `${Math.round(c.r * c.r * 100)}%`}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="ys-metrics" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
        <div className="ys-metric"><div className="label">Final Gini</div><div className="value gold">{(finalGini * 100).toFixed(1)}</div></div>
        <div className="ys-metric"><div className="label">Top 1% share</div><div className="value gold">{(finalTop1 * 100).toFixed(0)}%</div></div>
        <div className="ys-metric"><div className="label">Lead changes</div><div className="value">{leadership.leaderChanges.toLocaleString()}</div></div>
        <div className="ys-metric"><div className="label">Ever led</div><div className="value">{leadership.uniqueLeaders}</div></div>
      </div>
      <p className="ys-disclaimer">
        Note on mobility: the #1 spot changes hands {leadership.leaderChanges.toLocaleString()} times among{' '}
        {leadership.uniqueLeaders} agents — among <em>survivors</em>, positions still shuffle. But ruined agents never
        return to contention. The door swings one way.
      </p>
    </div>
  );
}

/* ----------------------------------------------------------------------- */
/* Odds insights: escape probability + consecutive-loss cushion by class.   */
/* ----------------------------------------------------------------------- */
export function OddsInsights({ params, ensemble, agents, round = 0 }) {
  if (!params) return null;

  const f = params.transferPercent / 100;
  const initial = params.initialWealth ?? 100;
  const ruinFloor = initial * 0.01;

  // Best-case escape: how many consecutive wins from the ruin floor back to start?
  // W × (1+f)^n ≥ initial  →  n = ceil(log(initial/ruinFloor) / log(1+f))
  const winsNeeded = Math.ceil(Math.log(initial / ruinFloor) / Math.log(1 + f));
  const escapeOneIn = Math.round(Math.pow(2, winsNeeded));

  // Consecutive-loss cushion: W × (1–f)^n = ruinFloor  →  n = floor(log(ruinFloor/W) / log(1–f))
  const cushion = (W) => (W <= ruinFloor ? 0 : Math.floor(Math.log(ruinFloor / W) / Math.log(1 - f)));

  const fmtMoney = (v) => `$${v >= 100 ? Math.round(v).toLocaleString() : v.toFixed(2)}`;

  // Live class representatives drawn straight from the on-screen simulation, so
  // the bars track the richest / median / poorest agents as the sim advances.
  const wealths = (agents && agents.length ? agents.map((a) => a.wealth) : [initial]).slice().sort((a, b) => a - b);
  const m = wealths.length;
  const richest = wealths[m - 1];
  const median = wealths[Math.floor(m / 2)];
  const poorest = wealths[0];

  const tiers = [
    { label: 'Richest', wealth: richest, color: 'var(--gold)' },
    { label: 'Median',  wealth: median,  color: 'var(--text-dim)' },
    { label: poorest <= ruinFloor ? 'Ruined' : 'Poorest', wealth: poorest, color: 'var(--rose)' },
  ].map((t) => ({ ...t, losses: cushion(t.wealth) }));
  const maxLosses = Math.max(...tiers.map((t) => t.losses), 1);

  // Empirical recovery: among sampled ruined agents, how many ended above starting wealth?
  let everRuinedCount = null;
  let recoveredCount = null;
  if (ensemble) {
    const { survivalScatter, params: ep } = ensemble;
    const ruinedSample = survivalScatter.filter((d) => d.ruined);
    everRuinedCount = ruinedSample.length;
    recoveredCount = ruinedSample.filter((d) => Math.pow(10, d.logFinal) >= ep.initialWealth).length;
  }

  // Real-world felt comparisons — sorted easiest → hardest (ascending oneIn).
  const comparisons = [
    { event: 'Struck by lightning this year (US)',          oneIn: 1222000,    isYou: false },
    { event: `${winsNeeded} coin flips, all heads`,         oneIn: escapeOneIn, isYou: true  },
    { event: 'Win the Powerball jackpot',                   oneIn: 292201338,  isYou: false },
  ].sort((a, b) => a.oneIn - b.oneIn);

  return (
    <div className="ys-grid2">

      {/* ── Panel A: escape odds ── */}
      <div className="ys-panel rose">
        <h3>The impossible climb</h3>
        <div style={{ margin: '1rem 0 1.1rem' }}>
          <div className="ys-num" style={{ color: 'var(--rose)', fontWeight: 700, fontSize: 'clamp(2rem,5vw,3.2rem)', lineHeight: 1 }}>
            1 in {escapeOneIn.toLocaleString()}
          </div>
          <div style={{ fontFamily: 'var(--mono)', fontSize: '0.68rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--text-faint)', marginTop: '0.45rem' }}>
            best-case odds of escaping the ruin floor
          </div>
        </div>
        <p className="ys-body">
          At {params.transferPercent}% stakes, a ruined agent at {fmtMoney(ruinFloor)} needs{' '}
          <strong>{winsNeeded} consecutive wins</strong> — not one loss allowed — to claw back to{' '}
          {fmtMoney(initial)}. That's the minimum miracle. Any loss along the way resets the clock.
        </p>

        <table className="ys-table" style={{ marginTop: '1.1rem' }}>
          <thead>
            <tr><th>Event</th><th style={{ textAlign: 'right' }}>Odds (1 in …)</th></tr>
          </thead>
          <tbody>
            {comparisons.map((c) => (
              <tr key={c.event} style={c.isYou ? { background: 'rgba(224,85,107,0.08)' } : undefined}>
                <td style={c.isYou ? { color: 'var(--rose)', fontWeight: 600 } : undefined}>
                  {c.isYou ? '▶ ' : ''}{c.event}
                </td>
                <td className="ys-num" style={{ textAlign: 'right', color: c.isYou ? 'var(--rose)' : undefined }}>
                  {c.oneIn.toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {everRuinedCount !== null && (
          <p className="ys-body" style={{ marginTop: '1rem', fontSize: '0.88rem' }}>
            In practice: of {everRuinedCount} sampled agents who hit the ruin floor,{' '}
            <strong className="ys-rose">{recoveredCount === 0 ? 'zero' : recoveredCount}</strong> recovered to their starting wealth.
          </p>
        )}
      </div>

      {/* ── Panel B: consecutive-loss cushion (live) ── */}
      <div className="ys-panel gold">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: '1rem' }}>
          <h3 style={{ margin: 0 }}>How many hits can you take?</h3>
          <span className="ys-num" style={{ fontSize: '0.62rem', letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--rose)', whiteSpace: 'nowrap' }}>
            ● live · round {round.toLocaleString()}
          </span>
        </div>
        <p className="ys-body" style={{ margin: '0.7rem 0 1.6rem' }}>
          Consecutive {params.transferPercent}%-losses each of these three traders could absorb before
          hitting the ruin floor. Watch the gap open as the simulation runs.
        </p>

        <div style={{ display: 'grid', gap: '1.3rem' }}>
          {tiers.map((tier) => {
            const pct = (tier.losses / maxLosses) * 100;
            return (
              <div key={tier.label}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '0.35rem' }}>
                  <span style={{ fontSize: '0.92rem', color: tier.color, fontWeight: 600 }}>
                    {tier.label}{' '}
                    <span className="ys-num" style={{ color: 'var(--text-faint)', fontSize: '0.78em', fontWeight: 400 }}>
                      {fmtMoney(tier.wealth)}
                    </span>
                  </span>
                  <span className="ys-num" style={{ color: tier.color, fontWeight: 700, fontSize: '1.05rem' }}>
                    {tier.losses}<span style={{ fontSize: '0.6em', color: 'var(--text-faint)', fontWeight: 400 }}> hit{tier.losses === 1 ? '' : 's'}</span>
                  </span>
                </div>
                <div style={{ background: 'rgba(255,255,255,0.07)', borderRadius: 5, height: 10, overflow: 'hidden' }}>
                  <div style={{
                    width: tier.losses === 0 ? '4px' : `${Math.max(pct, 2)}%`,
                    height: '100%',
                    background: tier.color,
                    borderRadius: 5,
                    opacity: tier.losses === 0 ? 0.6 : 0.9,
                    transition: 'width 0.5s ease',
                  }} />
                </div>
              </div>
            );
          })}
        </div>

        <p className="ys-body" style={{ marginTop: '1.6rem', fontSize: '0.9rem', color: 'var(--text-dim)' }}>
          The same unlucky streak that barely dents the richest wipes out the poorest. This is the
          asymmetry hiding inside "fair."
        </p>
        <p className="ys-body" style={{ marginTop: '0.5rem', fontSize: '0.8rem', color: 'var(--text-faint)' }}>
          Worst-case: assumes every trade is against an equally wealthy (or richer) opponent,
          so the full {params.transferPercent}% stake always comes from the trader's own wealth.
        </p>
      </div>

    </div>
  );
}
