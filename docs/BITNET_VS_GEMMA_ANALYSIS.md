# BitNet vs Gemma: Offline LLM Selection Analysis

**Date:** April 2026  
**Status:** Reference Document  
**Last Major Update:** April 3, 2026 — Gemma 4 launch analysis added

---

## Current State: Gemma 4 (April 2026)

### Gemma 4 Replaces Gemma 2/3 Entirely

Google released Gemma 4 on April 2, 2026 under Apache 2.0. Four model sizes target the full deployment spectrum:

| Model | Effective Params | Total Params | Context | Modalities | On-Device Target |
|-------|-----------------|-------------|---------|------------|-----------------|
| **E2B** | 2.3B | 5.1B (w/ PLE) | 128K | Text, Image, **Audio** | Phones |
| **E4B** | 4.5B | 8B (w/ PLE) | 128K | Text, Image, **Audio** | Phones/Tablets |
| **26B A4B (MoE)** | 3.8B active | 26B | 256K | Text, Image | Laptops |
| **31B Dense** | 30.7B | 30.7B | 256K | Text, Image | Workstations |

### Key Architectural Advances Over Gemma 2/3

1. **Hybrid Attention**: Sliding window + global attention interleaved, with unified K/V on global layers and Proportional RoPE (p-RoPE). This is inherently more memory-efficient than Gemma 2's standard attention.

2. **Per-Layer Embeddings (PLE)**: E2B and E4B use PLE for parameter efficiency — the "effective" parameter count is much smaller than total, enabling frontier-level reasoning in a small runtime footprint.

3. **Native System Prompt Support**: Gemma 4 properly handles the `system` role, unlike Gemma 2/3 which required workarounds.

4. **Built-in Thinking Mode**: Configurable step-by-step reasoning without prompt engineering.

5. **Native Function Calling**: E4B and larger models support tool use, enabling local MCP agent execution.

6. **Audio Input** (E2B/E4B): Voice-to-analysis pipeline for field workers.

### Benchmark Context

| Benchmark | Gemma 4 E4B | Gemma 4 26B A4B | Gemma 3 27B |
|-----------|------------|----------------|-------------|
| MMLU Pro | 69.4% | 82.6% | 67.6% |
| AIME 2026 | 42.5% | 88.3% | 20.8% |
| LiveCodeBench v6 | 52.0% | 77.1% | 29.1% |
| GPQA Diamond | 58.6% | 82.3% | 42.4% |

Gemma 4 E4B (4.5B effective) already surpasses Gemma 3 27B on most reasoning benchmarks, while running 6x faster.

---

## TurboQuant + Gemma 4 Combined Impact

TurboQuant (3-bit KV cache) combines with Gemma 4's architectural improvements for compounding memory savings:

| Model | KV Cache (16-bit) | KV Cache (3-bit TQ) | Viable On |
|-------|-------------------|---------------------|-----------|
| E2B | ~1.5 GB | ~0.3 GB | Any device (2GB+ RAM) |
| E4B | ~3.0 GB | ~0.6 GB | 4GB+ phones |
| 26B A4B MoE | ~10 GB | ~1.9 GB | 8GB+ laptops |
| 31B Dense | ~14 GB | ~2.6 GB | 16GB+ workstations |

Note: Gemma 4's unified K/V on global layers already reduces KV cache size vs standard attention, so TurboQuant gains are additive to architectural savings.

---

## Revised Roadmap (Post-Gemma 4)

### What Was Eliminated

| Original Plan | Status | Why |
|---------------|--------|-----|
| Phi-4-mini intermediate step | **Eliminated** | E4B is superior in every metric |
| Gemma 7B + TurboQuant as Q2 target | **Superseded** | E4B (4.5B) outperforms 7B with native 128K context |
| Qwen 3 evaluation | **Deprioritized** | Gemma 4 MoE covers the quality tier |

### Current 3-Tier Local Model Strategy

| Tier | Model | Use Case | Hardware |
|------|-------|----------|----------|
| **Efficiency** | Gemma 4 E2B | Battery mode, quick queries, voice input | Any phone |
| **Standard** | Gemma 4 E4B | Default local mode, balanced quality | 4GB+ devices |
| **Power** | Gemma 4 26B A4B MoE | Frontier reasoning, function calling, full-season analysis | 8GB+ laptops |

### BitNet Phase 3 — Still Relevant but Repositioned

| Factor | Before Gemma 4 | After Gemma 4 |
|--------|---------------|---------------|
| Primary value | Only path to 100B+ on-device | Complementary: 100B+ CPU-only for air-gapped environments |
| Timeline urgency | Critical for Q3-Q4 | Reduced — Gemma 4 MoE covers 90% of use cases |
| Integration effort | 5-8 weeks native plugin | Same, but lower priority |
| Unique advantage | CPU-only (no GPU required) | Remains unique for GPU-less industrial hardware |

BitNet remains the Q4 2026 play for specialized deployments (air-gapped facilities, GPU-less industrial equipment), but Gemma 4 MoE with only 3.8B active parameters already delivers near-frontier reasoning on standard hardware.

---

## Decision Timeline

| Quarter | Action | Dependency |
|---------|--------|------------|
| Q2 2026 | **Deploy Gemma 4 E2B + E4B** in production | ONNX weights from onnx-community or HuggingFace |
| Q2 2026 | Enable audio input pipeline for field workers | E2B/E4B audio encoder support in transformers.js |
| Q3 2026 | **Deploy Gemma 4 26B MoE** for laptop/power tier | ONNX MoE support in onnxruntime-web |
| Q3 2026 | Local function calling → local MCP agent execution | E4B+ tool-use integration |
| Q4 2026 | BitNet native integration for specialized deployments | llama.cpp BitNet maturity |

---

## Related Documents

- `docs/BITNET_PHASE3_ENHANCEMENT.md` — BitNet integration plan (repositioned post-Gemma 4)
- `src/services/localLLMService.ts` — Gemma 4 model registry and initialization
- `src/hooks/useSmartLLMSelection.ts` — 3-tier auto-routing (E2B/E4B/MoE)
- `src/components/LocalLLMToggle.tsx` — Updated UI with Gemma 4 model selection
- [Google Blog: Gemma 4 Launch](https://blog.google/innovation-and-ai/technology/developers-tools/gemma-4/)
- [Gemma 4 Model Card](https://ai.google.dev/gemma/docs/core/model_card_4)
- [Google Research: TurboQuant](https://research.google/blog/turboquant-redefining-ai-efficiency-with-extreme-compression/)

---

*Last Updated: April 3, 2026*
