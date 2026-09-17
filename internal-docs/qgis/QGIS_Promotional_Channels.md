# QGIS Promotional Channels — Strategy & Tailored Posts

> **Source:** Grok-generated draft, vetted and updated for v2.0 (dual-meter, per-channel test keys)  
> **Version:** 2.0 (May 23, 2026)  
> **Owner:** Reggie Rice  
> **WARNING:** All posts reference per-channel isolated test keys. Do NOT use the shared `leaf-test-[REDACTED]` key — it creates cross-channel attribution ambiguity and can't be revoked per-channel.

---

## 1. Channel Rankings by ROI Potential

### Top Tier (Highest ROI)

| Rank | Channel | Why It Works | Recommended Angle | User Quality |
|------|---------|--------------|-------------------|--------------|
| 1 | LinkedIn (organic + ads) | Best channel for paid conversions in B2B ag/GIS | Enterprise features, ISOBUS/ADAPT export, managed deployment, MCP for agents | Very High |
| 2 | r/LocalLLaMA | Offline Gemma 2B/7B on field laptops is compelling right now | "Fully offline AI soil + planting recommendations on a ruggedized laptop" | High |
| 3 | AgTalk.com (Precision Ag forum) | Core audience: serious US precision ag users who buy hardware/software | ISOBUS TASKDATA export, VRT prescriptions, soil enrichment | Very High |
| 4 | The Farming Forum (UK) + FWAG groups | Strong UK/EU audience using PDOK/DEFRA/MAGIC data | "Works natively with PDOK, DEFRA MAGIC, IGN RPG" + ISOBUS | High |

### Strong Secondary Channels

**Reddit:**
- r/gis (better than r/QGIS for paid users)
- r/agronomy
- r/PrecisionAg
- r/AgricultureTechnology
- r/farmers (smaller but high quality)
- Country versions: r/ukfarming, r/canada, r/AusAgriculture

**Specialized Forums & Communities:**
- PrecisionAg.com forums
- No-Till Farmer and Farm Journal communities
- QGIS Discourse (frame as "implementation guide" — careful with self-promotion rules)
- OSGeo and national QGIS user groups (Netherlands, France, Germany are strong)

**AI + Tech Channels (offline/local angle):**
- Local LLM Discords (Ollama, LM Studio, GPT4All)
- Hugging Face "Agriculture" and "GIS" discussions

### Paid Advertising Channels

| Channel | Targeting | Keywords |
|---------|-----------|----------|
| LinkedIn Ads | Job titles: Agronomist, Precision Ag Manager, GIS Analyst, Farm Data Manager. Geo: US Midwest, Netherlands, France, UK, Australia, Brazil, Canada | — |
| Reddit Ads | r/gis, r/agronomy, r/farming + interest-based (Precision Ag, GIS) | — |
| Google Search Ads | — | "QGIS ISOBUS", "QGIS VRT export", "offline AI agriculture", "precision agriculture QGIS plugin" |

---

## 2. Strategic Messaging Angles by Channel

| Channel | Lead Angle |
|---------|------------|
| LinkedIn / Enterprise | Managed deployment, secret-manager-backed keys, MCP server for AI agents, ISOBUS + ADAPT 1.0 |
| r/LocalLLaMA | Offline Gemma 2B/7B + WebGPU/CUDA acceleration + field laptop use case |
| Farmer / Precision Ag Forums | USB-ready ISOBUS TASKDATA for tractors (John Deere, CNH, etc.), no subscription for core features |
| r/gis & QGIS communities | Technical depth — WFS enrichment, le_* attributes, county_lookup, safe_identification |
| UK/EU forums | Native PDOK/DEFRA MAGIC/IGN RPG support + ISOBUS |

---

## 3. Tailored Post Drafts

### 3.1 r/GIS

**Title:** LeafEngines for QGIS — Free plugin with soil enrichment, ISOBUS/VRT export, and offline AI (no signup)

Hey r/GIS,

I've just published an implementation guide for LeafEngines, a QGIS plugin that adds practical agronomy intelligence directly in the canvas.

**What it does:**
- Pulls soil data and enrichment attributes (le_*) onto any vector layer (WFS sources — PDOK, DEFRA MAGIC, IGN RPG, NRCS SDA, or your own)
- Generates 5-method planting calendars and crop compatibility scoring
- Exports prescription maps as ISOBUS TASKDATA, ADAPT 1.0, zoned shapefiles, or GeoJSON — tractor-ready
- Includes offline AI (Gemma 2B/7B) running locally in 2–5 seconds on WebGPU/CUDA/Metal. No internet required.

**Free tier (dual-meter):**
- No account, no email, no credit card
- Install the plugin and it auto-uses the free tier: 20 data calls/day, 5 AI calls/day, 3 plant identifications/day
- For extended access, use the r/gis evaluation key: `leaf-eval-gis-[REDACTED]`

**Target users:**
- GIS professionals supporting ag clients
- Agronomists doing in-house mapping
- Enterprise integrators (managed deployment + secret manager key rotation + MCP server for AI agents)

Install is two clicks in the QGIS plugin manager (3.22+ or QGIS 4). Interactive tour opens automatically.

Full guide: https://app.soilsidekickpro.com/docs/workflows/13-qgis-implementation-guide

Happy to answer technical questions — WFS tips, export quirks, offline model setup, deployment at scale, etc.

---

### 3.2 r/LocalLLaMA

**Title:** Offline Gemma 2B/7B running inside QGIS for soil + agronomy (fully local, no internet)

Hey r/LocalLLaMA,

I just open-sourced a QGIS plugin called LeafEngines that brings fully offline AI to agriculture/GIS workflows using Gemma 2B and 7B.

It runs on-device (2–5 second inference) on field laptops with no signal — accelerated via WebGPU, CUDA, or Metal. You can query soil, get planting recommendations, and run analysis completely offline.

**Other highlights:**
- Enriches any vector layer with soil data via local or API calls
- Generates planting calendars and compatibility scores
- Exports ISOBUS TASKDATA / VRT prescriptions ready for the tractor
- Includes an MCP server so Claude or other agents can drive the tools

The free tier requires zero signup. Install the plugin and core tools work immediately — 3 plant IDs/day, 5 AI calls/day, 20 data calls/day. Evaluation key for extended access: `leaf-eval-localllama-[REDACTED]`

If you're into local LLMs and practical real-world applications (especially ag or environmental), this is a unique use case.

Install (QGIS 3.22+):
1. Plugins → Manage and Install Plugins → Search "LeafEngines"
2. Restart and run the tour

Full guide: https://app.soilsidekickpro.com/docs/workflows/13-qgis-implementation-guide

Would love feedback from the local LLM crowd before v1.0.10 ships. AMA about setup, quantization, or field performance.

---

### 3.3 LinkedIn

**Post:**

LeafEngines for QGIS — A genuinely frictionless plugin for precision agriculture and agronomy teams.

We've built a free QGIS plugin that brings soil intelligence, variable rate prescriptions, and offline AI directly into your existing GIS workflows — with zero signup required.

**Key capabilities:**
- Enrich cadastre, parcel, or field boundaries with detailed soil attributes from any WFS source (PDOK, DEFRA MAGIC, NRCS SDA, IGN RPG, etc.)
- Generate planting calendars and crop suitability scoring (works offline)
- Export prescriptions as ISOBUS TASKDATA, ADAPT 1.0, or zoned shapefiles — USB-ready for tractors
- Fully offline AI using on-device Gemma 2B/7B (~2–5s inference)
- Optional MCP server so Claude and other agents can control the tools
- Enterprise features: managed deployment and secret-manager-backed key rotation

**Free tier (dual-meter, no signup):**
- 20 data calls/day, 5 AI calls/day, 3 plant identifications/day
- No email, no credit card, no account
- Evaluation key for extended access: `leaf-eval-linkedin-[REDACTED]`

Perfect for GIS Analysts, Agronomists, Precision Ag Advisors, and AgTech integrators.

Installs in under 30 seconds from the QGIS plugin repository (3.22+ or QGIS 4). An interactive tour launches automatically.

Full implementation guide: https://app.soilsidekickpro.com/docs/workflows/13-qgis-implementation-guide

I'm happy to hop on a quick call or answer questions about deployment, regional data sources, ISOBUS compatibility, or offline model performance.

#PrecisionAgriculture #QGIS #Agronomy #GIS #AgTech #DigitalFarming

---

### 3.4 AgTalk (Precision Ag Forum)

**Title:** Free QGIS Plugin — Soil data + ISOBUS export + Offline AI (No subscription)

Hey guys,

I've been working on a QGIS plugin called LeafEngines that a few of you might find useful.

It lets you pull soil data onto your field boundaries, run planting calendars, and export prescription files as ISOBUS TASKDATA (also ADAPT 1.0 and shapefiles) that you can put on a USB and load straight into the tractor.

Biggest differentiator is the offline AI — it runs Gemma 2B or 7B locally on your field laptop. No cell signal needed. Works in 2–5 seconds.

**Completely free to test:**
- No signup, no credit card, no email
- Free tier: 20 soil/county/water lookups per day, 5 AI calls per day, 3 plant IDs per day
- AgTalk evaluation key: `leaf-eval-agtalk-[REDACTED]`

Works with NRCS soil data, your own shapefiles, or any WFS layers. Installs straight from the QGIS plugin manager.

If you're doing variable rate or want better soil maps without paying monthly fees for another platform, worth a look.

Full guide: https://app.soilsidekickpro.com/docs/workflows/13-qgis-implementation-guide

I'll hang out in the thread and answer any questions about ISOBUS quirks, offline setup, or how well it works in the field.

---

### 3.5 The Farming Forum (UK)

**Title:** Free QGIS Plugin – Soil enrichment, planting calendars & ISOBUS export (works with MAGIC & PDOK)

Afternoon all,

I've released a new free QGIS plugin called LeafEngines that some of the agronomists and more tech-savvy farmers on here might find interesting.

It allows you to enrich your field maps with soil data, run sensible planting calendars (including offline), and export variable rate prescriptions as proper ISOBUS TASKDATA files ready for the tractor. Also supports ADAPT 1.0.

It works natively with DEFRA MAGIC, PDOK, IGN RPG, and NRCS data among others.

One of the more interesting features is the offline AI — runs Gemma 2B or 7B locally on a field laptop with no internet required. Quite handy when you're in a blackspot.

**Free tier (no signup):**
- 20 data calls/day, 5 AI calls/day, 3 plant identifications/day
- Just install the plugin from the QGIS repository and it works
- TFF evaluation key for extended access: `leaf-eval-tff-[REDACTED]`

Full guide: https://app.soilsidekickpro.com/docs/workflows/13-qgis-implementation-guide

Happy to answer questions — particularly around UK data sources, ISOBUS compatibility with different manufacturers, or setting up the offline models.

v1.0.10 due out in the next few weeks — open to suggestions from UK users before release.

---

## 4. Pro Tips for Better Conversion

1. **Create 3–4 versions of the post** with different hooks (Offline AI version, ISOBUS version, Zero-friction free tier version, Enterprise version).
2. **Use per-channel isolated evaluation keys** — this lets you attribute signups by channel and revoke individually if one leaks.
3. **Short demo video (60–90 seconds)** showing:
   - WFS layer → enrich with soil data
   - Click for planting calendar
   - Export ISOBUS file
   - Offline Gemma query
4. **Promotion sequence over 4–6 weeks** — stagger channel launches to avoid saturation and measure attribution per key.

---

## 5. Key Policy — Per-Channel Isolation

| Channel | Key Pattern | Revocable | Attribution |
|---------|-------------|-----------|-------------|
| r/gis | `leaf-eval-gis-[REDACTED]` | Yes | Channel-specific |
| r/LocalLLaMA | `leaf-eval-localllama-[REDACTED]` | Yes | Channel-specific |
| LinkedIn | `leaf-eval-linkedin-[REDACTED]` | Yes | Channel-specific |
| AgTalk | `leaf-eval-agtalk-[REDACTED]` | Yes | Channel-specific |
| The Farming Forum | `leaf-eval-tff-[REDACTED]` | Yes | Channel-specific |

**Do NOT use the old shared test key `leaf-test-[REDACTED]` in any new post.** It was a single key shared across all channels — no attribution, no per-channel revocation.
