/**
 * useYardSale — React hook around the canonical engine.
 *
 * Drives ONE live simulation that can be controlled three ways:
 *   1. Manual play / pause / reset / parameter sliders.
 *   2. Scroll: `scrollTo(round)` brings the sim to a narrative step's target round.
 *
 * Scrubbing a stochastic, non-seedable sim is handled with SNAPSHOTS, not RNG
 * rewinding: every round we land on is snapshotted, so scrolling back up restores
 * the exact earlier (more equal) state instead of attempting an impossible rewind.
 *
 * Precedence: pressing Play enters "manual mode" and suspends scroll-driving
 * until Reset, so the scroll position and the play loop never fight.
 *
 * The large-N statistical ensemble (the climax evidence) is computed once, lazily,
 * after first paint — it uses the same rule, just a bigger population.
 */
import { useState, useRef, useCallback, useEffect, useMemo } from 'react';
import { createAgents, stepAgents, gini, topShare, runEnsemble } from './engine';

const DEFAULTS = { numAgents: 120, initialWealth: 100, transferPercent: 20, speed: 60 };

function cloneAgents(ags) {
  return ags.map((a) => ({ id: a.id, wealth: a.wealth }));
}

function computeStats(agents, initialWealth) {
  if (!agents.length) {
    return { totalWealth: 0, gini: 0, top1Share: 0, top10Share: 0, richest: 0, poorest: 0, wealthGap: 0, activeAgents: 0 };
  }
  const wealth = agents.map((a) => a.wealth);
  const sorted = [...wealth].sort((a, b) => b - a);
  const total = sorted.reduce((s, w) => s + w, 0);
  const richest = sorted[0];
  const poorest = sorted[sorted.length - 1];
  const ruinFloor = initialWealth * 0.01;
  return {
    totalWealth: total,
    gini: gini(wealth),
    top1Share: topShare(wealth, 0.01),
    top10Share: topShare(wealth, 0.1),
    richest,
    poorest,
    wealthGap: poorest > 0 ? richest / poorest : richest / Math.max(ruinFloor, 1e-6),
    activeAgents: wealth.filter((w) => w >= ruinFloor).length,
  };
}

export function useYardSale(initial = {}) {
  const [params, setParams] = useState({ ...DEFAULTS, ...initial });
  const [agents, setAgents] = useState(() => createAgents(params.numAgents, params.initialWealth));
  const [round, setRound] = useState(0);
  const [running, setRunning] = useState(false);
  const [manualMode, setManualMode] = useState(false);
  const [ensemble, setEnsemble] = useState(null);

  const agentsRef = useRef(agents);
  const roundRef = useRef(0);
  const snapshotsRef = useRef(new Map([[0, cloneAgents(agents)]]));
  agentsRef.current = agents;
  roundRef.current = round;

  const reinit = useCallback((p) => {
    const fresh = createAgents(p.numAgents, p.initialWealth);
    agentsRef.current = fresh;
    roundRef.current = 0;
    snapshotsRef.current = new Map([[0, cloneAgents(fresh)]]);
    setAgents(fresh);
    setRound(0);
    setRunning(false);
    setManualMode(false);
  }, []);

  // Re-initialise when structural params change (population / starting wealth).
  useEffect(() => {
    reinit(params);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.numAgents, params.initialWealth]);

  // Live play loop.
  useEffect(() => {
    if (!running) return undefined;
    const interval = Math.max(16, 220 - params.speed * 2);
    const id = setInterval(() => {
      const next = stepAgents(agentsRef.current, params.transferPercent);
      agentsRef.current = next;
      roundRef.current += 1;
      setAgents(next);
      setRound(roundRef.current);
    }, interval);
    return () => clearInterval(id);
  }, [running, params.speed, params.transferPercent]);

  // Compute the statistical ensemble once, after first paint.
  useEffect(() => {
    let cancelled = false;
    const t = setTimeout(() => {
      const result = runEnsemble({ numAgents: 1000, initialWealth: 100, transferPercent: 20, tradesPerAgent: 2000 });
      if (!cancelled) setEnsemble(result);
    }, 250);
    return () => {
      cancelled = true;
      clearTimeout(t);
    };
  }, []);

  const snapshot = useCallback((r, ags) => {
    const m = snapshotsRef.current;
    if (!m.has(r)) m.set(r, cloneAgents(ags));
  }, []);

  const play = useCallback(() => {
    setManualMode(true);
    setRunning(true);
  }, []);
  const pause = useCallback(() => setRunning(false), []);
  const reset = useCallback(() => reinit(params), [params, reinit]);
  const setParam = useCallback((key, value) => setParams((p) => ({ ...p, [key]: value })), []);

  /** Bring the live sim to `targetRound` for scroll-driven storytelling. */
  const scrollTo = useCallback(
    (targetRound) => {
      if (manualMode) return; // manual play wins until reset
      const target = Math.max(0, Math.round(targetRound));
      const cur = roundRef.current;
      if (target === cur) return;

      let ags;
      let from;
      if (target > cur) {
        ags = cloneAgents(agentsRef.current);
        from = cur;
      } else {
        // rewind: restore nearest snapshot at or before target
        const m = snapshotsRef.current;
        let best = 0;
        for (const r of m.keys()) if (r <= target && r > best) best = r;
        ags = cloneAgents(m.get(best) || createAgents(params.numAgents, params.initialWealth));
        from = best;
      }
      for (let r = from; r < target; r++) ags = stepAgents(ags, params.transferPercent);
      agentsRef.current = ags;
      roundRef.current = target;
      snapshot(target, ags);
      setAgents(ags);
      setRound(target);
    },
    [manualMode, params.transferPercent, params.numAgents, params.initialWealth, snapshot]
  );

  const stats = useMemo(() => computeStats(agents, params.initialWealth), [agents, params.initialWealth]);

  return {
    agents,
    round,
    running,
    manualMode,
    params,
    stats,
    ensemble,
    play,
    pause,
    reset,
    setParam,
    scrollTo,
  };
}
