# What Actually Creates Prosperity and Innovation?

## Findings from a 5,000-Scenario Economic Simulation

---

## Executive Summary

We built a systems dynamics simulation with 20 tunable institutional/economic parameters, grounded in empirical elasticities from IMF, OECD, and academic research where available. We ran 5,000 configurations using Latin Hypercube Sampling across the full parameter space, averaging each over 3 random seeds (15,000 total simulation runs), plus 30-seed runs for three real-world presets (US-like, Nordic-like, East Asian-like).

**The model's answer:** The configurations that produce the highest combined prosperity and innovation look nothing like any single real-world model. But they borrow most heavily from the Nordic playbook — with some important departures. The biggest levers aren't where most political debates focus.

---

## The Two Biggest Surprises

### 1. The biggest lever is boring: Banking regulation

Banking regulation had the strongest positive correlation with overall outcomes (r = +0.476, p < 0.001). This wasn't about growth specifically — it was about *resilience*. Well-regulated financial systems dramatically reduce crisis frequency, which compounds over 50 years into enormous differences in cumulative prosperity. The optimal range was 0.60–0.79 (moderately-to-firmly regulated), not either extreme.

This makes intuitive sense but rarely dominates political discourse about prosperity. Financial crises are catastrophic for median wealth, innovation continuity, and human capital — and they're largely preventable through regulation.

### 2. Market size matters enormously — and it's not policy

Market size was the single strongest correlate of composite outcomes (r = +0.486). Larger markets support more specialization, more recombination of ideas, and larger returns to innovation. This is a structural advantage, not a policy lever — but it means that small economies pursuing innovation-led growth face a genuine handicap that policy must compensate for (the Nordics compensate through deep trade integration and excellent institutions).

---

## The Full Parameter Ranking

Listed in order of impact on composite prosperity + innovation score:

| Rank | Parameter | Correlation | Direction |
|------|-----------|-------------|-----------|
| 1 | Market Size | +0.486 | Larger → better |
| 2 | Banking Regulation | +0.476 | More regulated → better |
| 3 | Healthcare Coverage | +0.285 | More coverage → better |
| 4 | Education Funding | +0.169 | More investment → better |
| 5 | Income Tax Rate | +0.163 | Higher → better (!) |
| 6 | Starting Inequality | -0.162 | Lower → better |
| 7 | Wealth Tax Rate | +0.125 | Higher → better |
| 8 | Immigration Openness | +0.087 | More open → better |
| 9 | Capital Gains Tax | +0.071 | Higher → better |
| 10 | Regulatory Burden | -0.054 | Less → better |
| 11 | Reserve Currency | -0.049 | Less → better (!) |
| 12 | Unemployment Insurance | +0.045 | More generous → better |
| 13 | Worker Mobility | +0.043 | More mobile → better |
| 14 | Corporate Tax Rate | +0.039 | Higher → slightly better |
| 15 | Startup Ease | +0.031 | Easier → slightly better |
| 16 | Labor Flexibility | +0.029 | More flexible → slightly better |
| 17 | IP Protection | +0.026 | Not significant |
| 18 | Public R&D Investment | +0.026 | Not significant at aggregate level |
| 19 | Unionization | -0.015 | Not significant |
| 20 | VC Availability | +0.012 | Not significant |

### What's interesting about this ranking:

**The top 6 levers are all about foundational institutional quality** — financial stability, healthcare, education, and inequality management. They're not about "getting government out of the way" or about any specific market intervention. They're about creating the conditions under which markets function well.

**Tax rates have POSITIVE correlations with outcomes.** This does NOT mean "higher taxes = better" in isolation. It means that in the model, higher tax rates fund the public goods (healthcare, education, safety nets) that produce the strongest growth effects. The causal chain is: taxes → revenue → public goods → human capital → growth + innovation. The model captures the IMF's key finding: redistribution that reduces inequality is generally good for growth, and the tax cost of funding it is more than offset by the benefits.

**Several "hot-button" policy variables barely matter:** VC availability, IP protection strength, unionization rate, and public R&D investment all had correlations below 0.03 — statistically insignificant at the aggregate level. This doesn't mean they're unimportant in reality; it means their effect is swamped by the larger structural factors when you look across thousands of configurations.

**Reserve currency status has a *negative* correlation.** This is counterintuitive. The model suggests that cheap capital inflows can fuel asset bubbles and reduce the urgency of institutional improvement. The "exorbitant privilege" may actually be a soft curse when combined with insufficient financial regulation.

---

## The Preset Comparison

### Composite Scores
- **Nordic-like: 0.631** (highest)
- **East Asian-like: 0.544**
- **US-like: 0.519** (lowest)

### Where Each Model Wins and Loses

**US-like model** scores highest on raw innovation output (223 annual patents vs. Nordic's 100) thanks to its enormous market, deep VC ecosystem, and high immigration openness. But it loses badly on median wealth ($90k vs. Nordic's $153k), resilience (0.393 vs. Nordic's 0.534), and final inequality (0.604 vs. Nordic's 0.150). The US model produces the most innovation but distributes its benefits the most narrowly — and its high inequality eventually feeds back to reduce the very mobility and human capital that drive innovation.

**Nordic-like model** wins on composite score, median wealth, resilience, AND long-run growth (2.29% vs. US 2.05%). Its weakness is raw innovation output, constrained by small market size. The "flexicurity" combination of labor flexibility + strong safety nets + high education spending creates a self-reinforcing cycle: low inequality → high human capital → broad-based growth → institutional quality → sustained prosperity.

**East Asian-like model** sits in between, with very high public R&D investment partially compensating for smaller markets and lower immigration openness. It demonstrates that directed state investment in R&D and education can partially substitute for market size and immigration — but at a lower ceiling than the Nordic model's broader institutional approach.

### The Critical Insight

The US model's innovation advantage does NOT translate to the highest prosperity. Innovation without broad distribution creates inequality that eventually undermines the innovation engine itself. The model's feedback loops — inequality → reduced mobility → reduced human capital → reduced innovation → slower growth — are powerful over 50-year horizons.

---

## What the Optimal Configuration Looks Like

The median parameters from the top 100 configurations (composite score > 0.72):

| Parameter | Optimal Median | US-like | Nordic-like |
|-----------|---------------|---------|-------------|
| Income Tax Rate | 0.393 | 0.24 | 0.45 |
| Healthcare Coverage | 0.812 | 0.55 | 0.95 |
| Education Funding | 0.060 | 0.05 | 0.07 |
| Banking Regulation | 0.733 | 0.40 | 0.60 |
| Immigration Openness | 0.610 | 0.65 | 0.55 |
| Labor Flexibility | 0.643 | 0.75 | 0.70 |
| Unionization | 0.321 | 0.10 | 0.65 |
| VC Availability | 0.523 | 0.85 | 0.45 |
| Public R&D | 0.030 | 0.03 | 0.035 |
| Startup Ease | 0.568 | 0.75 | 0.80 |
| Regulatory Burden | 0.338 | 0.45 | 0.35 |
| Wealth Tax | 0.015 | 0.00 | 0.01 |

**The optimal configuration is a hybrid** that takes Nordic-level healthcare and banking regulation, US-level immigration openness and market engagement, moderate taxation (between US and Nordic), moderate unionization (between US and Nordic), and firm financial regulation. It's not a political platform — it's a data-driven composite.

---

## Sensitivity Analysis: Which Parameters are the Biggest Levers?

Breaking down by specific outcome metric reveals important tensions:

**For long-run growth:** Market size (+0.49), banking regulation (+0.47), healthcare (+0.24), and education (+0.17) dominate. Tax rates are moderately positive.

**For innovation:** Market size (+0.52) dominates even more strongly, followed by banking regulation (+0.36), immigration (+0.17), and healthcare (+0.16).

**For median wealth:** Banking regulation (+0.48), market size (+0.39), healthcare (+0.30), income tax (+0.27), and education (+0.16). Higher taxes correlate with higher median wealth because of the redistribution channel.

**For resilience:** Banking regulation (+0.59) dominates overwhelmingly, followed by market size (+0.26). Nothing else comes close. Resilience is primarily about avoiding financial crises.

**For sustainability:** Starting inequality (-0.18) matters most — economies that begin with lower inequality sustain growth longer. Healthcare (+0.13) and education (+0.12) also matter through human capital channels.

---

## Key Feedback Loops the Model Reveals

### The Virtuous Cycle (found in top configurations)
Strong public goods (healthcare, education) → high human capital → innovation + productivity growth → tax revenue → more public goods → low inequality → social mobility → more human capital

### The Vicious Cycle (found in bottom configurations)
Low public investment → inequality → reduced mobility → lower human capital → less innovation → less growth → less revenue → less public investment → more inequality

### The Financial Stability Multiplier
Good banking regulation → fewer crises → compound growth preserved → higher long-run outcomes. A single financial crisis can erase 5-10 years of growth; avoiding them is one of the highest-value policy interventions.

### The Innovation Paradox
High innovation doesn't guarantee high prosperity. The US-like configuration produces more raw innovation than any other preset, but its weak redistribution mechanisms mean the gains concentrate, which feeds back to reduce the growth trajectory. The model suggests you don't need to maximize raw innovation — you need to maximize *broadly distributed innovation-driven growth*.

---

## Honest Limitations

This model is a model, not reality. Here are its most important limitations:

1. **Simplified dynamics.** Real economies have thousands of interacting agents, sectors, and feedback loops. This model captures ~30 key relationships. Important dynamics like trade, geopolitics, cultural factors, and technological disruption waves are not modeled.

2. **Parameter independence.** In reality, many parameters are correlated (high education spending tends to come with high healthcare spending). The sweep treats them as independent, which can produce unrealistic combinations.

3. **Elasticity uncertainty.** Even where we used empirical estimates (IMF redistribution-growth findings, Kerr immigration-innovation estimates, Mazzucato R&D multipliers), these estimates have confidence intervals. Different elasticity assumptions could shift results.

4. **No international trade or competition.** Real economies compete for talent, capital, and markets. The model treats each economy in isolation.

5. **Structural breaks.** The model assumes relationships are stable over 50 years. In reality, AI, climate change, demographic shifts, and other structural breaks could change the fundamental relationships.

6. **Market size is exogenous.** In reality, market size is partly a policy outcome (trade policy, immigration policy). The model treats it as fixed, which may overstate its importance.

7. **Composite score weighting.** The relative weights in the composite score (20% growth, 20% innovation, 25% median wealth, 15% resilience, 10% sustainability, 10% GDP level) reflect judgments about what matters. Different weights would produce different "optimal" configurations.

8. **No political economy.** The model doesn't capture the fact that some configurations are politically easier to sustain than others. A policy mix that's economically optimal may be politically impossible.

---

## What This Means (Carefully)

The model consistently finds that **foundational institutional quality** — financial stability, healthcare, education, and mechanisms that prevent extreme inequality — matters more than any specific market intervention. The economy that invests in its people and protects them from catastrophic risk grows faster, innovates more broadly, and sustains prosperity longer than the economy that maximizes market freedom but underinvests in public goods.

This is not a left-wing or right-wing finding. It's an empirically-grounded systems finding that the IMF, OECD, and decades of development economics research have converged on from different directions. The model re-derived it from first principles.

The most actionable finding: **the highest-leverage, lowest-controversy policy lever is financial regulation.** It doesn't require choosing sides on tax policy, immigration, or labor markets. It just requires building a financial system that doesn't periodically destroy a decade of growth.

---

## Technical Notes

- **Model type:** Systems dynamics with stochastic shocks
- **Simulation length:** 50 years per run
- **Parameter space:** 20 dimensions
- **Total configurations tested:** 5,000 (Latin Hypercube Sampling)
- **Seeds per configuration:** 3 (sweep), 30 (presets)
- **Total simulation runs:** 15,090
- **Optimization target:** Composite score weighting growth, innovation, median wealth, resilience, sustainability
- **Key empirical sources:** IMF (2014) on redistribution/growth, Kerr & Lincoln (2010) on immigration/innovation, Mazzucato (2013) on public R&D multipliers, Chetty et al. (2014) on inequality/mobility, OECD Employment Outlook on labor markets
