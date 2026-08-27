// GST Decision Trace UI Component
// Visual rule-by-rule audit trail for playbook evaluations

(function() {
    'use strict';
    
    window.GST = window.GST || {};
    
    GST.decisionTrace = {
        // Container element
        container: null,
        
        // Current evaluation data
        currentEvaluation: null,
        
        // Initialize
        init(containerId) {
            const container = document.getElementById(containerId);
            if (!container) {
                GST.logger.error('Decision trace container not found:', containerId);
                return;
            }
            
            this.container = container;
            this.render();
            
            GST.logger.info('Decision Trace UI initialized');
            
            // Listen for playbook evaluations
            GST.events.on('playbook:evaluated', (data) => {
                this.update(data);
            });
            
            return this;
        },
        
        // Render initial structure
        render() {
            if (!this.container) return;
            
            this.container.innerHTML = `
                <div class="decision-trace-panel" style="
                    background: var(--bg-secondary);
                    border: 1px solid var(--border);
                    border-radius: 8px;
                    overflow: hidden;
                ">
                    <div class="trace-header" style="
                        background: var(--bg-tertiary);
                        padding: 12px 16px;
                        border-bottom: 1px solid var(--border);
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                    ">
                        <div style="display: flex; align-items: center; gap: 8px;">
                            <span style="font-size: 14px; color: var(--accent-blue);">🎯</span>
                            <span style="font-size: 14px; font-weight: bold; color: var(--text-primary);">Decision Trace</span>
                        </div>
                        <div id="trace-signal-badge" style="
                            padding: 4px 12px;
                            border-radius: 4px;
                            font-size: 12px;
                            font-weight: bold;
                            background: rgba(139, 148, 158, 0.2);
                            color: var(--text-secondary);
                        ">WAITING</div>
                    </div>
                    
                    <div class="trace-summary" style="
                        padding: 12px 16px;
                        border-bottom: 1px solid var(--border);
                        background: rgba(0,0,0,0.2);
                    ">
                        <div style="display: flex; gap: 20px; flex-wrap: wrap;">
                            <div>
                                <div style="font-size: 10px; color: var(--text-secondary); text-transform: uppercase;">Ticker</div>
                                <div id="trace-ticker" style="font-size: 16px; font-weight: bold; color: var(--text-primary);">--</div>
                            </div>
                            <div>
                                <div style="font-size: 10px; color: var(--text-secondary); text-transform: uppercase;">Price</div>
                                <div id="trace-price" style="font-size: 16px; font-weight: bold; color: var(--text-primary);">--.--</div>
                            </div>
                            <div>
                                <div style="font-size: 10px; color: var(--text-secondary); text-transform: uppercase;">Confidence</div>
                                <div id="trace-confidence" style="font-size: 16px; font-weight: bold; color: var(--text-secondary);">--%</div>
                            </div>
                            <div>
                                <div style="font-size: 10px; color: var(--text-secondary); text-transform: uppercase;">Rules Passed</div>
                                <div id="trace-score" style="font-size: 16px; font-weight: bold; color: var(--text-secondary);">-/-</div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="trace-rules" id="trace-rules-container" style="
                        max-height: 300px;
                        overflow-y: auto;
                    ">
                        <div style="padding: 40px; text-align: center; color: var(--text-secondary);">
                            <div style="font-size: 24px; margin-bottom: 10px;">⏳</div>
                            <div>Awaiting playbook evaluation...</div>
                            <div style="font-size: 11px; margin-top: 10px; opacity: 0.7;">
                                Load data to see rule-by-rule analysis
                            </div>
                        </div>
                    </div>
                    
                    <div class="trace-footer" style="
                        padding: 8px 16px;
                        border-top: 1px solid var(--border);
                        background: var(--bg-tertiary);
                        font-size: 11px;
                        color: var(--text-secondary);
                        display: flex;
                        justify-content: space-between;
                    ">
                        <span id="trace-timestamp">--:--:--</span>
                        <span id="trace-evaluation-time">Evaluated in --ms</span>
                    </div>
                </div>
            `;
        },
        
        // Update with new evaluation
        update(evaluation) {
            if (!evaluation) return;
            
            this.currentEvaluation = evaluation;
            
            // Update header
            const badge = document.getElementById('trace-signal-badge');
            if (badge) {
                const signal = evaluation.signal;
                if (signal === 'CALL') {
                    badge.style.background = 'rgba(0, 255, 136, 0.2)';
                    badge.style.color = 'var(--accent-green)';
                    badge.textContent = '✓ CALL SIGNAL';
                } else if (signal === 'PUT') {
                    badge.style.background = 'rgba(255, 68, 68, 0.2)';
                    badge.style.color = 'var(--accent-red)';
                    badge.textContent = '✓ PUT SIGNAL';
                } else {
                    badge.style.background = 'rgba(139, 148, 158, 0.2)';
                    badge.style.color = 'var(--text-secondary)';
                    badge.textContent = '✗ NO SIGNAL';
                }
            }
            
            // Update summary
            const ticker = document.getElementById('trace-ticker');
            if (ticker) ticker.textContent = evaluation.ticker || '--';
            
            const price = document.getElementById('trace-price');
            if (price) price.textContent = evaluation.levels ? 
                evaluation.levels.entry.toFixed(2) : '--.--';
            
            const confidence = document.getElementById('trace-confidence');
            if (confidence) {
                confidence.textContent = evaluation.confidence + '%';
                confidence.style.color = evaluation.confidence >= 80 ? 'var(--accent-green)' :
                                         evaluation.confidence >= 50 ? 'var(--accent-yellow)' :
                                         'var(--text-secondary)';
            }
            
            const score = document.getElementById('trace-score');
            if (score && evaluation.trace) {
                const passed = evaluation.trace.filter(r => r.pass).length;
                const total = evaluation.trace.length;
                score.textContent = `${passed}/${total}`;
                score.style.color = passed === total ? 'var(--accent-green)' :
                                    passed >= total/2 ? 'var(--accent-yellow)' :
                                    'var(--accent-red)';
            }
            
            // Update rules list
            this.renderRules(evaluation.trace);
            
            // Update footer
            const timestamp = document.getElementById('trace-timestamp');
            if (timestamp) {
                timestamp.textContent = GST.utils.formatTime(evaluation.timestamp);
            }
            
            const evalTime = document.getElementById('trace-evaluation-time');
            if (evalTime) {
                evalTime.textContent = 'Evaluated just now';
            }
        },
        
        // Render rules list
        renderRules(trace) {
            const container = document.getElementById('trace-rules-container');
            if (!container || !trace) return;
            
            let html = '<table style="width: 100%; border-collapse: collapse;">';
            
            for (const rule of trace) {
                const statusIcon = rule.pass ? '✓' : '✗';
                const statusColor = rule.pass ? 'var(--accent-green)' : 'var(--accent-red)';
                const rowBg = rule.pass ? 'transparent' : 'rgba(255, 68, 68, 0.05)';
                
                html += `
                    <tr style="
                        border-bottom: 1px solid var(--border);
                        background: ${rowBg};
                    ">
                        <td style="
                            padding: 12px 16px;
                            width: 40px;
                            text-align: center;
                            color: ${statusColor};
                            font-size: 16px;
                            font-weight: bold;
                        ">${statusIcon}</td>
                        <td style="padding: 12px 0;">
                            <div style="
                                font-size: 13px;
                                font-weight: bold;
                                color: var(--text-primary);
                                margin-bottom: 4px;
                            ">${rule.name}</div>
                            <div style="
                                font-size: 11px;
                                color: var(--text-secondary);
                                line-height: 1.4;
                            ">${rule.note}</div>
                        </td>
                        <td style="
                            padding: 12px 16px;
                            text-align: right;
                            font-size: 11px;
                            color: var(--text-secondary);
                            white-space: nowrap;
                        ">
                            ${rule.value !== undefined ? this.formatValue(rule.value) : ''}
                            ${rule.threshold !== undefined ? `<br><span style="opacity: 0.6;">threshold: ${this.formatValue(rule.threshold)}</span>` : ''}
                        </td>
                    </tr>
                `;
            }
            
            html += '</table>';
            
            // Add signal summary if available
            if (this.currentEvaluation && this.currentEvaluation.signal !== 'NONE') {
                const signal = this.currentEvaluation.signal;
                const levels = this.currentEvaluation.levels;
                
                html += `
                    <div style="
                        padding: 16px;
                        background: ${signal === 'CALL' ? 'rgba(0, 255, 136, 0.1)' : 'rgba(255, 68, 68, 0.1)'};
                        border-top: 2px solid ${signal === 'CALL' ? 'var(--accent-green)' : 'var(--accent-red)'};
                    ">
                        <div style="
                            font-size: 14px;
                            font-weight: bold;
                            color: ${signal === 'CALL' ? 'var(--accent-green)' : 'var(--accent-red)'};
                            margin-bottom: 12px;
                        ">
                            ${signal} SIGNAL EXECUTION PLAN
                        </div>
                        <div style="display: flex; gap: 20px; flex-wrap: wrap;">
                            <div>
                                <div style="font-size: 10px; color: var(--text-secondary);">ENTRY</div>
                                <div style="font-size: 16px; font-weight: bold; color: var(--text-primary);">${levels.entry.toFixed(2)}</div>
                            </div>
                            <div>
                                <div style="font-size: 10px; color: var(--text-secondary);">STOP</div>
                                <div style="font-size: 16px; font-weight: bold; color: var(--accent-red);">${levels.stop.toFixed(2)}</div>
                            </div>
                            <div>
                                <div style="font-size: 10px; color: var(--text-secondary);">TARGET</div>
                                <div style="font-size: 16px; font-weight: bold; color: var(--accent-green);">${levels.target1.toFixed(2)}</div>
                            </div>
                            <div>
                                <div style="font-size: 10px; color: var(--text-secondary);">R:R</div>
                                <div style="font-size: 16px; font-weight: bold; color: var(--text-primary);">1:${levels.riskReward.toFixed(1)}</div>
                            </div>
                        </div>
                    </div>
                `;
            }
            
            container.innerHTML = html;
        },
        
        // Format rule values for display
        formatValue(value) {
            if (typeof value === 'boolean') return value ? 'YES' : 'NO';
            if (typeof value === 'number') {
                if (Math.abs(value) < 0.01) return value.toExponential(2);
                if (Math.abs(value) < 1) return value.toFixed(3);
                if (Math.abs(value) < 100) return value.toFixed(2);
                return value.toFixed(0);
            }
            return String(value);
        },
        
        // Clear display
        clear() {
            this.currentEvaluation = null;
            this.render();
        },
        
        // Get current evaluation
        getCurrent() {
            return this.currentEvaluation;
        },
        
        // Export evaluation as JSON
        export() {
            if (!this.currentEvaluation) return null;
            return JSON.stringify(this.currentEvaluation, null, 2);
        }
    };
    
    // Auto-create standalone panel if requested
    GST.decisionTrace.createPanel = function() {
        const panel = document.createElement('div');
        panel.id = 'decision-trace-panel';
        panel.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            width: 380px;
            max-height: 80vh;
            z-index: 1000;
        `;
        
        document.body.appendChild(panel);
        GST.decisionTrace.init('decision-trace-panel');
        
        return panel;
    };
    
    console.log('✅ GST Decision Trace UI loaded');
})();
