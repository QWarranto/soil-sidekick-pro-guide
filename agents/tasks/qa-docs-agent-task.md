# Antigravity Agent Task: QA & Documentation Agent
## Sprint: Gamma Storm Tracker v2.0 Professional Trading System

### Agent ID: qa-docs-agent
### Priority: P2 (Supporting)

---

## Mission
Ensure code quality, comprehensive testing, and clear documentation for a professional trading system. Create guardrails that prevent regressions and enable confident deployment.

---

## Deliverables (5 Areas)

### 1. Golden Test Fixtures
**Purpose:** 20 historical scenarios with expected signals for regression testing

**Fixture Format:**
```javascript
{
  "id": "spy-2024-01-15-morning",
  "description": "SPY morning gamma squeeze with mean reversion setup",
  "ticker": "SPY",
  "timestamp": 1705318800,
  "spotPrice": 478.50,
  "data": {
    "gammaMetrics": {
      "netGammaExposure": 1.4,
      "gammaFlip": 476.25,
      "callWall": 480.00,
      "putSupport": 475.00,
      "regime": "NEGATIVE_GAMMA"
    },
    "confluence": {
      "flipDistance": 1.2, // ATRs
      "wallSeparation": 2.1,
      "ivSkew": 6.5,
      "unusualActivity": true,
      "maxPainDistance": 1.2,
      "score": 4
    },
    "ohlcv": {
      "current30m": { open: 477.00, high: 479.50, low: 476.75, close: 478.50 },
      "previous30m": { open: 476.50, high: 477.75, low: 476.00, close: 477.00 }
    },
    "flow": {
      "darkPoolSentiment": "neutral",
      "optionsFlowDelta": 0.3
    },
    "activity": {
      "callUnusual": true,
      "putUnusual": false
    }
  },
  "expected": {
    "signal": "CALL",
    "confidence": 82,
    "rulesPassed": ["gammaRegime", "confluence", "30mClose", "gapRule", "activity"],
    "rulesFailed": ["flowSanity"],
    "suggestedContract": {
      "strike": 480,
      "expiration": "2025-02-16",
      "delta": 0.55
    }
  }
}
```

**20 Scenarios to Create:**

1. **SPY Morning Squeeze** - Strong negative gamma, CALL signal
2. **QQQ Afternoon Fade** - Positive gamma exhaustion, PUT signal
3. **IWM Low Gamma** - Insufficient gamma exposure, NONE
4. **AAPL Earnings Prep** - High IV, rejected (earnings proximity)
5. **TSLA Volatility Spike** - Backwardation, reduced position size
6. **NVDA Gap Up** - Missed entry, no pullback, NONE
7. **META Confluence Fail** - Only 2/5 indicators, NONE
8. **AMZN Flow Conflict** - Dark pool opposite, NONE
9. **AMD Illiquid Options** - Wide spreads, rejected
10. **MSFT Perfect Setup** - All 6 rules pass, high confidence CALL
11. **GOOGL Double Confirmation** - Second 30m close, confirmed CALL
12. **NFLX Pullback Entry** - Retest of flip, CALL
13. **AMD Expiration Week** - DTE 12, rejected (too close)
14. **SPY Range Day** - No cross of flip, NONE all day
15. **QQQ Late Day** - After 3 PM, time cutoff, NONE
16. **IWM Max Pain Play** - Price gravitating to max pain, PUT
17. **TSLA IV Crush Post-Earnings** - Next day, CALL
18. **META Skew Extreme** - Puts expensive, favor CALLs
19. **AMZN Low Activity** - No unusual activity, NONE
20. **SPY Choppy** - Multiple crosses, whipsaw, final NONE

**Files:**
- `test/fixtures/scenarios.json` - All 20 scenarios
- `test/fixtures/README.md` - Description of each scenario

### 2. Unit Tests for Playbook Engine
**Purpose:** Comprehensive test coverage for core strategy logic

**Test File:** `test/playbook-engine.test.js`

**Test Cases:**

```javascript
describe('PlaybookEngine', () => {
  describe('Rule Evaluation', () => {
    test('gammaRegime passes when |netGamma| >= 1.0%', () => {});
    test('gammaRegime fails when |netGamma| < 1.0%', () => {});
    test('confluence passes with score >= 3', () => {});
    test('confluence fails with score < 3', () => {});
    test('30mClose detects bullish cross above flip', () => {});
    test('30mClose detects bearish cross below flip', () => {});
    test('30mClose ignores wicks without close', () => {});
    test('gapRule accepts pullback retest', () => {});
    test('gapRule accepts second confirmation close', () => {});
    test('gapRule rejects single cross', () => {});
    test('flowSanity passes with neutral/opposing flow', () => {});
    test('flowSanity fails with conflicting flow', () => {});
    test('activityAlignment passes when activity matches direction', () => {});
    test('activityAlignment fails when activity opposes direction', () => {});
  });
  
  describe('Signal Generation', () => {
    test('generates CALL when all rules pass bullish', () => {});
    test('generates PUT when all rules pass bearish', () => {});
    test('generates NONE when any rule fails', () => {});
    test('confidence reflects rule pass rate', () => {});
    test('confidence bonus for additional confluence', () => {});
  });
  
  describe('Golden Fixtures', () => {
    test.each(fixtures)('scenario %s produces expected signal', (fixture) => {});
  });
  
  describe('Backtest Mode', () => {
    test('processes 30 days of data', () => {});
    test('generates trade list with entries/exits', () => {});
    test('calculates win rate correctly', () => {});
    test('calculates average P&L', () => {});
    test('handles missing data gracefully', () => {});
  });
  
  describe('Edge Cases', () => {
    test('handles missing gamma data', () => {});
    test('handles zero ATR (flat market)', () => {});
    test('handles extreme IV (>100%)', () => {});
    test('handles after-hours data', () => {});
    test('handles weekend gaps', () => {});
  });
});
```

**Coverage Target:**
- Lines: >90%
- Functions: >95%
- Branches: >85%

### 3. Integration Tests for Alert System
**Purpose:** End-to-end testing of alert pipeline

**Test File:** `test/alert-system.test.js`

**Test Cases:**

```javascript
describe('AlertEngine Integration', () => {
  describe('State Machine', () => {
    test('transitions IDLE → MONITORING on gamma regime', () => {});
    test('transitions MONITORING → TRIGGERED on cross', () => {});
    test('transitions TRIGGERED → CONFIRMED on gap rule', () => {});
    test('transitions CONFIRMED → ALERTED on activity', () => {});
    test('resets to IDLE on timeout', () => {});
    test('maintains state across price updates', () => {});
  });
  
  describe('Cooldown Management', () => {
    test('enforces 30-minute per-ticker cooldown', () => {});
    test('enforces 5-minute global cooldown', () => {});
    test('resets cooldown on manual dismiss', () => {});
    test('resets cooldown at market open', () => {});
  });
  
  describe('Notification Delivery', () => {
    test('sends macOS notification on alert', () => {});
    test('sends webhook POST to Slack', () => {});
    test('plays sound alert', () => {});
    test('updates UI indicator', () => {});
    test('logs alert to database', () => {});
  });
  
  describe('Multi-Ticker Support', () => {
    test('monitors multiple tickers independently', () => {});
    test('independent cooldowns per ticker', () => {});
    test('handles 10+ simultaneous tickers', () => {});
  });
});
```

### 4. Mac Sequoia Setup Documentation
**Purpose:** Complete setup guide for Mac M1 with macOS Sequoia 15.4

**File:** `SETUP_MAC_SEQUOIA.md`

**Sections:**

```markdown
# Gamma Storm Tracker v2.0 - Mac Sequoia Setup Guide

## Prerequisites
- Mac with Apple Silicon (M1/M2/M3)
- macOS Sequoia 15.4 or later
- 8GB+ RAM recommended
- 5GB free disk space

## 1. Browser Setup

### Chrome (Recommended)
```bash
# Install Chrome if not present
brew install --cask google-chrome

# Enable notifications
# System Settings → Notifications → Chrome → Allow
```

### Safari (Alternative)
- Enable Developer Menu: Safari → Settings → Advanced → Show Develop menu

## 2. API Keys in macOS Keychain

```bash
# Install ORATS token securely
security add-generic-password -s "com.gammastorm.orats" -a "api_token" -w "YOUR_TOKEN"

# Retrieve in code
# security find-generic-password -s "com.gammastorm.orats" -w
```

## 3. Launchd Service for Background Recording

Create `~/Library/LaunchAgents/com.gammastorm.recorder.plist`:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>Label</key>
    <string>com.gammastorm.recorder</string>
    <key>ProgramArguments</key>
    <array>
        <string>/usr/local/bin/node</string>
        <string>/Users/YOURNAME/clawd/snapshot-recorder-service.js</string>
    </array>
    <key>StartCalendarInterval</key>
    <array>
        <dict>
            <key>Weekday</key>
            <integer>1</integer>
            <key>Hour</key>
            <integer>9</integer>
            <key>Minute</key>
            <integer>0</integer>
        </dict>
        <!-- Repeat for Mon-Fri -->
    </array>
    <key>StandardOutPath</key>
    <string>/tmp/gammastorm.log</string>
    <key>StandardErrorPath</key>
    <string>/tmp/gammastorm.error</string>
</dict>
</plist>
```

Load the service:
```bash
launchctl load ~/Library/LaunchAgents/com.gammastorm.recorder.plist
```

## 4. Performance Optimization

### Disable Unnecessary Animations
```bash
# Reduce motion
defaults write com.apple.Accessibility ReduceMotionEnabled -bool true
```

### File Watcher (for dev)
```bash
brew install watchman
```

## 5. Security

### FileVault
Ensure FileVault is enabled:
```bash
fdesetup status
```

### Firewall
```bash
sudo /usr/libexec/ApplicationFirewall/socketfilterfw --setglobalstate on
```

## 6. Testing Installation

```bash
cd /Users/YOURNAME/clawd
npm test  # Run full test suite
```

Expected output:
```
✓ 47 tests passed
✓ 0 tests failed
✓ 92% code coverage
```

## Troubleshooting

### "Database locked" error
- Quit all browser tabs
- Delete IndexedDB and refresh

### Slow performance
- Check Activity Monitor for memory pressure
- Close unused browser tabs
- Disable browser extensions

### Notifications not working
- Check System Settings → Notifications
- Ensure browser has permission
- Test with: `osascript -e 'display notification "Test"'`

## 7. Uninstall

```bash
launchctl unload ~/Library/LaunchAgents/com.gammastorm.recorder.plist
rm ~/Library/LaunchAgents/com.gammastorm.recorder.plist
security delete-generic-password -s "com.gammastorm.orats"
```
```

### 5. API Schema Documentation
**Purpose:** Complete data schema reference

**File:** `API_SCHEMA.md`

**Contents:**

```markdown
# Gamma Storm Tracker API Schema

## Data Types

### OHLCV
```typescript
interface OHLCV {
  timestamp: number;      // Unix timestamp (seconds)
  open: number;          // Opening price
  high: number;          // High price
  low: number;           // Low price
  close: number;         // Closing price
  volume: number;        // Volume
}
```

### GammaMetrics
```typescript
interface GammaMetrics {
  spotPrice: number;
  netGammaExposure: number;  // Percentage (1.2 = 1.2%)
  gammaFlip: number;         // Price level
  callWall: number;          // Strike with highest call gamma
  putSupport: number;        // Strike with highest put gamma
  regime: 'NEGATIVE_GAMMA' | 'POSITIVE_GAMMA';
  zoneWidth: number;         // Percentage
  expiration: string;        // YYYY-MM-DD
  dte: number;               // Days to expiration
}
```

### OptionsChain
```typescript
interface OptionStrike {
  strike: number;
  callIv: number;
  callDelta: number;
  callGamma: number;
  callTheta: number;
  callVega: number;
  callOi: number;
  putIv: number;
  putDelta: number;
  putGamma: number;
  putTheta: number;
  putVega: number;
  putOi: number;
}
```

### PlaybookSignal
```typescript
interface PlaybookSignal {
  timestamp: number;
  ticker: string;
  type: 'NONE' | 'CALL' | 'PUT';
  confidence: number;        // 0-100
  reasons: RuleEvaluation[];
  suggestedContract: Contract;
  position: PositionParams;
}

interface RuleEvaluation {
  name: string;
  passed: boolean;
  value?: number;
  threshold?: number;
  message: string;
}
```

## REST API Endpoints

### GET /api/snapshot/:ticker
Returns latest snapshot for ticker.

**Response:**
```json
{
  "ticker": "SPY",
  "timestamp": 1705318800,
  "spotPrice": 478.50,
  "gammaMetrics": {...},
  "optionsChain": [...],
  "signal": {...}
}
```

### POST /api/signal
Submit new signal.

**Request Body:**
```json
{
  "ticker": "SPY",
  "type": "CALL",
  "confidence": 82,
  "reasons": [...]
}
```

## WebSocket Events

### snapshot
Emitted when new snapshot recorded.

### signal
Emitted when playbook generates signal.

### trade
Emitted on trade entry/exit.
```

---

## Test Infrastructure

### Test Runner: Jest
```bash
npm install --save-dev jest
```

### Coverage Tool: c8
```bash
npm install --save-dev c8
```

### Test Scripts (package.json)
```json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "c8 jest",
    "test:fixtures": "jest test/fixtures/"
  }
}
```

### CI Pipeline (Local)
```bash
#!/bin/bash
# .github/workflows/test.yml equivalent for local

npm run lint
npm run test
npm run test:coverage

if [ $? -ne 0 ]; then
  echo "Tests failed!"
  exit 1
fi

echo "All checks passed!"
```

---

## Quality Gates

Before any code is merged:

- [ ] All unit tests pass
- [ ] Coverage >90%
- [ ] All golden fixtures pass
- [ ] Integration tests pass
- [ ] Linting passes (ESLint)
- [ ] Documentation updated
- [ ] CHANGELOG.md updated

---

## Time Estimate
6-8 hours of agent work

## Success Definition
Comprehensive test suite validates all components, documentation enables new developer onboarding in <30 minutes, setup guide produces working system on clean Mac.
