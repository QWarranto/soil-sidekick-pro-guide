# BitNet vs Gemma 2B/7B: Offline LLM Selection Analysis

**Date:** March 2026  
**Status:** Reference Document

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

## When BitNet Becomes the Right Choice (Phase 3)

BitNet is the **long-term play** for running 70B+ parameter models on commodity CPUs in fully offline environments. Key advantages:

- **100B+ parameter models** on CPU-only hardware (~12GB RAM for 100B)
- **2–6x faster inference** than FP16 on CPU
- **No GPU dependency** — democratized access on standard business laptops and field devices
- **Lower power consumption** — critical for mobile/field use on battery

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

---

## Decision Timeline

| Quarter | Action |
|---------|--------|
| Q1 2026 | Monitor BitNet.cpp maturity |
| Q2 2026 | Upgrade to Phi-4-mini/Qwen 3 (browser) |
| Q3 2026 | Prototype BitNet native integration |
| Q4 2026 | Production release with BitNet offline mode |

---

## Related Documents

- `docs/BITNET_PHASE3_ENHANCEMENT.md` — Full BitNet integration plan
- `src/services/localLLMService.ts` — Current Gemma implementation
- `src/hooks/useSmartLLMSelection.ts` — LLM routing logic

---

*Last Updated: March 2026*
