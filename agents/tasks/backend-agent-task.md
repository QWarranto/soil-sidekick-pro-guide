# Antigravity Agent Task: Backend & Data Agent
## Sprint: Gamma Storm Tracker v2.0 Professional Trading System

### Agent ID: backend-agent
### Priority: P1 (Critical Path)

---

## Mission
Build the data infrastructure for a professional trading system. Create robust storage, caching, and replay capabilities for deterministic testing and reliable operation.

---

## Deliverables (5 Components)

### 1. snapshot-store.js
**Purpose:** SQLite/DuckDB database for all trading data

**Requirements:**
- Database: SQLite (via sql.js for browser compatibility)
- Tables:
  ```sql
  -- OHLCV data (30m and daily)
  CREATE TABLE ohlcv (
    id INTEGER PRIMARY KEY,
    ticker TEXT NOT NULL,
    timeframe TEXT NOT NULL, -- '30m' or '1d'
    timestamp INTEGER NOT NULL,
    open REAL,
    high REAL,
    low REAL,
    close REAL,
    volume INTEGER
  );
  
  -- Gamma metrics snapshots
  CREATE TABLE gamma_snapshots (
    id INTEGER PRIMARY KEY,
    ticker TEXT NOT NULL,
    timestamp INTEGER NOT NULL,
    spot_price REAL,
    net_gamma_exposure REAL,
    gamma_flip REAL,
    call_wall REAL,
    put_support REAL,
    regime TEXT,
    zone_width REAL,
    expiration TEXT,
    dte INTEGER
  );
  
  -- Options chain snapshots
  CREATE TABLE options_chains (
    id INTEGER PRIMARY KEY,
    ticker TEXT NOT NULL,
    expiration TEXT NOT NULL,
    timestamp INTEGER NOT NULL,
    strike REAL,
    call_iv REAL,
    call_delta REAL,
    call_gamma REAL,
    call_theta REAL,
    call_vega REAL,
    call_oi INTEGER,
    put_iv REAL,
    put_delta REAL,
    put_gamma REAL,
    put_theta REAL,
    put_vega REAL,
    put_oi INTEGER
  );
  
  -- Playbook signals
  CREATE TABLE signals (
    id INTEGER PRIMARY KEY,
    ticker TEXT NOT NULL,
    timestamp INTEGER NOT NULL,
    signal_type TEXT, -- 'NONE', 'CALL', 'PUT'
    confidence INTEGER,
    rules_evaluated TEXT, -- JSON
    executed BOOLEAN DEFAULT 0
  );
  
  -- Trade journal
  CREATE TABLE trades (
    id INTEGER PRIMARY KEY,
    ticker TEXT NOT NULL,
    signal_id INTEGER,
    entry_time INTEGER,
    exit_time INTEGER,
    signal_type TEXT,
    entry_price REAL,
    exit_price REAL,
    contracts INTEGER,
    pnl REAL,
    exit_reason TEXT,
    screenshot BLOB,
    notes TEXT
  );
  ```

**API:**
- `saveOhlcv(ticker, timeframe, data)` - Batch insert OHLCV
- `saveGammaSnapshot(ticker, data)` - Insert gamma metrics
- `saveOptionsChain(ticker, expiration, data)` - Insert chain
- `saveSignal(ticker, signal)` - Insert playbook signal
- `queryRange(ticker, startTime, endTime)` - Time-range query
- `getLatest(ticker)` - Most recent snapshot
- `exportToJson()` - Full database export
- `importFromJson(json)` - Database restore

### 2. replay-engine.js
**Purpose:** Replay historical data for backtesting

**Requirements:**
- Load historical snapshots from database
- Replay at configurable speed (1x, 10x, 100x)
- Pause/play/step controls
- Jump to specific date/time
- Loop mode for continuous testing
- Event hooks: onTick, onSignal, onNewDay

**API:**
- `loadScenario(ticker, startDate, endDate)` - Load date range
- `play(speed)` - Start replay
- `pause()` - Pause replay
- `step()` - Advance one tick
- `seek(timestamp)` - Jump to time
- `getCurrentState()` - Current replay data

**Integration:**
- Feeds data to playbook engine
- Updates frontend visualizations
- Records signals for validation

### 3. data-cache.js
**Purpose:** Intelligent caching layer with TTL

**Requirements:**
- In-memory cache with LRU eviction
- TTL per data type:
  - OHLCV: 5 minutes
  - Gamma metrics: 1 minute
  - Options chain: 30 seconds
  - Signals: No TTL (persist until new signal)
- Cache keys: `type:ticker:expiration`
- Cache size limit: 100MB
- Background refresh before TTL expires

**API:**
- `get(key)` - Retrieve with auto-refresh
- `set(key, value, ttl)` - Store with TTL
- `invalidate(key)` - Manual invalidation
- `invalidatePattern(pattern)` - Pattern-based invalidation
- `stats()` - Cache hit/miss stats

### 4. snapshot-recorder.js
**Purpose:** Automatic and manual data recording

**Requirements:**
- **Manual mode:** One-click save current state
- **Scheduled mode:** Record every 30 seconds during market hours
- **Event-triggered:** Save on significant gamma changes (>5%)
- Data captured:
  - Timestamp
  - Ticker spot price
  - Full options chain
  - Gamma metrics
  - Playbook signal (if any)
- Compression: gzip for long-term storage
- Retention: Auto-delete data older than 90 days

**API:**
- `record(ticker, type='manual')` - Record snapshot
- `startScheduledRecording(tickers, interval=30000)`
- `stopScheduledRecording()`
- `setRetentionDays(days)`
- `exportSnapshots(startDate, endDate)`

**Market Hours Detection:**
- Pre-market: 4:00 AM - 9:30 AM ET
- Regular: 9:30 AM - 4:00 PM ET
- After-hours: 4:00 PM - 8:00 PM ET
- Auto-detect ET timezone

### 5. api-server.js
**Purpose:** Local API for frontend data access

**Requirements:**
- HTTP server on localhost:8765
- CORS enabled for local file access
- Endpoints:
  ```
  GET /api/health - Server status
  GET /api/symbols - List tracked symbols
  GET /api/snapshot/:ticker - Latest snapshot
  GET /api/history/:ticker?start=&end= - Historical data
  GET /api/chain/:ticker/:expiration - Options chain
  GET /api/signals/:ticker - Signal history
  POST /api/signal - Submit new signal
  POST /api/trade/entry - Record trade entry
  POST /api/trade/exit - Record trade exit
  GET /api/journal - Trade journal entries
  GET /api/replay/start - Start replay mode
  GET /api/replay/pause - Pause replay
  GET /api/replay/step - Step replay
  ```

**WebSocket:**
- Real-time updates on new data
- Channel: `ws://localhost:8765/stream`
- Events: `snapshot`, `signal`, `trade`

---

## Data Flow Architecture

```
┌─────────────────┐
│  ORATS API      │
│  (External)     │
└────────┬────────┘
         │ fetch()
         ▼
┌─────────────────┐     ┌─────────────────┐
│  data-cache.js  │◄───►│  snapshot-store │
│  (LRU Cache)    │     │  (SQLite)       │
└────────┬────────┘     └─────────────────┘
         │
         ▼
┌─────────────────┐
│  api-server.js  │◄─── WebSocket ───► Frontend
│  (HTTP + WS)    │
└─────────────────┘
         │
         ▼
┌─────────────────┐
│  replay-engine  │
│  (Backtesting)  │
└─────────────────┘
```

---

## Technical Requirements

### SQLite in Browser
- Use `sql.js` (WebAssembly SQLite)
- Persist to IndexedDB for durability
- Async API wrappers for all operations

### Performance Targets
- Query 30 days of 30m data: <100ms
- Cache hit rate: >80%
- WebSocket latency: <50ms
- Database size: <500MB for 90 days

### Error Handling
- Retry failed API calls (3 attempts, exponential backoff)
- Queue writes if database locked
- Graceful degradation to cache-only mode

---

## Integration Points

### With Frontend
```javascript
// Frontend subscribes to updates
const ws = new WebSocket('ws://localhost:8765/stream');
ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  updateUI(data);
};
```

### With Playbook Engine
```javascript
// Engine queries historical data
const history = await api.queryRange('SPY', startTime, endTime);
const signal = playbookEngine.evaluate(history);
```

### With Alert System
```javascript
// Alert system records detections
snapshotRecorder.record('SPY', 'signal-triggered');
```

---

## Testing Criteria

- [ ] Database persists across browser reloads
- [ ] Cache hit rate >80% under normal use
- [ ] Replay mode plays back 30 days in <30 seconds
- [ ] API server responds to all endpoints
- [ ] WebSocket pushes real-time updates
- [ ] Scheduled recording works during market hours
- [ ] Data retention policy enforces cleanup
- [ ] Export/import preserves all data

---

## Time Estimate
6-8 hours of agent work

## Success Definition
All data operations work reliably, frontend can query and subscribe to updates, replay mode functions for backtesting.
