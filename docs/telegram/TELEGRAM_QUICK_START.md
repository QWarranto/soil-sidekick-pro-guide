# Telegram Bot Quick Start

**Time to first result:** Under 30 seconds. No signup, no install, no API key.

---

## 1. Open the Bot

Find **@LeafEnginesBot** on Telegram, or tap this link: `https://t.me/LeafEnginesBot`

---

## 2. Send /start

The bot auto-provisions your free account and shows a welcome card:

```text
🌱 LeafEngines — Soil Sidekick Pro

Welcome, {your name}. Your free account is ready.

📊 Daily limits:
 • Soil & water lookups: 20/day
 • AI analysis & plant ID: 5/day
 • Plant identifications: 3/day

👇 Try one now:
 [🌍 Soil Lookup]  [🌿 Identify a Plant]  [📖 See All Commands]
```

Tap a button, or type a command. That's it.

---

## 3. Your First Query

### Option A: Soil Lookup

Type or tap:

```
/soil Fayette County KY
```

The bot returns a formatted soil card — texture, pH, drainage class, organic matter, and more for that county.

After the result, you'll see a discovery prompt:

```text
💡 Did you know? I can also analyze water quality for the same county.
Try: /water Fayette County KY
```

### Option B: Plant Identification

Type a name:

```
/identify wild carrot
```

Or send a photo directly in the chat. The bot identifies the plant and flags any toxic lookalikes in your area.

---

## 4. Natural Language Works Too

You don't have to use `/` commands. The bot understands plain text:

- `soil data for Fayette County KY`
- `is this poison ivy?`
- `what cover crops suit my area?`

Commands are for **discovery** — they show you what's available. Once you know the tool, type however you want.

---

## 5. Check Your Usage

```
/usage
```

```text
📊 Your usage today

📍 Data lookups: 7/20
🧠 AI calls: 2/5
🌿 Plant IDs: 1/3

Resets at midnight UTC.
💎 /subscribe for higher limits
```

---

## 6. Link to Your Web Account

If you use LeafEngines on the web, MCP, n8n, or QGIS, connect your accounts:

```
/link
```

The bot generates a one-time code. Enter it at `app.soilsidekickpro.com/link-telegram` to merge your Telegram usage with your existing account.

---

## Free Tier Limits

| Bucket | Daily limit | What counts |
|---|---|---|
| Data lookups | 20 | `/soil`, `/water`, `/county` |
| AI calls | 5 | `/ag`, `/identify` (text) |
| Plant IDs (photo) | 3 | `/identify` with a photo |
| Planting optimization | 1 per trial period | `/crop` (one free taste) |

---

## Upgrading

```
/subscribe
```

Unlocks all 9 tools, raises AI limits to 100/day, and gives you an API key for MCP, n8n, and QGIS.

See [Telegram Command Reference](./TELEGRAM_COMMAND_REFERENCE.md) for the full command list and tier details.
