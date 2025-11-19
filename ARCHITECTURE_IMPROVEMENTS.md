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

## Frontend Architecture Weaknesses

### 3. Routing Architecture (High Priority)

**Issue**: Manual state-based routing in `App.tsx` instead of proper routing library (React Router is installed but not fully utilized).

**Specific Concerns**:
- Current implementation: `const [currentRoute, setCurrentRoute] = useState(...)`
- Browser "Back" button is broken - doesn't navigate between pages
- Deep-linking is impossible - can't share URLs to specific pages/tasks
- Page state resets on browser refresh
- No URL parameters support (e.g., `/tasks/123`)

**Impact**:
- Poor user experience with broken browser navigation
- Can't bookmark or share specific pages
- SEO implications - all pages appear as single route
- State management complexity increases
- Analytics can't track page views accurately

**Recommended Future Action**:
- Migrate to React Router's `BrowserRouter` with proper `<Route>` components
- Replace all `setCurrentRoute()` calls with `navigate()` from React Router
- Add route parameters for resource IDs (`/tasks/:id`, `/fields/:id`)
- Implement proper 404 handling
- Add route guards for authentication-required pages

---

### 4. Feature Utilization Gap (Medium Priority)

**Issue**: Frontend only implements a fraction of backend capabilities, leaving robust features unused.

**Specific Concerns**:
- No UI for security features:
  - Account security settings (`account_security` table)
  - Security audit logs (`auth_security_log`, `security_audit_log`)
  - API key management (`api_keys` table)
- No compliance monitoring interface:
  - Compliance audit log viewing (`compliance_audit_log`)
  - SOC2 compliance checks (`soc2_compliance_checks`)
- No cost management dashboard:
  - Cost tracking analytics (`cost_tracking`)
  - Cost alerts configuration (`cost_alerts`)
  - Usage analytics visualization (`usage_analytics`)
- Missing admin interfaces for monitoring and management

**Impact**:
- Wasted backend development effort
- Users can't leverage advanced features they're paying for
- Admin team lacks visibility into system health
- Security monitoring capabilities unused
- Cost overruns go unnoticed without alerts interface

**Recommended Future Action**:
- Build admin dashboard for security/compliance monitoring
- Create user-facing settings page for account security
- Implement cost tracking dashboard with alerts
- Add API key management interface for Enterprise users
- Prioritize features based on subscription tier value

---

### 5. CRUD Operation Gaps (High Priority)

**Issue**: Current UI is largely read-only, missing create/update/delete operations despite backend support.

**Specific Concerns**:
- No forms for creating resources:
  - Add new fields (`fields` table has Insert types defined)
  - Create task templates
  - Add soil analyses
  - Configure integrations
- No update operations:
  - Edit field boundaries
  - Update task statuses
  - Modify user preferences
  - Change subscription settings
- No delete functionality for user-created resources
- Backend Insert/Update types in `types.ts` are unused

**Impact**:
- Users cannot fully manage their data
- Requires manual database operations for basic tasks
- Poor user experience - feels incomplete
- Backend validation logic untested
- Type safety benefits of Supabase schema wasted

**Recommended Future Action**:
- Audit all tables with user-owned data
- Build CRUD forms using React Hook Form + Zod validation
- Implement optimistic updates with TanStack Query
- Add confirmation dialogs for destructive operations
- Create reusable form components for common patterns
- Test Insert/Update type validation end-to-end

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

