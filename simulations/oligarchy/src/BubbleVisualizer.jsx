import React, { useRef, useEffect, useState } from 'react';

/**
 * BubbleVisualizer — renders agents as bubbles whose area is proportional to
 * wealth. The "Agar.io effect" makes wealth condensation viscerally obvious:
 * a few gold giants, a sea of dim grey, and rose-tinted near-ruined dots.
 *
 * Palette is aligned with yardsale.css: gold = oligarch, slate = middle/working,
 * rose = ruined (near zero).
 */
const BubbleVisualizer = ({ agents, running, width = 800, height = 520 }) => {
  const canvasRef = useRef(null);
  const agentPositionsRef = useRef(new Map());
  const [selectedAgent, setSelectedAgent] = useState(null);

  // Stable initial positions (golden-angle spiral) so bubbles don't jump on mount.
  useEffect(() => {
    if (agents.length === 0) return;
    const positions = agentPositionsRef.current;
    agents.forEach((agent) => {
      if (!positions.has(agent.id)) {
        const angle = (agent.id * 2.399963) % (Math.PI * 2);
        const radius = Math.sqrt(agent.id / agents.length) * Math.min(width, height) * 0.35;
        positions.set(agent.id, {
          x: width / 2 + Math.cos(angle) * radius,
          y: height / 2 + Math.sin(angle) * radius,
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5,
        });
      }
    });
  }, [agents.length, width, height]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    const ctx = canvas.getContext('2d');
    ctx.scale(dpr, dpr);
    const positions = agentPositionsRef.current;

    const render = () => {
      const bg = ctx.createLinearGradient(0, 0, 0, height);
      bg.addColorStop(0, '#15121b');
      bg.addColorStop(1, '#0b0a0d');
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, width, height);

      if (agents.length === 0) return;

      const totalWealth = agents.reduce((sum, a) => sum + a.wealth, 0);
      const avgWealth = totalWealth / agents.length || 1;
      const maxWealth = Math.max(...agents.map((a) => a.wealth), 1);
      const ruinFloor = avgWealth * 0.05;

      const sortedAgents = [...agents].sort((a, b) => a.wealth - b.wealth);

      if (running) {
        sortedAgents.forEach((agent) => {
          const pos = positions.get(agent.id);
          if (!pos) return;
          pos.x += pos.vx;
          pos.y += pos.vy;
          const radius = Math.max(2.5, Math.sqrt(agent.wealth / avgWealth) * 12);
          if (pos.x - radius < 0 || pos.x + radius > width) {
            pos.vx *= -0.8;
            pos.x = Math.max(radius, Math.min(width - radius, pos.x));
          }
          if (pos.y - radius < 0 || pos.y + radius > height) {
            pos.vy *= -0.8;
            pos.y = Math.max(radius, Math.min(height - radius, pos.y));
          }
          pos.vx *= 0.99;
          pos.vy *= 0.99;
          pos.vx += (Math.random() - 0.5) * 0.1;
          pos.vy += (Math.random() - 0.5) * 0.1;
          const speed = Math.sqrt(pos.vx ** 2 + pos.vy ** 2);
          if (speed > 2) {
            pos.vx = (pos.vx / speed) * 2;
            pos.vy = (pos.vy / speed) * 2;
          }
        });
      }

      sortedAgents.forEach((agent) => {
        const pos = positions.get(agent.id);
        if (!pos) return;
        const radius = Math.max(2.5, Math.sqrt(agent.wealth / avgWealth) * 12);
        const percentile = agent.wealth / maxWealth;

        let fillColor;
        let strokeColor;
        let glowColor;
        if (percentile > 0.5) {
          const intensity = Math.min(1, percentile);
          fillColor = `rgba(232, 184, 75, ${0.78 + intensity * 0.22})`;
          strokeColor = 'rgba(255, 215, 106, 0.9)';
          glowColor = 'rgba(232, 184, 75, 0.5)';
        } else if (agent.wealth > avgWealth * 0.5) {
          fillColor = 'rgba(140, 147, 166, 0.85)';
          strokeColor = 'rgba(184, 190, 204, 0.9)';
          glowColor = 'rgba(140, 147, 166, 0.22)';
        } else if (agent.wealth < ruinFloor) {
          const o = Math.max(0.28, agent.wealth / ruinFloor);
          fillColor = `rgba(224, 85, 107, ${0.32 + o * 0.3})`;
          strokeColor = 'rgba(224, 85, 107, 0.55)';
          glowColor = 'rgba(224, 85, 107, 0.18)';
        } else {
          const o = Math.max(0.3, agent.wealth / avgWealth);
          fillColor = `rgba(120, 126, 140, ${o})`;
          strokeColor = `rgba(150, 156, 170, ${o + 0.15})`;
          glowColor = 'rgba(120, 126, 140, 0.1)';
        }

        ctx.shadowBlur = radius > 14 ? radius * 1.1 : 0;
        ctx.shadowColor = glowColor;

        ctx.beginPath();
        ctx.arc(pos.x, pos.y, radius, 0, Math.PI * 2);
        ctx.fillStyle = fillColor;
        ctx.fill();

        ctx.shadowBlur = 0;
        ctx.strokeStyle = strokeColor;
        ctx.lineWidth = Math.max(1, radius / 9);
        ctx.stroke();

        if (selectedAgent === agent.id) {
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.85)';
          ctx.lineWidth = 2;
          ctx.setLineDash([4, 4]);
          ctx.beginPath();
          ctx.arc(pos.x, pos.y, radius + 5, 0, Math.PI * 2);
          ctx.stroke();
          ctx.setLineDash([]);
        }

        if (radius > 22) {
          ctx.fillStyle = 'rgba(26, 19, 5, 0.92)';
          ctx.font = `600 ${Math.min(13, radius / 2.2)}px 'IBM Plex Mono', monospace`;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(`$${Math.round(agent.wealth).toLocaleString()}`, pos.x, pos.y);
        }
      });

      // compact legend
      const lx = 18;
      const ly = height - 64;
      const items = [
        { label: 'Oligarch', color: 'rgba(232, 184, 75, 0.95)' },
        { label: 'Working', color: 'rgba(140, 147, 166, 0.85)' },
        { label: 'Ruined', color: 'rgba(224, 85, 107, 0.7)' },
      ];
      items.forEach((item, i) => {
        ctx.beginPath();
        ctx.arc(lx, ly + i * 18, 5, 0, Math.PI * 2);
        ctx.fillStyle = item.color;
        ctx.fill();
        ctx.fillStyle = 'rgba(236, 230, 218, 0.7)';
        ctx.font = "11px 'IBM Plex Mono', monospace";
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';
        ctx.fillText(item.label, lx + 13, ly + i * 18);
      });
    };

    render();
    const interval = setInterval(render, 1000 / 60);
    return () => clearInterval(interval);
  }, [agents, running, width, height, selectedAgent]);

  const handleClick = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const scaleX = width / rect.width;
    const scaleY = height / rect.height;
    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;
    const positions = agentPositionsRef.current;
    const avgWealth = agents.reduce((sum, a) => sum + a.wealth, 0) / agents.length || 1;
    for (const agent of agents) {
      const pos = positions.get(agent.id);
      if (!pos) continue;
      const radius = Math.max(2.5, Math.sqrt(agent.wealth / avgWealth) * 12);
      const dist = Math.sqrt((x - pos.x) ** 2 + (y - pos.y) ** 2);
      if (dist <= radius + 3) {
        setSelectedAgent(selectedAgent === agent.id ? null : agent.id);
        return;
      }
    }
    setSelectedAgent(null);
  };

  const selectedAgentData = selectedAgent !== null ? agents.find((a) => a.id === selectedAgent) : null;

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <canvas
        ref={canvasRef}
        onClick={handleClick}
        style={{ width: '100%', height: '100%', display: 'block', cursor: 'pointer' }}
      />
      {selectedAgentData && (
        <div
          style={{
            position: 'absolute', top: 14, left: 14,
            background: 'rgba(11,10,13,0.78)', backdropFilter: 'blur(8px)',
            border: '1px solid rgba(232,184,75,0.25)', borderRadius: 10, padding: '0.6rem 0.85rem',
            fontFamily: "'IBM Plex Mono', monospace", color: '#ece6da',
          }}
        >
          <div style={{ fontSize: '0.58rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: '#6f6a61' }}>
            Agent #{selectedAgentData.id}
          </div>
          <div style={{ fontSize: '1.35rem', fontWeight: 600, color: '#e8b84b', marginTop: 2 }}>
            ${selectedAgentData.wealth.toFixed(2)}
          </div>
        </div>
      )}
    </div>
  );
};

export default BubbleVisualizer;
