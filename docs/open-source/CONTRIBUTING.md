# Contributing to LeafEngines Open Source Components

Thank you for your interest in contributing to LeafEngines™ by SoilSidekick Pro™.

## What's Open Source

Only the following components accept community contributions:

| Component | Repository | License |
|-----------|-----------|---------|
| **MCP Server** | [leafengines-claude-mcp](https://github.com/QWarranto/leafengines-claude-mcp) | Apache 2.0 |
| **SDK Client Libraries** | Generated from `openapi-spec.yaml` | MIT |
| **Starter Templates** | `docs/workflows/`, integration examples | MIT |
| **Postman Collection** | `public/postman/` | MIT |

## What's NOT Open Source

The following components are proprietary and **must not** be included in any contribution:

- ❌ Dead reckoning / sensor fusion / positioning engine (`src/lib/dead-reckoning/`)
- ❌ TurboQuant integration layer
- ❌ Smart LLM selection or offline inference pipeline
- ❌ Edge Functions or backend services (`supabase/functions/`)
- ❌ Any algorithm implementing methods described in U.S. Patent Applications #19/320,727 or #19/544,827

## How to Contribute

### 1. Open an Issue First

Before writing code, open an issue describing the change. This avoids wasted effort on contributions that may conflict with the roadmap or IP boundaries.

### 2. Fork & Branch

```bash
git clone https://github.com/QWarranto/leafengines-claude-mcp.git
git checkout -b feature/your-feature-name
```

### 3. Follow Code Standards

- **TypeScript/JavaScript**: ESLint config in the repo
- **Python SDK contributions**: PEP 8, type hints required
- **Documentation**: Markdown, clear examples, no proprietary details

### 4. IP Review Checklist

Before submitting a PR, confirm:

- [ ] My contribution does **not** implement or reference patented positioning, sensor fusion, or dead reckoning methods
- [ ] My contribution does **not** include or reverse-engineer any proprietary Edge Function logic
- [ ] My contribution does **not** expose internal API authentication mechanisms beyond what's documented in the public OpenAPI spec
- [ ] I have read and agree to the [Contributor License Agreement](#contributor-license-agreement)

### 5. Submit a Pull Request

- Clear title and description
- Reference the issue number
- Include tests if applicable
- One logical change per PR

## Contributor License Agreement (CLA)

By submitting a pull request, you agree that:

1. **You own** the intellectual property in your contribution, or have permission to submit it
2. **You grant** SoilSidekick Pro™ a perpetual, worldwide, non-exclusive, royalty-free license to use, modify, and distribute your contribution
3. **You confirm** your contribution does not knowingly infringe any third-party patents, copyrights, or trade secrets
4. **You understand** that your contribution may be incorporated into both open-source and proprietary products

## Code of Conduct

- Be respectful and constructive
- Focus on the technical merit of contributions
- No harassment, discrimination, or personal attacks
- Maintainers reserve the right to reject contributions that conflict with IP protections or product direction

## Questions?

- **General**: Open a GitHub issue
- **IP/Licensing**: legal@soilsidekickpro.com
- **Partnership**: sales@soilsidekickpro.com

---

© 2026 SoilSidekick Pro™ / LeafEngines™. All rights reserved.
