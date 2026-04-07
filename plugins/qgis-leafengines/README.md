# LeafEngines QGIS Plugin

Access USDA soil data, EPA water quality, AI crop recommendations, carbon credit calculations, and environmental impact analysis directly in QGIS.

## Installation

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

| Tab | Function | Output |
|-----|----------|--------|
| 🌱 Soil | County lookup + USDA soil analysis | Styled point layer (pH colour ramp) |
| 💧 Water | EPA water quality metrics | Point layer (green/yellow/red quality) |
| 🌾 Crops | AI crop recommendations | Text panel with planting advice |
| ♻ Carbon | Carbon credit estimation | Text panel with credit values |
| 🌍 Impact | Environmental impact scoring | Point layer with risk attributes |

### Map Click Tool

**Plugins → LeafEngines → Soil Query (Map Click)** — click anywhere on the US map to instantly query soil data at that location.

## Building the ZIP

```bash
cd plugins
zip -r leafengines-qgis-plugin.zip qgis-leafengines/ \
  -x "qgis-leafengines/__pycache__/*"
```

## API Tiers

| Tier | Price | Features |
|------|-------|----------|
| Free | $0 | Soil data, county lookup |
| Starter | $149/mo | + Water quality, planting calendar |
| Pro | $499/mo | + AI recommendations, satellite, VRT |
| Enterprise | $1,999/mo | + Visual crop analysis, unlimited |

## Requirements

- QGIS ≥ 3.22
- Internet connection (API calls)
- LeafEngines API key

## Support

- Documentation: [soilsidekick.com/api-docs](https://soilsidekick.com/api-docs)
- Issues: [github.com/leafengines/qgis-plugin/issues](https://github.com/leafengines/qgis-plugin/issues)
- Email: support@soilsidekickpro.com
