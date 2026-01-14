# Amplifier Onboarding - Telemetry Implementation Plan

**Created:** 2026-01-14  
**Status:** Planning Phase  
**Owner:** TBD

---

## 📊 Executive Summary

This document outlines a comprehensive telemetry strategy for the Amplifier Onboarding application. The plan includes event tracking for all user interactions, Azure services architecture, cost estimates, and a phased implementation roadmap.

### Key Recommendations
- **Primary Solution:** Azure Application Insights + Log Analytics Workspace
- **Estimated Monthly Cost:** $10-60 (starting at $10-20 for initial traffic)
- **Implementation Timeline:** 5-6 weeks across 3 phases
- **Session Tracking:** Hybrid anonymous + authenticated approach

---

## 🔍 Current State Analysis

### What We Found

**✅ Strengths:**
- Clean slate - no existing telemetry to refactor or migrate
- Well-structured Next.js 14 application with TypeScript
- Clear user interaction points already identified
- Existing API routes ready for instrumentation

**❌ Gaps:**
- No analytics or tracking implementation
- No user authentication system (only basic string sessionIds)
- No session management infrastructure
- No performance monitoring
- No error tracking beyond console logs

### Tech Stack Context
- **Frontend:** Next.js 14 (App Router), React 18, TypeScript
- **Backend:** Python 3.9+ (Amplifier Core/Foundation)
- **Deployment Target:** Azure Static Web Apps → Azure Container Apps (planned)
- **Current APIs:** 
  - `/api/chat` - Chat interactions
  - `/api/playground/execute-bundle-stream` - Streaming bundle execution
  - `/api/playground/bundle-yaml` - Bundle configuration retrieval

---

## 🎯 Event Taxonomy

### Event Categories

| Category | Event Types | Description | Priority |
|----------|-------------|-------------|----------|
| **Page Events** | `page_view`, `page_exit`, `page_load_complete` | Navigation and page lifecycle | **High** |
| **Navigation** | `link_click`, `dropdown_open`, `menu_interact` | Header, footer, and menu interactions | **High** |
| **Chat Events** | `chat_opened`, `chat_closed`, `message_sent`, `response_received`, `chat_error` | Chat window interactions | **High** |
| **Playground Events** | `bundle_selected`, `bundle_executed`, `yaml_viewed`, `yaml_toggled`, `prompt_selected`, `custom_prompt_entered` | Playground interactions | **Critical** |
| **Recipe Events** | `recipe_selected`, `recipe_executed`, `recipe_input_changed`, `recipe_step_completed` | Recipe-specific tracking | **High** |
| **System Events** | `api_call`, `api_response`, `api_error`, `execution_duration`, `python_execution_start`, `python_execution_complete` | Backend and API performance | **Critical** |
| **Content Updates** | `content_rendered`, `markdown_rendered`, `code_highlighted`, `streaming_chunk_received` | Dynamic content rendering | **Medium** |
| **Performance** | `ttfb`, `fcp`, `lcp`, `cls`, `fid` | Web Vitals and performance metrics | **High** |
| **Errors** | `javascript_error`, `api_error`, `python_error`, `network_error` | Error tracking and debugging | **Critical** |

### Detailed Event Specifications

#### 1. Page View Events
```typescript
{
  event_type: "page_view",
  properties: {
    page_path: "/playground",
    page_title: "Amplifier - Playground",
    referrer: "https://example.com/overview",
    load_time_ms: 1234
  }
}
```

#### 2. Bundle Execution Events
```typescript
{
  event_type: "bundle_executed",
  properties: {
    bundle_id: "03-developer-bundle",
    bundle_name: "Full-stack Developer",
    prompt_length: 150,
    execution_time_ms: 5432,
    success: true,
    error_message?: "Error details if failed",
    output_length: 2048,
    is_streaming: true
  }
}
```

#### 3. Chat Interaction Events
```typescript
{
  event_type: "message_sent",
  properties: {
    message_length: 42,
    session_id: "amplifier-chat",
    is_first_message: false
  }
}

{
  event_type: "response_received",
  properties: {
    response_length: 856,
    response_time_ms: 3200,
    session_id: "amplifier-chat"
  }
}
```

#### 4. Error Events
```typescript
{
  event_type: "api_error",
  properties: {
    endpoint: "/api/playground/execute-bundle-stream",
    status_code: 500,
    error_message: "Python process exited with code 1",
    stack_trace?: "...",
    bundle_id?: "03-developer-bundle"
  }
}
```

---

## 🏗️ Event Schema Design

### Complete Event Structure

```typescript
interface TelemetryEvent {
  // ============================================
  // CORE IDENTIFIERS
  // ============================================
  event_id: string;              // UUID v4 - Unique event identifier
  event_type: string;            // Event name (e.g., "bundle_executed")
  event_category: string;        // Category (e.g., "playground")
  timestamp: string;             // ISO 8601 format
  
  // ============================================
  // SESSION & USER IDENTITY
  // ============================================
  session_id: string;            // Current browser session (sessionStorage)
  anonymous_id: string;          // Persistent anonymous ID (localStorage)
  user_id?: string;              // Set when authenticated (future)
  
  // ============================================
  // PAGE CONTEXT
  // ============================================
  page_url: string;              // Full URL including query params
  page_path: string;             // Path only (e.g., "/playground")
  page_title: string;            // Document title
  referrer?: string;             // Previous page URL
  
  // ============================================
  // EVENT-SPECIFIC DATA
  // ============================================
  properties: {
    // Varies by event type - examples:
    bundle_id?: string;
    prompt_length?: number;
    execution_time_ms?: number;
    error_message?: string;
    success?: boolean;
    [key: string]: any;
  };
  
  // ============================================
  // USER CONTEXT & DEVICE
  // ============================================
  user_agent: string;            // Full UA string
  browser: string;               // Parsed browser name
  browser_version: string;       // Parsed version
  os: string;                    // Operating system
  os_version: string;            // OS version
  device_type: "desktop" | "mobile" | "tablet";
  screen_resolution: string;     // e.g., "1920x1080"
  viewport_size: string;         // e.g., "1200x800"
  language: string;              // Browser language
  timezone: string;              // User timezone
  
  // ============================================
  // PERFORMANCE METRICS
  // ============================================
  page_load_time_ms?: number;    // Time to page fully loaded
  time_on_page_ms?: number;      // Duration on current page
  api_duration_ms?: number;      // API response time
  ttfb_ms?: number;              // Time to first byte
  fcp_ms?: number;               // First contentful paint
  lcp_ms?: number;               // Largest contentful paint
  
  // ============================================
  // TECHNICAL CONTEXT
  // ============================================
  app_version: string;           // From package.json
  environment: "production" | "development" | "staging";
  deployment_id?: string;        // Deployment identifier
  
  // ============================================
  // CORRELATION & TRACING
  // ============================================
  correlation_id?: string;       // For linking related events
  parent_event_id?: string;      // For event chains
  trace_id?: string;             // Distributed tracing
}
```

---

## ☁️ Azure Services Architecture

### Recommended Architecture: Application Insights

```
┌─────────────────────────────────────────────────────────────┐
│  Browser (Next.js Frontend)                                 │
│  ┌────────────────────────────────────────────────┐         │
│  │  @microsoft/applicationinsights-web             │         │
│  │  • Auto page views & navigation                 │         │
│  │  • Custom events (chat, playground, clicks)     │         │
│  │  • Performance timing (Web Vitals)              │         │
│  │  • Error tracking & stack traces                │         │
│  │  • Session correlation                          │         │
│  └───────────────────┬────────────────────────────┘         │
└────────────────────────┼────────────────────────────────────┘
                         │
                         │ HTTPS (Batched, Compressed)
                         ▼
┌─────────────────────────────────────────────────────────────┐
│  Azure Application Insights                                 │
│  • Real-time telemetry ingestion                            │
│  • Automatic correlation (browser → API → backend)          │
│  • Built-in dashboards & visualizations                     │
│  • Smart detection & anomaly alerts                         │
│  • Live metrics stream                                      │
│  • Dependency tracking                                      │
└───────────────────┬─────────────────────────────────────────┘
                    │
                    │ (Automatic integration)
                    ▼
┌─────────────────────────────────────────────────────────────┐
│  Azure Log Analytics Workspace                              │
│  • Long-term storage (30-730 days retention)                │
│  • KQL (Kusto Query Language) for custom queries            │
│  • Custom reports & workbooks                               │
│  • Data export to Blob Storage                              │
│  • Integration with Azure Monitor                           │
└───────────────────┬─────────────────────────────────────────┘
                    │
                    ├─────────────────────────────────────────┐
                    │                                         │
                    ▼                                         ▼
    ┌───────────────────────────┐          ┌──────────────────────────┐
    │  Azure Monitor Alerts      │          │  Power BI / Export       │
    │  • Error rate thresholds   │          │  • Custom dashboards     │
    │  • Performance degradation │          │  • Executive reports     │
    │  • Anomaly detection       │          │  • Data warehouse sync   │
    └───────────────────────────┘          └──────────────────────────┘
```

### Why Application Insights?

#### ✅ **Advantages**

1. **Native Azure Integration**
   - Works seamlessly with other Azure services
   - Single sign-on with Azure AD
   - Unified billing and management

2. **Automatic Tracking**
   - Page views, route changes
   - AJAX/fetch requests
   - Dependency calls
   - JavaScript exceptions
   - Performance metrics (Web Vitals)

3. **Real-time Dashboards**
   - Pre-built visualizations
   - No custom dashboard coding required
   - Live metrics stream for debugging
   - User flows and funnels

4. **Smart Detection**
   - AI-powered anomaly detection
   - Failure rate alerts
   - Performance degradation detection
   - Unusual user patterns

5. **Correlation**
   - Automatically links frontend → API → backend
   - Distributed tracing across services
   - End-to-end transaction tracking

6. **Developer Experience**
   - TypeScript SDK with IntelliSense
   - React/Next.js first-class support
   - Source map support for debugging
   - Local development mode

7. **Cost-Effective**
   - Pay only for data ingested (~$2.30/GB)
   - First 5GB/month included with workspace
   - Adaptive sampling to control costs
   - Data retention policies

#### ❌ **Considerations**

1. **Azure-Specific**
   - Vendor lock-in (but you're already on Azure)
   - Migration effort if switching clouds later

2. **Learning Curve**
   - KQL query language requires learning
   - Complex queries can be challenging initially

3. **Scaling Costs**
   - High-traffic apps can get expensive
   - Need to implement sampling and filtering

---

## 💰 Cost Analysis

### Azure Services Pricing Breakdown

| Service | Tier | Monthly Cost | Notes |
|---------|------|--------------|-------|
| **Application Insights** | Standard | $10-50 | Based on 5-20 GB/month data ingestion |
| **Log Analytics Workspace** | Pay-as-you-go | Included | First 5GB/month free with App Insights |
| **Azure Portal Dashboards** | N/A | Free | Unlimited custom dashboards |
| **Azure Monitor Alerts** | Standard | $0.10/alert | First 1,000 metric alerts free/month |
| **Data Retention (>90 days)** | Storage | ~$0.05/GB/month | For long-term archival |
| **Data Export (optional)** | Egress | Variable | If exporting to external systems |
| **Total (Initial)** | | **$10-20/month** | For low to moderate traffic |
| **Total (Growth)** | | **$30-60/month** | For higher traffic volumes |

### Cost Estimation Model

**Assumptions:**
- 1,000 daily active users
- 10 page views per user
- 50 custom events per user
- 5 API calls per user

**Data Volume Calculation:**
```
Daily Events = 1,000 users × (10 page views + 50 events + 5 API calls) = 65,000 events
Event Size ≈ 2 KB average
Daily Data = 65,000 × 2 KB = 130 MB
Monthly Data = 130 MB × 30 = 3.9 GB
Monthly Cost = 3.9 GB × $2.30/GB = $8.97 ≈ $10/month
```

### Cost Optimization Strategies

1. **Sampling**
   - Use adaptive sampling (30-50% for high-volume events)
   - Always capture errors and critical business events at 100%

2. **Filtering**
   - Filter out bot traffic (User-Agent detection)
   - Exclude health check pings
   - Don't track low-value interactions (mouse movements)

3. **Retention Policies**
   - 30 days: Detailed raw events
   - 90 days: Aggregated metrics
   - 1 year: Business KPIs only
   - Archive older data to cheaper Blob Storage

4. **Smart Tracking**
   - Track user intent, not every keystroke
   - Debounce rapid events (e.g., scrolling)
   - Batch events before sending

---

## 🚀 Implementation Roadmap

### Phase 1: Foundation (Week 1-2)

**Goal:** Basic tracking operational with core events

#### Week 1: Setup & Infrastructure

**Tasks:**
1. **Azure Resource Provisioning**
   ```bash
   # Create resource group
   az group create \
     --name amplifier-onboarding-rg \
     --location eastus

   # Create Application Insights
   az monitor app-insights component create \
     --app amplifier-onboarding \
     --location eastus \
     --resource-group amplifier-onboarding-rg \
     --application-type web \
     --retention-time 90

   # Get connection string
   az monitor app-insights component show \
     --app amplifier-onboarding \
     --resource-group amplifier-onboarding-rg \
     --query connectionString -o tsv
   ```

2. **Install Dependencies**
   ```bash
   npm install @microsoft/applicationinsights-web
   npm install --save-dev @types/applicationinsights-js
   ```

3. **Environment Configuration**
   ```bash
   # .env.local
   NEXT_PUBLIC_APPINSIGHTS_CONNECTION_STRING="InstrumentationKey=...;IngestionEndpoint=..."
   NEXT_PUBLIC_APP_VERSION="0.3.0"
   NEXT_PUBLIC_ENVIRONMENT="production"
   ```

#### Week 2: Core Implementation

**Tasks:**
1. **Create Telemetry Utilities** (`lib/telemetry.ts`)
   - Initialize Application Insights
   - Create identity management functions
   - Add custom event tracking helpers

2. **Integrate into Root Layout** (`app/layout.tsx`)
   - Load Application Insights globally
   - Initialize session tracking
   - Set up error boundaries

3. **Instrument Key Pages**
   - Home page (`app/page.tsx`)
   - Playground (`app/playground/page.tsx`)
   - Chat window (`components/ChatWindow.tsx`)

**Deliverables:**
- ✅ Application Insights configured and sending data
- ✅ Page views tracked automatically
- ✅ Basic custom events (chat, bundle execution)
- ✅ Session IDs generated and tracked

---

### Phase 2: Comprehensive Tracking (Week 3-4)

**Goal:** Track all user interactions and content updates

#### Week 3: User Interaction Tracking

**Tasks:**
1. **Navigation Tracking**
   - Header link clicks
   - Footer link clicks
   - Dropdown interactions
   - Mobile menu usage

2. **Playground Event Tracking**
   - Bundle selection
   - YAML viewer toggle
   - Prompt selection
   - Custom prompt entry
   - Execution button clicks

3. **Chat Event Tracking**
   - Chat window open/close
   - Message sent
   - Response received
   - Error states

4. **Recipe Tracking**
   - Recipe selection
   - Input field changes
   - Execution triggers
   - Step completion

#### Week 4: Performance & Content Tracking

**Tasks:**
1. **Performance Monitoring**
   - API response times
   - Bundle execution duration
   - Python script execution
   - SSE streaming metrics
   - Web Vitals (LCP, FID, CLS)

2. **Content Tracking**
   - Markdown rendering
   - Code syntax highlighting
   - Streaming chunk reception
   - YAML loading

3. **Error Tracking**
   - JavaScript errors
   - API errors
   - Python execution errors
   - Network failures
   - Bundle loading errors

**Deliverables:**
- ✅ All user interactions tracked
- ✅ Performance metrics captured
- ✅ Error tracking comprehensive
- ✅ Content rendering monitored

---

### Phase 3: Analytics & Insights (Week 5-6)

**Goal:** Actionable insights and dashboards

#### Week 5: Dashboards & Queries

**Tasks:**
1. **Create Custom Dashboards**
   - User journey visualization
   - Conversion funnels (landing → execution)
   - Popular bundles/recipes
   - Error rate trends
   - Performance metrics

2. **KQL Queries**
   - Daily active users
   - User retention cohorts
   - Feature usage analysis
   - Error pattern detection
   - Performance bottlenecks

3. **Workbooks**
   - Executive summary workbook
   - Developer debugging workbook
   - User behavior analysis workbook

#### Week 6: Alerts & Advanced Features

**Tasks:**
1. **Alert Configuration**
   - Error rate > 5%
   - API response time > 3s
   - Execution failures > 10/hour
   - Traffic anomalies

2. **Advanced Features**
   - A/B testing infrastructure
   - Feature flag tracking
   - User segmentation
   - Cohort analysis

3. **Documentation**
   - Query library
   - Dashboard usage guide
   - Alert response playbook
   - Data retention policies

**Deliverables:**
- ✅ Production dashboards deployed
- ✅ Alerts configured and tested
- ✅ Team trained on KQL queries
- ✅ Documentation complete

---

## 👤 User & Session Tracking Strategy

### Current Challenge: No Authentication

The application currently has:
- ❌ No user authentication system
- ❌ Only basic string sessionIds (e.g., "amplifier-chat")
- ❌ No persistent user identification

### Recommended: Hybrid Approach

#### Strategy Overview

Track users at three levels:
1. **Anonymous ID** (persistent, cross-session)
2. **Session ID** (temporary, per-session)
3. **User ID** (optional, when authenticated)

#### Implementation

```typescript
// lib/identity.ts

interface UserIdentity {
  anonymous_id: string;      // Persistent browser ID
  session_id: string;        // Current session
  user_id?: string;          // Set when authenticated (future)
  created_at: string;        // First visit timestamp
  last_seen: string;         // Most recent activity
}

/**
 * Get or create user identity
 * Handles both anonymous and authenticated users
 */
export const getOrCreateIdentity = (): UserIdentity => {
  // Anonymous ID - persists across browser sessions
  let anonymousId = localStorage.getItem('amp_anonymous_id');
  if (!anonymousId) {
    anonymousId = crypto.randomUUID();
    localStorage.setItem('amp_anonymous_id', anonymousId);
    localStorage.setItem('amp_created_at', new Date().toISOString());
  }
  
  // Session ID - new for each browser session
  let sessionId = sessionStorage.getItem('amp_session_id');
  if (!sessionId) {
    sessionId = crypto.randomUUID();
    sessionStorage.setItem('amp_session_id', sessionId);
  }
  
  // User ID - from authentication (GitHub OAuth, future)
  const userId = localStorage.getItem('amp_user_id');
  
  // Update last seen
  localStorage.setItem('amp_last_seen', new Date().toISOString());
  
  return {
    anonymous_id: anonymousId,
    session_id: sessionId,
    user_id: userId || undefined,
    created_at: localStorage.getItem('amp_created_at') || new Date().toISOString(),
    last_seen: new Date().toISOString()
  };
};

/**
 * Link anonymous ID to authenticated user
 * Call this after GitHub OAuth login (future feature)
 */
export const linkUserIdentity = (userId: string): void => {
  localStorage.setItem('amp_user_id', userId);
  
  // Track the linking event
  appInsights.trackEvent({
    name: 'user_identity_linked',
    properties: {
      anonymous_id: localStorage.getItem('amp_anonymous_id'),
      user_id: userId
    }
  });
};

/**
 * Clear user identity (logout)
 */
export const clearUserIdentity = (): void => {
  localStorage.removeItem('amp_user_id');
  
  // Keep anonymous_id and session_id for tracking
  appInsights.trackEvent({
    name: 'user_logged_out',
    properties: {
      anonymous_id: localStorage.getItem('amp_anonymous_id')
    }
  });
};
```

### Privacy Considerations

**GDPR/Privacy Compliance:**
- ✅ Anonymous IDs don't contain PII
- ✅ Users can opt-out (DNT header)
- ✅ Clear cookie policy needed
- ✅ Data retention limits (90 days default)
- ✅ User data deletion on request

**Implementation:**
```typescript
// Check Do Not Track preference
const shouldTrack = (): boolean => {
  const dnt = navigator.doNotTrack || (window as any).doNotTrack;
  return dnt !== '1' && dnt !== 'yes';
};
```

---

## 📋 Implementation Checklist

### Pre-Implementation
- [ ] Create Azure resource group
- [ ] Provision Application Insights resource
- [ ] Create Log Analytics workspace
- [ ] Obtain connection string
- [ ] Add environment variables
- [ ] Install npm dependencies

### Phase 1: Foundation
- [ ] Create `lib/telemetry.ts`
- [ ] Create `lib/identity.ts`
- [ ] Update `app/layout.tsx` with telemetry init
- [ ] Add page view tracking
- [ ] Implement session management
- [ ] Track basic events (chat, bundle execution)
- [ ] Test in development mode
- [ ] Verify data in Azure Portal

### Phase 2: Comprehensive Tracking
- [ ] Instrument Header component
- [ ] Instrument Footer component
- [ ] Instrument ChatWindow component
- [ ] Instrument Playground page
- [ ] Add click tracking hooks
- [ ] Add performance tracking
- [ ] Add error boundaries
- [ ] Test all tracked events

### Phase 3: Analytics & Insights
- [ ] Create custom dashboards
- [ ] Write KQL queries
- [ ] Configure alerts
- [ ] Create workbooks
- [ ] Document queries
- [ ] Train team on Application Insights
- [ ] Set up alert notification channels

---

## 🎯 Success Metrics & KPIs

### User Engagement Metrics

| Metric | Definition | Target | Query |
|--------|------------|--------|-------|
| **Daily Active Users (DAU)** | Unique users per day | 100+ | `pageViews \| summarize dcount(user_Id) by bin(timestamp, 1d)` |
| **Weekly Active Users (WAU)** | Unique users per week | 500+ | `pageViews \| summarize dcount(user_Id) by bin(timestamp, 7d)` |
| **Session Duration** | Average time per session | 5+ min | `pageViews \| summarize avg(session_Duration) by session_Id` |
| **Bounce Rate** | Single page visits | <40% | `pageViews \| where itemCount == 1 \| count` |

### Feature Adoption Metrics

| Metric | Definition | Target |
|--------|------------|--------|
| **Playground Usage Rate** | % of users who visit playground | 60%+ |
| **Bundle Execution Rate** | % of playground visitors who execute | 40%+ |
| **Chat Engagement Rate** | % of users who open chat | 30%+ |
| **Recipe Usage Rate** | % of users who try recipes | 20%+ |

### Performance Metrics

| Metric | Definition | Target |
|--------|------------|--------|
| **Page Load Time (P95)** | 95th percentile page load | <2s |
| **API Response Time (P95)** | 95th percentile API response | <3s |
| **Bundle Execution Time (avg)** | Average bundle execution | <8s |
| **Error Rate** | % of requests with errors | <2% |

### Business Metrics

| Metric | Definition | Target |
|--------|------------|--------|
| **Conversion Rate** | Landing → Bundle Execution | 15%+ |
| **Retention (Week 1)** | Users returning after 1 week | 30%+ |
| **Feature Discovery** | Users trying 2+ features | 40%+ |
| **User Satisfaction** | Inferred from engagement | High |

---

## 📊 Sample KQL Queries

### Daily Active Users
```kusto
pageViews
| where timestamp > ago(30d)
| summarize Users = dcount(user_Id) by Day = bin(timestamp, 1d)
| render timechart
```

### Popular Bundles
```kusto
customEvents
| where name == "bundle_executed"
| extend bundle_id = tostring(customDimensions.bundle_id)
| summarize Executions = count() by bundle_id
| order by Executions desc
| render barchart
```

### Error Rate Trend
```kusto
union exceptions, traces
| where severityLevel >= 3
| summarize ErrorCount = count() by bin(timestamp, 1h)
| render timechart
```

### User Funnel
```kusto
let users = pageViews 
| where timestamp > ago(7d)
| distinct user_Id;
let playgroundVisitors = pageViews
| where url contains "/playground"
| distinct user_Id;
let executors = customEvents
| where name == "bundle_executed"
| distinct user_Id;
print 
  TotalUsers = toscalar(users | count),
  PlaygroundVisitors = toscalar(playgroundVisitors | count),
  Executors = toscalar(executors | count)
```

### Performance by Bundle
```kusto
customEvents
| where name == "bundle_executed"
| extend 
    bundle_id = tostring(customDimensions.bundle_id),
    duration = todouble(customDimensions.execution_time_ms)
| summarize 
    AvgDuration = avg(duration),
    P50 = percentile(duration, 50),
    P95 = percentile(duration, 95),
    Count = count()
    by bundle_id
| order by AvgDuration desc
```

---

## 🔧 Code Implementation Examples

### 1. Initialize Telemetry (lib/telemetry.ts)

```typescript
import { ApplicationInsights } from '@microsoft/applicationinsights-web';
import { ReactPlugin } from '@microsoft/applicationinsights-react-js';

// React plugin for automatic component tracking
const reactPlugin = new ReactPlugin();

// Initialize Application Insights
const appInsights = new ApplicationInsights({
  config: {
    connectionString: process.env.NEXT_PUBLIC_APPINSIGHTS_CONNECTION_STRING!,
    enableAutoRouteTracking: true,  // Automatic SPA route tracking
    enableCorsCorrelation: true,    // Correlate CORS requests
    enableRequestHeaderTracking: true,
    enableResponseHeaderTracking: true,
    disableFetchTracking: false,    // Track fetch calls
    disableAjaxTracking: false,     // Track AJAX calls
    disableExceptionTracking: false,
    autoTrackPageVisitTime: true,   // Track time on page
    extensions: [reactPlugin],
    extensionConfig: {
      [reactPlugin.identifier]: { history: undefined } // We'll set this in _app
    }
  }
});

appInsights.loadAppInsights();

// Set user context
import { getOrCreateIdentity } from './identity';

const identity = getOrCreateIdentity();
appInsights.setAuthenticatedUserContext(
  identity.user_id || identity.anonymous_id,
  undefined,
  true  // Store in session
);

// Add custom properties to all events
appInsights.addTelemetryInitializer((envelope) => {
  envelope.data = envelope.data || {};
  envelope.data.anonymous_id = identity.anonymous_id;
  envelope.data.session_id = identity.session_id;
  envelope.data.app_version = process.env.NEXT_PUBLIC_APP_VERSION;
  envelope.data.environment = process.env.NEXT_PUBLIC_ENVIRONMENT;
});

export { appInsights, reactPlugin };
```

### 2. Root Layout Integration (app/layout.tsx)

```typescript
import { appInsights } from '@/lib/telemetry';
import { useEffect } from 'react';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    // Track page visibility
    const handleVisibilityChange = () => {
      if (document.hidden) {
        appInsights.trackEvent({
          name: 'page_hidden',
          properties: {
            page_path: window.location.pathname
          }
        });
      } else {
        appInsights.trackEvent({
          name: 'page_visible',
          properties: {
            page_path: window.location.pathname
          }
        });
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  );
}
```

### 3. Track Bundle Execution (app/playground/page.tsx)

```typescript
import { appInsights } from '@/lib/telemetry';

const handleExecuteBundle = async () => {
  const startTime = performance.now();
  
  // Track execution start
  appInsights.trackEvent({
    name: 'bundle_execution_started',
    properties: {
      bundle_id: selectedItem.bundleId,
      bundle_name: selectedItem.name,
      prompt_length: customPrompt.length,
      is_custom_prompt: !selectedItem.suggestedPrompts.includes(customPrompt)
    }
  });

  try {
    // ... execution code ...
    
    const endTime = performance.now();
    
    // Track success
    appInsights.trackEvent({
      name: 'bundle_executed',
      properties: {
        bundle_id: selectedItem.bundleId,
        bundle_name: selectedItem.name,
        prompt_length: customPrompt.length,
        execution_time_ms: endTime - startTime,
        success: true,
        output_length: executionResult.length
      }
    });
    
    // Track performance metric
    appInsights.trackMetric({
      name: 'bundle_execution_duration',
      average: endTime - startTime,
      properties: {
        bundle_id: selectedItem.bundleId
      }
    });
    
  } catch (error: any) {
    const endTime = performance.now();
    
    // Track failure
    appInsights.trackEvent({
      name: 'bundle_execution_failed',
      properties: {
        bundle_id: selectedItem.bundleId,
        execution_time_ms: endTime - startTime,
        error_message: error.message,
        error_type: error.name
      }
    });
    
    // Track exception
    appInsights.trackException({
      exception: error,
      properties: {
        bundle_id: selectedItem.bundleId,
        prompt_length: customPrompt.length
      }
    });
  }
};
```

### 4. Track Chat Interactions (components/ChatWindow.tsx)

```typescript
import { appInsights } from '@/lib/telemetry';

export default function ChatWindow({ isOpen, onClose }: ChatWindowProps) {
  // Track when chat opens
  useEffect(() => {
    if (isOpen) {
      appInsights.trackEvent({
        name: 'chat_opened',
        properties: {
          from_page: window.location.pathname
        }
      });
    } else {
      appInsights.trackEvent({
        name: 'chat_closed',
        properties: {
          message_count: messages.length,
          session_duration_ms: Date.now() - sessionStartTime
        }
      });
    }
  }, [isOpen]);

  const handleSendMessage = async () => {
    const messageStartTime = performance.now();
    
    // Track message sent
    appInsights.trackEvent({
      name: 'message_sent',
      properties: {
        message_length: input.length,
        message_number: messages.length,
        session_id: 'amplifier-chat'
      }
    });

    try {
      const response = await fetch('/api/chat', { /* ... */ });
      const data = await response.json();
      
      const messageEndTime = performance.now();
      
      // Track response received
      appInsights.trackEvent({
        name: 'response_received',
        properties: {
          response_length: data.response.length,
          response_time_ms: messageEndTime - messageStartTime,
          session_id: 'amplifier-chat'
        }
      });
      
    } catch (error: any) {
      // Track error
      appInsights.trackException({
        exception: error,
        properties: {
          context: 'chat_interaction',
          session_id: 'amplifier-chat'
        }
      });
    }
  };

  return (/* ... */);
}
```

### 5. Track API Performance (app/api/playground/execute-bundle-stream/route.ts)

```typescript
// NOTE: Application Insights automatically tracks API calls from the frontend
// For backend tracking, use the Node.js SDK

import { TelemetryClient } from 'applicationinsights';

// Initialize in API route (if using backend telemetry)
const appInsights = new TelemetryClient(
  process.env.APPINSIGHTS_CONNECTION_STRING
);

export async function POST(request: NextRequest) {
  const startTime = Date.now();
  
  try {
    const body = await request.json();
    
    // ... execution logic ...
    
    const duration = Date.now() - startTime;
    
    // Track custom metric
    appInsights.trackMetric({
      name: 'api_duration',
      value: duration,
      properties: {
        endpoint: '/api/playground/execute-bundle-stream',
        bundle_id: body.bundleId
      }
    });
    
    return new Response(/* ... */);
    
  } catch (error) {
    appInsights.trackException({
      exception: error,
      properties: {
        endpoint: '/api/playground/execute-bundle-stream'
      }
    });
    
    throw error;
  }
}
```

---

## 🛡️ Privacy & Security Considerations

### Data Privacy

1. **No PII Collection**
   - Don't track email addresses, names, or personal data
   - Anonymous IDs are random UUIDs, not tied to identity
   - User IDs only when explicitly authenticated

2. **GDPR Compliance**
   - Provide cookie consent banner
   - Honor Do Not Track (DNT) headers
   - Allow users to opt-out
   - Support data deletion requests
   - Limit data retention (90 days default)

3. **Cookie Policy**
   ```typescript
   // Check for consent before tracking
   const hasConsent = (): boolean => {
     return localStorage.getItem('amp_tracking_consent') === 'true';
   };
   
   // Only initialize if consent given
   if (hasConsent()) {
     appInsights.loadAppInsights();
   }
   ```

### Security

1. **Connection String Protection**
   - Use environment variables
   - Don't commit to git
   - Rotate keys regularly

2. **Data Sanitization**
   - Never log passwords or API keys
   - Sanitize user input before tracking
   - Redact sensitive data from errors

3. **Access Control**
   - Limit Azure Portal access (RBAC)
   - Use Azure AD for authentication
   - Enable audit logging

---

## 📚 Documentation & Training

### Team Training Needs

1. **For Developers:**
   - How to add custom events
   - When to track vs. not track
   - Testing telemetry locally
   - Reading Application Insights dashboards

2. **For Product Managers:**
   - Accessing dashboards
   - Understanding metrics
   - Creating custom reports
   - Setting up alerts

3. **For Leadership:**
   - Executive dashboard overview
   - Key business metrics
   - Trend analysis
   - ROI measurement

### Documentation To Create

- [ ] Telemetry implementation guide
- [ ] Event catalog (this document)
- [ ] KQL query library
- [ ] Dashboard user guide
- [ ] Alert response playbook
- [ ] Privacy policy updates
- [ ] Cookie policy
- [ ] Data retention policy

---

## ✅ Acceptance Criteria

### Phase 1 Complete When:
- [ ] Application Insights sending data
- [ ] Page views tracked on all pages
- [ ] Session IDs generated and tracked
- [ ] Basic events captured (chat, bundle execution)
- [ ] Data visible in Azure Portal

### Phase 2 Complete When:
- [ ] All user clicks tracked
- [ ] Performance metrics captured
- [ ] Error tracking comprehensive
- [ ] API calls monitored
- [ ] Content rendering tracked

### Phase 3 Complete When:
- [ ] Custom dashboards deployed
- [ ] Alerts configured and tested
- [ ] Team trained on queries
- [ ] Documentation complete
- [ ] Privacy policy updated

---

## 🔄 Maintenance & Iteration

### Weekly Tasks
- Review error logs
- Check alert notifications
- Monitor cost usage
- Review top queries

### Monthly Tasks
- Analyze trend changes
- Update dashboards
- Review retention policies
- Assess alert thresholds
- Team feedback session

### Quarterly Tasks
- Review event taxonomy
- Archive old data
- Update cost projections
- Feature usage analysis
- User behavior studies

---

## 📞 Support & Resources

### Azure Documentation
- [Application Insights Overview](https://learn.microsoft.com/en-us/azure/azure-monitor/app/app-insights-overview)
- [Application Insights for JavaScript](https://learn.microsoft.com/en-us/azure/azure-monitor/app/javascript)
- [KQL Query Reference](https://learn.microsoft.com/en-us/azure/data-explorer/kusto/query/)

### Contact Points
- **Implementation Lead:** [TBD]
- **Azure Admin:** [TBD]
- **Product Owner:** [TBD]

---

## 📅 Timeline Summary

| Phase | Duration | Key Milestones |
|-------|----------|----------------|
| Phase 1 | 2 weeks | Basic tracking operational |
| Phase 2 | 2 weeks | Comprehensive tracking deployed |
| Phase 3 | 2 weeks | Dashboards and alerts live |
| **Total** | **6 weeks** | Full telemetry system operational |

---

## 🎉 Expected Outcomes

After full implementation, you will be able to answer:

✅ **User Behavior Questions:**
- Which bundles are most popular?
- What's the typical user journey?
- Where do users drop off?
- How long do users engage with the playground?

✅ **Performance Questions:**
- Which bundles are slowest?
- What's the P95 API response time?
- Are there performance regressions?
- How does performance impact usage?

✅ **Business Questions:**
- What's the conversion rate from landing to execution?
- What's the week-over-week growth?
- Which features drive retention?
- What's the ROI of new features?

✅ **Technical Questions:**
- What errors are users experiencing?
- Which APIs need optimization?
- Are there patterns in failures?
- What's the error impact on user experience?

---

**Document Version:** 1.0  
**Last Updated:** 2026-01-14  
**Next Review:** After Phase 1 completion
