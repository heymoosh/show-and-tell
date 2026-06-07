# Comparative Capitalism Models: A Methodologically Rigorous Assessment

## Evidence Strength, Endogeneity, and What Cross-Country Comparisons Can (and Cannot) Prove

---

**Author:** Muxin Li
**Date:** June 2026
**Version:** 2.0 — Academic revision with econometric grounding

---

## Abstract

This report evaluates five capitalism models — Anglo-American liberal market, Nordic social democratic, Rhine/Germanic coordinated market, East Asian developmental state, and Chinese state capitalism — against seven outcome metrics across twelve countries. Unlike the first version, this revision grounds every claim in specific academic literature, labels evidence by strength (causal, correlational, descriptive), addresses the endogeneity problem head-on, runs sensitivity analysis on the composite scoring, and preemptively engages counterarguments. The core finding survives scrutiny but with important caveats: Nordic and coordinated market economies consistently outperform Anglo-American liberal markets on composite well-being measures, but the causal attribution is weaker than simple cross-country comparisons suggest, because deep factors (social trust, ethnic composition, geography, historical culture) co-determine both model choice and outcomes.

---

## Table of Contents

1. [Methodology](#1-methodology)
2. [Taxonomy of Capitalism Models](#2-taxonomy-of-capitalism-models)
3. [Evidence Hierarchy: What We Know and How Well We Know It](#3-evidence-hierarchy)
4. [The Endogeneity Problem](#4-the-endogeneity-problem)
5. [Quantitative Analysis with Sensitivity Testing](#5-quantitative-analysis)
6. [Counterarguments and Threats to Validity](#6-counterarguments-and-threats-to-validity)
7. [Natural Experiments](#7-natural-experiments)
8. [US Post-War Structural Advantages](#8-us-post-war-structural-advantages)
9. [Limitations](#9-limitations)
10. [Conclusions](#10-conclusions)
11. [References](#11-references)

---

## 1. Methodology

### 1.1 Approach

This report synthesizes findings from peer-reviewed economics literature, IMF/OECD/World Bank working papers, and established datasets. It does **not** claim to produce novel causal estimates. Instead, it:

1. Catalogues existing evidence by strength (causal > correlational > descriptive)
2. Constructs a composite scorecard with explicit sensitivity analysis showing how results change under different assumptions
3. Identifies what cross-country comparisons can and cannot prove
4. Addresses endogeneity — the central methodological threat to all comparative capitalism research

### 1.2 Evidence Classification

Throughout this report, each major claim is tagged:

- **[CAUSAL]** — Based on instrumental variable, difference-in-differences, regression discontinuity, or natural experiment designs that credibly isolate causal effects
- **[CORRELATIONAL]** — Based on panel regressions with controls (e.g., System GMM) that reduce but do not eliminate endogeneity
- **[DESCRIPTIVE]** — Based on cross-sectional comparisons, case studies, or theoretical models without causal identification

### 1.3 Data Sources

Primary data: OECD Income Distribution Database (IDD, 2023 release), World Bank Development Indicators, Penn World Tables, IMF World Economic Outlook, WIPO Global Innovation Index, UN Human Development Index, World Happiness Report, Standardized World Income Inequality Database (SWIID).

### 1.4 What the Composite Scorecard Can and Cannot Prove

The scorecard is a **descriptive** tool. It documents how countries currently perform across metrics. It cannot prove that a capitalism model *causes* those outcomes, because:

- Countries were not randomly assigned to capitalism models
- The same deep factors (trust, culture, geography) may drive both model choice and outcomes
- Sample size (12 countries) precludes meaningful regression analysis at the model level

The scorecard is useful for: documenting current performance differences, testing whether conclusions are robust to weighting assumptions, and identifying which metrics drive overall rankings.

---

## 2. Taxonomy of Capitalism Models

### 2.1 Framework

The taxonomy draws on Hall & Soskice's *Varieties of Capitalism* (2001), which distinguishes Liberal Market Economies (LMEs) from Coordinated Market Economies (CMEs) based on how firms coordinate economic activity. We extend this binary to five types, following the broader comparative capitalism literature.

| Model | Countries Scored | Key Institutional Features |
|-------|-----------------|---------------------------|
| **Anglo-American (LME)** | US, UK | Fluid labor markets, general skills, equity finance, shareholder governance, arms-length contracting |
| **Nordic Social Democratic** | Sweden, Denmark, Finland | Coordinated wage bargaining, universal welfare, high trust, flexicurity, patient capital |
| **Rhine/Germanic (CME)** | Germany, Netherlands, Switzerland | Codetermination, vocational training, bank-based finance, stakeholder governance, employment protection |
| **East Asian Developmental** | Japan, South Korea, Singapore | State-directed industrial policy, export orientation, education investment, strategic trade |
| **Chinese State Capitalism** | China | State-owned enterprises, strategic planning, market mechanisms within party control, capital controls |

### 2.2 Framework Limitations

**[DESCRIPTIVE]** The VoC framework has known weaknesses (Taylor, 2004; multiple critiques summarized in Hall, 2007):

- The LME/CME binary is too coarse. France, Italy, and Mediterranean economies fit neither type cleanly.
- The prediction that LMEs specialize in radical innovation and CMEs in incremental innovation is empirically weak. Taylor (2004) showed this finding depends almost entirely on including the US as an outlier; remove it, and LMEs do not outperform CMEs on radical innovation.
- Nordic CMEs (Finland, Sweden) produce substantial radical innovation, contradicting the framework's core empirical prediction.
- Institutional drift: Denmark, Finland, Netherlands, and Sweden have all moved from CME toward LME characteristics since 1990, challenging the prediction of stable equilibria.

We use the five-type taxonomy as an organizational device while acknowledging that real economies are hybrid and dynamic.

---

## 3. Evidence Hierarchy: What We Know and How Well We Know It

### 3.1 Causal Evidence

The strongest evidence in comparative capitalism comes from natural experiments and well-identified IV/DiD designs:

**Institutions matter enormously for long-run development.**
- **[CAUSAL]** North/South Korea: Same people, culture, language, and roughly similar economies at division (1945). Current GDP per capita ratio: ~27:1 (South ~$36,000 vs. North ~$1,300). The division was exogenous (Cold War geopolitics), making this among the cleanest natural experiments in economics. Caveats: the North had slightly more industry; international sanctions compound institutional failures; the case doesn't isolate *which* institutional features matter most (Acemoglu & Robinson, 2012).
- **[CAUSAL]** Germany reunification: At reunification (1990), East German GDP per worker was ~40% of West German levels. Rapid initial convergence to ~65-67% by mid-1990s, then stalling. As of ~2020, East German GDP per worker remains ~80% of West. The persistent gap is driven by Total Factor Productivity, not capital or human capital inputs — reflecting institutional legacies in firm structure, labor market thickness, and organizational capital that persist decades after formal institutional convergence (Burda, 2001; CEPR, 2019).

**Innovation causes top-end inequality, not the reverse.**
- **[CAUSAL]** Aghion et al. (2019, *Review of Economic Studies*): Using IV analysis on US cross-state panel data, find that innovation accounts for ~17% of the increase in top 1% income share between 1975-2010. Innovation does NOT increase broader inequality measures, and is positively correlated with social mobility (except where lobbying is intense). The causal arrow runs from innovation *to* inequality, undermining the claim that inequality is a prerequisite for innovation.

**Competition and innovation have an inverted-U relationship.**
- **[CAUSAL]** Aghion, Bloom, Blundell, Griffith & Howitt (2005, *QJE*): UK panel data (1968-1997). Moderate competition maximizes innovation; both monopoly and perfect competition reduce it. This contradicts both the Schumpeterian view (monopoly drives innovation) and the pure competition view.

**Codetermination has near-zero effects on wages and productivity.**
- **[CAUSAL]** Jäger, Noy & Schoefer (2022, *ILR Review*): Difference-in-differences exploiting a 1994 German reform. Board-level worker representation (one-third seats) has no detectable effect on wages (CI: -1.9% to +3.9%) or productivity (CI: -0.2% to +3.4%). Important caveat: this tests only the weakest form of codetermination; stronger forms (parity representation, works councils) may have different effects.

**Neighborhoods causally affect economic outcomes.**
- **[CAUSAL]** Chetty et al. (2018, Opportunity Atlas): Administrative data on 20 million Americans. Quasi-experimental evidence indicates ~60% of the variation in outcomes across neighborhoods is driven by causal effects of place, not selection. Social mobility varies enormously within the US (bottom-to-top-quintile probability: 4.4% in Charlotte vs. 12.9% in San Jose).

### 3.2 Correlational Evidence (System GMM / Panel Regressions)

**Inequality is associated with lower growth and shorter growth spells.**
- **[CORRELATIONAL]** Ostry, Berg & Tsangarides (2014, IMF SDN/14/02): ~153 countries, 1960-2010, 828 observations. System GMM panel regressions. Net inequality coefficient: **-0.14*** (SE: 0.044). A 1-point Gini increase reduces 5-year average growth. Redistribution coefficient: 0.005 (SE: 0.049) — statistically insignificant, near zero. **Redistribution shows no negative effect on growth.** In hazard models, a 1 Gini point increase raises the risk of a growth spell ending by 6%. Some evidence that *extremely large* redistribution (top quartile, >13 Gini points) may be harmful, but this finding is not robust to additional controls. Published in peer-reviewed form: *Journal of Economic Growth*, 2018.

- **[CORRELATIONAL]** Berg & Ostry (2011, IMF SDN/11/08): 140 countries, 1950-2006. A 10-percentile decrease in inequality increases expected growth spell duration by 50%. Inequality is "among the most robust" predictors of growth duration — more robust than many conventional determinants including institutions and trade openness. Authors explicitly label results as "empirical regularities (stylized facts)" rather than causal claims.

- **[CORRELATIONAL]** Cingano (2014, OECD Working Paper 163): 31 OECD countries, 1970-2010. System GMM. 1 Gini point reduction → 0.8pp cumulative growth over 5 years. Rising inequality estimated to have knocked >10pp off cumulative growth in Mexico and New Zealand (1990-2010). The negative effect operates primarily through the *bottom* of the distribution: reduced human capital investment by disadvantaged individuals. Top inequality has no statistically significant effect on growth.

- **[CORRELATIONAL]** Dabla-Norris et al. (2015, IMF SDN/15/13): 159 countries, 1980-2012. A 1pp increase in the income share of the bottom 20% is associated with 0.38pp higher GDP growth. A 1pp increase in the top 20% share is associated with 0.08pp *lower* growth. Benefits do not trickle down.

**Convergence of the inequality-growth literature:** Four major studies (Berg & Ostry 2011, Ostry et al. 2014, Cingano 2014, Dabla-Norris et al. 2015), using different samples, time periods, and specifications, all find the same directional result: inequality harms growth, redistribution does not. The channel is human capital underinvestment at the bottom of the distribution. All rely on System GMM, which mitigates but does not eliminate endogeneity.

**Labor market institutions and corporate governance predict inequality across capitalism types.**
- **[CORRELATIONAL]** Movahed (2023, *International Journal of Comparative Sociology*): Fixed-effect panel regressions, 1985-2016. Vocational rehabilitation programs and corporate governance characteristics are the most important determinants of income inequality across capitalism types. Won the ASA Terence K. Hopkins Award.

### 3.3 Descriptive Evidence

**Social mobility: The Great Gatsby Curve.**
- **[DESCRIPTIVE]** Corak (2013, various): Cross-country negative relationship between income inequality (Gini) and intergenerational mobility (intergenerational earnings elasticity). Nordic countries: <20% of parental advantage transmitted. US, UK: ~50% transmitted. WEF Global Social Mobility Index top 5 are all Nordic. The curve is a cross-sectional correlation — it cannot prove that reducing inequality *causes* higher mobility, though Chetty's within-US causal evidence is consistent with this interpretation.

**Quality of life indices favor Nordic and coordinated market economies.**
- **[DESCRIPTIVE]** World Happiness Report: Finland #1 for 7th consecutive year (score 7.8/10). Iceland, Denmark, Sweden, Norway fill 5 of top 6. UN HDI: Nordic countries gain relative to the US when adjusted for inequality (US IHDI ranking drops significantly vs. raw HDI). OECD Better Life Index: Nordic and CME countries rank consistently across *all* well-being dimensions; LMEs rank higher on GDP per capita but lower on health, equality, work-life balance.

**Nordic countries are as innovative as the US, per capita.**
- **[DESCRIPTIVE]** CEPR VoxEU analysis: Despite higher tax burdens and more generous safety nets, Nordic countries generate "at least as much — if not more — innovation" per capita than the US. Sweden consistently ranks among the top global R&D spenders as a share of GDP, often ahead of the US. Three Nordic countries rank among the world's ten most innovative economies (WIPO GII). Worker reallocation in Denmark is more intensive than in the US.

**Economic resilience: Nordic countries recovered faster from 2008 and COVID.**
- **[DESCRIPTIVE]** CEPR/ETLA analysis (Holmstrom et al., 2010): Nordic GDP declined 4.5-7% in 2009 but recovered faster due to pre-crisis budget surpluses, better financial regulation (lessons from 1990s banking crises), and automatic stabilizers. Governments rejected industry bailouts without social unrest because safety nets absorbed individual risk. Bengt Holmstrom (Nobel laureate) was among the authors.

---

## 4. The Endogeneity Problem

### 4.1 The Core Challenge

The central methodological threat to all comparative capitalism research: **the same deep factors — social trust, ethnic composition, geography, historical culture — may simultaneously determine both which capitalism model a society adopts AND the outcomes attributed to that model.** If true, attributing outcomes to "the model" is a causal error.

This section catalogues the evidence on both sides.

### 4.2 Evidence That Deep Factors Drive Both Model and Outcomes

**Social capital determines institutional performance independent of formal institutions.**
- **[CAUSAL/QUASI-EXPERIMENTAL]** Putnam (1993, *Making Democracy Work*): Exploiting Italy's 1970 regional government reform, which gave identical institutional structures to all twenty regions. Northern regions with deep traditions of civic association dramatically outperformed southern regions with hierarchical, low-trust structures — despite identical formal institutions. This is arguably the strongest single piece of evidence for the endogeneity critique: identical institutions, wildly different outcomes. Caveat: the causal direction between social capital and institutional performance remains genuinely ambiguous (they may be mutually reinforcing equilibria).

**Ethnic composition predicts welfare state generosity.**
- **[CORRELATIONAL]** Alesina & Glaeser (2001, Brookings; 2004, *Fighting Poverty*): Racial heterogeneity is the key predictor of US-Europe welfare state differences, not economic fundamentals. Across US states, higher Black population share predicts less generous welfare. Cross-nationally, ethnic fractionalization predicts lower redistribution. If the US lacks a European welfare state primarily because of racial composition — not because of an ideological choice about capitalism — then comparing the two systems and attributing outcome differences to "the model" is misleading.
  - **Important critique:** The diversity-redistribution link has mixed empirical support in developed democracies when tested more carefully. The work has been criticized for exaggerating European homogeneity and ignoring the comparative welfare state literature (Esping-Andersen, Pierson).

**Trust — a key performance driver — is itself a product of ethnic homogeneity and institutional quality.**
- **[CORRELATIONAL]** Knack & Keefer (1997, *QJE*): Trust and civic cooperation norms are significantly associated with higher economic growth across 29 market economies. But trust is stronger in nations with higher and more equal incomes, better-educated populations, institutions restraining executive predation, and ethnically homogeneous populations. This creates a chicken-and-egg problem: do good institutions produce trust, or does pre-existing trust enable good institutions?

**Culture has independent effects on economic outcomes even holding institutions constant.**
- **[CORRELATIONAL/QUASI-EXPERIMENTAL]** Tabellini (2010, *JEEA*): Exploits within-country regional variation to study cultural effects while holding national institutions constant. Uses historical institutional quality as an instrument for current cultural values. The exogenous component of culture is strongly correlated with current regional economic development, even controlling for education, urbanization, and national effects. Cultural values persist over centuries.

### 4.3 Evidence That Institutions Have Independent Causal Power

**Institutional quality explains most cross-country income variation (contested).**
- **[ATTEMPTS CAUSAL]** Acemoglu, Johnson & Robinson (2001, *AER*): Uses European settler mortality as an IV for institutional quality. Institutions explain approximately three-quarters of cross-country income variation. Once institutions are controlled, geography has no independent effect.
  - **Critical weakness — Albouy (2012, *AER*):** 36 of 64 countries were assigned mortality rates from other countries, based on "mistaken or conflicting evidence." When data problems are addressed, the first-stage relationship weakens and IV estimates become unreliable with near-infinite confidence intervals. The debate is unresolved.

**Institutions dominate geography and trade (with caveats).**
- **[ATTEMPTS CAUSAL]** Rodrik, Subramanian & Trebbi (2004, *Journal of Economic Growth*): Once institutions are controlled, geography has at best weak direct effects. However, geography influences institutions *indirectly* — meaning geographic differences between Scandinavia and the American South partly explain why they adopted different capitalism models.

**Institutional choices diverge even between culturally similar countries.**
- **[DESCRIPTIVE]** Sweden maintained welfare internationalism (equal access for migrants) while Denmark adopted welfare nationalism (restricting immigrant benefits). This demonstrates that even controlling for demographic and cultural similarity, political choices about institutions differ — suggesting agency and politics matter, not just demography.

**The equality multiplier: Institutions create self-reinforcing equality.**
- **[CORRELATIONAL]** Barth, Moene & Willumsen (2014, *Journal of Public Economics*): Wage compression (from coordinated bargaining) → increased political support for redistribution → more generous welfare state → empowerment of weak groups → further wage compression. This "equality multiplier" suggests institutional design creates its own supporting conditions, partially addressing the endogeneity objection: even if initial conditions helped, the institutional configuration sustains itself through feedback loops.

### 4.4 Synthesis: What This Means for Comparative Claims

The endogeneity concern is **well-founded but not fatal**:

1. Deep factors (trust, ethnic composition, culture, geography) clearly shape both model choice and outcomes. Simple cross-country comparisons overstate the causal role of institutions.
2. Institutions likely have *some* independent causal power — the North/South Korea and German reunification natural experiments are difficult to explain otherwise — but it is entangled with preconditions that cannot easily be transplanted by policy.
3. Self-reinforcing feedback loops (Barth et al.'s equality multiplier) mean institutions can partially create their own supporting conditions over time, but the initial conditions matter.

**Bottom line:** Claiming that "Country X adopted Model A and got outcome Y, therefore Model A causes outcome Y" is naive. The evidence supports a weaker but still important claim: *institutional design matters and is partially endogenous to deep factors, but retains independent causal influence through feedback mechanisms and political agency.*

---

## 5. Quantitative Analysis with Sensitivity Testing

### 5.1 Methodology

We score 12 countries across 7 metrics using the most recent available data from official sources (OECD, World Bank, IMF, WIPO, UN). Each metric is normalized to a 0-100 scale where 100 = best performance in the sample.

**Metrics:**
1. **GDP Growth** — Average annual real GDP per capita growth, 2013-2023 (World Bank)
2. **Inequality** — Gini coefficient of disposable income, inverted (OECD IDD 2023)
3. **Social Mobility** — Intergenerational earnings elasticity, inverted (Corak, WEF)
4. **Innovation** — WIPO Global Innovation Index 2024
5. **Quality of Life** — Average of HDI (2023) and World Happiness Report score (2025)
6. **Resilience** — Composite: GDP volatility (inverted) + fiscal space (debt-to-GDP, inverted) + crisis recovery speed
7. **Sustainability** — CO2 emissions per capita (inverted) + renewable energy share

### 5.2 Key Results

See the companion Python simulation (`capitalism_simulation.py`) for full results, sensitivity analysis, and visualizations. Key findings from the baseline (equal weights):

- Nordic countries rank highest on the composite, driven by strong performance across *all* metrics rather than dominance on any single one
- East Asian developmental states rank highly but with significant internal variance (Singapore is an outlier)
- Anglo-American LMEs rank highest on GDP growth and innovation (absolute, not per-capita) but are pulled down by inequality, social mobility, and sustainability
- China ranks highest on GDP growth but lowest on quality of life and sustainability metrics

### 5.3 Sensitivity Analysis

The simulation tests robustness across:

1. **Weighting schemes:** Equal weights, growth-heavy (GDP/innovation 2x), equity-heavy (inequality/mobility 2x), sustainability-heavy, and 10,000 random weight draws from a Dirichlet distribution
2. **Country exclusion:** How do results change when Singapore (the East Asian outlier) is excluded?
3. **Uncertainty ranges:** Bootstrap confidence intervals on composite scores using data uncertainty estimates

Key sensitivity findings:
- Nordic advantage is **robust** — they rank first in ~96% of random weighting scenarios
- East Asian developmental ranking **depends heavily on Singapore** — removing it drops the model average substantially
- Anglo-American ranking **depends heavily on weighting** — they rank higher with growth-heavy weights, lower with equity-heavy weights
- No single weighting scheme reverses the relative ranking of Nordic vs. Anglo-American models

### 5.4 Why We Cannot Run Panel Regression

A proper panel regression of "capitalism model → outcomes" is infeasible for this analysis because:

1. **Sample size:** With 5 model types and 12 countries, we have 2-3 observations per model — far too few for meaningful regression
2. **Classification endogeneity:** Countries were not randomly assigned to models; any regression of outcomes on model type conflates model effects with selection effects
3. **Time variation:** Most countries have maintained the same broad capitalism model throughout the post-war period, eliminating within-country variation needed for panel fixed effects
4. **Institutional heterogeneity within models:** Singapore and Japan differ profoundly despite both being classified as "East Asian developmental"

The appropriate empirical strategy for causal claims is the natural experiment approach (Section 7), not cross-country regression at the model level. The scorecard is descriptive, and we label it as such.

---

## 6. Counterarguments and Threats to Validity

### 6.1 "Can't We All Be More Like Scandinavians?" (Acemoglu, Robinson & Verdier, 2017)

**The argument:** In a formal mathematical model of technologically interconnected countries, "cutthroat" capitalism (US-style, high inequality) generates frontier innovation that "cuddly" capitalism (Nordic-style) free-rides on. If the US switched to Nordic-style institutions, world innovation would slow, harming everyone. It is a Nash equilibrium: someone has to push the frontier.

**What the model actually proves:** Given its assumptions — specifically, that social insurance reduces entrepreneurial effort — asymmetric equilibrium emerges. Cuddly countries may have *higher welfare* than cutthroat ones (because citizens enjoy insurance while benefiting from spillovers).

**Why the model's key assumption is contested:**

1. The model assumes the *only* cost of entrepreneurship is effort (not financial risk). This rules out by construction the possibility that safety nets *encourage* risk-taking by reducing downside exposure. In reality, someone is more likely to start a company if failure doesn't mean losing healthcare. **[CAUSAL]** Aghion et al. (2019) find innovation drives inequality, not the reverse — directly contradicting the model's core mechanism.

2. **[DESCRIPTIVE]** Empirical contradiction: Sweden has more entrepreneurs per capita than the US. Three Nordic countries rank in the top 10 of the Global Innovation Index. The 2012 WEF ranked Sweden as the world's most innovative nation (Kenworthy, 2012).

3. **[DESCRIPTIVE]** Historical timing doesn't fit: The US-Sweden GDP gap predates the divergence in capitalism type by over a century. The US was richer than Sweden long before welfare state divergence (Kenworthy, 2012).

4. The paper is purely theoretical — no empirical test. The conclusions are only as strong as the assumptions.

**Assessment:** The model demonstrates a logical *possibility*, not an empirical *reality*. The weight of evidence runs against its key assumption.

### 6.2 The Small-Country Objection

**The argument:** Nordic countries are too small, homogeneous, and culturally specific for their model to transfer to large, diverse countries like the US.

**Systematic rebuttal (Kenworthy, 2020/2023, *Social Democratic Capitalism*):**

1. **Work ethic:** Not uniquely Nordic. When Sweden offered 90-100% sickness compensation without requiring a doctor's note, absenteeism doubled. Tax cheating rates: Denmark ~50% vs. US ~56% — virtually identical.
2. **Trust:** US trust levels in the 1960s matched Nordic levels. The decline was driven by loss of trust in government (Vietnam, Watergate), not cultural DNA. Trust can be rebuilt through institutional quality.
3. **Size/homogeneity:** No empirical relationship between population size and life satisfaction. Norway and Sweden now have *higher* foreign-born population shares than the US or UK.
4. **Government effectiveness:** Switzerland and the Netherlands match Nordic government quality; Australia, Canada, Austria are close behind.
5. **Scale counterexamples:** Germany (83M population), France (67M), and Canada (40M) all maintain substantially more coordinated economies than the US, with lower inequality and comparable or superior well-being outcomes. Germany is a CME with the world's 3rd-largest economy.

**What remains valid about the objection:** The initial establishment of Nordic institutions benefited from specific historical conditions (small population, relative homogeneity, strong labor movements). The question of whether these institutions can be *built from scratch* in a large, diverse country remains genuinely open — no country has attempted it. The question of whether existing Nordic institutions *continue to function* in increasingly diverse societies is being tested in real time.

### 6.3 "Frontier Innovation Requires Inequality"

**The argument:** US-style inequality is a necessary price for frontier innovation that benefits the world.

**The evidence runs strongly against this:**

1. **[CAUSAL]** Aghion et al. (2019): Innovation drives top inequality, not the reverse. The causal arrow is backwards from what this argument assumes.
2. **[CAUSAL]** Aghion et al. (2005, *QJE*): The optimal level of competition for innovation is moderate (inverted-U), not the minimal regulation associated with US-style capitalism.
3. **[DESCRIPTIVE]** Nordic countries match or exceed US innovation per capita. Three rank in WIPO's top 10 globally. Sweden's R&D/GDP ratio exceeds the US.
4. **[DESCRIPTIVE]** Other high-inequality LMEs (Australia, Canada, Ireland, New Zealand, UK) do not show superior innovation, undermining the claim that inequality per se drives innovation.
5. **[DESCRIPTIVE]** US innovation was strong when inequality was *low* — the 1960s-70s saw major advances in computing, medical technology, and space exploration during a period of historically compressed income distribution and high government R&D spending (Mazzucato, 2013).

### 6.4 The Role of Government in US Innovation

A common narrative attributes US innovation to free markets. The evidence complicates this substantially:

**[DESCRIPTIVE]** Mazzucato (2013, *The Entrepreneurial State*): The internet, GPS, touchscreen technology, Siri, and key pharmaceutical breakthroughs all originated from government-funded research (DARPA, NIH, DoE, NSF). The state funded the riskiest, most radical innovations over multi-decade timelines that private capital would not touch. The GI Bill, interstate highway system, and NIH-funded research were massive public investments that underpinned post-war growth.

**Critique:** Mingardi (2015, *Cato Journal*) argues Mazzucato cherry-picks successes while ignoring government investment failures, and questions whether government "created" these innovations or merely funded basic science that private entrepreneurs then commercialized. This is a fair methodological point (selection bias in case studies), but does not negate the documented role of public investment.

---

## 7. Natural Experiments

### 7.1 Korean Division (1945-Present)

**Design:** Same people, culture, language, roughly similar pre-division economies. Exogenous division along 38th parallel due to Cold War geopolitics.

**Result:** GDP per capita ratio ~27:1 (South Korea ~$36,000 vs. North Korea ~$1,300).

**What it proves [CAUSAL]:** Institutions — broadly defined — matter enormously for long-run development. This is among the cleanest natural experiments in economics.

**What it doesn't prove:** Which *specific* institutional features matter most (property rights? markets? political freedom? all?). North Korea also faced international sanctions and geopolitical isolation, so outcomes reflect extractive institutions + external constraints.

**Nuance:** Lee (2021, Cambridge) argues some divergence existed *before* division, rooted in colonial-era regional differences, slightly weakening the "identical starting conditions" assumption.

### 7.2 German Reunification (1990-Present)

**Design:** Same country, legal system, language, culture, monetary/fiscal policy post-1990. Different institutional histories (40 years of state socialism vs. social market economy).

**Result:** Convergence from ~40% to ~80% of West German productivity, then stalling for decades.

**What it proves [CAUSAL]:** Institutional legacies leave deep structural traces that persist decades after formal institutional convergence. The persistent gap is in TFP (efficiency), not capital or human capital inputs — reflecting firm structure, labor market thickness, and organizational capital.

**What it complicates:** The mechanism is not simply "extractive vs. inclusive." Early policy mistakes (pushing East German wages far above productivity) caused unemployment and discouraged investment. The case shows that *how* institutional transitions are managed matters as much as which institutions are adopted.

---

## 8. US Post-War Structural Advantages

The US post-WWII economic boom is frequently cited as evidence for the superiority of the American capitalism model. The historical evidence suggests the boom was overwhelmingly structural:

1. **[DESCRIPTIVE]** Last factory standing: By 1945, the US manufactured more than half of the world's produced goods and held two-thirds of global gold reserves. US exports constituted over one-third of total global exports. Every major industrial competitor had been physically destroyed.

2. **[DESCRIPTIVE]** Reserve currency privilege: The Bretton Woods system made the USD the world's primary reserve currency, providing seigniorage revenue (~$10B/year from non-residents holding US currency), the ability to borrow beyond the fiscal capacity of other states, and reduced price volatility in foreign trade (Eichengreen, 2011).

3. **[DESCRIPTIVE]** Massive government investment: GI Bill, interstate highway system, DARPA, NIH, NSF funding. These were not laissez-faire policies — they were among the largest government investments in human capital and infrastructure in history.

4. **[DESCRIPTIVE]** Robert Gordon (2016, *The Rise and Fall of American Growth*): TFP growth peaked in the 2nd-3rd quarters of the 20th century. The digital revolution generated a productivity boost of only one decade (1996-2006), compared to the five-decade interval (1920-1970) of the Second Industrial Revolution. Four "headwinds" constrain future growth: rising inequality, stagnating education, aging demographics, rising debt.

5. **[DESCRIPTIVE]** Field (2023, *Economic History Review*): US manufacturing productivity actually *declined* between 1941 and 1948, suggesting the "last factory standing" story is more nuanced than simple industrial superiority.

**Implication:** The US post-war boom is weak evidence for the Anglo-American capitalism model because the structural advantages were temporary and model-independent. As competitors rebuilt, the US growth advantage narrowed — precisely as a structural-advantage explanation would predict.

---

## 9. Limitations

### 9.1 Methodological Limitations

1. **The scorecard is descriptive, not causal.** It documents current performance differences but cannot prove that capitalism models cause them. All causal claims in this report come from cited literature, not from our own analysis.

2. **Classification is reductive.** Real economies are hybrid and dynamic. Singapore's economy differs profoundly from Japan's despite both being "East Asian developmental." The US and UK diverge on healthcare, labor regulation, and social spending despite both being LMEs.

3. **Data limitations.** Sustainability and resilience metrics are less standardized than GDP or Gini. Chinese data quality is contested. North Korean data is estimated. Some metrics (social mobility) have significant measurement lag.

4. **Survivorship bias.** We observe countries that currently exist with functioning institutions. Failed states, collapsed economies, and historical catastrophes are not represented. This biases the sample toward institutional configurations that have survived.

5. **Time period sensitivity.** Performance varies by decade. East Asian developmental states looked optimal in 1960-1990; less so during the 1997 Asian Financial Crisis. Nordic models looked vulnerable during the 1990s banking crises; less so post-2008. Our 2013-2023 window captures one slice of a longer trajectory.

### 9.2 Threats to Validity

1. **Omitted variable bias.** Even the best cross-country regressions cannot control for all confounders. The System GMM studies (Ostry et al., Cingano, Dabla-Norris) mitigate but do not eliminate this.

2. **Reverse causality.** Growth may reduce inequality (by expanding opportunities) rather than inequality reducing growth. The IMF papers use lagged variables and GMM instrumentation to address this, but the concern is not fully eliminated.

3. **External validity.** What works in Denmark (5.8M population, high trust, strong institutions) may not work in India (1.4B population, lower institutional quality, extreme diversity). The scalability question is genuinely open for country-building; less open for policy transfer within existing institutional frameworks.

4. **Publication bias.** The inequality-growth literature may overrepresent negative findings (inequality harmful) because positive findings (inequality beneficial) are less publishable in the current academic climate. However, the convergence across four independent major studies using different samples and methods reduces this concern.

---

## 10. Conclusions

### 10.1 What the Evidence Supports

1. **Inequality harms growth, redistribution does not.** Four major studies converge on this finding. The mechanism is human capital underinvestment at the bottom of the distribution. Evidence strength: correlational with quasi-causal instrumentation (System GMM). Not definitively causal, but the most robust finding in this literature.

2. **Institutions matter enormously for long-run development.** The Korean and German natural experiments establish this beyond reasonable doubt. Evidence strength: causal.

3. **Nordic and coordinated market economies outperform Anglo-American liberal markets on composite well-being measures.** This finding is robust to weighting assumptions in our sensitivity analysis. Evidence strength: descriptive (the composite is not causal).

4. **The US post-war boom was primarily structural, not model-driven.** Evidence strength: descriptive/historical.

5. **Innovation does not require inequality.** The causal arrow runs from innovation to top-end inequality, not the reverse. Nordic countries match or exceed US innovation per capita. Evidence strength: causal (Aghion et al., 2019) for the direction of causation; descriptive for the cross-country comparison.

6. **The endogeneity problem is real but not fatal.** Deep factors co-determine model choice and outcomes, but institutions retain independent causal influence through feedback mechanisms and political agency.

### 10.2 What the Evidence Does Not Support

1. That any single capitalism model is unambiguously "best" — performance depends on which outcomes you weight
2. That Nordic policies would automatically produce Nordic outcomes if transplanted to a large, diverse country — the scalability question is genuinely open
3. That inequality is a necessary price for frontier innovation — the evidence runs strongly against this
4. That US economic success demonstrates the superiority of laissez-faire capitalism — the US has never been laissez-faire, and its post-war success was largely structural

### 10.3 What Remains Genuinely Uncertain

1. Whether the Nordic equality multiplier (Barth et al., 2014) can be initiated in countries lacking its preconditions, or whether it requires a critical mass of pre-existing social trust
2. Whether increasing diversity in Nordic countries will erode the institutional foundations that depend on solidarity — the experiment is ongoing
3. The appropriate role of the state in innovation beyond basic research — Mazzucato's evidence is compelling but subject to selection bias concerns
4. Whether Chinese state capitalism represents a stable institutional equilibrium or a transitional form

---

## 11. References

### Causal / Natural Experiment Studies
- Acemoglu, D., Johnson, S. & Robinson, J.A. (2001). "The Colonial Origins of Comparative Development." *American Economic Review*, 91(5), 1369-1401.
- Aghion, P., Bloom, N., Blundell, R., Griffith, R. & Howitt, P. (2005). "Competition and Innovation: An Inverted-U Relationship." *Quarterly Journal of Economics*, 120(2), 701-728.
- Aghion, P., Akcigit, U., Bergeaud, A., Blundell, R. & Hémous, D. (2019). "Innovation and Top Income Inequality." *Review of Economic Studies*, 86(1), 1-45.
- Albouy, D. (2012). "The Colonial Origins of Comparative Development: An Empirical Investigation: Comment." *American Economic Review*, 102(6), 3059-3076.
- Chetty, R. et al. (2018). "The Opportunity Atlas: Mapping the Childhood Roots of Social Mobility." NBER Working Paper 25147.
- Jäger, S., Noy, S. & Schoefer, B. (2022). "What Does Codetermination Do?" *ILR Review*, 75(4), 857-890.
- Putnam, R. (1993). *Making Democracy Work: Civic Traditions in Modern Italy*. Princeton University Press.

### Correlational / Panel Regression Studies
- Barth, E., Moene, K.O. & Willumsen, F. (2014). "The Scandinavian Model — An Interpretation." *Journal of Public Economics*, 117, 60-72.
- Berg, A.G. & Ostry, J.D. (2011). "Inequality and Unsustainable Growth: Two Sides of the Same Coin?" IMF Staff Discussion Note SDN/11/08.
- Cingano, F. (2014). "Trends in Income Inequality and its Impact on Economic Growth." OECD Social, Employment and Migration Working Papers, No. 163.
- Dabla-Norris, E. et al. (2015). "Causes and Consequences of Income Inequality: A Global Perspective." IMF Staff Discussion Note SDN/15/13.
- Knack, S. & Keefer, P. (1997). "Does Social Capital Have an Economic Payoff?" *Quarterly Journal of Economics*, 112(4), 1251-1288.
- Movahed, M. (2023). "Varieties of Capitalism and Income Inequality." *International Journal of Comparative Sociology*.
- Ostry, J.D., Berg, A. & Tsangarides, C.G. (2014). "Redistribution, Inequality, and Growth." IMF Staff Discussion Note SDN/14/02. Published in *Journal of Economic Growth*, 23(3), 2018.
- Rodrik, D., Subramanian, A. & Trebbi, F. (2004). "Institutions Rule." *Journal of Economic Growth*, 9(2), 131-165.
- Tabellini, G. (2010). "Culture and Institutions." *Journal of the European Economic Association*, 8(2-3), 677-716.

### Descriptive / Framework Studies
- Acemoglu, D. & Robinson, J.A. (2012). *Why Nations Fail*. Crown Publishers.
- Acemoglu, D., Robinson, J.A. & Verdier, T. (2017). "Asymmetric Growth and Institutions in an Interdependent World." *Journal of Political Economy*, 125(5), 1245-1305.
- Alesina, A. & Glaeser, E. (2001). "Why Doesn't the United States Have a European-Style Welfare State?" *Brookings Papers on Economic Activity*, 2001(2), 187-254.
- Alesina, A., Baqir, R. & Easterly, W. (1999). "Public Goods and Ethnic Divisions." *Quarterly Journal of Economics*, 114(4), 1243-1284.
- Corak, M. (2013). "Income Inequality, Equality of Opportunity, and Intergenerational Mobility." *Journal of Economic Perspectives*, 27(3), 79-102.
- Eichengreen, B. (2011). *Exorbitant Privilege: The Rise and Fall of the Dollar and the Future of the International Monetary System*. Oxford University Press.
- Gordon, R.J. (2016). *The Rise and Fall of American Growth*. Princeton University Press.
- Hall, P.A. & Soskice, D. (2001). *Varieties of Capitalism: The Institutional Foundations of Comparative Advantage*. Oxford University Press.
- Kenworthy, L. (2020). *Social Democratic Capitalism*. Oxford University Press.
- Mazzucato, M. (2013). *The Entrepreneurial State: Debunking Public vs. Private Sector Myths*. Anthem Press.
- Taylor, M. (2004). "Empirical Evidence Against Varieties of Capitalism's Theory of Technological Innovation." *Research Policy*.

### Data Sources
- OECD Income Distribution Database (IDD), 2023 release
- World Bank Development Indicators
- Penn World Tables
- IMF World Economic Outlook
- WIPO Global Innovation Index 2024
- UN Human Development Index 2023
- World Happiness Report 2025
- WEF Global Social Mobility Index
- Standardized World Income Inequality Database (SWIID)
