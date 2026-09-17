# LeafEngines Focus Group Discussion Guide

**Purpose:** Validate B2B positioning assumptions through direct consumer feedback  
**Target Participants:** Current plant ID app users (5-8 per session)  
**Session Duration:** 60-90 minutes  
**Coding Framework:** Designed for NVivo/MAXQDA thematic analysis

---

## Pre-Session Setup

### Screening Criteria
- Uses a plant ID app at least 2x/month
- Has used their app for 3+ months
- Mix of casual gardeners and serious horticulturists
- Geographic diversity (urban, suburban, rural)

### Materials Required
- Consent forms (GDPR-compliant)
- Recording equipment (audio + video)
- Demo access to LeafEngines-enhanced app prototype
- Comparison screenshots (baseline vs. enhanced)
- Rating cards (1-10 scale)

---

## Discussion Guide

### SECTION 1: Current Experience (15 min)
**Code Theme: `CURRENT_BEHAVIOR`**

#### Opening Warm-Up
> "Tell us about the last time you used a plant identification app. Walk us through what happened."

**Probe Questions:**
- What app were you using? `[CODE: APP_PREFERENCE]`
- What prompted you to identify that plant? `[CODE: USE_CASE]`
- How confident were you in the result? `[CODE: BASELINE_CONFIDENCE]`
- What did you do with the identification result? `[CODE: ACTION_TAKEN]`

#### Pain Points Discovery
> "Think about times when your plant ID app didn't work well. What happened?"

**Probe Questions:**
- How often does this happen? `[CODE: FAILURE_FREQUENCY]`
- What do you do when the app gets it wrong? `[CODE: FAILURE_RESPONSE]`
- Have you ever acted on a wrong identification? What happened? `[CODE: CONSEQUENCE]`
- What would make you trust an identification more? `[CODE: TRUST_DRIVERS]`

---

### SECTION 2: Feature Concept Testing (25 min)
**Code Theme: `FEATURE_RECEPTION`**

#### Feature A: Environmental Context Verification
> "Imagine an app that not only identifies the plant but also checks whether that plant should naturally grow in your area based on your soil, climate, and water conditions."

**Show:** Side-by-side comparison (baseline ID vs. enhanced with environmental context)

**Questions:**
- What's your initial reaction? `[CODE: ENVIRO_INITIAL_REACTION]`
- How would this change how you use the app? `[CODE: ENVIRO_BEHAVIOR_CHANGE]`
- On a scale of 1-10, how valuable is this feature? `[CODE: ENVIRO_VALUE_RATING]`
- Would you pay extra for this? `[CODE: ENVIRO_WILLINGNESS_TO_PAY]`

#### Feature B: Dual Confidence Scoring
> "This app shows two confidence scores: one for how certain it is about the plant's identity, and another for how suitable that plant is for your specific location."

**Show:** Enhanced results with dual scoring display

**Questions:**
- Does this make the results more or less confusing? `[CODE: DUAL_SCORE_CLARITY]`
- How would you interpret a high ID confidence but low environmental compatibility? `[CODE: DUAL_SCORE_INTERPRETATION]`
- Value rating (1-10)? `[CODE: DUAL_SCORE_VALUE_RATING]`

#### Feature C: Offline/Privacy-First Operation
> "This version works completely offline—no internet required—and your plant data never leaves your device."

**Questions:**
- How important is privacy in plant identification? `[CODE: PRIVACY_IMPORTANCE]`
- Where would you use offline mode? `[CODE: OFFLINE_USE_CASES]`
- Does knowing data stays on-device change your comfort level? `[CODE: PRIVACY_COMFORT]`
- Value rating (1-10)? `[CODE: OFFLINE_VALUE_RATING]`

#### Feature D: Personalized Plant Learning
> "The app remembers which plants you've looked up before and learns your gardening interests over time, making suggestions based on your history."

**Questions:**
- How do you feel about the app tracking your plant history? `[CODE: TRACKING_SENTIMENT]`
- What would you want it to learn about you? `[CODE: PERSONALIZATION_DESIRES]`
- Value rating (1-10)? `[CODE: LEARNING_VALUE_RATING]`

---

### SECTION 3: Switching Intent (15 min)
**Code Theme: `SWITCHING_BEHAVIOR`**

#### Hypothesis 1: Switching TO LeafEngines-Enhanced App
> "If a different plant ID app offered all these features, how likely would you be to switch from your current app?"

**Rating Scale:** 1 (Definitely wouldn't switch) to 10 (Definitely would switch)

**Follow-up Probes:**
- What would make you switch? `[CODE: SWITCH_TRIGGERS]`
- What would prevent you from switching? `[CODE: SWITCH_BARRIERS]`
- How much would you pay for the enhanced app? `[CODE: PRICE_SENSITIVITY]`

#### Hypothesis 2: Staying IF Current App Added Features
> "If your current app added these same features, how much more likely would you be to continue using it?"

**Rating Scale:** 1 (No difference) to 10 (Much more likely to stay)

**Follow-up Probes:**
- Which feature matters most for retention? `[CODE: RETENTION_DRIVERS]`
- Would you pay for these as premium add-ons? `[CODE: ADDON_WILLINGNESS]`

---

### SECTION 4: Feature Prioritization (10 min)
**Code Theme: `FEATURE_PRIORITY`**

#### Forced Ranking Exercise
> "If you could only have ONE of these features, which would you choose?"

| Rank | Feature | Participant Votes |
|------|---------|-------------------|
| 1 | Environmental Context Verification | `[TALLY]` |
| 2 | Dual Confidence Scoring | `[TALLY]` |
| 3 | Offline/Privacy-First | `[TALLY]` |
| 4 | Personalized Learning | `[TALLY]` |

**Follow-up:**
- Why did you rank them this way? `[CODE: RANKING_RATIONALE]`
- Would your ranking change for a different use case (gardening vs. hiking vs. foraging)? `[CODE: CONTEXT_DEPENDENCY]`

---

### SECTION 5: Open Feedback (10 min)
**Code Theme: `UNSTRUCTURED_INSIGHTS`**

> "What haven't we asked about that's important to you when it comes to plant identification?"

**Probe Areas:**
- Missing features? `[CODE: FEATURE_GAPS]`
- Concerns about the concepts we showed? `[CODE: CONCERNS]`
- Suggestions for improvement? `[CODE: SUGGESTIONS]`

---

## Closing

### Quantitative Summary Card
**Each participant completes individually:**

```
1. Overall impression of LeafEngines features (1-10): ___
2. Likelihood to recommend enhanced app to a friend (1-10): ___
3. Current app satisfaction (1-10): ___
4. Willingness to pay premium for enhanced features (1-10): ___
5. Most valuable feature (circle one): 
   [ ] Environmental Context  [ ] Dual Scoring  
   [ ] Offline/Privacy        [ ] Personalized Learning
```

### Thank You & Incentive
- Provide incentive (gift card, free premium access, etc.)
- Offer early access to LeafEngines-enhanced app when available
- Collect contact for follow-up research permission

---

## Post-Session Analysis

### Coding Hierarchy for QDA Software

```
ROOT
├── CURRENT_BEHAVIOR
│   ├── APP_PREFERENCE
│   ├── USE_CASE
│   ├── BASELINE_CONFIDENCE
│   ├── FAILURE_FREQUENCY
│   └── TRUST_DRIVERS
├── FEATURE_RECEPTION
│   ├── ENVIRO_*
│   ├── DUAL_SCORE_*
│   ├── OFFLINE_*
│   └── LEARNING_*
├── SWITCHING_BEHAVIOR
│   ├── SWITCH_TRIGGERS
│   ├── SWITCH_BARRIERS
│   ├── RETENTION_DRIVERS
│   └── PRICE_SENSITIVITY
├── FEATURE_PRIORITY
│   ├── RANKING_RATIONALE
│   └── CONTEXT_DEPENDENCY
└── UNSTRUCTURED_INSIGHTS
    ├── FEATURE_GAPS
    ├── CONCERNS
    └── SUGGESTIONS
```

### Success Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| Environmental Context Value | ≥7.0 avg | Section 2A rating |
| Switching Intent | ≥6.5 avg | Section 3 Hypothesis 1 |
| Retention Impact | ≥7.0 avg | Section 3 Hypothesis 2 |
| Feature Consensus | >50% agreement | Section 4 top feature |
| Net Promoter Proxy | ≥7.5 avg | Closing Card Q2 |

### Report Template

1. **Executive Summary** (1 page)
2. **Methodology & Participant Demographics**
3. **Key Findings by Theme**
   - Current behavior patterns
   - Feature reception analysis
   - Switching/retention drivers
   - Feature prioritization
4. **Quantitative Summary**
5. **Strategic Recommendations**
6. **Appendix: Full Transcripts & Coding**

---

## Moderator Notes

### Do's
- Use neutral language ("this feature" not "our great feature")
- Allow silence for reflection
- Probe for specific examples
- Balance participant speaking time

### Don'ts
- Lead witnesses toward desired answers
- Dismiss negative feedback
- Allow one participant to dominate
- Reveal business strategy or competitive positioning
