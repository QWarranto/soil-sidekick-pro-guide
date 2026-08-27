// Gamma Storm Tracker - Mock Data Generator
// For off-market testing and development

const GST = window.GST || {};

GST.MockData = {
    // 5 Comprehensive test scenarios
    scenarios: [
        {
            id: 'perfect-call',
            name: 'Perfect CALL Setup',
            description: 'All 6 rules pass - ideal mean reversion long',
            ticker: 'SPY',
            timestamp: new Date('2026-01-15T10:30:00').getTime(),
            spotPrice: 478.50,
            data: {
                gammaMetrics: {
                    netGammaExposure: 1.4,
                    gammaFlip: 476.25,
                    callWall: 480.00,
                    putSupport: 475.00,
                    regime: 'NEGATIVE_GAMMA',
                    zoneWidth: 1.05,
                    expiration: '2025-02-21',
                    dte: 37
                },
                confluence: {
                    flipDistance: 1.2,      // ATRs above flip
                    wallSeparation: 2.1,     // Good wall distance
                    ivSkew: 6.5,             // Puts expensive
                    unusualActivity: true,   // Elevated call volume
                    maxPainDistance: 1.2,    // Price above max pain
                    score: 4                 // 4/5 indicators aligned
                },
                ohlcv: {
                    history: [
                        { time: '09:30', open: 476.50, high: 477.75, low: 476.00, close: 477.00, volume: 2500000 },
                        { time: '10:00', open: 477.00, high: 478.50, low: 476.75, close: 477.50, volume: 1800000 },
                        { time: '10:30', open: 477.50, high: 479.50, low: 477.25, close: 478.50, volume: 2100000 }  // Cross above flip!
                    ]
                },
                flow: {
                    darkPoolSentiment: 'neutral',
                    optionsFlowDelta: 0.3,
                    blockTrades: 'balanced'
                },
                activity: {
                    callUnusual: true,
                    putUnusual: false,
                    callVolume: 45000,
                    putVolume: 12000
                }
            },
            expected: {
                signal: 'CALL',
                confidence: 92,
                rulesPassed: ['gammaRegime', 'confluence', 'flowSanity', '30mClose', 'gapRule', 'activity'],
                rulesFailed: [],
                suggestedContract: {
                    strike: 480,
                    expiration: '2025-02-21',
                    delta: 0.55,
                    premium: 850
                },
                position: {
                    size: 2,
                    entry: 478.50,
                    stop: 476.50,
                    target: 481.50,
                    maxHoldDays: 5
                }
            }
        },
        
        {
            id: 'perfect-put',
            name: 'Perfect PUT Setup',
            description: 'All 6 rules pass - ideal mean reversion short',
            ticker: 'QQQ',
            timestamp: new Date('2026-01-15T14:30:00').getTime(),
            spotPrice: 412.50,
            data: {
                gammaMetrics: {
                    netGammaExposure: -1.3,
                    gammaFlip: 414.75,
                    callWall: 416.00,
                    putSupport: 410.00,
                    regime: 'POSITIVE_GAMMA',
                    zoneWidth: 1.46,
                    expiration: '2025-02-21',
                    dte: 37
                },
                confluence: {
                    flipDistance: 1.1,
                    wallSeparation: 2.3,
                    ivSkew: 5.8,
                    unusualActivity: true,
                    maxPainDistance: -1.1,
                    score: 4
                },
                ohlcv: {
                    history: [
                        { time: '13:30', open: 415.00, high: 415.50, low: 413.50, close: 414.50, volume: 1500000 },
                        { time: '14:00', open: 414.50, high: 414.75, low: 412.50, close: 413.25, volume: 1200000 },
                        { time: '14:30', open: 413.25, high: 413.50, low: 411.50, close: 412.50, volume: 1800000 }  // Cross below flip!
                    ]
                },
                flow: {
                    darkPoolSentiment: 'bearish',
                    optionsFlowDelta: -0.4,
                    blockTrades: 'sellHeavy'
                },
                activity: {
                    callUnusual: false,
                    putUnusual: true,
                    callVolume: 8000,
                    putVolume: 38000
                }
            },
            expected: {
                signal: 'PUT',
                confidence: 88,
                rulesPassed: ['gammaRegime', 'confluence', 'flowSanity', '30mClose', 'gapRule', 'activity'],
                rulesFailed: [],
                suggestedContract: {
                    strike: 412,
                    expiration: '2025-02-21',
                    delta: -0.52,
                    premium: 920
                },
                position: {
                    size: 2,
                    entry: 412.50,
                    stop: 414.50,
                    target: 409.50,
                    maxHoldDays: 4
                }
            }
        },
        
        {
            id: 'failed-confluence',
            name: 'Failed Confluence',
            description: 'Good gamma regime but only 2/5 indicators align',
            ticker: 'IWM',
            timestamp: new Date('2026-01-15T11:00:00').getTime(),
            spotPrice: 215.25,
            data: {
                gammaMetrics: {
                    netGammaExposure: 1.1,
                    gammaFlip: 214.50,
                    callWall: 217.00,
                    putSupport: 213.00,
                    regime: 'NEGATIVE_GAMMA',
                    zoneWidth: 1.86,
                    expiration: '2025-02-21',
                    dte: 37
                },
                confluence: {
                    flipDistance: 0.4,       // Too close to flip
                    wallSeparation: 1.2,     // Walls too close
                    ivSkew: 2.1,             // Skew too flat
                    unusualActivity: false,  // No unusual activity
                    maxPainDistance: 0.3,    // Price near max pain
                    score: 2                 // Only 2/5 - FAIL
                },
                ohlcv: {
                    history: [
                        { time: '10:00', open: 214.75, high: 215.50, low: 214.25, close: 214.80, volume: 800000 },
                        { time: '10:30', open: 214.80, high: 215.75, low: 214.60, close: 215.10, volume: 750000 },
                        { time: '11:00', open: 215.10, high: 215.50, low: 214.90, close: 215.25, volume: 600000 }
                    ]
                },
                flow: {
                    darkPoolSentiment: 'mixed',
                    optionsFlowDelta: 0.1,
                    blockTrades: 'balanced'
                },
                activity: {
                    callUnusual: false,
                    putUnusual: false,
                    callVolume: 5000,
                    putVolume: 4500
                }
            },
            expected: {
                signal: 'NONE',
                confidence: 0,
                rulesPassed: ['gammaRegime'],
                rulesFailed: ['confluence', 'flowSanity', '30mClose', 'gapRule', 'activity'],
                suggestedContract: null,
                position: null
            }
        },
        
        {
            id: 'no-gamma-regime',
            name: 'No Gamma Regime',
            description: 'Insufficient gamma exposure for mean reversion',
            ticker: 'AAPL',
            timestamp: new Date('2026-01-15T12:00:00').getTime(),
            spotPrice: 195.75,
            data: {
                gammaMetrics: {
                    netGammaExposure: 0.4,   // FAIL: < 1.0%
                    gammaFlip: 195.50,
                    callWall: 197.00,
                    putSupport: 194.00,
                    regime: 'NEUTRAL',
                    zoneWidth: 1.53,
                    expiration: '2025-02-21',
                    dte: 37
                },
                confluence: {
                    flipDistance: 0.8,
                    wallSeparation: 2.1,
                    ivSkew: 4.5,
                    unusualActivity: true,
                    maxPainDistance: 0.9,
                    score: 4  // Good confluence but gamma too low
                },
                ohlcv: {
                    history: [
                        { time: '11:00', open: 195.00, high: 196.00, low: 194.80, close: 195.20, volume: 1200000 },
                        { time: '11:30', open: 195.20, high: 196.25, low: 195.10, close: 195.80, volume: 1100000 },
                        { time: '12:00', open: 195.80, high: 196.50, low: 195.50, close: 195.75, volume: 1300000 }
                    ]
                },
                flow: {
                    darkPoolSentiment: 'bullish',
                    optionsFlowDelta: 0.5,
                    blockTrades: 'buyHeavy'
                },
                activity: {
                    callUnusual: true,
                    putUnusual: false,
                    callVolume: 25000,
                    putVolume: 8000
                }
            },
            expected: {
                signal: 'NONE',
                confidence: 0,
                rulesPassed: ['confluence', 'flowSanity', '30mClose', 'gapRule', 'activity'],
                rulesFailed: ['gammaRegime'],
                suggestedContract: null,
                position: null
            }
        },
        
        {
            id: 'illiquid-options',
            name: 'Illiquid Options - Rejected',
            description: 'Good setup but options too illiquid for entry',
            ticker: 'AMD',
            timestamp: new Date('2026-01-15T13:30:00').getTime(),
            spotPrice: 145.50,
            data: {
                gammaMetrics: {
                    netGammaExposure: 1.5,
                    gammaFlip: 144.25,
                    callWall: 147.00,
                    putSupport: 142.00,
                    regime: 'NEGATIVE_GAMMA',
                    zoneWidth: 3.44,
                    expiration: '2025-02-21',
                    dte: 37
                },
                confluence: {
                    flipDistance: 1.3,
                    wallSeparation: 2.8,
                    ivSkew: 7.2,
                    unusualActivity: true,
                    maxPainDistance: 1.4,
                    score: 5  // Perfect confluence
                },
                ohlcv: {
                    history: [
                        { time: '12:30', open: 143.50, high: 144.80, low: 143.20, close: 144.00, volume: 2500000 },
                        { time: '13:00', open: 144.00, high: 145.50, low: 143.80, close: 144.80, volume: 2200000 },
                        { time: '13:30', open: 144.80, high: 146.00, low: 144.50, close: 145.50, volume: 2800000 }
                    ]
                },
                flow: {
                    darkPoolSentiment: 'bullish',
                    optionsFlowDelta: 0.6,
                    blockTrades: 'buyHeavy'
                },
                activity: {
                    callUnusual: true,
                    putUnusual: false,
                    callVolume: 15000,
                    putVolume: 4000
                },
                illiquidity: {
                    // These would cause contract picker to reject
                    spread: 0.18,      // 18% spread - too wide
                    oi: 45,            // Only 45 contracts OI - too low
                    volume: 2          // Only 2 contracts traded today
                }
            },
            expected: {
                signal: 'CALL',
                confidence: 85,
                rulesPassed: ['gammaRegime', 'confluence', 'flowSanity', '30mClose', 'gapRule', 'activity'],
                rulesFailed: [],
                suggestedContract: null,  // REJECTED due to illiquidity
                rejectionReason: 'Spread 18% > 10%, OI 45 < 500',
                position: null
            }
        }
    ],
    
    currentScenarioIndex: 0,
    
    // Get current scenario
    getCurrent() {
        return this.scenarios[this.currentScenarioIndex];
    },
    
    // Get next scenario
    next() {
        this.currentScenarioIndex = (this.currentScenarioIndex + 1) % this.scenarios.length;
        return this.getCurrent();
    },
    
    // Get previous scenario
    previous() {
        this.currentScenarioIndex = (this.currentScenarioIndex - 1 + this.scenarios.length) % this.scenarios.length;
        return this.getCurrent();
    },
    
    // Get scenario by ID
    getById(id) {
        return this.scenarios.find(s => s.id === id);
    },
    
    // Apply scenario to tracker
    applyScenario(scenario) {
        if (!scenario) scenario = this.getCurrent();
        
        // Update global state
        window.currentTicker = scenario.ticker;
        document.getElementById('tickerInput').value = scenario.ticker;
        
        // Create mock lastData structure
        window.lastData = this.generateMockORATSData(scenario);
        
        // Tag as mock data with scenario reference
        window.lastData._mockScenario = scenario;
        window.lastData._isMockData = true;
        
        // Trigger data load simulation
        if (window.calculateGammaMetrics) {
            const metrics = window.calculateGammaMetrics(window.lastData);
            if (window.renderEnhancedOptionsChain) {
                window.renderEnhancedOptionsChain(metrics);
            }
            if (window.updateMetricsUI) {
                window.updateMetricsUI(metrics);
            }
        }
        
        // Add to log
        if (window.addStormLog) {
            window.addStormLog('🧪', `Loaded mock scenario: ${scenario.name}`, scenario.ticker);
        }
        
        return scenario;
    },
    
    // Generate mock ORATS-compatible data structure
    generateMockORATSData(scenario) {
        const strikes = [];
        const spot = scenario.spotPrice;
        const flip = scenario.data.gammaMetrics.gammaFlip;
        
        // Generate strikes around spot (±10 strikes)
        for (let i = -10; i <= 10; i++) {
            const strike = spot + (i * 2.5);
            const distanceFromFlip = Math.abs(strike - flip);
            const isAboveFlip = strike > flip;
            
            // Generate realistic Greeks
            const callGamma = isAboveFlip ? 
                Math.max(0.001, 0.005 - (distanceFromFlip * 0.0001)) :
                Math.max(0.0005, 0.003 - (distanceFromFlip * 0.0001));
            
            const putGamma = !isAboveFlip ?
                Math.max(0.001, 0.005 - (distanceFromFlip * 0.0001)) :
                Math.max(0.0005, 0.003 - (distanceFromFlip * 0.0001));
            
            strikes.push({
                strike: strike,
                stockPrice: spot,
                expirDate: scenario.data.gammaMetrics.expiration,
                dte: scenario.data.gammaMetrics.dte,
                callIv: 25 + (distanceFromFlip * 0.5) + (Math.random() * 2),
                callDelta: isAboveFlip ? 0.5 + (distanceFromFlip * 0.02) : 0.5 - (distanceFromFlip * 0.02),
                callGamma: callGamma,
                callTheta: -(callGamma * 100 * 0.1),
                callVega: callGamma * 100 * 0.5,
                callOpenInterest: Math.floor(Math.random() * 50000) + 1000,
                putIv: 26 + (distanceFromFlip * 0.6) + (Math.random() * 2),
                putDelta: !isAboveFlip ? -0.5 - (distanceFromFlip * 0.02) : -0.5 + (distanceFromFlip * 0.02),
                putGamma: putGamma,
                putTheta: -(putGamma * 100 * 0.1),
                putVega: putGamma * 100 * 0.5,
                putOpenInterest: Math.floor(Math.random() * 50000) + 1000
            });
        }
        
        return {
            data: strikes,
            ticker: scenario.ticker,
            tradeDate: new Date(scenario.timestamp).toISOString().split('T')[0]
        };
    },
    
    // Get all scenarios for UI
    getAll() {
        return this.scenarios.map(s => ({
            id: s.id,
            name: s.name,
            description: s.description,
            expectedSignal: s.expected.signal
        }));
    },
    
    // Reset to first scenario
    reset() {
        this.currentScenarioIndex = 0;
        return this.getCurrent();
    }
};

console.log('✅ GST.MockData loaded - 5 test scenarios available');
console.log('   Usage: GST.MockData.applyScenario() or GST.MockData.next()');
