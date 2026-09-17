# QGIS Plugin v1.0.10 × SoilCertify — Pilot Evaluator Onboarding

> **Evaluator:** Faizan
> **Pilot ID:** `soilcertify-qgis-1.0.10`
> **Document status:** non-secret configuration sheet. **The API key is delivered separately — never paste it into this file, a ticket, a screenshot, or a log excerpt.**

---

## 1. Credential

An evaluator-specific temporary LeafEngines API key has been provisioned for this pilot.

| Property | Value |
|---|---|
| Key label (as it appears in logs) | `PILOT-EVAL-faizan-soilcertify-qgis` |
| Channel tag in logs | `qgis` |
| Access tier | `pro` (evaluation grant) |
| Auth mechanism | `x-api-key` request header (v1.0.10 behaviour; deprecated duplicate auth headers removed) |
| Rate limit | 10,000 requests / 60 minutes |
| Daily data-call quota | 25,000 calls / day (resets 00:00 UTC) |
| WFS access | **Enabled** |
| Asset read/write (`assets-crud`) | **Enabled** |
| Expiry (hard) | **2026-10-31 23:59:59 UTC** |
| Revocation | Immediate on final acceptance sign-off, or on request |

**Entry method:** QGIS → **LeafEngines panel → Settings → API Key**. The plugin also honours the
`LEAFENGINES_API_KEY` environment variable, but for this evaluation use the Settings field only —
it exercises the normal user workflow. Use the env-var path *only* if a rubric line item explicitly
requires verifying both methods; note which method was used in each evidence capture.

---

## 2. Endpoints and base URLs

| Purpose | URL |
|---|---|
| LeafEngines API base (embedded in frozen v1.0.10 plugin) | `https://wzgnxkoeqzvueypwzvyn.supabase.co/functions/v1` |
| Public/branded API base (curl, scripts, SDK) | `https://app.soilsidekickpro.com/api` |
| WFS base URL | `https://wzgnxkoeqzvueypwzvyn.supabase.co/functions/v1/wfs-export` |
| WFS feature type | `leafengines:managed_assets` |
| WFS version / CRS | WFS 2.0.0 · EPSG:4326 |
| WFS output formats | `geojson` (default), `gml` |

`GetCapabilities` is intentionally unauthenticated; `GetFeature` requires `x-api-key`.
Optional `GetFeature` params: `bbox=minLon,minLat,maxLon,maxLat`, `limit` (default 1000, max 5000).

---

## 3. Authorized functions for this key

Only the following are in scope for the acceptance rubric. Anything outside this list is
out of scope — do not treat a refusal elsewhere as a defect.

| Function | Notes |
|---|---|
| `county-lookup` | Body: `{ "term": "Travis" }` |
| `get-soil-data` | Body: `{ "county_name": "...", "state_code": "..", "county_fips": "#####" }` |
| `reverse-geocode` | Body: `{ "lat": 30.27, "lon": -97.74 }` |
| `territorial-water-quality` | County-scoped |
| `environmental-impact-engine` | County-scoped |
| `leafengines-query` | Plant/environment compatibility |
| `wfs-export` | `GetCapabilities` + `GetFeature` (GeoJSON/GML) |
| `assets-crud` | Asset list/create/update, scoped to the pilot account |
| `plugin-ping` | Health check (requires the plugin's own ping header) |

**Verified green at provisioning time (2026-08-08):** `county-lookup` 200,
`get-soil-data` 200, `reverse-geocode` 200, `wfs-export` GetCapabilities 200,
`wfs-export` GetFeature 200 (1 feature returned).

---

## 4. Regional scope: US reference test vs GB exploration

- **US (controlled reference test):** fully supported. Recommended reference target —
  Travis County, TX (`48453`). Soil data is USDA-SSURGO backed.
- **GB (exploration only):** county/FIPS-keyed endpoints are US-domain by design.
  GB coordinates may resolve through geocode/compatibility paths but **soil composition
  and water-quality coverage is not guaranteed**. GB results are exploratory evidence,
  not pass/fail criteria.

### Reporting "Not Tested — Access Not Available"

Use this verdict when an endpoint returns `401`, `403`, or a documented "coverage not
available" response for the region — not for network errors on your side. For each occurrence record:

1. Rubric line item ID
2. Function name and region (US / GB)
3. HTTP status + verbatim response body **with any key value redacted**
4. UTC timestamp (to the second) and the `request_id` from the response if present
5. Whether the same call succeeds for the US reference target

---

## 5. Reporting an authentication failure (without exposing the key)

If a call fails with `401`/`403`:

1. **Do not** paste the key, a screenshot of the Settings field, or an unredacted
   `curl` command anywhere.
2. Report only: the **key label** (`PILOT-EVAL-faizan-soilcertify-qgis`), the **first 8
   characters** of the key, the endpoint, the UTC timestamp, and the response body.
3. Send it to the pilot technical contact over the agreed private channel
   (direct message or the pilot's private issue tracker) — never a public issue,
   public repo, or group chat.
4. If you believe the key has been exposed anywhere, say **"suspected key exposure"**
   in the first line; the key will be revoked and reissued the same day.

Key rotation/reissue is a single operation on our side — asking for a fresh key is
always cheaper than working around a suspect one.

---

## 6. Quota and evidence-capture guidance

- Quotas are sized for repeat runs and screen/video capture; you do not need to conserve calls.
- Every call is logged against the evaluator key label, so runs are attributable and
  separable from production traffic in the endpoint activity reports.
- If you hit `429`, wait for the next 60-minute window and report it — that is a finding,
  not expected behaviour at this tier.

---

*LeafEngines™ | SoilSidekick Pro® | SoilCertify — pilot evaluation material, valid until 2026-10-31.*
