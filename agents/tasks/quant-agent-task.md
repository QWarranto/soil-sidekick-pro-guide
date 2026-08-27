# Antigravity Agent Task: Quant Strategy Agent
## Sprint: Gamma Storm Tracker v2.0 Professional Trading System

### Agent ID: quant-agent
### Priority: P1 (Critical Path)

---

## Mission
Build the quantitative core of a professional gamma-based mean reversion trading system. Implement deterministic trading rules that remove interpretation drift and enable systematic execution.

---

## Deliverables (5 Components)

### 1. playbook-engine.js
**Purpose:** Core strategy engine implementing v1.2 Mean Reversion rules

**Strategy Specification (v1.2 Mean Reversion):**

**Entry Rules (ALL must pass):**
1. **Gamma Regime Check**
   - Condition: `|netGammaExposure| >= 1.0%`
   - Description: Sufficient gamma exposure for mean reversion potential
   
2. **Confluence Check**
   - Condition: `confluenceScore >= 3`
   - Indicators:
     - Gamma flip distance > 1 ATR
     - Put/call wall separation > 2 ATR
     - IV skew > 5%
     - Unusual activity detected
     - Max pain distance > 1%
   - Need at least 3 of 5 aligned

3. **Flow Sanity Check**
   - Condition: No abnormal institutional flow conflicting with signal
   - Checks:
     - Dark pool sentiment not opposite direction
     - Block trades not overwhelmingly contrarian
     - Options flow delta not opposite

4. **30m Close Cross Detection**
   - Condition: Price closes across gamma flip level on 30m candle
   - Bullish: Close above flip (enter CALL)
   - Bearish: Close below flip (enter PUT)
   - Must be confirmed close, not just wick

5. **Gap Rule (Pullback or Second Close)**
   - Condition A: Pullback to flip after initial cross (retest)
   - Condition B: Second consecutive 30m close confirming direction
   - Either condition satisfies requirement

6. **Activity Alignment**
   - Condition: Unusual options activity aligns with signal direction
   - Call activity elevated for CALL signal
   - Put activity elevated for PUT signal

**Exit Rules:**
- **Target:** 1.5x ATR from entry (underlying price)
- **Stop:** 1.0x ATR from entry (hard stop)
- **Time:** Max 3-7 days (DTE dependent)
- **Early Exit:** Gamma flip re-crossed in opposite direction

**Position Sizing:**
- Base: $1000 risk per trade
- Size = $1000 / (ATR × 100) = contracts
- Never exceed 5% of account per trade
- Reduce size if IV > 50% (volatility adjustment)

**API:**
```javascript
class PlaybookEngine {
  constructor(config = {});
  
  evaluate(snapshot) {
    // Returns:
    {
      signal: 'NONE' | 'CALL' | 'PUT',
      confidence: 0-100,
      reasons: [...], // Which rules passed/failed
      suggestedContract: {...},
      positionSize: integer,
      entryPrice: number,
      stopLoss: number,
      target: number,
      maxHoldDays: 3-7
    }
  }
  
  getRulesStatus() {
    // Returns current status of all 6 rules
  }
  
  backtest(historicalData) {
    // Run engine on historical data
    // Returns: trades[], statistics
  }
}
```

### 2. contract-picker.js
**Purpose:** Select optimal options contract based on rules and constraints

**Selection Criteria (in priority order):**

1. **DTE (Days to Expiration)**
   - Target: 25-40 days
   - Minimum: 21 days (avoid gamma risk)
   - Maximum: 45 days (avoid theta decay)

2. **Delta**
   - Target: 0.50-0.65
   - Minimum: 0.40
   - Maximum: 0.70
   - Closer to 0.50 for pure gamma plays
   - Higher delta for directional conviction

3. **Premium Cost**
   - Maximum: $1,000 per contract
   - Adjust for position size

4. **Liquidity Requirements**
   - Minimum Open Interest: 500 contracts
   - Maximum Bid-Ask Spread: 10% of mid price
   - Volume: >100 contracts traded today

5. **Skew/Backwardation Adjustment**
   - If puts expensive (high IV): Favor CALL signals, reduce PUT position size
   - If backwardation: Reduce position size by 25%
   - If IV > 50%: Reduce position size by 33%

**Guardrails:**
- Reject if earnings within 5 days
- Reject if spread > 15%
- Reject if OI < 200
- Reject if no volume in last hour

**API:**
```javascript
class ContractPicker {
  select(snapshot, signalType) {
    // Returns:
    {
      strike: number,
      expiration: string,
      delta: number,
      premium: number,
      score: number, // 0-100 ranking
      reasons: [...], // Why this contract was selected
      alternatives: [...] // Top 3 options
    }
  }
  
  rankContracts(contracts, criteria) {
    // Internal ranking algorithm
  }
  
  validateContract(contract) {
    // Returns: { valid: boolean, reason: string }
  }
}
```

### 3. alert-engine.js
**Purpose:** Stateful alerting system for entry triggers

**State Machine:**
```
IDLE ──► MONITORING ──► TRIGGERED ──► CONFIRMED ──► ALERTED
            │                  │
            └─ timeout ────────┘
```

**States:**

1. **IDLE**
   - No active setup
   - Continuously check for gamma regime (|netGamma| >= 1.0%)

2. **MONITORING**
   - Entry: Gamma regime detected
   - Wait for: 30m candle approaching flip
   - Timeout: 2 hours (reset to IDLE)

3. **TRIGGERED**
   - Entry: Price crosses flip on 30m candle
   - Wait for: Gap rule confirmation (pullback or second close)
   - Track: High watermark for pullback detection

4. **CONFIRMED**
   - Entry: Gap rule satisfied
   - Wait for: Activity alignment check
   - Prepare: Alert payload

5. **ALERTED**
   - Entry: All conditions met
   - Action: Send notification, log signal
   - Cooldown: 30 minutes before new alert for same ticker

**Alert Channels:**
- MacOS Notification Center (primary)
- Webhook (Slack/Discord)
- Sound alert (bell)
- Visual indicator in UI

**Cooldown Logic:**
- Per-ticker cooldown: 30 minutes
- Global cooldown: 5 minutes
- Reset cooldown on: Manual dismissal or market close

**API:**
```javascript
class AlertEngine {
  constructor(config);
  
  startMonitoring(ticker);
  stopMonitoring(ticker);
  
  onPriceUpdate(ticker, price, timestamp) {
    // Process price update, advance state machine
  }
  
  getState(ticker) {
    // Returns current state: IDLE|MONITORING|TRIGGERED|CONFIRMED|ALERTED
  }
  
  setAlertHandler(handler) {
    // Register callback for when alert fires
  }
}
```

### 4. position-sizing.js
**Purpose:** ATR-based position sizing calculator

**Formula:**
```
Risk Amount = $1000 (configurable)
ATR = Average True Range (14 periods, 30m)
Stop Distance = ATR (1x ATR stop)
Position Size = Risk Amount / (Stop Distance × 100)

Adjustments:
- IV > 50%: × 0.67
- Backwardation: × 0.75
- Account limit: Max 5% of total account
```

**API:**
```javascript
class PositionSizing {
  calculate(entryPrice, atr, accountValue, iv = 30, backwardation = false) {
    // Returns:
    {
      contracts: integer,
      riskAmount: number,
      stopDistance: number,
      riskPercent: number, // Of account
      adjustedForIV: boolean,
      adjustedForTermStructure: boolean
    }
  }
  
  setRiskParameters(params) {
    // Update: baseRisk, maxPositionPercent, atrMultiplier
  }
}
```

### 5. signal-state-machine.js
**Purpose:** Manage signal lifecycle and prevent overtrading

**Signal Lifecycle:**
```
GENERATED ──► VALIDATED ──► ENTERED ──► ACTIVE ──► CLOSED
                  │
                  └─► EXPIRED (if not entered in 30 min)
```

**States:**

1. **GENERATED**
   - Playbook engine emits signal
   - Awaiting validation (contract picker confirms)

2. **VALIDATED**
   - Valid contract found
   - Position size calculated
   - Awaiting trader confirmation (or auto-execute)

3. **ENTERED**
   - Trade executed
   - Stop and target orders placed
   - Entry logged to journal

4. **ACTIVE**
   - Position open
   - Monitoring for exit conditions

5. **CLOSED**
   - Exit executed
   - P&L calculated
   - Trade logged

6. **EXPIRED**
   - Signal not acted upon within 30 minutes
   - Removed from active list

**Cooldown Management:**
- Track last signal per ticker
- Enforce minimum interval between signals
- Reset on: Position close or manual override

**API:**
```javascript
class SignalStateMachine {
  createSignal(signalData);
  validateSignal(signalId, contractData);
  enterPosition(signalId, entryData);
  updatePosition(signalId, currentPrice);
  closePosition(signalId, exitData);
  
  getActiveSignals();
  getSignalHistory(ticker = null);
  getCooldownStatus(ticker);
  
  canGenerateSignal(ticker) {
    // Returns: { allowed: boolean, reason: string, timeUntilAvailable: ms }
  }
}
```

---

## Rule Evaluation JSON Schema

```json
{
  "timestamp": 1234567890,
  "ticker": "SPY",
  "spotPrice": 450.25,
  "signal": "CALL",
  "confidence": 78,
  "rules": [
    {
      "name": "gammaRegime",
      "passed": true,
      "value": 1.2,
      "threshold": 1.0,
      "message": "Net gamma exposure: 1.2% (>= 1.0%)"
    },
    {
      "name": "confluence",
      "passed": true,
      "score": 4,
      "required": 3,
      "checks": [...]
    }
  ],
  "suggestedContract": {
    "strike": 455,
    "expiration": "2025-03-21",
    "delta": 0.55,
    "premium": 850
  },
  "position": {
    "size": 2,
    "entry": 450.25,
    "stop": 447.50,
    "target": 455.00,
    "maxHoldDays": 5
  }
}
```

---

## Integration Points

### With Frontend
- PlaybookEngine.evaluate() called on each data update
- Results displayed in Decision Trace panel
- Signal indicators updated in real-time

### With Backend
- All signals logged to database via api-server
- Historical data fetched for backtesting
- State machine persists to storage

### With Alert Engine
- PlaybookEngine emits signals to AlertEngine
- AlertEngine manages state and sends notifications
- Cooldowns coordinated between components

---

## Testing Criteria

- [ ] All 6 entry rules evaluate correctly
- [ ] Contract picker rejects illiquid options
- [ ] Alert state machine advances correctly
- [ ] Position sizing respects account limits
- [ ] Cooldown prevents signal spam
- [ ] Backtest produces consistent results
- [ ] Edge cases handled (missing data, wide spreads)

---

## Performance Requirements

- Rule evaluation: <10ms per snapshot
- Contract ranking: <50ms for 100 contracts
- State machine: <1ms per price update
- Backtest: 30 days of data in <5 seconds

---

## Time Estimate
8-10 hours of agent work

## Success Definition
Engine produces deterministic, auditable signals that match specified rules, contract picker selects liquid, appropriately-priced options, alert system triggers reliably without spam.
