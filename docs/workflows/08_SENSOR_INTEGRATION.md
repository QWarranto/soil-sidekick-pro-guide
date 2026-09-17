# Workflow 8: Sensor Integration & Live Monitoring

> **Goal:** Connect soil sensors to SoilSidekick Pro for real-time field monitoring with automated alerts.
> **Time:** ~30 minutes | **Difficulty:** Advanced | **Tier:** Pro / Enterprise
> **Prerequisites:** Physical sensors installed; API key generated ([Workflow 9](09_API_EQUIPMENT_INTEGRATION.md))

---

## Video Overview

```
[VIDEO NARRATION — INTRO]
"Satellite data gives you the big picture. Soil sensors give you
ground truth. In this workflow, you'll connect physical sensors to
SoilSidekick Pro so you can monitor soil moisture, temperature, and
pH in real time from your dashboard."
```

---

## Step 1: Choose Compatible Sensors

### Professional IoT Sensors
| Sensor | Measures | Price Range |
|--------|----------|-------------|
| Davis Instruments WeatherLink | Weather + soil moisture | $500–$1,200 |
| Onset HOBO | Multi-parameter data logging | $300–$800 |
| Campbell Scientific | Research-grade stations | $2,000–$10,000 |
| Sentek Drill & Drop | Profile moisture (multiple depths) | $1,500–$3,000 |

### DIY / Budget Options
| Platform | Measures | Price Range |
|----------|----------|-------------|
| Arduino + DHT22 | Temperature, humidity | $20–$50 |
| Raspberry Pi + sensors | Custom monitoring | $50–$150 |
| ESP32 + soil probes | Wireless soil monitoring | $30–$80 |
| LoRaWAN sensor networks | Long-range field coverage | $100–$300/node |

### Requirements for all sensors:
- API or webhook output capability
- JSON/REST compatible data format
- Minimum: soil moisture + temperature (pH optional)
- Recommended: 15-minute or hourly data intervals

```
[VIDEO NARRATION]
"You have two paths: professional sensors for accuracy, or DIY setups
for cost-effective testing. Either way, the sensor needs to output JSON
data over an API or webhook — that's how SoilSidekick Pro connects to it."
```

---

## Step 2: Install Sensors

> ⚠️ **Safety First:** Call 811 before digging to locate underground utilities.

### Soil Sensor Placement
- **Depth:** 6–12 inches (root zone monitoring)
- **Location:** Representative area; avoid field edges, drainage channels, tree lines
- **Density:** 1 sensor per 10–20 acres recommended
- **Contact:** Ensure good soil-to-sensor contact; backfill carefully

### Weather Station Setup (if applicable)
- **Height:** 5–6 feet (standard measurement height)
- **Clearance:** No obstructions within 30 feet
- **Shield:** Use radiation shields for temperature/humidity sensors

```
[VIDEO NARRATION]
"Install your soil sensor 6–12 inches deep in a spot that represents
the typical conditions of your field. Avoid weird spots — not in a
drainage ditch, not under a tree, not on the edge where equipment turns.
You want average conditions."

[ON-SCREEN] Show a diagram of proper sensor placement depth and location.
```

---

## Step 3: Configure the Data Connection

### Option A: Webhook Integration (Recommended)
Your sensor pushes data to SoilSidekick Pro in real time.

**Endpoint:**
```
POST https://your-project.supabase.co/functions/v1/sensor-data
Headers:
  x-api-key: ak_your_api_key_here
  Content-Type: application/json
```

### Option B: Polling Integration
SoilSidekick Pro pulls data from your sensor's API on a schedule.

### Required Data Format:
```json
{
  "timestamp": "2026-03-06T14:30:00Z",
  "location": {
    "latitude": 40.7128,
    "longitude": -74.0060,
    "field_id": "north_field_1"
  },
  "soil_data": {
    "moisture_percent": 55.2,
    "temperature_c": 18.5,
    "ph": 6.8,
    "electrical_conductivity": 1.2
  },
  "weather_data": {
    "air_temperature_c": 24.1,
    "humidity_percent": 67,
    "wind_speed_mps": 3.2,
    "precipitation_mm": 0.0
  }
}
```

```
[VIDEO NARRATION]
"Configure your sensor to send data to SoilSidekick Pro's webhook
endpoint. You'll need your API key from Settings. The data format is
straightforward JSON — timestamp, location, and your sensor readings.
Most commercial sensors have a webhook configuration screen where you
just paste in the URL and API key."
```

---

## Step 4: Verify Data Flow

1. Go to your **Dashboard**.
2. Look for the **Soil Health Trends** chart.
3. Within one data interval (15 min or 1 hour), you should see live data points appearing.
4. Verify:
   - Timestamps are correct (UTC format)
   - Values are within expected ranges
   - Data is updating at the configured interval

### Troubleshooting:
| Issue | Fix |
|-------|-----|
| No data appearing | Check API key; verify JSON format matches spec |
| Wrong timestamps | Ensure sensor sends UTC timestamps |
| Inconsistent readings | Clean sensor contacts; check placement depth |
| Data gaps | Check network connectivity; verify sensor battery |

```
[VIDEO NARRATION]
"Give it one data interval — usually 15 minutes — then check your
dashboard. You should see live data points appearing in the Soil Health
Trends chart. If nothing shows up, the most common issue is an API key
mismatch or incorrect JSON format."
```

---

## Step 5: Set Up Automated Alerts

1. Go to **Settings → Notifications** (or the alert configuration panel).
2. Set thresholds for:

| Parameter | Alert When | Suggested Threshold |
|-----------|-----------|-------------------|
| Soil moisture | Falls below | 25% (drought stress) |
| Soil moisture | Exceeds | 85% (waterlogging risk) |
| Soil temperature | Falls below | 35°F / 2°C (frost risk) |
| pH | Changes by | ±0.5 from baseline |
| Battery | Falls below | 20% (sensor maintenance needed) |

3. Choose notification method: push notification, email, or SMS.

```
[VIDEO NARRATION]
"Set up alerts so the system tells you when something needs attention.
The moisture threshold is the most important — set it to alert you at
25% so you can irrigate before crops are stressed, not after."

[TRANSITION] "Your fields now have ground-truth sensors feeding live
data into SoilSidekick Pro alongside satellite intelligence. Next,
let's look at API and equipment integration."
```

---

## Step 6: Maintenance Schedule

| Frequency | Task |
|-----------|------|
| **Monthly** | Check battery levels, verify data transmission, clean weather station |
| **Quarterly** | Calibrate soil sensors against lab samples, update firmware |
| **Annually** | Replace batteries, inspect cables, update calibration constants |

---

## ✅ Workflow Checklist

- [ ] Sensors selected and purchased
- [ ] Physical installation completed safely (811 called)
- [ ] Webhook or polling integration configured
- [ ] Data flow verified on dashboard
- [ ] Alert thresholds set
- [ ] Maintenance schedule planned

---

## Next Steps

→ **Workflow 9:** [API & Equipment Integration](09_API_EQUIPMENT_INTEGRATION.md)
→ **Workflow 2:** [Satellite Monitoring](02_SATELLITE_FIELD_MONITORING.md) (combine with sensor data)
