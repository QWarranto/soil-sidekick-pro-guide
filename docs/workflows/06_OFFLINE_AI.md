# Workflow 6: Offline AI & Privacy-First Analysis

> **Goal:** Set up and use local Gemma AI models for offline soil analysis and agricultural chat — without sending any data to the cloud.
> **Time:** ~15 minutes | **Difficulty:** Intermediate | **Tier:** Pro+

---

## Video Overview

```
[VIDEO NARRATION — INTRO]
"Not every field has cell service. And sometimes you don't want your
farm data leaving your device. SoilSidekick Pro runs Google's Gemma
language models right on your phone or laptop, so you can get AI-powered
soil recommendations even when you're completely offline."
```

---

## Step 1: Enable Local AI Processing

1. Go to **Settings → AI Processing** (or look for the **Local LLM Toggle** in the toolbar).
2. Toggle **Local Processing** to ON.
3. Choose your processing mode:

| Mode | Behavior |
|------|----------|
| **Auto** | System chooses cloud or local based on connectivity, battery, and task complexity |
| **Privacy** | All processing stays local — no data leaves your device |
| **Battery** | Uses efficient local models to preserve battery life |
| **Cloud** | Always uses cloud GPT-5 when available |

> 💡 **Tip:** Start with **Auto** mode. The Smart Model Selection algorithm handles switching seamlessly.

```
[VIDEO NARRATION]
"Find the Local AI toggle — it might be in your toolbar or under
Settings. Turn it on, and you'll be asked to download the AI model.
Start with Auto mode and let the system decide when to go local."
```

---

## Step 2: Download the AI Model

1. Select your model:

| Model | Size | RAM Needed | Best For |
|-------|------|-----------|----------|
| **Gemma 2B** | ~2 GB download | 2–4 GB | Quick summaries, mobile devices |
| **Gemma 7B** | ~8 GB download | 8–16 GB | Detailed analysis, complex questions |

2. Click **Download Model** and wait for the download to complete.
3. The model caches locally — you only download once.

> ⚠️ **Important:** Download the model while you have a strong internet connection. Once cached, it works fully offline.

```
[VIDEO NARRATION]
"Choose your model size. If you're on a phone, go with Gemma 2B — it's
smaller and faster. On a laptop with 8+ gigs of RAM, the 7B model gives
you more detailed, accurate answers. Download it now while you have
Wi-Fi, and it'll be ready whenever you need it."
```

---

## Step 3: Use Offline Soil Analysis

1. With local AI enabled, go to **Soil Analysis**.
2. Select your county (cached data from previous online session).
3. The AI generates analysis summaries using the local model.
4. Look for the **"Local AI"** badge — this confirms processing is happening on-device.

### What works offline:
- ✅ Soil analysis summaries and recommendations
- ✅ Agricultural Q&A chat
- ✅ Report generation from cached data
- ✅ Task management and planning

### What requires connectivity:
- ❌ Live satellite data (AlphaEarth)
- ❌ Real-time EPA water quality updates
- ❌ New county data downloads
- ❌ Subscription verification

```
[VIDEO NARRATION]
"Now go to Soil Analysis. See that 'Local AI' badge? That means
everything you're seeing is being processed right on your device. No
data is going to the cloud. Your soil information, your field boundaries,
your crop plans — all private."
```

---

## Step 4: Use the Offline Agricultural Chat

1. Open the **Agricultural Chat** assistant.
2. Toggle to **Local Mode** (if not already in Privacy mode).
3. Ask questions like:
   - "What's the best cover crop for clay soil with pH 5.8?"
   - "When should I apply lime for spring corn planting?"
   - "What are signs of nitrogen deficiency in soybeans?"
4. Responses come from the local Gemma model — instant, no network needed.

```
[VIDEO NARRATION]
"Open the chat and ask it anything about farming. Watch — the response
comes back instantly because there's no network round trip. You can use
this standing in the middle of a field with zero cell service."

[ON-SCREEN] Type a question, show the instant local response with the Local AI indicator.
```

---

## Step 5: Optimize Performance

### WebGPU Acceleration
- If your device supports WebGPU (Chrome 94+, Edge 94+), local AI runs significantly faster.
- The system auto-detects and uses WebGPU when available.
- Falls back to CPU processing on older devices.

### Battery Management
- In **Battery Mode**, the system uses Gemma 2B (lighter) and reduces processing frequency.
- On low battery (<20%), the system automatically switches to battery-efficient mode.

### Storage Management
- Models cache in browser storage (IndexedDB).
- Clear cache: **Settings → Storage → Clear AI Models** (requires re-download).
- Total storage: 2–10 GB depending on model choice.

```
[VIDEO NARRATION]
"If your device has a modern graphics card, WebGPU makes local AI
dramatically faster. The system detects this automatically. And if your
battery is getting low, Battery Mode uses the lighter model to squeeze
more life out of your device."

[TRANSITION] "You now have AI-powered farming intelligence that works
anywhere — online or off, with complete privacy. Next, let's look at
earning carbon credits."
```

---

## ✅ Workflow Checklist

- [ ] Local AI processing enabled
- [ ] Processing mode selected (Auto/Privacy/Battery/Cloud)
- [ ] AI model downloaded and cached
- [ ] Offline soil analysis tested
- [ ] Agricultural chat tested in local mode
- [ ] Performance optimization reviewed (WebGPU, battery)

---

## Next Steps

→ **Workflow 7:** [Carbon Credits & Sustainability Scoring](07_CARBON_CREDITS.md)
→ **Workflow 10:** [Full-Season Workflow](10_FULL_SEASON_WORKFLOW.md)
