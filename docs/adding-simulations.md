# Adding New Simulations

This guide walks through creating a new simulation for the Show and Tell platform.

## Quick Start

1. Create a new directory under `simulations/`
2. Follow the standard structure
3. Implement the simulation interface
4. Register it with the main web app

## Step-by-Step Guide

### 1. Create Directory Structure

```bash
cd simulations
mkdir my-simulation
cd my-simulation
mkdir src assets
touch README.md
```

Your simulation should have:
```
simulations/my-simulation/
├── src/              # Source code
├── assets/           # Images, data files, etc.
├── README.md         # Simulation documentation
└── package.json      # Dependencies (if needed)
```

### 2. Document Your Simulation

Create a `README.md` that explains:
- What the simulation demonstrates
- The underlying model or theory
- Adjustable parameters
- Key insights users should observe
- References/citations

### 3. Implement the Core Logic

Create your main simulation file (`src/index.ts` or `src/simulation.js`):

```typescript
export class MySimulation {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private animationId: number | null = null;
  private params: SimParams;

  constructor(container: HTMLElement, params: SimParams) {
    this.params = params;
    this.canvas = document.createElement('canvas');
    container.appendChild(this.canvas);
    this.ctx = this.canvas.getContext('2d')!;
    this.setupCanvas();
  }

  private setupCanvas() {
    // Set canvas dimensions
    // Initialize simulation state
  }

  start() {
    if (this.animationId === null) {
      this.animate();
    }
  }

  pause() {
    if (this.animationId !== null) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
  }

  reset() {
    this.pause();
    // Reset simulation state
    this.render();
  }

  updateParams(newParams: Partial<SimParams>) {
    this.params = { ...this.params, ...newParams };
    // Optionally reset or adjust simulation
  }

  private animate = () => {
    this.update();
    this.render();
    this.animationId = requestAnimationFrame(this.animate);
  }

  private update() {
    // Update simulation state
  }

  private render() {
    // Draw current state to canvas
  }

  destroy() {
    this.pause();
    this.canvas.remove();
  }
}
```

### 4. Define Parameters

Create a configuration interface for your simulation parameters:

```typescript
interface SimParams {
  populationSize: number;
  speed: number;
  // ... other adjustable parameters
}

export const defaultParams: SimParams = {
  populationSize: 100,
  speed: 1,
};
```

### 5. Create UI Controls

Use shared components for consistent UX:

```typescript
import { Slider, PlayPauseButton, ResetButton } from '../../../shared/ui';

export function MySimulationControls({
  params,
  onParamChange,
  onPlay,
  onPause,
  onReset
}) {
  return (
    <div className="controls">
      <PlayPauseButton onPlay={onPlay} onPause={onPause} />
      <ResetButton onClick={onReset} />

      <Slider
        label="Population Size"
        min={10}
        max={1000}
        value={params.populationSize}
        onChange={(val) => onParamChange('populationSize', val)}
      />

      {/* More controls... */}
    </div>
  );
}
```

### 6. Export Metadata

Create an export that describes your simulation:

```typescript
export const metadata = {
  id: 'my-simulation',
  name: 'My Simulation',
  description: 'A brief description of what this simulates',
  thumbnail: '/assets/my-simulation-thumb.png',
  tags: ['economics', 'emergence', 'networks'],
};
```

### 7. Register with Main App

Add your simulation to `web/src/simulations.ts`:

```typescript
import { metadata as mySimMetadata } from '../../simulations/my-simulation/src';

export const simulations = [
  // ... existing simulations
  mySimMetadata,
];
```

### 8. Create a Route

Add a route in `web/src/router/routes.tsx`:

```typescript
{
  path: '/simulations/my-simulation',
  component: lazy(() => import('../../simulations/my-simulation/src'))
}
```

## Best Practices

### Performance
- Use `requestAnimationFrame` for smooth animations
- Minimize canvas clears; only redraw what changed
- Consider Web Workers for heavy computation
- Profile with browser DevTools

### User Experience
- Provide good defaults that demonstrate the key insight
- Add tooltips explaining parameters
- Include a description of what users should observe
- Show relevant metrics (graphs, statistics)

### Code Quality
- Use TypeScript for type safety
- Write unit tests for simulation logic
- Comment complex algorithms
- Keep simulation logic separate from rendering

### Accessibility
- Provide keyboard controls (space to play/pause, R to reset)
- Use semantic HTML
- Include text descriptions of visualizations
- Ensure sufficient color contrast

## Testing Your Simulation

```bash
# Run in development mode
npm run dev

# Navigate to your simulation
# Test all parameters and edge cases
# Verify performance (should maintain 60fps)
```

## Example Simulations to Study

- **Oligarchy**: Complex state management, statistical visualization
- (More examples as they're added)

## Getting Help

- Check existing simulations for patterns
- Review the [architecture.md](architecture.md) for system design
- Open an issue on GitHub for questions

## Checklist

Before submitting a new simulation:

- [ ] README.md with clear explanation
- [ ] Standard directory structure
- [ ] Implements simulation interface
- [ ] Uses shared UI components where possible
- [ ] Performs well (60fps target)
- [ ] Registered with main app
- [ ] Tested across browsers
- [ ] Keyboard controls work
- [ ] Mobile-friendly (if applicable)
