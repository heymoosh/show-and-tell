# Architecture

## Overview

Show and Tell is built as a modular platform where each simulation is an independent project that plugs into a shared web application.

## Design Principles

1. **Simulation Independence**: Each simulation can be developed, tested, and run independently
2. **Shared Infrastructure**: Common UI components and utilities are shared to avoid duplication
3. **Progressive Enhancement**: Simulations can start simple and add complexity over time
4. **Performance First**: Simulations handle thousands of iterations per second with efficient rendering

## Directory Structure

```
show-and-tell/
├── simulations/          # Independent simulation projects
├── shared/               # Shared code library
├── web/                  # Main web application
└── docs/                 # Documentation
```

## Component Architecture

### Simulations

Each simulation exports a standard interface:

```typescript
interface Simulation {
  name: string;
  description: string;
  init(container: HTMLElement, config: SimConfig): void;
  start(): void;
  pause(): void;
  reset(): void;
  updateParams(params: Record<string, any>): void;
  destroy(): void;
}
```

This allows the main web app to:
- Load simulations dynamically
- Provide consistent controls (play/pause/reset)
- Handle routing and navigation
- Display simulation metadata

### Shared Library

The `shared/` directory contains:

**UI Components** (`shared/ui/`)
- Sliders with real-time value display
- Play/pause/reset controls
- Parameter panels
- Graph components
- Export/screenshot utilities

**Math Utilities** (`shared/math/`)
- Random number generators (seeded)
- Statistical functions (mean, variance, Gini coefficient)
- Distribution generators
- Numerical integration helpers

**Visualization Tools** (`shared/visualization/`)
- Canvas rendering helpers
- Color scheme generators
- Animation loop management
- Performance monitoring

### Web Application

The main web app (`web/`) is a thin shell that:
- Displays a homepage with simulation gallery
- Routes to individual simulations
- Loads simulation modules on demand
- Provides consistent navigation and branding

## Data Flow

1. User selects a simulation from the homepage
2. Router loads the simulation module
3. Simulation initializes with default parameters
4. User adjusts parameters via shared UI components
5. Simulation updates its state and re-renders
6. Performance metrics and export options are always available

## Performance Considerations

- **Canvas Rendering**: Use HTML5 Canvas for high-performance graphics
- **Web Workers**: Offload heavy computation to background threads
- **RequestAnimationFrame**: Smooth 60fps animations
- **Lazy Loading**: Only load simulation code when needed
- **Efficient State Updates**: Minimize redraws and recalculations

## Technology Stack

- **Language**: TypeScript for type safety
- **Build Tool**: Vite for fast development and optimized builds
- **Framework**: React for UI (optional per simulation)
- **Visualization**: Canvas API, potentially D3.js for complex visualizations
- **State Management**: Local state per simulation, shared context for app-level state

## Adding New Simulations

See [adding-simulations.md](adding-simulations.md) for a step-by-step guide.

## Future Enhancements

- WebGL for 3D simulations
- WebAssembly for computationally intensive models
- Real-time collaboration features
- Simulation result sharing and permalinks
- Mobile-optimized touch controls
