# Show and Tell

An interactive collection of system simulations that demonstrate how complex systems evolve at scale. Watch mathematical models come to life, adjust parameters, and explore the emergent behaviors that shape our world.

## What is This?

Show and Tell is a web-based platform for interactive mathematical and social simulations. Each simulation allows you to:

- **Visualize** complex systems in real-time
- **Manipulate** input parameters and initial conditions
- **Observe** how small changes cascade into large-scale effects
- **Understand** the mathematical principles behind real-world phenomena

## Current Simulations

### Yard Sale Model (Oligarchy Simulation)
The Yard Sale Model demonstrates how wealth inequality emerges naturally from fair transactions. Even when every trade is perfectly fair, mathematical destiny leads to oligarchy. This simulation lets you:
- Adjust initial wealth distribution
- Change transaction rules
- Observe wealth concentration over time
- Understand why inequality is mathematically inevitable without redistribution

**Status**: In development

## Planned Simulations

More interactive models exploring systems at scale are in the works. Each will reveal how individual behaviors combine to create unexpected collective outcomes.

## Project Structure

This repository is organized with each simulation as an independent project:

```
show-and-tell/
├── simulations/          # Individual simulation projects
│   ├── oligarchy/        # Yard Sale Model / Oligarchy simulation
│   │   ├── src/          # Source code
│   │   ├── assets/       # Images, data files
│   │   ├── README.md     # Simulation-specific documentation
│   │   └── package.json  # Dependencies (if needed)
│   └── [future-sim]/     # Future simulations follow same structure
├── shared/               # Shared utilities and components
│   ├── ui/               # Common UI components
│   ├── math/             # Mathematical utilities
│   └── visualization/    # Shared visualization tools
├── web/                  # Main web application
│   ├── public/           # Static assets
│   ├── src/              # Application code
│   │   ├── pages/        # Page components
│   │   ├── components/   # UI components
│   │   └── router/       # Navigation
│   └── package.json
└── docs/                 # Documentation
    ├── architecture.md   # System design
    └── adding-simulations.md  # Guide for new simulations
```

## Technology Stack

- **Frontend**: Modern web technologies for interactive visualizations
- **Visualization**: Canvas/WebGL for performant rendering
- **Math Engine**: Efficient numerical computing for real-time simulations
- **Architecture**: Modular design allowing independent simulation development

## Getting Started

```bash
# Clone the repository
git clone https://github.com/yourusername/show-and-tell.git
cd show-and-tell

# Install dependencies
npm install

# Run the development server
npm run dev
```

## Contributing

Interested in adding a simulation? Each simulation is an independent project that plugs into the main application. See [docs/adding-simulations.md](docs/adding-simulations.md) for guidelines.

## Philosophy

Complex systems surround us, but their behaviors often seem mysterious. By making these systems interactive and visual, we can build intuition about:
- Emergence and self-organization
- Feedback loops and tipping points
- The gap between individual intentions and collective outcomes
- Why certain patterns appear inevitable

Mathematics reveals truths about our world. These simulations make those truths tangible.

## License

MIT License - See LICENSE file for details

## Acknowledgments

Inspired by the work of researchers who use mathematical models to illuminate social, economic, and natural phenomena.
