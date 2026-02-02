import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ScatterChart, Scatter, ResponsiveContainer, ReferenceLine } from 'recharts';
import { Play, Pause, RotateCcw, Settings, TrendingUp, FlaskConical } from 'lucide-react';

// Define checkpoint rounds outside component for stable reference
const CHECKPOINT_ROUNDS = [500, 1000, 2000, 3000, 4000];

const YardSaleSimulation = () => {
  // Simulation parameters
  const [numAgents, setNumAgents] = useState(1000);
  const [initialWealth, setInitialWealth] = useState(100);
  const [maxTransferPercent, setMaxTransferPercent] = useState(40);
  const [batchSize, setBatchSize] = useState(2000);
  const [speed, setSpeed] = useState(100);
  
  // Simulation state
  const [agents, setAgents] = useState([]);
  const [round, setRound] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  
  // Tracking data for charts
  const [wealthHistory, setWealthHistory] = useState([]);
  const [distributionData, setDistributionData] = useState([]);
  const [agentWealthHistory, setAgentWealthHistory] = useState({});
  const [selectedAgents, setSelectedAgents] = useState(new Set());
  const [showComparison, setShowComparison] = useState(false);
  
  // NEW: Hypothesis testing - early luck tracking
  const [earlyLuckThreshold, setEarlyLuckThreshold] = useState(50000); // Track "early" as first N rounds
  const [agentTradeStats, setAgentTradeStats] = useState({}); // Per-agent win/loss tracking
  const [showHypothesisPanel, setShowHypothesisPanel] = useState(false);
  const [earlyLuckCorrelation, setEarlyLuckCorrelation] = useState(null);
  
  // Wealth checkpoints - capture wealth at specific early rounds
  const [wealthCheckpoints, setWealthCheckpoints] = useState({}); // { round: { agentId: wealth } }
  const [checkpointCorrelations, setCheckpointCorrelations] = useState({}); // { round: correlation }
  
  // Ruin/survival tracking
  const RUIN_THRESHOLD_PERCENT = 1; // Agent is "ruined" when wealth < 1% of starting
  const [agentRuinTimes, setAgentRuinTimes] = useState({}); // { agentId: round when first hit ruin }
  const [survivalCurve, setSurvivalCurve] = useState([]); // [{ round, aliveCount, alivePercent }]
  const [survivalCorrelation, setSurvivalCorrelation] = useState(null);
  
  // Comprehensive correlation analysis
  const [comprehensiveCorrelations, setComprehensiveCorrelations] = useState(null);
  
  // Mobility and leadership tracking
  const [leadershipHistory, setLeadershipHistory] = useState([]); // [{ round, leaderId, leaderWealth }]
  const [mobilityStats, setMobilityStats] = useState(null);
  const previousRanksRef = React.useRef({}); // Use ref to avoid dependency issues

  // Initialize simulation
  const initializeSimulation = useCallback(() => {
    const newAgents = Array(numAgents).fill(null).map((_, i) => ({
      id: i,
      wealth: initialWealth
    }));
    setAgents(newAgents);
    setRound(0);
    setWealthHistory([]);
    setDistributionData([]);
    setAgentWealthHistory({});
    setAgentTradeStats({});
    setWealthCheckpoints({});
    setCheckpointCorrelations({});
    setAgentRuinTimes({});
    setSurvivalCurve([]);
    setSurvivalCorrelation(null);
    setComprehensiveCorrelations(null);
    setLeadershipHistory([]);
    setMobilityStats(null);
    previousRanksRef.current = {};
    setSelectedAgents(new Set([0, Math.floor(numAgents/4), Math.floor(numAgents/2), Math.floor(3*numAgents/4), numAgents-1]));
    setIsRunning(false);
    setShowComparison(false);
    setEarlyLuckCorrelation(null);
  }, [numAgents, initialWealth]);

  useEffect(() => {
    initializeSimulation();
  }, [initializeSimulation]);

  const calculateStats = useCallback((agentWealth) => {
    const sorted = [...agentWealth].sort((a, b) => b - a);
    const total = sorted.reduce((sum, w) => sum + w, 0);
    const top1Percent = Math.max(1, Math.floor(sorted.length * 0.01));
    const top10Percent = Math.max(1, Math.floor(sorted.length * 0.1));
    
    const top1Share = sorted.slice(0, top1Percent).reduce((sum, w) => sum + w, 0) / total;
    const top10Share = sorted.slice(0, top10Percent).reduce((sum, w) => sum + w, 0) / total;
    
    const n = sorted.length;
    let giniSum = 0;
    for (let i = 0; i < n; i++) {
      giniSum += (2 * (i + 1) - n - 1) * sorted[n - 1 - i];
    }
    const gini = giniSum / (n * total);
    
    return {
      top1Share: top1Share * 100,
      top10Share: top10Share * 100,
      gini: gini,
      maxWealth: sorted[0],
      minWealth: sorted[sorted.length - 1],
      avgWealth: total / sorted.length
    };
  }, []);

  // Calculate Pearson correlation coefficient
  const calculateCorrelation = useCallback((xValues, yValues) => {
    if (xValues.length !== yValues.length || xValues.length < 2) return null;
    
    const n = xValues.length;
    const sumX = xValues.reduce((a, b) => a + b, 0);
    const sumY = yValues.reduce((a, b) => a + b, 0);
    const sumXY = xValues.reduce((sum, x, i) => sum + x * yValues[i], 0);
    const sumX2 = xValues.reduce((sum, x) => sum + x * x, 0);
    const sumY2 = yValues.reduce((sum, y) => sum + y * y, 0);
    
    const numerator = n * sumXY - sumX * sumY;
    const denominator = Math.sqrt((n * sumX2 - sumX * sumX) * (n * sumY2 - sumY * sumY));
    
    if (denominator === 0) return 0;
    return numerator / denominator;
  }, []);

  const runBatch = useCallback(() => {
    // Track which checkpoints we need to capture during this batch
    const checkpointsToCapture = CHECKPOINT_ROUNDS.filter(
      cp => round < cp && round + batchSize >= cp
    );
    
    let capturedCheckpoints = {};
    let newRuinTimes = {}; // Track agents who hit ruin this batch
    const ruinThreshold = initialWealth * (RUIN_THRESHOLD_PERCENT / 100);
    
    setAgents(prevAgents => {
      const newAgents = [...prevAgents];
      
      // We need to track trades for hypothesis testing
      const batchTradeResults = {};
      
      for (let i = 0; i < batchSize; i++) {
        const currentRound = round + i;
        
        // Check if we should capture a checkpoint BEFORE this round's trade
        checkpointsToCapture.forEach(cp => {
          if (currentRound === cp && !capturedCheckpoints[cp]) {
            const checkpointWealth = {};
            newAgents.forEach(agent => {
              checkpointWealth[agent.id] = agent.wealth;
            });
            capturedCheckpoints[cp] = checkpointWealth;
          }
        });
        
        const agent1Idx = Math.floor(Math.random() * newAgents.length);
        let agent2Idx = Math.floor(Math.random() * newAgents.length);
        while (agent2Idx === agent1Idx) {
          agent2Idx = Math.floor(Math.random() * newAgents.length);
        }
        
        const agent1 = newAgents[agent1Idx];
        const agent2 = newAgents[agent2Idx];
        
        // Identify poorer and richer for stake calculation
        const poorer = agent1.wealth <= agent2.wealth ? agent1 : agent2;
        const richer = agent1.wealth <= agent2.wealth ? agent2 : agent1;
        
        // Calculate transfer amount (based on poorer agent's wealth)
        const transferFraction = Math.random() * (maxTransferPercent / 100);
        const transferAmount = transferFraction * poorer.wealth;
        
        // *** CRITICAL FIX: 50/50 coin flip for who wins ***
        const poorerWins = Math.random() < 0.5;
        
        if (poorerWins) {
          poorer.wealth += transferAmount;
          richer.wealth -= transferAmount;
        } else {
          poorer.wealth -= transferAmount;
          richer.wealth += transferAmount;
        }
        
        // Check if either agent just hit ruin for the first time
        [agent1, agent2].forEach(agent => {
          if (agent.wealth < ruinThreshold && 
              !newRuinTimes[agent.id] && 
              !agentRuinTimes[agent.id]) {
            newRuinTimes[agent.id] = currentRound;
          }
        });
        
        // Track trade results for hypothesis testing (only during early period)
        if (currentRound < earlyLuckThreshold) {
          // Track for agent1
          if (!batchTradeResults[agent1.id]) {
            batchTradeResults[agent1.id] = { wins: 0, losses: 0, trades: 0 };
          }
          batchTradeResults[agent1.id].trades++;
          
          // Did agent1 win? Agent1 wins if they gained wealth
          const agent1WasPoorer = agent1.wealth - (poorerWins ? transferAmount : -transferAmount) <= agent2.wealth - (poorerWins ? -transferAmount : transferAmount);
          const agent1Won = (agent1WasPoorer && poorerWins) || (!agent1WasPoorer && !poorerWins);
          
          if (agent1Won) {
            batchTradeResults[agent1.id].wins++;
          } else {
            batchTradeResults[agent1.id].losses++;
          }
          
          // Track for agent2
          if (!batchTradeResults[agent2.id]) {
            batchTradeResults[agent2.id] = { wins: 0, losses: 0, trades: 0 };
          }
          batchTradeResults[agent2.id].trades++;
          if (!agent1Won) {
            batchTradeResults[agent2.id].wins++;
          } else {
            batchTradeResults[agent2.id].losses++;
          }
        }
      }
      
      // Update trade stats state
      if (round < earlyLuckThreshold) {
        setAgentTradeStats(prev => {
          const newStats = { ...prev };
          Object.entries(batchTradeResults).forEach(([agentId, results]) => {
            const id = parseInt(agentId);
            if (!newStats[id]) {
              newStats[id] = { 
                earlyWins: 0, 
                earlyLosses: 0, 
                earlyTrades: 0,
                wealthAtEarlyEnd: null
              };
            }
            newStats[id].earlyWins += results.wins;
            newStats[id].earlyLosses += results.losses;
            newStats[id].earlyTrades += results.trades;
          });
          return newStats;
        });
      }
      
      // Capture wealth at end of early period
      if (round < earlyLuckThreshold && round + batchSize >= earlyLuckThreshold) {
        setAgentTradeStats(prev => {
          const newStats = { ...prev };
          newAgents.forEach(agent => {
            if (newStats[agent.id]) {
              newStats[agent.id].wealthAtEarlyEnd = agent.wealth;
            }
          });
          return newStats;
        });
      }
      
      return newAgents;
    });
    
    // Update checkpoints outside of setAgents
    if (Object.keys(capturedCheckpoints).length > 0) {
      setWealthCheckpoints(prev => ({
        ...prev,
        ...capturedCheckpoints
      }));
    }
    
    // Update ruin times
    if (Object.keys(newRuinTimes).length > 0) {
      setAgentRuinTimes(prev => ({
        ...prev,
        ...newRuinTimes
      }));
    }
    
    setRound(prev => prev + batchSize);
  }, [maxTransferPercent, batchSize, round, earlyLuckThreshold, initialWealth, agentRuinTimes]);

  // Update charts and calculate correlation
  useEffect(() => {
    if (agents.length > 0) {
      const wealth = agents.map(a => a.wealth);
      const stats = calculateStats(wealth);
      
      setWealthHistory(prev => {
        const newHistory = [...prev, {
          round,
          top1: stats.top1Share,
          top10: stats.top10Share,
          gini: stats.gini * 100,
          maxWealth: stats.maxWealth
        }];
        return newHistory.slice(-50);
      });
      
      // More granular tracking early on
      const trackingInterval = round < earlyLuckThreshold ? batchSize : batchSize * 2;
      if (round % trackingInterval === 0) {
        setAgentWealthHistory(prev => {
          const newHistory = { ...prev };
          agents.forEach(agent => {
            if (!newHistory[agent.id]) {
              newHistory[agent.id] = [];
            }
            newHistory[agent.id].push({
              round,
              wealth: agent.wealth
            });
            if (newHistory[agent.id].length > 150) {
              newHistory[agent.id] = newHistory[agent.id].slice(-150);
            }
          });
          return newHistory;
        });
      }
      
      const individualWealthData = agents
        .map((agent, index) => ({
          agentId: agent.id,
          displayId: index + 1,
          wealth: agent.wealth,
          isSelected: selectedAgents.has(agent.id)
        }))
        .sort((a, b) => b.wealth - a.wealth);
      
      setDistributionData(individualWealthData);
      
      // Calculate checkpoint correlations (wealth at checkpoint vs final wealth)
      const newCheckpointCorrelations = {};
      CHECKPOINT_ROUNDS.forEach(checkpointRound => {
        const checkpointData = wealthCheckpoints[checkpointRound];
        if (checkpointData && round > checkpointRound + 5000) { // Need some rounds after checkpoint
          const checkpointWealths = [];
          const finalWealths = [];
          
          agents.forEach(agent => {
            if (checkpointData[agent.id] !== undefined) {
              checkpointWealths.push(checkpointData[agent.id]);
              finalWealths.push(agent.wealth);
            }
          });
          
          if (checkpointWealths.length > 10) {
            const corr = calculateCorrelation(checkpointWealths, finalWealths);
            newCheckpointCorrelations[checkpointRound] = corr;
          }
        }
      });
      
      if (Object.keys(newCheckpointCorrelations).length > 0) {
        setCheckpointCorrelations(newCheckpointCorrelations);
      }
      
      // Calculate early luck correlation after early period ends
      if (round >= earlyLuckThreshold && Object.keys(agentTradeStats).length > 0) {
        const dataPoints = agents.map(agent => {
          const stats = agentTradeStats[agent.id];
          if (!stats || stats.earlyTrades === 0) return null;
          
          const earlyWinRate = stats.earlyWins / stats.earlyTrades;
          const earlyNetWins = stats.earlyWins - stats.earlyLosses;
          
          return {
            agentId: agent.id,
            earlyWinRate,
            earlyNetWins,
            earlyTrades: stats.earlyTrades,
            wealthAtEarlyEnd: stats.wealthAtEarlyEnd,
            finalWealth: agent.wealth
          };
        }).filter(d => d !== null);
        
        if (dataPoints.length > 10) {
          const winRates = dataPoints.map(d => d.earlyWinRate);
          const finalWealths = dataPoints.map(d => d.finalWealth);
          const netWins = dataPoints.map(d => d.earlyNetWins);
          
          const correlation = calculateCorrelation(winRates, finalWealths);
          const netWinsCorrelation = calculateCorrelation(netWins, finalWealths);
          
          setEarlyLuckCorrelation({
            winRateCorrelation: correlation,
            netWinsCorrelation: netWinsCorrelation,
            dataPoints,
            sampleSize: dataPoints.length
          });
        }
      }
      
      // Calculate survival correlation (ruin time vs final wealth)
      if (Object.keys(agentRuinTimes).length > 0) {
        const ruinedCount = Object.keys(agentRuinTimes).length;
        const aliveCount = numAgents - ruinedCount;
        
        // Update survival curve
        setSurvivalCurve(prev => {
          const newPoint = {
            round,
            aliveCount,
            alivePercent: (aliveCount / numAgents) * 100,
            ruinedCount
          };
          // Keep last 100 data points
          const updated = [...prev, newPoint];
          if (updated.length > 100) {
            return updated.slice(-100);
          }
          return updated;
        });
        
        // Calculate correlation: survival time vs final wealth
        // For agents who hit ruin: survival time = ruin round
        // For agents still alive: survival time = current round (still surviving)
        const survivalTimes = [];
        const finalWealths = [];
        
        agents.forEach(agent => {
          const ruinTime = agentRuinTimes[agent.id];
          // Survival time: either when they hit ruin, or current round if still alive
          const survivalTime = ruinTime !== undefined ? ruinTime : round;
          survivalTimes.push(survivalTime);
          finalWealths.push(agent.wealth);
        });
        
        if (survivalTimes.length > 10) {
          const corr = calculateCorrelation(survivalTimes, finalWealths);
          
          // Calculate log wealth correlation (better for highly skewed distributions)
          const logFinalWealths = finalWealths.map(w => Math.log10(Math.max(0.0001, w)));
          const logCorr = calculateCorrelation(survivalTimes, logFinalWealths);
          
          // Also calculate: what % of survivors are in top 10% wealth?
          const ruinThreshold = initialWealth * (RUIN_THRESHOLD_PERCENT / 100);
          const survivors = agents.filter(a => a.wealth >= ruinThreshold);
          const sortedByWealth = [...agents].sort((a, b) => b.wealth - a.wealth);
          const top10Threshold = sortedByWealth[Math.floor(numAgents * 0.1)]?.wealth || 0;
          const survivorsInTop10 = survivors.filter(a => a.wealth >= top10Threshold).length;
          
          // Calculate average wealth of survivors vs ruined
          const survivorWealth = survivors.reduce((sum, a) => sum + a.wealth, 0) / (survivors.length || 1);
          const ruinedAgents = agents.filter(a => a.wealth < ruinThreshold);
          const ruinedWealth = ruinedAgents.reduce((sum, a) => sum + a.wealth, 0) / (ruinedAgents.length || 1);
          
          setSurvivalCorrelation({
            correlation: corr,
            logCorrelation: logCorr,
            aliveCount,
            ruinedCount,
            alivePercent: (aliveCount / numAgents) * 100,
            survivorsInTop10,
            survivorsInTop10Percent: survivors.length > 0 ? (survivorsInTop10 / survivors.length) * 100 : 0,
            avgSurvivorWealth: survivorWealth,
            avgRuinedWealth: ruinedWealth,
            wealthRatio: ruinedWealth > 0 ? survivorWealth / ruinedWealth : Infinity
          });
        }
      }
      
      // COMPREHENSIVE CORRELATION ANALYSIS
      // Test everything we have against final wealth
      if (agents.length > 0 && round > 5000) {
        const ruinThreshold = initialWealth * (RUIN_THRESHOLD_PERCENT / 100);
        const correlations = [];
        
        // Prepare data arrays
        const finalWealths = agents.map(a => a.wealth);
        const logFinalWealths = agents.map(a => Math.log10(Math.max(0.0001, a.wealth)));
        
        // 1. Binary: Survived (1) vs Ruined (0)
        const survivedBinary = agents.map(a => a.wealth >= ruinThreshold ? 1 : 0);
        correlations.push({
          name: 'Survived (binary)',
          description: 'Whether agent is above ruin threshold',
          vsWealth: calculateCorrelation(survivedBinary, finalWealths),
          vsLogWealth: calculateCorrelation(survivedBinary, logFinalWealths)
        });
        
        // 2. Survival time (continuous)
        const survivalTimes = agents.map(a => {
          const ruinTime = agentRuinTimes[a.id];
          return ruinTime !== undefined ? ruinTime : round;
        });
        correlations.push({
          name: 'Survival time',
          description: 'Round when hit ruin (or current if alive)',
          vsWealth: calculateCorrelation(survivalTimes, finalWealths),
          vsLogWealth: calculateCorrelation(survivalTimes, logFinalWealths)
        });
        
        // 3. Early win rate (if available)
        if (Object.keys(agentTradeStats).length > 0) {
          const earlyWinRates = agents.map(a => {
            const stats = agentTradeStats[a.id];
            if (!stats || stats.earlyTrades === 0) return 0.5;
            return stats.earlyWins / stats.earlyTrades;
          });
          correlations.push({
            name: 'Early win rate',
            description: `Win rate during first ${earlyLuckThreshold.toLocaleString()} rounds`,
            vsWealth: calculateCorrelation(earlyWinRates, finalWealths),
            vsLogWealth: calculateCorrelation(earlyWinRates, logFinalWealths)
          });
          
          // 4. Early net wins
          const earlyNetWins = agents.map(a => {
            const stats = agentTradeStats[a.id];
            if (!stats) return 0;
            return stats.earlyWins - stats.earlyLosses;
          });
          correlations.push({
            name: 'Early net wins',
            description: 'Wins minus losses in early period',
            vsWealth: calculateCorrelation(earlyNetWins, finalWealths),
            vsLogWealth: calculateCorrelation(earlyNetWins, logFinalWealths)
          });
          
          // 5. Total early trades (exposure)
          const earlyTrades = agents.map(a => {
            const stats = agentTradeStats[a.id];
            return stats ? stats.earlyTrades : 0;
          });
          correlations.push({
            name: 'Early trade count',
            description: 'How many trades in early period',
            vsWealth: calculateCorrelation(earlyTrades, finalWealths),
            vsLogWealth: calculateCorrelation(earlyTrades, logFinalWealths)
          });
        }
        
        // 6. Wealth at each checkpoint
        CHECKPOINT_ROUNDS.forEach(cp => {
          const checkpointData = wealthCheckpoints[cp];
          if (checkpointData) {
            const checkpointWealths = agents.map(a => checkpointData[a.id] || initialWealth);
            correlations.push({
              name: `Wealth @ round ${cp.toLocaleString()}`,
              description: `Wealth position at checkpoint`,
              vsWealth: calculateCorrelation(checkpointWealths, finalWealths),
              vsLogWealth: calculateCorrelation(checkpointWealths, logFinalWealths)
            });
          }
        });
        
        // 7. Among SURVIVORS ONLY - what predicts who becomes richest?
        const survivors = agents.filter(a => a.wealth >= ruinThreshold);
        if (survivors.length > 10) {
          const survivorWealths = survivors.map(a => a.wealth);
          const survivorLogWealths = survivors.map(a => Math.log10(a.wealth));
          
          // Early win rate among survivors
          if (Object.keys(agentTradeStats).length > 0) {
            const survivorEarlyWinRates = survivors.map(a => {
              const stats = agentTradeStats[a.id];
              if (!stats || stats.earlyTrades === 0) return 0.5;
              return stats.earlyWins / stats.earlyTrades;
            });
            correlations.push({
              name: '🏆 Survivor early win rate',
              description: 'Among survivors only: did win rate matter?',
              vsWealth: calculateCorrelation(survivorEarlyWinRates, survivorWealths),
              vsLogWealth: calculateCorrelation(survivorEarlyWinRates, survivorLogWealths),
              survivorsOnly: true
            });
          }
          
          // Checkpoint wealth among survivors
          CHECKPOINT_ROUNDS.forEach(cp => {
            const checkpointData = wealthCheckpoints[cp];
            if (checkpointData) {
              const survivorCheckpointWealths = survivors.map(a => checkpointData[a.id] || initialWealth);
              correlations.push({
                name: `🏆 Survivor wealth @ ${cp.toLocaleString()}`,
                description: 'Among survivors: early position → final rank',
                vsWealth: calculateCorrelation(survivorCheckpointWealths, survivorWealths),
                vsLogWealth: calculateCorrelation(survivorCheckpointWealths, survivorLogWealths),
                survivorsOnly: true
              });
            }
          });
        }
        
        // Sort by absolute correlation strength
        correlations.sort((a, b) => Math.abs(b.vsWealth || 0) - Math.abs(a.vsWealth || 0));
        
        setComprehensiveCorrelations({
          correlations,
          survivorCount: survivors.length,
          ruinedCount: agents.length - survivors.length,
          round
        });
      }
      
      // MOBILITY AND LEADERSHIP TRACKING
      if (agents.length > 0) {
        const sortedByWealth = [...agents].sort((a, b) => b.wealth - a.wealth);
        const currentLeader = sortedByWealth[0];
        const ruinThreshold = initialWealth * (RUIN_THRESHOLD_PERCENT / 100);
        
        // Track leadership changes
        setLeadershipHistory(prev => {
          const lastEntry = prev[prev.length - 1];
          const leaderChanged = !lastEntry || lastEntry.leaderId !== currentLeader.id;
          
          if (leaderChanged || prev.length === 0 || round % 10000 === 0) {
            const newEntry = {
              round,
              leaderId: currentLeader.id,
              leaderWealth: currentLeader.wealth,
              leaderChanged
            };
            const updated = [...prev, newEntry];
            
            // Calculate stats from within the callback to avoid stale state
            const leaderChanges = updated.filter(h => h.leaderChanged).length;
            const uniqueLeaders = new Set(updated.map(h => h.leaderId)).size;
            
            // Calculate current ranks
            const currentRanks = {};
            sortedByWealth.forEach((agent, idx) => {
              currentRanks[agent.id] = idx + 1;
            });
            
            const previousRanks = previousRanksRef.current;
            const survivors = sortedByWealth.filter(a => a.wealth >= ruinThreshold);
            
            // Calculate mobility stats if we have previous ranks
            if (Object.keys(previousRanks).length > 0) {
              let totalRankChange = 0;
              let agentsChanged = 0;
              let bigMoves = 0;
              
              agents.forEach(agent => {
                const prevRank = previousRanks[agent.id];
                const currRank = currentRanks[agent.id];
                
                if (prevRank !== undefined) {
                  const change = Math.abs(currRank - prevRank);
                  if (change > 0) {
                    totalRankChange += change;
                    agentsChanged++;
                  }
                  if (change >= 100) bigMoves++;
                }
              });
              
              setMobilityStats({
                avgRankChange: agentsChanged > 0 ? totalRankChange / agentsChanged : 0,
                agentsChangedRank: agentsChanged,
                bigMoves,
                leaderChanges,
                uniqueLeaders,
                currentLeaderId: currentLeader.id,
                currentLeaderWealth: currentLeader.wealth,
                survivorCount: survivors.length
              });
            }
            
            // Store current ranks for next comparison
            previousRanksRef.current = currentRanks;
            
            // Keep last 200 entries
            if (updated.length > 200) {
              return updated.slice(-200);
            }
            return updated;
          }
          return prev;
        });
      }
    }
  }, [agents, round, calculateStats, batchSize, selectedAgents, earlyLuckThreshold, agentTradeStats, calculateCorrelation, wealthCheckpoints, agentRuinTimes, numAgents, initialWealth]);

  useEffect(() => {
    let interval;
    if (isRunning) {
      interval = setInterval(runBatch, speed);
    }
    return () => clearInterval(interval);
  }, [isRunning, speed, runBatch]);

  const currentStats = agents.length > 0 ? calculateStats(agents.map(a => a.wealth)) : null;

  const handleAgentClick = (data) => {
    if (data && data.activePayload && data.activePayload[0]) {
      const agentId = data.activePayload[0].payload.agentId;
      setSelectedAgents(prev => {
        const newSet = new Set(prev);
        if (newSet.has(agentId)) {
          newSet.delete(agentId);
        } else {
          newSet.add(agentId);
        }
        return newSet;
      });
    }
  };

  const prepareAgentTrackingData = () => {
    const allRounds = new Set();
    Array.from(selectedAgents).forEach(agentId => {
      const history = agentWealthHistory[agentId] || [];
      history.forEach(point => allRounds.add(point.round));
    });
    
    return Array.from(allRounds).sort((a, b) => a - b).map(round => {
      const dataPoint = { round };
      Array.from(selectedAgents).forEach(agentId => {
        const history = agentWealthHistory[agentId] || [];
        const point = history.find(p => p.round === round);
        dataPoint[`agent_${agentId}`] = point ? point.wealth : null;
      });
      return dataPoint;
    });
  };

  // Prepare hypothesis testing scatter data
  const hypothesisScatterData = useMemo(() => {
    if (!earlyLuckCorrelation?.dataPoints) return [];
    return earlyLuckCorrelation.dataPoints.map(d => ({
      ...d,
      earlyWinRatePercent: d.earlyWinRate * 100,
      logFinalWealth: Math.log10(Math.max(0.01, d.finalWealth))
    }));
  }, [earlyLuckCorrelation]);

  // Quartile analysis for hypothesis testing
  const quartileAnalysis = useMemo(() => {
    if (!earlyLuckCorrelation?.dataPoints || earlyLuckCorrelation.dataPoints.length < 20) return null;
    
    const sorted = [...earlyLuckCorrelation.dataPoints].sort((a, b) => b.earlyWinRate - a.earlyWinRate);
    const q1Size = Math.floor(sorted.length / 4);
    
    const topQuartile = sorted.slice(0, q1Size);
    const bottomQuartile = sorted.slice(-q1Size);
    
    const avgFinalWealthTop = topQuartile.reduce((sum, d) => sum + d.finalWealth, 0) / topQuartile.length;
    const avgFinalWealthBottom = bottomQuartile.reduce((sum, d) => sum + d.finalWealth, 0) / bottomQuartile.length;
    
    const topInTop10Final = topQuartile.filter(d => {
      const rank = earlyLuckCorrelation.dataPoints.filter(other => other.finalWealth > d.finalWealth).length;
      return rank < earlyLuckCorrelation.dataPoints.length * 0.1;
    }).length;
    
    const bottomInTop10Final = bottomQuartile.filter(d => {
      const rank = earlyLuckCorrelation.dataPoints.filter(other => other.finalWealth > d.finalWealth).length;
      return rank < earlyLuckCorrelation.dataPoints.length * 0.1;
    }).length;
    
    return {
      topQuartileAvgWealth: avgFinalWealthTop,
      bottomQuartileAvgWealth: avgFinalWealthBottom,
      topQuartileInTop10Percent: (topInTop10Final / topQuartile.length) * 100,
      bottomQuartileInTop10Percent: (bottomInTop10Final / bottomQuartile.length) * 100,
      wealthRatio: avgFinalWealthTop / Math.max(0.01, avgFinalWealthBottom)
    };
  }, [earlyLuckCorrelation]);

  return (
    <div className="w-full max-w-7xl mx-auto p-6 bg-slate-50 min-h-screen font-sans">
      {/* Header */}
      <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 border border-slate-200">
        <h1 className="text-3xl font-bold text-slate-800 mb-2 tracking-tight">
          Yard Sale Simulation
        </h1>
        <p className="text-slate-600 mb-1 text-lg">
          The Mathematical Inevitability of Oligarchy
        </p>
        <p className="text-slate-500 mb-4">
          Watch how extreme wealth inequality emerges from <strong>perfectly fair 50/50 random exchanges</strong> between identical agents.
          Everyone starts with exactly ${initialWealth}.
        </p>
        
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 mb-4">
          <p className="text-sm text-emerald-800">
            <strong>✓ Model Verified:</strong> Each trade is a fair coin flip (50/50 odds). 
            The stake is always a percentage of the <em>poorer</em> agent's wealth. 
            All agents are identical—no skill, no advantages.
          </p>
        </div>
        
        {/* Controls */}
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <button
            onClick={() => setIsRunning(!isRunning)}
            className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all font-medium shadow-sm"
          >
            {isRunning ? <Pause size={18} /> : <Play size={18} />}
            {isRunning ? 'Pause' : 'Start'}
          </button>
          
          <button
            onClick={initializeSimulation}
            className="flex items-center gap-2 px-4 py-2.5 bg-slate-600 text-white rounded-xl hover:bg-slate-700 transition-all font-medium shadow-sm"
          >
            <RotateCcw size={18} />
            Reset
          </button>
          
          <button
            onClick={() => setShowSettings(!showSettings)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all font-medium shadow-sm ${showSettings ? 'bg-slate-800 text-white' : 'bg-slate-200 text-slate-700 hover:bg-slate-300'}`}
          >
            <Settings size={18} />
            Settings
          </button>
          
          <button
            onClick={() => setShowHypothesisPanel(!showHypothesisPanel)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all font-medium shadow-sm ${showHypothesisPanel ? 'bg-violet-600 text-white' : 'bg-violet-100 text-violet-700 hover:bg-violet-200'}`}
          >
            <FlaskConical size={18} />
            Hypothesis Testing
          </button>
          
          <div className="ml-auto text-lg font-semibold text-slate-700 bg-slate-100 px-4 py-2 rounded-xl">
            Round: {round.toLocaleString()}
          </div>
        </div>

        {/* Settings Panel */}
        {showSettings && (
          <div className="bg-slate-100 rounded-xl p-4 mb-4 border border-slate-200">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Agents</label>
                <input
                  type="number"
                  value={numAgents}
                  onChange={(e) => setNumAgents(parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white"
                  min="10"
                  max="5000"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Initial Wealth</label>
                <input
                  type="number"
                  value={initialWealth}
                  onChange={(e) => setInitialWealth(parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white"
                  min="1"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Max Transfer %</label>
                <input
                  type="range"
                  value={maxTransferPercent}
                  onChange={(e) => setMaxTransferPercent(parseInt(e.target.value))}
                  className="w-full"
                  min="1"
                  max="100"
                />
                <span className="text-sm text-slate-600">{maxTransferPercent}%</span>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Batch Size</label>
                <input
                  type="range"
                  value={batchSize}
                  onChange={(e) => setBatchSize(parseInt(e.target.value))}
                  className="w-full"
                  min="500"
                  max="10000"
                  step="500"
                />
                <span className="text-sm text-slate-600">{batchSize} rounds</span>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Speed (ms)</label>
                <input
                  type="range"
                  value={speed}
                  onChange={(e) => setSpeed(parseInt(e.target.value))}
                  className="w-full"
                  min="50"
                  max="1000"
                />
                <span className="text-sm text-slate-600">{speed}ms</span>
              </div>
            </div>
            
            <div className="mt-4">
              <label className="block text-sm font-medium text-slate-700 mb-1">
                "Early Period" Threshold (for hypothesis testing)
              </label>
              <input
                type="range"
                value={earlyLuckThreshold}
                onChange={(e) => setEarlyLuckThreshold(parseInt(e.target.value))}
                className="w-full"
                min="1000"
                max="20000"
                step="1000"
              />
              <span className="text-sm text-slate-600">First {earlyLuckThreshold.toLocaleString()} rounds = "early"</span>
            </div>
          </div>
        )}

        {/* Stats Dashboard */}
        {currentStats && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="bg-gradient-to-br from-red-50 to-red-100 p-4 rounded-xl border border-red-200">
                <div className="text-sm text-red-600 font-medium">Top 1% Controls</div>
                <div className="text-2xl font-bold text-red-700">{currentStats.top1Share.toFixed(1)}%</div>
              </div>
              <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-4 rounded-xl border border-orange-200">
                <div className="text-sm text-orange-600 font-medium">Top 10% Controls</div>
                <div className="text-2xl font-bold text-orange-700">{currentStats.top10Share.toFixed(1)}%</div>
              </div>
              <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 p-4 rounded-xl border border-emerald-200">
                <div className="text-sm text-emerald-600 font-medium">Richest Agent</div>
                <div className="text-2xl font-bold text-emerald-700">${currentStats.maxWealth.toFixed(0)}</div>
              </div>
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-xl border border-blue-200">
                <div className="text-sm text-blue-600 font-medium">Poorest Agent</div>
                <div className="text-2xl font-bold text-blue-700">${currentStats.minWealth.toFixed(4)}</div>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-violet-50 to-violet-100 p-4 rounded-xl border border-violet-200">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-violet-600 font-medium">Gini Coefficient</div>
                  <div className="text-3xl font-bold text-violet-700">{currentStats.gini.toFixed(3)}</div>
                </div>
                <div className="text-sm text-violet-600 text-right">
                  <div>0.000 = Perfect equality</div>
                  <div>1.000 = Total inequality</div>
                  <div className="text-xs mt-1 opacity-75">(US wealth ≈ 0.85)</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* HYPOTHESIS TESTING PANEL */}
      {showHypothesisPanel && (
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 border-2 border-violet-200">
          <div className="flex items-center gap-3 mb-4">
            <FlaskConical className="text-violet-600" size={24} />
            <h2 className="text-2xl font-bold text-slate-800">Survival Analysis: Why Inequality Emerges</h2>
          </div>
          
          <div className="bg-violet-50 rounded-xl p-4 mb-6 border border-violet-200">
            <p className="text-violet-900 mb-2">
              <strong>Key Insight:</strong> Inequality emerges not from "early luck compounding" but from <em>asymmetric ruin risk</em>. 
              Poor agents bet a larger fraction of their wealth, so they hit ruin while rich agents survive losing streaks.
            </p>
            <p className="text-violet-800 text-sm">
              Agents are "ruined" when wealth drops below {RUIN_THRESHOLD_PERCENT}% of starting (${(initialWealth * RUIN_THRESHOLD_PERCENT / 100).toFixed(2)}). 
              Once ruined, recovery is nearly impossible because stakes are tied to the poorer agent's wealth.
            </p>
          </div>
          
          {/* SURVIVAL ANALYSIS - PRIMARY EVIDENCE */}
          {survivalCorrelation && (
            <div className="bg-rose-50 rounded-xl p-4 mb-6 border-2 border-rose-300">
              <h3 className="font-bold text-rose-800 mb-3 text-lg">💀 Survival Analysis (Primary Evidence)</h3>
              
              <p className="text-xs text-rose-700 mb-4 italic bg-white/50 p-2 rounded">
                <strong>Why Log₁₀(Wealth)?</strong> Wealth spans many orders of magnitude ($0.0001 to $50,000+). 
                Log-transform treats "moving from $1 to $10" the same as "$100 to $1,000"—measuring 
                relative position rather than raw dollars, which are dominated by outliers.
              </p>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                <div className="bg-white/70 rounded-lg p-3 text-center">
                  <div className="text-xs font-medium text-slate-600 mb-1">Survival → Log₁₀(Wealth)</div>
                  <div className={`text-2xl font-bold ${
                    survivalCorrelation.logCorrelation > 0.8 ? 'text-rose-700' 
                    : survivalCorrelation.logCorrelation > 0.5 ? 'text-amber-600' 
                    : 'text-slate-600'
                  }`}>
                    r = {survivalCorrelation.logCorrelation.toFixed(3)}
                  </div>
                  <div className="text-xs text-slate-500">
                    {survivalCorrelation.logCorrelation > 0.8 ? '🔥 Very Strong' : 
                     survivalCorrelation.logCorrelation > 0.5 ? 'Strong' : 'Moderate'}
                  </div>
                </div>
                
                <div className="bg-white/70 rounded-lg p-3 text-center">
                  <div className="text-xs font-medium text-slate-600 mb-1">Still "Alive"</div>
                  <div className="text-2xl font-bold text-emerald-700">
                    {survivalCorrelation.aliveCount}
                  </div>
                  <div className="text-xs text-slate-500">
                    {survivalCorrelation.alivePercent.toFixed(1)}% of agents
                  </div>
                </div>
                
                <div className="bg-white/70 rounded-lg p-3 text-center">
                  <div className="text-xs font-medium text-slate-600 mb-1">"Ruined"</div>
                  <div className="text-2xl font-bold text-red-700">
                    {survivalCorrelation.ruinedCount}
                  </div>
                  <div className="text-xs text-slate-500">
                    below ${(initialWealth * RUIN_THRESHOLD_PERCENT / 100).toFixed(2)}
                  </div>
                </div>
                
                <div className="bg-white/70 rounded-lg p-3 text-center">
                  <div className="text-xs font-medium text-slate-600 mb-1">Wealth Ratio</div>
                  <div className="text-2xl font-bold text-violet-700">
                    {survivalCorrelation.wealthRatio === Infinity ? '∞' : survivalCorrelation.wealthRatio.toFixed(0)}x
                  </div>
                  <div className="text-xs text-slate-500">
                    survivors vs ruined
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="bg-emerald-100/50 rounded-lg p-3">
                  <div className="text-sm font-medium text-emerald-800">Survivors</div>
                  <div className="text-lg font-bold text-emerald-700">
                    Avg wealth: ${survivalCorrelation.avgSurvivorWealth.toFixed(2)}
                  </div>
                  <div className="text-xs text-emerald-600">
                    {survivalCorrelation.survivorsInTop10Percent.toFixed(1)}% of survivors are in top 10% overall
                  </div>
                </div>
                <div className="bg-red-100/50 rounded-lg p-3">
                  <div className="text-sm font-medium text-red-800">Ruined</div>
                  <div className="text-lg font-bold text-red-700">
                    Avg wealth: ${survivalCorrelation.avgRuinedWealth.toFixed(4)}
                  </div>
                  <div className="text-xs text-red-600">
                    Effectively out of the game
                  </div>
                </div>
              </div>
              
              {/* Survival Curve Chart */}
              {survivalCurve.length > 1 && (
                <div className="bg-white rounded-lg p-3">
                  <h4 className="font-medium text-slate-700 mb-2 text-center">Survival Curve: Agents Above Ruin Threshold Over Time</h4>
                  <ResponsiveContainer width="100%" height={200}>
                    <LineChart data={survivalCurve}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                      <XAxis 
                        dataKey="round" 
                        tickFormatter={(v) => `${(v/1000).toFixed(0)}k`}
                      />
                      <YAxis 
                        domain={[0, 100]}
                        tickFormatter={(v) => `${v}%`}
                      />
                      <Tooltip 
                        formatter={(value, name) => [`${value.toFixed(1)}%`, 'Alive']}
                        labelFormatter={(v) => `Round ${v.toLocaleString()}`}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="alivePercent" 
                        stroke="#dc2626" 
                        strokeWidth={2}
                        dot={false}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                  <p className="text-xs text-slate-500 text-center mt-1">
                    As more agents hit ruin, the remaining wealth concentrates among survivors
                  </p>
                </div>
              )}
              
              {/* Interpretation */}
              <div className="mt-4 p-3 bg-white/70 rounded-lg">
                <p className="text-sm text-rose-900 mb-2">
                  {survivalCorrelation.logCorrelation > 0.7 ? (
                    <>
                      <strong>✓ Confirmed:</strong> Survival time strongly predicts final wealth (r = {survivalCorrelation.logCorrelation.toFixed(3)}). 
                      The {survivalCorrelation.aliveCount} agents who never hit ruin control virtually all wealth, 
                      while the {survivalCorrelation.ruinedCount} ruined agents are stuck near zero. 
                      It's not about <em>winning more</em>—it's about <em>never hitting bottom</em>.
                    </>
                  ) : survivalCorrelation.ruinedCount < numAgents * 0.1 ? (
                    <>
                      <strong>Building...</strong> Only {survivalCorrelation.ruinedCount} agents have hit ruin so far. 
                      Run more rounds to see the survival correlation strengthen as more agents drop out.
                    </>
                  ) : (
                    <>
                      <strong>Evidence accumulating:</strong> {survivalCorrelation.ruinedCount} agents have hit ruin. 
                      The correlation between survival and log-wealth is {survivalCorrelation.logCorrelation.toFixed(3)}.
                    </>
                  )}
                </p>
              </div>
            </div>
          )}
          
          {/* Show waiting message if no survival data yet */}
          {!survivalCorrelation && (
            <div className="bg-rose-50 rounded-xl p-4 mb-6 border border-rose-200">
              <h3 className="font-bold text-rose-800 mb-2">💀 Survival Analysis</h3>
              <p className="text-rose-700 text-sm">
                Waiting for agents to hit ruin threshold (below ${(initialWealth * RUIN_THRESHOLD_PERCENT / 100).toFixed(2)})...
              </p>
              <p className="text-rose-600 text-xs mt-1">
                Run the simulation longer to see which agents survive and which hit ruin.
              </p>
            </div>
          )}
          
          {/* COMPREHENSIVE CORRELATION ANALYSIS */}
          {comprehensiveCorrelations && (
            <div className="bg-blue-50 rounded-xl p-4 mb-6 border-2 border-blue-300">
              <h3 className="font-bold text-blue-800 mb-3 text-lg">🔬 Comprehensive Correlation Analysis</h3>
              <p className="text-sm text-blue-700 mb-4">
                Testing ALL available metrics against final wealth. Sorted by correlation strength.
                Includes both linear (vs Wealth) and log-transformed (vs Log₁₀ Wealth) correlations.
              </p>
              
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b-2 border-blue-300">
                      <th className="text-left py-2 px-2 text-blue-800">Metric</th>
                      <th className="text-right py-2 px-2 text-blue-800">vs Wealth</th>
                      <th className="text-right py-2 px-2 text-blue-800">vs Log₁₀(Wealth)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {comprehensiveCorrelations.correlations.map((corr, idx) => (
                      <tr 
                        key={idx} 
                        className={`border-b border-blue-200 ${corr.survivorsOnly ? 'bg-amber-50' : ''}`}
                      >
                        <td className="py-2 px-2">
                          <div className="font-medium text-slate-800">{corr.name}</div>
                          <div className="text-xs text-slate-500">{corr.description}</div>
                        </td>
                        <td className={`text-right py-2 px-2 font-bold ${
                          Math.abs(corr.vsWealth) > 0.7 ? 'text-emerald-600' 
                          : Math.abs(corr.vsWealth) > 0.5 ? 'text-amber-600' 
                          : Math.abs(corr.vsWealth) > 0.3 ? 'text-blue-600'
                          : 'text-slate-500'
                        }`}>
                          {corr.vsWealth !== null ? corr.vsWealth.toFixed(3) : '—'}
                        </td>
                        <td className={`text-right py-2 px-2 font-bold ${
                          Math.abs(corr.vsLogWealth) > 0.7 ? 'text-emerald-600' 
                          : Math.abs(corr.vsLogWealth) > 0.5 ? 'text-amber-600' 
                          : Math.abs(corr.vsLogWealth) > 0.3 ? 'text-blue-600'
                          : 'text-slate-500'
                        }`}>
                          {corr.vsLogWealth !== null ? corr.vsLogWealth.toFixed(3) : '—'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              <div className="mt-4 p-3 bg-white/70 rounded-lg">
                <p className="text-xs text-blue-800">
                  <strong>Reading the table:</strong> Higher absolute values = stronger correlation. 
                  Green (r &gt; 0.7) = strong predictor. Amber (r &gt; 0.5) = moderate. 
                  🏆 rows show correlations among <em>survivors only</em> (what determines who becomes the oligarch?).
                </p>
                {comprehensiveCorrelations.survivorCount > 0 && (
                  <p className="text-xs text-blue-700 mt-2">
                    Currently {comprehensiveCorrelations.survivorCount} survivors, {comprehensiveCorrelations.ruinedCount} ruined.
                  </p>
                )}
              </div>
            </div>
          )}
          
          {/* MOBILITY AND LEADERSHIP TRACKING */}
          {mobilityStats && (
            <div className="bg-amber-50 rounded-xl p-4 mb-6 border-2 border-amber-300">
              <h3 className="font-bold text-amber-800 mb-3 text-lg">👑 Leadership & Mobility: Do the Rich Stay Rich?</h3>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                <div className="bg-white/70 rounded-lg p-3 text-center">
                  <div className="text-xs font-medium text-slate-600 mb-1">Current Leader</div>
                  <div className="text-xl font-bold text-amber-700">
                    Agent #{mobilityStats.currentLeaderId + 1}
                  </div>
                  <div className="text-xs text-slate-500">
                    ${mobilityStats.currentLeaderWealth.toFixed(2)}
                  </div>
                </div>
                
                <div className="bg-white/70 rounded-lg p-3 text-center">
                  <div className="text-xs font-medium text-slate-600 mb-1">Leadership Changes</div>
                  <div className="text-xl font-bold text-violet-700">
                    {mobilityStats.leaderChanges}
                  </div>
                  <div className="text-xs text-slate-500">
                    times #1 spot changed hands
                  </div>
                </div>
                
                <div className="bg-white/70 rounded-lg p-3 text-center">
                  <div className="text-xs font-medium text-slate-600 mb-1">Unique Leaders</div>
                  <div className="text-xl font-bold text-blue-700">
                    {mobilityStats.uniqueLeaders}
                  </div>
                  <div className="text-xs text-slate-500">
                    different agents held #1
                  </div>
                </div>
                
                <div className="bg-white/70 rounded-lg p-3 text-center">
                  <div className="text-xs font-medium text-slate-600 mb-1">Survivors</div>
                  <div className="text-xl font-bold text-emerald-700">
                    {mobilityStats.survivorCount}
                  </div>
                  <div className="text-xs text-slate-500">
                    still above ruin threshold
                  </div>
                </div>
              </div>
              
              {/* Leadership history chart */}
              {leadershipHistory.length > 5 && (
                <div className="bg-white rounded-lg p-3 mb-4">
                  <h4 className="font-medium text-slate-700 mb-2 text-center">Leadership Changes Over Time</h4>
                  <ResponsiveContainer width="100%" height={150}>
                    <LineChart data={leadershipHistory.filter(h => h.leaderChanged || leadershipHistory.indexOf(h) % 5 === 0)}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                      <XAxis 
                        dataKey="round" 
                        tickFormatter={(v) => `${(v/1000).toFixed(0)}k`}
                      />
                      <YAxis 
                        domain={[0, numAgents]}
                        tickFormatter={(v) => `#${v}`}
                        label={{ value: 'Leader Agent ID', angle: -90, position: 'insideLeft', fontSize: 10 }}
                      />
                      <Tooltip 
                        formatter={(value, name) => {
                          if (name === 'leaderId') return [`Agent #${value + 1}`, 'Leader'];
                          return [value, name];
                        }}
                        labelFormatter={(v) => `Round ${v.toLocaleString()}`}
                      />
                      <Line 
                        type="stepAfter" 
                        dataKey="leaderId" 
                        stroke="#f59e0b" 
                        strokeWidth={2}
                        dot={(props) => {
                          const { cx, cy, payload } = props;
                          if (payload.leaderChanged) {
                            return <circle cx={cx} cy={cy} r={4} fill="#dc2626" />;
                          }
                          return null;
                        }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                  <p className="text-xs text-slate-500 text-center mt-1">
                    Red dots = leadership changed. Flat lines = same leader maintained position.
                  </p>
                </div>
              )}
              
              <div className="p-3 bg-white/70 rounded-lg">
                <p className="text-sm text-amber-900">
                  <strong>Key Finding:</strong> {mobilityStats.leaderChanges > 5 ? (
                    <>
                      The #1 spot has changed hands <strong>{mobilityStats.leaderChanges} times</strong> among {mobilityStats.uniqueLeaders} different agents. 
                      Among survivors, positions are <em>not</em> locked—the rich can fall and others can rise. 
                      However, once ruined, agents <em>never</em> recover to challenge for the top.
                    </>
                  ) : mobilityStats.leaderChanges > 0 ? (
                    <>
                      Leadership has changed {mobilityStats.leaderChanges} time(s) so far. 
                      Keep running to see if positions continue to shuffle among survivors.
                    </>
                  ) : (
                    <>
                      The same agent has held the #1 spot since the beginning. 
                      This may change as the simulation continues—run more rounds to see.
                    </>
                  )}
                </p>
                
                {mobilityStats.survivorCount <= 10 && mobilityStats.survivorCount > 1 && (
                  <p className="text-sm text-amber-800 mt-2">
                    <strong>Endgame approaching:</strong> Only {mobilityStats.survivorCount} survivors remain. 
                    They'll continue trading until one agent has everything (Gini = 1.0). 
                    The final winner is still being determined randomly among these survivors.
                  </p>
                )}
              </div>
            </div>
          )}
          
          {/* THE ONE-WAY DOOR: Why poor stay poor, rich stay safe */}
          {agents.length > 0 && Object.keys(agentRuinTimes).length > 0 && (
            <div className="bg-slate-800 rounded-xl p-4 mb-6 border-2 border-slate-600">
              <h3 className="font-bold text-white mb-4 text-lg">🚪 The One-Way Door: Why Escape is Impossible</h3>
              
              {(() => {
                const ruinThreshold = initialWealth * (RUIN_THRESHOLD_PERCENT / 100);
                const sortedByWealth = [...agents].sort((a, b) => b.wealth - a.wealth);
                const survivors = sortedByWealth.filter(a => a.wealth >= ruinThreshold);
                const ruined = sortedByWealth.filter(a => a.wealth < ruinThreshold);
                
                // Calculate "cushion" - how many max losses until ruin
                const calculateLossesToRuin = (wealth) => {
                  if (wealth <= ruinThreshold) return 0;
                  let w = wealth;
                  let losses = 0;
                  while (w > ruinThreshold && losses < 1000) {
                    w = w * (1 - maxTransferPercent / 100);
                    losses++;
                  }
                  return losses;
                };
                
                // Calculate "climb" - how many max wins to escape ruin
                const calculateWinsToEscape = (wealth) => {
                  if (wealth >= ruinThreshold) return 0;
                  let w = wealth;
                  let wins = 0;
                  while (w < ruinThreshold && wins < 100000) {
                    w = w * (1 + maxTransferPercent / 100);
                    wins++;
                  }
                  return wins;
                };
                
                // Calculate odds of winning N times in a row at 50/50
                const calculateOdds = (wins) => {
                  if (wins <= 0) return 1;
                  // Probability = 0.5^wins, but we want to show "1 in X"
                  // log10(2^wins) = wins * log10(2) ≈ wins * 0.301
                  const exponent = Math.floor(wins * Math.log10(2));
                  return exponent;
                };
                
                const richest = survivors[0];
                const medianSurvivor = survivors[Math.floor(survivors.length / 2)];
                const poorestSurvivor = survivors[survivors.length - 1];
                const medianRuined = ruined[Math.floor(ruined.length / 2)];
                
                const richestLosses = richest ? calculateLossesToRuin(richest.wealth) : 0;
                const medianSurvivorLosses = medianSurvivor ? calculateLossesToRuin(medianSurvivor.wealth) : 0;
                const poorestSurvivorLosses = poorestSurvivor ? calculateLossesToRuin(poorestSurvivor.wealth) : 0;
                const ruinedWinsNeeded = medianRuined ? calculateWinsToEscape(medianRuined.wealth) : 0;
                const oddsExponent = calculateOdds(ruinedWinsNeeded);
                
                return (
                  <>
                    {/* Big stark comparison boxes */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      
                      {/* SURVIVORS SIDE - Green */}
                      <div className="bg-gradient-to-br from-emerald-900 to-emerald-800 rounded-xl p-4 border border-emerald-500">
                        <div className="text-center mb-4">
                          <div className="text-emerald-300 text-sm font-medium mb-1">🛡️ SURVIVORS CAN LOSE</div>
                          <div className="text-emerald-100 text-xs">Consecutive worst-case losses before ruin</div>
                        </div>
                        
                        <div className="grid grid-cols-3 gap-2">
                          {richest && (
                            <div className="bg-emerald-950/50 rounded-lg p-3 text-center">
                              <div className="text-4xl font-black text-emerald-300">{richestLosses}</div>
                              <div className="text-xs text-emerald-400 mt-1">Richest</div>
                              <div className="text-xs text-emerald-500/70">${richest.wealth.toFixed(0)}</div>
                            </div>
                          )}
                          {medianSurvivor && (
                            <div className="bg-emerald-950/50 rounded-lg p-3 text-center">
                              <div className="text-4xl font-black text-emerald-300">{medianSurvivorLosses}</div>
                              <div className="text-xs text-emerald-400 mt-1">Median</div>
                              <div className="text-xs text-emerald-500/70">${medianSurvivor.wealth.toFixed(0)}</div>
                            </div>
                          )}
                          {poorestSurvivor && (
                            <div className="bg-emerald-950/50 rounded-lg p-3 text-center">
                              <div className="text-4xl font-black text-amber-300">{poorestSurvivorLosses}</div>
                              <div className="text-xs text-amber-400 mt-1">Poorest</div>
                              <div className="text-xs text-amber-500/70">${poorestSurvivor.wealth.toFixed(2)}</div>
                            </div>
                          )}
                        </div>
                        
                        <div className="text-center mt-3">
                          <p className="text-emerald-200 text-xs">
                            Even the poorest survivor has a buffer. The rich can weather catastrophic streaks.
                          </p>
                        </div>
                      </div>
                      
                      {/* RUINED SIDE - Red */}
                      <div className="bg-gradient-to-br from-red-900 to-red-800 rounded-xl p-4 border border-red-500">
                        <div className="text-center mb-4">
                          <div className="text-red-300 text-sm font-medium mb-1">⛓️ RUINED MUST WIN</div>
                          <div className="text-red-100 text-xs">Consecutive best-case wins needed to escape</div>
                        </div>
                        
                        <div className="bg-red-950/50 rounded-lg p-4 text-center">
                          <div className="text-5xl font-black text-red-300">{ruinedWinsNeeded.toLocaleString()}</div>
                          <div className="text-sm text-red-400 mt-1">wins in a row</div>
                          {medianRuined && (
                            <div className="text-xs text-red-500/70">to climb from ${medianRuined.wealth.toFixed(6)}</div>
                          )}
                        </div>
                        
                        {/* THE ODDS - This is the gut punch */}
                        <div className="bg-black/30 rounded-lg p-3 mt-3 text-center">
                          <div className="text-red-200 text-xs mb-1">Probability of this happening:</div>
                          <div className="text-2xl font-bold text-white">
                            1 in 10<sup className="text-lg">{oddsExponent.toLocaleString()}</sup>
                          </div>
                          <div className="text-red-300 text-xs mt-2 leading-relaxed">
                            {oddsExponent < 3 ? (
                              `Like flipping heads ${Math.round(oddsExponent / 0.301)} times in a row`
                            ) : oddsExponent < 9 ? (
                              `Worse than winning Powerball (1 in 10⁸)`
                            ) : oddsExponent < 17 ? (
                              `Like winning Powerball twice in a row`
                            ) : oddsExponent < 25 ? (
                              `Like winning Powerball three times in a row`
                            ) : oddsExponent < 50 ? (
                              `Like everyone in the US winning Powerball on the same day`
                            ) : oddsExponent < 80 ? (
                              `Like shuffling a deck into perfect order—then doing it again`
                            ) : oddsExponent < 200 ? (
                              <>Like randomly picking the same atom from all 10<sup>80</sup> atoms in the universe</>
                            ) : (
                              <>Equal to winning Powerball <strong>{Math.round(oddsExponent / 8).toLocaleString()} times in a row</strong></>
                            )}
                          </div>
                          {oddsExponent >= 80 && (
                            <div className="text-red-500/80 text-xs mt-2 italic">
                              This will never happen. Ever.
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    {/* Bottom summary - The Asymmetry */}
                    <div className="bg-slate-700/50 rounded-lg p-4">
                      <div className="grid grid-cols-3 gap-4 text-center mb-3">
                        <div>
                          <div className="text-4xl font-black text-emerald-400">{survivors.length}</div>
                          <div className="text-xs text-slate-400">survivors</div>
                        </div>
                        <div>
                          <div className="text-4xl font-black text-red-400">{ruined.length}</div>
                          <div className="text-xs text-slate-400">ruined</div>
                        </div>
                        <div>
                          <div className="text-4xl font-black text-white">0</div>
                          <div className="text-xs text-slate-400">ever recovered</div>
                        </div>
                      </div>
                      <p className="text-slate-300 text-sm text-center">
                        <strong>The door only swings one way.</strong> After {round.toLocaleString()} rounds, 
                        <span className="text-red-400"> zero agents</span> have escaped ruin.
                        {survivors.length > 1 && (
                          <span className="text-emerald-400"> Survivors shuffle among themselves, but never fall.</span>
                        )}
                      </p>
                    </div>
                  </>
                );
              })()}
            </div>
          )}
          
          {/* Checkpoint Correlations - SECONDARY */}
          {Object.keys(checkpointCorrelations).length > 0 && (
            <div className="bg-slate-50 rounded-xl p-4 mb-6 border border-slate-200">
              <h3 className="font-medium text-slate-700 mb-3">📊 Wealth Checkpoint Correlations (Secondary)</h3>
              <p className="text-sm text-slate-600 mb-4">
                Early wealth position vs final wealth (r &gt; 0.9 = fates sealed)
              </p>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                {CHECKPOINT_ROUNDS.map(checkpointRound => {
                  const corr = checkpointCorrelations[checkpointRound];
                  const hasData = corr !== undefined;
                  const captured = wealthCheckpoints[checkpointRound] !== undefined;
                  
                  return (
                    <div 
                      key={checkpointRound} 
                      className={`rounded-lg p-3 text-center ${
                        hasData 
                          ? corr > 0.9 ? 'bg-emerald-200 border-2 border-emerald-500' 
                          : corr > 0.7 ? 'bg-emerald-100 border border-emerald-400'
                          : corr > 0.5 ? 'bg-amber-100 border border-amber-400'
                          : 'bg-slate-100 border border-slate-300'
                          : captured ? 'bg-amber-50 border border-amber-200' : 'bg-slate-50 border border-slate-200'
                      }`}
                    >
                      <div className="text-xs font-medium text-slate-600 mb-1">Round {checkpointRound.toLocaleString()}</div>
                      {hasData ? (
                        <>
                          <div className={`text-2xl font-bold ${
                            corr > 0.9 ? 'text-emerald-700' 
                            : corr > 0.7 ? 'text-emerald-600'
                            : corr > 0.5 ? 'text-amber-600'
                            : 'text-slate-600'
                          }`}>
                            r = {corr.toFixed(3)}
                          </div>
                          <div className="text-xs text-slate-500">
                            {corr > 0.95 ? '🔒 Locked in' : corr > 0.9 ? 'Sealed' : corr > 0.7 ? 'Strong' : corr > 0.5 ? 'Moderate' : 'Weak'}
                          </div>
                        </>
                      ) : captured ? (
                        <div className="text-sm text-amber-600">Captured, waiting...</div>
                      ) : round < checkpointRound ? (
                        <div className="text-sm text-slate-400">Pending</div>
                      ) : (
                        <div className="text-sm text-slate-400">—</div>
                      )}
                    </div>
                  );
                })}
              </div>
              
              {/* Interpretation of checkpoint correlations */}
              {Object.keys(checkpointCorrelations).length > 0 && (
                <div className="mt-4 p-3 bg-white/70 rounded-lg">
                  <p className="text-sm text-emerald-900">
                    {(() => {
                      const sortedCheckpoints = Object.entries(checkpointCorrelations)
                        .sort((a, b) => parseInt(a[0]) - parseInt(b[0]));
                      const firstHighCorr = sortedCheckpoints.find(([_, corr]) => corr > 0.9);
                      const latestCorr = sortedCheckpoints[sortedCheckpoints.length - 1];
                      
                      if (firstHighCorr) {
                        return (
                          <>
                            <strong>✓ Hypothesis confirmed:</strong> Fates are effectively sealed by round {parseInt(firstHighCorr[0]).toLocaleString()} (r = {firstHighCorr[1].toFixed(3)}). 
                            Agents' wealth at this early checkpoint predicts {(firstHighCorr[1] * firstHighCorr[1] * 100).toFixed(0)}% of the variance in their final wealth.
                          </>
                        );
                      } else if (latestCorr && latestCorr[1] > 0.7) {
                        return (
                          <>
                            <strong>Strong evidence:</strong> By round {parseInt(latestCorr[0]).toLocaleString()}, early wealth shows r = {latestCorr[1].toFixed(3)} correlation with final outcomes. 
                            Fates are becoming locked in.
                          </>
                        );
                      } else {
                        return (
                          <>
                            <strong>Building evidence:</strong> Run more rounds to see when correlations strengthen. 
                            We expect checkpoint correlations to approach r &gt; 0.9 as oligarchy deepens.
                          </>
                        );
                      }
                    })()}
                  </p>
                </div>
              )}
            </div>
          )}
          
          {/* Checkpoint progress indicator */}
          {Object.keys(checkpointCorrelations).length === 0 && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
              <p className="text-amber-800 mb-2">
                <strong>Capturing wealth checkpoints...</strong>
              </p>
              <div className="flex gap-2 flex-wrap">
                {CHECKPOINT_ROUNDS.map(cp => (
                  <span 
                    key={cp} 
                    className={`px-2 py-1 rounded text-xs ${
                      round >= cp 
                        ? wealthCheckpoints[cp] ? 'bg-emerald-200 text-emerald-800' : 'bg-amber-200 text-amber-800'
                        : 'bg-slate-200 text-slate-600'
                    }`}
                  >
                    {cp.toLocaleString()} {round >= cp && wealthCheckpoints[cp] ? '✓' : round >= cp ? '...' : ''}
                  </span>
                ))}
              </div>
              <p className="text-xs text-amber-600 mt-2">
                Need ~5,000 more rounds after each checkpoint to calculate correlation with current wealth.
              </p>
            </div>
          )}
          
          {round < earlyLuckThreshold ? (
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
              <p className="text-slate-600 text-sm">
                <strong>Also tracking:</strong> Early win rates ({round.toLocaleString()} / {earlyLuckThreshold.toLocaleString()} rounds)
              </p>
              <div className="w-full bg-slate-200 rounded-full h-1.5 mt-2">
                <div 
                  className="bg-slate-400 h-1.5 rounded-full transition-all"
                  style={{ width: `${(round / earlyLuckThreshold) * 100}%` }}
                />
              </div>
            </div>
          ) : earlyLuckCorrelation ? (
            <div className="space-y-6">
              {/* Win Rate Correlation Results - Secondary evidence */}
              <div className="border-t border-slate-200 pt-6">
                <h4 className="font-medium text-slate-700 mb-3">Secondary Metric: Early Win Rate Correlations</h4>
                <p className="text-xs text-slate-500 mb-3">
                  Note: Win rate is a noisy proxy because late wins against poor opponents don't help much.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-slate-100 rounded-xl p-4">
                    <div className="text-sm text-slate-600 font-medium">Early Win Rate → Final Wealth</div>
                    <div className={`text-2xl font-bold ${earlyLuckCorrelation.winRateCorrelation > 0.5 ? 'text-emerald-600' : earlyLuckCorrelation.winRateCorrelation > 0.3 ? 'text-amber-600' : 'text-slate-600'}`}>
                      r = {earlyLuckCorrelation.winRateCorrelation.toFixed(3)}
                    </div>
                    <div className="text-xs text-slate-500 mt-1">
                      {earlyLuckCorrelation.winRateCorrelation > 0.7 ? 'Very strong' : 
                       earlyLuckCorrelation.winRateCorrelation > 0.5 ? 'Strong' :
                       earlyLuckCorrelation.winRateCorrelation > 0.3 ? 'Moderate' : 'Weak'}
                    </div>
                  </div>
                  
                  <div className="bg-slate-100 rounded-xl p-4">
                    <div className="text-sm text-slate-600 font-medium">Early Net Wins → Final Wealth</div>
                    <div className={`text-2xl font-bold ${earlyLuckCorrelation.netWinsCorrelation > 0.5 ? 'text-emerald-600' : earlyLuckCorrelation.netWinsCorrelation > 0.3 ? 'text-amber-600' : 'text-slate-600'}`}>
                      r = {earlyLuckCorrelation.netWinsCorrelation.toFixed(3)}
                    </div>
                    <div className="text-xs text-slate-500 mt-1">
                      Based on {earlyLuckCorrelation.sampleSize} agents
                    </div>
                  </div>
                  
                  {quartileAnalysis && (
                    <div className="bg-slate-100 rounded-xl p-4">
                      <div className="text-sm text-slate-600 font-medium">Wealth Ratio by Early Luck Quartile</div>
                      <div className="text-2xl font-bold text-violet-600">
                        {quartileAnalysis.wealthRatio.toFixed(1)}x
                      </div>
                      <div className="text-xs text-slate-500 mt-1">
                        Top vs bottom quartile
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Quartile Deep Dive */}
              {quartileAnalysis && (
                <div className="bg-gradient-to-r from-emerald-50 to-red-50 rounded-xl p-4 border border-slate-200">
                  <h4 className="font-bold text-slate-800 mb-3">Quartile Analysis: Early Luck Predicts Outcomes</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white/70 rounded-lg p-3">
                      <div className="text-sm font-medium text-emerald-700">Top 25% Early Win Rate</div>
                      <div className="text-lg font-bold text-emerald-800">
                        Avg Final: ${quartileAnalysis.topQuartileAvgWealth.toFixed(2)}
                      </div>
                      <div className="text-sm text-emerald-600">
                        {quartileAnalysis.topQuartileInTop10Percent.toFixed(1)}% ended in top 10% final wealth
                      </div>
                    </div>
                    <div className="bg-white/70 rounded-lg p-3">
                      <div className="text-sm font-medium text-red-700">Bottom 25% Early Win Rate</div>
                      <div className="text-lg font-bold text-red-800">
                        Avg Final: ${quartileAnalysis.bottomQuartileAvgWealth.toFixed(2)}
                      </div>
                      <div className="text-sm text-red-600">
                        {quartileAnalysis.bottomQuartileInTop10Percent.toFixed(1)}% ended in top 10% final wealth
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Scatter Plot: Early Win Rate vs Final Wealth */}
              <div className="bg-slate-50 rounded-xl p-4">
                <h4 className="font-bold text-slate-800 mb-3 text-center">Early Win Rate vs Final Wealth (Log Scale)</h4>
                <ResponsiveContainer width="100%" height={350}>
                  <ScatterChart margin={{ top: 10, right: 30, bottom: 50, left: 60 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis 
                      dataKey="earlyWinRatePercent" 
                      type="number"
                      domain={[35, 65]}
                      label={{ value: 'Early Win Rate (%)', position: 'insideBottom', offset: -10 }}
                      tickFormatter={(v) => `${v.toFixed(0)}%`}
                    />
                    <YAxis 
                      dataKey="logFinalWealth"
                      domain={[-2, 5]}
                      label={{ value: 'Final Wealth (log₁₀ scale)', angle: -90, position: 'insideLeft', offset: 10 }}
                      tickFormatter={(v) => `$${Math.pow(10, v).toFixed(0)}`}
                    />
                    <Tooltip 
                      formatter={(value, name) => {
                        if (name === 'logFinalWealth') return [`$${Math.pow(10, value).toFixed(2)}`, 'Final Wealth'];
                        if (name === 'earlyWinRatePercent') return [`${value.toFixed(1)}%`, 'Early Win Rate'];
                        return [value, name];
                      }}
                      labelFormatter={() => ''}
                    />
                    <ReferenceLine x={50} stroke="#94a3b8" strokeDasharray="5 5" label={{ value: '50% (expected)', position: 'top' }} />
                    <Scatter 
                      data={hypothesisScatterData} 
                      fill="#7c3aed"
                      fillOpacity={0.6}
                    />
                  </ScatterChart>
                </ResponsiveContainer>
                <p className="text-xs text-slate-500 mt-2 text-center">
                  Each dot is an agent. X-axis: their win rate during the first {earlyLuckThreshold.toLocaleString()} rounds. Y-axis: their final wealth.
                </p>
              </div>
              
              {/* Interpretation */}
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <h4 className="font-bold text-blue-800 mb-2">Interpretation</h4>
                <p className="text-blue-900 text-sm">
                  {earlyLuckCorrelation.winRateCorrelation > 0.5 ? (
                    <>
                      <strong>Strong evidence for the hypothesis.</strong> Early luck shows a strong correlation (r={earlyLuckCorrelation.winRateCorrelation.toFixed(2)}) with final wealth. 
                      Agents who won slightly more than 50% of early trades ended up dramatically wealthier—not because they're "better" at trading 
                      (everyone has identical 50/50 odds), but because early gains compound multiplicatively. 
                      {quartileAnalysis && ` Those in the top quartile of early luck averaged ${quartileAnalysis.wealthRatio.toFixed(1)}x the wealth of the bottom quartile.`}
                    </>
                  ) : earlyLuckCorrelation.winRateCorrelation > 0.3 ? (
                    <>
                      <strong>Moderate evidence for the hypothesis.</strong> There's a noticeable correlation (r={earlyLuckCorrelation.winRateCorrelation.toFixed(2)}) between early luck and final outcomes. 
                      The effect exists but may be partially obscured by later-round variance. Run more rounds to see if the correlation strengthens as oligarchy deepens.
                    </>
                  ) : (
                    <>
                      <strong>Weak correlation so far.</strong> The relationship between early luck and final wealth is still emerging. 
                      This may indicate we need more rounds, or that the "early period" threshold should be adjusted. 
                      In heavily oligarchic states, early advantages should show clearer compounding effects.
                    </>
                  )}
                </p>
              </div>
            </div>
          ) : (
            <div className="bg-slate-100 rounded-xl p-4 text-slate-600">
              Waiting for enough data to analyze...
            </div>
          )}
        </div>
      )}

      {/* Main Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-200">
          <h3 className="text-xl font-bold text-slate-800 mb-4 text-center">Wealth Distribution</h3>
          <ResponsiveContainer width="100%" height={350}>
            <ScatterChart 
              data={distributionData}
              onClick={handleAgentClick}
              margin={{ top: 10, right: 30, bottom: 50, left: 80 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis 
                dataKey="displayId" 
                type="number"
                domain={[1, numAgents]}
                label={{ value: 'Agent (ranked by wealth)', position: 'insideBottom', offset: -10 }}
              />
              <YAxis 
                dataKey="wealth"
                domain={[0, numAgents * initialWealth * 0.1]}
                label={{ value: 'Wealth ($)', angle: -90, position: 'insideLeft', offset: 10 }}
                tickFormatter={(value) => `$${value.toLocaleString()}`}
              />
              <Tooltip 
                formatter={(value) => [`$${value.toFixed(2)}`, 'Wealth']}
                labelFormatter={(value) => `Rank #${value}`}
              />
              <Scatter 
                dataKey="wealth" 
                fill="#3b82f6"
                stroke="#1e40af"
                strokeWidth={0.5}
                style={{ cursor: 'pointer' }}
              />
            </ScatterChart>
          </ResponsiveContainer>
          <p className="text-xs text-slate-500 mt-2 text-center">
            Click agents to track them over time
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-200">
          <h3 className="text-xl font-bold text-slate-800 mb-4 text-center">Concentration Over Time</h3>
          <ResponsiveContainer width="100%" height={350}>
            <LineChart data={wealthHistory}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="round" tickFormatter={(v) => `${(v/1000).toFixed(0)}k`} />
              <YAxis />
              <Tooltip labelFormatter={(v) => `Round ${v.toLocaleString()}`} />
              <Legend />
              <Line type="monotone" dataKey="top1" stroke="#dc2626" strokeWidth={2} name="Top 1% Share %" dot={false} />
              <Line type="monotone" dataKey="top10" stroke="#ea580c" strokeWidth={2} name="Top 10% Share %" dot={false} />
              <Line type="monotone" dataKey="gini" stroke="#7c3aed" strokeWidth={2} name="Gini × 100" dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Individual Agent Tracking */}
      {selectedAgents.size > 0 && !showComparison && (
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 border border-slate-200">
          <h3 className="text-xl font-bold text-slate-800 mb-2 text-center">Individual Agent Tracking</h3>
          <p className="text-sm text-slate-600 mb-4 text-center">
            Watch how individual trajectories diverge despite identical starting conditions and fair odds.
          </p>
          <ResponsiveContainer width="100%" height={350}>
            <LineChart data={prepareAgentTrackingData()}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis 
                dataKey="round" 
                label={{ value: 'Round', position: 'insideBottom', offset: -5 }}
                tickFormatter={(v) => `${(v/1000).toFixed(0)}k`}
              />
              <YAxis 
                label={{ value: 'Wealth ($)', angle: -90, position: 'insideLeft' }}
                tickFormatter={(value) => `$${value.toLocaleString()}`}
              />
              <Tooltip 
                formatter={(value, name) => {
                  if (value === null) return ['No data', name];
                  const agentId = name.split('_')[1];
                  return [`$${value.toFixed(2)}`, `Agent ${parseInt(agentId) + 1}`];
                }}
                labelFormatter={(value) => `Round ${value.toLocaleString()}`}
              />
              <Legend formatter={(value) => `Agent ${parseInt(value.split('_')[1]) + 1}`} />
              {Array.from(selectedAgents).map((agentId, index) => {
                const colors = ['#dc2626', '#ea580c', '#16a34a', '#2563eb', '#7c3aed', '#db2777', '#0891b2', '#65a30d'];
                return (
                  <Line
                    key={agentId}
                    type="monotone"
                    dataKey={`agent_${agentId}`}
                    stroke={colors[index % colors.length]}
                    strokeWidth={2}
                    connectNulls={false}
                    dot={false}
                  />
                );
              })}
            </LineChart>
          </ResponsiveContainer>
          
          <div className="mt-4 flex flex-wrap gap-2">
            <button
              onClick={() => {
                const top5 = distributionData.slice(0, 5).map(d => d.agentId);
                setSelectedAgents(new Set(top5));
              }}
              className="px-3 py-1.5 bg-emerald-500 text-white text-sm rounded-lg hover:bg-emerald-600 transition-colors"
            >
              Top 5 Richest
            </button>
            <button
              onClick={() => {
                const bottom5 = distributionData.slice(-5).map(d => d.agentId);
                setSelectedAgents(new Set(bottom5));
              }}
              className="px-3 py-1.5 bg-red-500 text-white text-sm rounded-lg hover:bg-red-600 transition-colors"
            >
              Bottom 5 Poorest
            </button>
            <button
              onClick={() => {
                const sortedByWealth = [...agents].sort((a, b) => b.wealth - a.wealth);
                const medianAgent = sortedByWealth[Math.floor(sortedByWealth.length / 2)];
                setSelectedAgents(new Set([medianAgent.id]));
              }}
              className="px-3 py-1.5 bg-amber-500 text-white text-sm rounded-lg hover:bg-amber-600 transition-colors"
            >
              Median Agent
            </button>
            <button
              onClick={() => setShowComparison(true)}
              className="px-3 py-1.5 bg-violet-500 text-white text-sm rounded-lg hover:bg-violet-600 transition-colors"
            >
              Compare Outcomes
            </button>
            <button
              onClick={() => setSelectedAgents(new Set())}
              className="px-3 py-1.5 bg-slate-400 text-white text-sm rounded-lg hover:bg-slate-500 transition-colors"
            >
              Clear Selection
            </button>
          </div>
        </div>
      )}

      {/* Comparative Analysis */}
      {showComparison && (
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 border border-slate-200">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold text-slate-800">Comparative Agent Outcomes: How Timing Matters</h3>
            <button
              onClick={() => setShowComparison(false)}
              className="px-3 py-1.5 bg-slate-500 text-white text-sm rounded-lg hover:bg-slate-600 transition-colors"
            >
              Back to Tracking
            </button>
          </div>
          
          {(() => {
            const sortedByWealth = [...agents].sort((a, b) => b.wealth - a.wealth);
            const richestAgent = sortedByWealth[0];
            const poorestAgent = sortedByWealth[sortedByWealth.length - 1];
            const medianAgent = sortedByWealth[Math.floor(sortedByWealth.length / 2)];
            
            const compareAgents = [richestAgent, medianAgent, poorestAgent];
            const labels = ['Richest Agent', 'Median Agent', 'Poorest Agent'];
            const colors = ['#16a34a', '#f59e0b', '#dc2626'];
            
            return (
              <div className="space-y-6">
                <p className="text-sm text-slate-600">
                  This comparison shows how three agents with identical starting conditions (${initialWealth} each) ended up with vastly different outcomes 
                  through purely random, fair trades. Early gains or losses compound over time in multiplicative wealth transfer systems.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {compareAgents.map((agent, idx) => {
                    const stats = agentTradeStats[agent.id];
                    return (
                      <div key={agent.id} className="border-2 rounded-xl p-4" style={{ borderColor: colors[idx] }}>
                        <div className="text-center mb-3">
                          <div className="text-sm font-medium text-slate-600">{labels[idx]}</div>
                          <div className="text-2xl font-bold" style={{ color: colors[idx] }}>
                            Agent #{agent.id + 1}
                          </div>
                        </div>
                        
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-slate-600">Current Wealth:</span>
                            <span className="font-bold">${agent.wealth.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-600">Started With:</span>
                            <span>${initialWealth}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-600">Net Change:</span>
                            <span className="font-bold" style={{ color: agent.wealth >= initialWealth ? '#16a34a' : '#dc2626' }}>
                              {agent.wealth >= initialWealth ? '+' : ''}
                              ${(agent.wealth - initialWealth).toFixed(2)}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-600">Multiple:</span>
                            <span className="font-bold">{(agent.wealth / initialWealth).toFixed(2)}x</span>
                          </div>
                          
                          {/* Early Luck Stats */}
                          {stats && stats.earlyTrades > 0 && (
                            <>
                              <div className="border-t border-slate-200 pt-2 mt-2">
                                <div className="text-xs font-medium text-slate-500 mb-1">Early Period Stats (first {earlyLuckThreshold.toLocaleString()} rounds)</div>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-slate-600">Early Win Rate:</span>
                                <span className={`font-bold ${(stats.earlyWins / stats.earlyTrades) > 0.5 ? 'text-emerald-600' : (stats.earlyWins / stats.earlyTrades) < 0.5 ? 'text-red-600' : 'text-slate-600'}`}>
                                  {((stats.earlyWins / stats.earlyTrades) * 100).toFixed(1)}%
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-slate-600">Early Net Wins:</span>
                                <span className={`font-bold ${stats.earlyWins - stats.earlyLosses > 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                                  {stats.earlyWins - stats.earlyLosses > 0 ? '+' : ''}{stats.earlyWins - stats.earlyLosses}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-slate-600">Early Trades:</span>
                                <span className="font-bold">{stats.earlyTrades}</span>
                              </div>
                            </>
                          )}
                          
                          {/* Survival Status */}
                          {Object.keys(agentRuinTimes).length > 0 && (
                            <>
                              <div className="border-t border-slate-200 pt-2 mt-2">
                                <div className="text-xs font-medium text-slate-500 mb-1">Survival Status</div>
                              </div>
                              {agentRuinTimes[agent.id] !== undefined ? (
                                <div className="flex justify-between">
                                  <span className="text-slate-600">Hit Ruin:</span>
                                  <span className="font-bold text-red-600">
                                    Round {agentRuinTimes[agent.id].toLocaleString()} 💀
                                  </span>
                                </div>
                              ) : (
                                <div className="flex justify-between">
                                  <span className="text-slate-600">Status:</span>
                                  <span className="font-bold text-emerald-600">
                                    Still Alive ✓
                                  </span>
                                </div>
                              )}
                            </>
                          )}
                          
                          {/* Checkpoint Wealth Data */}
                          {Object.keys(wealthCheckpoints).length > 0 && (
                            <>
                              <div className="border-t border-slate-200 pt-2 mt-2">
                                <div className="text-xs font-medium text-slate-500 mb-1">Wealth at Checkpoints</div>
                              </div>
                              {CHECKPOINT_ROUNDS.map(cp => {
                                const checkpointData = wealthCheckpoints[cp];
                                if (!checkpointData) return null;
                                const wealthAtCheckpoint = checkpointData[agent.id];
                                if (wealthAtCheckpoint === undefined) return null;
                                
                                const vsStart = wealthAtCheckpoint - initialWealth;
                                return (
                                  <div key={cp} className="flex justify-between">
                                    <span className="text-slate-600">Round {cp.toLocaleString()}:</span>
                                    <span className={`font-bold ${vsStart > 0 ? 'text-emerald-600' : vsStart < 0 ? 'text-red-600' : 'text-slate-600'}`}>
                                      ${wealthAtCheckpoint.toFixed(2)}
                                    </span>
                                  </div>
                                );
                              })}
                            </>
                          )}
                        </div>
                        
                        {/* Wealth Journey */}
                        <div className="mt-3 pt-3 border-t">
                          <div className="text-xs text-slate-500 font-medium mb-1">Wealth Journey:</div>
                          <div className="max-h-40 overflow-y-auto text-xs font-mono bg-slate-50 p-2 rounded">
                            {(() => {
                              const history = agentWealthHistory[agent.id] || [];
                              if (history.length === 0) return <div className="text-slate-400">No history yet</div>;
                              
                              // Show first 30 entries, then sample every few entries
                              const first30 = history.slice(0, 30);
                              const remaining = history.slice(30);
                              const sampled = remaining.filter((_, index) => index % 5 === 0);
                              
                              const combined = [...first30, ...sampled];
                              
                              return combined.map((entry, i) => (
                                <div key={i} className="flex justify-between py-0.5 border-b border-slate-200">
                                  <span className="text-slate-600">Round {entry.round.toLocaleString()}:</span>
                                  <span className="font-semibold">${entry.wealth.toFixed(2)}</span>
                                </div>
                              ));
                            })()}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
                
                {/* Side-by-side visual comparison */}
                <div className="mt-6">
                  <h4 className="text-lg font-bold text-slate-800 mb-3 text-center">Visual Comparison: Three Identical Starting Points, Three Divergent Paths</h4>
                  <ResponsiveContainer width="100%" height={350}>
                    <LineChart data={(() => {
                      // Combine histories of all three agents
                      const allRounds = new Set();
                      compareAgents.forEach(agent => {
                        const history = agentWealthHistory[agent.id] || [];
                        history.forEach(point => allRounds.add(point.round));
                      });
                      
                      return Array.from(allRounds).sort((a, b) => a - b).map(r => {
                        const dataPoint = { round: r };
                        compareAgents.forEach((agent, idx) => {
                          const history = agentWealthHistory[agent.id] || [];
                          const point = history.find(p => p.round === r);
                          dataPoint[labels[idx]] = point ? point.wealth : null;
                        });
                        return dataPoint;
                      });
                    })()}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                      <XAxis 
                        dataKey="round" 
                        label={{ value: 'Round', position: 'insideBottom', offset: -5 }}
                        tickFormatter={(v) => `${(v/1000).toFixed(0)}k`}
                      />
                      <YAxis 
                        label={{ value: 'Wealth ($)', angle: -90, position: 'insideLeft' }}
                        tickFormatter={(value) => `$${value.toLocaleString()}`}
                      />
                      <Tooltip 
                        formatter={(value, name) => value !== null ? [`$${value.toFixed(2)}`, name] : ['No data', name]}
                        labelFormatter={(value) => `Round ${value.toLocaleString()}`}
                      />
                      <Legend />
                      {labels.map((label, idx) => (
                        <Line
                          key={label}
                          type="monotone"
                          dataKey={label}
                          stroke={colors[idx]}
                          strokeWidth={3}
                          connectNulls={false}
                          dot={false}
                        />
                      ))}
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                  <div className="text-sm text-blue-900">
                    <strong>Key Insight:</strong> These three agents had identical starting conditions and faced the same random, fair trading rules (50/50 odds every trade). 
                    The extreme divergence in outcomes demonstrates how multiplicative wealth transfer systems naturally concentrate wealth, 
                    regardless of individual merit, effort, or ability. Early random fluctuations compound over time, creating path dependency 
                    where initial luck becomes amplified into permanent advantage or disadvantage.
                  </div>
                </div>
              </div>
            );
          })()}
        </div>
      )}

      {/* Explanation */}
      <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-200">
        <h3 className="text-xl font-bold text-slate-800 mb-4">How It Works</h3>
        <div className="space-y-4 text-slate-700">
          <p>
            <strong>The Yard Sale Rule:</strong> Two agents meet. They bet a random fraction of the 
            <em> poorer</em> agent's wealth. A fair coin flip determines who wins. That's it.
          </p>
          
          <p>
            <strong>Why Inequality Emerges:</strong> The key is <em>asymmetric ruin risk</em>. When a poor agent 
            ($50) trades with a rich agent ($5,000), both bet based on the poorer agent's wealth. The poor agent 
            is risking up to 40% of everything they have; the rich agent is risking 0.4% of theirs. The rich can 
            survive dozens of losses; the poor cannot survive even a few.
          </p>
          
          <p>
            <strong>The Ruin Trap:</strong> Once an agent's wealth drops below ~1% of starting wealth, they're 
            effectively "ruined." Their stakes become so tiny (fractions of a cent) that even winning streaks 
            can't help them recover. Meanwhile, agents who never hit ruin accumulate the wealth of those who did.
          </p>
          
          <p>
            <strong>It's Not About Winning More:</strong> Survivors don't necessarily have better win rates.
            They simply avoided the ruin threshold long enough. In a fair 50/50 game, <em>survival time</em> predicts final wealth far better than win rate does. The last ones standing inherit everything.
          </p>
        </div>
      </div>
    </div>
  );
};

export default YardSaleSimulation;