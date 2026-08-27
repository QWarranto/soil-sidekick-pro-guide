# Antigravity Agent Task: Frontend UI/UX Agent
## Sprint: Gamma Storm Tracker v2.0 Professional Trading System

### Agent ID: frontend-agent
### Priority: P1 (Critical Path)

---

## Mission
Build the visual layer for a professional-grade gamma-based mean reversion trading system. Create stunning, actionable visualizations that transform raw data into trading decisions.

---

## Deliverables (5 Components)

### 1. gamma-heatmap.js
**Purpose:** Strike-by-expiry gamma exposure heatmap

**Requirements:**
- X-axis: Strike prices (centered on spot)
- Y-axis: Expiration dates (DTE)
- Color intensity: Gamma exposure (calls green, puts red, net white/black)
- Interactive: Hover shows exact gamma values
- Zoom: Allow zoom into specific strike/expiry range
- ATM highlighting: Yellow border around ATM strike

**Technical:**
- Use Canvas API for performance (could be 1000+ data points)
- Dark theme matching existing tracker (#0a0a0f background)
- Responsive: min-width 600px, auto-height
- Color scale: -100 (deep red) → 0 (black) → +100 (deep green)

**Integration:**
- Input: `strikes[]` array from ORATS data
- Output: Rendered canvas element
- Mount: Append to gamma-storm-tracker.html options panel

### 2. gamma-walls-overlay.js
**Purpose:** Overlay top N gamma walls on 30m price chart

**Requirements:**
- Identify top 5 call walls (highest gamma exposure above spot)
- Identify top 5 put walls (highest gamma exposure below spot)
- Draw horizontal lines on price chart at wall strikes
- Labels: "CW: $450.00 (2.4M)" for call walls, "PW: $440.00 (1.8M)" for put walls
- Color: Green for call walls, Red for put walls, semi-transparent
- Toggle: Show/hide walls button

**Technical:**
- Use existing Chart.js if available, else Canvas
- Sync with price data updates
- Dynamic recalculation on ticker change

### 3. decision-trace-panel.js
**Purpose:** Show rule-by-rule gating for playbook decisions

**Requirements:**
- Panel title: "Decision Trace"
- List all playbook rules with status:
  - ✓ PASSED: Green checkmark
  - ✗ FAILED: Red X with reason
  - ⏳ WAITING: Yellow clock
- Rules to display:
  1. Gamma regime check (netGammaExposure >= 1.0%)
  2. Confluence check (>=3 indicators aligned)
  3. Flow sanity check
  4. 30m close cross detection
  5. Gap rule (pullback or second close)
  6. Activity alignment
- Timestamp for each evaluation
- Final signal: NONE | CALL | PUT with confidence %

**Technical:**
- Collapsible panel (default expanded)
- Auto-scroll to latest evaluation
- Export trace as JSON

### 4. trade-journal-ui.js
**Purpose:** Interface for recording and reviewing trades

**Requirements:**
- Entry form fields:
  - Signal type (CALL/PUT)
  - Entry price (underlying)
  - Contract details (strike, expiry, delta)
  - Position size (contracts)
  - Stop loss level
  - Target level
  - Screenshot (auto-captured)
  - Notes (free text)
- Exit form fields:
  - Exit price
  - P&L
  - Exit reason (hit target, hit stop, manual, expiry)
- Trade list: Sortable table with filters
- Stats: Win rate, avg P&L, max drawdown

**Technical:**
- Store in localStorage (migrated to SQLite later)
- Export to CSV
- Screenshot integration using html2canvas or similar

### 5. signal-indicators.js
**Purpose:** Visual signal indicators (NONE|CALL|PUT)

**Requirements:**
- Large prominent indicator in header
- States:
  - NONE: Gray/neutral, "NO SIGNAL"
  - CALL: Green pulsing, "CALL SIGNAL" + confidence %
  - PUT: Red pulsing, "PUT SIGNAL" + confidence %
- Audio alert option (bell sound)
- Mac notification integration
- History: Last 10 signals with timestamps

**Technical:**
- Update in real-time (every 30s during market hours)
- Pulse animation for active signals
- Click to view Decision Trace

---

## Design System

### Colors
```css
--bg-primary: #0a0a0f
--bg-secondary: #12121a
--bg-tertiary: #1a1a25
--accent-green: #00ff88
--accent-red: #ff4444
--accent-yellow: #ffcc00
--accent-blue: #00ccff
--text-primary: #e0e0e0
--text-secondary: #8b949e
```

### Typography
- Font: 'SF Mono', 'Monaco', monospace
- Sizes: 11px (data), 14px (labels), 18px (headers), 32px (signals)

### Layout
- Container max-width: 1400px
- Grid gap: 20px
- Border radius: 8px (panels), 4px (buttons)

---

## Integration Points

### Input Data Format
```javascript
{
  spotPrice: 450.25,
  strikes: [...], // ORATS strike data
  expirations: {...}, // By expiry date
  gammaMetrics: {
    netGammaExposure: 1.2,
    regime: 'NEGATIVE_GAMMA',
    flip: 448.50,
    walls: { callWalls: [...], putWalls: [...] }
  },
  playbookSignal: {
    type: 'CALL',
    confidence: 78,
    rules: [...] // Decision trace
  }
}
```

### Output
All components mount to DOM elements in gamma-storm-tracker.html

---

## Testing Criteria

- [ ] Heatmap renders 1000+ data points without lag
- [ ] Walls overlay syncs with price updates
- [ ] Decision Trace updates in real-time
- [ ] Journal entries persist across reloads
- [ ] Signal indicators pulse correctly
- [ ] All components match dark theme
- [ ] Responsive on 1280px+ screens

---

## Time Estimate
4-6 hours of agent work

## Success Definition
All 5 components render correctly with sample data, integrated into existing tracker UI.
