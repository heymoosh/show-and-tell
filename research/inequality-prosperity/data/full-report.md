# Is Wealth Inequality Necessary for Economic Prosperity and Innovation?

## Executive Summary

**No — wealth inequality is not necessary for prosperity or innovation, but** ***some*** **dispersion of returns is.** The defensible claim from the evidence is narrow: a society needs differential rewards strong enough to motivate effort, risk-taking, and capital accumulation. It does not need the wealth concentration observed in high-inequality economies today. Across cross-country econometrics, micro-level innovation studies, country case studies, and an agent-based simulation built for this report, the relationship between inequality and prosperity is an **inverted-U**: too little dispersion blunts incentives, but too much suppresses human capital formation, narrows the inventor pool, weakens demand, and entrenches incumbents.

The strongest single finding in the literature: an IMF study covering 173 countries found that a 3-point increase in the Gini coefficient lowers annual GDP growth by about 0.5 percentage points, and that redistribution is "generally benign" for growth ([IMF Staff Discussion Note 2014](https://www.imf.org/-/media/websites/imf/imported-full-text-pdf/external/pubs/ft/sdn/2014/_sdn1402.pdf)). The OECD estimated that rising inequality cost member economies 8.5% of cumulative GDP over 25 years ([OECD 2014](https://www.komazawa-u.ac.jp/~kobamasa/reference/bibliography/OECD/Focus-Inequality-and-Growth-2014.pdf)). The strongest micro-level finding: children from top-1% families in the US are **ten times** more likely to become inventors than children from below-median families, implying a quadrupling of US inventors if access were equalized ([Bell, Chetty et al., QJE 2019](https://academic.oup.com/qje/article-abstract/134/2/647/5218522)).

The simulation built for this report (1,000 agents, 200 periods, 30 seeds per configuration; rebuilt in 2026 after an audit — see Section 6) reproduces this inverted-U on the dimension that matters: holding the *reward* to innovation fixed, innovation peaks at **interior** redistribution and laissez-faire is never optimal, because at maximum wealth concentration ~99% of the most talented agents are too poor to ever innovate. At the innovation optimum the *income* Gini is ≈ 0.24–0.31 (Nordic range) while the *wealth* Gini stays high (~0.70). What is necessary is reward dispersion, not standing wealth concentration — and redistribution helps only to the extent it funds public education and research.

---

## 1. The Question, Sharpened

The question conflates four distinct concepts that the evidence treats differently:

| Concept | What it means | Evidence verdict |
|---|---|---|
| **Differential rewards** | Higher pay for higher productivity, risk, or scarce skill | Necessary for prosperity |
| **Wealth dispersion** | Some households have more capital than others | Necessary for risk capital |
| **Wealth concentration** | Top 1% / top 10% holds a large share | Harmful past a threshold |
| **Intergenerational lock-in** | Wealth predicts children's outcomes | Strongly harmful to innovation |

The pro-inequality argument is strongest for the first two; the empirical case against high inequality applies to the latter two. Treating them as a single dial is the central confusion in popular debate.

---

## 2. The Pro-Inequality Case (and Its Limits)

Five theoretical pillars support the view that inequality drives prosperity:

**Kaldor's savings hypothesis.** Capitalists save a much larger fraction of income than wage-earners — empirically, around 70% of profits versus 5% of wages in Kaldor's data ([Kaldor 1961](http://gesd.free.fr/kaldor61.pdf)). Concentrated wealth therefore funds capital accumulation. This is mechanically true in early-industrial economies but weakens dramatically in modern financialized economies where corporate retained earnings, pension funds, and foreign capital dominate domestic savings.

**Schumpeterian rents.** Entrepreneurs need the prospect of outsized returns to take risks; creative destruction depends on temporary monopoly profits ([Econlib on Creative Destruction](https://www.econlib.org/library/Enc/CreativeDestruction.html)). True, but Schumpeter's mechanism requires *entry* — high inequality is most innovation-friendly when it reflects new entrants displacing incumbents, not when incumbents entrench themselves.

**Tournament theory.** Lazear and Rosen showed that large prizes at the top elicit effort from everyone below ([Lazear & Rosen, JPE 1981](https://econpapers.repec.org/RePEc:ucp:jpolec:v:89:y:1981:i:5:p:841-64)). This justifies CEO pay differentials and winner-take-all markets — up to the point where the tournament loses legitimacy and effort collapses.

**Hayekian price signals.** Hayek argued that unequal outcomes carry information about scarce skills and preferences; flattening them destroys the signal ([Hayek's Constitution of Liberty discussion](https://truenorthideas.org/the-constitution-of-liberty-hayeks-lessons-for-today-and-tomorrow/)).

**Mankiw's defense.** Mankiw argued the top 1% earn their income through marginal productivity, and redistribution involves moral costs of coercion ([Mankiw, JEP 2013](https://www.aeaweb.org/articles?id=10.1257%2Fjep.27.3.21)).

These arguments establish that *complete* equalization is harmful. None establishes that current US-level inequality (Gini ~0.41, top 1% share ~20%) is preferable to Nordic-level inequality (Gini ~0.27, top 1% share ~7–10%).

---

## 3. The Anti-Inequality Case: Five Mechanisms

The literature identifies five channels through which high inequality reduces prosperity and innovation:

### 3.1 Human capital underinvestment (Galor-Zeira credit constraints)

When poor households cannot borrow against future earnings, they under-invest in education even when returns exceed the interest rate. Galor and Zeira showed this produces persistent inequality and lower aggregate output ([Galor-Zeira model](https://en.wikipedia.org/wiki/Galor%E2%80%93Zeira_model)). Quantified effects in their framework: redistributing toward the 25th percentile raises GDP growth by ~2.3%; redistributing toward the 75th lowers it by 5.3%.

### 3.2 "Lost Einsteins"

The most striking micro-level finding in modern economics: children of the top 1% are ten times more likely to file a patent by age 30 than children from below-median-income households, controlling for math ability in third grade ([Bell, Chetty, Jaravel, Petkova, Van Reenen, QJE 2019](https://academic.oup.com/qje/article-abstract/134/2/647/5218522); [Opportunity Insights summary](https://opportunityinsights.org/paper/losteinsteins/)). If women, minorities, and low-income children invented at the rate of high-income white men, the US would have **four times** as many inventors ([MIT Sloan summary](https://mitsloan.mit.edu/ideas-made-to-matter/lost-einsteins-us-may-have-missed-out-millions-inventors)). The mechanism is exposure: kids who grew up around inventors become inventors. High inequality breaks the exposure chain.

### 3.3 Demand-side / secular stagnation

Larry Summers argued that rising inequality increases the average propensity to save (because the rich save more), suppressing aggregate demand and creating chronic excess saving over investment — secular stagnation ([Summers 2015](http://www.piketty.pse.ens.fr/files/Summers2015.pdf)). In his words, "lack of demand creates lack of supply potential." This is the modern Keynesian version of underconsumptionism.

### 3.4 Institutional capture

Acemoglu and Robinson show that economic inequality flows into political inequality, which then reshapes institutions to be extractive rather than inclusive — the "inequality multiplier" ([Acemoglu & Robinson 2011](http://piketty.pse.ens.fr/files/AcemogluRobinson2011.pdf); [Why Nations Fail](https://www.wcfia.harvard.edu/publications/why-nations-fail)). Extractive institutions then suppress entry, competition, and innovation. Aghion et al. distinguish between innovation by *entrants* (which raises top incomes *and* mobility) and innovation by *incumbents* (which raises top incomes while reducing mobility) ([Aghion et al., RES 2019](https://academic.oup.com/restud/article/86/1/1/5026613)).

### 3.5 Reduced intergenerational mobility — the Great Gatsby Curve

Cross-country, the Gini coefficient explains roughly 65% of the variation in intergenerational earnings elasticity ([Corak 2013](https://stonecenter.gc.cuny.edu/files/2013/07/corak-income-inequality-equality-of-opportunity-and-intergenerational-mobility-2013.pdf); [Brookings on the Great Gatsby Curve](https://www.brookings.edu/articles/the-great-utility-of-the-great-gatsby-curve/)). US intergenerational elasticity is ~0.47; Nordic countries cluster around 0.15–0.18 ([Great Gatsby Curve overview](https://en.wikipedia.org/wiki/Great_Gatsby_Curve)). High inequality literally means your parents' wallet predicts your life more.

---

## 4. Cross-Country Econometrics

The mainstream consensus among major institutions has shifted decisively toward "high inequality reduces growth" since 2010:

| Study | Finding | Source |
|---|---|---|
| **IMF (Ostry, Berg, Tsangarides 2014)** | A 3-point Gini rise reduces annual growth by ~0.5 pp; redistribution is "generally benign" — Okun's leaky bucket largely absent | [IMF SDN 2014](https://www.imf.org/-/media/websites/imf/imported-full-text-pdf/external/pubs/ft/sdn/2014/_sdn1402.pdf) |
| **OECD (Cingano 2014)** | The average Gini rise across OECD members cost ~8.5% of cumulative GDP over 25 years | [OECD report](https://www.komazawa-u.ac.jp/~kobamasa/reference/bibliography/OECD/Focus-Inequality-and-Growth-2014.pdf) |
| **Berg & Ostry (IMF 2011)** | Lower inequality robustly predicts *longer* growth spells | [IMF F&D](https://www.imf.org/external/pubs/ft/fandd/2014/09/pdf/ostry.pdf) |
| **Persson & Tabellini (AER 1994)** | In democracies, inequality reduces growth via political-economy channels | [AER 1994](https://econpapers.repec.org/RePEc:aea:aecrev:v:84:y:1994:i:3:p:600-621) |
| **Alesina & Rodrik (QJE 1994)** | Distributive conflict from high inequality reduces growth | [NBER 3668](https://www.nber.org/system/files/working_papers/w3668/w3668.pdf) |
| **Banerjee & Duflo (JEG 2003)** | *Changes* in inequality in either direction reduce growth — nonparametric inverted-U | [MIT working paper](https://economics.mit.edu/sites/default/files/2022-08/Inequality%20and%20Growth%20What%20Can%20the%20Data%20Say.pdf) |
| **Forbes (AER 2000)** | Positive short-run effect over 5-year periods (the main heterodox finding; driven heavily by post-Soviet transition countries) | [AER 2000](https://www.aeaweb.org/articles?id=10.1257%2Faer.90.4.869) |
| **Barro (2000)** | Inequality is harmful in poor countries, neutral/positive in rich ones; threshold ~$11,900 GDP/capita | [Barro paper](https://barro.scholars.harvard.edu/file_url/293) |

The post-2010 institutional consensus (IMF, OECD, World Bank) is that **redistribution does not appreciably harm growth, and high inequality does**. This is a reversal of the 1990s "leaky bucket" intuition.

---

## 5. Country Case Studies

Real-world natural experiments confirm what the regressions imply.

### 5.1 The post-war US "Great Compression" (1945–1973)

The lowest-inequality period in modern US history was also its highest-productivity period. The top 1% income share averaged 8–10%, and total factor productivity grew about 2.88% per year ([BLS productivity analysis](https://www.bls.gov/opub/mlr/2021/article/the-us-productivity-slowdown-the-economy-wide-and-industry-level-analysis.htm); [Piketty-Saez-Atkinson JEL 2011](https://eml.berkeley.edu/~saez/atkinson-piketty-saezJEL10.pdf)). The 1980–2018 era saw the top 1% share more than double to ~23.5%, while productivity growth fell to 0.8%/year. The 90-10 log-wage gap fell from 1.45 to 1.06 during the compression ([Goldin & Margo QJE](https://bpb-us-e1.wpmucdn.com/sites.harvard.edu/dist/e/935/files/2026/01/Goldin_Margo_QJE.pdf)). Many innovations of the era — transistor, satellite, internet precursors, jet aviation — emerged under this distribution.

### 5.2 The Nordic model

Sweden, Denmark, Norway, and Finland combine Ginis of 0.27–0.28 with R&D spending of 3.0–3.6% of GDP and Global Innovation Index ranks of 2, 7, 9, and 20 respectively ([IZA DP 17677](https://repec.iza.org/dp17677.pdf); [Eurostat R&D data](https://ec.europa.eu/eurostat/statistics-explained/index.php?title=R%26D_expenditure)). Their equality comes from *predistribution* — coordinated wage bargaining compresses pre-tax inequality — not just redistribution ([People's Policy Project on Nordic state innovation](https://www.peoplespolicyproject.org/projects/nordic-state-innovation/)). Labor productivity per hour matches or exceeds the US.

### 5.3 East Asian Tigers

South Korea and Taiwan grew at 6–9% per year for three decades while maintaining Ginis of 0.30–0.35. Taiwan's pre-industrial land reform compressed its Gini from 0.57 to 0.33, then it industrialized ([Piketty archive comparative study](http://piketty.pse.ens.fr/files/You2014.pdf); [WID Korea](https://wid.world/wp-content/uploads/2024/01/WorldInequalityLab_WP2024_03_Income-inequality-in-South-Korea_Final-1.pdf)). South Korea now ranks 4th globally on innovation with R&D spending near 5% of GDP — the highest in the world.

### 5.4 Latin America — the inequality stagnation trap

Brazil, Mexico, Colombia maintain Ginis of 0.44–0.52, R&D spending of 0.29–1.15% of GDP, and Global Innovation Index ranks in the 49–65 range ([NCSES cross-national R&D](https://ncses.nsf.gov/pubs/nsb20225/cross-national-comparisons-of-r-d-performance); [ECLAC middle-income trap study](https://www.cepal.org/en/publications/48587-firm-level-innovation-government-policies-and-middle-income-trap-insights-five)). Labor productivity grew only 0.2%/year from 1980–2008. The CGDev attributes this to a "hard-to-escape stagnation trap" tied to elite capture and weak human capital ([CGDev Latin America stagnation](https://www.cgdev.org/publication/latin-americas-hard-to-escape-stagnation-trap)).

### 5.5 China post-1978

China's Gini rose from 0.30 to ~0.47–0.49 alongside GDP growth of 9.4%/year ([UCLA geography China study](https://geog.ucla.edu/sites/default/files/users/fan/322.pdf); [Milanovic on China-India-US distributions](https://stonecenter.gc.cuny.edu/changes-in-the-income-distributions-in-china-india-and-the-u-s-2018-2023-branko-milanovic/)). But the inequality was *policy-engineered* via the hukou system and coastal preferences — and the early growth (1978–1990) occurred under much *lower* inequality. Inequality accompanied growth; it did not cause it.

### 5.6 The Soviet Union / Cuba — the "too equal" case

The USSR's Gini hovered around 0.275–0.290, and TFP fell from 2.8%/year in the 1950s to effectively negative by the 1970s ([Texas National Security Review on Soviet performance](https://tnsr.org/2018/02/assessing-soviet-economic-performance-cold-war/)). But the failure mechanism was not equality per se — it was *coercive outcome suppression*, the absence of price signals, and the lack of entry/exit by firms. The Nordics achieve similar Ginis via wage compression *within* a market economy, with very different innovation outcomes. The Soviet case shows what destroys innovation, but inequality is not on the list.

### 5.7 The US Gilded Age (1870–1900) — the strongest counter-case

The top 10% owned ~75% of wealth; this was also a period of enormous patent activity (~450,000 patents 1860–1890) ([NBER Rockoff](https://www.nber.org/system/files/working_papers/w14555/w14555.pdf); [Gilded Age overview](https://en.wikipedia.org/wiki/Gilded_Age)). Two important confounders: real wages grew 60% across the period (broad-based gains alongside concentration), and growth averaged only 1.78%/year and was extremely volatile. Public infrastructure (land grants, patent system, public universities) underpinned the private innovation.

---

## 6. Simulation: An Agent-Based Test

> **Note (2026 rebuild).** The simulation first published here was withdrawn after an audit found three disqualifying bugs: innovation was normalized by the population mean, which pinned the innovation count constant in every regime (the old "innovation is flat across regimes, 2,924–3,051" line was an artifact, not a finding); the credit constraint was an absolute floor that stopped binding once incomes compounded; and taxes were modeled as pure consumption transfer with no public investment, so "redistribution lowers growth" was true by construction. The old six-regime table and the "growth peaks at wealth Gini 0.45–0.55" sweep are **withdrawn**. The rebuilt model and its results follow.

A simulation cannot prove what is true of real economies. Its one genuine power is **decoupling** four things that always move together in real data: reward dispersion (what an innovator personally gains), standing wealth concentration, what taxes fund, and access to finance. Splitting the question accordingly:

- **H1 — incentive necessity:** innovation collapses when the reward to innovation ρ → 0. (Near-tautological; stated, not claimed as a finding.)
- **H2 — concentration necessity:** holding rewards fixed, does standing wealth concentration help or hurt innovation?
- **H3 — substitutability:** does concentration's financing role survive credit markets and tax-funded public R&D?

The rebuilt model (1,000 agents, 200 periods, 30 seeds, reproducible) gives each agent a **talent** drawn independently of wealth — talent is distributed equally, opportunity is not — so "lost Einsteins" become a measurable count. Projects cost a scale-free amount and are financed by self-finance (the only route allowing concave scale-up — the pro-concentration channel), limited-liability credit, or tax-funded public R&D. Education is scale-free and gated by a relative poverty line that public education bypasses. Successful innovators earn rents and get rich, so inequality is partly an *outcome* of innovation. Constants are frozen from a neutral baseline; the US-like baseline passes validation gates (wealth Gini ≈ 0.73, income Gini < wealth Gini). The contested demand-side channel is excluded.

### 6.1 The necessity test

Sweeping reward dispersion ρ against redistribution τ, the innovation-maximizing rate τ\* and the inequality at that optimum (mean of 30 seeds):

| Reward dispersion ρ | Innovation-optimal τ\* | Cumulative innovations | Income Gini at τ\* | Wealth Gini at τ\* | "Lost Einsteins" at τ\* |
|---|---|---|---|---|---|
| 0.0 | — | 0 | — | — | — |
| 1.0 | 0.2 | 1,640 | 0.41 | 0.76 | 62% |
| 1.5 | 0.3 | 2,604 | 0.31 | 0.74 | 51% |
| 2.0 | 0.4 | 3,193 | 0.24 | 0.71 | 55% |
| 3.0 | 0.6 | 4,559 | 0.15 | 0.70 | 42% |

*[Chart to re-upload — generated locally as `e1_heatmap.png`; the embedded image below is from the withdrawn model and is outdated.]*

![Necessity test: reward dispersion vs redistribution](https://d2z0o16i8xm8ak.cloudfront.net/22192f32-2ffd-4054-9c86-1f197f025d0a/7bb9e3a8-66b4-4059-a767-caa6ffc939af/inequality-prosperity-timeseries.png?Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9kMnowbzE2aTh4bThhay5jbG91ZGZyb250Lm5ldC8yMjE5MmYzMi0yZmZkLTQwNTQtOWM4Ni0xZjE5N2YwMjVkMGEvN2JiOWUzYTgtNjZiNC00MDU5LWE3NjctY2FhNmZmYzkzOWFmL2luZXF1YWxpdHktcHJvc3Blcml0eS10aW1lc2VyaWVzLnBuZz8qIiwiQ29uZGl0aW9uIjp7IkRhdGVMZXNzVGhhbiI6eyJBV1M6RXBvY2hUaW1lIjoxNzgxNDAwNjM0fX19XX0_&Signature=ESRyDAejUho3OzLonYqGjcUDpagJdZLCPw1L5wZc4r8I6w1iEV-5d7hjgYR7yxiHeurT74LBk9vkKYQpuDT~rINZj7kwBdNzk0oGFZHlCibdnbZK0ApfXzIHnGyUc3BcybX1HlYBZKzV~61vWP1pcujynp6CBI5AwsezlxVS7BZzuNwM6SS-PYIGrkWM-L~RCnO6Wuk1hrfJn~TDszfAlDwh9DiVeD~7aSejgRjoXQAaH5rVfGZyubxhUvAtBgygqNqxwpQsGGY3AnHzMQghBF9qHNitg192bFDwk-UGnz4Ebdw9UEDV84Vn5N694Fgs53tCep-ZTTgEHkpPqQJVKw__&Key-Pair-Id=K1BF7XGXAIMYNX)

Three results (stated only where the 95% confidence intervals separate):

1. **H1 holds trivially.** With ρ = 0 the innovation count is zero everywhere. Differential reward is necessary — but this is built into any incentive model, not a discovery about *how much* dispersion is needed.
2. **Laissez-faire is never innovation-optimal (H2/H3).** For every positive reward level innovation is an inverted-U in redistribution, peaking at an *interior* τ\* (0.2–0.6), never 0. At τ = 0 (wealth Gini ≈ 0.89), **98–99% of the most talented agents never innovate** because they cannot afford the education gate. Standing wealth concentration does not buy innovation; it wastes inventor talent.
3. **High reward, moderate inequality.** The innovation-optimal *income* Gini is ≈ 0.24–0.31 (the Nordic range) while the *wealth* Gini stays high (~0.70–0.76) — as it does in the real Nordics. The necessary ingredient is reward dispersion (a flow), not wealth concentration (a stock).

### 6.2 Why redistribution helps — and where it stops

Switching channels off one at a time isolates each arm of the inverted-U:

- **Remove tax-funded public R&D** and the entire upslope vanishes — innovation collapses monotonically with τ. (This is precisely the assumption the old buggy model made, and it reproduces the old spurious "redistribution hurts" result.)
- **Remove the incentive gate** and the downslope vanishes — innovation rises monotonically with τ.
- **Remove credit access or project scale-up** (the pro-*concentration* channels) and almost nothing changes.

So the upslope (τ up to ≈ 0.3) is public investment unblocking talented-but-poor inventors — the share too poor to attempt falls 36% → 2% and lost Einsteins fall 99% → 51%; the downslope (beyond τ\*) is incentive erosion, as after-tax rewards stop justifying the effort. A robustness sweep (3 credit regimes × 3 revenue splits) finds the interior peak everywhere: an R&D-heavy split delivers the most innovation and peaks at low τ, a transfers-heavy split the least, and credit-market depth barely matters.

### 6.3 What the simulation cannot prove

It is a stylized mechanism map, not evidence about real economies; it builds in Galor-Zeira credit constraints and a Bell-Chetty talent-exposure channel by construction. What it adds is a clean separation: "inequality is necessary for innovation" conflates a true claim (reward *dispersion* matters) with a false one (standing wealth *concentration* helps), and the entire benefit of redistribution runs through what the revenue funds — not the transfer itself. If anything it understates the harm of concentration, since it omits political capture and rent-seeking.

---

## 7. Synthesis: Where the Mechanisms Land

| Mechanism | Direction | Best case study | Best empirical study |
|---|---|---|---|
| Kaldor savings → capital | Pro-inequality, weak in modern economies | Gilded Age US | Mixed |
| Schumpeterian rents | Pro-inequality for *entrants*, anti for *incumbents* | East Asian Tigers (entry); LatAm (incumbents) | [Aghion et al. 2019](https://academic.oup.com/restud/article/86/1/1/5026613) |
| Tournament incentives | Pro-inequality, with diminishing returns | — | — |
| Hayek price signals | Pro-dispersion (not concentration) | USSR failure | — |
| Galor-Zeira credit constraints | Anti-inequality | Latin America | [Galor-Zeira](https://en.wikipedia.org/wiki/Galor%E2%80%93Zeira_model) |
| Lost Einsteins | Anti-inequality | Nordics' high innovation | [Bell-Chetty QJE 2019](https://academic.oup.com/qje/article-abstract/134/2/647/5218522) |
| Summers demand-side | Anti-inequality | US post-1980 productivity slowdown | [Summers 2015](http://www.piketty.pse.ens.fr/files/Summers2015.pdf) |
| Acemoglu-Robinson institutional capture | Anti-inequality | LatAm vs Tigers | [Why Nations Fail](https://www.wcfia.harvard.edu/publications/why-nations-fail) |
| Great Gatsby mobility loss | Anti-inequality | US vs Nordics | [Corak 2013](https://stonecenter.gc.cuny.edu/files/2013/07/corak-income-inequality-equality-of-opportunity-and-intergenerational-mobility-2013.pdf) |

The pro-inequality mechanisms argue for *dispersion* (some inequality of outcomes reflecting effort, risk, skill). The anti-inequality mechanisms argue against *concentration* (top-heavy distributions where wealth predicts children's outcomes and capital accumulates at the top). The empirical and simulated optimum lies in the middle — roughly the Nordic or East Asian range.

---

## 8. Conclusion

The honest answer to the question is:

- **Some dispersion of rewards is necessary** for incentive, risk-taking, capital accumulation, and price signaling.
- **High wealth concentration is not necessary** and the evidence suggests it actively suppresses prosperity and innovation through human-capital underinvestment, lost inventors, weak demand, and institutional capture.
- **The inverted-U is robust** across IMF/OECD/World Bank econometrics, micro-level innovation studies, country case studies, and the agent-based simulation built for this report.
- **Innovation in particular** depends less on the size of the prize at the top than on the breadth of the talent pool, the quality of public infrastructure, and the strength of competition from new entrants — all of which high inequality tends to undermine.

The popular framing — "inequality is the price we pay for growth" — inverts the empirical relationship past a modest threshold. The Nordics, the post-war US, and the East Asian Tigers each generated their highest-innovation, highest-growth eras under inequality lower than the contemporary US, not higher.
