# Workflow 9: API & Equipment Integration

> **Goal:** Generate API keys, connect farm management software, and set up webhooks for automated data exchange with external systems.
> **Time:** ~25 minutes | **Difficulty:** Advanced | **Tier:** Pro (API keys) / Enterprise (full integration)

---

## Video Overview

```
[VIDEO NARRATION — INTRO]
"SoilSidekick Pro isn't a standalone tool — it's designed to plug into
your existing operation. In this workflow, you'll set up API access,
connect to equipment platforms like John Deere Operations Center, and
configure webhooks so data flows automatically between systems."
```

---

## Step 1: Generate Your API Key

1. Navigate to **Settings → API Keys** (or **API Key Management** page).
2. Click **Generate New Key**.
3. Configure:
   - **Key name:** Descriptive label (e.g., "John Deere Integration")
   - **Permissions:** Select which endpoints this key can access
   - **Rate limit:** Requests per minute (default based on tier)
   - **Expiration:** Set an expiry date or leave as non-expiring
4. **Copy the key immediately** — it's only shown once.

> ⚠️ **Security:** Store your API key in environment variables. Never commit it to source code or share it in plain text.

```
[VIDEO NARRATION]
"Go to API Key Management and generate a new key. Give it a descriptive
name so you remember what it's for. Copy the key right away — for
security, it's only displayed once. Store it in a password manager or
your system's environment variables."

[ON-SCREEN] Show the key generation flow. Highlight the "copy" action.
```

---

## Step 2: Test API Authentication

Run a test request to verify your key works:

```bash
curl -X GET "https://your-project.supabase.co/functions/v1/get-soil-data?fips=48453" \
  -H "x-api-key: ak_your_key_here" \
  -H "Content-Type: application/json"
```

**Expected response:** HTTP 200 with soil data JSON.

| Status Code | Meaning |
|-------------|---------|
| 200 | Success — key is valid |
| 401 | Authentication failed — check key |
| 403 | Key lacks permission for this endpoint |
| 429 | Rate limit exceeded — slow down requests |

```
[VIDEO NARRATION]
"Test with a simple curl command or Postman. You should get a 200
response with soil data. If you get a 401, double-check you copied the
full key. A 429 means you're hitting the rate limit — back off and retry."
```

---

## Step 3: Connect Farm Management Systems

### John Deere Operations Center
1. In SoilSidekick Pro, go to **Integrations → John Deere**.
2. Authorize the connection through John Deere's OAuth flow.
3. Select which farms/fields to sync.
4. Data flows bidirectionally:
   - **To John Deere:** Prescription maps, field boundaries
   - **From John Deere:** Yield data, as-applied records, machine data

### Climate FieldView
1. Go to **Integrations → Climate FieldView**.
2. Authorize via Climate Corporation's API.
3. Import yield maps and variable rate prescriptions.

### AgLeader / Trimble
1. Use the **ADAPT 1.0 export** format (Workflow 5) for compatibility.
2. Export prescription maps and import into AgLeader SMS or Trimble Ag Software.

```
[VIDEO NARRATION]
"For John Deere users, the integration is direct — authorize the
connection, select your farms, and data syncs both ways. For other
platforms, export your prescriptions in ADAPT format and import them
on the other side."
```

---

## Step 4: Configure Webhooks

1. Go to **Settings → Webhooks**.
2. Click **Add Webhook Endpoint**.
3. Enter your receiving URL (must be HTTPS).
4. Select events to subscribe to:

### Available Event Types
| Category | Events |
|----------|--------|
| **Agricultural** | New soil analysis, pH changes, risk alerts, fertilizer recommendations |
| **System** | API quota warnings, export completions, subscription changes |
| **Sensor** | Live data received, connectivity issues, calibration reminders, battery warnings |

5. Click **Test Connection** to verify your endpoint receives data.
6. Enable the webhook.

### Webhook Payload Example:
```json
{
  "event": "soil_analysis.completed",
  "timestamp": "2026-03-06T10:00:00Z",
  "data": {
    "county_fips": "48453",
    "ph": 6.4,
    "organic_matter": 3.2,
    "risk_score": 4
  },
  "signature": "sha256=abc123..."
}
```

> 🔒 **Security:** Always verify the `x-soilsidekick-signature` header to confirm the webhook is authentic. Respond within 10 seconds to avoid retries.

```
[VIDEO NARRATION]
"Webhooks push data to your systems in real time. Instead of polling
our API every hour, you get notified the moment something happens — a
new analysis completes, a risk alert fires, or a sensor reports a
critical reading."
```

---

## Step 5: Connect Business Intelligence Tools

### Power BI / Tableau / Google Data Studio
1. Use the REST API to pull data into your BI platform.
2. Set up scheduled data refreshes (hourly, daily).
3. Build dashboards combining SoilSidekick data with your business metrics.

### Notification Platforms
| Platform | Setup |
|----------|-------|
| **Slack** | Use webhook URL from Slack → Incoming Webhooks |
| **Microsoft Teams** | Use Teams webhook connector |
| **Email** | Configure SMTP in Settings → Notifications |
| **SMS** | Enable SMS alerts for critical notifications |

```
[VIDEO NARRATION]
"If you use Power BI or Tableau, point them at our API for automated
dashboards. And connect Slack or Teams so your whole crew gets alerts
when something needs attention in the field."

[TRANSITION] "You're now fully integrated. Let's tie everything together
into a complete season workflow."
```

---

## Step 6: Monitor API Usage

1. Check **API Usage Dashboard** for:
   - Requests per day/hour
   - Error rates
   - Response times
   - Approaching rate limits
2. Set up usage alerts to avoid hitting limits unexpectedly.

---

## ✅ Workflow Checklist

- [ ] API key generated and securely stored
- [ ] Test API call successful (HTTP 200)
- [ ] Farm management system connected (John Deere / FieldView / etc.)
- [ ] Webhooks configured and tested
- [ ] BI tools connected (if applicable)
- [ ] Notification channels configured (Slack / Teams / email)
- [ ] API usage monitoring enabled

---

## Next Steps

→ **Workflow 10:** [Full-Season Workflow](10_FULL_SEASON_WORKFLOW.md)
→ **Workflow 8:** [Sensor Integration](08_SENSOR_INTEGRATION.md) (uses API keys)
