# Workflow 5: Variable Rate Technology (VRT) Prescriptions

> **Goal:** Create zone-based prescription maps to optimize fertilizer, seed, or irrigation application across variable soil conditions.
> **Time:** ~25 minutes | **Difficulty:** Advanced | **Tier:** Pro (create) / API (export)
> **Prerequisite:** [Workflow 1](01_FIRST_TIME_SETUP.md), [Workflow 2](02_SATELLITE_FIELD_MONITORING.md) recommended

---

## Video Overview

```
[VIDEO NARRATION — INTRO]
"Variable Rate Technology lets your equipment automatically adjust
application rates as it moves across the field. Instead of applying 150
pounds of nitrogen everywhere, VRT might apply 180 in the productive
zones and 120 where the soil already has enough. The result? 15–30%
input cost savings and better yields. Let's build your first prescription."
```

---

## Step 1: Navigate to VRT

1. Go to **Variable Rate Technology** from the Features menu.
2. Select the field you want to optimize (created in Workflow 2).
3. If you haven't created fields yet, use **Field Mapping** first.

```
[VIDEO NARRATION]
"Open Variable Rate Technology and select your field. The system needs
field boundaries to create management zones, so make sure you've drawn
those in Field Mapping first."
```

---

## Step 2: Choose Application Type

Select what you're prescribing:

| Application | Common Units | Use Case |
|-------------|-------------|----------|
| **Fertilizer** | lbs/acre, kg/ha | Nitrogen, phosphorus, potassium, lime |
| **Seed** | seeds/acre | Variable seeding rate for optimal population |
| **Water/Irrigation** | gallons/acre | Zone-based irrigation scheduling |
| **Pesticide/Herbicide** | oz/acre, L/ha | Targeted application where needed |

```
[VIDEO NARRATION]
"Choose your application type. Most farmers start with fertilizer — it's
where you'll see the biggest cost savings. But VRT works for seeding,
irrigation, and crop protection too."
```

---

## Step 3: Enter Base Rate and Crop

1. **Base rate:** Enter your typical uniform application rate (e.g., 150 lbs/acre nitrogen).
2. **Unit:** Select measurement unit (lbs/acre, kg/hectare, seeds/acre, gallons/acre).
3. **Crop type:** Select your crop for crop-specific optimization.
4. **Target yield (optional):** Enter expected yield for yield-based recommendations.

```
[VIDEO NARRATION]
"Enter the rate you'd normally apply uniformly across the whole field.
The AI uses this as a baseline and adjusts up or down for each zone.
Adding your crop type and target yield makes the recommendations more
precise."
```

---

## Step 4: Generate the AI Prescription

1. Click **Generate Prescription Map**.
2. The AI analyzes:
   - Soil pH variability across the field
   - Nutrient levels (from USDA data or sensor data)
   - Organic matter distribution
   - Soil texture and drainage patterns
   - Satellite vegetation health (if available)
3. Wait 10–30 seconds for zone calculation.

```
[VIDEO NARRATION]
"Click Generate and give the AI about 20 seconds. It's analyzing your
soil variability, satellite data, and agronomic models to create optimal
management zones. This is precision agriculture — not guesswork."
```

---

## Step 5: Review Management Zones

The system creates 3–5 management zones:

| Zone | Rate Multiplier | Typical Condition |
|------|----------------|-------------------|
| **High Productivity** | 120% of base rate | Excellent soil, high organic matter |
| **Above Average** | 110% of base rate | Good conditions, responsive to inputs |
| **Standard** | 100% of base rate | Average soil conditions |
| **Below Average** | 90% of base rate | Sufficient nutrients, lower need |
| **Low Input** | 80% of base rate | Already-adequate or poor-response areas |

### For each zone, review:
- **Rate multiplier** and actual application rate
- **Justification** — what soil factors drove this zone
- **Area percentage** — how much of your field falls in this zone
- **Total input quantity** — total product needed for the zone
- **Confidence level** — how certain the AI is about this zone

```
[VIDEO NARRATION]
"Here's your prescription map. Each color represents a different
management zone. The High Productivity zone gets 120% of your base rate
because the soil there can support higher yields. The Low Input zone
gets 80% because adding more there would just be waste — or worse,
runoff pollution."

[ON-SCREEN] Point to each zone on the map. Show the detail panel for one zone.
```

---

## Step 6: Estimate Savings

1. Review the **Cost Savings Estimate** panel.
2. Example for a 100-acre field:
   - Uniform application: $7,500
   - VRT-optimized application: ~$7,200
   - **Direct savings:** $300 per application
   - **Yield improvement:** 5–15% in responsive zones
   - **ROI improvement:** 15–25% over the season

```
[VIDEO NARRATION]
"The savings panel shows you exactly how much you'll save versus uniform
application. On a 100-acre field, the direct savings are typically $300
per application — but the yield improvement in your best zones is where
the real money is."
```

---

## Step 7: Export for Equipment (API Tier)

1. Click **Export Prescription Map**.
2. Choose your equipment's format:

| Format | Equipment | Use |
|--------|-----------|-----|
| **ADAPT 1.0** | Universal — most farm management software | John Deere Operations Center, Climate FieldView |
| **Shapefile** | GIS tools, advanced mapping | QGIS, ArcGIS, custom integrations |
| **ISO-XML** | International precision ag standard | ISOBUS-compatible equipment (ISO 11783) |

3. Load the exported file:
   - Copy to USB drive, or
   - Upload to manufacturer's cloud platform (Operations Center, AFS Connect, etc.).
4. Import into your tractor's display.
5. Verify zones display correctly before starting application.

> ⚠️ **Important:** Always verify the prescription map displays correctly on your equipment display before beginning field application.

```
[VIDEO NARRATION]
"Export in the format your equipment supports. If you use John Deere,
start with ADAPT. Load it onto a USB or upload to Operations Center,
then verify on the cab display that the zones match what you see here.
Always double-check before you start spreading."

[TRANSITION] "Your fields are now optimized with variable rate
prescriptions. Next, let's look at offline AI for when you're in the
field without connectivity."
```

---

## ✅ Workflow Checklist

- [ ] Field selected for VRT optimization
- [ ] Application type chosen
- [ ] Base rate and crop entered
- [ ] AI prescription generated
- [ ] Management zones reviewed and understood
- [ ] Cost savings estimate reviewed
- [ ] Prescription exported in equipment-compatible format
- [ ] File loaded and verified on equipment display

---

## Next Steps

→ **Workflow 6:** [Offline AI & Privacy-First Analysis](06_OFFLINE_AI.md)
→ **Workflow 10:** [Full-Season Workflow](10_FULL_SEASON_WORKFLOW.md)
