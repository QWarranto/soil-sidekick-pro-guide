# Security Documentation

**Version:** 3.1.0
**Last updated:** 2026-07-03
**Owner:** Security / Platform

---

## 1. Security Objectives

Confidentiality, integrity, and availability of customer soil, geographic, and account data. Alignment with SOC 2 Type 1, ISA TRAQ, GMP, FDA, and CEJST data standards.

## 2. Trust Model

| Boundary | Control |
|---|---|
| Public internet → Edge | TLS 1.3, WAF, CORS allowlist |
| Edge → Functions | Supabase-issued service tokens |
| Functions → DB | RLS + role-scoped grants |
| Client ↔ Local LLM | On-device only; never egresses |
| Partner (Composio, Skyline) | mTLS + partner key profile |

## 3. Authentication & Authorization

### 3.1 Users
- Supabase Auth (JWT); passkeys supported (`user_passkeys`)
- MFA optional (TOTP), enforced for admin roles
- Session TTL 60 min, refresh rotating

### 3.2 API Keys
- SHA-256 hashed at rest; format `SS_API_{prefix}_2025`
- Rotation on demand; revocation immediate
- Scoped to tier (`api_tier_limits`)
- Access logged in `api_key_access_log`

### 3.3 Roles
- Separate `user_roles` table, `app_role` enum
- Access via `public.has_role(_user_id, _role)` — SECURITY DEFINER, `search_path=''`
- Never stored on `profiles`

## 4. Row-Level Security (RLS)

All 80+ `public` tables have RLS enabled. Fixed in the latest security remediation:

| Table | Policy Summary |
|---|---|
| `api_keys` | Owner-only; admin via `has_role` |
| `model_benchmark_results` | Admin-only read |
| `vendor_leads` | Admin-only read |
| `managed_assets` | Owner + admin |
| `asset_history` | Read-only for owner |
| `user_roles` | Auth read; admin write |

Storage: `telegram-uploads` bucket no longer allows anonymous INSERT.

## 5. Encryption

- **At rest:** AES-256 V3 for PII columns; keys in Supabase Vault (`APP_ENCRYPTION_KEY`)
- **In transit:** TLS 1.3 (min TLS 1.2)
- **Field-level:** email, phone, address encrypted via edge function helpers
- **Key rotation:** quarterly; legacy plaintext and V2 DB-trigger keys deprecated

## 6. Secrets Management
- Supabase Vault + Edge Function Secrets
- 100-secret cap per environment; monitored
- `LOVABLE_API_KEY` rotated via `ai_gateway--rotate_lovable_api_key`
- No secrets in code, `.env`, or logs

## 7. Input Validation
- Zod schemas at edge boundary
- OpenAPI request validation
- Positional uncertainty gate (> 500 m → reject)
- SQL: parameterized; no string concatenation

## 8. Audit Logging
Tables:
- `comprehensive_audit_log`
- `security_audit_log`
- `compliance_audit_log`
- `mcp_tool_call_log`
- `sensor_audit_log`
- `auth_security_log`

Retention: 400 days minimum; export to WORM storage for compliance.

## 9. Monitoring & Detection
- `security_monitoring` view for anomaly detection
- `security_incidents` tracker
- Alerts for: brute-force auth, unusual API key usage, RLS violations, MCP tool abuse
- PII redaction in all logs

## 10. Vulnerability Management
- Weekly dependency scan (`code--dependency_scan`)
- Latest fix: upgraded `vitest` to ^4.1.9, `@huggingface/transformers` to ^4.2.0 to resolve `protobufjs` GHSA-xq3m-2v4x-88gg / GHSA-5xrq-8626-4rwp
- Snyk / Dependabot on GitHub
- Annual third-party pen test

## 11. Compliance Alignment
| Framework | Status |
|---|---|
| SOC 2 Type 1 | Certified |
| ISA TRAQ | Mapped |
| GMP / FDA | Applicable to agri-inputs |
| CEJST | Data standards followed |
| GDPR / CCPA | Data export & deletion supported |

## 12. Incident Response
Phases: Detect → Contain → Eradicate → Recover → Post-mortem
- 24×7 on-call
- P0 breach: notify customers within 72 h (GDPR)
- Immutable audit log preserved

## 13. Secure Development Lifecycle
- Code review required (2 approvers on security-touching code)
- Automated: eslint security plugin, tsgo, dependency scan
- Threat modeling on major features
- `search_path = ''` enforced on SECURITY DEFINER functions

## 14. Frontend Security
- CSP with strict-dynamic
- No inline scripts (except Vite bootstrap)
- Cookies: HttpOnly, Secure, SameSite=Lax
- LocalStorage never stores tokens

## 15. Physical / Hardware
- OEM/HIL: HMAC + mTLS with 5 s data TTL
- Device attestation for high-trust sensors
- Signed firmware for edge nodes

## 16. Positional Integrity (IP-Protected)
- 500 m write-inhibition lock (patent-protected)
- Kalman gate on dead-reckoning fusion
- Prevents database corruption from unreliable PNT

## 17. Free Tier Abuse Controls
- IP-hash quota in `anonymous_api_usage`
- Automatic key auto-rotation when abuse detected
- `x-free-tier` scoped to two endpoints only

## 18. Third-Party Access
- Composio: 10k req/hr; separate audit trail
- Skyline: MQTT + partner mTLS
- Stripe: webhook signature validated

## 19. Data Retention & Deletion
- User self-service delete → hard delete in 30 days
- Backups purged after 7 days rolling
- Right to be forgotten (GDPR Art. 17)

## 20. References
- `mem://security/hardened-compliance-architecture`
- `mem://security/encryption-hardening-and-rotation`
- `mem://security/oem-telecom-safety-governance`
- Compliance & Legal Documentation
