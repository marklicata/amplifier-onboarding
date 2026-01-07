# Amplifier Onboarding - Telemetry Requirements

**Document Version:** 1.0  
**Date:** January 7, 2026  
**Status:** Requirements Gathering

---

## Overview

This document tracks telemetry and analytics requirements across the Amplifier Onboarding application. Since we don't have a telemetry solution in place yet, this serves as a requirements document for future implementation.

**Key Principle:** Privacy-first analytics. No user tracking, no PII, aggregate metrics only.

---

## Core Requirements

### Must-Haves
- **Privacy-first:** No user identification, no session tracking across visits
- **Aggregate only:** All metrics are counts and averages, never individual user data
- **Open source friendly:** Consider using self-hosted solutions (Plausible, Umami, Matomo)
- **Lightweight:** Minimal impact on page load and performance
- **GDPR compliant:** No cookies, no consent banners needed

### Nice-to-Haves
- Real-time dashboard for internal monitoring
- Export to CSV/JSON for analysis
- Custom event tracking
- A/B testing capability (without user tracking)

---

## Playground Metrics

### Engagement Metrics

**Page Views & Sessions**
- `playground_page_views`: Total visits to playground page
- `playground_unique_visitors`: Estimated unique visitors (IP-based, daily aggregates)
- `avg_session_duration`: Average time spent on playground
- `bounce_rate`: % of visitors who leave without interaction

**Example Interactions**
- `example_views`: Count of example detail views (by example_id)
- `example_runs`: Count of example executions (by example_id)
- `quick_run_clicks`: Count of "Quick Run" button clicks
- `configure_clicks`: Count of "Configure" button clicks
- `examples_per_session`: Average number of examples viewed per session

**View Mode Usage**
- `mode_selection`: Count of mode selections (normie, explorer, developer, expert)
- `mode_switches`: Count of users switching modes during a session
- `mode_distribution`: % breakdown of which modes are most used

### Discovery Metrics

**Search & Filters**
- `search_queries`: Count of search queries (anonymized, no query text stored)
- `filter_usage`: Count of filter interactions (by filter type: tier, category, audience)
- `empty_search_results`: Count of searches returning no results
- `example_clicks_from_search`: Count of example views from search results

**Navigation Patterns**
- `tier_distribution`: Which tiers get the most views (Tier 1, 2, 3, 4)
- `category_distribution`: Which categories are most popular
- `featured_click_through`: Click-through rate on featured examples

### Execution Metrics

**Performance**
- `execution_duration`: Average time from click to completion (by example_id)
- `first_module_download_time`: Time for first-time module downloads
- `execution_success_rate`: % of executions that complete successfully
- `execution_failure_rate`: % of executions that fail (by error type)

**Execution Flow**
- `executions_per_example`: How many times each example is run
- `concurrent_executions`: Peak number of simultaneous executions
- `execution_cancellations`: Count of user-cancelled executions
- `execution_retries`: Count of users re-running after failure

**Error Tracking**
- `error_types`: Breakdown of error types (rate_limit, api_error, timeout, etc.)
- `error_rate_by_example`: Which examples fail most often
- `rate_limit_hits`: Count of rate limit errors
- `api_timeout_rate`: % of executions that timeout

### Content Metrics

**Example Popularity**
- `most_viewed_examples`: Top 10 examples by views
- `most_run_examples`: Top 10 examples by executions
- `view_to_run_ratio`: Conversion rate from view to execution (by example)
- `least_popular_examples`: Examples with <5 runs in last 30 days

**Tier Progression**
- `tier_1_completion`: % of sessions that run at least one Tier 1 example
- `tier_progression`: % of users who progress from Tier 1 → Tier 2+
- `advanced_example_adoption`: % of sessions accessing Tier 3-4 examples

**Content Freshness**
- `new_example_adoption_time`: Days from publish to first 10 runs
- `example_age_distribution`: Age of examples that get run (new vs. old)

---

## Site-Wide Metrics

### Landing Page (Elevator Pitch)

**Traffic & Engagement**
- `landing_page_views`: Total visits to homepage
- `cta_clicks`: Clicks on "Get Started" / "Try Now" buttons
- `section_visibility`: How many users scroll to each section
- `video_plays`: If we add demo videos, track play count
- `github_link_clicks`: Clicks on "View on GitHub"

**Conversion Funnel**
- `landing_to_playground`: % of visitors who reach playground
- `landing_to_system_overview`: % who view architecture
- `landing_to_chat`: % who open chat modal

### System Overview Page

**Engagement**
- `system_overview_views`: Total visits to architecture page
- `diagram_interactions`: Clicks on interactive diagram elements (if applicable)
- `doc_link_clicks`: Clicks on external documentation links
- `time_on_page`: Average time spent on system overview

### Chat Feature

**Usage**
- `chat_opens`: Count of chat modal opens
- `messages_sent`: Total messages sent to chat
- `messages_per_session`: Average messages per chat session
- `chat_errors`: Count of chat API errors
- `chat_response_time`: Average response latency

**Engagement**
- `chat_sessions`: Number of chat sessions initiated
- `repeat_chat_usage`: % of sessions with multiple chat opens
- `chat_to_playground`: % of users who open playground after chat

---

## Technical Metrics

### Performance

**Page Load**
- `page_load_time`: Average page load time (by route)
- `time_to_interactive`: Time until page is interactive
- `first_contentful_paint`: Time to first content render
- `largest_contentful_paint`: Time to largest content render

**API Performance**
- `api_response_time`: Average API latency (by endpoint)
- `api_error_rate`: % of API calls that fail
- `api_success_rate`: % of API calls that succeed
- `slow_api_threshold`: Count of API calls >5s

**Resource Usage**
- `bundle_size`: JavaScript bundle size served
- `cache_hit_rate`: % of requests served from cache
- `cdn_performance`: CDN response times (if using CDN)

### Reliability

**Error Tracking**
- `javascript_errors`: Count of client-side errors (by type)
- `api_errors`: Count of server-side errors (by endpoint)
- `error_rate_by_browser`: Error breakdown by browser type
- `error_rate_by_device`: Error breakdown by device type

**Availability**
- `uptime`: % uptime (synthetic monitoring)
- `api_availability`: % of time APIs are responding
- `error_free_sessions`: % of sessions with no errors

---

## Example Sync Metrics

### GitHub Integration

**Sync Performance**
- `webhook_received`: Count of GitHub webhook events
- `example_sync_time`: Time to process and update examples
- `sync_success_rate`: % of syncs that complete successfully
- `sync_errors`: Count of sync failures (by error type)

**Content Updates**
- `examples_added`: Count of new examples added
- `examples_updated`: Count of examples modified
- `examples_removed`: Count of examples removed
- `sync_frequency`: Average time between syncs

---

## Implementation Considerations

### Technology Options

**Self-Hosted (Recommended)**
1. **Plausible Analytics**
   - Privacy-focused
   - No cookies, GDPR compliant
   - Lightweight script (<1KB)
   - Simple, clean dashboard
   - Open source

2. **Umami**
   - Self-hosted
   - Privacy-focused
   - Free, open source
   - Real-time dashboard

3. **Matomo**
   - More feature-rich
   - Self-hosted or cloud
   - GDPR compliant mode
   - Advanced analytics

**Cloud Options (If needed)**
- Plausible Cloud (paid)
- Simple Analytics (paid, privacy-focused)
- Fathom Analytics (paid, privacy-focused)

**Avoid:**
- Google Analytics (privacy concerns, overkill)
- Mixpanel/Amplitude (user-tracking focused)
- Any tool requiring cookie consent

### Implementation Strategy

**Phase 1: Basic Tracking**
- Page views by route
- Button clicks (CTA, run example, etc.)
- Basic error tracking

**Phase 2: Custom Events**
- Example views and runs
- Mode switches
- Filter usage
- Execution metrics

**Phase 3: Performance**
- Page load times
- API latency
- Error rates

**Phase 4: Advanced**
- Funnel analysis
- A/B testing (without user ID)
- Custom dashboards

### Event Structure

```javascript
// Custom event format
{
  event: 'example_run',
  properties: {
    example_id: '01_hello_world',
    tier: 1,
    mode: 'explorer',
    execution_time_ms: 3250,
    success: true
  }
}
```

### Privacy Safeguards

**What We Track:**
- Aggregate counts (page views, clicks, executions)
- Timing data (page load, API latency, execution duration)
- Error types (not error messages with PII)
- Browser/device type (for compatibility)

**What We DON'T Track:**
- User identifiers (no cookies, no user IDs)
- IP addresses (beyond daily aggregates)
- Search query text (only count of searches)
- Personal information
- Cross-session behavior

---

## Dashboard Requirements

### Internal Dashboard (For Team)

**Key Metrics Widget**
- Daily active visitors
- Examples run today
- Error rate
- Average execution time

**Playground Health**
- Most popular examples
- Execution success rate by example
- Mode distribution
- Tier progression

**Technical Health**
- API response times
- Error rates
- Page load performance
- Uptime status

**Content Performance**
- New example adoption
- Least popular examples (candidates for improvement)
- View-to-run conversion by example

### Public Dashboard (Optional)

Consider a public stats page showing:
- Total examples available
- Examples run (all-time)
- Most popular examples
- Community engagement

---

## Next Steps

1. **Choose Analytics Tool**
   - Recommendation: Start with Plausible (self-hosted)
   - Lightweight, privacy-first, sufficient for MVP

2. **Implementation Priority**
   - Phase 1: Basic page views and clicks
   - Phase 2: Playground-specific metrics
   - Phase 3: Performance monitoring

3. **Setup Tracking Plan**
   - Define event taxonomy
   - Document event properties
   - Create tracking implementation guide

4. **Build Dashboard**
   - Set up analytics dashboard
   - Configure key metrics
   - Share with team

---

## Glossary

- **Session:** A single visit to the site (ends after 30 min inactivity)
- **Visitor:** Unique IP per day (not tracked across days)
- **View:** Loading an example detail view
- **Run:** Executing an example
- **Mode:** User-selected view mode (Normie, Explorer, Developer, Expert)
- **Tier:** Example difficulty level (1-4)
- **Conversion:** Successfully running an example after viewing it
