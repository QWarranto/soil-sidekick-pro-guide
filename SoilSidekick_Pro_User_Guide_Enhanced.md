# SoilSidekick Pro User Guide

## Version: 2.1 | February 2026

## Master SoilSidekick Pro's agricultural intelligence platform with our comprehensive guides. From satellite data interpretation to environmental risk assessment, interactive data visualization, Variable Rate Technology, and AI-powered seasonal planning.

### SOC 2 Type 1 Compliance & Security
SoilSidekick Pro maintains SOC 2 Type 1 compliance with enterprise-grade security standards. Your agricultural data is protected through comprehensive security controls including data encryption, access monitoring, and audit logging. Our security framework ensures your sensitive farm data remains private and secure.

### Service Reliability & Smart Error Handling
SoilSidekick Pro includes a centralized error-handling system that classifies failures and responds intelligently. Transient errors (network timeouts, rate limits, temporary outages) trigger automatic retries with exponential backoff. Authentication errors prompt session refresh. Validation errors provide clear user guidance. This system operates across all edge function calls and async operations, ensuring a resilient experience. See [Service Resilience & Error Handling](#service-resilience--error-handling) for full details.

---

## Table of Contents

1. [Quick Start](#quick-start)
2. [Interactive Dashboard & Overview](#interactive-dashboard--overview)
3. [Field Management & Soil Visualization](#field-management--soil-visualization)
4. [Smart Task Management](#smart-task-management)
5. [Soil Analysis Interpretation](#soil-analysis-interpretation)
6. [Seasonal Planning Assistant](#seasonal-planning-assistant)
7. [Variable Rate Technology (VRT)](#variable-rate-technology-vrt)
8. [AlphaEarth Satellite Intelligence](#alphaearth-satellite-intelligence)
9. [Environmental Assessment & Water Quality](#environmental-assessment--water-quality)
10. [Local AI Processing](#local-ai-processing)
11. [Subscription Tiers](#subscription-tiers)
12. [Service Resilience & Error Handling](#service-resilience--error-handling)
13. [Troubleshooting](#troubleshooting)

---

## Quick Start

### Interactive Dashboard
**Visual analytics at a glance**
Explore interactive charts with custom tooltips, toggleable data series, and expanding pie slices to visualize carbon credits, organic matter trends, and task distributions.

### Soil Analysis Visualization
**Nutrient composition & health**
View detailed N-P-K nutrient visualizations, pH gauges, organic matter progress bars, and comprehensive agronomist recommendations with interactive charts.

### Smart Task Filtering
**Organize by crop & status**
Filter seasonal tasks dynamically by both status and crop type with intelligent dual-filter system and task counters.

### AlphaEarth Intelligence
**Satellite-powered insights**
Learn to interpret vegetation health, soil moisture, and environmental risk scores from Google Earth Engine data.

### Environmental Assessment
**EPA data integration**
Understand water quality monitoring, contamination detection, and eco-friendly farming practices.

### Local AI Processing
**Offline agricultural intelligence**
Use Google Gemma models for privacy-preserving AI analysis that works without internet connectivity.

---

## Interactive Dashboard & Overview

### Visual Analytics at a Glance

The Overview component provides interactive data visualization with multiple chart types designed for quick insights and detailed exploration.

#### Carbon Credits & Organic Matter Bar Chart

**Interactive Features:**
- **Toggleable Data Series**: Click legend items to show/hide "Credits Earned" or "Organic Matter" data
- **Dual Y-Axes**: Left axis for carbon credits, right axis for organic matter percentage
- **Custom Tooltips**: Hover over bars to see precise values with appropriate units (credits vs %)
- **Monthly Trends**: Track progress over 6-month periods
- **Badge Toggles**: Quick show/hide buttons below chart

**How to Use:**
1. View the bar chart in the Overview section of your Dashboard
2. Click on "Credits Earned" in the legend to toggle visibility
3. Click on "Organic Matter" to toggle that series
4. Hover over any bar for detailed information with exact values
5. Use the badge buttons below the chart for quick toggles

**Interpreting the Data:**
- **Credits Earned**: Higher values indicate better carbon sequestration practices
- **Organic Matter %**: 3.0%+ is considered good, 5.0%+ is excellent
- **Trend Analysis**: Look for upward trends in both metrics over time
- **Correlations**: Notice how organic matter improvements often correlate with carbon credit increases

**Best Practices:**
- Monitor monthly to track seasonal variations
- Compare year-over-year to measure long-term improvements
- Use toggles to focus on one metric at a time for detailed analysis

#### Task Status Distribution Pie Chart

**Interactive Features:**
- **Expanding Slices**: Hover over any slice to see it expand with detailed information
- **Status Breakdown**: Visual representation of Completed, In Progress, Pending, and Cancelled tasks
- **Percentage Display**: Automatic calculation of task distribution
- **Custom Tooltips**: Shows task count and percentage on hover
- **Center Labels**: Active slice displays count and name in chart center

**Task Status Meanings:**
- **Completed** (Green): Successfully finished tasks - 45% average
- **In Progress** (Blue): Currently active tasks - 28% typical
- **Pending** (Yellow): Scheduled but not started - 18% normal
- **Cancelled** (Red): Tasks that were stopped or skipped - 9% expected

**How to Analyze:**
1. Hover over each slice to see it expand and display details
2. Check completion percentage - aim for 70%+ completion rate
3. Monitor "In Progress" - should align with current season workload
4. Review "Cancelled" tasks - if >15%, investigate why

**Productivity Insights:**
- **High Completion (70%+)**: Excellent task execution
- **High Pending (30%+)**: May need to adjust scheduling
- **High Cancelled (15%+)**: Review task feasibility or resource allocation

---

## Field Management & Soil Visualization

### Enhanced Field Cards with Soil Analysis

Each field card now includes quick-view soil metrics and access to a comprehensive visualization modal with interactive charts.

#### Quick View Metrics

Displayed directly on field cards:
- **pH Level**: 0-14 scale with color-coded progress bar
- **Organic Matter**: Percentage with visual quality indicator
- **Crop Type**: Current or planned crop with icon
- **Field Area**: Total acreage for calculations

**Quick Interpretation:**
- pH 6.0-7.5 shows green (optimal)
- Organic Matter 3%+ shows green (good)
- Values outside ranges show amber/red (needs attention)

#### Soil Analysis Modal - Deep Dive

Access comprehensive soil data visualization by clicking "View Soil Analysis" on any field card.

**Modal Features:**

**1. Location Information Card**
- Property address (if available from soil analysis)
- County and state identification
- FIPS code reference for data traceability
- Map icon indicating geographic context

**2. N-P-K Nutrient Bar Chart**

**Interactive Visualization:**
- **Horizontal Bar Chart**: Clear representation of three key macronutrients
- **Dynamic Scaling**: 0-100 scale normalized from Low/Medium/High classifications
- **Custom Tooltips**: Hover to see nutrient name and level classification

**Color Coding System:**
- 🟢 **Green (High)**: 90/100 - Optimal levels, no immediate action needed
- 🟡 **Amber (Medium)**: 60/100 - Adequate but monitor, consider supplementation
- 🔴 **Red (Low)**: 30/100 - Critical deficiency, immediate attention required

**Interpreting N-P-K Levels:**

**Nitrogen (N):**
- High: Excellent for leafy growth, dark green foliage
- Medium: Sufficient for moderate growth, may need boost for heavy feeders
- Low: Stunted growth, yellowing leaves, urgent need for amendment

**Phosphorus (P):**
- High: Strong root development, good flowering/fruiting
- Medium: Adequate for most crops, consider supplementation for legumes
- Low: Poor root growth, delayed maturity, purple-tinted leaves

**Potassium (K):**
- High: Good disease resistance, strong stems
- Medium: Sufficient for general crops, monitor stress indicators
- Low: Weak stalks, poor drought tolerance, leaf margin burn

**3. pH Level Gauge**

**Visual Components:**
- **Large Numeric Display**: Current pH reading (e.g., 6.8)
- **Progress Bar**: Position on 0-14 scale
- **Status Badge**: "Optimal" (green) or "Needs Adjustment" (amber)
- **Reference Scale**: Three-point scale below bar

**pH Reference Ranges:**
- **0-6**: Acidic - Can limit nutrient availability
- **6-7.5**: Optimal - Best nutrient uptake for most crops
- **7.5-14**: Alkaline - May tie up micronutrients

**Crop-Specific pH Preferences:**
- Blueberries: 4.5-5.5 (acidic)
- Vegetables: 6.0-7.0 (slightly acidic to neutral)
- Alfalfa: 6.8-7.5 (neutral to slightly alkaline)

**Adjustment Strategies:**
- **Too Acidic (<6.0)**: Apply lime (calcium carbonate)
- **Too Alkaline (>7.5)**: Apply sulfur or organic amendments
- **Monitor**: Retest annually, adjust gradually

**4. Organic Matter Gauge**

**Display Features:**
- **Percentage Display**: Current organic matter content (e.g., 3.4%)
- **Quality Badge**: "Good" (≥3.0%) or "Low" (<3.0%)
- **Progress Bar**: Visualization on 0-10% scale
- **Benchmark Labels**: Poor → Good → Excellent indicators

**Organic Matter Quality Tiers:**
- **0-2%** (Poor): Minimum biological activity, poor structure
- **2-3%** (Fair): Developing soil health, needs improvement
- **3-5%** (Good): Active biology, good water retention
- **5-7%** (Very Good): Excellent structure, high nutrient cycling
- **7%+** (Excellent): Optimal for most soils, maximum benefits

**Benefits of High Organic Matter:**
- Improved water retention (saves irrigation)
- Better nutrient holding capacity
- Enhanced soil structure and drainage
- Increased microbial activity
- Greater resilience to drought and erosion

**Improvement Strategies:**
- Add compost (2-3 tons/acre annually)
- Plant cover crops (rye, clover, radish)
- Reduce tillage to preserve existing OM
- Leave crop residues in field
- Target 0.1-0.2% annual increase

**5. Nutrient Summary Badges**

**Quick Reference Display:**
- Three color-coded badges in a row
- **Nitrogen (N)** - First badge
- **Phosphorus (P)** - Middle badge
- **Potassium (K)** - Last badge

**Badge Colors Match Chart:**
- Green background: High level
- Amber background: Medium level
- Red background: Low level

**At-a-Glance Assessment:**
- All green: Excellent - maintain current practices
- Mixed colors: Targeted amendments needed
- All red: Comprehensive soil fertility program required

**6. Agronomist Recommendations Section**

**Professional Insights Card:**
- Highlighted in primary color accent
- Leaf icon indicating agricultural expertise
- Detailed text recommendations from soil analysis data

**Typical Recommendation Components:**
- **Lime Application**: Rate and timing if pH adjustment needed
- **Fertilizer Program**: N-P-K rates and product suggestions
- **Application Timing**: When to apply amendments (e.g., "Apply 2 weeks before planting")
- **Crop Selection**: Best crops for current soil conditions
- **Cover Crops**: Suggestions for building soil health
- **Organic Amendments**: Compost, manure, or bio-stimulant recommendations

**Using Recommendations Effectively:**
1. Read all recommendations before purchasing inputs
2. Prioritize by urgency (pH first, then major nutrients)
3. Consider budget constraints and phase improvements
4. Track implementation with Task Manager
5. Document results for next season's planning
6. Retest soil after major amendments (6-12 months)

**Example Recommendation Workflow:**
```
Soil Test Results: pH 5.8, Low P, Medium K
Recommendation: "Apply 2 tons/acre lime in fall. Add 100 lbs/acre P₂O₅ at planting."
Task Manager: Create "Apply Lime" task for October
Budget: Get lime quote, schedule application
Follow-up: Retest pH next spring
```

---

## Smart Task Management

### Dual Filter System

The Task Manager now includes advanced filtering capabilities to help you organize and prioritize seasonal work efficiently.

#### Status Filter

Filter tasks by their current state to focus on specific workflow stages:

**Available Status Options:**
- **All Statuses**: Complete unfiltered view of all tasks
- **Pending**: Tasks scheduled but not yet started
- **In Progress**: Currently active tasks requiring attention
- **Completed**: Successfully finished tasks (for reference)
- **Skipped**: Tasks intentionally not performed this season
- **Cancelled**: Tasks that were stopped before completion

**Status Filter Use Cases:**
- Morning planning: Filter to "Pending" to see today's work
- Daily check-in: Filter to "In Progress" to review active tasks
- End of season: Filter to "Completed" for record keeping
- Problem-solving: Filter to "Skipped"/"Cancelled" to identify patterns

#### Crop Type Filter

**Dynamic Extraction Feature:**
- Automatically detects all unique crops from your task database
- Extracts from `crops_involved` array in each task
- Alphabetically sorted for easy navigation
- Updates automatically as you add new crops to tasks

**Filter Options:**
- **All Crops**: Show tasks for all crop types (default view)
- **Individual Crops**: Filter to specific crop
  - Example: "Corn", "Soybeans", "Wheat", "Tomatoes"
  - Shows only tasks where selected crop is involved
  - Includes tasks with multiple crops if one matches

#### Combined Filtering - The Power of Dual Filters

**How It Works:**
- Select status filter AND crop filter simultaneously
- Tasks must match BOTH criteria to appear
- Live counter shows filtered results: "Showing X of Y tasks"
- Filters work together using AND logic

**Practical Examples:**

**Example 1: Pre-Season Corn Planning**
```
Status: Pending
Crop: Corn
Result: All upcoming corn-related tasks
Use: Plan equipment, order inputs, schedule labor
```

**Example 2: Daily Soybean Operations**
```
Status: In Progress
Crop: Soybeans
Result: Active soybean tasks requiring attention today
Use: Focus crew on specific crop operations
```

#### Live Task Counter

**Display Format:** "Showing X of Y tasks"
- **X**: Number of tasks matching current filters
- **Y**: Total number of tasks in system
- Updates in real-time as filters change

#### Clear Filters Button

- Appears only when one or more filters are active
- Single click resets both Status and Crop filters to "All"
- Returns to complete unfiltered task list

---

## Soil Analysis Interpretation

### Soil Analysis Results Page

The `SoilAnalysisResults` component provides a full-page view of your soil data with professional reporting features.

#### AI Executive Summary
- **SmartReportSummary** auto-generates a plain-language overview of your soil data
- Highlights key findings and recommended actions
- Powered by GPT-5 for contextual agricultural insights

#### pH Level Card
- Large numeric display with badge indicator
- **Acidic** (red, <6.0): May need lime application
- **Optimal** (green, 6.0-7.5): Good for most crops
- **Alkaline** (amber, >7.5): May need sulfur application
- Progress bar showing position on 0-14 scale

#### Nutrient Level Cards (N-P-K)
- Three separate cards for Nitrogen, Phosphorus, Potassium
- Each shows: level text, color-coded badge, progress bar
- Progress values: Low = 25%, Medium = 60%, High = 90%

#### Professional Report Value
- Reports support loan applications and property valuations
- References USDA 7 CFR 4279.244 and Farm Credit 12 CFR 614.4265
- Essential environmental due diligence documentation

### Property Soil Report

The `PropertySoilAnalysis` component provides real estate and construction-oriented soil analysis:

#### Foundation Risk Assessment
- Evaluates soil for expansive clay and bearing capacity
- Three risk levels: Low (green), Moderate (amber), High (red)
- Based on pH and organic matter indicators
- Recommends professional foundation inspection when warranted

#### Septic System Feasibility
- Assesses percolation and drainage potential
- Three levels: Good, Moderate, Challenging
- Considers pH range and organic matter content
- Identifies when alternative system designs may be required

#### Landscaping & Property Value Impact
- Scores landscaping potential from soil quality
- Estimates property value impact (+2-5% for excellent soil)
- Lists specific benefits and limitations

#### Professional Watermark
- Property address displayed as report watermark
- Prepared-by fields for professional name and entity
- Anti-fraud notice restricting use to specified property

---

## Seasonal Planning Assistant

### Overview

The Seasonal Planning Assistant is an AI-powered tool that generates comprehensive crop rotation and seasonal strategies tailored to your location, soil conditions, and preferences. It uses GPT-5 with weather integration and implements a robust state machine for reliable operation.

### Getting Started

1. Navigate to Seasonal Planning from the Dashboard
2. Select your county using the County Lookup tool
3. Configure planning parameters
4. Generate your AI-powered seasonal plan

### Location Selection

**County Lookup Integration:**
- Type your county name to search
- System uses FIPS code for precise data retrieval
- Selected location provides context for weather, climate zone, and growing season data
- Location must be selected before plan generation is enabled

### Planning Parameters

#### Planning Focus (Required)
Choose one of five planning types:

| Planning Type | Description |
|---|---|
| **Crop Rotation Planning** | Optimize multi-year crop sequences for soil health and yield |
| **Seasonal Planting Calendar** | Month-by-month planting and harvest schedules |
| **Soil Health Improvement** | Targeted strategies to build organic matter and fertility |
| **Market-Optimized Planning** | Align planting with market demand and pricing cycles |
| **Sustainable Practices** | Eco-friendly farming with reduced environmental impact |

#### Planning Timeframe (Required)
- **Next 12 Months**: Immediate seasonal planning
- **3-Year Plan**: Medium-term rotation and improvement strategy
- **5-Year Strategy**: Long-term soil health and productivity roadmap

#### Crop Preferences (Optional)
Select from 17 crop options via checkboxes:
- **Row Crops**: Corn, Soybeans, Wheat, Oats, Barley
- **Forage**: Alfalfa, Clover, Pasture Grasses
- **Vegetables**: Tomatoes, Peppers, Lettuce, Carrots, Potatoes, Onions
- **Other**: Cover Crops, Fruit Trees, Vegetable Gardens

Multiple crops can be selected to inform the AI about your rotation goals.

### State Machine Architecture

The planning assistant uses a state machine to provide clear feedback at every step:

```
idle → validating → loading (authenticating → fetching → generating) → success
                                                                      → error (retryable / non-retryable)
```

**States Explained:**

| State | What You See | What's Happening |
|---|---|---|
| **idle** | Generate button enabled | Ready for input |
| **validating** | Brief transition | Checking required fields |
| **loading / authenticating** | "Authenticating…" | Verifying your session |
| **loading / fetching** | "Fetching data…" | Preparing request to edge function |
| **loading / generating** | "AI analyzing seasonal factors…" | GPT-5 generating your plan |
| **success** | Plan displayed with model badge | Plan generated successfully |
| **error** | Error card with message | Something went wrong (see below) |

### Smart Retry & Error Handling

The assistant uses the centralized `withSmartRetry` utility for automatic recovery:

- **Transient errors** (503, 429, network timeouts): Automatically retried up to 3 times with exponential backoff. You'll see toast notifications like "Working on it… Retrying automatically (Attempt 1/3)"
- **Auth errors** (401, expired session): Retried once after session refresh attempt
- **Validation errors** (400, 422): Not retried — you'll see a clear message about what to fix
- **Fatal errors**: Not retried — "Something went wrong. Try refreshing."

When retries are exhausted, a **Retry button** appears in the error card for manual retry.

**Auto-reset**: Changing any input (location, planning type, timeframe, or crop preferences) automatically clears the error state, so you can adjust and try again without manually dismissing errors.

### Weather Context Display

After successful plan generation, a Weather Context card appears showing:
- **Current Season**: Based on location and date
- **USDA Zone**: Hardiness zone for your area
- **Growing Season**: Frost-free period length
- **Annual Rainfall**: Expected precipitation

### Generated Plan

The AI-generated plan is displayed as formatted text with:
- **Model badge** showing which AI model was used (e.g., GPT-5)
- **Markdown rendering** with bold, italic, and header formatting
- **Sanitized output** via DOMPurify for security
- Content tailored to your location, soil data, selected crops, and timeframe

---

## Variable Rate Technology (VRT)

### Overview

Variable Rate Technology enables precision agriculture by creating AI-powered prescription maps that optimize input application rates across your fields. Typically saves up to 30% on inputs while maintaining or improving yield.

### Creating a Prescription Map

Navigate to the VRT page and use the "Create Prescription" tab:

**Required Fields:**
1. **Select Field**: Choose from your registered fields (shows name and acreage)
2. **Base Application Rate**: Enter your standard rate (e.g., 150 lbs/acre)

**Optional Configuration:**
3. **Application Type**: Fertilizer (default), Seeding Rate, Irrigation/Water, or Pesticide
4. **Crop Type**: Free-text entry (e.g., Corn, Soybeans, Wheat)
5. **Rate Unit**: lbs/acre, seeds/acre, gallons/acre, or kg/hectare
6. **Target Yield**: Optional yield goal (e.g., 180 bu/acre)

### How VRT Works

1. AI analyzes your field's soil variability and crop requirements
2. Generates 3-5 management zones with optimized application rates
3. Creates prescription maps compatible with GPS-enabled tractors
4. Reduces input waste while maintaining or improving yield
5. Export to ADAPT, Shapefile, or ISO-XML formats for equipment

### My Prescription Maps

The "My Prescription Maps" tab displays all generated maps with:
- **Map Name**: Auto-generated descriptive name
- **Status Badges**: Draft, Approved, Applied, or Archived
- **Zone Count**: Number of management zones created
- **Base Rate**: Your specified application rate
- **Estimated Savings**: Percentage reduction in inputs
- **AI Confidence Score**: How confident the model is in the prescription
- **Management Zone Details**: Individual zone rates displayed in a grid

### Exporting Maps

Click the **Export** button on any prescription map to generate equipment-compatible files. Supported formats include ADAPT, Shapefile, and ISO-XML for direct import to GPS-enabled tractors and applicators.

---

## AlphaEarth Satellite Intelligence

### Overview

SoilSidekick Pro integrates with Google Earth Engine via the AlphaEarth platform to provide satellite-derived insights for your fields.

### Key Metrics

#### Vegetation Health (NDVI)
- **NDVI Score**: Normalized Difference Vegetation Index (0 to 1)
- **0.0-0.2**: Bare soil or very sparse vegetation
- **0.2-0.4**: Moderate vegetation, early growth stage
- **0.4-0.6**: Healthy vegetation, active growth
- **0.6-0.8**: Dense, very healthy vegetation
- **0.8-1.0**: Peak vegetation health

#### Soil Moisture
- Satellite-derived soil moisture estimates
- Helps time irrigation decisions
- Identifies wet/dry zones within fields

#### Thermal Stress Indicators
- Available on Professional and Enterprise tiers
- Detects crop heat stress before visual symptoms appear
- Enables proactive management interventions

### Using Satellite Data

1. Ensure your fields are registered with boundary coordinates
2. Navigate to the satellite view from your field card
3. Review NDVI, soil moisture, and thermal data layers
4. Compare with ground-truth soil analysis results
5. Use trends to validate management decisions

---

## Environmental Assessment & Water Quality

### Water Quality Analysis (TapWaterCheck Pro)

The Water Quality page provides comprehensive water testing data from EPA sources with territory-aware analysis.

#### Getting Started
1. Navigate to Water Quality from the Dashboard
2. Select your county using the County Lookup tool
3. System fetches water quality data via the territorial water quality edge function

#### Water Quality Grade
- **Letter grade** (A through F) displayed prominently
- Color-coded: A (green), B (blue), C (yellow), D/F (red)
- Shows utility name, PWSID, source type, and last tested date

#### Contaminant Analysis
- Lists all detected contaminants with current levels
- Compares against EPA Maximum Contaminant Levels (MCL)
- Visual progress bars show level relative to MCL
- **Violation flags** highlight contaminants exceeding safety limits
- Provides guidance: "Within EPA safety limits" or "Exceeds EPA safety limits - contact your water utility"

#### AI Executive Summary
- **SmartReportSummary** auto-generates a plain-language water quality overview
- Highlights key concerns and recommended actions

#### Regulatory Information
- Territory type (state, territory, compact state)
- Population served by the water system
- System type classification
- EPA Region assignment
- Regulatory authority and oversight details

#### Filter Recommendations
- Based on detected contaminants, suggests appropriate water filters
- **Carbon Block Filter**: Reduces chlorine taste and odor (95% reduction)
- **Reverse Osmosis System**: Comprehensive filtration for lead (99%) and nitrates (95%)

#### Professional PDF Export
- Full water quality report with `WaterQualityPDFExport` component
- Includes all contaminant data, grades, and regulatory information
- Suitable for professional documentation and record keeping

### Environmental Impact Scores
- Runoff risk assessment for your county
- Biodiversity impact evaluation
- Carbon footprint scoring
- Contamination risk level
- Eco-friendly alternative suggestions

---

## Local AI Processing

### Overview

SoilSidekick Pro supports fully offline agricultural intelligence using Google Gemma models running locally on your device via WebGPU. This provides privacy-preserving AI analysis without requiring internet connectivity.

### Requirements
- **Browser**: Chrome, Edge, or other WebGPU-compatible browser
- **RAM**: 4GB minimum (Gemma 2B) or 8GB (Gemma 7B)
- **Storage**: ~1.6GB (Gemma 2B) or ~4.2GB (Gemma 7B) for cached model

### Enabling Offline Mode

1. Open the **Offline AI Mode** card in your settings
2. Toggle the switch from "Online Mode" to "Offline Mode"
3. If this is your first time, the model will download and cache locally
4. Wait for initialization to complete — a "Ready" badge confirms the model is loaded

### Model Selection

| Model | Speed | Quality | RAM Required | Download Size |
|---|---|---|---|---|
| **Gemma 2B** | Faster | Good | 4GB | ~1.6GB |
| **Gemma 7B** | Slower | Better | 8GB | ~4.2GB |

### Response Length Options
- **Short** (128 tokens): Quick answers, basic recommendations
- **Medium** (256 tokens): Standard analysis and suggestions
- **Long** (512 tokens): Detailed reports and comprehensive plans

### Smart LLM Selection

The system can automatically choose between local and cloud AI based on:
- **Network availability**: Falls back to local when offline
- **Privacy mode**: Forces local processing for sensitive data
- **Battery saving**: Uses smaller models when battery is low
- **Auto mode**: Dynamically selects the best option

### Key Benefits
- **Privacy**: No data leaves your device during AI processing
- **Offline capability**: Works in remote farming areas without connectivity
- **No cloud costs**: AI processing runs on your hardware
- **GDPR compliance**: Zero PII transmission by architectural design

---

## Subscription Tiers

### B2B Licensing Model

SoilSidekick Pro offers three licensing tiers for plant ID apps and agricultural platforms:

#### Environmental Intelligence Starter — $500/month
- Environmental Compatibility Score API
- EPA Water Quality Integration
- Federal FIPS Location Intelligence
- Privacy-Preserving WebGPU AI (on-device)
- GDPR-compliant by design
- 50,000 API calls/month
- 1,000 req/min rate limit
- Email support (48hr response)
- Basic analytics dashboard

#### Satellite Monitoring Pro — $1,500/month *(Most Popular)*
- Everything in Starter
- AlphaEarth Satellite Intelligence
- Real-time NDVI & soil moisture data
- Thermal stress indicators
- Advanced on-device AI models
- 250,000 API calls/month
- 2,500 req/min rate limit
- Priority support (24hr response)
- Advanced analytics & reporting
- Custom integration support
- Quarterly business reviews

#### White-Label Enterprise — Custom Pricing
- Everything in Professional
- Unlimited API calls
- White-label branding options
- Custom domain support
- Dedicated account manager
- 24/7 phone & Slack support
- Custom SLA agreements
- On-premise deployment options
- Custom feature development

### Annual Billing
Switch to annual billing to save up to 8%:
- Starter: $5,520/year (save $480)
- Professional: $16,560/year (save $1,440)

### European Market Advantage
All tiers include GDPR-compliant on-device AI. European plant ID apps see **2.3x higher conversion** when highlighting on-device AI privacy.

---

## Service Resilience & Error Handling

### Centralized Error-Handling Utility

SoilSidekick Pro uses a centralized error-handling module (`src/lib/error-handling.ts`) across 8+ components and edge function calls to provide consistent, professional error recovery.

### Error Classification

All errors are automatically classified into four categories:

| Category | HTTP Codes | Examples | Behavior |
|---|---|---|---|
| **Transient** | 502, 503, 504, 429 | Network timeout, rate limit, server overload | Auto-retry with exponential backoff |
| **Auth** | 401 | Expired session, invalid JWT | Retry once after session refresh |
| **Validation** | 400, 422 | Missing fields, invalid input | Not retried — user guidance shown |
| **Fatal** | Other | Unknown server errors | Not retried — "Try refreshing" |

### Smart Retry with Exponential Backoff

When a transient error occurs, `withSmartRetry` automatically:

1. Catches the error and classifies it
2. Waits with exponential backoff (default: 2s for transient, 1s for auth)
3. Retries the operation (up to 3 attempts by default)
4. Shows non-destructive toast notifications with attempt progress
5. Throws the final error only after all retries are exhausted

**Backoff formula**: `delay = retryDelay ?? min(1000 × 2^(attempt-1), 5000ms)`

### Message Heuristics

Beyond HTTP status codes, the classifier also detects errors by message content:
- **Transient signals**: "network", "timeout", "fetch", "econnrefused", "rate limit", "too many requests"
- **Auth signals**: "no session", "auth", "unauthorized", "sign in", "jwt"
- **Validation signals**: "required", "invalid", "missing", "validation"

### Graceful Fallback Policy

Non-critical data-fetching issues (e.g., missing soil or weather data for a region) trigger **informational notifications** instead of destructive error alerts. This preserves a professional interface by acknowledging when the system uses regional or simulated defaults rather than alarming the user.

### Components Using This System

The centralized error handling is integrated across:
- Seasonal Planning Assistant (state machine + retry)
- Soil Analysis data fetching
- Water Quality edge function calls
- VRT prescription map generation
- County Lookup operations
- Agricultural Chat (GPT-5 integration)
- Cost Monitoring Dashboard
- API Key Management

---

## Troubleshooting

### Common Issues

#### "Please select a county first"
- The county lookup is required before generating plans or fetching data
- Type your county name in the search field and select from results
- Ensure the county is confirmed (shows in the "Selected Location" card)

#### "Authentication required. Please sign in."
- Your session has expired — sign in again from the Auth page
- The system will auto-detect expired sessions and prompt re-authentication
- If using trial mode, some features may require a full account

#### Plan generation fails repeatedly
- Check your internet connection — the edge function requires connectivity
- The system will auto-retry transient errors up to 3 times
- If the Retry button appears, click it to try again
- Change any input field to auto-clear the error state and try fresh

#### WebGPU Not Supported
- Local AI mode requires a WebGPU-compatible browser
- Use **Chrome 113+** or **Edge 113+** for best compatibility
- Firefox and Safari have limited or no WebGPU support
- Falls back to cloud AI when WebGPU is unavailable

#### Slow model download
- First-time Gemma model download can take several minutes
- Gemma 2B is ~1.6GB, Gemma 7B is ~4.2GB
- Once downloaded, the model is cached locally for instant future use
- Ensure stable internet connection during initial download

#### Water quality data unavailable
- Some rural counties may have limited EPA water data
- The system will show an informational message rather than an error
- Try a neighboring county for reference data
- Contact your local water utility for the most current testing results

#### VRT prescription map generation fails
- Ensure you have at least one registered field with boundary coordinates
- Both field selection and base application rate are required
- Check that your subscription tier supports VRT features

### Getting Help

- **Email Support**: Available on all tiers (48hr response for Starter)
- **Priority Support**: 24hr response on Professional tier
- **24/7 Support**: Phone & Slack on Enterprise tier
- **FAQ Page**: Visit `/faq` for regulatory references and common questions
- **API Documentation**: Visit `/leafengines-api` for developer resources
