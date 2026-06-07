import React, { useState, Suspense, lazy } from 'react';
import WorkbenchLanding from './components/WorkbenchLanding';
import YardSalePage from '../../simulations/oligarchy/src/YardSalePage';

const CapitalismPage = lazy(() => import('../../research/capitalism-models/src/CapitalismPage'));
const InnovationLeversPage = lazy(() => import('../../research/innovation-levers/src/InnovationLeversPage'));
const InequalityPage = lazy(() => import('../../research/inequality-prosperity/src/InequalityPage'));

function PageLoader() {
  return (
    <div className="flex min-h-screen items-center justify-center" style={{ background: '#f3eee2' }}>
      <div
        className="font-mono text-[12px] uppercase tracking-[0.25em] animate-pulse"
        style={{ color: '#6f655a' }}
      >
        Loading research…
      </div>
    </div>
  );
}

function App() {
  const [currentSimulation, setCurrentSimulation] = useState(null);

  const handleSelectSimulation = (simulationId) => {
    setCurrentSimulation(simulationId);
    window.scrollTo(0, 0);
  };

  const handleBackToLanding = () => {
    setCurrentSimulation(null);
    window.scrollTo(0, 0);
  };

  // Render the selected simulation/report or the landing page
  if (currentSimulation === 'oligarchy') {
    return <YardSalePage onBack={handleBackToLanding} />;
  }

  const research = {
    capitalism: CapitalismPage,
    innovation: InnovationLeversPage,
    inequality: InequalityPage,
  }[currentSimulation];

  if (research) {
    const Page = research;
    return (
      <Suspense fallback={<PageLoader />}>
        <Page onBack={handleBackToLanding} />
      </Suspense>
    );
  }

  return <WorkbenchLanding onSelectSimulation={handleSelectSimulation} />;
}

export default App;
