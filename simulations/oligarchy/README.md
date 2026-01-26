# Oligarchy Simulation (Yard Sale Model)

An interactive visualization of the Yard Sale Model, demonstrating how wealth inequality emerges from perfectly fair transactions.

## The Model

The Yard Sale Model shows that even when all transactions are fair, wealth naturally concentrates in the hands of a few. This isn't about greed or unfairness—it's pure mathematics.

### How It Works

1. Start with a population where everyone has equal wealth
2. Random pairs meet and engage in fair transactions
3. Each transaction involves a small percentage of the poorer person's wealth
4. The winner is determined randomly (50/50 odds)
5. Over time, wealth concentrates despite fair rules

### Key Insights

- **Mathematical Inevitability**: Oligarchy emerges from the math, not from cheating
- **Absorbing Barrier**: Once someone loses all wealth, they're out of the game
- **Redistribution Matters**: Only external intervention (like taxation) prevents total concentration

## Parameters

Users can adjust:
- Initial wealth distribution
- Transaction percentage
- Population size
- Redistribution rate (wealth tax)
- Number of transactions per timestep

## Visualization

The simulation displays:
- Real-time wealth distribution histogram
- Gini coefficient over time
- Individual agent trajectories (sample)
- Oligarch emergence timeline

## Implementation

- **Language**: JavaScript/TypeScript
- **Visualization**: Canvas for performance
- **UI Controls**: React components from shared/ui
- **Math Engine**: Custom simulation loop with configurable parameters

## References

- Yard Sale Model: Hayes, B. (2002). "Follow the Money". American Scientist.
- Wealth inequality dynamics in computational economics

## Running This Simulation

```bash
# From the simulation directory
cd simulations/oligarchy
npm install
npm run dev
```

Or run from the main web application at `/simulations/oligarchy`.
