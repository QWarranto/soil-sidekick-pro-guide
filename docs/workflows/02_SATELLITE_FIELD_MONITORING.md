# Workflow 2: Satellite Intelligence & Field Monitoring

> **Goal:** Interpret AlphaEarth satellite data to monitor vegetation health, soil moisture, and environmental risk across your fields.
> **Time:** ~20 minutes | **Difficulty:** Intermediate | **Tier:** Pro+
> **Prerequisite:** [Workflow 1 — First-Time Setup](01_FIRST_TIME_SETUP.md)

---

## Video Overview

```
[VIDEO NARRATION — INTRO]
"SoilSidekick Pro connects to Google Earth Engine through AlphaEarth to
give you satellite-powered insights about your fields. In this workflow,
you'll learn to read NDVI vegetation health, soil moisture patterns, and
environmental risk scores — all without stepping into the field."
```

---

## Step 1: Navigate to Field Mapping

1. Go to **Field Mapping** from the main navigation.
2. If this is your first visit, you'll see an empty map centered on your county.

```
[VIDEO NARRATION]
"Start by going to Field Mapping. This is where you define the boundaries
of the fields you want to monitor with satellite data."
```

---

## Step 2: Draw Your Field Boundaries

1. Click **Add Field** in the toolbar.
2. Use the map tools to draw your field boundary:
   - Click points around the perimeter of your field.
   - Close the shape by clicking the first point again.
3. Name your field (e.g., "North 40 — Corn").
4. Enter details: crop type, acreage, planting date.
5. Click **Save Field**.

> 💡 **Tip:** Zoom in to at least road-level detail before drawing for accurate boundaries. Use the satellite base layer for visual reference.

```
[VIDEO NARRATION]
"Click Add Field, then trace the edges of your field on the map. The
satellite imagery helps you see exactly where your rows start and end.
Name it something memorable and tag the crop type — this helps the AI
tailor its recommendations."

[ON-SCREEN] Demonstrate drawing a polygon, naming it, saving it.
```

---

## Step 3: Review Vegetation Health (NDVI)

After saving your field, satellite data loads automatically:

| NDVI Score | Meaning | Visual Color |
|------------|---------|--------------|
| 8.0–10.0 | Excellent — dense, healthy vegetation | Dark green |
| 5.0–7.9 | Moderate — some stress present | Yellow-green |
| 0.0–4.9 | Poor — significant stress, intervention needed | Red-orange |

### What to look for:
- **Uniform green** = healthy, consistent crop canopy.
- **Yellow patches** = potential irrigation, nutrient, or pest issues.
- **Red zones** = immediate investigation needed (disease, drought, flood damage).

```
[VIDEO NARRATION]
"NDVI stands for Normalized Difference Vegetation Index. Think of it as
a report card for your crop's health. Dark green is great — that's dense,
actively photosynthesizing vegetation. If you see yellow or red patches,
that's the satellite telling you something's wrong in that specific area."

[ON-SCREEN] Point to NDVI color legend. Highlight a healthy zone vs. a stressed zone.
```

---

## Step 4: Analyze Soil Moisture Patterns

1. Switch to the **Soil Moisture** layer in the satellite panel.
2. Review moisture levels:

| Level | Range | Interpretation |
|-------|-------|----------------|
| High | 70–100% | Good for most crops; watch for root disease risk |
| Medium | 30–70% | Adequate; monitor trends |
| Low | 0–30% | Drought stress likely; irrigation needed |

### Key actions:
- Compare moisture map with rainfall data from the past 7 days.
- Identify consistently wet areas (drainage issues) or dry spots (irrigation gaps).
- Plan irrigation schedules based on moisture trends.

```
[VIDEO NARRATION]
"Switch to the Soil Moisture view. This shows you where water is
sitting across your field. Consistently blue areas might need better
drainage. Brown or tan areas are dry — that's where you focus
irrigation first."
```

---

## Step 5: Check Environmental Risk Scores

1. Open the **Environmental Risk** panel.
2. Review the composite score:

| Score | Level | Action |
|-------|-------|--------|
| 0–3 | Low risk | Continue current practices |
| 4–6 | Medium risk | Implement preventive measures |
| 7–10 | High risk | Significant mitigation required |

3. Risk factors include: drought likelihood, disease pressure, pest probability, runoff risk.

```
[VIDEO NARRATION]
"The Environmental Risk Score combines multiple satellite-derived factors
into one number. A score of 7 or higher means you should take action —
the system tells you exactly which factors are driving the risk."

[ON-SCREEN] Expand the risk factor breakdown.
```

---

## Step 6: Understand Confidence Scores

Every satellite reading includes a confidence percentage:

| Confidence | Meaning | Recommendation |
|------------|---------|----------------|
| 80–100% | High — clear conditions | Trust the data |
| 60–79% | Medium — some atmospheric interference | Use with context |
| 0–59% | Low — cloudy/poor conditions | Verify with field visit |

> 💡 **Tip:** Low-confidence readings often occur after heavy cloud cover. Wait 3–5 days for a clearer pass, or cross-reference with sensor data if available.

```
[VIDEO NARRATION]
"Every reading has a confidence score. If it's below 60%, the satellite
had trouble seeing through clouds or haze. Don't make big decisions on
low-confidence data — wait for the next clear pass."
```

---

## Step 7: Track Seasonal Patterns

1. Use the **Historical View** to compare satellite data over weeks or months.
2. Look for:
   - Early-season green-up timing
   - Mid-season stress events (drought, flooding)
   - Late-season senescence patterns
3. Export historical comparisons for your records.

```
[VIDEO NARRATION]
"The real power of satellite monitoring is tracking change over time.
Compare this week to last month. Did that stressed patch recover after
you irrigated? Is the new fertilizer application showing results yet?
This is precision agriculture in action."

[TRANSITION] "Next, we'll use EPA water quality data to complete your
environmental picture."
```

---

## ✅ Workflow Checklist

- [ ] Field boundaries drawn and saved
- [ ] NDVI vegetation health reviewed
- [ ] Soil moisture patterns analyzed
- [ ] Environmental risk score checked
- [ ] Confidence scores understood
- [ ] Historical comparison reviewed

---

## Next Steps

→ **Workflow 3:** [Environmental & Water Quality Assessment](03_ENVIRONMENTAL_ASSESSMENT.md)
→ **Workflow 5:** [VRT Prescriptions](05_VRT_PRESCRIPTIONS.md) (uses satellite data for zone creation)
