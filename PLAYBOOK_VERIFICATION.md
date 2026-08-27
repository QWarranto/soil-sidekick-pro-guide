# Gamma Storm Tracker - Playbook Verification Guide

## ✅ Verified Components

### 1. Playbook Engine (v1.2 Mean Reversion)
**Location:** `v2.0/gst-playbook-engine.js`

**6 Rules Implemented:**

| Rule | Description | Threshold |
|------|-------------|-----------|
| **Gamma Regime** | Net gamma exposure must be sufficient | ≥ 1.0% |
| **Confluence** | At least 3 of 5 indicators align | 3/5 indicators |
| **Flow Sanity** | Dark pool/options flow shouldn't conflict | No bearish flow for CALL |
| **30m Close Cross** | Price closes across gamma flip level | Cross detected |
| **Gap Rule** | Pullback retest or 2nd confirming close | Confirmed |
| **Activity** | Unusual options activity aligns | Aligned with signal |

### 2. Decision Trace UI
**Location:** `v2.0/gst-decision-trace.js`

- Real-time rule-by-rule audit trail
- Visual pass/fail indicators
- Signal confidence display
- Entry/stop/target levels calculation
- Export to JSON functionality

### 3. Mock Data Scenarios
**Location:** `gamma-mock-data.js`

**5 Test Scenarios:**

| Scenario | Signal | Confidence | Rules Passed | Purpose |
|----------|--------|------------|--------------|---------|
| **Perfect CALL** | CALL | 92% | 6/6 | Ideal long setup |
| **Perfect PUT** | PUT | 88% | 6/6 | Ideal short setup |
| **Failed Confluence** | NONE | 0% | 1/6 | Test confluence filter |
| **No Gamma Regime** | NONE | 0% | 5/6 | Test gamma threshold |
| **Illiquid Options** | CALL | 85% | 6/6 | Test contract filtering |

---

## 🧪 Testing Instructions

### Step 1: Start the Server
```bash
cd /Users/reginaldrice/clawd
python3 -m http.server 8888
```

### Step 2: Open the Tracker
```
http://localhost:8888/gamma-storm-tracker.html
```

### Step 3: Test Playbook Evaluation

#### Test A: Mock Data Scenarios
1. Click **🧪 TEST** button (top control panel)
2. The "Perfect CALL" scenario loads automatically
3. Click **🎯 EVALUATE** button (Decision Trace panel)
4. Verify:
   - Signal: **CALL**
   - Confidence: **92%**
   - Rules Passed: **6/6**
   - All rules show ✅

5. Click **Next ▶** to cycle through scenarios
6. Click **EVALUATE** for each and verify expected results

#### Test B: Live Data (Market Hours)
1. Enter ticker: `SPY`
2. Click **⏎ LOAD DATA**
3. Wait for data to load
4. Click **🎯 EVALUATE**
5. Review rule-by-rule analysis

### Step 4: Verify Rule Logic

Open browser console (F12) and run:
```javascript
// Run automated verification
runVerification();
```

Expected output:
```
═══════════════════════════════════════════════════════════
  RESULTS: 5 passed, 0 failed
═══════════════════════════════════════════════════════════
```

---

## 📋 Rule Details

### Rule 1: Gamma Regime
```javascript
// Pass condition
Math.abs(netGammaExposure) >= 1.0  // 1% threshold

// Examples:
// SPY with 1.4% net gamma → PASS
// AAPL with 0.4% net gamma → FAIL
```

### Rule 2: Confluence (5 Indicators)
```javascript
// Need 3+ of these:
1. Flip distance > 1.0 ATR
2. Wall separation > 2.0 ATR  
3. IV skew > 5.0
4. Unusual activity detected
5. Max pain distance > 1.0 ATR
```

### Rule 3: Flow Sanity
```javascript
// Pass conditions:
CALL signal: darkPool !== 'bearish' && optionsFlowDelta > -0.3
PUT signal: darkPool !== 'bullish' && optionsFlowDelta < 0.3
```

### Rule 4: 30m Close Cross
```javascript
// Bullish: previous.close <= flip && current.close > flip
// Bearish: previous.close >= flip && current.close < flip
```

### Rule 5: Gap Rule
```javascript
// Condition A: Pullback retest
// - Initial cross happened
// - Pullback to flip
// - Bounce in signal direction

// Condition B: Second confirming close
// - Consecutive closes in signal direction
```

### Rule 6: Activity Alignment
```javascript
CALL signal: callUnusual === true
PUT signal: putUnusual === true
```

---

## 🔧 Troubleshooting

### Issue: "Playbook Engine not loaded"
**Solution:** Refresh the page and check console for errors

### Issue: "No data available"
**Solution:** Either:
- Load a ticker with LOAD DATA button
- Activate TEST mode first

### Issue: Decision Trace shows "Awaiting evaluation"
**Solution:** Click the **EVALUATE** button after loading data

### Issue: Mock scenarios not cycling
**Solution:** Check console for `GST.MockData` availability:
```javascript
console.log(GST.MockData.getAll());
```

---

## 📊 Expected Evaluation Results

### Perfect CALL Scenario
```
🎯 Decision Trace
═══════════════════════════════════════
Ticker: SPY | Price: 478.50
Signal: ✓ CALL | Confidence: 92%
Rules: 6/6 passed
═══════════════════════════════════════

✓ Gamma Regime      Net gamma: 1.4% ≥ 1.0%
✓ Confluence        4/5 indicators aligned
✓ Flow Sanity       Flow aligned
✓ 30m Close Cross   CALL: price crossed 476.25
✓ Gap Rule          Second close confirmation
✓ Activity          Call activity elevated

📈 Execution Plan
Entry:  478.50
Stop:   476.50  (1.0 ATR)
Target: 481.50  (1.5 ATR)
R:R    1:1.5
```

### Failed Confluence Scenario
```
🎯 Decision Trace
═══════════════════════════════════════
Ticker: IWM | Price: 215.25
Signal: ✗ NO SIGNAL | Confidence: 0%
Rules: 1/6 passed
═══════════════════════════════════════

✓ Gamma Regime      Net gamma: 1.1% ≥ 1.0%
✗ Confluence        2/5 indicators (need 3+)
✗ Flow Sanity       Mixed flow
✗ 30m Close Cross   No cross detected
✗ Gap Rule          Awaiting confirmation
✗ Activity          No unusual activity
```

---

## 📝 Files Modified

1. **gamma-storm-tracker.html**
   - Added `runPlaybookEvaluation()` function
   - Added `exportDecisionTrace()` function
   - Added `renderDecisionTraceFallback()` function
   - Linked `playbook-verification.js`

2. **gamma-mock-data.js**
   - Added `_mockScenario` tag to track mock data
   - Added `_isMockData` flag

3. **playbook-verification.js** (NEW)
   - Automated test suite for all 5 scenarios
   - Rule-by-rule verification
   - Console reporting

---

## ✅ Verification Checklist

- [ ] All 5 mock scenarios load correctly
- [ ] Perfect CALL shows 92% confidence, 6/6 rules
- [ ] Perfect PUT shows 88% confidence, 6/6 rules
- [ ] Failed Confluence shows 0% confidence, 1/6 rules
- [ ] No Gamma Regime shows 0% confidence, 5/6 rules
- [ ] Decision Trace UI renders correctly
- [ ] Export function downloads JSON file
- [ ] Console verification passes all tests
- [ ] Live data evaluation works (market hours)

---

## 🚀 Next Steps

1. **Test with live market data** during trading hours
2. **Add more edge case scenarios**:
   - Pre-market conditions
   - Post-market conditions
   - High volatility (VIX > 30)
   - Low volatility (VIX < 15)
3. **Hook up real alerts** via Telegram/Discord
4. **Add backtesting capability** with historical data
