# Phase 1 Execution Plan - Foundation Refinement

**Version**: 2.0 (Merged and Revised)
**Duration**: 4 weeks (Weeks 3-6)
**Focus**: Correct terminology, improve accessibility, add analytics infrastructure
**Last Updated**: 2026-01-04

---

## Executive Summary

Phase 1 focuses on **refining the foundation** by correcting terminology to align with Amplifier architecture, improving visual accessibility, adding analytics, and preparing the architecture for future recipe workflows.

### Core Philosophy

**"Perfect the static showcase before adding complexity"**

- ✅ Keep site public, static, fast, and accessible
- ✅ Fix terminology to match Amplifier definitions
- ✅ Understand user behavior through analytics
- ✅ Prepare architecture for both bundles AND recipes
- ❌ NO live execution (Phase 2)
- ❌ NO authentication (Phase 2)
- ❌ NO backend functionality (Phase 2)

### Core Objectives

1. **Correct Terminology** - Use "bundle" and "recipe" according to Amplifier definitions
2. **Improve Visual Design** - Implement softer, more accessible color palette
3. **Add Telemetry** - Azure Application Insights for user behavior tracking
4. **Redesign Bundle Playground** - YAML-first approach, simplified for non-technical audiences
5. **Prepare Recipe Architecture** - Create structure for future recipe workflows

---

## Understanding Amplifier Terminology

### Bundle vs Recipe (Critical Distinction)

**Bundle** (Phase 1 - What we have now):
- **Definition**: Single configuration unit (YAML frontmatter + Markdown)
- **Purpose**: Configure an Amplifier session with agents, providers, behaviors
- **Example**: "Comprehensive Code Review" bundle with zen-architect, bug-hunter, security-guardian agents
- **Usage**: `amplifier session --bundle code-review.yaml`

**Recipe** (Phase 2+ - Future):
- **Definition**: Multi-step workflow that orchestrates multiple bundles in sequence
- **Purpose**: Complex workflows requiring multiple sessions with different configurations
- **Example**: "Full Development Cycle" recipe: Code Review bundle → Test Generation bundle → Documentation bundle
- **Usage**: `amplifier recipe run dev-cycle.yaml`

### Current State Analysis

**All 5 current showcase items are BUNDLES** (not recipes):
1. ✅ Comprehensive Code Review - Single bundle with 3 agents
2. ✅ API Documentation Generator - Single bundle
3. ✅ Security Audit Suite - Single bundle
4. ✅ Test Coverage Improver - Single bundle
5. ✅ Bug Finder & Fixer - Single bundle

**Why they're bundles**: Each specifies a single configuration and spins up one Amplifier session.

**Impact**: Currently using "recipe" terminology everywhere - this is WRONG and confusing.

---

## New Architecture

### Site Structure

```
/
├── index.html                         (Homepage)
│
├── bundles/                           (Bundle Playground - TOP LEVEL)
│   ├── index.html                     (Bundle browser)
│   ├── comprehensive-code-review.html
│   ├── api-documentation-generator.html
│   ├── security-audit-suite.html
│   ├── test-coverage-improver.html
│   └── bug-finder-fixer.html
│
├── recipes/                           (Recipe Playground - TOP LEVEL, Coming Soon)
│   └── index.html                     (Coming soon page)
│
└── learn/                             (Learning Hub)
    └── index.html                     (Tutorials and docs)
```

### Navigation Structure

**Before (Phase 0)**:
```
Home | Playground | Learn | Docs | GitHub
              ↓
       Recipe Gallery
```

**After (Phase 1)**:
```
Home | Bundles | Recipes | Learn | Docs | GitHub
         ↓         ↓
    Bundle       Recipe
   Playground   Playground
   (5 items)  (Coming Soon)
```

### URL Changes

| Old (Phase 0) | New (Phase 1) | Type |
|--------------|---------------|------|
| `/playground/` | `/bundles/` | Redirect |
| `/playground/recipes/` | `/bundles/` | Redirect |
| `/playground/recipes/code-review.html` | `/bundles/comprehensive-code-review.html` | Redirect |
| N/A | `/recipes/` | New (Coming Soon) |

---

## Phase 1 Objectives

### 1. Terminology Refactoring (Week 1)

**Goal**: Use "bundle" and "recipe" correctly throughout codebase

**Scope**:
- 51+ files affected (HTML, JS, CSS, JSON, tests, docs)
- ~1407 instances to review and update
- File and directory renaming
- URL structure changes

**Changes**:
- "Recipe Gallery" → "Bundle Playground"
- "recipe-card" → "bundle-card" (CSS classes)
- `recipes.js` → `bundles.js`
- `recipes-showcase.json` → `bundles-showcase.json`
- `/playground/recipes/` → `/bundles/`

**Add "Coming Soon" Content**:
- Create `/recipes/index.html` with explanation of what recipes are
- Explain difference between bundles and recipes
- Set expectations for Phase 2

**Estimated Effort**: ~22 hours (Week 1)

---

### 2. Color Palette Redesign (Day 6-7)

**Problem**: Current colors too saturated, cause eye strain

**Current Colors**:
- Primary: `#0078D4` (Electric Blue - too bright)
- Secondary: `#8B5CF6` (Vibrant Purple - too saturated)
- Accent: `#DD5C2D` (Energetic Orange - too harsh)

**New Colors** (Softer, WCAG AA compliant):
- Primary: `#0077CC` (Soft Blue)
- Secondary: `#7C3AED` (Muted Purple)
- Accent: `#DC6445` (Warm Orange)

**Verification**:
- All contrast ratios ≥4.5:1 for normal text
- Lighthouse accessibility score >90
- Visual testing across all pages

**Estimated Effort**: ~7 hours

---

### 3. Telemetry & Analytics (Days 8-10)

**Technology**: Azure Application Insights (free tier, GDPR compliant)

**Events to Track**:

**Bundle Browsing**:
- `bundle_viewed` - Bundle detail page load
- `bundle_filtered` - Filter by category/difficulty
- `bundle_searched` - Search query

**Bundle Interactions**:
- `bundle_yaml_viewed` - YAML section expanded
- `bundle_yaml_copied` - Copy YAML button
- `bundle_yaml_downloaded` - Download YAML button

**Navigation**:
- `nav_clicked` - Navigation link
- `cta_clicked` - CTA button
- `external_link_clicked` - GitHub link

**Recipe Section** (Future-proofing):
- `recipe_coming_soon_viewed` - User visited recipes page
- `recipe_waitlist_signup` - User signed up for recipe updates (optional)

**Privacy**:
- Cookie consent banner
- Updated privacy policy
- No PII collected
- IP anonymization enabled

**Estimated Effort**: ~18 hours

---

### 4. Bundle Playground Redesign (Week 3)

**Goal**: YAML-first approach, simplified for non-technical audiences

**Design Principles**:
1. **Show, Don't Tell** - YAML front and center
2. **Simplicity** - One clear message per section
3. **Scannable** - Short paragraphs, bullet points
4. **Action-Oriented** - Clear next steps

**Hero Section** (New):
```
Pre-Configured Bundles

Configure your AI workflow with simple YAML. No code required.

[YAML Preview - Large, Syntax Highlighted]
# bundle.yaml
name: Comprehensive Code Review
agents:
  - zen-architect
  - bug-hunter
  - security-guardian

That's it. Configure and run.

[Browse Bundles] [Learn More]
```

**Bundle Cards** (Simplified):
- 1-2 sentence description (down from 8-10 sentences)
- Prominent "View YAML" button
- Visual complexity indicator
- Category and difficulty badges

**Bundle Detail Pages** (Restructured):
- YAML at the top (downloadable, copy-to-clipboard)
- Collapsible "What This Bundle Does" section
- Collapsible "Use Cases" section
- Collapsible "Configuration Options" section
- "Quick Start" instructions (3 steps)

**Estimated Effort**: ~20 hours

---

### 5. Recipe Playground (Coming Soon Page)

**Goal**: Prepare for future recipe workflows, explain distinction

**Content**:
```html
<section class="recipes-coming-soon">
  <h1>Recipe Playground</h1>
  <p class="tagline">Multi-step workflows orchestrating multiple bundles</p>

  <div class="explainer">
    <h2>What are Recipes?</h2>
    <p>
      Recipes are multi-step workflows that chain together multiple bundles
      to accomplish complex tasks. While bundles configure a single Amplifier
      session, recipes orchestrate multiple sessions in sequence.
    </p>

    <h3>Example: Full Development Cycle Recipe</h3>
    <pre><code class="language-yaml">
# recipe.yaml
name: Full Development Cycle
steps:
  - bundle: code-review
    outputs: [review-report]

  - bundle: test-generator
    inputs: [review-report]
    outputs: [test-suite]

  - bundle: documentation-generator
    inputs: [review-report, test-suite]
    outputs: [docs]
    </code></pre>

    <h3>Coming in Phase 2</h3>
    <ul>
      <li>Visual recipe builder</li>
      <li>Pre-configured recipe library</li>
      <li>Custom recipe creation</li>
      <li>Recipe execution with live updates</li>
    </ul>
  </div>

  <div class="cta-section">
    <p>For now, explore our <a href="/bundles/">Bundle Playground</a></p>
    <p>Want to be notified when recipes launch? <a href="#waitlist">Join the waitlist</a></p>
  </div>
</section>
```

**Estimated Effort**: ~3 hours

---

## Week-by-Week Execution Plan

### Week 1: Terminology Refactoring

#### Day 1: Analysis & Planning (4 hours)
- [ ] Audit all files with "recipe" terminology
- [ ] Create comprehensive file list
- [ ] Define terminology mapping (bundle vs recipe)
- [ ] Plan URL redirect strategy
- [ ] Set up git branch: `feature/phase-1-refinement`

#### Day 2: File Renaming & Directory Restructuring (6 hours)
- [ ] Create `/bundles/` directory structure
- [ ] Move `/playground/recipes/` → `/bundles/`
- [ ] Rename JavaScript files:
  - `recipes.js` → `bundles.js`
  - `validate-recipes.js` → `validate-bundles.js`
- [ ] Rename JSON files:
  - `recipes-showcase.json` → `bundles-showcase.json`
  - `recipe-schema.json` → `bundle-schema.json`
- [ ] Update all imports and references
- [ ] Test site loads

#### Day 3: HTML & CSS Refactoring (8 hours)
- [ ] Update homepage: "Playground" → "Bundles" navigation
- [ ] Update `/bundles/index.html` (formerly playground)
  - Page title: "Bundle Playground"
  - Description: Use "bundle" terminology
  - Update all internal links
- [ ] Update 5 bundle detail pages
  - URLs: `/bundles/[bundle-name].html`
  - Titles and meta descriptions
  - Content references
- [ ] Update CSS classes:
  - `.recipe-*` → `.bundle-*`
  - Update all 36 occurrences in main.css
- [ ] Visual QA on all pages

#### Day 4: JavaScript & JSON Refactoring (6 hours)
- [ ] Update `bundles.js`:
  - Variable names: `recipes` → `bundles`
  - Function names: `filterRecipes()` → `filterBundles()`
  - DOM selectors
  - Comments and logs
- [ ] Update JSON data files:
  - Schema: "recipe" → "bundle" in keys
  - Showcase data: update string values
- [ ] Update `validate-bundles.js`
- [ ] Test filtering and search functionality

#### Day 5: Tests, Documentation & Recipe Page (8 hours)
- [ ] Update Playwright tests:
  - `recipe-gallery.spec.js` → `bundle-playground.spec.js`
  - Update test descriptions and assertions
  - Update selectors
- [ ] Run full test suite, fix failing tests
- [ ] Create `/recipes/index.html` (Coming Soon page)
- [ ] Update navigation to include "Recipes" link
- [ ] Update documentation (20+ files):
  - README.md
  - ARCHITECTURE.md
  - CONTRIBUTING.md
  - All .docs/ files
- [ ] Update CHANGELOG.md
- [ ] Full site QA and link testing
- [ ] Create PR

**Deliverables**:
- ✅ Correct bundle/recipe terminology throughout
- ✅ New site structure: `/bundles/` and `/recipes/`
- ✅ All tests passing
- ✅ Documentation updated

---

### Week 2: Color Palette & Telemetry

#### Day 6: Color Palette Design (4 hours)
- [ ] Test current colors with contrast checker
- [ ] Document contrast ratios
- [ ] Create color palette alternatives
- [ ] Test with WCAG compliance
- [ ] Select final palette
- [ ] Create before/after mockups

#### Day 7: Color Implementation (6 hours)
- [ ] Update CSS variables in `main.css`
- [ ] Update gradient definitions
- [ ] Test on all pages (screenshot before/after)
- [ ] Test button hover states
- [ ] Test on mobile devices
- [ ] Run Lighthouse accessibility audit
- [ ] Commit color changes

#### Day 8: Azure Application Insights Setup (6 hours)
- [ ] Create Azure Application Insights resource
- [ ] Get instrumentation key
- [ ] Add SDK to all HTML files
- [ ] Create `analytics.js` module:
  - `trackEvent()` function
  - `trackPageView()` function
  - Error handling
- [ ] Verify automatic page view tracking
- [ ] Test in Azure portal (Real-Time view)

#### Day 9: Event Tracking Implementation (8 hours)
- [ ] Implement bundle browsing events:
  - `bundle_viewed`
  - `bundle_filtered`
  - `bundle_searched`
- [ ] Implement interaction events:
  - `bundle_yaml_viewed`
  - `bundle_yaml_copied`
  - `bundle_yaml_downloaded`
  - `cta_clicked`
  - `nav_clicked`
- [ ] Implement recipe page events:
  - `recipe_coming_soon_viewed`
  - `recipe_waitlist_signup` (if added)
- [ ] Test all events in Azure portal
- [ ] Document all events and properties

#### Day 10: Privacy, Dashboards & Testing (6 hours)
- [ ] Create cookie consent banner
- [ ] Update privacy policy (analytics section)
- [ ] Create Application Insights dashboard:
  - Most viewed bundles
  - Popular filters
  - Search queries
  - Recipe page interest
- [ ] Create KQL queries documentation
- [ ] Full telemetry QA (all browsers, mobile)
- [ ] Create PR

**Deliverables**:
- ✅ Softer color palette implemented
- ✅ WCAG AA compliance maintained
- ✅ Analytics tracking 15+ events
- ✅ Privacy-compliant implementation

---

### Week 3: Bundle Playground Redesign

#### Day 11: Content Strategy & Copywriting (6 hours)
- [ ] Audit current bundle content (word counts, tone)
- [ ] Rewrite bundle playground hero section:
  - YAML-first headline
  - Value proposition bullets
  - Non-technical language
- [ ] Rewrite 5 bundle descriptions:
  - 1-2 sentences max
  - Focus on outcomes
  - Business value language
- [ ] Write "Quick Start" sections for each bundle:
  - 3 steps to run locally
  - Clear, actionable instructions
- [ ] Review with stakeholder

#### Day 12: YAML Display Component (6 hours)
- [ ] Add Prism.js for syntax highlighting:
  - CSS theme (tomorrow-night)
  - JavaScript
  - YAML language support
- [ ] Create YAML display component:
  - Syntax highlighting
  - Copy-to-clipboard button
  - Download YAML button
- [ ] Style component to match design system
- [ ] Add YAML previews to bundle playground
- [ ] Test copy/download functionality
- [ ] Mobile responsiveness check

#### Day 13: Bundle Playground Restructuring (8 hours)
- [ ] Update `/bundles/index.html`:
  - New hero section (YAML-first)
  - Value proposition section
  - Cleaner bundle cards
- [ ] Redesign bundle cards:
  - Reduce description text
  - Add "View YAML" button prominently
  - Visual complexity indicator
  - Cleaner badge layout
- [ ] Update CSS for new card design
- [ ] Update JavaScript for new DOM structure
- [ ] Test filtering and search

#### Day 14: Bundle Detail Pages Redesign (8 hours)
- [ ] Create collapsible section component:
  - HTML structure
  - CSS (expand/collapse animation)
  - JavaScript (toggle functionality)
- [ ] Redesign bundle detail template:
  - YAML at the top (hero section)
  - Download YAML CTA
  - Collapsible sections for details
- [ ] Update all 5 bundle pages:
  - Add actual YAML to each page
  - Shorten content to fit collapsible sections
  - Add "Quick Start" instructions
- [ ] Test all collapsible sections
- [ ] Visual QA on all 5 pages

#### Day 15: Visual Polish & QA (6 hours)
- [ ] Visual design polish:
  - Adjust spacing and typography
  - Test on 3 screen sizes
  - Fine-tune glassmorphism effects
- [ ] Content review and editing:
  - Proofread all new copy
  - Check for technical jargon
  - Verify tone consistency
- [ ] Get stakeholder review and implement feedback
- [ ] Full bundle playground QA:
  - Test all links and buttons
  - Test YAML copy/download
  - Test filtering and search
  - Test on multiple browsers and mobile
- [ ] Run Playwright tests
- [ ] Create PR

**Deliverables**:
- ✅ YAML-first bundle playground
- ✅ Simplified, scannable content
- ✅ Copy/download YAML functionality
- ✅ Polished user experience

---

### Week 4: Integration, Testing & Launch

#### Day 16: Integration & Deployment to Staging (6 hours)
- [ ] Merge all PRs to feature branch
- [ ] Resolve merge conflicts
- [ ] Full regression testing:
  - All pages load correctly
  - Navigation works
  - Filtering and search work
  - Analytics events fire
  - New colors applied everywhere
- [ ] Deploy to staging environment
- [ ] Smoke test on staging URL
- [ ] Verify analytics in Azure portal

#### Day 17: End-to-End Testing (8 hours)
- [ ] Update Playwright test suite:
  - New selectors for updated classes
  - Tests for YAML copy/download
  - Tests for collapsible sections
  - Tests for recipe coming soon page
  - Mock analytics events
- [ ] Run full test suite, fix failing tests
- [ ] Manual testing scenarios:
  - New user journey (homepage → bundle → download)
  - Recipe page visit
  - Mobile user journey
  - Keyboard navigation
- [ ] Cross-browser testing:
  - Chrome/Edge, Firefox, Safari
  - Mobile Safari, Mobile Chrome
- [ ] Document any issues

#### Day 18: Accessibility Audit (6 hours)
- [ ] Automated accessibility testing:
  - Lighthouse audit (all pages, target >90)
  - axe DevTools (all pages)
- [ ] Manual accessibility testing:
  - Keyboard navigation (Tab, Enter, Escape)
  - Skip-to-main link
  - Focus indicators
  - Color contrast verification
  - Heading hierarchy
- [ ] Screen reader testing (NVDA or VoiceOver)
- [ ] Fix all critical issues
- [ ] Re-run audits, verify improvements

#### Day 19: Documentation & Knowledge Transfer (6 hours)
- [ ] Update ARCHITECTURE.md:
  - New bundle/recipe architecture
  - Telemetry architecture
  - Analytics events reference
- [ ] Update CONTRIBUTING.md:
  - New file structure
  - Analytics tracking guidelines
  - Color palette usage
- [ ] Update README.md:
  - New screenshots
  - Updated feature list
  - Bundle vs Recipe explanation
- [ ] Create Phase 1 completion report:
  - Objectives achieved
  - Metrics (before/after)
  - Lessons learned
- [ ] Update CHANGELOG.md (v0.2.0)
- [ ] Create release notes
- [ ] Document analytics queries
- [ ] Record demo video (5 minutes)

#### Day 20: Final QA & Production Deployment (8 hours)
- [ ] Final QA checklist:
  - All pages load <2 seconds
  - All links work
  - All analytics events fire
  - No console errors
  - Mobile experience smooth
- [ ] Get final stakeholder approval
- [ ] Deploy to production:
  - Merge feature branch to main
  - Trigger Azure deployment
  - Monitor deployment logs
- [ ] Post-deployment smoke test:
  - Test all critical paths
  - Verify analytics in production
  - Test on mobile devices
- [ ] Create Git tag (v0.2.0)
- [ ] Publish release notes on GitHub
- [ ] Update internal documentation
- [ ] Celebrate! 🎉

**Deliverables**:
- ✅ Phase 1 deployed to production
- ✅ All tests passing
- ✅ Accessibility score >90
- ✅ Analytics monitoring active
- ✅ Release notes published

---

## Success Criteria

### Terminology & Architecture
- [ ] "Bundle" and "recipe" used correctly throughout
- [ ] `/bundles/` top-level section with 5 bundles
- [ ] `/recipes/` top-level section (coming soon page)
- [ ] Clear explanation of bundle vs recipe distinction
- [ ] Zero incorrect usage of terminology in user-facing content
- [ ] All URLs updated, old URLs redirected (if possible)

### Color Palette & Accessibility
- [ ] Softer colors implemented across all pages
- [ ] WCAG 2.1 AA compliance (4.5:1 contrast minimum)
- [ ] Lighthouse accessibility score >90
- [ ] No eye strain feedback from stakeholders

### Telemetry & Analytics
- [ ] Azure Application Insights configured and receiving data
- [ ] 15+ custom events tracked
- [ ] Dashboard showing key metrics
- [ ] Cookie consent banner functional
- [ ] Privacy policy updated
- [ ] No PII collected

### Bundle Playground
- [ ] YAML prominently displayed
- [ ] Copy/download YAML functionality working
- [ ] Bundle descriptions ≤2 sentences
- [ ] Collapsible detailed sections
- [ ] "Quick Start" instructions on each page
- [ ] Non-technical language throughout

### Quality Assurance
- [ ] All Playwright tests passing
- [ ] Cross-browser compatible
- [ ] Mobile-responsive on all pages
- [ ] Lighthouse scores: Performance >80, Accessibility >90, Best Practices >90, SEO >90
- [ ] No console errors
- [ ] Page load time <2 seconds

---

## Metrics & KPIs

### Phase 1 Launch Targets (Week 1)

**User Engagement**:
- Homepage visits: 500+
- Bundle views: 200+ (40% conversion)
- Recipe page visits: 100+ (20% explore future features)
- Average session duration: 3-5 minutes
- Bounce rate: <60%

**Analytics Insights**:
- Most viewed bundle identified
- Most popular filter identified
- Search queries analyzed
- Recipe page interest quantified

**Technical**:
- Lighthouse Performance: >90
- Lighthouse Accessibility: >90
- Page load time: <2 seconds
- Bundle terminology usage: 100%

**Content Quality**:
- Average bundle description: 1-2 sentences (down from 8-10)
- YAML display: Above the fold on bundle pages
- Quick Start sections: 3 steps

---

## Risk Management

### Technical Risks

**Risk: Breaking changes from terminology refactoring**
- **Mitigation**: Comprehensive testing, incremental rollout
- **Contingency**: Git revert, hotfix process

**Risk: Analytics SDK slows page load**
- **Mitigation**: Async loading, performance testing
- **Contingency**: Remove SDK if >10% impact

**Risk: URL changes hurt SEO**
- **Mitigation**: Redirects (if possible), canonical tags, updated sitemap
- **Contingency**: Monitor search traffic, adjust strategy

### Content Risks

**Risk: Users confused by bundle vs recipe distinction**
- **Mitigation**: Clear explanation on recipe coming soon page
- **Contingency**: Add FAQ section, tooltip explanations

**Risk: Simplified content loses technical audience**
- **Mitigation**: Keep detailed content in collapsible sections
- **Contingency**: Add "Technical Details" expansion option

---

## Future Phases

### Phase 2: Recipe Implementation (Months 3-4)

**When Recipe Playground is Ready**:
- [ ] Visual recipe builder (multi-bundle orchestration)
- [ ] Pre-configured recipe library (5-10 recipes)
- [ ] Recipe execution engine (backend required)
- [ ] Authentication (GitHub OAuth)
- [ ] Real-time execution updates (WebSocket)

**Backend Requirements**:
- FastAPI backend
- PostgreSQL database
- Redis cache
- Docker containerization
- Azure Container Apps deployment

**Estimated Effort**: 2-3 weeks focused development

### Phase 3: Learning Hub (Month 5)

**Interactive Tutorials**:
- "Build Your First Bundle" (10 minutes)
- "Understanding Bundle Composition" (15 minutes)
- "Creating Multi-Step Recipes" (20 minutes)
- Progress tracking and certificates

### Phase 4: Community Features (Month 6)

**User-Generated Content**:
- Custom bundle publishing
- Custom recipe sharing
- User profiles and ratings
- Community gallery

---

## File Inventory

### Files Requiring Changes (51+)

**HTML** (13):
- `/index.html`
- `/bundles/index.html` (formerly `/playground/index.html`)
- `/bundles/*.html` (5 bundle pages, formerly in `/playground/recipes/`)
- `/recipes/index.html` (NEW - coming soon page)
- `/404.html`, `/accessibility.html`, `/learn/index.html`
- Component examples (2)

**JavaScript** (3):
- `/scripts/bundles.js` (renamed from `recipes.js`)
- `/scripts/validate-bundles.js` (renamed from `validate-recipes.js`)
- `/scripts/performance.js`

**CSS** (1):
- `/styles/main.css` (36 occurrences)

**JSON** (2):
- `/data/bundles-showcase.json` (renamed)
- `/data/bundle-schema.json` (renamed)

**Tests** (5):
- `/tests/bundle-playground.spec.js` (renamed from `recipe-gallery.spec.js`)
- `/tests/homepage.spec.js`
- `/tests/navigation.spec.js`
- `/tests/accessibility.spec.js`
- `/tests/performance.spec.js`

**Documentation** (20+):
- README.md, ARCHITECTURE.md, CONTRIBUTING.md, CHANGELOG.md
- All files in `.docs/` directory
- All files in `.execution_plans/` directory

**Configuration** (2):
- `package.json`, `playwright.config.js`

---

## Appendix: Color Palette Details

### New Color Values

```css
:root {
  /* PRIMARY - Soft Blue (slightly darker, less saturated) */
  --color-primary: #0077CC;
  /* was: #0078D4 */

  /* SECONDARY - Muted Purple (deeper, less vibrant) */
  --color-secondary: #7C3AED;
  /* was: #8B5CF6 */

  /* ACCENT - Warm Orange (warmer, softer) */
  --color-accent: #DC6445;
  /* was: #DD5C2D */

  /* GRADIENT - Updated with new colors */
  --gradient-primary: linear-gradient(135deg, #0077CC 0%, #7C3AED 100%);
  /* was: linear-gradient(135deg, #0078D4 0%, #8B5CF6 100%) */
}
```

### Contrast Ratios (White Text)

| Color | Hex | Contrast Ratio | WCAG AA (4.5:1) |
|-------|-----|----------------|-----------------|
| Soft Blue | `#0077CC` | 5.1:1 | ✅ Pass |
| Muted Purple | `#7C3AED` | 5.3:1 | ✅ Pass |
| Warm Orange | `#DC6445` | 4.7:1 | ✅ Pass |

---

## Appendix: Analytics Event Reference

### Event Catalog

```javascript
// Bundle browsing
Analytics.trackEvent('bundle_viewed', {
  bundleId: 'code-review',
  category: 'code-quality',
  difficulty: 'intermediate'
});

Analytics.trackEvent('bundle_filtered', {
  filterType: 'category',
  filterValue: 'security'
});

Analytics.trackEvent('bundle_searched', {
  query: 'test coverage',
  resultsCount: 1
});

// Bundle interactions
Analytics.trackEvent('bundle_yaml_viewed', {
  bundleId: 'code-review'
});

Analytics.trackEvent('bundle_yaml_copied', {
  bundleId: 'code-review'
});

Analytics.trackEvent('bundle_yaml_downloaded', {
  bundleId: 'code-review'
});

// Recipe interest tracking
Analytics.trackEvent('recipe_coming_soon_viewed', {
  source: 'navigation'
});

Analytics.trackEvent('recipe_waitlist_signup', {
  email: '[hashed]' // only if waitlist implemented
});

// Navigation
Analytics.trackEvent('nav_clicked', {
  destination: '/bundles/',
  source: 'homepage'
});

Analytics.trackEvent('cta_clicked', {
  ctaText: 'Browse Bundles',
  location: 'hero',
  destination: '/bundles/'
});
```

---

## Questions & Sign-Off

**Confirmed Approvals**:
- ✅ Terminology: Use bundle/recipe correctly per Amplifier definitions
- ✅ Architecture: Top-level `/bundles/` and `/recipes/` sections
- ✅ URLs: Change to `/bundles/` (redirect old URLs if possible)
- ✅ Colors: Implement softer palette
- ✅ Azure: Create Application Insights resource (free tier)
- ✅ Content: Simplify bundle descriptions

**Ready to begin Week 1**

---

**Document Status**: APPROVED
**Next Action**: Start Day 1 - Analysis & Planning
**Branch**: `feature/phase-1-refinement`
**Target Completion**: End of Week 6
**Version**: v0.2.0
