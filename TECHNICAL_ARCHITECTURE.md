# SoilSidekick Pro - Technical Architecture Documentation
# LeafEngines™ B2B API Platform

## Version: 2.0
## Date: December 2025
## Owner: Engineering Team

---

## 1. Architecture Overview

SoilSidekick Pro is built on a modern, scalable architecture leveraging React/TypeScript frontend with Supabase backend infrastructure. The platform integrates multiple federal data sources, satellite intelligence, and local AI processing capabilities.

### 1.1 SOC 2 Type 1 Compliance Architecture

**Security Foundation**: The entire architecture is designed with SOC 2 Type 1 compliance as a core requirement, implementing:

- **Data Access Controls**: Row-Level Security (RLS) policies across all database tables
- **Encryption Standards**: End-to-end encryption for sensitive agricultural and payment data
- **API Security**: Comprehensive authentication, rate limiting, and access monitoring
- **Audit Logging**: Complete audit trails for all data access and modifications
- **Payment Security**: PCI DSS compliant payment processing with encrypted storage

### 1.2 High-Level Architecture

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Supabase       │    │  External APIs  │
│   React/TS      │◄──►│   Backend        │◄──►│  EPA, USDA,     │
│   + Local AI    │    │   + Edge Funcs   │    │  Google Earth   │
└─────────────────┘    └──────────────────┘    └─────────────────┘
```

## 2. Frontend Architecture

### 2.1 Technology Stack
- **Framework**: React 18.3.1 with TypeScript
- **Build System**: Vite for fast development and optimized builds
- **Styling**: Tailwind CSS with shadcn/ui component library
- **State Management**: React hooks and context for local state
- **Routing**: React Router for client-side navigation

### 2.2 Local AI Processing
- **Models**: Google Gemma 2B/7B language models
- **Processing**: Hugging Face Transformers.js with WebGPU acceleration
- **Privacy**: Complete offline processing for sensitive agricultural data
- **Caching**: Persistent model storage for performance optimization

### 2.3 Security Implementation
- **XSS Protection**: Content sanitization with DOMPurify
- **CSP Headers**: Content Security Policy to prevent script injection
- **Authentication**: JWT token management with secure storage
- **Input Validation**: Client-side validation for all user inputs

## 3. Backend Architecture

### 3.1 Supabase Infrastructure
- **Database**: PostgreSQL with Row-Level Security (RLS)
- **Authentication**: Supabase Auth with JWT tokens
- **Storage**: Encrypted blob storage for file uploads
- **Edge Functions**: Deno-based serverless functions for business logic

### 3.2 Database Design

#### 3.2.1 Core Tables
- `subscribers`: Encrypted user subscription data
- `soil_analyses`: User-specific soil analysis results
- `counties`: Public geographic reference data
- `environmental_impact_scores`: Environmental assessment results
- `usage_analytics`: Platform usage tracking and analytics

#### 3.2.2 Security Tables
- `account_security`: User security settings and login tracking
- `api_keys`: API key management with encryption
- `security_audit_log`: Comprehensive audit logging
- `auth_security_log`: Authentication event tracking

### 3.3 SOC 2 Type 1 Database Security
- **Row-Level Security**: All user data isolated by user_id
- **Encryption**: Sensitive data encrypted at rest using pgcrypto
- **Audit Logging**: Complete audit trails for all operations
- **Access Controls**: Granular permissions with admin role separation
- **Data Classification**: Automated classification of sensitive data types

## 4. Edge Functions Architecture

### 4.1 Core Business Functions
- `agricultural-intelligence`: Soil analysis and recommendations with automatic retry logic
- `environmental-impact-engine`: Environmental risk assessment
- `territorial-water-quality`: EPA water quality integration
- `visual-crop-analysis`: Satellite data processing
- `seasonal-planning-assistant`: Crop planning optimization
- `plant-id-comparison`: B2B plant identification comparison API
- `leafengines-query`: Plant-environment compatibility analysis

### 4.2 Infrastructure Functions
- `api-key-management`: Secure API key operations with `x-api-key` authentication
- `cost-monitoring`: Usage tracking and metered billing preparation
- `security-monitoring`: Security incident detection
- `enhanced-threat-detection`: Advanced security monitoring
- `api-health-monitor`: Service health and availability monitoring

### 4.3 Payment & Subscription Functions
- `create-checkout`: Stripe payment processing
- `customer-portal`: Subscription management
- `check-subscription`: Subscription validation
- Future: Stripe metered billing for B2B API usage

### 4.4 Error Handling & Resilience
- **Automatic Retry Logic**: 3 retries with exponential backoff (1s, 2s, 4s)
- **Retriable Error Detection**: 502, 503, timeout, unavailable errors trigger retry
- **User Feedback**: Real-time retry status indicators
- **Error Sanitization**: Generic error messages prevent information leakage

## 5. Integration Architecture

### 5.1 External Data Sources
- **EPA Water Quality Portal**: Real-time environmental monitoring
- **USDA Soil Data**: Agricultural soil information
- **Google Earth Engine**: Satellite imagery and analysis
- **Census API**: Geographic and demographic data
- **FIPS Code Services**: County identification and validation

### 5.2 LeafEngines™ SDK/API Client Integration

**Multi-Language SDK**: Auto-generated from OpenAPI specification across 6 languages.

📋 **Integration Guide**: See [SDK_CLIENT_ONBOARDING_PLAN.md](./SDK_CLIENT_ONBOARDING_PLAN.md)

**Client Integration Architecture**:
```
Client Application
├── @soilsidekick/sdk (npm)
├── x-api-key Header Authentication
├── Automatic Retry with Backoff
└── Rate Limit Header Handling

LeafEngines Platform
├── API Gateway (Tier-Based Rate Limiting)
├── x-api-key Validation
├── Edge Functions
└── Cost Tracking & Metered Billing
```

**SDK Languages**:
- TypeScript/JavaScript (`npm install @soilsidekick/sdk`)
- Python (`pip install soilsidekick`)
- Go, Ruby, Java, PHP (auto-generated)

**SDK Features**:
- RESTful API access to all platform features
- `x-api-key` header authentication (format: `ak_*`)
- Automatic retry with exponential backoff
- Rate limit headers (X-RateLimit-Limit, X-RateLimit-Remaining, X-RateLimit-Reset)
- TypeScript type definitions
- Comprehensive error handling

**Rate Limits by Tier**:
| Tier | Per Minute | Per Hour | Per Day |
|------|------------|----------|---------|
| Free | 10 | 100 | 1,000 |
| Starter | 30 | 500 | 5,000 |
| Pro | 100 | 2,000 | 25,000 |
| Enterprise | 500 | 10,000 | 100,000 |

### 5.3 Caching Strategy
```
Level 1: County-specific (1 hour)
Level 2: State-level (6 hours)
Level 3: Regional (24 hours)
Level 4: National (7 days)
```

### 5.4 API Rate Limiting
- **Tier-based limits**: Different limits per subscription tier
- **Hierarchical throttling**: Progressive slowdown before hard limits
- **Geographic distribution**: Regional rate limiting for load balancing
- **SDK Client Support**: Automatic rate limit handling with retry logic

## 6. Security Architecture

### 6.1 Authentication & Authorization
- **JWT Tokens**: Secure token-based authentication
- **Session Management**: Secure session handling with timeout
- **Role-Based Access**: Admin, user, and service role separation
- **API Key Management**: Encrypted API keys with rotation

### 6.2 Data Encryption
- **In Transit**: TLS 1.3 for all data transmission
- **At Rest**: AES-256 encryption for sensitive database fields
- **Payment Data**: PCI DSS compliant encryption for Stripe data
- **API Credentials**: Encrypted storage of third-party API keys

### 6.3 Monitoring & Incident Response
- **Real-time Monitoring**: Continuous security event monitoring
- **Threat Detection**: AI-powered anomaly detection
- **Incident Logging**: Comprehensive security incident tracking
- **Automated Response**: Automatic account lockout and threat mitigation

## 7. Deployment Architecture

### 7.1 Production Environment
- **Frontend**: Hosted on Lovable platform with CDN
- **Backend**: Supabase cloud infrastructure
- **Database**: Managed PostgreSQL with automated backups
- **Edge Functions**: Global edge deployment for low latency

### 7.2 CI/CD Pipeline
- **Code Review**: Mandatory security review for all changes
- **Automated Testing**: Security and functional test suites
- **Deployment**: Automated deployment with rollback capabilities
- **Monitoring**: Post-deployment monitoring and alerting

## 8. Compliance & Governance

### 8.1 SOC 2 Type 1 Compliance
- **Control Environment**: Documented security policies and procedures
- **Risk Assessment**: Regular security risk assessments
- **Control Activities**: Implemented security controls and monitoring
- **Information & Communication**: Security awareness and incident reporting
- **Monitoring**: Continuous monitoring of security controls

### 8.2 Data Governance
- **Data Classification**: Automated classification of sensitive data
- **Retention Policies**: Automated data retention and deletion
- **Access Governance**: Regular access reviews and provisioning
- **Privacy Protection**: GDPR-compliant data handling procedures

## 9. Performance & Scalability

### 9.1 Performance Targets
- **Page Load Time**: < 2 seconds for initial load
- **API Response Time**: < 500ms for most endpoints
- **Database Queries**: < 100ms for typical queries
- **File Uploads**: Support for files up to 10MB

### 9.2 Scalability Design
- **Horizontal Scaling**: Edge functions scale automatically
- **Database Optimization**: Indexed queries and connection pooling
- **CDN Distribution**: Global content delivery network
- **Caching Strategy**: Multi-level caching for performance

## 10. Disaster Recovery & Business Continuity

### 10.1 Backup Strategy
- **Database Backups**: Automated daily backups with point-in-time recovery
- **Code Repository**: Git-based version control with redundancy
- **Configuration Backup**: Automated backup of system configurations
- **Documentation**: Version-controlled documentation repository

### 10.2 Recovery Procedures
- **RTO (Recovery Time Objective)**: 4 hours for full service restoration
- **RPO (Recovery Point Objective)**: 1 hour maximum data loss
- **Failover Procedures**: Documented procedures for service failover
- **Testing**: Regular disaster recovery testing and validation

---

## Document Control

**Version History:**
- v1.0 - Initial technical architecture documentation with SOC 2 Type 1 compliance (January 2025)
- v2.0 - Added LeafEngines B2B platform, multi-language SDK, automatic retry logic, metered billing preparation (December 2025)

**Review Cycle:** 
- Quarterly architecture review
- Annual security compliance review
- Continuous security monitoring and updates