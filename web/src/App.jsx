import React, { useState } from 'react';
import WorkbenchLanding from './components/WorkbenchLanding';
import YardSalePage from '../../simulations/oligarchy/src/YardSalePage';

function App() {
  const [currentSimulation, setCurrentSimulation] = useState(null);

  const handleSelectSimulation = (simulationId) => {
    setCurrentSimulation(simulationId);
  };

  const handleBackToLanding = () => {
    setCurrentSimulation(null);
  };

  // Render the selected simulation or the landing page
  if (currentSimulation === 'oligarchy') {
    return <YardSalePage onBack={handleBackToLanding} />;
  }

  return <WorkbenchLanding onSelectSimulation={handleSelectSimulation} />;
}

export default App;
