# Show and Tell - Product Requirements Document

## Vision

**Show and Tell** is an interactive web platform that brings mathematical and social simulations to life. It transforms abstract academic models into visceral, tangible experiences that build intuition about how complex systems work.

The platform embodies the philosophy: **"Intuition through visualization, rigor through interaction."**

## Problem Statement

Complex systems models (wealth distribution, segregation, epidemics, traffic dynamics) are typically locked away in academic papers and static visualizations. These models reveal profound truths about our world, but most people never experience them firsthand.

**Show and Tell** bridges this gap by:
- Making abstract mathematics *feel* real through interactive visualization
- Allowing users to manipulate parameters and observe emergent behavior
- Providing progressive depth: from play → analysis → theory

## Target Users

1. **Curious Learners** - People who want to understand "why things are the way they are"
2. **Educators** - Teachers looking for interactive tools to demonstrate complex concepts
3. **Students** - Those studying economics, sociology, epidemiology, or complex systems
4. **Researchers** - Academics who want to share their models with broader audiences

---

## Quick Start

### Running the Application

```bash
npm run dev      # Start dev server (http://localhost:3000)
npm test         # Run Playwright tests
npm run build    # Build for production
```

### Using the Playground Tab (Default View)

1. **Press the Play button** (blue circle) to start the simulation
2. **Watch the bubbles**:
   - Large gold circles = Oligarchs (wealthy agents)
   - Medium blue circles = Middle class
   - Tiny gray dots = The poor

3. **Observe the magic**:
   - Even though every trade is a fair 50/50 coin flip
   - Wealth concentrates dramatically
   - The "Agar.io effect" makes it visceral

4. **Try the controls**:
   - **Speed slider**: Faster/slower simulation
   - **Reset button**: Start fresh
   - **Population Size**: Change how many agents (10-500)
   - **Transfer Rate**: How risky each trade is (5%-50%)

5. **Click on bubbles** to see individual agent details

### Using the Data Analysis Tab

Click "Data Analysis" to see comprehensive statistical tools:
- Wealth distribution over time
- Gini coefficient tracking
- Early luck correlation analysis
- Survival curves
- Full hypothesis testing suite

### Using the Theory Tab

Click "Theory" to learn:
- The mathematics behind the Yard Sale Model
- Why oligarchy is mathematically inevitable
- The concept of the "absorbing barrier"
- Real-world implications

### What to Look For

**In the Playground:**
1. **Initial State**: All bubbles roughly same size
2. **After 100 rounds**: Clear separation emerging
3. **After 500 rounds**: A few massive bubbles, many tiny specks
4. **After 2000 rounds**: Extreme concentration, most agents ruined

**Key Metrics (Bottom Right):**
- **Top 1% Share**: Watch it climb from 1% to 20%+
- **Wealth Gap**: See the ratio explode (1x → 1000x+)
- **Active Agents**: Watch as agents get ruined (wealth < $1)

### Experiments to Try

1. **The Transfer Rate Effect**
   - Set to 5%: Slow, gradual concentration
   - Set to 50%: Rapid, brutal inequality
   - Question: Does the *speed* of concentration change the *final* outcome?

2. **Population Size**
   - 10 agents: Easy to track individuals
   - 500 agents: Statistical patterns more clear
   - Question: Does oligarchy emerge at all scales?

3. **Early Luck**
   - Reset and run 100 rounds
   - Note the top 3 agents
   - Let it run to 5000 rounds
   - Question: Are the early winners still on top?

4. **The Absorbing Barrier**
   - Watch the "Active Agents" counter
   - Once an agent hits $0, they're done
   - Question: Is poverty a one-way door?

---

## Core Experience

### The "Workbench" Landing Page

The entry point is designed as a **physical workbench** where simulations are displayed as framed "portals" sitting on a shared wooden desk surface.

#### The Metaphor

A workbench is a single surface where a creator spreads out their tools. The simulations are different projects sitting on *your* desk waiting to be picked up. This creates:
- **Visual continuity** - One continuous desk anchors all content
- **Comparability** - Side-by-side viewing makes it easy to scan and choose
- **Warmth** - Desk clutter (coffee, pens, papers) frames the content organically

#### Layout Strategy

| Viewport | Layout | Behavior |
|----------|--------|----------|
| **Desktop** | Side-by-side (Flexbox row) | Three portals horizontally, props in corners |
| **Mobile** | Vertical stack (Flexbox column) | Portals stacked, props between portals |

### The "Portal" Component

Each simulation is presented as a **decorative frame with a transparent center** overlaid on the wooden desk background. The frame acts as a "portal" or "doorway" into that simulation.

#### Portal Structure

```
┌─────────────────────────────────────┐
│         Decorative Frame            │  ← Frame image (transparent center)
│    ┌───────────────────────┐        │
│    │                       │        │
│    │    Illustration       │        │  ← Themed artwork inside frame
│    │                       │        │
│    │    ─────────────      │        │
│    │    TITLE              │        │  ← Bold headline text
│    │    Subtitle           │        │  ← Subdued subtitle
│    │                       │        │
│    └───────────────────────┘        │
│                                     │
└─────────────────────────────────────┘
```

#### Frame Styles (Three Distinct Looks)

| Simulation | Frame Style | Description |
|------------|-------------|-------------|
| **The Yard Sale** | Ornate dark baroque/Victorian | Heavy, gilded picture frame with decorative corners - suggests "old money" and established wealth |
| **Polygons** | Clean silver octagonal | Modern, chrome-like beveled frame - geometric to match the hexagon theme |
| **Outbreak** | White rounded arch | Decorative arch frame with folk-art elements - organic shape suggesting biological/viral spread |

#### Portal Interactions

| State | Visual Treatment |
|-------|------------------|
| **Rest** | Normal opacity, subtle shadow from frame |
| **Hover** | Slight scale (1.02-1.05x), deeper shadow, optional soft glow effect |
| **Focus** | Other portals fade slightly (opacity 0.6-0.8), drawing focus to active choice |
| **Click** | Navigate to simulation |

### Desk Background & Props

The shared desk surface creates the "workbench" metaphor:

#### Background Layer
- **Asset**: Seamless light wood texture (`wood-texture.png`)
- **CSS**: `background-size: cover`, `background-position: center`
- **Coverage**: Full section/viewport width

#### Decorative Props (Absolutely Positioned)

Props are placed using `position: absolute` over the desk, creating visual interest without interfering with the portal layout:

| Prop | Position (Desktop) | Position (Mobile) | Animation |
|------|-------------------|-------------------|-----------|
| **Coffee cup** | Top-right corner | Bottom of page | Subtle steam animation (optional) |
| **Pen/Pencil** | Between portals or bottom-left | Between portal 1 and 2 | Rotate 5° on hover |
| **Notebook/Sketchbook** | Corner accent | Hidden or scaled down | None |
| **Paper clips** | Scattered near edges | Hidden | None |
| **Crumpled paper** | Accent near portals | Hidden | None |
| **Succulent/Plant** | Top corners | Hidden | None |

### Content Inside Portals

Each portal contains themed illustration artwork plus text:

| Simulation | Illustration Theme | Colors |
|------------|-------------------|--------|
| **The Yard Sale** | Money bags, houses, coins, treasure chest | Gold, brown, sage green |
| **Polygons** | Hexagonal mandala pattern, geometric tessellation | Blue, gold, cream |
| **Outbreak** | Virus particles, folk-art people figures, spreading pattern | Red, navy, cream |

#### Typography Inside Portals

| Element | Style | Example |
|---------|-------|---------|
| **Title** | Heavy bold sans-serif (Impact/Oswald/Anton), uppercase | "THE YARD SALE" |
| **Subtitle** | Condensed sans-serif, smaller, muted color | "WEALTH CONCENTRATION" |

---

## Current Simulations

### 1. The Yard Sale (Oligarchy) - **Ready**

**Model**: Yard Sale / Affine Wealth Model
**Key Insight**: Perfectly fair trades mathematically guarantee oligarchy

**Features**:
- Bubble visualization where size = wealth
- Real-time 60 FPS physics simulation
- Color-coded wealth tiers (Gold/Blue/Gray)
- Interactive agent selection
- Live metrics (Top 1% share, Wealth Gap, Active Agents)
- Parameter controls (Population, Transfer Rate, Initial Wealth)
- Three tabs: Playground, Data Analysis, Theory

#### Bubble Visualizer

- Agents rendered as bubbles where size = wealth (√wealth scaling)
- Real-time physics simulation with bouncing and gentle movement
- Color-coded by wealth tier:
  - **Gold** = Oligarchs (top 50% of max wealth)
  - **Blue** = Middle class
  - **Gray** = Poor
- Interactive: Click agents to see details
- Smooth 60 FPS canvas rendering
- Dynamic glow effects for wealthy agents

#### Three-Tab Interface

**Playground Tab** (Default)
- Bubble visualization front and center
- Overlay controls (Play/Pause/Reset/Speed)
- Live metrics cards with sparklines
- Parameter controls sidebar
- Live leaderboard (top 10 agents)
- Instructional "What am I looking at?" info box

**Data Analysis Tab**
- Comprehensive analytical tools (2000+ lines)
- Wealth distribution histograms
- Gini coefficient tracking
- Early luck correlation analysis
- Survival curves
- Agent trajectory tracking

**Theory Tab**
- The Yard Sale Model mathematics
- Why oligarchy is inevitable
- The absorbing barrier concept
- Real-world implications
- Academic references

#### Simulation Engine
- Fair 50/50 coin flip trades
- Bet % of poorer agent's wealth
- Configurable parameters
- Efficient batch processing
- Real-time statistics calculation
- Wealth history tracking

### 2. Polygons (Segregation) - **Coming Soon**

**Model**: Schelling's Segregation Model
**Key Insight**: Slight preferences for similar neighbors create total segregation

### 3. Outbreak (Epidemic) - **Planned**

**Model**: SIR Dynamics
**Key Insight**: Contagion thresholds and herd immunity mathematics

### 4. Ghost Jams (Traffic) - **Planned**

**Model**: Traffic Flow Emergence
**Key Insight**: Why traffic stops for no reason (backward-propagating waves)

---

## Technical Architecture

### Stack

- **React 18** - UI framework
- **Vite** - Build tool with fast HMR
- **Tailwind CSS** - Utility-first styling
- **Radix UI** - Unstyled, accessible component primitives
- **Framer Motion** - Animation library (pairs with Radix UI)
- **Recharts** - Data visualization
- **Lucide React** - Icon library
- **Canvas API** - High-performance rendering
- **Playwright** - End-to-end testing

### Project Structure

```
show-and-tell/
├── web/
│   └── src/
│       ├── App.jsx                    # Root with navigation state
│       ├── main.jsx                   # Entry point
│       ├── index.css                  # Tailwind + custom styles
│       └── components/
│           └── WorkbenchLanding.jsx   # Landing page
├── simulations/
│   └── oligarchy/
│       └── src/
│           ├── YardSalePage.jsx       # Main simulation page
│           ├── BubbleVisualizer.jsx   # Canvas visualization
│           └── YardSaleSimulation.jsx # Analytics component
├── tests/
│   ├── oligarchy.spec.js              # Simulation tests
│   └── landing.spec.js                # Landing page tests
└── docs/
```

### Test Coverage

All 22 Playwright tests passing. Tests cover:
- Application loading
- Tab navigation
- Play/Pause/Reset controls
- Simulation execution
- Parameter adjustment
- Canvas rendering
- Metrics display
- State persistence across tabs
- Wealth concentration verification

---

## Component Architecture & Animation

### Layered Composition Approach

The landing page uses a **layered composition** with transparent frame overlays on a shared background. This creates the "portal on a desk" effect where each simulation appears as a framed piece sitting on a wooden workbench.

#### Layer Stack (Bottom to Top)

| Layer | Asset Type | Purpose |
|-------|------------|---------|
| **1. Background** | `wood-texture.png` | Seamless wood desk surface |
| **2. Props** | Transparent PNGs | Desk items (coffee, pen, notebook, clips) |
| **3. Portal Content** | React Components | Illustration + text inside each frame |
| **4. Frame Overlay** | Transparent PNGs | Decorative frames with transparent centers |

#### Required Assets

**Background:**
- `wood-texture.png` - High-res seamless light wood texture (clean, no objects)

**Decorative Frames (Transparent Centers):**
- `frame-baroque.png` - Ornate dark Victorian frame for "The Yard Sale"
- `frame-octagon.png` - Silver/chrome octagonal frame for "Polygons"
- `frame-arch.png` - White rounded arch frame for "Outbreak"

**Illustrations (Inside Frames):**
- `illustration-yard-sale.png` - Money bags, houses, coins, treasure chest
- `illustration-polygons.png` - Hexagonal mandala/tessellation pattern
- `illustration-outbreak.png` - Virus particles with folk-art people

**Props (Isolated with Transparency):**
- `pen.png` - Silver/black mechanical pencil
- `coffee-cup.png` - White coffee mug, top-down view
- `notebook.png` - Wire-bound sketchbook
- `paper-clips.png` - Scattered paper clips
- `crumpled-paper.png` - Wadded paper balls
- `succulent.png` - Small desk plant

> **Status**: Gemini is generating the transparent frame assets. Illustrations and props to follow.

### SimulationPortal Component

The portal is implemented as a reusable React component. The frame is an image overlay; the content (illustration + text) sits inside.

```jsx
<SimulationPortal
  frameImage="/frames/frame-baroque.png"
  illustration="/illustrations/yard-sale.png"
  title="THE YARD SALE"
  subtitle="WEALTH CONCENTRATION"
  href="/simulations/yard-sale"
  status="ready"
/>
```

#### Component Structure

```jsx
<div className="portal-container relative">
  {/* Content Layer (behind frame) */}
  <div className="portal-content absolute inset-0 flex flex-col items-center">
    <img src={illustration} alt="" className="illustration" />
    <h2 className="title">{title}</h2>
    <p className="subtitle">{subtitle}</p>
  </div>

  {/* Frame Layer (on top, transparent center) */}
  <img src={frameImage} alt="" className="frame-overlay" />
</div>
```

#### CSS Implementation

```css
.portal-container {
  position: relative;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.portal-container:hover {
  transform: scale(1.03);
  box-shadow: 0 20px 40px rgba(0,0,0,0.3);
}

.frame-overlay {
  position: relative;
  z-index: 2;
  pointer-events: none; /* Allow clicks to pass through to content */
}

.portal-content {
  z-index: 1;
  /* Positioned to align with frame's transparent center */
}
```

### Workbench Layout Component

The parent container manages the desk background and positions all elements.

```jsx
<section className="workbench relative min-h-screen bg-cover bg-center"
         style={{ backgroundImage: "url('/wood-texture.png')" }}>

  {/* Decorative Props (Absolutely Positioned) */}
  <img src="/props/coffee-cup.png" className="absolute top-4 right-8" />
  <img src="/props/pen.png" className="absolute bottom-8 left-12" />

  {/* Portal Grid */}
  <div className="flex flex-col md:flex-row justify-center items-center gap-8 p-8">
    <SimulationPortal ... />
    <SimulationPortal ... />
    <SimulationPortal ... />
  </div>
</section>
```

### Animation Implementation

Props and portals are animated using **Framer Motion** (pairs well with Radix UI).

```jsx
// Pen hover animation
<motion.img
  src="/props/pen.png"
  whileHover={{ rotate: 5, y: -10 }}
  transition={{ type: "spring", stiffness: 300 }}
/>

// Portal focus effect (fade others)
const [hoveredPortal, setHoveredPortal] = useState(null);

<SimulationPortal
  style={{ opacity: hoveredPortal && hoveredPortal !== id ? 0.6 : 1 }}
  onMouseEnter={() => setHoveredPortal(id)}
  onMouseLeave={() => setHoveredPortal(null)}
/>
```

### Design Tokens

#### Color Palette

| Token | Value | Usage |
|-------|-------|-------|
| `bg-wood` | Wood texture image | Main background |
| `text-title` | Near-black `#1a1a1a` | Portal titles |
| `text-subtitle` | Muted brown `#5c4a3a` | Portal subtitles |
| `shadow-portal` | `rgba(0,0,0,0.2)` | Frame drop shadows |

#### Typography

| Type | Style | Usage |
|------|-------|-------|
| **Title** | Heavy bold sans-serif (Impact/Oswald/Anton), uppercase | "THE YARD SALE", "POLYGONS", "OUTBREAK" |
| **Subtitle** | Condensed sans-serif, all caps, letter-spaced | "WEALTH CONCENTRATION", "HEXAGON SIMULATION" |

### Radix UI Integration

- **AspectRatio**: Maintains frame proportions across screen sizes
- **Slot**: Enables flexible content composition inside portals
- **VisuallyHidden**: Accessible labels for screen readers

### Adding New Simulations

To add a new simulation portal:
1. Create or commission a new frame image (transparent center)
2. Create an illustration for the content area
3. Instantiate `SimulationPortal` with new props
4. The frame defines the visual style; code handles layout and interaction

**Assets needed per simulation:**
- 1x Frame image (transparent center PNG)
- 1x Illustration image
- Title and subtitle text

---

## Design Principles

### 1. Visceral First, Cerebral Second

Lead with visual impact. Let users *feel* wealth concentration before they understand it mathematically.

### 2. One-Click Chaos

Simulations should run immediately. No setup, no configuration required to see something interesting happen.

### 3. Progressive Disclosure

- **Level 1**: Watch the pretty bubbles
- **Level 2**: Adjust parameters, see effects
- **Level 3**: Dive into statistical analysis
- **Level 4**: Read the mathematical theory

### 4. The "Agar.io Effect"

Watching tiny agents shrink while oligarchs balloon creates emotional understanding that no chart can match.

### 5. Analog Warmth

The interface should feel like a physical workshop, not enterprise software. Warm colors, subtle textures, organic layouts.

---

## Implementation Details

### Bubble Physics
- Position based on stable hash of agent ID (consistent layout)
- Velocity-based movement with friction
- Wall collision detection
- Radius scales with √wealth (area ∝ wealth)
- Smooth animation loop using requestAnimationFrame

### Performance Optimizations
- Single canvas element (not DOM nodes per agent)
- Batch trade processing
- Throttled history updates (every 10 rounds)
- Limited history retention (last 100 data points)
- Efficient React.useMemo for statistics

### Key Features
1. **Performance**: 60 FPS visualization with up to 500 agents
2. **Accessibility**: Keyboard controls, ARIA labels, semantic HTML
3. **Responsive**: Works on desktop (mobile optimization pending)
4. **Tested**: Comprehensive test coverage
5. **Modular**: Easy to add new simulations following same pattern

---

## Educational Guide

### For Teaching
1. Start in Playground - build intuition
2. Let students play with parameters
3. Move to Theory - explain the math
4. Deep dive in Data Analysis - prove the hypothesis

### For Research
1. Start in Data Analysis - set up rigorous tests
2. Verify in Playground - visual sanity check
3. Reference Theory - connect to literature

### What Makes This Special

This implementation provides **both**:
- **Intuition**: See inequality emerge viscerally
- **Rigor**: Comprehensive statistical analysis

The Playground makes people *feel* the injustice. The Data Analysis makes them *understand* the mathematics.

---

## Success Metrics

1. **Engagement**: Users run simulations for >30 seconds
2. **Exploration**: Users adjust at least one parameter
3. **Depth**: Users visit the Theory/Analysis tabs
4. **Return visits**: Users come back to try different configurations
5. **Sharing**: Users share simulation URLs with others

---

## Future Enhancements

- [ ] Mobile responsive design
- [ ] WebGL for 1000+ agents
- [ ] Redistribution mechanisms (tax simulation)
- [ ] Agent collision physics
- [ ] Trade animation (lines between trading agents)
- [ ] Permalink sharing (save simulation state)
- [ ] Export data as CSV
- [ ] Multi-simulation comparison view
- [ ] Add new simulations (Segregation, Epidemics, Traffic)

---

## References

- **Yard Sale Model**: Bruce Hayes, Adrian Chakraborti - "Econophysics of Wealth Distributions"
- **Schelling Model**: Thomas Schelling - "Dynamic Models of Segregation" (1971)
- **SIR Model**: Kermack-McKendrick - Epidemic modeling foundations
- **Traffic Emergence**: Nagel-Schreckenberg model

---

*"Mathematics reveals truths about our world. These simulations make those truths tangible."*
