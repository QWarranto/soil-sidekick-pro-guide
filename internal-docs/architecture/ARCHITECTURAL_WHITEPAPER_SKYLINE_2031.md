# SoilSidekick Pro / LeafEngines™
## Architectural White Paper: From Consumer Intelligence to Industrial-Grade Environmental Substrate

**Skyline Instruments Edition — 500 TPM to 10,000 TPM and Beyond**

**Version:** 1.0  
**Date:** July 2026  
**Classification:** Internal Strategic Document  

---

## 1. Executive Summary

LeafEngines™ began as SoilSidekick Pro — a consumer-grade agricultural intelligence platform delivering soil analysis, crop recommendations, and environmental scoring through a React/TypeScript frontend backed by Supabase. The original architecture was optimized for ~500 transactions per minute (TPM): a SaaS web application serving individual growers and hobbyists with moderate concurrency, coarse-grained caching, and cloud-dependent inference.

This paper traces the architectural evolution required to meet **Skyline Instruments' industrial hardware standard of 10,000 TPM**, and maps the path to the **2031 Platform Horizon** (Track S). The 2031 vision decouples the platform from proprietary cloud primitives, containerizes the runtime, adopts post-quantum cryptography, and integrates Agent2Agent (A2A) and Model Context Protocol (MCP) infrastructure for autonomous, domain-specific AI orchestration.

The transition is not a forklift upgrade. It is a factored migration: each track (L, T, D, Q, A, S) delivers incremental capability while preserving backward compatibility for existing SDK clients, OEM devices, and telecom edge nodes.

---

## 2. Original Architecture: Consumer Grade (circa 2025–2026)

### 2.1 Design Constraints

The original platform was built under three constraints:

1. **Speed to market**: React + Vite frontend, Supabase managed backend, Deno edge functions.
2. **Cost sensitivity**: Per-query GPT-4 calls for agricultural intelligence; caching at county/state/regional levels.
3. **Connectivity assumption**: Users have intermittent but functional internet; offline AI is a premium feature, not the default.

### 2.2 Performance Envelope

| Metric | Target | Actual | Bottleneck |
|--------|--------|--------|------------|
| Peak throughput | ~500 TPM | ~200–300 TPM | Supabase connection pool + GPT-4 latency |
| API response (cached) | <500ms | 800–1200ms | Cold edge function starts |
| API response (soil data) | <1500ms | 1500–3000ms | External USDA/EPA API round-trips |
| AI inference (cloud) | <3000ms | 2000–8000ms | OpenAI token generation |
| AI inference (offline) | <100ms | 50–90ms | WebGPU Gemma 2B — limited to capable browsers |
| Concurrent users (stress) | 100 VUs | 80 VUs before 429s | Rate limits + connection pool |

### 2.3 Architectural Diagram

```
                    ├──────────────────────────────────────────────────────┐
                    │     SoilSidekick Pro Consumer Architecture       │
                    ├──────────────────────────────────────────────────────┤
                    │                                                    │
┌─────────────────────────────────────────────────────────────────────┤
│  LAYER 3: CLIENT                                                       │
│  ┌──────────────────┐ ┌──────────────────┐ ┌──────────────────┐     │
│  │ React 18.3 +     │ │ Vite Build       │ │ Tailwind +       │     │
│  │ TypeScript       │ │ System           │ │ Shadcn/ui        │     │
│  └──────────────────┘ └──────────────────┘ └──────────────────┘     │
│         │              │              │              │                │
│         ▼              ▼              ▼              ▼                │
│  ┌─────────────────────────────────────────────────────────────────────┘
│  Hybrid AI Inference Chain                                              │
│  ┌────────────────┐  ┌────────────────┐  ┌────────────────┐             │
│  │ 1. WebGPU        │  │ 2. WASM          │  │ 3. Cloudflare    │             │
│  │    Gemma 2B       │  │    (Degraded)   │  │    Workers AI     │             │
│  │    <100ms         │  │    300-800ms     │  │    (Fallback)     │             │
│  └────────────────┘  └────────────────┘  └────────────────┘             │
└─────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼ TLS 1.3
┌─────────────────────────────────────────────────────────────────────┐
│  LAYER 2: SUPABASE BACKEND                                             │
│  ┌─────────────────────────────────────────────────────────────────────┘
│  ┌────────────────┐  ┌────────────────┐  ┌────────────────┐             │
│  │ PostgreSQL + RLS │  │ Supabase Auth    │  │ Edge Functions   │             │
│  │ (Managed)        │  │ (JWT tokens)     │  │ (Deno Runtime)   │             │
│  └────────────────┘  └────────────────┘  └────────────────┘             │
│         │                    │                    │                    │
│         ▼                    ▼                    ▼                    │
│  ┌────────────────┐  ┌────────────────┐  ┌────────────────┐             │
│  │ subscribers      │  │ soil_analyses    │  │ api_keys         │             │
│  │ counties         │  │ security_audit   │  │ usage_analytics  │             │
│  └────────────────┘  └────────────────┘  └────────────────┘             │
└─────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────┐
│  LAYER 1: EXTERNAL DATA SOURCES                                        │
│  ┌────────────────┐  ┌────────────────┐  ┌────────────────┐             │
│  │ EPA Water Quality│  │ USDA Soil Data   │  │ OpenAI GPT-4     │             │
│  │ Portal           │  │ (SSURGO/STATSGO)│  │ (Cloud AI)       │             │
│  └────────────────┘  └────────────────┘  └────────────────┘             │
└─────────────────────────────────────────────────────────────────────┘
```

### 2.4 Core Components

- **Frontend**: React 18.3 + Vite + Tailwind + Shadcn/ui. Hybrid inference via Hugging Face Transformers.js with WebGPU → WASM → Cloudflare Workers AI fallback chain.
- **Backend**: Supabase PostgreSQL with Row-Level Security (RLS). Edge functions in Deno for business logic.
- **Auth**: Supabase Auth JWT tokens + encrypted API keys (`ak_*` prefix).
- **AI**: GPT-4 for agricultural intelligence (cloud); Gemma 2B/7B ONNX for offline diagnosis.
- **Caching**: Four-level hierarchy (county 1hr → state 6hr → regional 24hr → national 7 days).

### 2.5 Why 500 TPM Was the Ceiling

Three factors hard-capped throughput:

1. **GPT-4 dependency**: Agricultural intelligence calls are blocking, expensive, and rate-limited by OpenAI. Each call can consume 2–8 seconds.
2. **Connection pooling**: Supabase PostgreSQL connection limits (typically ~60–120 concurrent connections) saturate under burst load.
3. **Cold starts**: Deno edge functions incur 200–600ms cold start latency on first invocation per region.

---

## 3. Current Architecture v2.1 (February 2026)

By Q1 2026, the platform expanded into B2B channels, multi-language SDKs, OEM partnerships, and a private 5G telecom integration layer. The architecture retained its Supabase backbone but added significant surface area.

### 3.1 New Components

| Component | Purpose | Track |
|-----------|---------|-------|
| `assets-crud` | Managed agricultural assets (points, polygons, sensors) | A |
| `wfs-export` | OGC WFS 2.0 server for QGIS/ArcGIS integration | Q |
| `telegram-webhook` | Bot command handler for Telegram channel | T |
| `api-key-management` | `x-api-key` auth, tier-based rate limiting | L |
| `cost-monitoring` | Metered billing prep, dual-meter (ai_count / data_count) | L |
| Bigfoot Blueprint | Planetary directory schema (8 tables, 3 cron jobs) | D |
| OEM Embedded OS | ARM Cortex-A72 / NVIDIA Jetson runtime | S |
| Private 5G Edge | MEC node runtime, MQTT 10,000 msg/min | S |

### 3.2 Architectural Diagram v2.1

```
┌─────────────────────────────────────────────────────────────────────┐
│              LeafEngines™ B2B Platform v2.1 (February 2026)            │
├─────────────────────────────────────────────────────────────────────┤
│  CHANNEL LAYER                                                          │
│  ┌────────────────┐  ┌────────────────┐  ┌────────────────┐  ┌────────────────┐   │
│  │   Web App      │  │   Telegram     │  │   QGIS         │  │   SDK Clients  │   │
│  │   (React/Vite) │  │   Bot          │  │   Plugin       │  │   (6 Languages)│   │
│  └────────────────┘  └────────────────┘  └────────────────┘  └────────────────┘   │
│         │                │                │                │                │
│         └──────────────────────────────────────────────────────────┘                │
│                                    │                                      │
├─────────────────────────────────────────────────────────────────────┤
│  API GATEWAY + AUTH LAYER                                              │
│  ┌─────────────────────────────────────────────────────────────────────┘
│  ┌────────────────┐  ┌────────────────┐  ┌────────────────┐             │
│  │  x-api-key      │  │  Rate Limiter   │  │  Tier Enforcer  │             │
│  │  (ak_*)         │  │  (per-key)      │  │  (Free/Pro/Ent) │             │
│  └────────────────┘  └────────────────┘  └────────────────┘             │
│         │                │                │                            │
├─────────────────────────────────────────────────────────────────────┤
│  EDGE FUNCTION LAYER (Deno / Supabase)                                 │
│  ┌────────────────┐  ┌────────────────┐  ┌────────────────┐  ┌────────────────┐   │
│  │ agricultural-  │  │ assets-crud    │  │ wfs-export     │  │ telegram-      │   │
│  │ intelligence   │  │ (Track A)      │  │ (Track Q)      │  │ webhook        │   │
│  │ (GPT-4)        │  │                │  │ (OGC WFS 2.0)  │  │ (Track T)      │   │
│  └────────────────┘  └────────────────┘  └────────────────┘  └────────────────┘   │
│  ┌────────────────┐  ┌────────────────┐  ┌────────────────┐             │
│  │ cost-monitoring│  │ api-key-mgmt   │  │ health-monitor │             │
│  │ (dual-meter)   │  │ (Track L)      │  │ (Track L)      │             │
│  └────────────────┘  └────────────────┘  └────────────────┘             │
├─────────────────────────────────────────────────────────────────────┤
│  DATA LAYER (Supabase PostgreSQL)                                      │
│  ┌────────────────┐  ┌────────────────┐  ┌────────────────┐  ┌────────────────┐   │
│  │ subscribers      │  │ managed_assets │  │ Bigfoot        │  │ api_keys       │   │
│  │ soil_analyses    │  │ (Track A)      │  │ Blueprint      │  │ (encrypted)    │   │
│  │ counties         │  │ asset_history  │  │ (Track D)      │  │ usage_analytics│   │
│  └────────────────┘  └────────────────┘  └────────────────┘  └────────────────┘   │
└─────────────────────────────────────────────────────────────────────┘
                                    │
┌─────────────────────────────────────────────────────────────────────┐
│  OEM + TELECOM EDGE (Track S)                                           │
│  ┌────────────────┐  ┌────────────────┐  ┌────────────────┐             │
│  │ ARM Cortex-A72 │  │ NVIDIA Jetson  │  │ Private 5G     │             │
│  │ + ONNX Runtime │  │ + TensorRT     │  │ MEC + MQTT     │             │
│  │ (Offline AI)   │  │ (Edge AI)      │  │ (10K msg/min)  │             │
│  └────────────────┘  └────────────────┘  └────────────────┘             │
└─────────────────────────────────────────────────────────────────────┘
```

### 3.3 Rate Limiting by Tier

| Tier | Per Minute | Per Hour | Per Day |
|------|------------|----------|---------|
| Free | 10 | 100 | 1,000 |
| Starter | 30 | 500 | 5,000 |
| Pro | 100 | 2,000 | 25,000 |
| Enterprise | 500 | 10,000 | 100,000 |
| OEM Runtime | Per-device | Per-device | Per-device |

Enterprise tier peaks at **500 TPM per key** — still an order of magnitude below Skyline's 10,000 TPM requirement.

### 3.3 SDK v3.1.0 Surface

Auto-generated from OpenAPI specification across six languages (TypeScript, Python, Go, Ruby, Java, PHP). The SDK encapsulates:

- `x-api-key` header authentication
- Automatic retry with exponential backoff
- Rate limit header parsing (`X-RateLimit-*`)
- Asset CRUD + WFS export methods

---

## 4. The Skyline Instruments Threshold: 10,000 TPM

### 4.1 What 10,000 TPM Means

Skyline Instruments builds precision measurement hardware for industrial agriculture. Their integration requirements are:

- **Sustained throughput**: 10,000 transactions per minute (~167 TPS) across a fleet of 500–2,000 field devices.
- **Latency**: <100ms for safety-critical alerts; <500ms for standard soil data queries.
- **Offline resilience**: Devices operate in disconnected environments for hours or days.
- **Regulatory grade**: Data integrity must withstand audit, litigation, and carbon credit verification.

### 4.2 Gap Analysis

| Requirement | Current State | Gap |
|-------------|---------------|-----|
| 10,000 TPM sustained | ~500 TPM per enterprise key; ~2,000 TPM aggregate | **5× single-key; 5× aggregate** |
| <100ms p99 latency | 800–1200ms (cold start) for edge functions | **10× improvement needed** |
| Offline-first | WebGPU only in capable browsers; no embedded runtime | **Needs ARM/edge-native ONNX** |
| Cloud independence | Deep Supabase coupling (Auth, DB, Edge Functions, Storage) | **Containerization required** |
| Audit-grade integrity | RLS + audit logs; no cryptographic provenance | **PQC signing + verifiable credentials** |

### 4.3 Factoring Strategy

Rather than replacing the entire stack, the migration factors along three axes:

1. **Compute factoring**: Move from Supabase-managed edge functions to containerized, horizontally scalable runtimes (Kubernetes / Nomad / K3s).
2. **Data factoring**: Decouple from Supabase PostgreSQL to portable, open-source databases (PostgreSQL, Cassandra, or CockroachDB) with multi-region replication.
3. **AI factoring**: Replace blocking GPT-4 calls with domain-specific, quantized models running on-device or at the edge. GPT-4 becomes a fallback, not the primary path.

---

## 5. Transition Architecture: Industrial Grade (2026–2028)

### 5.1 Target State

```
┌─────────────────────────────────────────────────────────────────────┐
│                        LeafEngines™ Industrial Platform              │
├─────────────────────────────────────────────────────────────────────┤
│  Layer 4: Autonomous Agent Mesh (A2A + MCP)                        │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐                │
│  │ Soil Agent  │  │ Carbon Agent│  │ Fleet Agent │                │
│  └─────────────┘  └─────────────┘  └─────────────┘                │
├─────────────────────────────────────────────────────────────────────┤
│  Layer 3: API Gateway + Inference Runtime                          │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐    │
│  │  Containerized  │  │  Domain-Specific│  │   Post-Quantum  │    │
│  │  Edge Functions │  │  ONNX Models    │  │   Auth (ML-DSA) │    │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘    │
├─────────────────────────────────────────────────────────────────────┤
│  Layer 2: Data Fabric                                              │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐    │
│  │  PostgreSQL     │  │  Time-Series    │  │  Object Store   │    │
│  │  (CockroachDB)  │  │  (TimescaleDB)  │  │  (MinIO/S3)     │    │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘    │
├─────────────────────────────────────────────────────────────────────┤
│  Layer 1: OEM + Telecom Edge                                       │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐    │
│  │  ARM Cortex-A72 │  │  NVIDIA Jetson  │  │  Private 5G MEC │    │
│  │  + ONNX Runtime │  │  + TensorRT     │  │  + K3s Node     │    │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘    │
└─────────────────────────────────────────────────────────────────────┘
```

### 5.2 Compute Layer: From Edge Functions to Containers

| Current | Transition | Target |
|---------|------------|--------|
| Supabase Deno edge functions | Docker containers (Deno/Node) | OCI-compliant containers on K3s/K8s |
| Cold starts 200–600ms | Warm pools via container orchestration | <50ms startup via pre-warmed pods |
| Single-region deployment | Multi-region replicas | Geo-distributed with anycast |
| Vendor-locked (Supabase) | Portable IaC (Terraform/Pulumi) | Cloud-agnostic, bare-metal capable |

### 5.3 AI Layer: From GPT-4 to Domain-Specific Models

| Current | Transition | Target |
|---------|------------|--------|
| GPT-4 blocking calls | Fine-tuned open-source LLMs (Llama 3, Mistral) | Quantized domain models (2–7B params) |
| 2–8s latency | 500–1500ms via vLLM/TGI | <100ms on-device via TensorRT/ONNX |
| $0.05–$0.20/query | Self-hosted inference | $0.001/query marginal cost |
| Cloud-only fallback | Edge + cloud hybrid | Offline-first, cloud-sync optional |

### 5.4 Data Layer: From Managed PostgreSQL to Data Fabric

| Current | Transition | Target |
|---------|------------|--------|
| Supabase PostgreSQL | Self-managed PostgreSQL + read replicas | CockroachDB or YugabyteDB (distributed SQL) |
| RLS policies | Application-level authorization | Zero-trust with SPIFFE/SPIRE identity |
| Audit logs in Supabase | Streaming audit to immutable store | Blockchain-anchored audit trails |
| 7-day caching | Redis Cluster + CDN | Multi-tier cache with cache-aside pattern |

### 5.5 Throughput Projection

| Phase | Year | Peak TPM | Architecture |
|-------|------|----------|--------------|
| Baseline | 2025 | 500 | Supabase edge functions + GPT-4 |
| Current | 2026 | 2,000 | SDK v3.1, multi-channel, dual-meter |
| Transition | 2027 | 5,000 | Containerized inference, model quantization |
| Industrial | 2028 | 10,000+ | K3s edge clusters, domain-specific models, PQC auth |

---

## 6. 2031 Platform Horizon: Track S

Track S defines the strategic engineering roadmap for the five-year horizon (2026–2031). It is informed by three converging forces:

1. **Post-quantum cryptography**: NIST FIPS 203/204/205 mandate; ECDSA deprecated by 2030.
2. **Agentic AI**: Gartner predicts 90% of generative AI will use domain-specific models by 2030.
3. **Spatial + edge computing**: 79.4 zettabytes of IIoT data annually; processing must move to the edge.

### 6.1 Post-Quantum Cryptographic Preparedness

| Standard | Purpose | Timeline |
|----------|---------|----------|
| FIPS 203 (ML-KEM/Kyber) | Key encapsulation | Deploy by 2028 |
| FIPS 204 (ML-DSA/Dilithium) | Digital signatures | Deploy by 2028 |
| FIPS 205 (SLH-DSA/Falcon) | State-based signatures | High-assurance credentials |

**Impact on LeafEngines**:

- All `ak_*` API keys transition to hybrid classical+PQC signatures.
- OEM device certificates (currently mTLS/ECDSA) rotate to Dilithium.
- Verifiable credentials for carbon credit provenance use PQC-signed DIDs.
- Payload size increases: ML-DSA signatures are ~3KB vs 64B ECDSA. Transport compression and batching required.

### 6.2 Agentic Infrastructure: MCP + A2A

The platform evolves from a request-response API to an agent-native substrate.

**Model Context Protocol (MCP)** standardizes how domain-specific agents (soil, carbon, fleet) connect to tools, databases, and sensors. Each LeafEngines capability becomes an MCP server:

- `mcp-server-soil`: Soil analysis tools, USDA data sources
- `mcp-server-carbon`: Carbon credit verification, MRV workflows
- `mcp-server-fleet`: Real-time positioning, autonomous path planning

**Agent2Agent (A2A)** enables cross-organizational agent collaboration. A Skyline Instruments field agent can negotiate with a carbon credit verifier agent without exposing internal memory or prompts.

### 6.3 Cloud-Agnostic, Composable Runtime

By 2031, the platform must deploy identically on:

- AWS / GCP / Azure (hyperscaler)
- On-premises bare metal (enterprise data center)
- Private 5G MEC nodes (telecom edge)
- OEM ARM devices (field hardware)

This requires:

- **Containerization**: All services packaged as OCI images.
- **Kubernetes substrate**: K3s for resource-constrained edge; standard K8s for cloud.
- **API-first contracts**: OpenAPI specs as the source of truth; code generated from spec.
- **Multi-cloud IaC**: Terraform/Pulumi templates parameterized by target environment.

### 6.4 2031 Platform Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│           LeafEngines™ 2031 Platform Horizon (Track S)                 │
├─────────────────────────────────────────────────────────────────────┤
│  LAYER 5: AUTONOMOUS AGENT MESH (A2A + MCP)                           │
│  ┌────────────────┐  ┌────────────────┐  ┌────────────────┐  ┌────────────────┐   │
│  │  Soil Agent    │  │ Carbon Agent  │  │ Fleet Agent   │  │ Supply Chain  │   │
│  │  (MCP Server)  │  │ (MCP Server)  │  │ (MCP Server)  │  │ Agent (A2A)   │   │
│  └────────────────┘  └────────────────┘  └────────────────┘  └────────────────┘   │
│         │                │                │                │                │
│         └──────────────────────────────────────────────────────────┘                │
│                              │                                         │
├─────────────────────────────────────────────────────────────────────┤
│  LAYER 4: API GATEWAY + INFERENCE RUNTIME                              │
│  ┌────────────────┐  ┌────────────────┐  ┌────────────────┐             │
│  │  Containerized  │  │  Domain-Specific│  │  Post-Quantum  │             │
│  │  Edge Functions │  │  ONNX Models    │  │  Auth (ML-DSA) │             │
│  │  (OCI/K3s)      │  │  (Quantized)   │  │  + SPIFFE/SPIRE│             │
│  └────────────────┘  └────────────────┘  └────────────────┘             │
│         │                │                │                            │
├─────────────────────────────────────────────────────────────────────┤
│  LAYER 3: DATA FABRIC                                                  │
│  ┌────────────────┐  ┌────────────────┐  ┌────────────────┐             │
│  │  Distributed   │  │  Time-Series    │  │  Object Store   │             │
│  │  SQL            │  │  (TimescaleDB)  │  │  (MinIO/S3)     │             │
│  │  (CockroachDB)  │  │  + IoT Streams  │  │  + IPFS Backup  │             │
│  └────────────────┘  └────────────────┘  └────────────────┘             │
│         │                │                │                            │
├─────────────────────────────────────────────────────────────────────┤
│  LAYER 2: EDGE COMPUTE NODES                                           │
│  ┌────────────────┐  ┌────────────────┐  ┌────────────────┐             │
│  │  Private 5G    │  │  MEC K3s       │  │  Telecom Edge   │             │
│  │  Base Station  │  │  Cluster       │  │  (Verizon/     │             │
│  │  (mmWave)      │  │  (K8s Lite)    │  │  T-Mobile/AT&T) │             │
│  └────────────────┘  └────────────────┘  └────────────────┘             │
│         │                │                │                            │
├─────────────────────────────────────────────────────────────────────┤
│  LAYER 1: OEM FIELD HARDWARE                                           │
│  ┌────────────────┐  ┌────────────────┐  ┌────────────────┐  ┌────────────────┐   │
│  │  Skyline        │  │  John Deere    │  │  AGCO           │  │  Autonomous   │   │
│  │  Instruments    │  │  Equipment     │  │  Machinery      │  │  Drone Fleet  │   │
│  │  (ARM + ONNX)   │  │  (CAN/ISOBUS)  │  │  (J1939)        │  │  (URLLC)      │   │
│  └────────────────┘  └────────────────┘  └────────────────┘  └────────────────┘   │
└─────────────────────────────────────────────────────────────────────┘
```

### 6.5 Wardley Mapping: Evolution to 2031

| Component | 2026 (Genesis/Custom) | 2028 (Product) | 2031 (Commodity/Utility) |
|-----------|----------------------|----------------|--------------------------|
| Soil inference API | Custom Supabase function | Containerized microservice | Standard MCP tool |
| Auth (JWT/ECDSA) | Supabase Auth | Self-managed + hybrid PQC | PQC-native, SPIFFE identity |
| GPT-4 calls | Cloud-only blocking | vLLM-hosted fallback | Domain model on-device |
| Data storage | Managed PostgreSQL | Distributed SQL | Commodity object + time-series fabric |
| Edge runtime | Deno edge functions | Docker on K3s | WASM sandbox on OEM silicon |

---

## 7. Risk Assessment & Mitigation

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| Supabase vendor lock-in | High | High | Containerization track; portable DB layer |
| GPT-4 cost/latency | High | High | Domain model fine-tuning; edge quantization |
| PQC migration complexity | Medium | High | Hybrid signing starting 2027; phased rotation |
| OEM hardware heterogeneity | Medium | Medium | ONNX Runtime abstraction; ARM + x86 + RISC-V builds |
| Quantum threat acceleration | Low | Critical | Crypto-agility: algorithms swappable without re-architecture |

---

## 8. Conclusion

The transition from SoilSidekick Pro's consumer-grade architecture (~500 TPM) to LeafEngines' industrial-grade substrate (10,000 TPM) is a factored migration across six tracks. It does not abandon the existing Supabase backbone — it containerizes, decouples, and extends it.

The 2031 horizon (Track S) demands cloud-agnostic infrastructure, post-quantum security, and agent-native interfaces. These are not speculative features; they are regulatory and competitive necessities. Platforms that fail to containerize by 2028 will be locked out of OEM partnerships. Platforms that fail to adopt PQC by 2030 will be non-compliant for government and financial credentials. Platforms that lack agent-native APIs will be invisible to the autonomous systems that dominate industrial agriculture by 2031.

LeafEngines is architected to survive all three transitions.

---

## Document Control

**Version History:**
- v1.0 — Initial Skyline Instruments architectural white paper (July 2026)

**Source Documents:**
- `TECHNICAL_ARCHITECTURE.md` v2.1 (February 2026)
- `MASTER_TIMELINE.md` (May 2026)
- `load-tests/BASELINE_METRICS.md` v2.2 (February 2026)
- `Strategic Engineering Roadmap for LeafEngines.rtf` (July 2026)
- `Strategic Document - OEM Potential .md` (2026)

**Review Cycle:**
- Quarterly architecture review
- Annual security compliance review
- Pre-OEM contract technical validation
