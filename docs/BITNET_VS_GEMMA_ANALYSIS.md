# BitNet vs Gemma 2B/7B: Offline LLM Selection Analysis

**Date:** March 2026  
**Status:** Reference Document  
**Last Major Update:** March 27, 2026 — TurboQuant impact analysis added

---

## Why Gemma Is the Current Choice (Phase 1–2)

### 1. Runtime Compatibility
BitNet.cpp requires a **native app** (Capacitor/Electron) with a compiled C++ binary. The current stack runs in-browser via WebGPU + Transformers.js, so BitNet cannot be used without shipping a native layer first.

### 2. No GPU Involvement
BitNet runs on **CPU only** (1-bit quantized weights). While this is an advantage for commodity field hardware, it represents a fundamentally different integration path — not a drop-in replacement for the current WebGPU pipeline.

### 3. Gemma Fits Today's Architecture
Gemma 2B ONNX runs directly in the browser via WebGPU with <100ms inference, satisfying the patent-backed latency SLA without any native bridge. It works *now* in production.

### 4. Upgrade Path: Phi-4-mini / Qwen 3 First
Per REC-001, the next local model upgrade targets **Phi-4-mini (3.8B)** or **Qwen 3 (4B)** in Q2 2026 — still browser-compatible, with better reasoning and lower VRAM than Gemma 7B. BitNet comes *after* that milestone.

---

## TurboQuant Impact Analysis (March 2026)

Google's TurboQuant algorithm compresses LLM KV caches from 16-bit to 3-bit with **zero accuracy loss**, delivering up to **6x memory reduction** and **8x inference speedup**. This fundamentally changes the Gemma vs BitNet calculus.

### Before TurboQuant vs After TurboQuant — Gemma (Browser)

| Metric | Before TurboQuant | After TurboQuant |
|--------|-------------------|------------------|
| Gemma 2B KV cache RAM | ~2–4 GB | ~0.5–0.7 GB |
| Gemma 7B KV cache RAM | ~8–16 GB | ~1.3–2.7 GB |
| Gemma 7B on mobile | ❌ Not viable | ✅ Feasible on 4GB+ devices |
| Max context length (2B, 4GB device) | ~4K tokens | ~16K–24K tokens |
| Latency SLA (<100ms) with 7B | ❌ Too slow on most devices | ⚡ Achievable with WebGPU + TurboQuant |
| Intermediate upgrade (Phi-4-mini) | Required stepping stone | Potentially skippable — 7B now fits |

### Before TurboQuant vs After TurboQuant — BitNet Phase 3

| Metric | Before TurboQuant | After TurboQuant |
|--------|-------------------|------------------|
| 100B model KV cache RAM | ~12 GB | ~2–4 GB |
| 100B model on business laptop (16GB) | ⚠️ Tight, swap likely | ✅ Comfortable, room for OS + app |
| 70B model on field tablet (8GB) | ❌ Not possible | ✅ Feasible with 3-bit KV |
| Context window for field reports | ~8K tokens | ~32K–48K tokens |
| Full-season history in single context | ❌ Requires chunking | ✅ Fits in single pass |

### Before TurboQuant vs After TurboQuant — Cloud (GPT-5/4o)

| Metric | Before TurboQuant | After TurboQuant |
|--------|-------------------|------------------|
| Per-token API cost | Current rates | ~50% reduction expected |
| Response latency (long context) | Bottlenecked by KV cache | Up to 8x faster decoding |
| Max practical context | ~128K tokens | ~512K+ tokens viable |
| Cost per agricultural chat session | ~$0.002–0.01 | ~$0.001–0.005 |

### Revised Recommendation

TurboQuant makes **Gemma 7B on mobile a realistic near-term target**, potentially eliminating the need for the Phi-4-mini intermediate step. The Q2 2026 upgrade should evaluate:

1. **Gemma 7B + TurboQuant** (browser, WebGPU) — if `@huggingface/transformers` or `onnxruntime-web` adds TurboQuant support
2. **Phi-4-mini without TurboQuant** — fallback if TurboQuant browser support lags
3. **BitNet + TurboQuant** (native) — remains the Q3–Q4 play, now with dramatically lower hardware requirements

---

## Summary Comparison

| Factor | Gemma 2B/7B (Current) | BitNet.cpp (Phase 3) |
|--------|----------------------|---------------------|
| Runtime | Browser (WebGPU) | Native only (C++) |
| Hardware | GPU required | CPU only |
| Max Parameters | 7B | 100B+ |
| Latency SLA (<100ms) | ✅ Met via WebGPU | ❌ Requires native bridge |
| Integration Effort | Zero (already deployed) | 5–8 weeks (native plugin) |
| Production Ready | ✅ Yes | ⏳ Q3–Q4 2026 |
| TurboQuant Benefit | 7B now viable on mobile | 100B on 8GB hardware |

---

## Revised Decision Timeline

| Quarter | Action | TurboQuant Dependency |
|---------|--------|----------------------|
| Q1 2026 | Monitor BitNet.cpp maturity | Monitor TurboQuant ecosystem adoption |
| Q2 2026 | Evaluate Gemma 7B + TurboQuant vs Phi-4-mini | Requires `onnxruntime-web` or Transformers.js support |
| Q3 2026 | Prototype BitNet + TurboQuant native integration | llama.cpp already has TurboQuant support |
| Q4 2026 | Production release with BitNet offline mode | Full TurboQuant integration validated |

---

## Related Documents

- `docs/BITNET_PHASE3_ENHANCEMENT.md` — Full BitNet integration plan (updated with TurboQuant)
- `src/services/localLLMService.ts` — Current Gemma implementation
- `src/hooks/useSmartLLMSelection.ts` — LLM routing logic (updated with TurboQuant awareness)
- [Google Research: TurboQuant Blog Post](https://research.google/blog/turboquant-redefining-ai-efficiency-with-extreme-compression/)

---

*Last Updated: March 27, 2026*
