// Enhanced Gamma Storm Tracker - Integration Script
// This script integrates the OptionsAnalyzer into the existing Gamma Storm Tracker

// Store original functions for backup
const originalRenderChain = window.renderChain || function() {};
const originalCalculateGammaMetrics = window.calculateGammaMetrics || function() {};

// Enhanced render function for options chain with all 6 features
function renderEnhancedOptionsChain(metrics) {
    if (!metrics || !metrics.strikes) return;
    
    const chainBody = document.getElementById('chainBody');
    if (!chainBody) return;
    
    // Use the options analyzer to generate all 6 features
    const features = window.optionsAnalyzer.renderAllFeatures(
        metrics.strikes,
        window.allExpirations || {},
        metrics.spotPrice
    );
    
    // Build the enhanced panel
    let html = '<div style="max-height:600px;overflow-y:auto;">';
    
    // Tab navigation
    html += '<div style="display:flex;gap:5px;margin-bottom:15px;border-bottom:1px solid var(--border);padding-bottom:10px;">';
    html += '<button class="panel-btn active" onclick="switchOptionsTab(\'chain\')" id="tab-chain">📋 Chain</button>';
    html += '<button class="panel-btn" onclick="switchOptionsTab(\'gamma\')" id="tab-gamma">📊 Gamma</button>';
    html += '<button class="panel-btn" onclick="switchOptionsTab(\'skew\')" id="tab-skew">📈 Skew</button>';
    html += '<button class="panel-btn" onclick="switchOptionsTab(\'activity\')" id="tab-activity">🚨 Activity</button>';
    html += '<button class="panel-btn" onclick="switchOptionsTab(\'maxpain\')" id="tab-maxpain">🎯 Max Pain</button>';
    html += '<button class="panel-btn" onclick="switchOptionsTab(\'term\')" id="tab-term">📅 Term Structure</button>';
    html += '</div>';
    
    // Tab content containers
    html += '<div id="options-tab-content">';
    
    // Default to chain view
    html += '<div id="content-chain" class="options-tab-panel">';
    html += features.optionsChain;
    html += '</div>';
    
    html += '<div id="content-gamma" class="options-tab-panel hidden">';
    html += features.gammaByStrike;
    html += '</div>';
    
    html += '<div id="content-skew" class="options-tab-panel hidden">';
    html += features.skewAnalysis;
    html += '</div>';
    
    html += '<div id="content-activity" class="options-tab-panel hidden">';
    html += features.unusualActivity;
    html += '</div>';
    
    html += '<div id="content-maxpain" class="options-tab-panel hidden">';
    html += features.maxPain;
    html += '</div>';
    
    html += '<div id="content-term" class="options-tab-panel hidden">';
    html += features.ivTermStructure;
    html += '</div>';
    
    html += '</div></div>';
    
    chainBody.innerHTML = html;
    
    // Add CSS for ATM highlighting
    const style = document.createElement('style');
    style.textContent = `
        .atm-row {
            background: rgba(255, 204, 0, 0.1) !important;
            border-left: 3px solid var(--accent-yellow) !important;
        }
        .options-chain-detailed {
            font-size: 11px;
        }
        .options-chain-detailed th {
            padding: 8px 6px;
            font-size: 9px;
        }
        .options-chain-detailed td {
            padding: 6px;
        }
        .options-tab-panel {
            animation: fadeIn 0.3s ease;
        }
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
    `;
    document.head.appendChild(style);
}

// Tab switching function
function switchOptionsTab(tab) {
    // Hide all panels
    document.querySelectorAll('.options-tab-panel').forEach(panel => {
        panel.classList.add('hidden');
    });
    
    // Show selected panel
    const selectedPanel = document.getElementById(`content-${tab}`);
    if (selectedPanel) {
        selectedPanel.classList.remove('hidden');
    }
    
    // Update button states
    document.querySelectorAll('[id^="tab-"]').forEach(btn => {
        btn.style.background = 'transparent';
        btn.style.color = 'var(--text-secondary)';
    });
    
    const activeBtn = document.getElementById(`tab-${tab}`);
    if (activeBtn) {
        activeBtn.style.background = 'rgba(0, 204, 255, 0.2)';
        activeBtn.style.color = 'var(--accent-blue)';
    }
}

// Hook into the existing loadGammaData function
const originalLoadGammaData = window.loadGammaData;
window.loadGammaData = async function() {
    // Call original function
    await originalLoadGammaData.apply(this, arguments);
    
    // After data loads, enhance the options chain display
    if (window.lastData) {
        const metrics = calculateGammaMetrics(window.lastData, window.currentExpiration);
        if (metrics) {
            renderEnhancedOptionsChain(metrics);
        }
    }
};

// Hook into changeExpiration as well
const originalChangeExpiration = window.changeExpiration;
window.changeExpiration = async function() {
    await originalChangeExpiration.apply(this, arguments);
    
    // Re-render enhanced options after expiration change
    setTimeout(() => {
        if (window.lastData) {
            const metrics = calculateGammaMetrics(window.lastData, window.currentExpiration);
            if (metrics) {
                renderEnhancedOptionsChain(metrics);
            }
        }
    }, 500);
};

console.log('✅ Enhanced Options Analysis features loaded');
console.log('   📋 Options Chain with Greeks');
console.log('   📊 Gamma by Strike Visualization');
console.log('   📈 Put/Call Skew Analysis');
console.log('   🚨 Unusual Activity Detector');
console.log('   🎯 Max Pain Calculation');
console.log('   📅 IV Term Structure');
