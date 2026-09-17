# @soilsidekick/sdk

> 🏆 **Global Startup Awards 2026 — North America Regional Nominee**

SoilSidekick Pro SDK — Agricultural Intelligence Platform API client.

## 📦 Installation

```bash
npm install @soilsidekick/sdk
```

## 🚀 Quick Start

```typescript
import { Configuration, AssetManagementApi, WFSExportApi } from '@soilsidekick/sdk';

const config = new Configuration({
  apiKey: 'ak_your_api_key_here',
  basePath: 'https://wzgnxkoeqzvueypwzvyn.supabase.co/functions/v1'
});

// Asset Management
const assets = new AssetManagementApi(config);
const { data } = await assets.listAssets();
console.log(data);

// WFS Export (GeoJSON)
const wfs = new WFSExportApi(config);
const featureCollection = await wfs.wfsExport({ request: 'GetFeature' });
console.log(featureCollection);
```

## 📚 API Coverage

### Soil Analysis
- `SoilAnalysisApi.getSoilData()` — USDA soil analysis by county
- `SoilAnalysisApi.getLiveAgriculturalData()` — Real-time NOAA/USDA/EPA data

### Water Quality
- `WaterQualityApi.getWaterQuality()` — EPA water quality by county
- `WaterQualityApi.getTerritorialWaterQuality()` — Territorial water analytics

### AI Services
- `AIServicesApi.agriculturalIntelligence()` — Multi-source agricultural insights
- `AIServicesApi.gpt5Chat()` — Conversational agricultural AI
- `AIServicesApi.seasonalPlanningAssistant()` — Planting calendars

### Asset Management (v3.1.0)
- `AssetManagementApi.listAssets()` — List managed assets
- `AssetManagementApi.createAsset()` — Create a new asset
- `AssetManagementApi.updateAsset()` — Update asset (optimistic locking via `If-Match`)
- `AssetManagementApi.deleteAsset()` — Soft-delete asset

### WFS Export (v3.1.0)
- `WFSExportApi.wfsExportGetCapabilities()` — OGC WFS Capabilities (no auth)
- `WFSExportApi.wfsExport()` — GeoJSON/GML feature export

### Consumer Plant Care
- `ConsumerPlantCareApi.safeIdentification()` — Toxic lookalike warnings
- `ConsumerPlantCareApi.dynamicCare()` — Hyper-localized care recommendations
- `ConsumerPlantCareApi.beginnerGuidance()` — Judgment-free plant guidance

## 🔧 Configuration

```typescript
const config = new Configuration({
  apiKey: 'ak_your_api_key_here',
  basePath: 'https://wzgnxkoeqzvueypwzvyn.supabase.co/functions/v1'
});
```

## 📖 Examples

See the [soil-sidekick-pro-guide repo](https://github.com/QWarranto/soil-sidekick-pro-guide) for complete examples.

## 🔗 Related Packages

- [@ancientwhispers54/leafengines-mcp-server](https://www.npmjs.com/package/@ancientwhispers54/leafengines-mcp-server) — AI agent integration
- [n8n-nodes-leafengines](https://www.npmjs.com/package/n8n-nodes-leafengines) — n8n automation
- [node-red-contrib-leafengines](https://www.npmjs.com/package/node-red-contrib-leafengines) — Node-RED integration

## 📄 License

MIT License — Copyright (c) 2026 LeafEngines™
