# Amplifier Design System

**Version**: 1.0.0  
**Last Updated**: 2026-01-01

---

## Overview

The Amplifier design system embodies **"Modular Intelligence"** - clean, modern, and approachable while conveying technical sophistication.

### Core Principles

1. **Clarity Over Decoration** - Every element serves a purpose
2. **Progressive Disclosure** - Complexity revealed gradually
3. **Accessibility First** - WCAG 2.1 AA minimum standard
4. **Mobile-First** - Designed for smallest screens, enhanced for larger
5. **Performance** - Fast loading, smooth interactions

---

## Color Palette

### Brand Colors

**Primary: Electric Blue**
- `#0078D4` - Trust, technology, Microsoft heritage
- Usage: Primary actions, links, brand elements
- CSS Variable: `--color-primary`

**Secondary: Vibrant Purple**
- `#8B5CF6` - Creativity, intelligence, innovation
- Usage: Accents, gradients, highlights
- CSS Variable: `--color-secondary`

**Accent: Energetic Orange**
- `#FF6B35` - Action, results, energy
- Usage: CTAs, important actions, notifications
- CSS Variable: `--color-accent`

### Neutral Colors

**Light**
- `#F5F5F5` - Backgrounds, cards (light mode future)
- CSS Variable: `--color-gray-50`

**Dark**
- `#1A1A1A` - Text, backgrounds (dark mode future)
- CSS Variable: `--color-gray-900`

**White**
- `#FFFFFF` - Text on dark backgrounds, clean surfaces
- CSS Variable: `--color-white`

### Gradients

**Primary Gradient**
```css
background: linear-gradient(135deg, #0078D4 0%, #8B5CF6 100%);
/* CSS Variable: var(--gradient-primary) */
```

Usage: Hero sections, backgrounds, large surfaces

### Color Usage Guidelines

**Do:**
- ✅ Use primary gradient for hero sections
- ✅ Use accent orange sparingly for CTAs
- ✅ Maintain 4.5:1 contrast ratio minimum
- ✅ Use semi-transparent overlays for glassmorphism

**Don't:**
- ❌ Mix too many colors in one component
- ❌ Use pure black (#000) - use gray-900 instead
- ❌ Use accent color for large surfaces
- ❌ Ignore contrast requirements

---

## Typography

### Font Family

**Primary**: Inter
- Clean, modern, excellent for UI
- Variable font weights: 400 (Regular), 600 (Semibold), 700 (Bold)
- Fallback: System fonts (`-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif`)

**Code**: JetBrains Mono (future - for code examples)
- Monospace, developer-friendly
- Usage: Code blocks, YAML examples

### Type Scale

| Name | Size | Usage | CSS Variable |
|------|------|-------|--------------|
| **4xl** | 96px (6rem) | 404 page, special displays | `--font-size-4xl` |
| **3xl** | 48px (3rem) | Page titles, hero headings | `--font-size-3xl` |
| **2xl** | 32px (2rem) | Section headings | `--font-size-2xl` |
| **xl** | 24px (1.5rem) | Subheadings, taglines | `--font-size-xl` |
| **lg** | 20px (1.25rem) | Large body text | `--font-size-lg` |
| **base** | 18px (1.125rem) | Body text, descriptions | `--font-size-base` |
| **sm** | 16px (1rem) | Small text, labels | `--font-size-sm` |
| **xs** | 15px (0.9375rem) | Captions, footnotes | `--font-size-xs` |

### Font Weights

- **Regular (400)**: Body text, descriptions
- **Semibold (600)**: Emphasis, UI labels, navigation
- **Bold (700)**: Headings, important elements

### Line Height

- **Headings**: 1.2 (tight)
- **Body text**: 1.7 (comfortable reading)
- **UI elements**: 1.5 (balanced)

### Typography Examples

```html
<!-- Page Title -->
<h1 style="font-size: var(--font-size-3xl); font-weight: var(--font-weight-bold);">
    Recipe Playground
</h1>

<!-- Section Heading -->
<h2 style="font-size: var(--font-size-xl); font-weight: var(--font-weight-semibold);">
    Featured Recipes
</h2>

<!-- Body Text -->
<p style="font-size: var(--font-size-base); line-height: 1.7;">
    Transform how you think about AI development...
</p>
```

---

## Spacing System

### Scale

| Name | Size | Usage |
|------|------|-------|
| `xs` | 8px (0.5rem) | Tight gaps, small padding |
| `sm` | 12px (0.75rem) | Compact components |
| `md` | 16px (1rem) | Base spacing unit |
| `lg` | 24px (1.5rem) | Section padding, gaps |
| `xl` | 32px (2rem) | Large gaps, margins |
| `2xl` | 48px (3rem) | Major sections |

### Usage Guidelines

**Vertical Rhythm**:
- Use consistent spacing between sections (typically `--spacing-2xl`)
- Headings: margin-bottom of `--spacing-md` to `--spacing-lg`
- Paragraphs: margin-bottom of `--spacing-md`

**Horizontal Spacing**:
- Card padding: `--spacing-lg`
- Button padding: `--spacing-md` (vertical) × `--spacing-xl` (horizontal)
- Grid gaps: `--spacing-xl` for features, `--spacing-lg` for dense layouts

---

## Border Radius

| Name | Size | Usage |
|------|------|-------|
| `sm` | 4px | Small elements, inputs, tags |
| `md` | 8px | Buttons, smaller cards |
| `lg` | 12px | Feature cards, modals, panels |

**Guideline**: Larger surfaces = larger radius

---

## Shadows

### Elevation System

**Small (hover states)**
```css
box-shadow: 0 4px 20px rgba(255, 107, 53, 0.3);
/* CSS Variable: var(--shadow-sm) */
```

**Medium (active states)**
```css
box-shadow: 0 6px 30px rgba(255, 107, 53, 0.4);
/* CSS Variable: var(--shadow-md) */
```

**Usage**:
- Buttons: Small shadow default, medium on hover
- Cards: No shadow default, small on hover
- Modals: Medium shadow always

---

## Components

### Buttons

#### Primary Button (Call to Action)

```html
<a href="#" class="cta">
    <span>Get Started</span>
    <span aria-hidden="true">→</span>
</a>
```

**Styling**:
- Background: `--color-accent` (#FF6B35)
- Text: White
- Padding: `1rem 2rem` (16px 32px)
- Border radius: `--radius-md` (8px)
- Font weight: Semibold (600)
- Hover: Lift (-2px) + increase shadow

**When to use**: Primary actions, main CTAs, important links

#### Secondary Button (Future)

```css
.btn-secondary {
    background: transparent;
    border: 2px solid var(--color-white);
    color: var(--color-white);
    /* Same sizing as primary */
}
```

**When to use**: Secondary actions, alternative paths

---

### Cards

#### Feature Card

```html
<article class="feature">
    <div class="feature-icon" aria-hidden="true">🎯</div>
    <h2 class="feature-title">Feature Title</h2>
    <p class="feature-description">Description text here.</p>
</article>
```

**Styling**:
- Background: `rgba(255, 255, 255, 0.1)` with `backdrop-filter: blur(10px)`
- Border: `1px solid rgba(255, 255, 255, 0.2)`
- Border radius: `--radius-lg` (12px)
- Padding: `--spacing-lg` (24px)
- Hover: Lift (-5px) + slight background increase

**Variations**:
- Recipe card (future)
- Tutorial card (future)
- User profile card (future)

---

### Navigation

#### Navbar

```html
<nav class="navbar" role="navigation">
    <div class="nav-container">
        <a href="/" class="nav-logo">Amplifier</a>
        <ul class="nav-menu">
            <li><a href="/" class="nav-link active">Home</a></li>
            <li><a href="/playground/" class="nav-link">Playground</a></li>
        </ul>
    </div>
</nav>
```

**Styling**:
- Position: Fixed top
- Background: `rgba(0, 0, 0, 0.3)` with backdrop blur
- Border bottom: `1px solid rgba(255, 255, 255, 0.1)`
- Active state: Orange underline (`--color-accent`)

---

## Iconography

### Current Usage

**Emoji Icons** (Phase 0-1):
- 🎯 Target/Goals - Experience recipes
- 🏗️ Construction - Build solutions
- 🌐 Global - Share & discover
- 🚀 Rocket - Coming soon, launch
- 📚 Books - Learning
- 📖 Documentation

**Future**: Consider icon library (Lucide, Heroicons) for consistency

### Guidelines

- Use `aria-hidden="true"` for decorative icons
- Provide text alternatives for meaningful icons
- Size: `--font-size-xl` (2rem) for feature icons
- Color: Inherit from parent

---

## Layout Patterns

### Centered Container

```html
<div class="container">
    <!-- Content -->
</div>
```

**Specifications**:
- Max-width: 800px (homepage), 1200px (pages)
- Centered: `margin: 0 auto`
- Padding: `--spacing-lg` on sides
- Text-align: center (for hero/landing content)

### Grid Layout (Features)

```css
.features {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: var(--spacing-xl);
}
```

**Responsive Behavior**:
- Desktop: 3 columns (if space allows)
- Tablet: 2 columns
- Mobile: 1 column

---

## Responsive Breakpoints

| Breakpoint | Width | Target Devices |
|------------|-------|----------------|
| **Mobile Small** | 375px | iPhone SE, small phones |
| **Mobile** | 640px | Phones landscape, small tablets |
| **Tablet** | 768px | Tablets portrait |
| **Desktop** | 1024px | Laptops, desktops |
| **Large Desktop** | 1280px | Large screens |

### Mobile-First Approach

**Start with mobile styles**, then add larger breakpoints:

```css
/* Mobile first (default) */
.logo {
    font-size: 1.75rem;
}

/* Tablet and up */
@media (min-width: 640px) {
    .logo {
        font-size: 2rem;
    }
}

/* Desktop and up */
@media (min-width: 1024px) {
    .logo {
        font-size: 3rem;
    }
}
```

---

## Animations & Transitions

### Transition Speeds

- **Fast** (`0.2s`): Hover states, focus indicators
- **Normal** (`0.3s`): Card hovers, button interactions
- **Slow** (`1s`): Page load animations, major transitions

### Standard Easing

- `ease`: General purpose
- `ease-in`: Fade out, disappearing elements
- `ease-out`: Fade in, appearing elements
- `ease-in-out`: State changes

### Common Animations

**Fade In (page load)**:
```css
@keyframes fadeIn {
    from { 
        opacity: 0; 
        transform: translateY(20px); 
    }
    to { 
        opacity: 1; 
        transform: translateY(0); 
    }
}

.container {
    animation: fadeIn 1s ease-in;
}
```

**Lift on Hover**:
```css
.feature:hover {
    transform: translateY(-5px);
    transition: transform 0.3s ease;
}
```

---

## Accessibility Standards

### WCAG 2.1 AA Compliance

**Color Contrast**:
- Normal text: Minimum 4.5:1
- Large text (18px+): Minimum 3:1
- UI components: Minimum 3:1

**Keyboard Navigation**:
- All interactive elements focusable
- Focus indicators visible (outline or border)
- Skip-to-main link at top of page
- Tab order follows visual order

**Screen Readers**:
- Semantic HTML5 elements (`<nav>`, `<main>`, `<header>`, `<footer>`)
- ARIA labels for icons and non-text content
- `aria-current="page"` for active navigation
- `aria-hidden="true"` for decorative elements

**Responsive Text**:
- Base font size: 16px minimum
- Scalable with user preferences
- Line length: 50-75 characters for readability

### Accessibility Checklist

- [ ] All images have alt text (or `aria-hidden` if decorative)
- [ ] Color is not the only way to convey information
- [ ] Focus indicators are visible
- [ ] Keyboard navigation works throughout
- [ ] ARIA labels provided where needed
- [ ] Heading hierarchy is logical (h1 → h2 → h3)
- [ ] Links have descriptive text (no "click here")
- [ ] Form inputs have associated labels

---

## Component Examples

### Feature Card Component

**HTML**:
```html
<article class="feature">
    <div class="feature-icon" aria-hidden="true">🎯</div>
    <h2 class="feature-title">Feature Name</h2>
    <p class="feature-description">
        Brief description of the feature and its value proposition.
    </p>
</article>
```

**Styling**:
- Background: Glassmorphic (semi-transparent with blur)
- Hover: Lift effect + slight opacity increase
- Border: Subtle white border for definition

---

### Button Component

**Primary CTA**:
```html
<a href="/action" class="cta">
    <span>Action Text</span>
    <span aria-hidden="true">→</span>
</a>
```

**States**:
- Default: Orange background, white text, small shadow
- Hover: Lifts up, increased shadow
- Focus: White outline, offset 4px
- Active: Slightly pressed down

---

### Navigation Component

**Desktop Navigation**:
```html
<nav class="navbar" role="navigation">
    <div class="nav-container">
        <a href="/" class="nav-logo">Amplifier</a>
        <ul class="nav-menu">
            <li><a href="/" class="nav-link active" aria-current="page">Home</a></li>
            <li><a href="/playground/" class="nav-link">Playground</a></li>
        </ul>
    </div>
</nav>
```

**Mobile Behavior** (future enhancement):
- Hamburger menu icon
- Slide-out drawer
- Overlay background

---

## Future Components (Phase 1+)

### Recipe Card
- Thumbnail/icon
- Title + description
- Difficulty badge
- Estimated duration
- Category tag
- View/Execute buttons

### Code Editor Panel
- Monaco Editor integration
- Syntax highlighting
- Line numbers
- Minimap (optional)

### Execution Viewer
- Step-by-step progress
- Agent avatars
- Real-time logs
- Context flow visualization

### Modal/Dialog
- Centered overlay
- Backdrop blur
- Close button
- Escape key support

---

## Design Tokens Reference

All design tokens are defined in `/styles/main.css` as CSS custom properties:

```css
:root {
    /* Colors */
    --color-primary: #0078D4;
    --color-secondary: #8B5CF6;
    --color-accent: #FF6B35;
    --color-white: #ffffff;
    --color-gray-50: #F5F5F5;
    --color-gray-900: #1A1A1A;
    
    /* Typography */
    --font-family-base: 'Inter', sans-serif;
    --font-weight-regular: 400;
    --font-weight-semibold: 600;
    --font-weight-bold: 700;
    
    /* Font Sizes */
    --font-size-xs: 0.9375rem;
    --font-size-sm: 1rem;
    --font-size-base: 1.125rem;
    /* ... see main.css for complete list */
    
    /* Spacing */
    --spacing-xs: 0.5rem;
    --spacing-sm: 0.75rem;
    --spacing-md: 1rem;
    --spacing-lg: 1.5rem;
    --spacing-xl: 2rem;
    --spacing-2xl: 3rem;
    
    /* Border Radius */
    --radius-sm: 4px;
    --radius-md: 8px;
    --radius-lg: 12px;
    
    /* Transitions */
    --transition-fast: 0.2s ease;
    --transition-normal: 0.3s ease;
    --transition-slow: 1s ease-in;
}
```

**Usage**:
```css
.my-component {
    background: var(--color-primary);
    padding: var(--spacing-lg);
    border-radius: var(--radius-md);
    transition: transform var(--transition-fast);
}
```

---

## Development Guidelines

### CSS Organization

1. **Variables first** - Define all tokens at top of main.css
2. **Reset/base styles** - Normalize browser defaults
3. **Layout** - Grid systems, containers
4. **Components** - Reusable component styles
5. **Utilities** - Helper classes
6. **Responsive** - Media queries at end (or per-component)

### Naming Conventions

**Classes**:
- Use kebab-case: `.feature-card`, `.nav-menu`
- Be descriptive: `.recipe-difficulty-badge` not `.badge`
- Avoid presentational names: `.text-center` is ok, `.red-text` is not

**CSS Variables**:
- Prefix with category: `--color-*`, `--spacing-*`, `--font-*`
- Use full words: `--color-primary` not `--clr-pri`

### File Structure

```
styles/
├── main.css              # Main stylesheet (current)
├── components/           # Component-specific styles (future)
│   ├── buttons.css
│   ├── cards.css
│   └── navigation.css
└── utilities.css         # Utility classes (future)
```

---

## Browser Support

**Target Browsers**:
- Chrome/Edge: Last 2 versions
- Firefox: Last 2 versions
- Safari: Last 2 versions
- Mobile Safari (iOS): Last 2 versions

**Modern CSS Features Used**:
- CSS Custom Properties (variables)
- CSS Grid
- Flexbox
- Backdrop filter (with fallback)
- CSS animations

**Graceful Degradation**:
- Backdrop blur: Falls back to solid background
- Grid: Falls back to flexbox or block
- Animations: Respect `prefers-reduced-motion`

---

## Performance Guidelines

**CSS Best Practices**:
- Use CSS variables for consistency AND performance
- Avoid `@import` in CSS (use link tags instead)
- Minimize specificity (prefer classes over IDs)
- Group media queries by breakpoint
- Minify in production

**Critical CSS** (future):
- Inline critical above-the-fold styles
- Load non-critical CSS asynchronously
- Use link `media` attribute for conditional loading

---

## Dark Mode (Future Consideration)

When implementing dark mode:

```css
@media (prefers-color-scheme: dark) {
    :root {
        --color-background: var(--color-gray-900);
        --color-text: var(--color-gray-50);
        /* Adjust other colors */
    }
}
```

Or use class-based toggle:
```html
<html class="dark-mode">
```

---

## Tools & Resources

### Design Tools
- **Figma**: Design mockups and prototypes
- **Coolors.co**: Color palette generation
- **Type Scale**: Typography scale calculator

### Development Tools
- **Chrome DevTools**: Live CSS editing, accessibility audit
- **Lighthouse**: Performance and accessibility testing
- **WebAIM Contrast Checker**: Verify color contrast ratios

### Testing
- **BrowserStack**: Cross-browser testing
- **Screen Reader**: NVDA (Windows), VoiceOver (Mac)
- **Keyboard Navigation**: Tab through all interactive elements

---

## Changelog

### Version 1.0.0 (2026-01-01)
- Initial design system documentation
- Defined color palette and typography
- Established spacing and component guidelines
- Created CSS variable system
- Documented accessibility standards

---

## Contributing

When adding new components or styles:

1. **Check the design system first** - Use existing tokens
2. **Add to this document** - Document new patterns
3. **Update CSS variables** - If adding new tokens
4. **Test responsiveness** - Mobile, tablet, desktop
5. **Test accessibility** - Keyboard nav, screen reader, contrast
6. **Update examples** - Add to this document

---

## Questions?

For design questions or proposals:
- Open an issue with label `design`
- Reference this document in discussions
- Propose changes via PR with screenshots

**Maintainer**: Design team  
**Last Review**: 2026-01-01
