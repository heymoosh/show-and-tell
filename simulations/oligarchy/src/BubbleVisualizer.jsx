import React, { useRef, useEffect, useState } from 'react';

/**
 * BubbleVisualizer - Renders agents as bubbles where size represents wealth
 * This creates the "Agar.io effect" that makes inequality viscerally obvious
 */
const BubbleVisualizer = ({ agents, running, width = 800, height = 500 }) => {
  const canvasRef = useRef(null);
  const agentPositionsRef = useRef(new Map());
  const [selectedAgent, setSelectedAgent] = useState(null);

  // Initialize random positions for agents
  useEffect(() => {
    if (agents.length === 0) return;

    const positions = agentPositionsRef.current;

    agents.forEach(agent => {
      if (!positions.has(agent.id)) {
        // Use stable random positions based on agent ID
        const angle = (agent.id * 2.399963) % (Math.PI * 2); // Golden angle for even distribution
        const radius = Math.sqrt(agent.id / agents.length) * Math.min(width, height) * 0.35;
        positions.set(agent.id, {
          x: width / 2 + Math.cos(angle) * radius,
          y: height / 2 + Math.sin(angle) * radius,
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5
        });
      }
    });
  }, [agents.length, width, height]);

  // Main render loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const positions = agentPositionsRef.current;

    const render = () => {
      // Clear with gradient background
      const gradient = ctx.createLinearGradient(0, 0, 0, height);
      gradient.addColorStop(0, '#0f172a'); // slate-900
      gradient.addColorStop(1, '#1e293b'); // slate-800
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      if (agents.length === 0) return;

      // Calculate wealth statistics
      const totalWealth = agents.reduce((sum, a) => sum + a.wealth, 0);
      const avgWealth = totalWealth / agents.length;
      const maxWealth = Math.max(...agents.map(a => a.wealth), 1);

      // Sort agents by wealth (render poor first, rich on top)
      const sortedAgents = [...agents].sort((a, b) => a.wealth - b.wealth);

      // Update positions with simple physics
      if (running) {
        sortedAgents.forEach(agent => {
          const pos = positions.get(agent.id);
          if (!pos) return;

          // Update position
          pos.x += pos.vx;
          pos.y += pos.vy;

          // Wall bouncing with radius consideration
          const radius = Math.max(3, Math.sqrt(agent.wealth / avgWealth) * 12);
          if (pos.x - radius < 0 || pos.x + radius > width) {
            pos.vx *= -0.8;
            pos.x = Math.max(radius, Math.min(width - radius, pos.x));
          }
          if (pos.y - radius < 0 || pos.y + radius > height) {
            pos.vy *= -0.8;
            pos.y = Math.max(radius, Math.min(height - radius, pos.y));
          }

          // Friction
          pos.vx *= 0.99;
          pos.vy *= 0.99;

          // Gentle random walk
          pos.vx += (Math.random() - 0.5) * 0.1;
          pos.vy += (Math.random() - 0.5) * 0.1;

          // Speed limit
          const speed = Math.sqrt(pos.vx ** 2 + pos.vy ** 2);
          if (speed > 2) {
            pos.vx = (pos.vx / speed) * 2;
            pos.vy = (pos.vy / speed) * 2;
          }
        });
      }

      // Draw agents
      sortedAgents.forEach(agent => {
        const pos = positions.get(agent.id);
        if (!pos) return;

        // Calculate radius (square root for area proportional to wealth)
        const radius = Math.max(3, Math.sqrt(agent.wealth / avgWealth) * 12);

        // Determine color based on wealth tier
        let fillColor, strokeColor, glowColor;
        const wealthPercentile = agent.wealth / maxWealth;

        if (wealthPercentile > 0.5) {
          // Oligarch (top 50% of max wealth) - Gold
          const intensity = Math.min(1, wealthPercentile);
          fillColor = `rgba(251, 191, 36, ${0.7 + intensity * 0.3})`; // amber-400
          strokeColor = `rgba(245, 158, 11, ${0.8 + intensity * 0.2})`; // amber-500
          glowColor = 'rgba(251, 191, 36, 0.4)';
        } else if (agent.wealth > avgWealth * 0.5) {
          // Middle class - Blue
          fillColor = 'rgba(59, 130, 246, 0.8)'; // blue-500
          strokeColor = 'rgba(37, 99, 235, 0.9)'; // blue-600
          glowColor = 'rgba(59, 130, 246, 0.3)';
        } else {
          // Poor - Gray
          const opacity = Math.max(0.3, agent.wealth / avgWealth);
          fillColor = `rgba(148, 163, 184, ${opacity})`; // slate-400
          strokeColor = `rgba(100, 116, 139, ${opacity + 0.2})`; // slate-500
          glowColor = 'rgba(148, 163, 184, 0.1)';
        }

        // Draw glow for larger agents
        if (radius > 15) {
          ctx.shadowBlur = radius;
          ctx.shadowColor = glowColor;
        } else {
          ctx.shadowBlur = 0;
        }

        // Draw circle
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, radius, 0, Math.PI * 2);
        ctx.fillStyle = fillColor;
        ctx.fill();

        ctx.shadowBlur = 0;
        ctx.strokeStyle = strokeColor;
        ctx.lineWidth = Math.max(1, radius / 8);
        ctx.stroke();

        // Highlight selected agent
        if (selectedAgent === agent.id) {
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
          ctx.lineWidth = 3;
          ctx.setLineDash([5, 5]);
          ctx.beginPath();
          ctx.arc(pos.x, pos.y, radius + 5, 0, Math.PI * 2);
          ctx.stroke();
          ctx.setLineDash([]);
        }

        // Draw wealth label for larger agents
        if (radius > 20) {
          ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
          ctx.font = `bold ${Math.min(14, radius / 2)}px sans-serif`;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(`$${Math.round(agent.wealth)}`, pos.x, pos.y);
        }
      });

      // Draw legend
      const legendX = 20;
      const legendY = height - 80;
      ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
      ctx.fillRect(legendX - 10, legendY - 10, 180, 70);

      const legendItems = [
        { label: 'Oligarch', color: 'rgba(251, 191, 36, 0.9)' },
        { label: 'Middle Class', color: 'rgba(59, 130, 246, 0.8)' },
        { label: 'Poor', color: 'rgba(148, 163, 184, 0.7)' }
      ];

      legendItems.forEach((item, i) => {
        ctx.beginPath();
        ctx.arc(legendX, legendY + i * 20, 6, 0, Math.PI * 2);
        ctx.fillStyle = item.color;
        ctx.fill();
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
        ctx.lineWidth = 1;
        ctx.stroke();

        ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
        ctx.font = '12px sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText(item.label, legendX + 15, legendY + i * 20 + 4);
      });
    };

    render();
    const interval = setInterval(render, 1000 / 60); // 60 FPS
    return () => clearInterval(interval);
  }, [agents, running, width, height, selectedAgent]);

  // Handle click to select agent
  const handleClick = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const positions = agentPositionsRef.current;
    const avgWealth = agents.reduce((sum, a) => sum + a.wealth, 0) / agents.length;

    // Find clicked agent
    for (const agent of agents) {
      const pos = positions.get(agent.id);
      if (!pos) continue;

      const radius = Math.max(3, Math.sqrt(agent.wealth / avgWealth) * 12);
      const dist = Math.sqrt((x - pos.x) ** 2 + (y - pos.y) ** 2);

      if (dist <= radius) {
        setSelectedAgent(selectedAgent === agent.id ? null : agent.id);
        return;
      }
    }

    setSelectedAgent(null);
  };

  // Display selected agent info
  const selectedAgentData = selectedAgent !== null
    ? agents.find(a => a.id === selectedAgent)
    : null;

  return (
    <div className="relative">
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        onClick={handleClick}
        className="rounded-lg cursor-pointer"
        style={{ width: '100%', height: 'auto' }}
      />

      {selectedAgentData && (
        <div className="absolute top-4 left-4 bg-black/70 backdrop-blur-md text-white px-4 py-3 rounded-lg border border-white/20">
          <div className="text-xs text-slate-300 uppercase tracking-wide mb-1">Selected Agent</div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold">{selectedAgentData.id}</span>
            <span className="text-lg text-green-400">${selectedAgentData.wealth.toFixed(2)}</span>
          </div>
          <div className="text-xs text-slate-400 mt-1">
            Click agent again to deselect
          </div>
        </div>
      )}
    </div>
  );
};

export default BubbleVisualizer;
