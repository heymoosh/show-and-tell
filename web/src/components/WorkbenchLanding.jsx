import React from 'react';
import SimulationPortal from './SimulationPortal';

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
      className="min-h-screen w-full relative overflow-hidden"
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

        {/* Main Content - Portal(s) centered on the desk */}
        <main className="flex-1 flex items-center justify-center px-6 py-8">
          <div
            className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-12"
            data-testid="card-grid"
          >
            {/* The Yard Sale Portal - using composite frame+illustration image */}
            <SimulationPortal
              compositeImage="/yard_sale_frame.png"
              title="The Yard Sale"
              status="ready"
              onClick={() => onSelectSimulation('oligarchy')}
              className="w-64 md:w-72 lg:w-80"
            />

            {/* Future portals will go here as they become ready:
            <SimulationPortal
              frameImage="/white_porcelain_frame.png"
              illustration="/polygons.png"
              title="Polygons"
              status="coming-soon"
              className="w-64 md:w-72 lg:w-80"
            />
            <SimulationPortal
              frameImage="/white_painted_frame.png"
              illustration="/outbreak.png"
              title="Outbreak"
              status="planned"
              className="w-64 md:w-72 lg:w-80"
            />
            */}
          </div>
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

export default WorkbenchLanding;
