import React, { useEffect, useRef, useState } from 'react';
import { Play, Pause, RotateCcw, ArrowLeft, ChevronDown, FlaskConical } from 'lucide-react';
import BubbleVisualizer from './BubbleVisualizer';
import { ClimaxEvidence, DeepAnalytics, OddsInsights } from './Analytics';
import { useYardSale } from './useYardSale';
import './yardsale.css';

/**
 * The Yard Sale Model — a single scroll-driven story.
 *
 * One canonical simulation (see engine.js) is pinned on screen while the
 * narrative scrolls past and drives it forward. The "deep dive" insight —
 * survival vs. win-rate, and how early divergence locks in — is the climax,
 * not a buried tab. Heavy statistics live in a collapsible section at the end.
 *
 * Public contract is unchanged: default export accepting { onBack }.
 */

const STEPS = [
  {
    round: 0,
    no: '01 — The setup',
    title: 'Everyone starts equal.',
    body: (
      <>
        <p className="ys-body">
          120 traders. Each begins with exactly <strong>$100</strong>. Every exchange is a fair,
          50/50 coin flip — no skill, no cheating, no head start. The fairest economy imaginable.
        </p>
        <p className="ys-body">Keep scrolling to let them trade.</p>
      </>
    ),
  },
  {
    round: 28,
    no: '02 — The drift',
    title: 'Fair trades, unfair drift.',
    body: (
      <>
        <p className="ys-body">
          Nobody touched the rules. Yet the bubbles are already pulling apart — a few drift upward
          while the rest quietly shrink.
        </p>
        <p className="ys-body">
          The catch: each trade stakes a fraction of the <em>poorer</em> trader's wealth, so an
          early lucky run compounds into a lasting lead.
        </p>
      </>
    ),
  },
  {
    round: 95,
    no: '03 — Condensation',
    title: 'An oligarch emerges.',
    body: (
      <>
        <p className="ys-body">
          Wealth doesn't spread out — it <strong>condenses</strong>. Run it long enough and a single
          trader ends up with almost everything while nearly everyone else clusters near zero.
        </p>
        <p className="ys-body" style={{ borderLeft: '2px solid var(--gold)', paddingLeft: '1rem', fontStyle: 'italic' }}>
          “Once initial symmetry is broken, further transactions inexorably transfer all the wealth
          into the hands of a few individuals.” — Bruce Boghosian
        </p>
      </>
    ),
  },
  {
    round: 240,
    no: '04 — The fair coin that isn’t',
    title: 'The unfairness hidden inside “fair.”',
    body: (
      <>
        <p className="ys-body">
          Stakes scale with the poorer trader. Bet 20% of $10 and you're risking $2 — real money to
          you. The same 20% off a rich trader is pocket change they can shrug off dozens of times.
        </p>
        <p className="ys-body">
          The coin is perfectly fair. The <em>consequences</em> of losing it are not.
        </p>
      </>
    ),
  },
];

export default function YardSalePage({ onBack }) {
  const sim = useYardSale();
  const { agents, round, running, stats, ensemble, params, play, pause, reset, setParam, scrollTo } = sim;

  const rootRef = useRef(null);
  const stepRefs = useRef([]);
  const [activeStep, setActiveStep] = useState(0);
  const [showAnalytics, setShowAnalytics] = useState(false);

  // Scroll-driving: mark the most-visible step active and bring the sim to it.
  useEffect(() => {
    const els = stepRefs.current.filter(Boolean);
    if (!els.length) return undefined;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const idx = Number(entry.target.dataset.index);
            setActiveStep(idx);
            scrollTo(STEPS[idx].round);
          }
        });
      },
      { threshold: 0.55 }
    );
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [scrollTo]);

  // Generic reveal-on-scroll for the standalone sections.
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return undefined;
    const els = root.querySelectorAll('.ys-reveal');
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add('is-in')),
      { threshold: 0.18 }
    );
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const gini = (stats.gini * 100).toFixed(0);
  const top1 = (stats.top1Share * 100).toFixed(0);
  const ruined = agents.length - stats.activeAgents;

  return (
    <div className="ys-root" ref={rootRef}>
      <div className="ys-shell">
        {/* top bar */}
        <div className="ys-topbar">
          <button className="ys-back" onClick={onBack} data-testid="back-button">
            <ArrowLeft size={14} /> Back
          </button>
          <span className="brand">Show &amp; Tell · Wealth Concentration</span>
        </div>

        {/* hero */}
        <header className="ys-hero">
          <div className="ys-kicker">Econophysics · The Yard Sale Model</div>
          <h1 className="ys-display" style={{ marginTop: '1.4rem' }}>
            How fair trades<br />build an <span className="accent">oligarchy</span>.
          </h1>
          <p className="ys-lead">
            Start everyone equal. Let them trade on perfectly fair coin flips. Watch one trader end
            up owning almost everything — by math alone.
          </p>
          <div className="ys-scrollcue">↓ scroll to run the experiment</div>
        </header>

        {/* scrollytelling: pinned sim + scrolling narrative */}
        <section className="ys-scrolly">
          <div className="ys-stage">
            <div className="ys-viz">
              <BubbleVisualizer agents={agents} running={running} width={800} height={550} />
              <div className="ys-round-pill ys-num">round {round.toLocaleString()}</div>
              <div className="ys-controls">
                <button className={`ys-btn ${running ? '' : 'ys-btn-primary'}`} onClick={running ? pause : play} aria-label={running ? 'Pause' : 'Play'}>
                  {running ? <Pause size={18} /> : <Play size={18} />}
                </button>
                <button className="ys-btn" onClick={reset} aria-label="Reset">
                  <RotateCcw size={16} />
                </button>
                <div className="ys-ctl-group">
                  <span className="lbl">Speed</span>
                  <input className="ys-range" type="range" min="10" max="100" value={params.speed}
                    onChange={(e) => setParam('speed', Number(e.target.value))} aria-label="Simulation speed" style={{ width: 90 }} />
                </div>
                <div className="ys-ctl-group">
                  <span className="lbl">Stake {params.transferPercent}%</span>
                  <input className="ys-range" type="range" min="1" max="50" value={params.transferPercent}
                    onChange={(e) => setParam('transferPercent', Number(e.target.value))} aria-label="Stake percent" style={{ width: 90 }} />
                </div>
              </div>
            </div>
            <div className="ys-metrics">
              <div className="ys-metric"><div className="label">Gini ×100</div><div className="value gold">{gini}</div></div>
              <div className="ys-metric"><div className="label">Top 1% owns</div><div className="value gold">{top1}%</div></div>
              <div className="ys-metric"><div className="label">Ruined</div><div className="value rose">{ruined}</div></div>
            </div>
            <p className="ys-disclaimer" style={{ textAlign: 'center' }}>
              {running ? 'Manual run — scroll-driving paused until you reset.' : 'Scroll drives the simulation · press play to take over.'}
            </p>
          </div>

          <div className="ys-narrative">
            {STEPS.map((step, i) => (
              <div
                key={step.round}
                data-index={i}
                ref={(el) => { stepRefs.current[i] = el; }}
                className={`ys-step ${activeStep === i ? 'is-active' : ''}`}
              >
                <span className="ys-stepno">{step.no}</span>
                <h2 className="ys-display">{step.title}</h2>
                {step.body}
              </div>
            ))}
          </div>
        </section>

        <div className="ys-rule" />

        {/* climax — the deep-dive insight, surfaced */}
        <section className="ys-section ys-reveal">
          <div className="ys-kicker">The mechanism</div>
          <h2 className="ys-display" style={{ fontSize: 'clamp(2rem, 4.5vw, 3.4rem)', margin: '1rem 0 1.2rem' }}>
            It's not about winning.<br />It's about not going broke.
          </h2>
          <p className="ys-lead" style={{ maxWidth: '60ch', marginBottom: '2.2rem' }}>
            The intuitive story — “the rich just won more” — is wrong. Every agent wins exactly half
            its coin flips. Here's what actually separates the oligarch from the ruined.
          </p>

          <ClimaxEvidence ensemble={ensemble} />

          <div className="ys-panel" style={{ marginTop: '2rem' }}>
            <h3>Two explanations, one mechanism</h3>
            <p className="ys-body">
              You'll hear this called “early luck compounding” <em>or</em> “asymmetric ruin risk,” as
              if they compete. They don't — they're the same multiplicative process seen from two
              ends. Wealth changes by <em>fractions</em>, so gains and losses compound; an early lead
              snowballs, and the longer the game runs the more an agent's early standing dictates its
              final rank. And because every stake is tied to the poorer trader, falling behind raises
              your odds of ruin. What <strong>doesn't</strong> explain any of it: skill, effort, or
              win rate — those are identical for everyone.
            </p>
            <p className="ys-body" style={{ fontSize: '0.92rem', color: 'var(--text-faint)' }}>
              One honest caveat about the chart's “ruin”: with stakes set as a fraction of the poorer
              trader, a balance approaches zero but never exactly hits it. “Ruined” here means
              “fallen below 1% of the starting stake” — a reporting line, not a wall. Recovery stays
              technically possible but astronomically unlikely.
            </p>
          </div>
        </section>

        <div className="ys-rule" />

        {/* odds & resilience */}
        <section className="ys-section ys-reveal">
          <div className="ys-kicker">The math of escape</div>
          <h2 className="ys-display" style={{ fontSize: 'clamp(2rem, 4.5vw, 3.4rem)', margin: '1rem 0 1.2rem' }}>
            "Technically possible"<br />is a lie.
          </h2>
          <p className="ys-lead" style={{ maxWidth: '60ch', marginBottom: '2.2rem' }}>
            Recovery from ruin isn't just unlikely — the math makes it effectively impossible.
            Here's what the odds actually look like, and how unequal the cushion is.
          </p>
          <OddsInsights params={params} ensemble={ensemble} agents={agents} round={round} />
        </section>

        <div className="ys-rule" />

        {/* reality check */}
        <section className="ys-section ys-reveal">
          <div className="ys-kicker">Reality check</div>
          <h2 className="ys-display" style={{ fontSize: 'clamp(2rem, 4.5vw, 3.4rem)', margin: '1rem 0 1.6rem' }}>
            Does this actually happen?
          </h2>
          <div className="ys-grid2">
            <div className="ys-panel gold">
              <h3>Yes — the math fits the data</h3>
              <p className="ys-body">
                Add taxes and transfers and Boghosian's extended model lands within about{' '}
                <strong className="ys-gold">2%</strong> of reported wealth distributions. Its successor,
                the <a href="https://arxiv.org/abs/1604.02370" target="_blank" rel="noreferrer">Affine Wealth Model</a>,
                matched 27 years of U.S. data to within <strong className="ys-gold">0.16%</strong>.
              </p>
              <p className="ys-body">
                And the shape is real: the bottom ~<strong>97%</strong> of incomes follow the same
                exponential curve that describes energy in a gas, while the top ~<strong>3%</strong>{' '}
                follow a Pareto power law — exactly the two-class split{' '}
                <a href="https://arxiv.org/abs/0905.1518" target="_blank" rel="noreferrer">Yakovenko &amp; Rosser</a> found
                in real data.
              </p>
            </div>
            <div className="ys-panel rose">
              <h3>But it's a cartoon, not a map</h3>
              <p className="ys-body">The model deliberately leaves out most of reality:</p>
              <ul className="ys-takeaways">
                <li>Real trades often help both sides — you and the grocer both gain.</li>
                <li>Not everyone can trade with everyone; networks and geography matter.</li>
                <li>It treats every outcome as pure luck — no skill, work, or innovation.</li>
              </ul>
              <p className="ys-body" style={{ fontSize: '0.92rem', marginTop: '0.8rem' }}>
                It can't set policy. What it <em>can</em> do is show how money drifts upward by
                default, before anyone behaves badly.
              </p>
            </div>
          </div>
        </section>

        <div className="ys-rule" />

        {/* meaning */}
        <section className="ys-section narrow ys-reveal">
          <div className="ys-kicker">What it means</div>
          <h2 className="ys-display" style={{ fontSize: 'clamp(2rem, 4.5vw, 3.4rem)', margin: '1rem 0 1.2rem' }}>
            The meritocracy myth.
          </h2>
          <p className="ys-lead" style={{ marginBottom: '1rem' }}>
            Every trader started with the same money and the same odds. There was real equality of
            opportunity. One still became the oligarch.
          </p>
          <ul className="ys-takeaways">
            <li>Money drifts upward even in perfectly fair systems with equal opportunity.</li>
            <li>Extreme inequality can come from pure chance — not talent or effort.</li>
            <li>An equal starting line does not produce an equal finish.</li>
            <li>Without redistribution, concentration isn't a risk — it's the destination.</li>
          </ul>
        </section>

        {/* collapsible deep analytics */}
        <section className="ys-section" style={{ textAlign: 'center', paddingTop: 0 }}>
          <button className="ys-analytics-toggle" onClick={() => setShowAnalytics((s) => !s)}>
            <FlaskConical size={15} />
            {showAnalytics ? 'Hide the evidence locker' : 'Open the evidence locker'}
            <ChevronDown size={15} style={{ transform: showAnalytics ? 'rotate(180deg)' : 'none', transition: 'transform .2s' }} />
          </button>
          {showAnalytics && (
            <div style={{ marginTop: '2rem', textAlign: 'left' }}>
              <DeepAnalytics ensemble={ensemble} />
            </div>
          )}
        </section>

        {/* footer / further reading */}
        <footer className="ys-section" style={{ paddingTop: '2rem' }}>
          <div className="ys-rule" style={{ marginBottom: '2.5rem' }} />
          <div className="ys-kicker">Further reading</div>
          <p className="ys-foot" style={{ marginTop: '1rem' }}>
            The name “yard sale model” was coined by <a href="https://www.americanscientist.org/article/follow-the-money" target="_blank" rel="noreferrer">Brian Hayes (2002)</a>;
            the trading rule traces to Anirban Chakraborti's 2002 kinetic-exchange model. For the full
            picture see Boghosian's <a href="https://www.scientificamerican.com/article/is-inequality-inevitable/" target="_blank" rel="noreferrer">“Is Inequality Inevitable?” (Scientific American)</a>,
            the <a href="https://arxiv.org/abs/1604.02370" target="_blank" rel="noreferrer">Affine Wealth Model</a>,
            Yakovenko &amp; Rosser's <a href="https://arxiv.org/abs/0905.1518" target="_blank" rel="noreferrer">statistical-mechanics review</a>,
            and The Pudding's interactive <a href="https://pudding.cool/2022/12/yard-sale/" target="_blank" rel="noreferrer">“Why the super rich are inevitable.”</a>
          </p>
          <p className="ys-foot" style={{ marginTop: '1.5rem', color: 'var(--text-faint)' }}>
            Both the bubbles and the statistics above run the identical canonical rule — a fixed
            fraction of the poorer trader's wealth on a fair coin — differing only in population size.
          </p>
        </footer>
      </div>
    </div>
  );
}
