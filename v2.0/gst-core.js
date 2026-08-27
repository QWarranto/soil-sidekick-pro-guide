// GST - Gamma Storm Tracker Core Namespace
// Central registry for all components (classic script pattern)

window.GST = window.GST || {};

// Version
GST.VERSION = '2.0.0';
GST.BUILD_DATE = '2026-02-04';

// Configuration (user-modifiable)
GST.config = {
    // ORATS API
    oratsToken: null,  // Set via GST.orats.setApiKey()
    oratsBaseUrl: 'https://api.orats.io/datav2',
    
    // Rate limiting
    maxRequestsPerMinute: 30,
    requestCooldownMs: 2000,
    
    // Caching
    cacheTtlMs: 30000,        // 30 seconds for options data
    swrGracePeriodMs: 5000,   // Stale-while-revalidate grace
    
    // Playbook v1.2 MR
    playbook: {
        minGammaExposure: 1.0,      // 1.0%
        minConfluenceScore: 3,       // 3 of 5 indicators
        maxPositionRisk: 1000,       // $1000 per trade
        maxAccountRiskPercent: 5,    // 5% of account
        atrStopMultiplier: 1.0,      // 1x ATR for stop
        atrTargetMultiplier: 1.5,    // 1.5x ATR for target
        maxHoldDays: 7,
        minDte: 21,
        maxDte: 45,
        minDelta: 0.40,
        maxDelta: 0.70,
        maxPremium: 1000,
        minOpenInterest: 500,
        maxSpreadPercent: 10
    },
    
    // Recording
    recordingIntervalMs: 30000,  // 30 seconds
    maxSnapshotsPerSession: 10000,
    
    // UI
    updateIntervalMs: 5000,      // UI refresh
    alertCooldownMs: 1800000     // 30 minutes per ticker
};

// State (internal, do not modify directly)
GST.state = {
    initialized: false,
    apiKeySet: false,
    lastRequestTime: 0,
    requestCount: 0,
    rateLimited: false,
    rateLimitResetTime: null,
    currentTicker: 'SPY',
    currentExpiration: null,
    lastData: null,
    isTestMode: false,
    isRecording: false,
    isReplaying: false,
    activeAlerts: new Map(),
    cooldowns: new Map()
};

// Utilities
GST.utils = {
    // Format number with commas
    formatNumber(num) {
        if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
        if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
        return num.toString();
    },
    
    // Format price
    formatPrice(price) {
        return price ? price.toFixed(2) : '--.--';
    },
    
    // Format percentage
    formatPercent(val) {
        return (val * 100).toFixed(1) + '%';
    },
    
    // Calculate ATR (simplified)
    calculateATR(candles, period = 14) {
        if (!candles || candles.length < period) return 1.0;
        
        let trSum = 0;
        for (let i = candles.length - period; i < candles.length; i++) {
            const high = candles[i].high;
            const low = candles[i].low;
            const prevClose = i > 0 ? candles[i-1].close : candles[i].open;
            
            const tr1 = high - low;
            const tr2 = Math.abs(high - prevClose);
            const tr3 = Math.abs(low - prevClose);
            
            trSum += Math.max(tr1, tr2, tr3);
        }
        
        return trSum / period;
    },
    
    // Debounce function
    debounce(fn, ms) {
        let timeout;
        return function(...args) {
            clearTimeout(timeout);
            timeout = setTimeout(() => fn.apply(this, args), ms);
        };
    },
    
    // Throttle function
    throttle(fn, ms) {
        let lastTime = 0;
        return function(...args) {
            const now = Date.now();
            if (now - lastTime >= ms) {
                lastTime = now;
                fn.apply(this, args);
            }
        };
    },
    
    // Deep clone
    clone(obj) {
        return JSON.parse(JSON.stringify(obj));
    },
    
    // Sleep/delay promise
    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    },
    
    // Generate UUID
    uuid() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            const r = Math.random() * 16 | 0;
            const v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    },
    
    // Time formatting
    formatTime(timestamp) {
        const date = new Date(timestamp);
        return date.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' });
    },
    
    formatDate(timestamp) {
        const date = new Date(timestamp);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    },
    
    // Market hours check (ET)
    isMarketHours() {
        const now = new Date();
        const et = new Date(now.toLocaleString('en-US', { timeZone: 'America/New_York' }));
        const hour = et.getHours();
        const minute = et.getMinutes();
        const day = et.getDay();
        
        // Mon-Fri, 9:30 AM - 4:00 PM ET
        if (day === 0 || day === 6) return false;
        if (hour < 9 || hour > 16) return false;
        if (hour === 9 && minute < 30) return false;
        if (hour === 16 && minute > 0) return false;
        
        return true;
    },
    
    // Check if in cooldown
    isInCooldown(key, cooldownMs) {
        const last = GST.state.cooldowns.get(key);
        if (!last) return false;
        return (Date.now() - last) < cooldownMs;
    },
    
    // Set cooldown
    setCooldown(key) {
        GST.state.cooldowns.set(key, Date.now());
    }
};

// Event system (simple pub/sub)
GST.events = {
    handlers: new Map(),
    
    on(event, handler) {
        if (!this.handlers.has(event)) {
            this.handlers.set(event, new Set());
        }
        this.handlers.get(event).add(handler);
    },
    
    off(event, handler) {
        if (this.handlers.has(event)) {
            this.handlers.get(event).delete(handler);
        }
    },
    
    emit(event, data) {
        if (this.handlers.has(event)) {
            this.handlers.get(event).forEach(handler => {
                try {
                    handler(data);
                } catch (e) {
                    console.error(`Event handler error for ${event}:`, e);
                }
            });
        }
    }
};

// Logger
GST.logger = {
    levels: { DEBUG: 0, INFO: 1, WARN: 2, ERROR: 3 },
    currentLevel: 1, // INFO
    
    log(level, message, data = null) {
        if (level < this.currentLevel) return;
        
        const timestamp = new Date().toISOString();
        const levelName = Object.keys(this.levels).find(k => this.levels[k] === level);
        
        if (data) {
            console.log(`[${timestamp}] [${levelName}] ${message}`, data);
        } else {
            console.log(`[${timestamp}] [${levelName}] ${message}`);
        }
    },
    
    debug(msg, data) { this.log(0, msg, data); },
    info(msg, data) { this.log(1, msg, data); },
    warn(msg, data) { this.log(2, msg, data); },
    error(msg, data) { this.log(3, msg, data); }
};

// Initialize
GST.init = function() {
    if (GST.state.initialized) return;
    
    GST.logger.info('GST v' + GST.VERSION + ' initializing...');
    
    // Check for API key in session storage
    const savedKey = sessionStorage.getItem('orats_api_key');
    if (savedKey) {
        GST.config.oratsToken = savedKey;
        GST.state.apiKeySet = true;
        GST.logger.info('API key loaded from session storage');
    }
    
    GST.state.initialized = true;
    GST.events.emit('gst:initialized');
    
    GST.logger.info('GST initialized successfully');
};

// Auto-init on load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', GST.init);
} else {
    GST.init();
}

console.log('✅ GST Core loaded v' + GST.VERSION);
