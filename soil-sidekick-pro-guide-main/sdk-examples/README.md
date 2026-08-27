# SoilSidekick Pro SDK v2.2 Example Code Collection

## Overview
This repository contains executable code examples for the SoilSidekick Pro SDK v2.2 (LeafEngines), including:
- All 18 existing REST endpoints from the OpenAPI specification
- 5 new sensor endpoints for Skyline mmWave sensor integration
- MQTT connection examples for AWS IoT Core and HiveMQ
- WebSocket streaming client in TypeScript and Python
- Sensor data ingestion pipeline walkthrough
- ADAPT 1.0 prescription map import/export examples
- ISOBUS task chaining examples
- Multi-language SDK examples for industrial integration

## Base URLs
- **Production:** `https://wzgnxkoeqzvueypwzvyn.supabase.co/functions/v1`
- **Developer Sandbox:** `https://sandbox.leafengines.com/developer-sandbox`
- **Local Development:** `http://localhost:54321/functions/v1`

## Authentication

### API Key Authentication (B2B/SDK)
```bash
curl -X POST https://sandbox.leafengines.com/developer-sandbox/get-soil-data \
     -H "x-api-key: ak_your_api_key_here" \
     -H "Content-Type: application/json" \
     -d '{"county_fips": "48453", "county_name": "Travis County", "state_code": "TX"}'
```

### JWT Authentication (User Sessions)
```bash
curl -X POST https://sandbox.leafengines.com/developer-sandbox/agricultural-intelligence \
     -H "Authorization: Bearer YOUR_JWT_TOKEN" \
     -H "Content-Type: application/json" \
     -d '{"query": "What crops grow best here?", "context": {"county_fips": "48453"}}'
```

## Existing REST Endpoints (18 Total)

### 1. Soil Analysis Endpoints
1. **`POST /get-soil-data`** - County-level SSURGO soil analysis
2. **`POST /multi-parameter-planting-calendar`** - Planting calendar with climate and soil factors
3. **`POST /live-agricultural-data`** - Real-time agricultural data

### 2. Geographic Endpoints
4. **`POST /county-lookup`** - Search counties by name, state, or FIPS code

### 3. Water Quality Endpoints
5. **`POST /territorial-water-quality`** - Water quality metrics for a county
6. **`POST /territorial-water-analytics`** - Territorial water quality analytics

### 4. Environmental Endpoints
7. **`POST /environmental-impact-engine`** - Runoff risk & environmental assessment
8. **`POST /alpha-earth-environmental-enhancement`** - Satellite vegetation indices

### 5. AI Services Endpoints
9. **`POST /agricultural-intelligence`** - AI-powered agricultural Q&A
10. **`POST /seasonal-planning-assistant`** - Seasonal planning recommendations
11. **`POST /smart-report-summary`** - Smart report generation

### 6. VRT & Carbon Endpoints
12. **`POST /carbon-credit-calculator`** - Carbon credit estimation
13. **`POST /generate-vrt-prescription`** - VRT prescription generator

### 7. LeafEngines Endpoints
14. **`POST /leafengines-query`** - LeafEngines plant compatibility API

### 8. Consumer Plant Care Endpoints
15. **`POST /safe-identification`** - Plant ID with toxic lookalike warnings
16. **`POST /dynamic-care`** - Hyper-localized care recommendations
17. **`POST /beginner-guidance`** - Judgment-free plant help

### 9. Visual Analysis Endpoints
18. **`POST /visual-crop-analysis`** - Visual crop analysis

## New Sensor Endpoints (5 Total)

### 19. **`POST /sensor-data-ingestion`** - Sensor data ingestion pipeline
### 20. **`POST /sensor-correlation-engine`** - mmWave ↔ environmental correlation
### 21. **`POST /sensor-websocket-gateway`** - Real-time WebSocket streaming
### 22. **`POST /mqtt-bridge`** - MQTT bridge for Skyline devices
### 23. **`POST /environmental-hazard-dashboard`** - Environmental hazard dashboard

## Directory Structure

```
sdk-examples/
├── README.md                          # This file
├── curl/                              # curl examples for all endpoints
├── python/                            # Python SDK examples
├── javascript/                        # JavaScript/Node.js examples
├── typescript/                        # TypeScript examples
├── mqtt/                              # MQTT connection examples
├── websocket/                         # WebSocket streaming examples
├── sensor-pipeline/                   # Sensor data ingestion examples
├── adapt-isobus/                      # ADAPT/ISOBUS examples
└── ci-validation/                     # CI validation scripts
```

## Quick Start

### Python Examples
```bash
cd python
pip install -r requirements.txt
python 01_get_soil_data.py
```

### JavaScript Examples
```bash
cd javascript
npm install
node 01_get_soil_data.js
```

### TypeScript Examples
```bash
cd typescript
npm install
npm run build
node dist/01_get_soil_data.js
```

### MQTT Examples
```bash
cd mqtt
npm install
node aws_iot_core_example.js
```

### WebSocket Examples
```bash
cd websocket
npm install
node websocket_client.js
```

## Rate Limiting

All responses include rate limiting headers:
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1642694400
X-Tier: pro
```

## Response Time SLAs

All endpoints return response time headers:
```
X-Response-Time: 245ms
X-Response-Time-Ms: 245
X-Response-Time-Target: 500ms
X-Response-Time-Max: 1500ms
X-Response-Time-Status: optimal
```

## Error Handling

All examples include comprehensive error handling for:
- Authentication failures (401)
- Tier restrictions (403)
- Rate limiting (429)
- Invalid input (400)
- Server errors (500)

## CI Validation

All examples are validated in CI using:
```bash
cd ci-validation
./validate_all_examples.sh
```

## Support

- **Developer Sandbox:** `/developer-sandbox`
- **Swagger UI:** `/swagger-ui`
- **Postman Collection:** `/postman/leafengines-collection.json`
- **Support:** support@soilsidekickpro.com
- **Security Issues:** admin@soilsidekickpro.com

## License

These examples are provided under the MIT License for educational and integration purposes.

## Contributing

Please submit issues and pull requests for any improvements or additional examples needed.