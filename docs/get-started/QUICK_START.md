# Quick Start

**Goal:** Get from "I just installed the plugin" to "I just made my first successful API call inside QGIS" in under 5 minutes. No signup, no card, no email.

---

## ⚡ Get Started Now

**Free tier — no signup, no credit card:**
- **Test key:** `leaf-test-370df0a2e62e` (works immediately)
- **Free header:** `x-free-tier: true` (no key needed)

**Ready for production? Founder pricing ends June 1, 2026:**
- [Starter — $10/mo → lifetime $49/mo lock →](https://buy.stripe.com/14A7sL30y8bR2F4fbgaMU02)
- [Pro — $49/mo → lifetime $149/mo lock →](https://buy.stripe.com/cNi3cv1WuajZcfE7IOaMU03)

**Get a professional soil report (no coding required):** [soilcertify.com →](https://soilcertify.com)

---

## Prerequisites

- QGIS 3.22 or later installed ([download QGIS](https://qgis.org/download/))
- The LeafEngines plugin installed from the QGIS Plugin Manager (search: **LeafEngines**)

## Step 1 — Copy the free test API key

```
leaf-test-370df0a2e62e
```

This is a shared evaluation key. It unlocks **2 of 20** LeafEngines endpoints with no rate-limit ceiling for casual use. No account required.

## Step 2 — Paste the key into the plugin

In QGIS, open the **LeafEngines** panel (right sidebar by default). Paste the key into the **API Key** field at the top and click **Connect**. You should see a green "Connected — test mode" indicator.

## Step 3 — Select a parcel

Use the QGIS map canvas to select any US parcel. The plugin works on any vector feature with a valid geometry — drawn polygon, imported shapefile, or selected feature from a parcel layer.

## Step 4 — Fetch soil data

Click **Fetch soil data** in the LeafEngines panel. Within a few seconds, the result panel populates with the core soil composition response from the test endpoint.

> _[Screenshot: LeafEngines result panel populated with soil data for a selected parcel.]_

---

## That's it.

You just made a free LeafEngines call from inside QGIS. The test key gives you **2 of 20** endpoints — enough to evaluate the plugin's core flow, not enough for production work.

**Next steps**, depending on what you want to do:

- **Build with the full API** → [Free API Key](/docs/get-started/free-api-key) explains what the test key unlocks and how to get a production key.
- **See the finished deliverable** → [Sample Reports](/docs/get-started/sample-reports) shows what the same data looks like as a client-ready PDF.
- **Plan a budget** → [Pricing](/docs/get-started/pricing) covers pay-as-you-go, subscriptions, and SoilCertify reports.
