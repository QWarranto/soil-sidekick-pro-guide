# Gamma Storm Tracker - Architecture & Configuration Guide

**Version:** 2.0  
**Last Updated:** February 4, 2026  
**Status:** Production Ready

---

## 🏗️ System Architecture Overview

### High-Level Design

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENT LAYER                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────┐  │
│  │   Desktop    │  │    Mobile    │  │    Remote (ngrok)    │  │
│  │  (Primary)   │  │  (Companion) │  │    (Anywhere)        │  │
│  └──────┬───────┘  └──────┬───────┘  └──────────┬───────────┘  │
└─────────┼─────────────────┼─────────────────────┼───────────────┘
          │                 │                     │
          └─────────────────┴─────────────────────┘
                            │
          ┌─────────────────┴─────────────────────┐
          │           WEB SERVER LAYER            │
          │    python3 -m http.server 8888       │
          │         (Localhost/Desktop)          │
          └─────────────────┬─────────────────────┘
                            │
          ┌─────────────────┴─────────────────────┐
          │         APPLICATION LAYER             │
          │  ┌─────────────────────────────────┐  │
          │  │     gamma-storm-tracker.html    │  │
          │  │  - UI/UX Interface              │  │
          │  │  - Event Handlers               │  │
          │  │  - State Management             │  │
          │  └─────────────────────────────────┘  │
          │  ┌─────────────────────────────────┐  │
          │  │      gst-loader.js             │  │
          │  │  - Module Loader               │  │
          │  │  - Dependency Resolution       │  │
          │  └─────────────────────────────────┘  │
          └───────────────────────────────────────┘
                            │
          ┌─────────────────┴─────────────────────┐
          │          CORE MODULES (v2.0)          │
          │  ┌──────────────┐  ┌──────────────┐  │
          │  │ gst-core.js  │  │gst-orats-    │  │
          │  │ - Config     │  │client.js     │  │
          │  │ - State      │  │ - API Client │  │
          │  │ - Utils      │  │ - Caching    │  │
          │  │ - Events     │  │ - Rate Limit │  │
          │  └──────────────┘  └──────────────┘  │
          │  ┌──────────────┐  ┌──────────────┐  │
          │  │gst-playbook- │  │gst-decision- │  │
          │  │engine.js     │  │trace.js      │  │
          │  │ - 6 Rules    │  │ - UI Render  │  │
          │  │ - Evaluation │  │ - Export     │  │
          │  └──────────────┘  └──────────────┘  │
          └───────────────────────────────────────┘
                            │
          ┌─────────────────┴─────────────────────┐
          │         LEGACY MODULES (v1.x)         │
          │  - gamma-options-analyzer.js         │
          │  - gamma-enhanced-integration.js     │
          │  - gamma-mock-data.js                │
          └───────────────────────────────────────┘
                            │
          ┌─────────────────┴─────────────────────┐
          │         EXTERNAL SERVICES             │
          │  ┌─────────────────────────────────┐  │
          │  │     ORATS Data API             │  │
          │  │  - 15-min delayed options data │  │
          │  │  - Strike chains, Greeks, OI   │  │
          │  │  - Rate limited (30 req/min)   │  │
          │  └─────────────────────────────────┘  │
          │  ┌─────────────────────────────────┐  │
          │  │      ngrok (Optional)          │  │
          │  │  - Public tunnel to localhost  │  │
          │  │  - HTTPS encryption            │  │
          │  └─────────────────────────────────┘  │
          └───────────────────────────────────────┘
```

---

## 📁 File Structure & Organization

```
/Users/reginaldrice/clawd/
│
├── gamma-storm-tracker.html          # Main application (100KB+)
│   ├── Inline API Key Manager        # Session-based auth
│   ├── Inline Mock Data              # 3 test scenarios
│   ├── Inline Fallback Playbook      # Self-contained rules
│   └── UI Components                 # 5 panels, controls
│
├── gamma-storm-mobile.html           # Mobile companion view
│   └── Simplified interface          # Quick status checks
│
├── gst-loader.js                     # v2.0 module loader
│   └── Sequential script loading     # Ensures dependencies
│
├── gst-remote.sh                     # Remote access launcher
├── gamma-storm-launcher.sh           # Local access launcher
├── gamma-demo.sh                     # Demo mode launcher
│
├── gamma-options-analyzer.js         # v1.x - Analysis functions
├── gamma-enhanced-integration.js     # v1.x - UI integration
├── gamma-mock-data.js                # v1.x - 5 mock scenarios
├── playbook-verification.js          # Test suite
│
├── v2.0/                             # Modern architecture
│   ├── gst-core.js                   # Foundation module
│   ├── gst-orats-client.js           # API client
│   ├── gst-snapshot-store.js         # Data persistence
│   ├── gst-playbook-engine.js        # Strategy engine
│   └── gst-decision-trace.js         # UI component
│
├── SSKPPortfolio/                    # Watchlists directory
│   └── *.txt                         # Symbol lists
│
├── GST_IMPLEMENTATION_SUMMARY.md     # Documentation
├── PLAYBOOK_VERIFICATION.md          # Testing guide
└── gamma-alerts.log                  # Activity log
```

---

## ⚙️ Core Configuration (gst-core.js)

### GST.config Object

```javascript
GST.config = {
    // Version Info
    VERSION: '2.0.0',
    BUILD_DATE: '2026-02-04',
    
    // ORATS API Configuration
    oratsToken: null,                    // Set at runtime
    oratsBaseUrl: 'https://api.orats.io/datav2',
    
    // Rate Limiting (Self-protection)
    maxRequestsPerMinute: 30,
    requestCooldownMs: 2000,             // 2 seconds between calls
    
    // Caching Strategy (SWR Pattern)
    cacheTtlMs: 30000,                   // 30 seconds fresh
    swrGracePeriodMs: 5000,              // 5 seconds stale-while-revalidate
    
    // Playbook v1.2 Mean Reversion Parameters
    playbook: {
        // Core Thresholds
        minGammaExposure: 1.0,           // 1.0% minimum (absolute)
        minConfluenceScore: 3,           // 3 of 5 indicators
        
        // Position Sizing
        maxPositionRisk: 1000,           // $1000 per trade
        maxAccountRiskPercent: 5,        // 5% of total account
        
        // ATR-Based Levels
        atrStopMultiplier: 1.0,          // 1x ATR for stop
        atrTargetMultiplier: 1.5,        // 1.5x ATR for target
        maxHoldDays: 7,                  // Time stop
        
        // Option Contract Filters
        minDte: 21,                      // Minimum days to expiration
        maxDte: 45,                      // Maximum days to expiration
        minDelta: 0.40,                  // Min option delta
        maxDelta: 0.70,                  // Max option delta
        maxPremium: 1000,                // Max premium per contract
        minOpenInterest: 500,            // Liquidity threshold
        maxSpreadPercent: 10             // Max bid-ask spread %
    },
    
    // Recording & Replay
    recordingIntervalMs: 30000,          // 30 seconds
    maxSnapshotsPerSession: 10000,
    
    // UI Updates
    updateIntervalMs: 5000,              // UI refresh rate
    alertCooldownMs: 1800000             // 30 min per ticker
};
```

---

## 🔄 State Management (gst-core.js)

### GST.state Object

```javascript
GST.state = {
    initialized: false,                  // Boot flag
    apiKeySet: false,                    // Auth status
    
    // Rate Limiting
    lastRequestTime: 0,
    requestCount: 0,
    rateLimited: false,
    rateLimitResetTime: null,
    
    // Current Session
    currentTicker: 'SPY',
    currentExpiration: null,
    lastData: null,
    
    // Mode Flags
    isTestMode: false,
    isRecording: false,
    isReplaying: false,
    
    // Tracking
    activeAlerts: new Map(),
    cooldowns: new Map(),
    previousRegimes: {}                  // For flip detection
};
```

---

## 🎮 Playbook Engine Architecture

### The 6 Rules Implementation

```javascript
// Rule 1: Gamma Regime Check
const gammaRegimePass = Math.abs(gammaMetrics.netGammaExposure) >= 1.0;

// Rule 2: Confluence Check (5 Indicators)
const confluenceChecks = {
    flipDistance: Math.abs(spotPrice - gammaFlip) / atr > 1.0,
    wallSeparation: Math.abs(callWall - putSupport) / atr > 2.0,
    ivSkew: ivSkew > 5.0,
    unusualActivity: callUnusual || putUnusual,
    maxPainDistance: Math.abs(maxPainDistance) > 1.0
};
const confluenceScore = Object.values(confluenceChecks).filter(Boolean).length;
const confluencePass = confluenceScore >= 3;

// Rule 3: Flow Sanity
const flowConflict = (signal === 'CALL' && (darkPool === 'bearish' || flowDelta < -0.3)) ||
                     (signal === 'PUT' && (darkPool === 'bullish' || flowDelta > 0.3));
const flowPass = !flowConflict;

// Rule 4: 30m Close Cross
const current = ohlcv.history[ohlcv.history.length - 1];
const previous = ohlcv.history[ohlcv.history.length - 2];
const bullishCross = previous.close <= gammaFlip && current.close > gammaFlip;
const bearishCross = previous.close >= gammaFlip && current.close < gammaFlip;
const closeCrossPass = bullishCross || bearishCross;

// Rule 5: Gap Rule (Pullback or 2nd Close)
const gapRulePass = /* Pullback retest OR consecutive close confirmation */;

// Rule 6: Activity Alignment
const activityPass = (signal === 'CALL' && callUnusual) ||
                     (signal === 'PUT' && putUnusual);

// Final Signal
const signal = (gammaRegimePass && confluencePass && flowPass && 
                closeCrossPass && gapRulePass && activityPass) 
                ? crossDirection 
                : 'NONE';
```

---

## 🔐 Security Architecture

### API Key Management

```javascript
const ApiKeyManager = {
    // Storage: sessionStorage only (never localStorage)
    getKey() {
        return sessionStorage.getItem('orats_api_key');
    },
    
    setKey(key) {
        // Never persist to disk
        sessionStorage.setItem('orats_api_key', key.trim());
    },
    
    // Display: Masked format
    getMaskedKey() {
        const key = this.getKey();
        return key.substring(0, 4) + '...' + key.substring(key.length - 4);
    }
};
```

### Security Features

| Feature | Implementation |
|---------|---------------|
| **No Hardcoded Keys** | Removed from source code |
| **Session-Only Storage** | `sessionStorage` (cleared on tab close) |
| **Masked Display** | Shows `abcd...wxyz` |
| **Redact Mode** | Toggle to hide all sensitive data |
| **No Logging** | Token never in console.log or errors |
| **HTTPS Tunnel** | ngrok provides encryption |

---

## 📊 Data Flow Architecture

### Live Data Flow

```
User Input (Ticker)
    ↓
[UI Event Handler]
    ↓
fetchORATS() → Check API Key
    ↓
ORATS API Request (15-min delayed)
    ↓
JSON Response
    ↓
calculateGammaMetrics()
    ↓
Process Strikes Data
    ↓
Compute:
  - Gamma Flip
  - Call Wall
  - Put Support  
  - Net Gamma Exposure
  - Zone Width
    ↓
Store in window.lastData
    ↓
Update UI Metrics Panel
    ↓
User Clicks "Evaluate"
    ↓
GST.playbook.evaluateV12MR()
    ↓
Run 6 Rules
    ↓
Generate Signal (CALL/PUT/NONE)
    ↓
Update Decision Trace UI
    ↓
Display Entry/Stop/Target Levels
```

### Mock Data Flow

```
User Clicks "Test" → "Perfect CALL"
    ↓
InlineMockData.applyScenario()
    ↓
Load Predefined Scenario:
  - Ticker: SPY
  - Spot: $478.50
  - Gamma: 1.4%
  - Rules: All pass
    ↓
Store with _isMockData = true
    ↓
Update UI (purple indicator)
    ↓
User Clicks "Evaluate"
    ↓
Check _isMockData flag
    ↓
Use Mock Scenario (not live API)
    ↓
Display 6/6 Rules Passed
```

---

## 🌐 Network Architecture

### Local Network Mode

```
Phone (192.168.1.209) ←──WiFi──→ Router ←──WiFi──→ Desktop (192.168.1.151)
                                          Port 8888
```

**URL:** `http://192.168.1.151:8888/gamma-storm-tracker.html`

### Remote Access Mode (ngrok)

```
Phone (Anywhere) ←──Internet──→ ngrok Servers ←──Tunnel──→ Desktop (192.168.1.151)
       HTTPS                          HTTPS                    HTTP localhost:8888
```

**URL:** `https://abc123.ngrok.io/gamma-storm-tracker.html`

---

## 🎯 Deployment Configurations

### Development Mode
```bash
# Local testing only
cd /Users/reginaldrice/clawd
python3 -m http.server 8888
# Access: http://localhost:8888
```

### Home Network Mode
```bash
# Same WiFi access
cd /Users/reginaldrice/clawd
python3 -m http.server 8888
# Access: http://192.168.1.151:8888 (desktop IP)
```

### Remote Access Mode
```bash
# From anywhere
cd /Users/reginaldrice/clawd
./gst-remote.sh
# Access: https://abc123.ngrok.io (dynamic URL)
```

### Auto-Start Mode
```bash
# LaunchAgent (macOS)
# Starts on boot, runs continuously
launchctl load ~/Library/LaunchAgents/com.gst.server.plist
```

---

## 📈 Performance Characteristics

| Metric | Value |
|--------|-------|
| **API Latency** | 500ms - 2s (ORATS response) |
| **UI Update** | < 100ms (after data received) |
| **Rule Evaluation** | < 10ms (client-side JS) |
| **Cache Hit** | 30-second window |
| **Rate Limit** | 30 requests/minute |
| **Memory Usage** | ~50MB (browser tab) |

---

## 🔧 Customization Points

### Adjusting Playbook Thresholds

Edit in `v2.0/gst-core.js`:
```javascript
GST.config.playbook.minGammaExposure = 0.5;  // More sensitive
GST.config.playbook.minConfluenceScore = 4;   // Stricter
```

### Adding Watchlists

Create files in `SSKPPortfolio/`:
```
tech-stocks.txt:
AAPL
MSFT
GOOGL
NVDA
```

### Custom Scenarios

Add to `gamma-mock-data.js`:
```javascript
{
    id: 'earnings-spike',
    name: 'Earnings Volatility',
    gammaExposure: 2.5,
    // ... custom parameters
}
```

---

## 📚 Related Documentation

- `GST_IMPLEMENTATION_SUMMARY.md` - Feature overview
- `PLAYBOOK_VERIFICATION.md` - Testing guide
- `MOCK_DATA_GUIDE.md` - Scenario descriptions

---

**Architecture designed for reliability, security, and extensibility.**

*Built for gamma-aware traders, by traders.* 🔭⚡
