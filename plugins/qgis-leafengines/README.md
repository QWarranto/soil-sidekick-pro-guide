# LeafEngines QGIS Plugin

## 🚀 FREE TIER: NO API KEY NEEDED!nn**Immediate access with test key:** `leaf-test-370df0a2e62e`nn### ✅ Try It Now (No Waiting):nn1. **Use test key:** `leaf-test-370df0a2e62e`n2. **Immediate access** to all featuresn3. **No forms, no waiting, no approval**n4. **Works across all platforms**nn**Test key gives you:**n- Full soil analysis capabilitiesn- Crop recommendationsn- Weather datan- Environmental impact assessmentn- All free tier featuresnn---nn**Want higher limits or commercial use?** Get instant API keys via [Stripe checkout](https://buy.stripe.com/14A7sL30y8bR2F4fbgaMU02) (Starter: $49 Founder Pricing).

## 🎯 Strategic Vision: From AgTech to Universal Infrastructure

## 🚀 FREE TIER: NO API KEY NEEDED!nn**Immediate access with test key:** `leaf-test-370df0a2e62e`nn### ✅ Try It Now (No Waiting):nn1. **Use test key:** `leaf-test-370df0a2e62e`n2. **Immediate access** to all featuresn3. **No forms, no waiting, no approval**n4. **Works across all platforms**nn**Test key gives you:**n- Full soil analysis capabilitiesn- Crop recommendationsn- Weather datan- Environmental impact assessmentn- All free tier featuresnn---nn**Want higher limits or commercial use?** Get instant API keys via [Stripe checkout](https://buy.stripe.com/14A7sL30y8bR2F4fbgaMU02) (Starter: $49 Founder Pricing).

**Watch our 7-minute strategic expansion plan:**

[![LeafEngines Strategic Expansion](https://img.youtube.com/vi/bBHVLbh3tx0/0.jpg)](https://youtu.be/bBHVLbh3tx0)

### **The Strategic Pivot:**
LeafEngines is executing a calculated pivot from vertical AgTech to **horizontal infrastructure platform**. We're exploiting a critical global vulnerability: the fragility of satellite-based Positioning, Navigation, and Timing (PNT).

### **Core Mission:**
> **"Space gives the picture. We give the truth."**

### **Key Markets Identified:**
- **Disaster Response** - GPS-denied environments
- **Mining & Forestry** - Remote operations
- **Industrial Automation** - GPS-denied factories
- **Power Grids** - High-precision timing
- **Finance** - MiFID II-compliant timestamps
- **Defense/Intelligence** - Assured PNT in contested theaters

### **Our Advantage:**
- **Offline-first architecture** - Works anywhere, anytime
- **CIP Patent protection** - Inertial Dead Reckoning + Kalman logic
- **Community arbitrage** - Zero-CAC distribution through n8n/Node-RED/MCP
- **Quality transparency** - v3.0.0 confidence scoring & audit trails

### **The Vision:**
Transforming our core technology into a **foundational trust layer for autonomous physical AI** - the mandatory infrastructure for a world requiring GPS-independent verification.

### **💡 How to Use This Video (Developer Tool):**
This video serves as a **non-traditional sales and marketing tool** you can leverage:
- **Internal Stakeholder Alignment:** Share with your team to explain the strategic vision
- **Client Presentations:** Demonstrate the company behind the technology
- **Investor Briefings:** Show the $1.2T horizontal market opportunity
- **Community Building:** Educate other developers about the broader ecosystem

### **🎬 Cinematic Scene Guide:**
**Scene 1: Devices on Bench (0:45-1:15)** - Show hardware integration proof
**Scene 2: Developer Embedding (1:30-2:15)** - Demonstrate integration process
**Scene 3: Buy→Resell→Market (2:30-3:45)** - Explain business model
**Scene 4: Strategic Vision (4:00-5:30)** - Share market opportunity

### **🌐 The Offline AI Economy:**
**Read our philosophical manifesto:** [THE_OFFLINE_AI_ECONOMY.md](https://github.com/soilsidekick/leafengines/blob/main/THE_OFFLINE_AI_ECONOMY.md)

**Core Thesis:** "While much of the AI industry focuses on the size of cloud-based models, those models are unable to execute physical tasks without ground truth integrity."

**Three-Layer Solution:**
1. **Sensor Fusion** - Local dead reckoning without satellites
2. **Kalman Gate** - Uncertainty gating prevents database corruption
3. **Offline-First MCP** - Enables local AI decisions without cloud

**Business Model Revolution:**
- **Filtered Byte Pricing** - Charge for prevented corruption
- **Pay-Per-Agent Action** - Bill for successful high-value tasks
- **Outcome-Based Pricing** - Shift from access to utility

---

Access USDA soil data, EPA water quality, AI crop recommendations, carbon credit calculations, and environmental impact analysis directly in QGIS.

## Installation


## 🏷️ Pricing & International Support

LeafEngines Agricultural Intelligence Plugin supports users worldwide with localized pricing and payment options:

| Region | Starter (Monthly) | Pro (Monthly) | Local Payment Methods |
|--------|-------------------|---------------|----------------------|
| **United States** | $49 | $149 | Card, Apple Pay, Google Pay, Affirm |
| **European Union** | €45 (VAT incl.) | €135 (VAT incl.) | Klarna (DE), iDEAL (NL), EPS (AT), Apple/Google Pay |
| **United Kingdom** | £38 (VAT incl.) | £115 (VAT incl.) | Afterpay/Clearpay, Apple/Google Pay |
| **Australia** | AU$75 (GST incl.) | AU$225 (GST incl.) | Afterpay, Apple/Google Pay |
| **Other Countries** | $49 equivalent | $149 equivalent | Credit/Debit Cards, Apple/Google Pay |

**Free Tier Available:** Test with `x-free-tier: true` header or test key `leaf-test-370df0a2e62e`  
**Founder Pricing:** First 100 customers get lifetime pricing lock
### From ZIP (recommended during beta)

1. Download or build the plugin ZIP (see below)
2. In QGIS: **Plugins → Manage and Install Plugins → Install from ZIP**
3. Select the ZIP file
4. The plugin appears in the toolbar and under **Plugins → LeafEngines**

### Manual install

Copy the `qgis-leafengines` folder to your QGIS plugins directory:

```bash
# Linux / macOS
cp -r plugins/qgis-leafengines ~/.local/share/QGIS/QGIS3/profiles/default/python/plugins/leafengines

# Windows
xcopy /E plugins\qgis-leafengines %APPDATA%\QGIS\QGIS3\profiles\default\python\plugins\leafengines
```

Restart QGIS and enable the plugin via **Plugins → Manage and Install Plugins**.

## Configuration

1. Open the plugin dialog (toolbar icon or **Plugins → LeafEngines**)
2. Go to the **⚙ Settings** tab
3. Enter your API key (get one at [app.soilsidekickpro.com/api-keys](https://app.soilsidekickpro.com/api-keys))
4. Click **Save API Key**

Alternatively, set the `LEAFENGINES_API_KEY` environment variable.

## Features

| Tab       | Function                           | Output                               |
|-----      |----------                          |--------                              |
| 🌱 Soil   | County lookup + USDA soil analysis | Styled point layer (pH colour ramp)  |
| 💧 Water  | EPA water quality metrics.         | Point layer (green/yellow/red quality) |
| 🌾 Crops  | AI crop recommendations            | Text panel with planting advice.     |
| ♻ Carbon  | Carbon credit estimation.          | Text panel with credit values        |
| 🌍 Impact | Environmental impact scoring       | Point layer with risk attributes     |

### Map Click Tool

**Plugins → LeafEngines → Soil Query (Map Click)** — click anywhere on the US map to instantly query soil data at that location.

## Building the ZIP

```bash
cd plugins
zip -r leafengines-qgis-plugin.zip qgis-leafengines/ \
  -x "qgis-leafengines/__pycache__/*"
```

## API Tiers

| Tier      | Price     | Features                             |
|------     |-------    |----------                            | 
| Free      | $0        | Soil data, county lookup             |
| Starter.  | $149/mo   | + Water quality, planting calendar   |
| Pro       | $499/mo   | + AI recommendations, satellite, VRT |
| Enterprise| $1,999/mo | + Visual crop analysis, unlimited    |

## Requirements

- QGIS ≥ 3.22
- Internet connection (API calls)
- LeafEngines API key

## Support

- Documentation: [app.soilsidekick.com/api-docs](https://app.soilsidekick.com/api-docs)
- Issues: [github.com/leafengines/qgis-plugin/issues](https://github.com/leafengines/qgis-plugin/issues)
- Email: support@soilsidekickpro.com
