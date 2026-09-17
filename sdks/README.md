# @soilsidekick/sdk

> 🏆 **Global Startup Awards 2026 — North America Regional Nominee**

SoilSidekick Pro SDK — Agricultural Intelligence Platform.

**Current version:** `3.1.0` (adds Asset Management + WFS Export). See [CHANGELOG](../CHANGELOG.md).

## 📦 Installation

```bash
npm install @soilsidekick/sdk
```

## 🚀 Quick Start

```javascript
import { SoilSidekick } from '@soilsidekick/sdk';

const client = new SoilSidekick({
  apiKey: 'your-api-key'
});

// Get soil data for a location
const soilData = await client.getSoilData({
  latitude: 33.7490,
  longitude: -84.3880
});
```

## 🗂️ Asset Management (v3.1.0)

```javascript
// Create — supports idempotency
const asset = await client.assetsCrud.createAsset(
  { name: 'North Field', asset_type: 'polygon', geometry: {...} },
  { headers: { 'Idempotency-Key': 'field-north-2026' } }
);

// Update with optimistic locking
await client.assetsCrud.updateAsset(
  { id: asset.id },
  { name: 'North Field (renamed)' },
  { headers: { 'If-Match': String(asset.version) } }
);

// Soft delete
await client.assetsCrud.deleteAsset({ id: asset.id });
```

## 🌍 WFS Export (v3.1.0)

```javascript
// Public capabilities — no auth required
const caps = await client.wfsExport({ request: 'GetCapabilities' });

// GeoJSON FeatureCollection
const fc = await client.wfsExport({
  request: 'GetFeature',
  bbox: '-84.5,33.6,-84.3,33.8',
  limit: 500,
});
```

## 📚 API Reference

### Core Methods

#### `getSoilData(options)`
Retrieve comprehensive soil analysis for a location.

**Parameters:**
- `options.latitude` (number): Location latitude
- `options.longitude` (number): Location longitude
- `options.depth` (string, optional): Soil depth (default: "0-30cm")

**Returns:** `Promise<SoilAnalysis>`

#### `getWaterQuality(options)`
Retrieve EPA water quality data.

**Parameters:**
- `options.county` (string): County name
- `options.state` (string): State abbreviation

**Returns:** `Promise<WaterQualityReport>`

## 🔧 Configuration

### API Keys
1. Sign up at [SoilSidekick Pro](https://soilsidekick.com)
2. Generate API key in dashboard
3. Configure in your application

### Environment Variables
```bash
SOIL_SIDEKICK_API_KEY=your_api_key_here
```

## 📖 Examples

See the [examples directory]({{EXAMPLES_URL}}) for complete usage examples.

## 🤝 Contributing

We welcome contributions! Please see [CONTRIBUTING.md]({{CONTRIBUTING_URL}}) for details.

## 📄 License

## 📄 License

MIT License

Copyright (c) {{YEAR}} {{COMPANY_NAME}}

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

## 🔗 Related Packages

- [@ancientwhispers54/leafengines-mcp-server]({{MCP_URL}}) - AI agent integration
- [node-red-contrib-leafengines]({{NODE_RED_URL}}) - Node-RED automation
- [n8n-nodes-leafengines]({{N8N_URL}}) - n8n business automation

## 📞 Support

- Documentation: [docs.soilsidekick.com]({{DOCS_URL}})
- Issues: [GitHub Issues]({{ISSUES_URL}})
- Email: support@soilsidekick.com
