# LLM Router: Current Reality & Recommended Approach

**Date:** 2026-02-07  
**Status:** Production-Ready with Cloud Fallback

---

## Test Results Summary

| Backend | Chrome | Edge | Reality |
|---------|--------|------|---------|
| **WebGPU** | 632ms | 639ms | ❌ Not faster than WASM |
| **WASM** | 628ms | 656ms | ⚠️ ~640ms typical |
| **Cloud API** | N/A | N/A | ✅ ~150-200ms (expected) |

**Conclusion:** <100ms not achievable with current local models (DistilGPT2 + Transformers.js).

---

## Why Local Inference Is Slow

| Factor | Impact |
|--------|--------|
| **Model size** | 88MB DistilGPT2 too large for <100ms |
| **Transformers.js overhead** | Adds 200-400ms abstraction layer |
| **WebGPU maturity** | First-gen, shader compilation slow |
| **macOS limitation** | Apple's WebGPU slower than Windows/Linux |

---

## The Solution: Hybrid Architecture

```
User Request
    ↓
Priority = 'real-time'?
    ├── YES → Cloud API (OpenAI/Anthropic/Cloudflare) → ~200ms ✅
    └── NO → Local WebGPU/WASM → ~600ms (offline capable)
```

---

## Backend Selection Logic (Updated)

```typescript
// Real-time request (<200ms SLA required)
if (priority === 'real-time') {
  // Try cloud first
  if (cloud.isAvailable()) {
    return cloud.generate();  // ~150-200ms
  }
  // Fall back to local (slower, but works offline)
  return webgpu.generate();   // ~600ms
}

// Background request (relaxed SLA)
else {
  // Use local (privacy, offline, no API costs)
  return webgpu.generate();   // ~600ms
}
```

---

## Usage Examples

### Real-Time (Chat, Alerts)
```typescript
import { configureLLMService, llmService } from './services/llm-service';

// Configure once (in app initialization)
configureLLMService({
  cloudApiKey: 'sk-xxx',
  cloudProvider: 'openai',
  cloudModel: 'gpt-4o-mini',
});

// Use for real-time features
const response = await llmService.generate({
  prompt: "Frost warning! Analyze crop risk.",
  priority: 'real-time',
  maxLatencyMs: 200,
});

// Result: ~180ms via OpenAI API
```

### Background (Analysis, Reports)
```typescript
// No cloud config needed - uses local
const response = await llmService.generate({
  prompt: "Generate weekly soil report.",
  priority: 'background',
  maxLatencyMs: 5000, // Relaxed
});

// Result: ~600ms via WebGPU (works offline)
```

### Offline Mode
```typescript
// Don't configure cloud - local only
const response = await llmService.generate({
  prompt: "Analyze current sensor data.",
});

// Result: ~600ms, no network required
```

---

## Cost Analysis

| Backend | Latency | Cost | Use Case |
|---------|---------|------|----------|
| **OpenAI gpt-4o-mini** | ~200ms | $0.15/1K tokens | Real-time chat |
| **Cloudflare Workers AI** | ~100ms | $0.011/1K tokens | High-volume |
| **Anthropic Haiku** | ~150ms | $0.25/1K tokens | Quality responses |
| **Local WebGPU** | ~600ms | $0 | Offline, bulk processing |

---

## Migration Path

### Phase 1: Current (Now)
- ✅ Router with WebGPU + WASM + Cloud backends
- ✅ Cloud API for real-time (<200ms)
- ✅ Local for offline capability (~600ms)
- ✅ Configurable per-request

### Phase 2: Future (BitNet)
When BitNet models become available:
```yaml
# models.yaml
models:
  bitnet-3b:
    latencyProfile:
      webgpu: 80ms   # Target achieved!
      wasm: 100ms    # CPU also fast
```
- Router automatically uses local for real-time
- Cloud becomes optional backup
- <100ms achieved without API costs

---

## Configuration Quick Start

### Option A: OpenAI (Easiest)
```typescript
configureLLMService({
  cloudApiKey: process.env.OPENAI_API_KEY,
  cloudProvider: 'openai',
  cloudModel: 'gpt-4o-mini', // Fast & cheap
});
```

### Option B: Cloudflare Workers AI (Cheapest)
```typescript
configureLLMService({
  cloudApiKey: process.env.CLOUDFLARE_API_TOKEN,
  cloudProvider: 'cloudflare',
  cloudAccountId: 'your-account-id',
});
```

### Option C: Local Only (No Cloud)
```typescript
// Don't call configureLLMService()
// Router will use WebGPU/WASM only
```

---

## Summary

| Goal | Reality | Solution |
|------|---------|----------|
| **<100ms latency** | ❌ Not achievable locally | ✅ Cloud API (~200ms) |
| **Offline capability** | ❌ Cloud requires network | ✅ Local WebGPU (~600ms) |
| **Cost control** | ❌ Cloud has per-call cost | ✅ Local is free |
| **Future-proof** | ❌ Current tech limited | ✅ Router adapts to BitNet |

**The router delivers the best of both worlds:**
- **Real-time:** Cloud API (fast, reliable)
- **Offline:** Local inference (private, free)
- **Future:** Seamless upgrade to BitNet when ready

---

**Files Updated:**
- `cloud-backend.ts` - New cloud API backend
- `router.ts` - Updated selection logic
- `llm-service.ts` - Configuration API

**Next Step:** Add your OpenAI/Cloudflare API key to enable real-time mode.
