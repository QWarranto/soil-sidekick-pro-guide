# LeafEngines Cross-Platform Enhancement — Telegram + n8n / Node-RED / MCP

**Version:** 0.1 (Draft)
**Date:** May 16, 2026
**Status:** Draft for Review

---

## 1. The Opportunity

LeafEngines exists on four channels. Two are parallel primaries, one is secondary (OEM), one is tertiary (grants). Today they operate as silos:

| Channel | Tier | User Type | Access Pattern | Strength | Weakness |
|---------|------|-----------|---------------|----------|----------|
| **MCP server** | Primary | AI power users (Claude, Codex) | Desktop, conversational | Deep analysis, multi-turn reasoning | Not mobile, requires AI client |
| **Telegram** | Primary | Everyone | Mobile, instant | Always available, zero install, photo ID | Shallow interactions |
| **n8n nodes** | Extension | Workflow builders | Automated pipelines | Scheduled, conditional, batch | No real-time interaction |
| **Node-RED** | Extension | IoT / edge users | Dashboard, hardware | Sensor integration, local processing | Not portable |
| **OEM (Skyline)** | Secondary | Hardware integrators | Embedded | Physical product, recurring | Low margin, dependency |
| **Gov grants** | Tertiary | Institutions | Research | Funding, credibility | Slow cycle, compliance |

The play: **Telegram is not an add-on to MCP — it is a parallel primary channel.** MCP serves depth (multi-turn reasoning, function chaining). Telegram serves reach (mobile-first, zero install, always available, photo-based plant ID). Users flow between both. n8n and Node-RED extend both channels with automation. The OEM channel operates independently on the same backend.

---

## 2. Unified Identity

### Problem Today

A user who has the n8n nodes installed AND the MCP server gets two different API keys, two usage buckets, two data silos. Their soil analysis in MCP doesn't show up in their n8n workflow. Their Node-RED dashboard doesn't know about their Telegram queries.

### Solution: One API Key, One User, All Channels

```
User registers once (via any channel)
  -> Gets one API key (ak_...)
  -> Same key works in MCP, n8n, Node-RED, Telegram
  -> All usage counts against one daily limit
  -> All telemetry tied to one user_id
  -> All results visible across all channels
```

### Implementation

```sql
-- Existing api_keys table becomes the central identity
CREATE TABLE user_channels (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  api_key_id uuid REFERENCES api_keys(id) NOT NULL,
  channel text NOT NULL,              -- 'telegram', 'n8n', 'node_red', 'mcp'
  channel_user_id text NOT NULL,      -- telegram_id, n8n instance id, etc.
  metadata jsonb DEFAULT '{}',        -- channel-specific data
  connected_at timestamptz DEFAULT now(),
  last_active timestamptz DEFAULT now(),
  UNIQUE(channel, channel_user_id)
);
```

When a Telegram user first sends /start, the bot checks if their telegram_id is already linked to an existing API key (from n8n/MCP setup). If so, they inherit that key and its tier — not a new free-tier key.

### Linking Flow

```
1. User has n8n with ak_abc123 already configured
2. User opens LeafEnginesBot on Telegram
3. /start detects no linked telegram_id for ak_abc123
4. Bot: "I see you're a LeafEngines user! Link your account?
   Enter /link ak_abc123 to connect your Telegram to your existing account."
5. User: /link ak_abc123
6. Bot: "Account linked! Your Pro tier and usage now sync across all channels."
```

This means a Pro user on n8n automatically gets Pro access on Telegram. No double-paying.

---

## 3. Telegram as Alert & Notification Hub

### The Problem

n8n and Node-RED users build automated workflows that run on schedules or triggers. When something important happens — a frost warning, a soil anomaly, a water quality threshold breach — they need to know NOW, not when they next check their dashboard.

### The Solution

n8n and Node-RED workflows can push alerts to the user's Telegram via LeafEnginesBot. No separate notification setup needed.

```
n8n workflow: "Every morning at 6am, check soil moisture for my counties"
  -> If moisture below threshold:
     -> POST to LeafEngines notification API
        -> Telegram bot sends alert to user's phone
```

### Notification API

New edge function: `notify-user`

```typescript
// POST /functions/v1/notify-user
// Called by n8n/Node-RED workflows
{
  "api_key": "ak_abc123",
  "type": "alert",           // alert, summary, reminder
  "priority": "high",        // low, normal, high
  "title": "Low Soil Moisture Alert",
  "body": "Jefferson County AL: Soil moisture at 12% (below 20% threshold).\nIrrigation recommended within 48 hours.",
  "actions": [               // Interactive Telegram buttons
    { "text": "Full Report", "command": "/soil 01073" },
    { "text": "Irrigation Plan", "command": "/ag 01073 irrigation" }
  ]
}
```

The bot maps the API key to the user's telegram_id via `user_channels` and delivers the message. If the user hasn't linked Telegram, it falls back to email via `send-transactional-email`.

### n8n Node Enhancement

Add a `leafEnginesNotify` node to `n8n-nodes-leafengines`:

```
[Soil Data] -> [Threshold Check] -> [LeafEngines Notify]
                                        |
                                        v
                                   Telegram alert to user's phone
```

Configuration in n8n:
- API key (already configured)
- Alert title template
- Alert body template (supports n8n expressions)
- Priority level
- Interactive button commands

### Node-RED Enhancement

Add a `leafengines-notify` node to `node-red-contrib-leafengines`:

```
[Soil Data] -> [Function: threshold check] -> [leafengines-notify]
                                                  |
                                                  v
                                             Telegram alert
```

---

## 4. Telegram as Workflow Remote Control

### The Problem

n8n and Node-RED workflows are powerful but require a desktop to manage. A farmer in the field can't easily pause a workflow, check its status, or trigger one manually.

### The Solution

/wf commands give users mobile control over their automated workflows.

| Command | Description |
|---------|-------------|
| /wf list | Show all active workflows |
| /wf status <id> | Last run time, status, next scheduled run |
| /wf run <id> | Manually trigger a workflow now |
| /wf pause <id> | Pause a scheduled workflow |
| /wf resume <id> | Resume a paused workflow |
| /wf history <id> | Last 10 runs with pass/fail |

### Implementation

This requires the n8n/Node-RED instances to expose a lightweight webhook that the Telegram bot can call. The LeafEngines n8n nodes already have API keys — we add a registry:

```sql
CREATE TABLE user_workflows (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  api_key_id uuid REFERENCES api_keys(id) NOT NULL,
  workflow_name text NOT NULL,
  workflow_type text NOT NULL,       -- 'n8n', 'node_red'
  trigger_webhook_url text NOT NULL, -- URL to manually trigger
  status_webhook_url text,           -- URL to check status
  pause_webhook_url text,            -- URL to pause
  schedule_cron text,                -- e.g. '0 6 * * *'
  last_run_at timestamptz,
  last_run_status text,              -- 'success', 'failed', 'running'
  is_active boolean DEFAULT true,
  registered_at timestamptz DEFAULT now()
);
```

When a user installs the LeafEngines n8n nodes and creates a workflow, the node registers itself:

```
n8n workflow activates
  -> LeafEngines node calls registration API
     -> POST /functions/v1/register-workflow
        -> Stores webhook URLs in user_workflows
        -> Returns workflow ID
```

Now the user can control it from Telegram:

```
User: /wf list
Bot:
  📋 Your Workflows
  ━━━━━━━━━━━━━━━━━━
  1. Morning Soil Check (n8n) — Active, runs 6am daily
     Last run: Today 6:00am ✅
  2. Frost Alert Monitor (n8n) — Active, runs hourly
     Last run: 12 min ago ✅

  /wf run 1 — Trigger now
  /wf pause 1 — Pause schedule
```

---

## 5. Telegram as Analysis Companion

### The Problem

A user doing deep analysis in MCP (multi-turn conversation with Claude) may want to continue on mobile — review results, get a quick follow-up, or share findings with a colleague.

### The Solution: Cross-Channel Session Continuity

```sql
CREATE TABLE analysis_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  api_key_id uuid REFERENCES api_keys(id) NOT NULL,
  channel text NOT NULL,              -- where session started
  tool_name text NOT NULL,
  query_args jsonb,
  result_summary text,                -- condensed version for mobile
  result_full jsonb,                  -- complete result
  created_at timestamptz DEFAULT now()
);
```

### Flows

**MCP -> Telegram (Continue on mobile):**

```
1. User asks Claude via MCP: "Analyze soil for Jefferson County AL"
2. Claude calls agricultural_intelligence tool
3. Result stored in analysis_sessions
4. User leaves desk, opens Telegram
5. /recent command shows latest analyses:
   "🌾 Jefferson County AL — Ag Intelligence (2h ago)
    Top crops: Soybeans, Corn, Cotton
    Soil pH: 6.2 | Organic matter: 2.1%
    /detail abc123 — Full report
    /ag 01073 — Refresh analysis"
```

**Telegram -> MCP (Deep dive from mobile):**

```
1. User gets soil data on Telegram: /soil 01073
2. Result is interesting, user wants deeper analysis
3. /deepdive command:
   "🔍 Deep analysis queued. Open Claude with your MCP server and say:
   'Continue analysis for Jefferson County AL — session abc123'
   Or I can send a summary to your email: /email abc123"
```

---

## 6. Telegram as Team Coordination

### The Problem

Agronomists work in teams. One person's soil analysis should be visible to the whole crew. n8n workflows may need team-wide alerts.

### The Solution: Group Chat Integration

| Feature | How It Works |
|---------|--------------|
| Shared results | Any team member's /soil command posts to the group chat |
| Team API key | Group gets a shared API key with pooled daily limits |
| Role-based access | Team admin can add/remove members, set permissions |
| Broadcast alerts | n8n workflows notify the whole group, not just one user |

```
/teams create "Jefferson County Crew"
/teams invite @agronomist1 @farmer2
/teams set-default-fips 01073
```

Team member runs /soil — result appears in group. Everyone sees it. No forwarding needed.

---

## 7. Telegram as Data Bookmark & Export

### The Problem

Results from MCP or n8n are ephemeral. Users want to save, compare, and export.

### The Solution

| Command | Description |
|---------|-------------|
| /save | Bookmark last result for later reference |
| /compare <id1> <id2> | Side-by-side comparison of two saved results |
| /export csv | Download all saved results as CSV |
| /history | Last 20 queries across all channels |
| /favorites | Saved/bookmarked analyses |

Results saved here are accessible from any channel — MCP can reference them too via the same analysis_sessions table.

---

## 8. Enhanced Feature Matrix

| Feature | Standalone Telegram | Telegram + n8n | Telegram + Node-RED | Telegram + MCP |
|---------|--------------------|-----------------|--------------------|---------------|
| Slash commands | Yes | Yes | Yes | Yes |
| Natural language | Yes | Yes | Yes | Yes |
| Push alerts | No | **Yes — workflow triggers** | **Yes — sensor thresholds** | **Yes — analysis complete** |
| Workflow control | No | **Yes — /wf commands** | **Yes — /wf commands** | No |
| Session continuity | No | No | No | **Yes — /recent, /deepdive** |
| Team coordination | Basic | **Yes — shared workflows** | **Yes — shared dashboards** | **Yes — shared sessions** |
| Data bookmarking | Yes | **Yes — auto-save from workflows** | **Yes — auto-save from flows** | **Yes — auto-save from MCP** |
| Cross-channel usage | No | **Yes — pooled limits** | **Yes — pooled limits** | **Yes — pooled limits** |
| Tier upgrade | Telegram-only | **Synced across channels** | **Synced across channels** | **Synced across channels** |

---

## 9. Revenue Impact

Cross-platform users are the highest-value segment:

| Segment | Likely Tier | Monthly Value | Retention |
|---------|------------|---------------|-----------|
| Telegram only (free) | Free | $0 | Low (30-day) |
| Telegram only (paid) | Pro | $5/mo | Medium |
| n8n OR Node-RED only | Pro | $5/mo | High |
| **Telegram + n8n/Node-RED** | **Pro or Enterprise** | **$5-25/mo** | **Very high** |
| **Telegram + MCP** | **Pro** | **$5/mo** | **Very high** |
| **All four channels** | **Enterprise** | **$25/mo** | **Extremely high** |

Cross-platform users:
- Pay more (they need higher tiers for pooled usage)
- Churn less (switching cost is high once workflows are built)
- Generate more telemetry (more touchpoints = more data for improvement)
- Become advocates (they show colleagues the Telegram bot, who then discover n8n/MCP)

---

## 10. Implementation Priority

### Phase 1 (Trial — Week 1-2)

| Item | Effort | Impact |
|------|--------|--------|
| Unified identity (one API key, all channels) | Medium | High — foundation for everything else |
| /link command | Low | High — existing users get instant value |
| Pooled daily limits across channels | Medium | High — no double-charging |
| Cross-channel telemetry | Low | Medium — see usage patterns |

### Phase 2 (Soft Launch — Week 3-4)

| Item | Effort | Impact |
|------|--------|--------|
| notify-user edge function | Medium | High — n8n/Node-RED users get mobile alerts |
| n8n leafEnginesNotify node | Medium | High — native n8n integration |
| /wf commands (list, status, run) | Medium | High — remote workflow control |
| Workflow registration API | Medium | Medium — enables /wf commands |

### Phase 3 (Production — Week 5+)

| Item | Effort | Impact |
|------|--------|--------|
| Node-RED leafengines-notify node | Medium | Medium — IoT user segment |
| Cross-channel session continuity | High | High — MCP users get mobile companion |
| /recent, /deepdive commands | Medium | Medium — session bridging |
| Team coordination (group chat) | High | Medium — team/enterprise upsell |
| Data bookmarking & export | Medium | Medium — power user retention |

---

## 11. Dependency Map

```
Unified Identity (user_channels table)
  |
  +-- /link command
  +-- Pooled rate limits
  +-- notify-user edge function
  |     |
  |     +-- n8n leafEnginesNotify node
  |     +-- Node-RED leafengines-notify node
  |
  +-- /wf commands
  |     |
  |     +-- register-workflow edge function
  |     +-- n8n workflow registration (in node)
  |
  +-- Cross-channel sessions
  |     |
  |     +-- analysis_sessions table
  |     +-- /recent, /deepdive commands
  |
  +-- Team coordination
        |
        +-- user_teams table
        +-- Group chat integration
```

---

## 12. File Locations

| Artifact | Path |
|----------|------|
| Cross-Platform Enhancement | ~/operations/PRODUCT/LEAFENGINES_CROSS_PLATFORM.md |
| PRD | ~/operations/PRODUCT/LEAFENGINES_BOT_PRD.md |
| Architecture | ~/operations/INFRA/LEAFENGINES_BOT_ARCHITECTURE.md |
| Support Ops | ~/operations/PRODUCT/LEAFENGINES_BOT_SUPPORT.md |
