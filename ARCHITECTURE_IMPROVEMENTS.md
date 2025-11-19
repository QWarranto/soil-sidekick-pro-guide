# Architecture Improvements & Technical Debt

This document tracks identified weaknesses and areas for improvement in the SoilSidekick Pro architecture. These items are documented for future consideration and should be prioritized before scaling or major refactoring efforts.

---

## Backend Architecture Weaknesses

### 1. Database Complexity (High Priority)

**Issue**: Excessive number of overlapping tables for similar purposes increases maintenance burden and API surface area.

**Specific Concerns**:
- Multiple audit/logging tables serve overlapping purposes:
  - `auth_security_log`
  - `security_audit_log`
  - `comprehensive_audit_log`
  - `compliance_audit_log`
  - `api_key_access_log`
- Usage tracking is fragmented across:
  - `usage_analytics`
  - `subscription_usages`
  - `geo_consumption_analytics`
  - `cost_tracking`

**Impact**: 
- Increased complexity for MVP
- Higher maintenance costs
- More API endpoints to secure and test
- Potential for inconsistent logging across tables

**Recommended Future Action**:
- Consolidate audit tables into 2-3 focused tables based on distinct use cases
- Merge usage tracking tables where data models overlap
- Consider a single unified event log with discriminator columns

---

### 2. Data Integrity & JSON Column Validation (High Priority)

**Issue**: Heavy reliance on `jsonb` columns shifts validation responsibility entirely to application layer, creating risk of corrupt data states.

**Specific Concerns**:
- Critical data stored in JSON columns lacks database-level validation:
  - `usage_pattern` in `geo_consumption_analytics`
  - `metadata` in multiple tables
  - `permissions` in `api_keys`
  - `zones` in `prescription_maps`
  - `boundary_coordinates` in `fields`
- No schema enforcement at database level
- Application-layer validation can be bypassed or have bugs

**Impact**:
- Risk of corrupt/malformed data in production
- Difficult to query and aggregate JSON data efficiently
- Schema evolution requires application updates rather than migrations
- Cannot leverage Postgres constraints for data quality

**Recommended Future Action**:
- Add Postgres JSON Schema validation using check constraints
- Create database triggers to validate JSON structure on insert/update
- Convert predictable JSON structures to typed columns (normalize where appropriate)
- Document required JSON schemas in migration comments
- Consider using Postgres generated columns to extract commonly-queried JSON fields

---

## Additional Weaknesses

_[Reserved for additional architectural concerns to be documented]_

---

## Review & Prioritization

**Status**: Documentation Phase  
**Last Updated**: 2025-11-19  
**Next Review**: Before any major refactoring or scaling efforts

**Priority Levels**:
- 🔴 **High**: Should be addressed before production scaling
- 🟡 **Medium**: Address during next major refactor
- 🟢 **Low**: Nice-to-have improvements

