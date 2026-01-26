import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  Play, Pause, RotateCcw, Settings2, Info, DollarSign,
  Users, Activity, ChevronRight, TrendingUp, ArrowLeft
} from 'lucide-react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip as RechartsTooltip, ResponsiveContainer, Legend
} from 'recharts';
import BubbleVisualizer from './BubbleVisualizer';
import YardSaleSimulation from './YardSaleSimulation';

// Shared UI Components
const Card = ({ children, className = "" }) => (
  <div className={`bg-white rounded-xl border border-slate-200 shadow-sm ${className}`}>
    {children}
  </div>
);

const Badge = ({ children, color = "blue" }) => {
  const colors = {
    blue: "bg-blue-50 text-blue-700 border-blue-200",
    green: "bg-emerald-50 text-emerald-700 border-emerald-200",
    red: "bg-rose-50 text-rose-700 border-rose-200",
    purple: "bg-purple-50 text-purple-700 border-purple-200",
  };
  return (
    <span className={`px-2 py-0.5 rounded text-xs font-medium border ${colors[color] || colors.blue}`}>
      {children}
    </span>
  );
};

const YardSalePage = ({ onBack }) => {
  // Tab state
  const [activeTab, setActiveTab] = useState('simulation');

  // Simulation parameters
  const [numAgents, setNumAgents] = useState(100);
  const [initialWealth, setInitialWealth] = useState(100);
  const [maxTransferPercent, setMaxTransferPercent] = useState(20);
  const [round, setRound] = useState(0);
  const [speed, setSpeed] = useState(50);

  // Simulation state
  const [agents, setAgents] = useState([]);
  const [isRunning, setIsRunning] = useState(false);
  const [wealthHistory, setWealthHistory] = useState([]);

  // Initialize simulation
  const initializeSimulation = useCallback(() => {
    const newAgents = Array.from({ length: numAgents }, (_, i) => ({
      id: i,
      wealth: initialWealth
    }));
    setAgents(newAgents);
    setRound(0);
    setWealthHistory([]);
    setIsRunning(false);
  }, [numAgents, initialWealth]);

  useEffect(() => {
    initializeSimulation();
  }, [initializeSimulation]);

  // Simulation engine
  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      setAgents(prev => {
        const next = [...prev];
        const tradesPerTick = Math.floor(numAgents / 2);

        // Execute trades
        for (let i = 0; i < tradesPerTick; i++) {
          const idxA = Math.floor(Math.random() * numAgents);
          let idxB = Math.floor(Math.random() * numAgents);
          while (idxA === idxB) idxB = Math.floor(Math.random() * numAgents);

          const agentA = next[idxA];
          const agentB = next[idxB];

          // Bet percentage of the POORER agent's wealth
          const stake = Math.min(agentA.wealth, agentB.wealth) * (maxTransferPercent / 100);

          // Coin flip
          if (Math.random() > 0.5) {
            agentA.wealth += stake;
            agentB.wealth -= stake;
          } else {
            agentA.wealth -= stake;
            agentB.wealth += stake;
          }

          // Prevent negative wealth
          agentA.wealth = Math.max(0, agentA.wealth);
          agentB.wealth = Math.max(0, agentB.wealth);
        }

        return next;
      });

      setRound(r => {
        const newRound = r + 1;

        // Update history every 10 rounds
        if (newRound % 10 === 0) {
          setWealthHistory(h => {
            const current = agents.slice();
            const sorted = [...current].sort((a, b) => b.wealth - a.wealth);
            const totalWealth = sorted.reduce((sum, a) => sum + a.wealth, 0);
            const top1 = sorted[0]?.wealth || 0;
            const top10Percent = Math.max(1, Math.floor(sorted.length * 0.1));
            const top10Share = (sorted.slice(0, top10Percent).reduce((sum, a) => sum + a.wealth, 0) / totalWealth) * 100;

            // Calculate Gini coefficient
            let giniSum = 0;
            for (let i = 0; i < sorted.length; i++) {
              giniSum += (2 * (i + 1) - sorted.length - 1) * sorted[sorted.length - 1 - i];
            }
            const gini = giniSum / (sorted.length * totalWealth);

            return [...h.slice(-100), {
              round: newRound,
              top1,
              top10Share,
              gini: gini * 100,
              avgWealth: totalWealth / sorted.length
            }];
          });
        }

        return newRound;
      });
    }, speed);

    return () => clearInterval(interval);
  }, [isRunning, speed, numAgents, maxTransferPercent, agents]);

  // Calculate current statistics
  const stats = React.useMemo(() => {
    if (agents.length === 0) return {
      totalWealth: 0,
      richest: { wealth: 0 },
      poorest: { wealth: 0 },
      top1Share: 0,
      gini: 0,
      activeAgents: 0,
      wealthGap: 0
    };

    const sorted = [...agents].sort((a, b) => b.wealth - a.wealth);
    const totalWealth = sorted.reduce((sum, a) => sum + a.wealth, 0);
    const richest = sorted[0];
    const poorest = sorted[sorted.length - 1];
    const top1Share = (richest.wealth / totalWealth) * 100;

    // Gini coefficient
    let giniSum = 0;
    for (let i = 0; i < sorted.length; i++) {
      giniSum += (2 * (i + 1) - sorted.length - 1) * sorted[sorted.length - 1 - i];
    }
    const gini = (giniSum / (sorted.length * totalWealth)) * 100;

    return {
      totalWealth,
      richest,
      poorest,
      top1Share,
      gini,
      activeAgents: agents.filter(a => a.wealth > 1).length,
      wealthGap: richest.wealth / Math.max(poorest.wealth, 0.01)
    };
  }, [agents]);

  // Leaderboard data
  const leaderboard = React.useMemo(() => {
    return [...agents]
      .sort((a, b) => b.wealth - a.wealth)
      .slice(0, 10);
  }, [agents]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans flex flex-col md:flex-row">
      {/* SIDEBAR NAVIGATION */}
      <nav className="w-full md:w-64 bg-slate-900 text-slate-300 flex flex-col flex-shrink-0">
        <div className="p-6 border-b border-slate-700">
          {onBack && (
            <button
              onClick={onBack}
              className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-4 text-sm"
              data-testid="back-button"
            >
              <ArrowLeft size={16} />
              <span>Back to Workbench</span>
            </button>
          )}
          <h1 className="text-xl font-bold text-white tracking-tight">Show & Tell</h1>
          <p className="text-xs text-slate-500 mt-1">Interactive Systems Lab</p>
        </div>
        <div className="p-4 space-y-2">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Simulations</div>
          <button className="w-full flex items-center gap-3 px-3 py-2 bg-blue-600/20 text-blue-400 rounded-lg border border-blue-600/30">
            <DollarSign size={18} />
            <span className="font-medium">Oligarchy</span>
          </button>
          <button className="w-full flex items-center gap-3 px-3 py-2 hover:bg-slate-800 rounded-lg transition-colors opacity-50 cursor-not-allowed">
            <Users size={18} />
            <span>Segregation</span>
          </button>
          <button className="w-full flex items-center gap-3 px-3 py-2 hover:bg-slate-800 rounded-lg transition-colors opacity-50 cursor-not-allowed">
            <Activity size={18} />
            <span>Epidemics</span>
          </button>
        </div>
      </nav>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* HEADER */}
        <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-2xl font-bold text-slate-900">The Yard Sale Model</h2>
              <Badge color="blue">Economic Physics</Badge>
            </div>
            <p className="text-slate-500 text-sm mt-1">Why fair trades inevitably lead to extreme inequality.</p>
          </div>

          <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-lg">
            <button
              onClick={() => setActiveTab('simulation')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                activeTab === 'simulation' ? 'bg-white shadow-sm text-blue-700' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Simulation
            </button>
            <button
              onClick={() => setActiveTab('explanation')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                activeTab === 'explanation' ? 'bg-white shadow-sm text-blue-700' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Explanation
            </button>
            <button
              onClick={() => setActiveTab('deepdive')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                activeTab === 'deepdive' ? 'bg-white shadow-sm text-blue-700' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Deep Dive
            </button>
          </div>
        </header>

        {/* CONTENT GRID */}
        <div className="flex-1 overflow-auto p-6">
          {activeTab === 'simulation' && (
            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* LEFT COLUMN: VISUALIZATION */}
              <div className="lg:col-span-2 space-y-6">
                {/* PRIMARY VIEWPORT */}
                <Card className="overflow-hidden bg-slate-900 border-slate-800">
                  <div className="relative">
                    <BubbleVisualizer
                      agents={agents}
                      running={isRunning}
                      width={800}
                      height={500}
                    />

                    {/* Overlay Controls */}
                    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-white/90 backdrop-blur-sm p-2 rounded-xl shadow-lg border border-white/20">
                      <button
                        onClick={() => setIsRunning(!isRunning)}
                        className="w-10 h-10 flex items-center justify-center rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition-colors"
                        aria-label={isRunning ? 'Pause' : 'Play'}
                      >
                        {isRunning ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" className="ml-0.5" />}
                      </button>
                      <button
                        onClick={initializeSimulation}
                        className="w-10 h-10 flex items-center justify-center rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-700 transition-colors"
                        aria-label="Reset"
                      >
                        <RotateCcw size={20} />
                      </button>
                      <div className="w-px h-6 bg-slate-300 mx-1"></div>
                      <div className="flex flex-col px-2">
                        <span className="text-[10px] font-bold uppercase text-slate-500">Speed</span>
                        <input
                          type="range"
                          min="10" max="200"
                          value={210 - speed}
                          onChange={(e) => setSpeed(210 - parseInt(e.target.value))}
                          className="w-24 h-1 bg-slate-300 rounded-lg appearance-none cursor-pointer accent-blue-600"
                          aria-label="Simulation speed"
                        />
                      </div>
                    </div>

                    <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-md text-white px-3 py-1 rounded-full text-xs font-mono">
                      Round: {round.toLocaleString()}
                    </div>
                  </div>
                </Card>

                {/* SECONDARY METRICS */}
                <div className="grid grid-cols-3 gap-4">
                  <Card className="p-4 flex flex-col justify-between">
                    <div className="text-xs text-slate-500 font-medium uppercase">Top 1% Share</div>
                    <div className="text-2xl font-bold text-slate-800">{stats.top1Share.toFixed(1)}%</div>
                    <div className="h-10 mt-2">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={wealthHistory}>
                          <Line type="monotone" dataKey="top1" stroke="#2563eb" strokeWidth={2} dot={false} />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </Card>
                  <Card className="p-4 flex flex-col justify-between">
                    <div className="text-xs text-slate-500 font-medium uppercase">Wealth Gap</div>
                    <div className="text-2xl font-bold text-slate-800">
                      {stats.wealthGap.toFixed(0)}x
                    </div>
                    <div className="text-xs text-slate-400 mt-1">Richest vs Poorest</div>
                  </Card>
                  <Card className="p-4 flex flex-col justify-between">
                    <div className="text-xs text-slate-500 font-medium uppercase">Active Agents</div>
                    <div className="text-2xl font-bold text-slate-800">
                      {stats.activeAgents}
                    </div>
                    <div className="text-xs text-slate-400 mt-1">Non-ruined (&gt; $1)</div>
                  </Card>
                </div>

                {/* INSTRUCTIONAL BLOCK */}
                <Card className="p-6 bg-indigo-50 border-indigo-100">
                  <h3 className="flex items-center gap-2 font-bold text-indigo-900 mb-2">
                    <Info size={18} />
                    What am I looking at?
                  </h3>
                  <p className="text-indigo-800 leading-relaxed">
                    You are watching {numAgents} agents trade with each other. Every trade is a fair 50/50 coin flip.
                    The winner takes {maxTransferPercent}% of the <strong>poorer</strong> agent's wealth.
                    <br /><br />
                    Notice how quickly the bubbles diverge in size? That's mathematical destiny. Once an agent gets slightly unlucky,
                    their betting stake shrinks, making it harder to recover. Once an agent gets lucky, they can absorb losses easily.
                    <br /><br />
                    The largest bubbles are the oligarchs who've accumulated vast wealth. The tiny dots are the impoverished masses.
                    This happens even though <em>every single trade was perfectly fair</em>.
                  </p>
                </Card>
              </div>

              {/* RIGHT COLUMN: CONTROLS & LEADERBOARD */}
              <div className="space-y-6">
                <Card className="p-5 sticky top-0">
                  <div className="flex items-center gap-2 mb-4 text-slate-800 font-semibold">
                    <Settings2 size={18} />
                    <span>Parameters</span>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <label className="block text-xs font-medium text-slate-500 mb-2">
                        Population Size ({numAgents})
                      </label>
                      <input
                        type="range" min="10" max="500" step="10"
                        value={numAgents}
                        onChange={(e) => {
                          setNumAgents(parseInt(e.target.value));
                          setIsRunning(false);
                        }}
                        className="w-full accent-blue-600"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-500 mb-2">
                        Transfer Rate ({maxTransferPercent}%)
                      </label>
                      <input
                        type="range" min="5" max="50" step="5"
                        value={maxTransferPercent}
                        onChange={(e) => setMaxTransferPercent(parseInt(e.target.value))}
                        className="w-full accent-blue-600"
                      />
                      <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                        <span>Safe (5%)</span>
                        <span>Risky (50%)</span>
                      </div>
                      <p className="text-[10px] text-slate-400 mt-2">
                        Percentage of the poorer agent's wealth bet per trade.
                      </p>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-500 mb-2">
                        Initial Wealth (${initialWealth})
                      </label>
                      <input
                        type="range" min="50" max="500" step="50"
                        value={initialWealth}
                        onChange={(e) => {
                          setInitialWealth(parseInt(e.target.value));
                          setIsRunning(false);
                        }}
                        className="w-full accent-blue-600"
                      />
                    </div>
                  </div>
                </Card>

                {/* LEADERBOARD */}
                <Card className="p-0 overflow-hidden">
                  <div className="bg-slate-50 px-4 py-3 border-b border-slate-200">
                    <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wide flex items-center gap-2">
                      <TrendingUp size={14} />
                      Live Leaderboard
                    </h3>
                  </div>
                  <div className="divide-y divide-slate-100 max-h-[400px] overflow-auto">
                    {leaderboard.map((agent, i) => (
                      <div key={agent.id} className="px-4 py-3 flex items-center justify-between hover:bg-slate-50 transition-colors">
                        <div className="flex items-center gap-3">
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${
                            i === 0 ? 'bg-amber-100 text-amber-700' :
                            i === 1 ? 'bg-slate-200 text-slate-600' :
                            i === 2 ? 'bg-orange-100 text-orange-700' : 'bg-slate-50 text-slate-400'
                          }`}>
                            {i + 1}
                          </div>
                          <span className="text-sm font-medium text-slate-700">Agent {agent.id}</span>
                        </div>
                        <span className="text-sm font-mono text-slate-600">${agent.wealth.toFixed(0)}</span>
                      </div>
                    ))}
                  </div>
                  {numAgents > 10 && (
                    <div className="bg-slate-50 px-4 py-2 border-t border-slate-200 text-center">
                      <span className="text-xs text-slate-400">
                        ... and {numAgents - 10} others
                      </span>
                    </div>
                  )}
                </Card>
              </div>
            </div>
          )}

          {activeTab === 'explanation' && (
            <div className="max-w-4xl mx-auto">
              <Card className="p-8">
                <h2 className="text-2xl font-bold text-slate-900 mb-4">The Mathematics of Oligarchy</h2>

                <div className="prose prose-slate max-w-none space-y-4">
                  <h3 className="text-xl font-semibold text-slate-800">The Yard Sale Model</h3>
                  <p className="text-slate-600 leading-relaxed">
                    Imagine a simple game: Everyone starts with the same amount of money. People randomly pair up and flip a coin.
                    The winner gets some money from the loser. Seems fair, right? But here's the shocking result: <strong>Even with perfectly fair coin flips,
                    a few people end up with almost everything, and most people end up with almost nothing.</strong>
                  </p>
                  <p className="text-slate-600 leading-relaxed">
                    This is called the Yard Sale Model. First described by physicist <a href="https://arxiv.org/abs/0905.1518" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 underline">Anirban Chakraborti in 2002</a>, it's now one of the main tools scientists use to understand wealth inequality.
                  </p>

                  <h3 className="text-xl font-semibold text-slate-800 mt-6">How It Works</h3>
                  <ol className="list-decimal list-inside space-y-2 text-slate-600">
                    <li>Everyone starts with $100</li>
                    <li>Pick two random people</li>
                    <li>They flip a coin and bet some money (a percentage of what the poorer person has)</li>
                    <li>Winner takes the bet money from the loser</li>
                    <li>Repeat this thousands of times</li>
                  </ol>

                  <h3 className="text-xl font-semibold text-slate-800 mt-6">Why Do the Rich Get Richer?</h3>
                  <div className="bg-blue-50 border-l-4 border-blue-500 p-4 my-4">
                    <p className="text-blue-900 font-medium">The Key Idea: The Trap at the Bottom</p>
                    <p className="text-blue-800 mt-2">
                      Think of it like a game where you can't go below zero dollars but there's no limit on how much you can win.
                      Once someone runs out of money, they're stuck—they can't play anymore. But rich people can keep winning forever because they have a <strong>wealth buffer</strong>.
                      This buffer acts like a cushion: when rich people lose, they can absorb the loss and keep playing. When poor people lose,
                      they get pushed closer to zero and eventually can't play anymore.
                      As mathematician <a href="https://www.degruyterbrill.com/document/doi/10.1515/9780691213651-004/html" target="_blank" rel="noopener noreferrer" className="text-blue-700 hover:text-blue-900 underline">Bruce Boghosian showed</a>,
                      "Once initial symmetry is broken, further transactions inexorably transfer all the wealth into the hands of a few individuals."
                    </p>
                    <p className="text-blue-800 mt-2">
                      For a more comprehensive understanding of how these dynamics play out with real data and statistical analysis,
                      check out the <strong>Deep Dive</strong> tab.
                    </p>
                  </div>

                  <h3 className="text-xl font-semibold text-slate-800 mt-6">Why the Poor Stay Poor</h3>
                  <p className="text-slate-600">
                    Here's the unfair part hidden in "fair" trades: When you bet a percentage of the poorer person's money,
                    poor people are risking everything while rich people are barely risking anything. If you have $10 and bet 20%,
                    you're betting $2—that's a lot to you! But if a rich person bets your $2, it means nothing to them.
                    They can afford to lose many times. You can't.
                  </p>

                  <h3 className="text-xl font-semibold text-slate-800 mt-6">Does This Actually Happen in Real Life?</h3>

                  <div className="bg-green-50 border-l-4 border-green-500 p-4 my-4">
                    <p className="text-green-900 font-medium">✓ Yes, the Math Checks Out</p>
                    <p className="text-green-800 mt-2">
                      Scientists tested this model against real wealth data from America and Europe over 27 years.
                      When they added in things like taxes and government programs, <a href="https://www.irishtimes.com/news/science/the-free-market-is-a-rigged-casino-1.4088489" target="_blank" rel="noopener noreferrer" className="text-green-700 hover:text-green-900 underline">the model predicted how wealth was actually distributed with better than 2% accuracy</a>. Another version called the <a href="https://arxiv.org/abs/1604.02370" target="_blank" rel="noopener noreferrer" className="text-green-700 hover:text-green-900 underline">Affine Wealth Model</a> (which includes people going into debt) matched U.S. financial data over 27 years with less than 0.16% error.
                      That's incredibly accurate for something so simple!
                    </p>
                  </div>

                  <div className="bg-amber-50 border-l-4 border-amber-500 p-4 my-4">
                    <p className="text-amber-900 font-medium">⚠ What This Model Gets Wrong</p>
                    <p className="text-amber-800 mt-2">
                      This model makes things simpler than real life: (1) It assumes every trade is win-lose, but real trades often help both people
                      (when you buy groceries, both you and the store benefit), (2) It assumes anyone can trade with anyone, which isn't realistic,
                      and (3) It treats everything as luck—no skill or hard work involved. As critics say, <a href="https://www.metafilter.com/197664/The-Yard-Sale-Model" target="_blank" rel="noopener noreferrer" className="text-amber-700 hover:text-amber-900 underline">"Can't inform specific policy decisions since it doesn't capture complex economic variables,"</a> but it's still useful for understanding how money tends to flow upward in free markets.
                    </p>
                  </div>

                  <h3 className="text-xl font-semibold text-slate-800 mt-6">What This Means for the Real World</h3>

                  <div className="bg-purple-50 border-l-4 border-purple-500 p-4 my-4">
                    <p className="text-purple-900 font-medium">The Meritocracy Myth</p>
                    <p className="text-purple-800 mt-2">
                      We often believe that inequality happens because some people work harder or are smarter than others.
                      But this simulation shows something shocking: <strong>extreme inequality can emerge even when everyone has exactly equal opportunity and every trade is perfectly fair.</strong> As <a href="https://www.scientificamerican.com/article/is-inequality-inevitable/" target="_blank" rel="noopener noreferrer" className="text-purple-700 hover:text-purple-900 underline">Scientific American reports</a>, researchers found that "free and fair trading among identical agents inescapably results in extreme wealth inequality."
                    </p>
                    <p className="text-purple-800 mt-2">
                      Think about that: In these simulations, all agents started with the same wealth and had the exact same odds in every trade.
                      There was true "equality of opportunity." Yet only one became the oligarch. <a href="https://epubs.siam.org/doi/10.1137/18M1186413" target="_blank" rel="noopener noreferrer" className="text-purple-700 hover:text-purple-900 underline">As SIAM research explains</a>, "All had equal odds if they began with equal wealth. In that sense, there was equality of opportunity. But only one of them did become the oligarch."
                      The natural tendency of wealth is to flow upward—not because of merit, but because of mathematics.
                    </p>
                  </div>

                  <p className="text-slate-600 font-semibold mt-4">Key Takeaways:</p>
                  <ul className="list-disc list-inside space-y-2 text-slate-600">
                    <li>Money naturally flows upward—even in "fair" systems with equal opportunity</li>
                    <li>Extreme inequality can emerge purely from random chance, not from differences in talent or effort</li>
                    <li>Without interventions like taxes and safety nets, a few people will end up with everything</li>
                    <li>Giving everyone the same starting point doesn't mean they'll end up equal</li>
                    <li>There's a tipping point: When inequality gets bad enough, it suddenly becomes extreme—like water turning to ice</li>
                  </ul>

                  <h3 className="text-xl font-semibold text-slate-800 mt-6">Why Scientists Use Physics to Study Money</h3>
                  <p className="text-slate-600">
                    Here's a cool connection: Remember learning about gas molecules bouncing around randomly? Scientists realized that people
                    trading money works the same way! When they <a href="https://www.physics.umd.edu/~yakovenk/econophysics/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 underline">use physics math to study economics</a>, they found that about 97% of people have wealth that follows one pattern (like how most
                    gas molecules have similar energy), while the richest 3% follow a totally different pattern. And guess what? <a href="https://www.americanscientist.org/article/follow-the-money" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 underline">When scientists checked real data</a>, that's exactly what they found!
                  </p>

                  <h3 className="text-xl font-semibold text-slate-800 mt-6">Want to Learn More? Read the Research</h3>
                  <div className="bg-slate-50 p-4 rounded-lg space-y-3 text-sm">
                    <div>
                      <p className="font-semibold text-slate-700">Where It All Started:</p>
                      <ul className="list-disc list-inside space-y-1 text-slate-600 ml-2">
                        <li><a href="https://www.americanscientist.org/article/follow-the-money" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 underline">Hayes, B. (2002). "Follow the Money"</a>. <em>American Scientist</em>, 90(5), 400-405.</li>
                        <li><a href="https://arxiv.org/abs/0905.1518" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 underline">Yakovenko, V. M., & Rosser, J. B. (2009). "Statistical mechanics of money, wealth, and income"</a>. <em>Reviews of Modern Physics</em>, 81(4), 1703.</li>
                      </ul>
                    </div>
                    <div>
                      <p className="font-semibold text-slate-700 mt-3">Recent Discoveries:</p>
                      <ul className="list-disc list-inside space-y-1 text-slate-600 ml-2">
                        <li><a href="https://www.degruyterbrill.com/document/doi/10.1515/9780691213651-004/html" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 underline">Boghosian, B. M. (2019). "The Inescapable Casino"</a>. Included in <em>The Best Writing on Mathematics 2020</em>.</li>
                        <li><a href="https://arxiv.org/abs/1604.02370" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 underline">Devitt-Lee, A., et al. (2019). "The Affine Wealth Model"</a>. <em>Physica A</em>, 516, 423-442.</li>
                        <li><a href="https://arxiv.org/abs/2508.06650" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 underline">Limiting risk to reduce inequality (2025)</a>. <em>Physica A</em> - Latest research on policy interventions.</li>
                      </ul>
                    </div>
                    <div>
                      <p className="font-semibold text-slate-700 mt-3">Critiques and Debates:</p>
                      <ul className="list-disc list-inside space-y-1 text-slate-600 ml-2">
                        <li><a href="https://link.springer.com/article/10.1140/epjb/s10051-024-00695-3" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 underline">Twenty-five years of random asset exchange modeling (2024)</a>. Review of empirical challenges and validation efforts.</li>
                      </ul>
                    </div>
                  </div>

                  <div className="bg-purple-50 border-l-4 border-purple-500 p-4 my-4 mt-6">
                    <p className="text-purple-900 font-medium">💡 The Big Takeaway</p>
                    <p className="text-purple-800 mt-2">
                      This model isn't perfect—no model of the real world is. But it teaches us something important: <strong>When people
                      trade randomly and there's a floor (you can't have negative money) but no ceiling (you can get infinitely rich),
                      inequality is mathematically guaranteed unless there's some way to redistribute wealth.</strong> The model is powerful
                      because it's simple enough to understand but accurate enough to match real-world data.
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          )}

          {activeTab === 'deepdive' && (
            <div className="max-w-7xl mx-auto">
              <YardSaleSimulation />
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default YardSalePage;
