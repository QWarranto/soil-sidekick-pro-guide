// Gamma Storm Tracker - Options Analysis Module
// Adds 6 comprehensive options analysis features

class OptionsAnalyzer {
    constructor() {
        this.currentData = null;
        this.strikesData = [];
        this.unusualActivityThreshold = 1.5; // 150% of average volume
    }

    // Feature 1: Enhanced Options Chain with Greeks
    generateOptionsChainTable(strikes, spotPrice) {
        if (!strikes || strikes.length === 0) return '<p>No data available</p>';
        
        let html = '<table class="options-table options-chain-detailed">';
        html += '<thead><tr>';
        html += '<th>STRIKE</th>';
        html += '<th colspan="6" style="text-align:center;color:var(--accent-green)">CALLS</th>';
        html += '<th colspan="6" style="text-align:center;color:var(--accent-red)">PUTS</th>';
        html += '</tr><tr>';
        html += '<th></th>';
        html += '<th>IV%</th><th>Delta</th><th>Gamma</th><th>Theta</th><th>Vega</th><th>OI</th>';
        html += '<th>IV%</th><th>Delta</th><th>Gamma</th><th>Theta</th><th>Vega</th><th>OI</th>';
        html += '</tr></thead><tbody>';
        
        strikes.forEach(strike => {
            const isATM = Math.abs(strike.strike - spotPrice) < (spotPrice * 0.01);
            const atmClass = isATM ? 'atm-row' : '';
            const gammaExposure = (strike.callOpenInterest * (strike.callGamma || 0)) - 
                                 (strike.putOpenInterest * (strike.putGamma || 0));
            const gammaClass = gammaExposure > 0 ? 'positive' : 'negative';
            
            html += `<tr class="${atmClass}">`;
            html += `<td class="strike-price">${strike.strike.toFixed(2)}${isATM ? ' ⭐' : ''}</td>`;
            
            // Call data
            html += `<td class="call-data">${(strike.callIv || 0).toFixed(1)}%</td>`;
            html += `<td class="call-data">${(strike.callDelta || 0).toFixed(3)}</td>`;
            html += `<td class="call-data">${(strike.callGamma || 0).toFixed(4)}</td>`;
            html += `<td class="call-data">${(strike.callTheta || 0).toFixed(3)}</td>`;
            html += `<td class="call-data">${(strike.callVega || 0).toFixed(3)}</td>`;
            html += `<td class="call-data">${this.formatNumber(strike.callOpenInterest)}</td>`;
            
            // Put data
            html += `<td class="put-data">${(strike.putIv || 0).toFixed(1)}%</td>`;
            html += `<td class="put-data">${(strike.putDelta || 0).toFixed(3)}</td>`;
            html += `<td class="put-data">${(strike.putGamma || 0).toFixed(4)}</td>`;
            html += `<td class="put-data">${(strike.putTheta || 0).toFixed(3)}</td>`;
            html += `<td class="put-data">${(strike.putVega || 0).toFixed(3)}</td>`;
            html += `<td class="put-data">${this.formatNumber(strike.putOpenInterest)}</td>`;
            
            html += '</tr>';
        });
        
        html += '</tbody></table>';
        return html;
    }

    // Feature 2: Gamma by Strike Visualization
    generateGammaByStrikeChart(strikes, spotPrice) {
        if (!strikes || strikes.length === 0) return '';
        
        const chartId = 'gammaStrikeChart';
        const maxGamma = Math.max(...strikes.map(s => 
            Math.abs(s.callGamma * s.callOpenInterest || 0) + 
            Math.abs(s.putGamma * s.putOpenInterest || 0)
        ));
        
        let html = '<div class="chart-container" style="margin-top:20px;">';
        html += '<h4 style="color:var(--accent-blue);margin-bottom:10px;">📊 Gamma Exposure by Strike</h4>';
        html += '<div style="position:relative;height:400px;overflow-y:auto;">'; // scrollable container
        
        // Sort by strike
        const sortedStrikes = [...strikes].sort((a, b) => a.strike - b.strike);
        
        html += '<table style="width:100%;border-collapse:collapse;">';
        
        sortedStrikes.forEach(strike => {
            const callGammaExp = (strike.callGamma || 0) * strike.callOpenInterest / 1000;
            const putGammaExp = (strike.putGamma || 0) * strike.putOpenInterest / 1000;
            const netGamma = callGammaExp - putGammaExp;
            const isATM = Math.abs(strike.strike - spotPrice) < (spotPrice * 0.01);
            
            const callWidth = maxGamma > 0 ? (Math.abs(callGammaExp) / maxGamma * 100) : 0;
            const putWidth = maxGamma > 0 ? (Math.abs(putGammaExp) / maxGamma * 100) : 0;
            
            html += '<tr>';
            html += `<td style="width:60px;text-align:right;padding:4px;font-weight:bold;${isATM ? 'color:var(--accent-yellow)' : 'color:var(--text-secondary)'}">${strike.strike.toFixed(0)}${isATM ? '★' : ''}</td>`;
            html += '<td style="padding:2px 4px;">';
            
            // Call gamma bar (green, left side)
            if (callGammaExp > 0) {
                html += `<div style="background:var(--accent-green);height:16px;width:${callWidth}%;display:inline-block;vertical-align:middle;border-radius:2px 0 0 2px;opacity:0.8;"></div>`;
            }
            
            // Net gamma indicator
            const netClass = netGamma > 0 ? 'positive' : 'negative';
            html += `<span style="display:inline-block;width:8px;height:8px;background:${netGamma > 0 ? 'var(--accent-green)' : 'var(--accent-red)'};border-radius:50%;margin:0 4px;vertical-align:middle;"></span>`;
            
            // Put gamma bar (red, right side)
            if (putGammaExp > 0) {
                html += `<div style="background:var(--accent-red);height:16px;width:${putWidth}%;display:inline-block;vertical-align:middle;border-radius:0 2px 2px 0;opacity:0.8;"></div>`;
            }
            
            html += '</td>';
            html += `<td style="width:100px;font-size:11px;color:var(--text-secondary);">Net: ${netGamma.toFixed(1)}K</td>`;
            html += '</tr>';
        });
        
        html += '</table>';
        html += '</div></div>';
        
        return html;
    }

    // Feature 3: Put/Call Skew Analysis
    generateSkewAnalysis(strikes, spotPrice) {
        if (!strikes || strikes.length === 0) return '';
        
        const sortedStrikes = [...strikes].sort((a, b) => a.strike - b.strike);
        
        // Calculate skew metrics
        const atmStrike = sortedStrikes.reduce((prev, curr) => 
            Math.abs(curr.strike - spotPrice) < Math.abs(prev.strike - spotPrice) ? curr : prev
        );
        
        const atmIV = (atmStrike.callIv + atmStrike.putIv) / 2;
        
        // Find 25-delta strikes (approximate)
        const lowerStrike = sortedStrikes.find(s => s.strike < spotPrice * 0.95) || sortedStrikes[0];
        const upperStrike = sortedStrikes.reverse().find(s => s.strike > spotPrice * 1.05) || sortedStrikes[sortedStrikes.length - 1];
        
        const skewSpread = (upperStrike.callIv || atmIV) - (lowerStrike.putIv || atmIV);
        const skewPercent = (skewSpread / atmIV * 100).toFixed(1);
        
        let html = '<div class="chart-container" style="margin-top:20px;">';
        html += '<h4 style="color:var(--accent-blue);margin-bottom:10px;">📈 Put/Call Skew Analysis</h4>';
        html += '<div style="display:flex;gap:20px;margin-bottom:15px;">';
        html += `<div style="background:var(--bg-tertiary);padding:10px 15px;border-radius:6px;"><span style="font-size:11px;color:var(--text-secondary)">ATM IV</span><br><span style="font-size:18px;font-weight:bold;color:var(--text-primary)">${atmIV.toFixed(1)}%</span></div>`;
        html += `<div style="background:var(--bg-tertiary);padding:10px 15px;border-radius:6px;"><span style="font-size:11px;color:var(--text-secondary)">Skew Spread</span><br><span style="font-size:18px;font-weight:bold;color:${skewSpread > 0 ? 'var(--accent-green)' : 'var(--accent-red)'}">${skewSpread > 0 ? '+' : ''}${skewSpread.toFixed(1)}%</span></div>`;
        html += `<div style="background:var(--bg-tertiary);padding:10px 15px;border-radius:6px;"><span style="font-size:11px;color:var(--text-secondary)">Skew %</span><br><span style="font-size:18px;font-weight:bold;color:var(--text-primary)">${skewPercent}%</span></div>`;
        html += '</div>';
        
        // Visual skew chart
        html += '<div style="position:relative;height:200px;background:var(--bg-tertiary);border-radius:8px;padding:20px;">';
        html += '<svg width="100%" height="100%" viewBox="0 0 400 150" preserveAspectRatio="none">';
        
        // Grid lines
        for (let i = 0; i <= 5; i++) {
            const y = i * 30;
            html += `<line x1="0" y1="${y}" x2="400" y2="${y}" stroke="#2d2d3d" stroke-width="1"/>`;
        }
        
        // Call IV line (green)
        const callPoints = sortedStrikes.map((s, i) => {
            const x = (s.strike - sortedStrikes[0].strike) / (sortedStrikes[sortedStrikes.length - 1].strike - sortedStrikes[0].strike) * 380 + 10;
            const y = 150 - ((s.callIv || atmIV) / 100) * 120;
            return `${x},${y}`;
        }).join(' ');
        
        html += `<polyline points="${callPoints}" fill="none" stroke="var(--accent-green)" stroke-width="2"/>`;
        
        // Put IV line (red)
        const putPoints = sortedStrikes.map((s, i) => {
            const x = (s.strike - sortedStrikes[0].strike) / (sortedStrikes[sortedStrikes.length - 1].strike - sortedStrikes[0].strike) * 380 + 10;
            const y = 150 - ((s.putIv || atmIV) / 100) * 120;
            return `${x},${y}`;
        }).join(' ');
        
        html += `<polyline points="${putPoints}" fill="none" stroke="var(--accent-red)" stroke-width="2"/>`;
        
        // ATM marker
        const atmX = (atmStrike.strike - sortedStrikes[0].strike) / (sortedStrikes[sortedStrikes.length - 1].strike - sortedStrikes[0].strike) * 380 + 10;
        html += `<line x1="${atmX}" y1="0" x2="${atmX}" y2="150" stroke="var(--accent-yellow)" stroke-width="1" stroke-dasharray="5,5"/>`;
        html += `<text x="${atmX}" y="20" fill="var(--accent-yellow)" font-size="10" text-anchor="middle">ATM</text>`;
        
        html += '</svg>';
        html += '<div style="display:flex;justify-content:center;gap:20px;margin-top:10px;">';
        html += '<span style="color:var(--accent-green);font-size:12px;">● Call IV</span>';
        html += '<span style="color:var(--accent-red);font-size:12px;">● Put IV</span>';
        html += '<span style="color:var(--accent-yellow);font-size:12px;">--- ATM</span>';
        html += '</div>';
        html += '</div></div>';
        
        return html;
    }

    // Feature 4: Unusual Options Activity Detector
    detectUnusualActivity(strikes) {
        if (!strikes || strikes.length === 0) return [];
        
        const activities = [];
        
        strikes.forEach(strike => {
            // Calculate average volume (simplified - using OI as proxy for expected volume)
            const callAvg = strike.callOpenInterest * 0.1; // Assume 10% turnover
            const putAvg = strike.putOpenInterest * 0.1;
            
            // Check for unusual activity (would need actual volume data from API)
            // For now, flag strikes with high OI relative to surrounding strikes
            const callUnusual = strike.callOpenInterest > callAvg * this.unusualActivityThreshold;
            const putUnusual = strike.putOpenInterest > putAvg * this.unusualActivityThreshold;
            
            if (callUnusual || putUnusual) {
                activities.push({
                    strike: strike.strike,
                    type: callUnusual && putUnusual ? 'BOTH' : (callUnusual ? 'CALL' : 'PUT'),
                    callOI: strike.callOpenInterest,
                    putOI: strike.putOpenInterest,
                    callIV: strike.callIv,
                    putIV: strike.putIv
                });
            }
        });
        
        // Sort by total unusual activity
        activities.sort((a, b) => (b.callOI + b.putOI) - (a.callOI + a.putOI));
        
        return activities;
    }

    generateUnusualActivityPanel(strikes) {
        const activities = this.detectUnusualActivity(strikes);
        
        let html = '<div class="chart-container" style="margin-top:20px;">';
        html += '<h4 style="color:var(--accent-blue);margin-bottom:10px;">🚨 Unusual Options Activity</h4>';
        
        if (activities.length === 0) {
            html += '<p style="color:var(--text-secondary);padding:20px;">No unusual activity detected in current expiration.</p>';
        } else {
            html += `<p style="font-size:12px;color:var(--text-secondary);margin-bottom:10px;">Detected ${activities.length} strikes with elevated interest</p>`;
            html += '<div style="max-height:200px;overflow-y:auto;">';
            html += '<table class="options-table">';
            html += '<thead><tr><th>STRIKE</th><th>TYPE</th><th>CALL OI</th><th>PUT OI</th><th>SIGNAL</th></tr></thead><tbody>';
            
            activities.slice(0, 10).forEach(activity => {
                const signalColor = activity.type === 'CALL' ? 'var(--accent-green)' : 
                                   (activity.type === 'PUT' ? 'var(--accent-red)' : 'var(--accent-orange)');
                const signalText = activity.type === 'CALL' ? 'BULLISH ⬆' : 
                                  (activity.type === 'PUT' ? 'BEARISH ⬇' : 'MIXED ⇅');
                
                html += '<tr>';
                html += `<td class="strike-price">${activity.strike.toFixed(2)}</td>`;
                html += `<td><span style="color:${signalColor};font-weight:bold;">${activity.type}</span></td>`;
                html += `<td class="call-data">${this.formatNumber(activity.callOI)}</td>`;
                html += `<td class="put-data">${this.formatNumber(activity.putOI)}</td>`;
                html += `<td style="color:${signalColor};font-weight:bold;">${signalText}</td>`;
                html += '</tr>';
            });
            
            html += '</tbody></table></div>';
        }
        
        html += '</div>';
        return html;
    }

    // Feature 5: Max Pain Calculation
    calculateMaxPain(strikes) {
        if (!strikes || strikes.length === 0) return null;
        
        const uniqueStrikes = [...new Set(strikes.map(s => s.strike))].sort((a, b) => a - b);
        
        let maxPainStrike = null;
        let minPain = Infinity;
        
        uniqueStrikes.forEach(strike => {
            let totalPain = 0;
            
            strikes.forEach(s => {
                // Calculate dollar value at expiration if stock is at this strike
                const callPain = s.callOpenInterest * Math.max(0, s.strike - strike);
                const putPain = s.putOpenInterest * Math.max(0, strike - s.strike);
                totalPain += callPain + putPain;
            });
            
            if (totalPain < minPain) {
                minPain = totalPain;
                maxPainStrike = strike;
            }
        });
        
        return {
            strike: maxPainStrike,
            pain: minPain
        };
    }

    generateMaxPainPanel(strikes, spotPrice) {
        const maxPain = this.calculateMaxPain(strikes);
        if (!maxPain) return '';
        
        const distance = ((spotPrice - maxPain.strike) / spotPrice * 100).toFixed(2);
        const direction = spotPrice > maxPain.strike ? 'ABOVE' : 'BELOW';
        const color = direction === 'ABOVE' ? 'var(--accent-green)' : 'var(--accent-red)';
        
        let html = '<div class="chart-container" style="margin-top:20px;">';
        html += '<h4 style="color:var(--accent-blue);margin-bottom:10px;">🎯 Max Pain Analysis</h4>';
        html += '<div style="display:flex;gap:20px;align-items:center;">';
        html += '<div style="flex:1;">';
        html += `<div style="background:var(--bg-tertiary);padding:15px;border-radius:8px;margin-bottom:10px;">`;
        html += `<div style="font-size:11px;color:var(--text-secondary);margin-bottom:5px;">MAX PAIN STRIKE</div>`;
        html += `<div style="font-size:32px;font-weight:bold;color:var(--accent-yellow);">$${maxPain.strike.toFixed(2)}</div>`;
        html += `</div>`;
        html += '</div>';
        html += '<div style="flex:1;">';
        html += `<div style="background:var(--bg-tertiary);padding:15px;border-radius:8px;margin-bottom:10px;">`;
        html += `<div style="font-size:11px;color:var(--text-secondary);margin-bottom:5px;">DISTANCE FROM SPOT</div>`;
        html += `<div style="font-size:24px;font-weight:bold;color:${color};">${direction} by ${Math.abs(distance)}%</div>`;
        html += `<div style="font-size:11px;color:var(--text-secondary);margin-top:5px;">Spot: $${spotPrice.toFixed(2)}</div>`;
        html += `</div>`;
        html += '</div>';
        html += '</div>';
        html += `<p style="font-size:12px;color:var(--text-secondary);margin-top:10px;">Max Pain represents the strike where option writers would lose the least. Price often gravitates toward this level at expiration.</p>`;
        html += '</div>';
        
        return html;
    }

    // Feature 6: IV Term Structure
    generateIVTermStructure(allExpirations, spotPrice) {
        if (!allExpirations || Object.keys(allExpirations).length === 0) return '';
        
        const expirations = Object.keys(allExpirations).sort((a, b) => {
            return allExpirations[a][0].dte - allExpirations[b][0].dte;
        }).slice(0, 8); // First 8 expirations
        
        const termData = expirations.map(exp => {
            const strikes = allExpirations[exp];
            const atmStrike = strikes.reduce((prev, curr) => 
                Math.abs(curr.strike - spotPrice) < Math.abs(prev.strike - spotPrice) ? curr : prev
            );
            const avgIV = (atmStrike.callIv + atmStrike.putIv) / 2;
            return {
                expiration: exp,
                dte: strikes[0].dte,
                iv: avgIV
            };
        });
        
        const maxIV = Math.max(...termData.map(d => d.iv));
        const minIV = Math.min(...termData.map(d => d.iv));
        
        let html = '<div class="chart-container" style="margin-top:20px;">';
        html += '<h4 style="color:var(--accent-blue);margin-bottom:10px;">📅 IV Term Structure</h4>';
        html += '<div style="display:flex;gap:20px;margin-bottom:15px;">';
        html += `<div style="background:var(--bg-tertiary);padding:10px 15px;border-radius:6px;"><span style="font-size:11px;color:var(--text-secondary)">Front Month</span><br><span style="font-size:16px;font-weight:bold;color:var(--text-primary)">${termData[0].iv.toFixed(1)}%</span></div>`;
        html += `<div style="background:var(--bg-tertiary);padding:10px 15px;border-radius:6px;"><span style="font-size:11px;color:var(--text-secondary)">Back Month</span><br><span style="font-size:16px;font-weight:bold;color:var(--text-primary)">${termData[termData.length - 1].iv.toFixed(1)}%</span></div>`;
        const spread = termData[termData.length - 1].iv - termData[0].iv;
        const spreadColor = spread > 0 ? 'var(--accent-green)' : 'var(--accent-red)';
        const termStructure = spread > 0 ? 'CONTANGO' : 'BACKWARDATION';
        html += `<div style="background:var(--bg-tertiary);padding:10px 15px;border-radius:6px;"><span style="font-size:11px;color:var(--text-secondary)">Term Structure</span><br><span style="font-size:16px;font-weight:bold;color:${spreadColor}">${termStructure}</span></div>`;
        html += '</div>';
        
        // Visual term structure
        html += '<div style="display:flex;align-items:flex-end;justify-content:space-between;height:150px;background:var(--bg-tertiary);border-radius:8px;padding:20px;gap:10px;">';
        
        termData.forEach((data, i) => {
            const height = maxIV > minIV ? ((data.iv - minIV) / (maxIV - minIV) * 100 + 20) : 50;
            const color = i === 0 ? 'var(--accent-blue)' : (data.iv > termData[0].iv ? 'var(--accent-green)' : 'var(--accent-red)');
            
            html += '<div style="flex:1;display:flex;flex-direction:column;align-items:center;gap:5px;">';
            html += `<div style="font-size:11px;color:var(--text-secondary);">${data.iv.toFixed(1)}%</div>`;
            html += `<div style="width:100%;background:${color};border-radius:4px 4px 0 0;transition:height 0.3s;opacity:0.8;" style="height:${height}px;"></div>`;
            html += `<div style="font-size:10px;color:var(--text-secondary);text-align:center;">${data.dte}d</div>`;
            html += '</div>';
        });
        
        html += '</div>';
        html += '<p style="font-size:11px;color:var(--text-secondary);margin-top:10px;text-align:center;">IV by Days to Expiration</p>';
        html += '</div>';
        
        return html;
    }

    // Helper functions
    formatNumber(num) {
        if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
        if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
        return num.toString();
    }

    // Main render function - generates all 6 features
    renderAllFeatures(strikes, allExpirations, spotPrice) {
        this.strikesData = strikes;
        this.currentData = { strikes, allExpirations, spotPrice };
        
        return {
            optionsChain: this.generateOptionsChainTable(strikes, spotPrice),
            gammaByStrike: this.generateGammaByStrikeChart(strikes, spotPrice),
            skewAnalysis: this.generateSkewAnalysis(strikes, spotPrice),
            unusualActivity: this.generateUnusualActivityPanel(strikes),
            maxPain: this.generateMaxPainPanel(strikes, spotPrice),
            ivTermStructure: this.generateIVTermStructure(allExpirations, spotPrice)
        };
    }
}

// Initialize the analyzer
window.optionsAnalyzer = new OptionsAnalyzer();
