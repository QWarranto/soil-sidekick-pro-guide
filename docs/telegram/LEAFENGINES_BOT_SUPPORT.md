# LeafEngines Bot — Support Operations

**Version:** 1.0 (Verified 2026-06-30)
**Date:** June 30, 2026
**Status:** Active

> **Verification Note (2026-06-30):** Telegram bot has no explicit package version; it is a deployed Supabase Edge Function. Document verified against current support infrastructure.

---

## 1. Support Philosophy

Support is not a cost center — it is the first paid feature. Users who feel heard become paying users. Users who feel ignored become negative reviews. At launch, every user is a founding user. Their experience determines whether the product scales or stalls.

**Principles:**
- Every error message is a support opportunity, not a dead end
- Response time under 5 minutes during business hours (trial phase)
- Every support interaction generates a telemetry event
- Repeat issues become product fixes, not support tickets

---

## 2. Support Channels

### 2.1 Tier 1: In-Bot Self-Service (Always On)

| Mechanism | Trigger | Response |
|-----------|---------|----------|
| /help command | User types /help | Full command reference with examples |
| Error guidance | Tool call fails | "Something went wrong. Try /soil 01001 again, or type /support for help." |
| Rate limit message | Daily limit reached | "You've used 10/10 free calls today. Upgrade with /subscribe or try again tomorrow." |
| /status command | User types /status | Current system health, uptime, any known issues |
| /feedback command | User types /feedback <text> | "Thanks! Your feedback has been recorded." |
| Smart suggestions | Tool returns empty result | "No data found for that county. Try a nearby FIPS code — /soil 01073 (Jefferson County AL)" |

### 2.2 Tier 2: Human Escalation (Business Hours)

| Channel | How | Who Handles | SLA |
|---------|-----|-------------|-----|
| /support command | User types /support <issue> | Routes to Reggie's Telegram DM | < 30 min (trial), < 2 hr (production) |
| Support Telegram group | Invite to @LeafEnginesSupport | Reggie + designated helpers | < 4 hr |
| Email | support@sidekickpro.com | Reggie (via Resend) | < 24 hr |

### 2.3 Tier 3: Escalation Path (Critical Issues)

| Severity | Example | Response | Resolution |
|----------|---------|----------|------------|
| SEV1 - Outage | Bot not responding to anyone | < 15 min acknowledgment | < 1 hr fix or status page update |
| SEV2 - Degraded | Gemma 4 down, fallback active | < 30 min | < 4 hr |
| SEV3 - Bug | Wrong data for specific county | < 4 hr | Next deploy |
| SEV4 - Feature | User requests new tool | < 24 hr acknowledgment | Backlog |

---

## 3. In-Bot Support Commands

### /support <description>

Creates a support ticket from within Telegram. The bot:

1. Records the issue in `support_tickets` table
2. Sends a notification to the operator (Reggie) via Telegram
3. Replies to user with ticket ID and estimated response time

```typescript
// /support handler
if (command === '/support') {
  const ticketId = crypto.randomUUID().slice(0, 8);
  
  await supabase.from('support_tickets').insert({
    id: ticketId,
    telegram_id: msg.from.id,
    chat_id: msg.chat.id,
    message: args,
    severity: 'untriaged',
    status: 'open',
    created_at: new Date().toISOString(),
  });
  
  // Notify operator
  await sendTelegramMessage(OPERATOR_CHAT_ID, 
    `🚨 New support ticket #${ticketId}\nFrom: ${msg.from.first_name} (${msg.from.id})\nIssue: ${args}`);
  
  // Acknowledge user
  await sendTelegramMessage(msg.chat.id,
    `Your support ticket #${ticketId} has been created.\nWe'll respond within 2 hours during business hours (EST).\nType /status to check system health.`);
}
```

### /status

Returns real-time system health:

```
🟢 LeafEngines Bot Status
━━━━━━━━━━━━━━━━━━━━
Overall: Operational
• Gemma 4 AI: ✅ Online (latency: 1.2s)
• Soil Data API: ✅ Online
• Water Quality API: ✅ Online
• Telegram: ✅ Connected

Uptime: 99.8% (7-day)
Last incident: None
```

Implementation: Health check function pings each downstream service every 60 seconds, stores results in `system_health` table.

### /feedback <text>

Non-urgent input from users. Stored for weekly review:

```sql
INSERT INTO user_feedback (telegram_id, feedback_text, created_at)
VALUES (:telegram_id, :text, now());
```

Weekly digest sent to Reggie via the existing endpoint-activity-digest pipeline.

### /usage

Shows the user their current usage:

```
📊 Your Usage Today
━━━━━━━━━━━━━━━━━━━━
Calls: 7 / 10 (free tier)
Remaining: 3
Resets: midnight UTC (in 4h 23m)

Upgrade to Pro for 100 calls/day: /subscribe
```

---

## 4. Database Schema — Support Tables

### support_tickets

```sql
CREATE TABLE support_tickets (
  id text PRIMARY KEY,                    -- short UUID
  telegram_id bigint NOT NULL,
  chat_id bigint NOT NULL,
  message text NOT NULL,
  severity text DEFAULT 'untriaged',      -- untriaged, sev1, sev2, sev3, sev4
  status text DEFAULT 'open',             -- open, in_progress, waiting_user, resolved, closed
  assigned_to text,                        -- operator handle
  resolution text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  resolved_at timestamptz
);

CREATE INDEX idx_tickets_status ON support_tickets(status);
CREATE INDEX idx_tickets_telegram_id ON support_tickets(telegram_id);
CREATE INDEX idx_tickets_created ON support_tickets(created_at DESC);
```

### user_feedback

```sql
CREATE TABLE user_feedback (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  telegram_id bigint NOT NULL,
  feedback_text text NOT NULL,
  reviewed boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX idx_feedback_reviewed ON user_feedback(reviewed) WHERE NOT reviewed;
```

### system_health

```sql
CREATE TABLE system_health (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  service text NOT NULL,                  -- 'gemma4', 'usda_sda', 'epa_wqx', 'telegram_api'
  status text NOT NULL,                   -- 'operational', 'degraded', 'down'
  latency_ms integer,
  error_message text,
  checked_at timestamptz DEFAULT now()
);

CREATE INDEX idx_health_service_time ON system_health(service, checked_at DESC);
```

---

## 5. Automated Monitoring & Alerting

### 5.1 Health Check (pg_cron + edge function)

Every 60 seconds, a pg_cron job calls a `health-check` edge function that:

1. Pings Gemma 4 API (tiny inference request)
2. Pings USDA SDA API (test county)
3. Pings EPA WQX API (test county)
4. Pings Telegram getMe endpoint
5. Writes results to `system_health`
6. If any service is down for 3 consecutive checks -> alert Reggie via Telegram

```sql
SELECT cron.schedule(
  'system-health-check',
  '* * * * *',   -- every minute
  $$
  SELECT net.http_post(
    url := 'https://wzgnxkoeqzvueypwzvyn.supabase.co/functions/v1/health-check',
    headers := '{"Authorization": "Bearer ' || current_setting('app.service_role_key') || '"}'::jsonb
  );
  $$
);
```

### 5.2 Alert Rules

| Condition | Alert Method | Frequency |
|-----------|-------------|-----------|
| Any service down 3+ consecutive checks | Telegram DM to Reggie | Immediate |
| Error rate > 10% in 1 hour | Telegram DM + email | Immediate |
| Daily active users drop > 50% day-over-day | Telegram DM | Once |
| Support tickets untriaged > 30 min | Telegram DM | Every 15 min |
| Daily cost exceeds 2x average | Telegram DM | Once |
| Free tier signups > 100/day | Telegram DM | Once (milestone) |

### 5.3 Daily Digest (Existing Pipeline)

The `endpoint-activity-digest` edge function already runs daily. Extend it to include:

- Support tickets opened/resolved today
- Untriaged tickets
- Top user complaints (clustered by keyword)
- System health summary
- User feedback highlights

Sent to Reggie's email via `send-transactional-email`.

---

## 6. Operator Tools (Reggie's View)

### /admin commands (operator only, verified by telegram_id)

| Command | Description |
|---------|-------------|
| /admin tickets | List open support tickets |
| /admin ticket <id> | View ticket details |
| /admin resolve <id> <resolution> | Resolve a ticket (notifies user) |
| /admin stats | User count, call volume, error rate |
| /admin broadcast <message> | Send message to all users (use sparingly) |
| /admin health | Force a health check and show results |
| /admin block <telegram_id> | Block an abusive user |

### Ticket Resolution Flow

```
1. User sends /support <issue>
2. Bot creates ticket, DMs Reggie with ticket details
3. Reggie reviews, sets severity: /admin ticket abc123
4. If quick fix: /admin resolve abc123 "Fixed — try /soil 01001 again"
5. Bot notifies user: "Your ticket #abc123 has been resolved: Fixed — try /soil 01001 again"
6. If complex: Reggie investigates, replies directly in chat
7. Ticket auto-closes after 48h of inactivity
```

---

## 7. Support Staffing Plan

### Trial (Week 1-2): 10-20 users

| Role | Who | Hours | Tools |
|------|-----|-------|-------|
| Operator (sole) | Reggie | On-call, EST 8a-10p | Telegram DMs, /admin commands |
| Escalation | Reggie | 24/7 for SEV1 | Phone alerts via Telegram |

**Key metric:** Every support interaction < 30 minutes during waking hours.

### Soft Launch (Week 3-4): Open to all

| Role | Who | Hours | Tools |
|------|-----|-------|-------|
| Operator | Reggie | EST 8a-10p | /admin commands, email |
| Community helper | 1-2 power users | Voluntary | Support group |
| Escalation | Reggie | SEV1 only | Phone alerts |

**Key metric:** First response < 2 hours, 80% resolved same day.

### Full Production (Week 5+)

| Role | Who | Hours | Tools |
|------|-----|-------|-------|
| Operator | Reggie | Business hours | /admin commands, email |
| Support agent | Part-time contractor or AI agent | Extended hours | /admin commands |
| Community | Power users | Self-organizing | Support group |
| Escalation | Reggie | SEV1 only | Phone alerts |

**Key metric:** First response < 4 hours, 90% resolved same day.

---

## 8. AI-Assisted Support

### 8.1 Auto-Response for Common Issues

The bot itself handles the top 80% of support queries without human intervention:

| User Message Pattern | Bot Response |
|---------------------|--------------|
| "not working" / "broken" | "Sorry about that! Try /status to check system health, or /support <details> to reach a human." |
| "how do I" / "how to" | Routes to /help with relevant command highlighted |
| "slow" / "taking forever" | "We're experiencing high demand. Gemma 4 responses may take 5-10s. Try again in a moment." |
| "wrong data" | "Thanks for reporting! Which county/FIPS code? I'll flag it for review. /support <details>" |
| "free trial" / "pricing" | "Free tier: 10 calls/day. Upgrade to Pro (100/day) with /subscribe" |
| "cancel" / "unsubscribe" | "You can stop using the bot anytime. No action needed — there are no recurring charges on the free tier." |

### 8.2 Ticket Auto-Triage

When a /support ticket comes in, the bot classifies severity before alerting Reggie:

- Contains "down", "not working", "broken", "offline" -> flag as potential SEV1/2
- Contains "wrong", "error", "incorrect" -> SEV3
- Contains "wish", "could you", "feature" -> SEV4
- Everything else -> untriaged

Only SEV1/2 alerts go to Reggie immediately. SEV3/4 queue for next business-hours review.

---

## 9. Knowledge Base (Phase 2)

### 9.1 FAQ Document

Hosted at sidekickpro.com/faq (or a pinned message in the support group):

1. How do I find my county FIPS code?
2. What data sources does LeafEngines use?
3. How accurate is the soil data?
4. What is Gemma 4?
5. How do I upgrade to Pro?
6. Is my data private?
7. Can I use this in a group chat?
8. How do I report a bug?

### 9.2 In-Bot Tutorial

New users get a guided walkthrough on /start:

```
🌱 Welcome to LeafEngines Bot!

I can help you with:
/soil 01001 — Soil analysis for any US county
/identify oak tree — Identify a plant by name
/ag 01001 — Agricultural intelligence report

Just type a command or ask in plain English!
Type /help for the full list.
```

---

## 10. Metrics & Reporting

### 10.1 Support Dashboard (Weekly)

| Metric | Source | Target |
|--------|--------|--------|
| Tickets opened | support_tickets | Track trend |
| Median first-response time | support_tickets (created_at vs first operator message) | < 2 hr |
| Resolution rate (same day) | support_tickets (created_at vs resolved_at same date) | > 80% |
| Reopen rate | support_tickets (status reverts) | < 10% |
| Top issue categories | Keyword clustering on support_tickets.message | Actionable |
| User satisfaction | Implicit (feedback after resolution) | Track |
| System uptime | system_health | > 99.5% |
| Mean time to detect (MTTD) | system_health (gap between down and alert) | < 5 min |
| Mean time to resolve (MTTR) | support_tickets (SEV1/2 only) | < 1 hr |

### 10.2 Weekly Support Report

Auto-generated by the digest pipeline, sent to Reggie every Monday 9am EST:

```
📊 LeafEngines Bot — Weekly Support Report
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Tickets: 12 opened, 10 resolved, 2 open
Response time: median 45 min
Top issues: "soil data missing for HI counties" (4), "rate limit confusion" (3)
System uptime: 99.7%
SEV1 incidents: 0
User feedback highlights: "Love the plant ID feature!", "Wish it worked for Alaska"

Action items:
- Investigate HI county soil data gap
- Clarify rate limit in /help text
```

---

## 11. Launch-Day Support Checklist

Before opening the bot to trial users, these must be in place:

- [ ] /support command operational (creates ticket, notifies Reggie)
- [ ] /status command operational (shows real-time health)
- [ ] /feedback command operational (stores for review)
- [ ] /admin commands operational (Reggie's telegram_id whitelisted)
- [ ] support_tickets table created
- [ ] user_feedback table created
- [ ] system_health table created
- [ ] Health check edge function deployed + pg_cron scheduled
- [ ] Alert rules configured (Telegram DM to Reggie on SEV1/2)
- [ ] Operator Telegram DM channel tested
- [ ] /start welcome message includes support guidance
- [ ] Error messages include /support suggestion
- [ ] Rate limit message includes /subscribe guidance
- [ ] Daily digest extended with support metrics
- [ ] Reggie's phone receives Telegram push notifications

---

## 12. File Locations

| Artifact | Path |
|----------|------|
| Support Ops | ~/operations/PRODUCT/LEAFENGINES_BOT_SUPPORT.md |
| PRD | ~/operations/PRODUCT/LEAFENGINES_BOT_PRD.md |
| Architecture | ~/operations/INFRA/LEAFENGINES_BOT_ARCHITECTURE.md |
