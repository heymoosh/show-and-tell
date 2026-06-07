import React from 'react';
import SimulationPortal from './SimulationPortal';
import ResearchPortal from './ResearchPortal';

const RESEARCH = [
  {
    id: 'capitalism',
    kind: 'capitalism',
    title: "The U.S. isn't the best at capitalism",
    tag: 'Comparative capitalism',
    accent: '#1f5a43',
    accentSoft: '#e2ebe2',
    rotate: -1.5,
  },
  {
    id: 'innovation',
    kind: 'innovation',
    title: 'Banking rules beat venture capital',
    tag: 'Growth & innovation',
    accent: '#b4541f',
    accentSoft: '#f3e4d4',
    rotate: 1,
  },
  {
    id: 'inequality',
    kind: 'inequality',
    title: 'Inequality fuels prosperity — until it doesn’t',
    tag: 'Inequality & prosperity',
    accent: '#9b2d2d',
    accentSoft: '#f0ddd9',
    rotate: -0.75,
  },
];

/**
 * WorkbenchLanding - The main landing page
 *
 * Displays simulations as framed "portals" sitting on a wooden workbench surface.
 * The design mimics physical objects on a desk - no traditional UI chrome.
 *
 * Design principles (from PRD):
 * - Physical workbench metaphor with wood texture background
 * - Decorative frames as "portals" into each simulation
 * - Warm, analog aesthetic vs. typical software UI
 * - Portals are sized to feel like real objects on the desk
 */

const WorkbenchLanding = ({ onSelectSimulation }) => {
  return (
    <div
      className="min-h-screen w-full relative overflow-x-hidden"
      data-testid="workbench-landing"
    >
      {/* Wood Desk Background - fills entire viewport */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('/workbench_background.png')",
        }}
        aria-hidden="true"
      />

      {/* Content Layer */}
      <div className="relative z-10 min-h-screen flex flex-col">

        {/* Header - centered, with better contrast */}
        <header className="pt-8 pb-4 px-6">
          <div className="text-center">
            <h1
              className="text-3xl md:text-4xl font-black tracking-tight text-slate-800"
              data-testid="main-title"
              style={{
                textShadow: '0 2px 4px rgba(255,255,255,0.8), 0 1px 2px rgba(255,255,255,0.9)',
              }}
            >
              SHOW <span className="text-slate-600">& TELL</span>
            </h1>
            <p
              className="mt-2 text-sm text-slate-600 max-w-md mx-auto"
              data-testid="tagline"
              style={{
                textShadow: '0 1px 2px rgba(255,255,255,0.7)',
              }}
            >
              Interactive simulations that reveal hidden truths about complex systems.
            </p>
          </div>
        </header>

        {/* Main Content - objects arranged on the desk */}
        <main className="flex-1 flex flex-col items-center justify-center gap-10 px-6 py-10 md:gap-14">

          {/* Shelf 1 — simulations */}
          <section className="flex flex-col items-center gap-4" data-testid="card-grid">
            <ShelfLabel>Simulations</ShelfLabel>
            <SimulationPortal
              compositeImage="/yard_sale_frame.png"
              title="The Yard Sale"
              status="ready"
              onClick={() => onSelectSimulation('oligarchy')}
              className="w-56 md:w-64 lg:w-72"
            />
          </section>

          {/* Shelf 2 — interactive research */}
          <section className="flex w-full max-w-5xl flex-col items-center gap-5">
            <ShelfLabel>Research · interactive reports</ShelfLabel>
            <div className="grid w-full grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
              {RESEARCH.map((r) => (
                <ResearchPortal
                  key={r.id}
                  kind={r.kind}
                  title={r.title}
                  tag={r.tag}
                  accent={r.accent}
                  accentSoft={r.accentSoft}
                  rotate={r.rotate}
                  onClick={() => onSelectSimulation(r.id)}
                />
              ))}
            </div>
          </section>
        </main>

        {/* Minimal Footer - barely visible, part of the desk */}
        <footer
          className="py-3 px-6 md:px-12"
          data-testid="footer"
        >
          <div className="max-w-7xl mx-auto flex justify-between items-center text-[10px] text-slate-500/50 font-mono">
            <span>// v1.0.0</span>
            <span>Designed for exploration</span>
          </div>
        </footer>
      </div>
    </div>
  );
};

const ShelfLabel = ({ children }) => (
  <div
    className="font-mono text-[11px] uppercase tracking-[0.25em] text-slate-700"
    style={{ textShadow: '0 1px 2px rgba(255,255,255,0.8)' }}
  >
    {children}
  </div>
);

export default WorkbenchLanding;
