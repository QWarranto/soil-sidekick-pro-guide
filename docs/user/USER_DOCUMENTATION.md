# User Documentation

**Last updated:** 2026-10-31
**Documentation revision:** October 31, 2026

## 1. SoilSidekick Pro, SoilCertify and LeafEngines

SoilSidekick Pro provides soil analysis, AI crop and planting recommendations, seasonal planning and environmental context. SoilCertify is a complementary soil/site-report offering. LeafEngines connects these services to mapping and other tools. Recommendations are agronomic guidance, not guaranteed yields, insurance coverage or verified claim outcomes.

## 2. Start and choose a plan

Open `https://app.soilsidekickpro.com`; use `/auth` for the available sign-in or account options. Hosted signup/provider/email settings were not reverified for this documentation revision. Public soil/county discovery is available through supported integrations; it does not unlock every paid tool.

| Audience | Plans |
|---|---|
| SoilSidekick Pro consumers (`/plans`) | Hobby $29/month, Grower $79/month, Pro $149/month |
| LeafEngines integrations (`/pricing`) | Free, Starter $149/month, Pro $499/month, Enterprise $1,999/month |

Confirm checkout and account entitlements before purchase; the two products' Pro plans are different.

## 3. Main pages

- **Dashboard:** soil results, source context and agricultural guidance.
- **Planting Calendar (`/planting-calendar`):** location/crop planting recommendations.
- **Seasonal Planning (`/seasonal-planning`):** seasonal crop/task guidance.
- **Field Mapping (`/field-mapping`):** field records and mapping.
- **Variable Rate Technology (`/variable-rate-technology`):** prescription drafts for review.
- **API keys (`/api-keys`):** keys for authorized integrations.

Available options depend on account, device and service availability. Do not infer a workflow from an older screenshot or undocumented menu.

## 4. Interpret the information

Published soil information can be county/regional context rather than your property's laboratory measurement. Satellite pixel size is not the precision of the complete report. Water data can be historical/cached station observations or estimates; a station distance is not necessarily distance to the closest stream or shoreline. Missing readings do not prove water safe. Confirm site-specific decisions with appropriate observations/testing and a qualified professional.

Crop and planting recommendations help prepare and compare options. VRT generation can return AI, predefined or uniform fallback drafts; zone geometry and exports are not validated equipment-ready prescriptions. Do not operate machinery using these drafts without qualified review and controller-specific checks.

## 5. AI and offline use

Local AI works only after supported models/runtime are available and initialized. Unsupported browsers, insufficient memory or missing assets can prevent responses. Hosted AI and new soil/water/satellite requests need internet access. Cached pages and some queued work may remain available offline; not every page/data result is guaranteed.

Queued writes require reconnect and successful synchronization. Do not assume repeat retries are always duplicate-safe. Unreliable positions must not be used for authoritative field records; position warnings are not proof that every save path has a complete integrity block.

Local generation runs on-device. Hosted analysis can send selected context to the hosted AI service; do not assume all conversations remain local.

## 6. Mapping integrations and keys

The QGIS plugin is documented at v1.0.10; verify the installed release through QGIS Plugin Manager. The recorded October 22 count was 1,010 downloads since April 5, 2026, with reach across 50+ countries; downloads are not unique users and this does not measure ArcGIS adoption.

Managed records support integration access and soft deletion; recovery periods are not guaranteed here. GIS output requires authorized keys and compatible imports. MCP, n8n, Node-RED, Telegram and SDK availability should be checked for each installed version. Never post your keys publicly.

## 7. Troubleshooting

| Problem | Check |
|---|---|
| Sign-in/key rejected | Correct account/app. host and issued credential; do not share the key |
| Offline result unavailable | Reconnect; confirm the model/pages were cached and initialized |
| Queued work not saved | Preserve the entry and inspect sync status before repeating creates |
| Position uncertain | Obtain a reliable fix and verify the record before authoritative use |
| VRT fallback or invalid zones | Treat as review-required; do not operate equipment from it |
| Water/satellite data incomplete | Check source dates, coverage and fallback information |
| Asset version conflict | Fetch the latest record, reconcile changes and retry deliberately |

## 8. Privacy, accessibility and support

Use actual account privacy/export/deletion options or the approved support channel to request assistance. Retention, processing obligations and accessibility assurance are governed by verified policies and applicable law, not a universal claim in this guide.

See [API Documentation](/docs/api/api-documentation), [Developer Specifications](/docs/sdk/developer-specifications) and [Compliance and Legal](/docs/compliance/compliance-legal). This revision updates guidance; it does not certify the application or implement the outstanding safety controls.
