/**
 * engine.js — The canonical Yard Sale model (Chakraborti 2002 / Boghosian).
 *
 * ONE RULE, used everywhere:
 *   - Two agents are chosen at random.
 *   - The stake is a FIXED fraction of the POORER agent's wealth.
 *   - A fair coin (50/50) decides who wins the stake.
 *   - Total wealth is conserved; with no redistribution, wealth condenses
 *     onto a single agent (Gini -> 1). That is "wealth condensation."
 *
 * Both the live on-screen bubble simulation and the large-N statistical
 * ensemble call `resolveTrade` below, so they are provably the same model —
 * they differ only in population size (a configuration, not a different rule).
 */

// ---------------------------------------------------------------------------
// Core trade rule (the single source of truth)
// ---------------------------------------------------------------------------

/**
 * Resolve one pairwise trade.
 * @param {number} wA wealth of agent A
 * @param {number} wB wealth of agent B
 * @param {number} transferFrac fixed fraction of the poorer agent's wealth (0..1)
 * @param {number} coin a uniform random in [0,1); < 0.5 => A wins
 * @returns {[number, number]} new [wA, wB]
 */
export function resolveTrade(wA, wB, transferFrac, coin) {
  const stake = Math.min(wA, wB) * transferFrac;
  return coin < 0.5 ? [wA + stake, wB - stake] : [wA - stake, wB + stake];
}

// ---------------------------------------------------------------------------
// Population helpers
// ---------------------------------------------------------------------------

/** Create N agents, each starting with the same wealth. */
export function createAgents(numAgents, initialWealth) {
  return Array.from({ length: numAgents }, (_, i) => ({ id: i, wealth: initialWealth }));
}

function pickTwo(n) {
  const a = (Math.random() * n) | 0;
  let b = (Math.random() * n) | 0;
  while (b === a) b = (Math.random() * n) | 0;
  return [a, b];
}

/**
 * Advance an array of {id, wealth} agents by one "round" of trades, in place
 * on a fresh copy. One round = `trades` pairwise exchanges (default N/2 so that,
 * on average, every agent trades once per round). Used by the live hero sim.
 * @returns {Array<{id:number, wealth:number}>} a NEW agents array
 */
export function stepAgents(agents, transferPercent, trades) {
  const n = agents.length;
  const next = agents.map((a) => ({ id: a.id, wealth: a.wealth }));
  const frac = transferPercent / 100;
  const t = trades || Math.max(1, Math.floor(n / 2));
  for (let k = 0; k < t; k++) {
    const [i, j] = pickTwo(n);
    const [wi, wj] = resolveTrade(next[i].wealth, next[j].wealth, frac, Math.random());
    next[i].wealth = wi;
    next[j].wealth = wj;
  }
  return next;
}

// ---------------------------------------------------------------------------
// Metrics
// ---------------------------------------------------------------------------

/** Gini coefficient (0 = perfect equality, 1 = one agent owns everything). */
export function gini(wealth) {
  const sorted = [...wealth].sort((a, b) => a - b);
  const n = sorted.length;
  let total = 0;
  for (let i = 0; i < n; i++) total += sorted[i];
  if (total === 0) return 0;
  let cum = 0;
  for (let i = 0; i < n; i++) cum += (2 * (i + 1) - n - 1) * sorted[i];
  return cum / (n * total);
}

/** Share (0..1) of total wealth held by the richest `fraction` of agents. */
export function topShare(wealth, fraction) {
  const sorted = [...wealth].sort((a, b) => b - a);
  const n = sorted.length;
  const count = Math.max(1, Math.floor(n * fraction));
  let total = 0;
  for (let i = 0; i < n; i++) total += sorted[i];
  if (total === 0) return 0;
  let top = 0;
  for (let i = 0; i < count; i++) top += sorted[i];
  return top / total;
}

/** Pearson correlation coefficient. Returns null if undefined. */
export function pearson(xs, ys) {
  const n = xs.length;
  if (n < 2 || ys.length !== n) return null;
  let sx = 0, sy = 0, sxy = 0, sx2 = 0, sy2 = 0;
  for (let i = 0; i < n; i++) {
    sx += xs[i]; sy += ys[i];
    sxy += xs[i] * ys[i];
    sx2 += xs[i] * xs[i]; sy2 += ys[i] * ys[i];
  }
  const num = n * sxy - sx * sy;
  const den = Math.sqrt((n * sx2 - sx * sx) * (n * sy2 - sy * sy));
  if (den === 0) return 0;
  return num / den;
}

const log10 = (w) => Math.log10(Math.max(w, 1e-9));

// ---------------------------------------------------------------------------
// Statistical ensemble (large N, many trades) — the evidence for the climax
// ---------------------------------------------------------------------------

/**
 * Run a large, fast ensemble of the SAME model to produce the statistical
 * evidence shown at the narrative climax and in the deep-analytics section.
 *
 * Returns clean, presentation-ready data:
 *  - finalWealth: number[]                  final wealth per agent
 *  - giniHistory: {t, gini, top1}[]         inequality over time (sampled)
 *  - survival: { curve, correlation, aliveCount, ruinedCount, total }
 *  - checkpoints: { perAgentTrades, r }[]   early-wealth vs final-wealth correlation
 *  - earlyVsFinal: {early, final}[]         scatter sample (early wealth vs final)
 *  - leadership: { leaderChanges, uniqueLeaders }
 *  - survivalScatter: {survival, logFinal}[] sample for the survival scatter
 */
export function runEnsemble(opts = {}) {
  const numAgents = opts.numAgents ?? 1000;
  const initialWealth = opts.initialWealth ?? 100;
  const transferPercent = opts.transferPercent ?? 20;
  const ruinThresholdPercent = opts.ruinThresholdPercent ?? 1;
  const tradesPerAgent = opts.tradesPerAgent ?? 2000; // total trades = N * this
  const frac = transferPercent / 100;
  const ruinThreshold = initialWealth * (ruinThresholdPercent / 100);

  const totalTrades = numAgents * tradesPerAgent;
  const wealth = new Float64Array(numAgents).fill(initialWealth);

  // Early-wealth checkpoints, expressed in trades-per-agent. Spanning early to
  // late so the table shows the correlation CLIMB (lock-in is gradual, not instant).
  const checkpointPerAgent = [5, 10, 25, 50, 100, 250, 500, 1000].filter((c) => c < tradesPerAgent);
  const checkpointAt = checkpointPerAgent.map((c) => Math.floor(c * numAgents));
  const checkpointWealth = {}; // tradeIndex -> Float64Array snapshot

  const ruinTime = new Int32Array(numAgents).fill(-1); // first trade index below threshold
  const giniHistory = [];
  const survivalCurve = [];
  const sampleEvery = Math.max(1, Math.floor(totalTrades / 120));

  // Leadership tracking (sampled — exact every-trade argmax is wasteful)
  let lastLeader = -1;
  let leaderChanges = 0;
  const uniqueLeaders = new Set();
  const leaderSampleEvery = Math.max(1, Math.floor(totalTrades / 400));

  for (let k = 0; k < totalTrades; k++) {
    // checkpoint snapshot (before the trade at the boundary)
    for (let c = 0; c < checkpointAt.length; c++) {
      if (k === checkpointAt[c]) checkpointWealth[checkpointAt[c]] = Float64Array.from(wealth);
    }

    const i = (Math.random() * numAgents) | 0;
    let j = (Math.random() * numAgents) | 0;
    while (j === i) j = (Math.random() * numAgents) | 0;
    const [wi, wj] = resolveTrade(wealth[i], wealth[j], frac, Math.random());
    wealth[i] = wi;
    wealth[j] = wj;

    if (ruinTime[i] === -1 && wi < ruinThreshold) ruinTime[i] = k;
    if (ruinTime[j] === -1 && wj < ruinThreshold) ruinTime[j] = k;

    if (k % sampleEvery === 0) {
      const t = k / numAgents; // trades per agent
      giniHistory.push({ t: +t.toFixed(1), gini: +(gini(wealth) * 100).toFixed(1), top1: +(topShare(wealth, 0.01) * 100).toFixed(1) });
      let alive = 0;
      for (let a = 0; a < numAgents; a++) if (wealth[a] >= ruinThreshold) alive++;
      survivalCurve.push({ t: +t.toFixed(1), alivePercent: +((alive / numAgents) * 100).toFixed(1) });
    }

    if (k % leaderSampleEvery === 0) {
      let leader = 0;
      for (let a = 1; a < numAgents; a++) if (wealth[a] > wealth[leader]) leader = a;
      if (leader !== lastLeader) {
        if (lastLeader !== -1) leaderChanges++;
        lastLeader = leader;
        uniqueLeaders.add(leader);
      }
    }
  }

  const finalWealth = Array.from(wealth);

  // Survival time: ruined agents use their ruin trade index; survivors use totalTrades.
  const survivalTime = Array.from(ruinTime, (rt) => (rt === -1 ? totalTrades : rt));
  const logFinal = finalWealth.map(log10);
  const survivalCorrelation = pearson(survivalTime, logFinal);
  let ruinedCount = 0;
  for (let a = 0; a < numAgents; a++) if (ruinTime[a] !== -1) ruinedCount++;

  // Early-wealth-vs-final correlation per checkpoint (log-log, on agents alive at checkpoint).
  const checkpoints = checkpointAt.map((idx, ci) => {
    const snap = checkpointWealth[idx];
    if (!snap) return { perAgentTrades: checkpointPerAgent[ci], r: null };
    const xs = [];
    const ys = [];
    for (let a = 0; a < numAgents; a++) {
      xs.push(log10(snap[a]));
      ys.push(logFinal[a]);
    }
    return { perAgentTrades: checkpointPerAgent[ci], r: pearson(xs, ys) };
  });

  // Scatter samples (cap points so charts stay light).
  const sampleIdx = sampleIndices(numAgents, 250);
  // Use a mid-run checkpoint for the illustrative scatter (clear but honest relationship).
  const scatterPos = (() => {
    const i = checkpointPerAgent.indexOf(250);
    return i >= 0 ? i : Math.min(checkpointPerAgent.length - 1, Math.floor(checkpointPerAgent.length / 2));
  })();
  const firstCp = checkpointWealth[checkpointAt[scatterPos]];
  const earlyVsFinal = firstCp
    ? sampleIdx.map((a) => ({ early: +firstCp[a].toFixed(2), final: +finalWealth[a].toFixed(2) }))
    : [];
  const survivalScatter = sampleIdx.map((a) => ({
    survival: +(survivalTime[a] / numAgents).toFixed(1),
    logFinal: +logFinal[a].toFixed(2),
    ruined: ruinTime[a] !== -1,
  }));

  return {
    params: { numAgents, initialWealth, transferPercent, tradesPerAgent, totalTrades },
    finalWealth,
    giniHistory,
    survival: {
      curve: survivalCurve,
      correlation: survivalCorrelation,
      aliveCount: numAgents - ruinedCount,
      ruinedCount,
      total: numAgents,
    },
    checkpoints,
    earlyVsFinal,
    survivalScatter,
    earlyCheckpointPerAgent: checkpointPerAgent[scatterPos],
    leadership: { leaderChanges, uniqueLeaders: uniqueLeaders.size },
    finalGini: gini(wealth),
    finalTop1: topShare(wealth, 0.01),
  };
}

function sampleIndices(n, count) {
  if (n <= count) return Array.from({ length: n }, (_, i) => i);
  const stride = n / count;
  const out = [];
  for (let i = 0; i < count; i++) out.push(Math.floor(i * stride));
  return out;
}
