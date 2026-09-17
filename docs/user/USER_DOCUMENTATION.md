# User Documentation

**Product:** SoilSidekick Pro / LeafEngines
**Version:** 3.2.0
**Last updated:** 2026-07-10

---

## 1. Who This Is For

This guide is for **end users** of the SoilSidekick Pro web app and consumer integrations. Developer-focused material lives in the Developer Specifications and API Documentation.

## 2. What's New in 3.2.0

- **New consumer tier naming** — Hobby ($29), Grower ($79), **Pro ($149)** — replacing legacy Basic/Standard/Premium labels. Manage at **`/plans`** (SSP consumer). The `/pricing` page remains the LeafEngines API tier page.
- **Managed Assets API (SDK v3.1.0)** — full CRUD for fields, sensors, and points via `assets-crud`, with optimistic locking (`If-Match`), audit history, and soft delete.
- **WFS Export** — `wfs-export` edge function exposes your assets as an OGC WFS layer for QGIS/ArcGIS.
- **Dual-meter API keys** — separate free-tier and paid quotas on the same key, with `pg_cron` monthly resets.
- **QGIS Plugin v1.0.10** — WFS-T fixes, Bandit B411 security hardening, improved layer styling. Install via QGIS Plugin Manager (ID 4987).
- **Telegram Bot** — link your account with a one-time code at `@LeafEnginesBot` and run soil/plant queries from chat.
- **SoilCertify GIS resources** — infrastructure use case, developer landing, and technical overview cross-linked under `/docs/workflows/soilcertify/`.
- **FAQ refreshed** (2026-11-19) with current pricing and workflows.
- **Security hardening** — RLS on `api_keys` and `model_benchmark_results`, restricted `vendor_leads` to admins, secured `telegram-uploads` bucket.

## 3. Getting Started

### 3.1 Try Without Signup (Free Tier)
1. Visit **soilcertify.com** or **app.soilsidekickpro.com**
2. Use test key `leaf-test-370df0a2e62e` or click "Try Free"
3. Enter a US county name or GPS coordinates
4. View soil composition, pH, NPK, and recommendations

### 3.2 Create an Account
1. Go to `app.soilsidekickpro.com/sign-up`
2. Sign in with email or Google
3. Complete profile — pick your role (Farmer / Consultant / Developer / Enterprise)
4. Verify email via the branded welcome message

### 3.3 Choose a Plan

| Audience | Route | Tiers |
|---|---|---|
| **Consumer / SSP** | `/plans` | Hobby $29 · Grower $79 · **Pro $149** |
| **Developers / LeafEngines API** | `/pricing` | Free · Starter $149 · Pro $499 · Enterprise |

Free features remain free forever. Paid plans unlock quotas, VRT, AI chat, satellite intelligence, and Managed Assets.

## 4. Core Workflows

### 4.1 Soil Analysis
1. Dashboard → "New Analysis"
2. Enter address, drop pin, or upload GPS trace
3. Review NPK, drainage, texture, satellite overlay
4. Export PDF or share link

### 4.2 Field Mapping (`/field-mapping`)
- Draw polygons on the map
- Assign crop and season
- Save as a **Managed Asset** (v3.1.0+)
- Export as GeoJSON or WFS layer

### 4.3 Seasonal Planning (`/seasonal-planning`)
- Auto-generated calendar using 5-method optimization
- Weather-adjusted planting windows
- Task templates for irrigation, fertilization

### 4.4 VRT Prescriptions
- Requires Pro or Enterprise
- Upload boundary or select field
- Generate variable-rate map
- Download as shapefile or ISOBUS-XML

### 4.5 AI Assistant
- Chat with GPT-5 grounded on your fields
- Falls back to on-device Gemma when offline
- Never shares your field data with 3rd parties

### 4.6 Offline Mode
- App works fully read-only offline
- Writes queue automatically and sync on reconnect
- If GPS is unreliable, the app blocks saves > 500 m uncertainty and shows a soft warning

## 5. Managed Assets (SDK v3.1.0+)

Your saved fields, sensors, and points are full assets:
- **Optimistic locking** via `If-Match` ETag prevents accidental overwrites
- **Audit history** in `asset_history` captures every change
- **Soft delete** keeps records recoverable for 30 days
- **Public toggle** (`is_public`) exposes selected assets via WFS
- **Rate-limited** per API key with dual-meter quotas

Manage them at **Dashboard → Assets**, or via `POST/GET/PATCH/DELETE /assets-crud`.

## 6. API Keys (for your own tools)

1. `app.soilsidekickpro.com/api-keys`
2. Click "New key" → name it → copy once (SHA-256 hashed; not recoverable)
3. Add to your tool as `x-api-key` header
4. Rotate anytime; revoke instantly
5. Every key now tracks **free-tier** and **paid** usage independently

## 7. Integrations

- **QGIS Plugin v1.0.10** — install from QGIS Plugin Manager (ID 4987). Now includes WFS layer support and Bandit B411 hardening.
- **Claude Desktop (MCP)** — `npm i -g @ancientwhispers54/leafengines-mcp-server` — 10 tools including `get_soil_data`, `planting_optimization`, `carbon_credit_estimate`.
- **n8n** — `npm i n8n-nodes-leafengines`
- **Node-RED** — `npm i node-red-contrib-leafengines`
- **Telegram bot** — `/start` at `@LeafEnginesBot`, link account with one-time code
- **SDKs (v3.1.0)** — TypeScript, Python, Ruby, PHP, Java, Go — all published to their respective registries with Asset Management and WFS export APIs

## 8. Consumer Plant Care
- Take a photo → get safe identification
- Care schedule adapts to your local FIPS regulations
- Chemical warnings tuned to your jurisdiction
- Progressive-jargon toggle for beginner or expert view

## 9. Notifications
- Push notifications for tasks, alerts, sensor anomalies
- Email digest weekly
- Haptic feedback on supported devices

## 10. Privacy & Data Ownership
- You own your data
- PII encrypted (AES-256 V3) at rest
- Local AI never sends your queries to the cloud
- Export or delete your account any time from Settings

## 11. Troubleshooting

| Symptom | Fix |
|---|---|
| "Position uncertain" warning | Move outdoors, wait 10 s for GPS fix |
| Offline sync stuck | Reopen app while online; queue drains automatically |
| API key rejected | Confirm you're on `app.` subdomain, not `web.` |
| AI response missing | Check internet or enable local mode in Settings |
| Missing satellite overlay | Requires Pro tier |
| Asset update returns 412 | Refetch the asset for the latest `If-Match` ETag and retry |
| WFS layer empty in QGIS | Verify assets are marked `is_public=true` or the key is authorized |

## 12. Accessibility
- WCAG 2.1 AA
- Keyboard navigable throughout
- High-contrast theme in Settings
- Screen-reader tested (VoiceOver, NVDA)

## 13. Language & Regions
- English (default)
- Localized units (imperial/metric) per profile
- Regional pricing shown in local currency (US, EU, UK, AU)

## 14. Support Channels
- In-app chat (business hours)
- Email `support@soilsidekickpro.com`
- Community: `github.com/QWarranto/soil-sidekick-pro-guide/discussions`
- Enterprise SLA phone line (Enterprise tier)

## 15. Related Guides
- Workflow guides: `docs/workflows/`
- SoilCertify GIS: `docs/workflows/soilcertify/`
- QGIS developer landing: `docs/workflows/15_QGIS_DEVELOPER_LANDING.md`
- Quick start: `docs/get-started/QUICK_START.md`
- Telegram: `docs/telegram/TELEGRAM_QUICK_START.md`
- SDK reference: `docs/sdk/DEVELOPER_SPECIFICATIONS.md`
