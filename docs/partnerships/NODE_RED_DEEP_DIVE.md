# LeafEngines™ × Node-RED Deep Dive

> **Audience:** Node-RED flow authors, IIoT integrators, ag-equipment OEMs, on-prem automation engineers
> **Repository target:** `node-red-contrib-leafengines` (npm) and the Node-RED flow library
> **Last updated:** 2026-04-16

---

## Why LeafEngines + Node-RED

Node-RED dominates the **edge and on-prem automation** space — irrigation controllers, weather stations, MQTT sensor fleets, SCADA bridges, and ISOBUS gateways. LeafEngines fills the **decision-intelligence gap** these flows usually outsource to brittle Python scripts: ground truth soil/water data, AI crop recommendations, ISOBUS-compliant prescription generation, and offline-capable plant ID via TurboQuant-quantized Gemma.

If your flow already speaks MQTT, Modbus, or OPC-UA, dropping in a LeafEngines node turns raw telemetry into actionable agronomy — without leaving the network perimeter for the analysis logic.

---

## Installation

### Option 1: Palette Manager (recommended)

1. Open Node-RED → **Menu → Manage palette → Install**
2. Search `node-red-contrib-leafengines`
3. Install
4. Restart not required

### Option 2: CLI

```bash
cd ~/.node-red
npm install node-red-contrib-leafengines
node-red-restart
```

### Option 3: Pure HTTP Request nodes (no install)

Every LeafEngines tool is a plain JSON POST — you can use the built-in `http request` node with zero dependencies. The contrib package just adds typed nodes, autocompletion, and credential management.

---

## Nodes Provided by `node-red-contrib-leafengines`

| Node | Category | Purpose |
|------|----------|---------|
| `leafengines-config` | config | Holds API key + tier; one per deployment |
| `leafengines-soil` | function | Get USDA soil profile by FIPS |
| `leafengines-water` | function | EPA territorial water quality |
| `leafengines-county` | function | Resolve name/lat-lon → FIPS |
| `leafengines-crop-ai` | function | AI crop recommendation (live) |
| `leafengines-carbon` | function | Carbon credit estimator |
| `leafengines-vrt` | function | Generate ISOBUS-compliant VRT export |
| `leafengines-plant-id` | function | Plant ID with toxic-lookalike warnings |
| `leafengines-mcp` | function | Generic MCP tool-call passthrough |

Every node accepts `msg.payload` overrides so you can drive parameters from upstream nodes (MQTT, dashboard, function).

---

## Quick Start: Soil Lookup Flow

Import this JSON via **Menu → Import**:

```json
[
  {"id":"trig","type":"inject","props":[{"p":"payload"}],"payload":"13121","payloadType":"str","topic":"fips","wires":[["soil"]]},
  {"id":"soil","type":"leafengines-soil","creds":"le-cfg","wires":[["dbg"]]},
  {"id":"dbg","type":"debug","name":"soil result","active":true},
  {"id":"le-cfg","type":"leafengines-config","tier":"starter","keyPrefix":"ak_starter"}
]
```

Click the inject button — you'll see Fulton County, GA soil data (pH 5.8, OM 2.1%, sandy loam) in the debug panel within 200ms.

---

## Reference Flows

### Flow 1: Irrigation Decision Engine

```
[MQTT in: soil/moisture/+] 
    → [function: extract field_id, moisture]
    → [leafengines-soil: get baseline AWC for field FIPS]
    → [function: compute deficit = AWC - moisture]
    → [switch: deficit > threshold]
        → [MQTT out: irrigation/zone/N/start]
    → [InfluxDB: log decision]
```

**Why this matters:** Generic moisture thresholds over-irrigate sandy soils and under-irrigate clay. Pulling LeafEngines' soil profile per zone gives you site-specific Available Water Capacity, typically cutting water use 20–35%.

### Flow 2: ISOBUS VRT Generation from SCADA

```
[OPC-UA: read field boundary + selected crop]
    → [leafengines-crop-ai: get N-P-K targets]
    → [leafengines-vrt: generate prescription map]
    → [function: extract ISO XML payload]
    → [file out: /var/lib/isobus/exports/]
    → [MQTT out: tractor/sync/ready]
```

Output is **ISO 11783 Part 10 compliant**, drag-and-drop ready for John Deere GS3/G4, Case IH AFS, AGCO Fendt One, and Trimble GFX displays.

### Flow 3: Foraging Safety Gate (offline-capable)

```
[Dashboard: image upload]
    → [leafengines-plant-id: mode='offline-first']
    → [switch: result.toxic_lookalikes.length > 0]
        → [Dashboard: red banner + lookalike images]
        → [Dashboard: green confirm + edibility notes]
    → [SQLite: log query]
```

When the LAN loses upstream connectivity, the offline-first node falls back to **Gemma-quantized local inference** (TurboQuant 3-bit KV cache) — meaning forager safety doesn't depend on cell signal in the woods.

### Flow 4: Multi-Tenant Carbon Reporting (agency pattern)

```
[Cron: weekly]
    → [Postgres: SELECT field_id, acres, fips, organic_matter FROM customer_fields]
        → [split]
            → [leafengines-carbon: per row]
        → [join: array]
    → [function: format ESG report]
    → [HTTP request: POST to client portal]
```

Pro tier handles ~25k credit calcs/day comfortably.

---

## Credential Configuration

The `leafengines-config` node stores the API key in Node-RED's encrypted credential store (never the flow JSON). Editor view:

| Field | Notes |
|-------|-------|
| API Key | Paste full key (`ak_starter_xxx...`) |
| Tier | Free / Starter / Pro / Enterprise — drives rate-limit hints |
| Endpoint Override | Leave blank for SaaS; set to private cloud URL for Enterprise on-prem |
| Default Timeout (ms) | 8000 recommended for AI nodes, 3000 for soil/water |
| Retry on 429 | ON (uses `Retry-After`) |

For Enterprise on-prem deployments, point `Endpoint Override` at your private cluster (e.g., `https://leafengines.internal.acme.farm`) — node behavior is otherwise identical.

---

## MQTT-First Patterns

Node-RED users typically have an MQTT broker as their backbone. Recommended topic conventions when bridging to LeafEngines:

```
leafengines/request/<correlation_id>      → outbound (your flow → broker)
leafengines/response/<correlation_id>     → inbound (LeafEngines node → broker)
leafengines/error/<correlation_id>        → error fanout
leafengines/audit/<tenant>/<tool>         → for compliance logging
```

The `leafengines-mcp` node automatically populates `msg.headers['x-correlation-id']` so end-to-end tracing through brokers, gateways, and tractor displays just works.

---

## Edge / Offline Considerations

Many Node-RED deployments run on Raspberry Pi, IoT2050, Moxa UC-8112, or industrial PCs with intermittent connectivity. The contrib package supports:

- **Local cache** — soil/county/water responses cached in flow context for `cacheTtl` ms (default 24h)
- **Queue-on-disconnect** — POSTs spool to disk while offline, drain on reconnect
- **Offline plant ID** — Gemma-quantized model bundled (~85MB) for `leafengines-plant-id` when `mode: 'offline-first'`
- **Dead-reckoning hook** — for moving equipment, the patented inertial positioning engine (US patent app #19/544,827) can be bridged in via the SDK; ask your account manager about the Embedded OS license

---

## Performance Notes

Tested on Raspberry Pi 4 (4GB), 100 Mbps WAN:

| Node | p50 | p95 | Notes |
|------|-----|-----|-------|
| `leafengines-soil` | 95ms | 220ms | FIPS cache hit ~30ms |
| `leafengines-county` | 110ms | 280ms | pg_trgm fuzzy match |
| `leafengines-crop-ai` | 1.2s | 3.4s | live LLM (GPT-5 router) |
| `leafengines-vrt` | 600ms | 1.8s | grows with field complexity |
| `leafengines-plant-id` (cloud) | 800ms | 2.1s | |
| `leafengines-plant-id` (offline) | 2.4s | 6.8s | Gemma-3B 3-bit on Pi 4 |

For sub-100ms inference on edge hardware, see the **OEM Embedded OS** doc — requires WebGPU-class accelerator (Jetson Orin, Coral TPU, Hailo-8).

---

## Security & Audit

- API key never appears in exported flow JSON (stored in `~/.node-red/flows_cred.json`, AES-encrypted)
- Every call logged to `mcp_tool_call_log` server-side with `tenant_id`, `correlation_id`, `tool_name`, `response_time_ms`, `success`
- Enterprise tier: 7-year audit retention, tamper-evident hash chain, SOC 2 Type II evidence package
- For air-gapped deployments, the Embedded OS variant ships with local audit-log shipping over MQTT/OPC-UA

---

## Common Pitfalls

1. **Forgetting `Accept: application/json, text/event-stream` on raw `http request` nodes calling `/mcp-server`** — you'll get HTTP 406. The contrib nodes set this automatically.
2. **Driving the AI nodes from a tight `inject` loop** — burns budget fast. Use `delay` node with rate limiting (e.g., 1 msg/sec).
3. **Storing the API key in `msg.payload`** — visible in debug nodes. Always use the credential field on the config node.
4. **Assuming offline plant ID matches cloud accuracy** — local Gemma is ~92% top-3 accuracy vs ~98% for the cloud ensemble. Use `confidence` field to gate.

---

## Roadmap (Q2–Q3 2026)

- Native **Modbus → LeafEngines** bridge node (read sensor → enrich with soil → write back to PLC tag)
- **OPC-UA Companion Spec** for AGRI/ISOBUS metadata
- **Kepware/Ignition** sample gateway flows
- Per-flow **cost preview** (estimated $/run before deploy)

---

## Support

- **npm:** `node-red-contrib-leafengines`
- **GitHub:** github.com/leafengines/node-red-contrib-leafengines
- **Issues:** edge@leafengines.com
- **Flow library:** flows.nodered.org/search?term=leafengines

---

© 2026 SoilSidekick Pro™ / LeafEngines™. Node-RED is a trademark of OpenJS Foundation.
