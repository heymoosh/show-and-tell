import React, { useState, useEffect, Suspense, lazy } from 'react';
import WorkbenchLanding from './components/WorkbenchLanding';
import YardSalePage from '../../simulations/oligarchy/src/YardSalePage';

const CapitalismPage = lazy(() => import('../../research/capitalism-models/src/CapitalismPage'));
const InnovationLeversPage = lazy(() => import('../../research/innovation-levers/src/InnovationLeversPage'));
const InequalityPage = lazy(() => import('../../research/inequality-prosperity/src/InequalityPage'));

// Shareable deep-link paths <-> internal page ids.
const PATH_TO_ID = {
  '/capitalism': 'capitalism',
  '/innovation': 'innovation',
  '/inequality': 'inequality',
  '/yard-sale': 'oligarchy',
};
const ID_TO_PATH = {
  capitalism: '/capitalism',
  innovation: '/innovation',
  inequality: '/inequality',
  oligarchy: '/yard-sale',
};

const idFromLocation = () => PATH_TO_ID[window.location.pathname] || null;

function PageLoader() {
  return (
    <div className="flex min-h-screen items-center justify-center" style={{ background: '#f3eee2' }}>
      <div className="font-mono text-[12px] uppercase tracking-[0.25em] animate-pulse" style={{ color: '#6f655a' }}>
        Loading research…
      </div>
    </div>
  );
}

function App() {
  const [currentSimulation, setCurrentSimulation] = useState(idFromLocation);

  // Keep React state in sync with browser back/forward navigation.
  useEffect(() => {
    const onPop = () => setCurrentSimulation(idFromLocation());
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  const handleSelectSimulation = (simulationId) => {
    const path = ID_TO_PATH[simulationId] || '/';
    if (window.location.pathname !== path) window.history.pushState({}, '', path);
    setCurrentSimulation(simulationId);
    window.scrollTo(0, 0);
  };

  const handleBackToLanding = () => {
    if (window.location.pathname !== '/') window.history.pushState({}, '', '/');
    setCurrentSimulation(null);
    window.scrollTo(0, 0);
  };

  if (currentSimulation === 'oligarchy') {
    return <YardSalePage onBack={handleBackToLanding} />;
  }

  const ResearchPage = {
    capitalism: CapitalismPage,
    innovation: InnovationLeversPage,
    inequality: InequalityPage,
  }[currentSimulation];

  if (ResearchPage) {
    return (
      <Suspense fallback={<PageLoader />}>
        <ResearchPage onBack={handleBackToLanding} />
      </Suspense>
    );
  }

  return <WorkbenchLanding onSelectSimulation={handleSelectSimulation} />;
}

export default App;
