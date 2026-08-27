// GST Playbook Engine v1.2 - Mean Reversion Rules
// Deterministic trading logic with full audit trail

(function() {
    'use strict';
    
    window.GST = window.GST || {};
    
    GST.playbook = {
        // Version
        VERSION: '1.2.0',
        
        // Evaluate v1.2 Mean Reversion strategy
        evaluateV12MR(context) {
            const {
                ticker,
                spotPrice,
                gammaMetrics,
                ohlcv,
                confluence,
                flow,
                activity,
                optionsChain,
                atr
            } = context;
            
            GST.logger.debug('Evaluating v1.2 MR', { ticker, spotPrice });
            
            // Initialize result
            const result = {
                timestamp: Date.now(),
                ticker,
                signal: 'NONE',
                confidence: 0,
                levels: null,
                contractRules: null,
                trace: []
            };
            
            // Calculate ATR if not provided
            const atrValue = atr || (ohlcv ? GST.utils.calculateATR(ohlcv.history) : 1.0);
            
            // ═══════════════════════════════════════════════════════════════
            // RULE 1: Gamma Regime Check
            // ═══════════════════════════════════════════════════════════════
            const gammaExposure = Math.abs(gammaMetrics?.netGammaExposure || 0);
            const gammaRegimePass = gammaExposure >= GST.config.playbook.minGammaExposure;
            
            result.trace.push({
                ruleId: 'gammaRegime',
                name: 'Gamma Regime',
                pass: gammaRegimePass,
                value: gammaExposure,
                threshold: GST.config.playbook.minGammaExposure,
                note: `Net gamma exposure: ${(gammaExposure * 100).toFixed(1)}% ${gammaRegimePass ? '≥' : '<'} ${(GST.config.playbook.minGammaExposure * 100).toFixed(1)}% threshold`
            });
            
            // ═══════════════════════════════════════════════════════════════
            // RULE 2: Confluence Check
            // ═══════════════════════════════════════════════════════════════
            let confluenceScore = 0;
            const confluenceChecks = [];
            
            // 2a: Flip distance
            const flipDistance = Math.abs(spotPrice - gammaMetrics?.gammaFlip) / atrValue;
            const flipDistancePass = flipDistance > 1.0;
            if (flipDistancePass) {
                confluenceScore++;
                confluenceChecks.push('flipDistance');
            }
            
            // 2b: Wall separation
            const wallSeparation = Math.abs(gammaMetrics?.callWall - gammaMetrics?.putSupport) / atrValue;
            const wallSeparationPass = wallSeparation > 2.0;
            if (wallSeparationPass) {
                confluenceScore++;
                confluenceChecks.push('wallSeparation');
            }
            
            // 2c: IV Skew
            const ivSkew = confluence?.ivSkew || 0;
            const ivSkewPass = ivSkew > 5.0;
            if (ivSkewPass) {
                confluenceScore++;
                confluenceChecks.push('ivSkew');
            }
            
            // 2d: Unusual activity
            const unusualActivityPass = activity?.callUnusual || activity?.putUnusual;
            if (unusualActivityPass) {
                confluenceScore++;
                confluenceChecks.push('unusualActivity');
            }
            
            // 2e: Max pain distance
            const maxPainDistance = Math.abs(confluence?.maxPainDistance || 0);
            const maxPainPass = maxPainDistance > 1.0;
            if (maxPainPass) {
                confluenceScore++;
                confluenceChecks.push('maxPainDistance');
            }
            
            const confluencePass = confluenceScore >= GST.config.playbook.minConfluenceScore;
            
            result.trace.push({
                ruleId: 'confluence',
                name: 'Confluence',
                pass: confluencePass,
                value: confluenceScore,
                threshold: GST.config.playbook.minConfluenceScore,
                note: `${confluenceScore}/5 indicators aligned (${confluenceChecks.join(', ')})`
            });
            
            // ═══════════════════════════════════════════════════════════════
            // RULE 3: Flow Sanity Check
            // ═══════════════════════════════════════════════════════════════
            const flowConflict = flow?.darkPoolSentiment === 'bearish' || 
                                 flow?.optionsFlowDelta < -0.3;
            const flowPass = !flowConflict;
            
            result.trace.push({
                ruleId: 'flowSanity',
                name: 'Flow Sanity',
                pass: flowPass,
                value: flow?.optionsFlowDelta || 0,
                threshold: -0.3,
                note: flowConflict ? 'Conflicting flow detected' : 'Flow aligned or neutral'
            });
            
            // ═══════════════════════════════════════════════════════════════
            // RULE 4: 30m Close Cross Detection
            // ═══════════════════════════════════════════════════════════════
            let closeCrossPass = false;
            let crossDirection = null;
            
            if (ohlcv?.history && ohlcv.history.length >= 2) {
                const current = ohlcv.history[ohlcv.history.length - 1];
                const previous = ohlcv.history[ohlcv.history.length - 2];
                const flip = gammaMetrics?.gammaFlip;
                
                // Bullish cross: close above flip
                if (previous.close <= flip && current.close > flip) {
                    closeCrossPass = true;
                    crossDirection = 'CALL';
                }
                // Bearish cross: close below flip
                else if (previous.close >= flip && current.close < flip) {
                    closeCrossPass = true;
                    crossDirection = 'PUT';
                }
            }
            
            result.trace.push({
                ruleId: '30mClose',
                name: '30m Close Cross',
                pass: closeCrossPass,
                value: crossDirection || 'none',
                threshold: 'cross',
                note: closeCrossPass ? `${crossDirection} signal: price crossed ${gammaMetrics?.gammaFlip}` : 'No cross detected'
            });
            
            // ═══════════════════════════════════════════════════════════════
            // RULE 5: Gap Rule (Pullback or Second Close)
            // ═══════════════════════════════════════════════════════════════
            let gapRulePass = false;
            let gapRuleNote = '';
            
            if (ohlcv?.history && ohlcv.history.length >= 3 && closeCrossPass) {
                const current = ohlcv.history[ohlcv.history.length - 1];
                const previous = ohlcv.history[ohlcv.history.length - 2];
                const beforePrevious = ohlcv.history[ohlcv.history.length - 3];
                const flip = gammaMetrics?.gammaFlip;
                
                // Condition A: Pullback to flip after initial cross
                if (crossDirection === 'CALL') {
                    // Initial cross happened, then pullback to flip, then bounce
                    if (beforePrevious.close <= flip && previous.close > flip && 
                        current.close > previous.close) {
                        gapRulePass = true;
                        gapRuleNote = 'Pullback retest confirmed';
                    }
                } else if (crossDirection === 'PUT') {
                    if (beforePrevious.close >= flip && previous.close < flip && 
                        current.close < previous.close) {
                        gapRulePass = true;
                        gapRuleNote = 'Pullback retest confirmed';
                    }
                }
                
                // Condition B: Second consecutive close confirming
                if (!gapRulePass) {
                    if (crossDirection === 'CALL' && current.close > previous.close) {
                        gapRulePass = true;
                        gapRuleNote = 'Second close confirmation';
                    } else if (crossDirection === 'PUT' && current.close < previous.close) {
                        gapRulePass = true;
                        gapRuleNote = 'Second close confirmation';
                    }
                }
            }
            
            result.trace.push({
                ruleId: 'gapRule',
                name: 'Gap Rule',
                pass: gapRulePass,
                value: gapRulePass ? 'confirmed' : 'pending',
                threshold: 'pullback or 2nd close',
                note: gapRuleNote || 'Awaiting confirmation'
            });
            
            // ═══════════════════════════════════════════════════════════════
            // RULE 6: Activity Alignment
            // ═══════════════════════════════════════════════════════════════
            let activityPass = false;
            let activityNote = '';
            
            if (closeCrossPass) {
                if (crossDirection === 'CALL' && activity?.callUnusual) {
                    activityPass = true;
                    activityNote = 'Call activity elevated';
                } else if (crossDirection === 'PUT' && activity?.putUnusual) {
                    activityPass = true;
                    activityNote = 'Put activity elevated';
                }
            }
            
            result.trace.push({
                ruleId: 'activity',
                name: 'Activity Alignment',
                pass: activityPass,
                value: crossDirection || 'none',
                threshold: 'aligned',
                note: activityNote || 'Activity not aligned with signal'
            });
            
            // ═══════════════════════════════════════════════════════════════
            // Calculate Signal
            // ═══════════════════════════════════════════════════════════════
            const allRules = result.trace;
            const passedRules = allRules.filter(r => r.pass).length;
            const totalRules = allRules.length;
            
            if (passedRules === totalRules && closeCrossPass) {
                result.signal = crossDirection;
                result.confidence = Math.round((passedRules / totalRules) * 100);
                
                // Bonus confidence for extra confluence
                if (confluenceScore > GST.config.playbook.minConfluenceScore) {
                    result.confidence = Math.min(95, result.confidence + 5);
                }
                
                // Calculate levels
                result.levels = this._calculateLevels(spotPrice, atrValue, crossDirection);
                
                // Calculate contract rules
                result.contractRules = this._calculateContractRules(
                    optionsChain, 
                    crossDirection,
                    gammaMetrics
                );
                
            } else {
                result.signal = 'NONE';
                result.confidence = Math.round((passedRules / totalRules) * 50); // Half confidence for partial
            }
            
            GST.logger.debug('Evaluation complete', { 
                signal: result.signal, 
                confidence: result.confidence,
                passed: passedRules + '/' + totalRules
            });
            
            return result;
        },
        
        // Calculate stop/target levels
        _calculateLevels(entryPrice, atr, direction) {
            const stopDistance = atr * GST.config.playbook.atrStopMultiplier;
            const targetDistance = atr * GST.config.playbook.atrTargetMultiplier;
            
            if (direction === 'CALL') {
                return {
                    entry: entryPrice,
                    stop: entryPrice - stopDistance,
                    target1: entryPrice + targetDistance,
                    target2: entryPrice + (targetDistance * 1.5),
                    stopDistance,
                    targetDistance,
                    riskReward: targetDistance / stopDistance
                };
            } else {
                return {
                    entry: entryPrice,
                    stop: entryPrice + stopDistance,
                    target1: entryPrice - targetDistance,
                    target2: entryPrice - (targetDistance * 1.5),
                    stopDistance,
                    targetDistance,
                    riskReward: targetDistance / stopDistance
                };
            }
        },
        
        // Calculate contract selection rules
        _calculateContractRules(optionsChain, direction, gammaMetrics) {
            const cfg = GST.config.playbook;
            
            return {
                dteMin: cfg.minDte,
                dteMax: cfg.maxDte,
                deltaMin: cfg.minDelta,
                deltaMax: cfg.maxDelta,
                maxPremium: cfg.maxPremium,
                minOpenInterest: cfg.minOpenInterest,
                maxSpreadPercent: cfg.maxSpreadPercent,
                direction,
                targetDelta: direction === 'CALL' ? 0.55 : -0.55,
                recommendedExpiration: gammaMetrics?.expiration,
                maxHoldDays: cfg.maxHoldDays
            };
        },
        
        // Check if signal is valid (not in cooldown)
        isSignalValid(signal, ticker) {
            if (signal.signal === 'NONE') return false;
            
            // Check cooldown
            const cooldownKey = `signal:${ticker}`;
            if (GST.utils.isInCooldown(cooldownKey, GST.config.alertCooldownMs)) {
                GST.logger.debug('Signal rejected: cooldown active', { ticker });
                return false;
            }
            
            return true;
        },
        
        // Mark signal as executed (sets cooldown)
        markExecuted(ticker) {
            GST.utils.setCooldown(`signal:${ticker}`);
            GST.events.emit('playbook:executed', { ticker, timestamp: Date.now() });
        },
        
        // Backtest on historical data
        backtest(historicalContexts) {
            GST.logger.info('Starting backtest', { scenarios: historicalContexts.length });
            
            const results = {
                trades: [],
                stats: {
                    total: 0,
                    calls: 0,
                    puts: 0,
                    none: 0,
                    avgConfidence: 0
                }
            };
            
            let totalConfidence = 0;
            
            for (const context of historicalContexts) {
                const evaluation = this.evaluateV12MR(context);
                
                results.trades.push({
                    timestamp: context.timestamp,
                    ticker: context.ticker,
                    signal: evaluation.signal,
                    confidence: evaluation.confidence,
                    price: context.spotPrice,
                    trace: evaluation.trace
                });
                
                results.stats.total++;
                totalConfidence += evaluation.confidence;
                
                if (evaluation.signal === 'CALL') results.stats.calls++;
                else if (evaluation.signal === 'PUT') results.stats.puts++;
                else results.stats.none++;
            }
            
            results.stats.avgConfidence = Math.round(totalConfidence / results.stats.total);
            results.stats.signalRate = Math.round(
                ((results.stats.calls + results.stats.puts) / results.stats.total) * 100
            );
            
            GST.logger.info('Backtest complete', results.stats);
            
            return results;
        },
        
        // Get rule descriptions
        getRuleDescriptions() {
            return [
                {
                    id: 'gammaRegime',
                    name: 'Gamma Regime',
                    description: 'Net gamma exposure must be ≥ 1.0% for mean reversion potential'
                },
                {
                    id: 'confluence',
                    name: 'Confluence',
                    description: 'At least 3 of 5 indicators must align (flip distance, wall separation, IV skew, unusual activity, max pain)'
                },
                {
                    id: 'flowSanity',
                    name: 'Flow Sanity',
                    description: 'Dark pool and options flow should not conflict with signal direction'
                },
                {
                    id: '30mClose',
                    name: '30m Close Cross',
                    description: 'Price must close across gamma flip level on 30m candle'
                },
                {
                    id: 'gapRule',
                    name: 'Gap Rule',
                    description: 'Either pullback retest or second confirming close required'
                },
                {
                    id: 'activity',
                    name: 'Activity Alignment',
                    description: 'Unusual options activity must align with signal direction'
                }
            ];
        }
    };
    
    console.log('✅ GST Playbook Engine v' + GST.playbook.VERSION + ' loaded');
})();
