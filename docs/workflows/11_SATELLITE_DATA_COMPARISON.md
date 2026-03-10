# Satellite Field Data: The Traditional Way vs. SoilSidekick Pro

> **Purpose:** Demonstrate how SoilSidekick Pro and LeafEngines™ eliminate the complexity of acquiring and interpreting satellite imagery for agricultural field monitoring.

---

## The Traditional Approach: ASF Data Search (Vertex)

Finding Sentinel-1 SAR imagery for your fields requires **7 manual steps**, specialized knowledge, and post-processing software.

| Step | Action | What You Need to Know |
|------|--------|-----------------------|
| 1 | Navigate to ASF Data Search website | Know the URL, understand the Vertex interface |
| 2 | Define your Area of Interest (AOI) | Draw a bounding box, or prepare and upload a Shapefile/KML of your field boundaries |
| 3 | Select the Dataset | Know to choose "Sentinel-1" from a list of dozens of satellite missions |
| 4 | Set the Date Range | Manually enter start/end dates for your growing season |
| 5 | Apply Filters | Know the correct **File Type** (GRD), **Beam Mode** (IW), and **Polarization** (VV+VH) — terminology most farmers have never encountered |
| 6 | Initiate the Search | Wait for results to process |
| 7 | Review, Queue, and Download | Browse individual scenes, add to a download queue, download raw files to your computer, then process them with GIS software |

**After all 7 steps, you still have raw satellite data files on your hard drive that require specialized GIS software (QGIS, ArcGIS, SNAP) to interpret.**

---

## The SoilSidekick Pro Approach: 3 Steps, Zero Jargon

SoilSidekick Pro connects to AlphaEarth (Google Earth Engine) and handles satellite acquisition, processing, and interpretation automatically.

| Step | Action | What Happens Behind the Scenes |
|------|--------|-------------------------------|
| 1 | **Go to Field Mapping** and draw your field boundary on the map | LeafEngines identifies your location, selects the optimal satellite sources, and sets the coordinate system |
| 2 | **Save your field** with a name and crop type | LeafEngines automatically retrieves the latest NDVI, soil moisture, and environmental risk data for your boundary — no file types, beam modes, or polarization settings to configure |
| 3 | **Read your results** directly in the dashboard | Vegetation health (color-coded map), soil moisture levels, environmental risk scores, and confidence ratings are displayed instantly — no downloads, no GIS software |

**That's it. Three clicks from "I want to monitor my field" to actionable insights.**

---

## Side-by-Side Comparison

| Capability | ASF Vertex (Traditional) | SoilSidekick Pro |
|------------|--------------------------|------------------|
| **Steps to first insight** | 7 + post-processing | 3 |
| **Time to results** | 30–60 min (plus processing) | ~2 minutes |
| **Satellite knowledge required** | GRD, IW, VV+VH, scene selection | None |
| **Software required** | Browser + QGIS/ArcGIS/SNAP | Browser only |
| **Output format** | Raw .zip scene files | Color-coded health maps, scores, alerts |
| **Historical comparison** | Manual multi-file analysis | Built-in timeline slider |
| **Interpretation** | You figure it out | AI-generated plain-language summaries |
| **Cost** | Free data, but hours of your time | Included in Pro subscription |
| **Offline access** | No | Yes — cached field data available offline |
| **Actionable next steps** | None — raw data only | Auto-generates scouting tasks, VRT prescriptions, seasonal plans |

---

## How LeafEngines Handles the Complexity For You

When you save a field boundary in SoilSidekick Pro, the LeafEngines API does the following automatically:

```
You draw a field boundary
        ↓
LeafEngines detects your region → routes to optimal data sources
        ↓
AlphaEarth retrieves latest satellite passes (Sentinel-2, Landsat, etc.)
        ↓
NDVI, soil moisture, and thermal layers are computed server-side
        ↓
Environmental risk score is calculated from multiple factors
        ↓
Confidence score is attached based on atmospheric conditions
        ↓
Results delivered to your dashboard — color-coded and explained
```

### What would take 7 steps and GIS expertise becomes one API call:

**Traditional (your code):**
```
1. Construct bounding box from field coordinates
2. Query ASF API with dataset=Sentinel-1, beamMode=IW, polarization=VV+VH
3. Filter results by date range and file type (GRD)
4. Download .zip scene files
5. Extract and load into processing software
6. Apply radiometric calibration
7. Compute vegetation indices
8. Render and interpret output
```

**LeafEngines (your code):**
```typescript
const result = await fetch('/functions/v1/leafengines-query', {
  method: 'POST',
  headers: { 'x-api-key': 'ak_your_key' },
  body: JSON.stringify({
    location: {
      latitude: 41.9782,
      longitude: -93.5747
      // Or use county_fips: "19099" for Story County, Iowa
    },
    plant: { common_name: "Corn" }
  })
});

// Returns: NDVI scores, soil moisture, environmental risk,
//          confidence ratings, and AI recommendations
//          — ready to display, no processing needed.
```

---

## Video Narration Script

```
[VIDEO NARRATION — INTRO]
"If you've ever tried to get satellite data for your fields, you know
the pain. Find the right website, draw your area, pick the right
dataset, figure out what GRD and IW mean, download huge files, then
open them in expensive GIS software just to see a green-and-red map.

With SoilSidekick Pro, you skip all of that. Draw your field, name it,
and your satellite health report is ready in seconds. No downloads.
No jargon. No GIS degree required."

[ON-SCREEN] Split-screen: left shows 7-step Vertex workflow scrolling
by; right shows SoilSidekick Pro field drawing → instant NDVI results.

[TRANSITION]
"Let's walk through it."
```

```
[VIDEO NARRATION — STEP 1]
"Go to Field Mapping and draw your field boundary right on the map.
You can see the satellite imagery underneath to trace your rows
accurately."

[ON-SCREEN] User clicks Add Field, traces boundary on satellite basemap.
```

```
[VIDEO NARRATION — STEP 2]
"Name your field and tag the crop. That's all the input the system
needs. Behind the scenes, LeafEngines is already pulling the latest
satellite data for your exact boundary."

[ON-SCREEN] Field name: "North 40 — Corn". Click Save.
```

```
[VIDEO NARRATION — STEP 3]
"And here are your results. Dark green means healthy vegetation.
Yellow patches mean something needs attention. The confidence score
tells you how reliable this reading is — if it's cloudy, the system
tells you to wait for the next clear pass instead of guessing."

[ON-SCREEN] NDVI map loads with color legend. Point to confidence score.

[TRANSITION]
"No beam modes. No polarization settings. No downloads. Just answers."
```

---

## For Developers: API Comparison

### ASF Vertex API (Traditional)
```bash
# Step 1: Search for scenes
curl "https://api.daac.asf.alaska.edu/services/search/param?\
platform=Sentinel-1&\
beamMode=IW&\
polarization=VV%2BVH&\
processingLevel=GRD_HD&\
start=2025-05-01T00:00:00Z&\
end=2025-09-30T23:59:59Z&\
bbox=-94.0,41.5,-93.0,42.5&\
output=json"

# Step 2: Parse results, extract download URLs
# Step 3: Authenticate with NASA Earthdata Login
# Step 4: Download each .zip file (500MB–1GB each)
# Step 5: Extract, calibrate, compute indices in Python/SNAP
# Step 6: Generate visualization
# ... hours later, you have a result
```

### LeafEngines API (SoilSidekick Pro)
```bash
# One call. Done.
curl -X POST "https://your-project.supabase.co/functions/v1/leafengines-query" \
  -H "x-api-key: ak_your_key" \
  -H "Content-Type: application/json" \
  -d '{
    "location": { "latitude": 41.9782, "longitude": -93.5747 },
    "plant": { "common_name": "Corn" }
  }'

# Returns processed NDVI, soil moisture, risk scores,
# AI recommendations — in seconds, not hours.
```

---

## Next Steps

→ **Try it yourself:** [Field Mapping](/field-mapping) — draw a field and see satellite data in real-time
→ **Workflow 2:** [Satellite Intelligence & Field Monitoring](02_SATELLITE_FIELD_MONITORING.md) — detailed guide to interpreting your results
→ **Workflow 5:** [VRT Prescriptions](05_VRT_PRESCRIPTIONS.md) — turn satellite data into variable-rate application maps
→ **For developers:** [API Documentation](/api-docs) — integrate LeafEngines into your own platform
