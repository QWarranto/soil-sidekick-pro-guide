# Gamma Storm Tracker - Mock Data Testing System
## Off-Market Testing Documentation

---

## Overview

The Mock Data System allows you to test the Gamma Storm Tracker and validate playbook rules **during off-market hours** using 5 predefined scenarios. Each scenario represents a realistic trading situation with complete data (price action, gamma metrics, flow, activity).

---

## The 5 Test Scenarios

### 1. ✅ Perfect CALL Setup
**ID:** `perfect-call`

**Situation:** Ideal mean reversion long opportunity

**Why it passes:**
- Gamma regime: 1.4% exposure (>= 1.0% threshold) ✓
- Confluence: 4/5 indicators aligned ✓
- 30m close: Price crossed above flip ✓
- Gap rule: Second close confirmed ✓
- Flow: Neutral/bullish ✓
- Activity: Elevated call volume ✓

**Expected Signal:** CALL (92% confidence)

**Contract:** 480 strike, 37 DTE, 0.55 delta

**Trade Plan:**
- Entry: $478.50
- Stop: $476.50 (1.0 ATR)
- Target: $481.50 (1.5 ATR)
- Size: 2 contracts

---

### 2. ✅ Perfect PUT Setup
**ID:** `perfect-put`

**Situation:** Ideal mean reversion short opportunity

**Why it passes:**
- Gamma regime: -1.3% exposure (>= 1.0% threshold) ✓
- Confluence: 4/5 indicators aligned ✓
- 30m close: Price crossed below flip ✓
- Gap rule: Second close confirmed ✓
- Flow: Bearish ✓
- Activity: Elevated put volume ✓

**Expected Signal:** PUT (88% confidence)

**Contract:** 412 strike, 37 DTE, -0.52 delta

**Trade Plan:**
- Entry: $412.50
- Stop: $414.50 (1.0 ATR)
- Target: $409.50 (1.5 ATR)
- Size: 2 contracts

---

### 3. ⚠️ Failed Confluence
**ID:** `failed-confluence`

**Situation:** Good gamma regime but insufficient indicator alignment

**Why it fails:**
- Gamma regime: 1.1% ✓
- Confluence: Only 2/5 indicators (need 3+) ✗
  - Flip distance: 0.4 ATR (too close)
  - Wall separation: 1.2 (too narrow)
  - IV skew: 2.1% (too flat)
  - No unusual activity
  - Max pain distance: 0.3%

**Expected Signal:** NONE (0% confidence)

**Lesson:** Not all high-gamma setups are tradeable. Need multiple factors aligned.

---

### 4. ⚠️ No Gamma Regime
**ID:** `no-gamma-regime`

**Situation:** Perfect confluence but insufficient gamma exposure

**Why it fails:**
- Gamma regime: 0.4% (need >= 1.0%) ✗
- Confluence: 4/5 indicators aligned ✓
- Flow: Bullish ✓
- Activity: Elevated calls ✓

**Expected Signal:** NONE (0% confidence)

**Lesson:** Even perfect technical setups fail without sufficient gamma exposure. The gamma regime is the foundation.

---

### 5. ❌ Illiquid Options - Rejected
**ID:** `illiquid-options`

**Situation:** Perfect setup but options too illiquid for entry

**Why signal generates but contract rejected:**
- All 6 rules pass ✓
- Signal: CALL (85% confidence) ✓
- **BUT contract picker rejects:**
  - Spread: 18% (max allowed: 10%)
  - Open Interest: 45 contracts (min: 500)
  - Volume: 2 contracts today

**Expected Signal:** CALL → REJECTED

**Lesson:** Good setups are worthless without liquid options. Guardrails prevent bad executions.

---

## How to Use Test Mode

### Step 1: Activate Test Mode
1. Open `gamma-storm-tracker.html` in browser
2. Click the **🧪 TEST** button in the control panel
3. Test Mode panel appears (purple border)

### Step 2: Load Scenarios
**Option A:** Click scenario buttons
- ✅ Perfect CALL
- ✅ Perfect PUT
- ⚠️ Failed Confluence
- ⚠️ No Gamma Regime
- ❌ Illiquid

**Option B:** Navigate with arrows
- ◀ Prev: Previous scenario
- Next ▶: Next scenario

### Step 3: Analyze Results
The tracker will display:
- **Options Chain:** Full Greeks for the scenario
- **Gamma Metrics:** Flip, walls, regime
- **6 Feature Tabs:** All analysis tools work
- **Expected Signal:** Compare to what you see

### Step 4: Step Through Rules
1. Click **Decision Trace** tab (when implemented)
2. See which rules passed/failed
3. Verify your understanding of the strategy

### Step 5: Exit Test Mode
Click **✕ Exit** button to return to live data.

---

## What You Can Test

### ✅ Working in Test Mode
- Options chain display with all Greeks
- Gamma metrics calculations
- All 6 options analysis features
- UI responsiveness and layout
- Color coding and visual indicators
- Tab navigation
- Scroll and zoom

### ❌ Not Available in Test Mode
- Real-time 30m close detection (static data)
- Live alert triggering
- Price action updates
- WebSocket updates
- Database recording

---

## Console Commands (Advanced)

Open browser console (F12) to use:

```javascript
// View all scenarios
GST.MockData.getAll()

// Get current scenario
GST.MockData.getCurrent()

// Navigate scenarios
GST.MockData.next()
GST.MockData.previous()

// Load specific scenario
GST.MockData.applyScenario(GST.MockData.getById('perfect-call'))

// Reset to first scenario
GST.MockData.reset()
```

---

## Adding Custom Scenarios

To add your own test scenario:

1. Edit `gamma-mock-data.js`
2. Add to `scenarios` array following this structure:

```javascript
{
    id: 'your-scenario-id',
    name: 'Descriptive Name',
    description: 'What this tests',
    ticker: 'TICKER',
    timestamp: Date.now(),
    spotPrice: 100.00,
    data: {
        gammaMetrics: {
            netGammaExposure: 1.2,
            gammaFlip: 98.50,
            callWall: 102.00,
            putSupport: 97.00,
            regime: 'NEGATIVE_GAMMA',
            zoneWidth: 5.0,
            expiration: '2025-03-21',
            dte: 30
        },
        confluence: {
            flipDistance: 1.5,
            wallSeparation: 2.5,
            ivSkew: 6.0,
            unusualActivity: true,
            maxPainDistance: 1.0,
            score: 4
        },
        ohlcv: {
            history: [
                { time: '10:00', open: 99, high: 101, low: 98, close: 100 },
                { time: '10:30', open: 100, high: 102, low: 99, close: 101 }
            ]
        },
        flow: {
            darkPoolSentiment: 'neutral',
            optionsFlowDelta: 0.2,
            blockTrades: 'balanced'
        },
        activity: {
            callUnusual: true,
            putUnusual: false,
            callVolume: 10000,
            putVolume: 3000
        }
    },
    expected: {
        signal: 'CALL',
        confidence: 85,
        rulesPassed: ['gammaRegime', 'confluence', '30mClose', 'gapRule', 'flowSanity', 'activity'],
        rulesFailed: [],
        suggestedContract: {
            strike: 102,
            expiration: '2025-03-21',
            delta: 0.55,
            premium: 800
        },
        position: {
            size: 2,
            entry: 100.00,
            stop: 98.00,
            target: 103.00,
            maxHoldDays: 5
        }
    }
}
```

3. Refresh browser to load new scenario

---

## Testing Checklist

Use these scenarios to validate your understanding:

- [ ] **Perfect CALL:** Can you identify all 6 passing rules?
- [ ] **Perfect PUT:** Can you identify bearish confluence?
- [ ] **Failed Confluence:** Why did this fail despite good gamma?
- [ ] **No Gamma Regime:** Why didn't this trigger despite good confluence?
- [ ] **Illiquid:** Would you have recognized the liquidity problem?

---

## Transition to Live Testing

After testing with mock data:

1. Exit test mode (✕ Exit)
2. Wait for market hours (9:30 AM ET)
3. Load SPY, QQQ, or IWM
4. Watch for real setups matching these patterns
5. Compare live signals to mock expectations

---

## Files

- `gamma-mock-data.js` - Mock data module (16.6KB)
- `gamma-storm-tracker.html` - Updated with test mode UI

---

## Version

**Mock Data System v1.0**  
**Date:** 2026-02-04  
**Scenarios:** 5  
**Status:** ✅ Ready for off-market testing

---

**Happy Testing!** 🧪⚡
