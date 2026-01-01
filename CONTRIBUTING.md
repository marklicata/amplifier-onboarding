# Contributing to Amplifier Onboarding

Thank you for your interest in contributing! This guide will help you get set up and understand our development workflow.

---

## Table of Contents

1. [Getting Started](#getting-started)
2. [Development Workflow](#development-workflow)
3. [Code Style Guide](#code-style-guide)
4. [Testing](#testing)
5. [Deployment](#deployment)
6. [Project Structure](#project-structure)

---

## Getting Started

### Prerequisites

- **Node.js**: Version 18+ (for local dev server)
- **Git**: For version control
- **Azure CLI** (optional): For Azure deployment
- **Text Editor**: VS Code recommended

### Local Setup (5 minutes)

1. **Clone the repository**:
   ```bash
   git clone https://github.com/yourusername/amplifier-onboarding.git
   cd amplifier-onboarding
   ```

2. **Start the development server**:
   ```bash
   npm run dev
   ```
   
   This will:
   - Start http-server on port 3000
   - Open your browser to http://localhost:3000
   - Serve files with no caching (see changes immediately)

3. **Make changes**:
   - Edit HTML, CSS, or JavaScript files
   - Refresh browser to see changes
   - No build step needed (pure static site)

---

## Development Workflow

### Branch Strategy

- **`main`**: Production branch (auto-deploys to Azure)
- **`Phase-0-implementation`**: Current feature branch for Phase 0 work
- **Feature branches**: Create from `Phase-0-implementation` for specific increments

### Making Changes

1. **Create or checkout branch**:
   ```bash
   git checkout -b my-feature-name
   ```

2. **Make your changes**:
   - Edit files
   - Test locally with `npm run dev`
   - Follow code style guide (see below)

3. **Commit your changes**:
   ```bash
   git add .
   git commit -m "Brief description of changes
   
   - Bullet point of what changed
   - Another change
   - Reference to increment if applicable"
   ```

4. **Push to GitHub**:
   ```bash
   git push origin my-feature-name
   ```

5. **Create Pull Request**:
   - Go to GitHub repository
   - Click "Pull Requests" → "New Pull Request"
   - Select your branch
   - Fill in description
   - Request review

### Incremental Development Philosophy

**Every increment should**:
- ✅ Take 1-2 hours maximum
- ✅ Be committable and deployable
- ✅ Have clear verification criteria
- ✅ Show visible progress
- ✅ Build on previous increments

See `execution_plans/EXECUTION_PLAN_PHASE_0.md` for detailed increment breakdown.

---

## Code Style Guide

### HTML

**Do**:
- ✅ Use semantic HTML5 elements (`<main>`, `<nav>`, `<section>`, `<article>`)
- ✅ Include ARIA labels for accessibility
- ✅ Use descriptive class names (`.recipe-card`, not `.card-1`)
- ✅ Indent with 4 spaces
- ✅ Close all tags properly
- ✅ Add `alt` text for images

**Don't**:
- ❌ Use divs when semantic elements exist
- ❌ Forget accessibility attributes
- ❌ Use inline styles (use CSS classes instead)
- ❌ Use IDs for styling (use classes)

**Example**:
```html
<!-- Good -->
<article class="recipe-card">
    <h2 class="recipe-title">Recipe Name</h2>
    <p class="recipe-description">Description here.</p>
</article>

<!-- Avoid -->
<div id="card1" style="padding: 10px;">
    <div class="title">Recipe Name</div>
    <div>Description here.</div>
</div>
```

### CSS

**Do**:
- ✅ Use CSS variables from `styles/main.css`
- ✅ Mobile-first responsive design
- ✅ Group related styles together
- ✅ Comment section headers
- ✅ Use consistent naming (kebab-case)

**Don't**:
- ❌ Hardcode colors/spacing (use CSS variables)
- ❌ Use `!important` (fix specificity instead)
- ❌ Create overly specific selectors
- ❌ Forget hover/focus states

**Example**:
```css
/* Good */
.recipe-card {
    background: rgba(255, 255, 255, 0.1);
    padding: var(--spacing-lg);
    border-radius: var(--radius-lg);
    transition: transform var(--transition-normal);
}

.recipe-card:hover {
    transform: translateY(-4px);
}

/* Avoid */
div.card#recipe1 {
    background: #fff1 !important;
    padding: 24px;
    border-radius: 12px;
}
```

### JavaScript

**Do**:
- ✅ Use modern ES6+ syntax
- ✅ Add JSDoc comments for functions
- ✅ Handle errors gracefully
- ✅ Escape user input to prevent XSS
- ✅ Use async/await for async operations
- ✅ Add descriptive variable names

**Don't**:
- ❌ Use `var` (use `const` or `let`)
- ❌ Ignore error handling
- ❌ Trust user input without sanitization
- ❌ Use global variables unnecessarily

**Example**:
```javascript
// Good
async function loadRecipes() {
    try {
        const response = await fetch('/data/recipes.json');
        const data = await response.json();
        return data.recipes;
    } catch (error) {
        console.error('Failed to load recipes:', error);
        showError('Unable to load recipes');
        return [];
    }
}

// Avoid
var recipes;
function getRecipes() {
    fetch('/data/recipes.json').then(r => r.json()).then(d => {
        recipes = d.recipes; // Global mutation, no error handling
    });
}
```

---

## Testing

### Manual Testing Checklist

Before committing, test:

**Desktop (1920px)**:
- [ ] Page loads without errors
- [ ] All navigation links work
- [ ] Interactive elements function correctly
- [ ] Hover states work
- [ ] No console errors

**Tablet (768px)**:
- [ ] Layout adapts appropriately
- [ ] Navigation remains usable
- [ ] Content is readable

**Mobile (375px)**:
- [ ] Single column layout
- [ ] Text is readable (not too small)
- [ ] Buttons are tappable (min 44px)
- [ ] No horizontal scrolling

**Accessibility**:
- [ ] Can navigate entire page with Tab key
- [ ] Focus indicators are visible
- [ ] Skip-to-main link works
- [ ] Screen reader friendly (test with NVDA/VoiceOver)

**Browsers**:
- [ ] Chrome/Edge
- [ ] Firefox  
- [ ] Safari (if available)

### Automated Testing (Future)

When we add automated tests (Day 5), use:
```bash
npm run test        # Run all tests
npm run test:watch  # Watch mode for development
```

---

## Deployment

### Azure Static Web Apps (Current)

**Automatic Deployment**:
- Push to `main` branch → Auto-deploys to Azure
- Create Pull Request → Creates preview environment
- Merge PR → Deploys to production + deletes preview

**Manual Deployment** (if needed):
```bash
# Just push to main
git push origin main

# Monitor deployment
# Go to: https://github.com/yourusername/amplifier-onboarding/actions
```

**View live site**:
- Production: `https://amplifier-onboarding.azurestaticapps.net`
- Custom domain (when configured): `https://amplifier.dev`

### Deployment Checklist

Before pushing to `main`:
- [ ] Tested locally (`npm run dev`)
- [ ] No console errors
- [ ] All links work
- [ ] Mobile responsive
- [ ] Accessibility checks pass
- [ ] Git commit message is descriptive

---

## Project Structure

```
amplifier-onboarding/
├── index.html              # Landing page
├── 404.html                # Error page
├── favicon.svg             # Site icon
├── site.webmanifest        # PWA manifest
├── package.json            # Node.js configuration
├── .gitignore              # Git ignore rules
│
├── styles/
│   └── main.css            # Main stylesheet with CSS variables
│
├── scripts/
│   └── recipes.js          # Recipe gallery logic
│
├── data/
│   └── recipes-showcase.json  # Recipe metadata (5 recipes)
│
├── components/
│   ├── README.md           # Component documentation
│   ├── button.html         # Button examples
│   └── card.html           # Card examples
│
├── playground/
│   └── index.html          # Recipe playground page
│
├── learn/
│   └── index.html          # Learning hub page
│
├── docs/
│   ├── index.html          # Docs landing page (web)
│   ├── DESIGN_SYSTEM.md    # Design system guide
│   ├── 00_EXECUTIVE_SUMMARY.md     # Strategy docs
│   └── ...                 # Other planning docs
│
└── execution_plans/
    ├── EXECUTION_PLAN_PHASE_0.md   # Implementation roadmap
    └── AZURE_STATIC_WEB_APPS.md    # Deployment guide
```

### File Organization Rules

**Static Assets** (HTML, CSS, images):
- Place in root or appropriate subdirectory
- Reference with absolute paths: `/styles/main.css`, not `../styles/main.css`

**Scripts**:
- Keep in `/scripts` directory
- One file per major feature/page
- Use ES6 modules when complexity increases (Phase 1+)

**Data**:
- JSON files in `/data` directory
- Validate JSON before committing
- Keep files under 100KB for fast loading

**Documentation**:
- Planning/strategy docs: `/docs` directory (markdown)
- Web documentation pages: `/docs/index.html` (HTML pages)
- Component examples: `/components` directory

---

## Common Tasks

### Add a New Page

1. Create HTML file in appropriate directory:
   ```bash
   # Example: /gallery/index.html
   ```

2. Copy navigation from existing page

3. Link from navigation or other pages

4. Test locally

5. Commit and push

### Add a New Recipe

1. Edit `data/recipes-showcase.json`

2. Add recipe object with all required fields:
   ```json
   {
     "id": "unique-recipe-id",
     "name": "Recipe Name",
     "description": "Brief description...",
     "category": "code-quality",
     "difficulty": "beginner",
     "duration": "2-3 minutes",
     ...
   }
   ```

3. Test in playground (should appear automatically)

4. Commit and push

### Update Styles

1. Edit `styles/main.css`

2. Use existing CSS variables when possible

3. Add new variables to `:root` if needed

4. Test responsiveness

5. Commit and push

---

## Code Review Guidelines

When reviewing PRs:

**Check for**:
- ✅ Code follows style guide
- ✅ Changes are tested locally
- ✅ No console errors
- ✅ Accessibility not broken
- ✅ Mobile responsive
- ✅ Commit messages are clear
- ✅ No sensitive data in code

**Feedback should be**:
- Constructive and specific
- Reference design system or style guide
- Suggest alternatives
- Approve quickly for small fixes

---

## Getting Help

### Documentation

- **Execution Plan**: `execution_plans/EXECUTION_PLAN_PHASE_0.md`
- **Design System**: `docs/DESIGN_SYSTEM.md`
- **Deployment**: `execution_plans/AZURE_STATIC_WEB_APPS.md`
- **Architecture**: Coming in Day 10

### Questions

- **Technical issues**: Open GitHub issue with label `help wanted`
- **Design questions**: Reference `docs/DESIGN_SYSTEM.md`, open issue with label `design`
- **Unclear requirements**: Check execution plan, then ask in issue or discussion

---

## Phase 0 Increments Reference

**Week 1** (Days 1-5):
- Day 1: Project structure, HTML/CSS foundation, navigation, design system ✅
- Day 2: Component library, recipe gallery, interactivity ✅
- Day 3: Dev server ✅, build pipeline, documentation ← YOU ARE HERE
- Day 4: Recipe metadata, content
- Day 5: Testing framework, accessibility, performance

**Week 2** (Days 6-10):
- Day 6: Backend setup (FastAPI)
- Day 7: Authentication (OAuth, JWT)
- Day 8: Deployment (Azure Static Web Apps) ✅ DONE EARLY!
- Day 9: Recipe API, frontend integration
- Day 10: Backend tests, documentation

See `execution_plans/EXECUTION_PLAN_PHASE_0.md` for complete breakdown.

---

## Tips for Contributors

### First Time Contributors

Start with small increments:
1. Fix typos in documentation
2. Improve accessibility (add alt text, ARIA labels)
3. Add new recipes to showcase
4. Improve mobile responsiveness

### Regular Contributors

Tackle full increments:
1. Choose an increment from execution plan
2. Create feature branch
3. Implement according to spec
4. Test thoroughly
5. Create PR

### Advanced Contributors

Work on complex features:
1. Backend API development (Phase 1)
2. Real-time execution viewer (Phase 1)
3. Visual recipe builder (Phase 3)
4. Community features (Phase 4)

---

## Questions?

- **Issues**: https://github.com/yourusername/amplifier-onboarding/issues
- **Discussions**: https://github.com/yourusername/amplifier-onboarding/discussions
- **Email**: amplifier@microsoft.com (fictional - update with real contact)

---

**Happy contributing!** 🚀

Built with ❤️ by the Amplifier team
