# Recipe Catalog - Showcase Collection

## Philosophy

These recipes demonstrate **immediate, tangible value** across different use cases. Each recipe should:
- Complete in under 5 minutes
- Show clear before/after results
- Demonstrate multi-agent orchestration
- Be easily customizable
- Solve a real problem

---

## Category: Code Quality

### 1. Comprehensive Code Review
**Difficulty:** Beginner  
**Duration:** 2-3 minutes  
**Agents:** zen-architect, bug-hunter, security-guardian

**Description:**
Multi-perspective code analysis covering architecture, bugs, security, and best practices.

**Steps:**
1. Architectural analysis (zen-architect)
2. Bug detection (bug-hunter)
3. Security audit (security-guardian)
4. Consolidate findings with severity scoring
5. Generate actionable report

**Input:**
- File path or code snippet
- Programming language
- Optional: Focus areas

**Output:**
- Severity-scored issue list
- Architectural recommendations
- Security vulnerabilities with CVSS scores
- Refactoring suggestions

**Value Proposition:**
"Get a senior developer, QA engineer, and security expert to review your code in 3 minutes."

---

### 2. Technical Debt Analyzer
**Difficulty:** Intermediate  
**Duration:** 3-4 minutes  
**Agents:** explorer, zen-architect

**Description:**
Identifies code smells, architectural debt, and estimates refactoring impact.

**Steps:**
1. Scan codebase for patterns (explorer)
2. Identify anti-patterns and code smells
3. Assess architectural consistency
4. Calculate complexity metrics
5. Estimate refactoring effort and ROI
6. Prioritize by business impact

**Input:**
- Repository or directory path
- Language/framework
- Business context (optional)

**Output:**
- Technical debt inventory
- Complexity heatmap
- Refactoring roadmap with priorities
- Effort estimates (time/risk)

**Value Proposition:**
"Know exactly where your codebase needs attention and why it matters."

---

### 3. Test Coverage Improver
**Difficulty:** Intermediate  
**Duration:** 4-5 minutes  
**Agents:** test-coverage, modular-builder

**Description:**
Analyzes existing tests, identifies gaps, and generates new test cases.

**Steps:**
1. Analyze current test suite (test-coverage)
2. Identify untested code paths
3. Assess edge cases and error conditions
4. Generate test specifications
5. Implement tests (modular-builder)
6. Validate tests run successfully

**Input:**
- Source files
- Existing test files
- Testing framework
- Coverage threshold target

**Output:**
- Coverage gap analysis
- Generated test code
- Coverage improvement report
- Recommendations for test strategy

**Value Proposition:**
"Go from 60% to 90% test coverage without writing tests yourself."

---

## Category: Documentation

### 4. API Documentation Generator
**Difficulty:** Beginner  
**Duration:** 2 minutes  
**Agents:** explorer, zen-architect

**Description:**
Analyzes code and generates comprehensive API documentation with examples.

**Steps:**
1. Parse API endpoints and functions (explorer)
2. Extract parameters, return types, errors
3. Generate descriptions and use cases (zen-architect)
4. Create usage examples
5. Format as OpenAPI/Swagger or Markdown
6. Validate against code

**Input:**
- API code files
- Desired format (OpenAPI, Markdown, etc.)
- Example requests (optional)

**Output:**
- Complete API documentation
- Interactive examples
- Error handling guide
- Quick start guide

**Value Proposition:**
"Ship beautiful API docs without writing a single sentence."

---

### 5. Codebase Explainer for Onboarding
**Difficulty:** Beginner  
**Duration:** 3-4 minutes  
**Agents:** explorer, zen-architect

**Description:**
Creates a comprehensive onboarding guide for new developers joining a project.

**Steps:**
1. Map project structure (explorer)
2. Identify key modules and relationships
3. Explain architecture patterns (zen-architect)
4. Document setup steps
5. Create contribution guide
6. Generate glossary of key concepts

**Input:**
- Repository path
- Tech stack description
- Target audience (junior/senior)

**Output:**
- Visual architecture diagram
- Module-by-module guide
- Setup instructions
- Contribution workflow
- Annotated examples

**Value Proposition:**
"Onboard new developers in hours, not weeks."

---

### 6. README Generator
**Difficulty:** Beginner  
**Duration:** 1-2 minutes  
**Agents:** explorer, zen-architect

**Description:**
Analyzes project and creates a compelling, comprehensive README.

**Steps:**
1. Detect project type and purpose (explorer)
2. Identify key features
3. Extract usage patterns
4. Generate installation instructions
5. Create examples
6. Add badges and visuals

**Input:**
- Repository path
- Project description (brief)
- Target audience

**Output:**
- Formatted README.md
- Badges (build status, coverage, etc.)
- Quick start guide
- Contribution guidelines
- License information

**Value Proposition:**
"A perfect README in 90 seconds."

---

## Category: Refactoring

### 7. Legacy Code Modernizer
**Difficulty:** Advanced  
**Duration:** 5-8 minutes  
**Agents:** zen-architect, modular-builder, test-coverage

**Description:**
Incrementally modernizes legacy code while preserving behavior.

**Steps:**
1. Analyze legacy code patterns (zen-architect)
2. Generate characterization tests (test-coverage)
3. Plan refactoring strategy (zen-architect)
4. Apply modern patterns (modular-builder)
5. Validate with tests
6. Document changes and rationale

**Input:**
- Legacy code files
- Target language/framework version
- Modernization goals

**Output:**
- Refactored code
- Migration guide
- Test suite ensuring equivalence
- Breaking change report

**Value Proposition:**
"Modernize legacy code safely and systematically."

---

### 8. Dependency Upgrade Analyzer
**Difficulty:** Intermediate  
**Duration:** 3-4 minutes  
**Agents:** security-guardian, explorer, zen-architect

**Description:**
Analyzes dependency upgrades for breaking changes and security improvements.

**Steps:**
1. Check current dependencies (explorer)
2. Identify available updates
3. Analyze changelogs for breaking changes
4. Assess security vulnerabilities (security-guardian)
5. Create upgrade plan with priorities (zen-architect)
6. Generate compatibility report

**Input:**
- Package manifest (package.json, requirements.txt, etc.)
- Current versions
- Risk tolerance

**Output:**
- Prioritized upgrade list
- Breaking change summary
- Security vulnerability report
- Migration effort estimates

**Value Proposition:**
"Know exactly what will break before you upgrade."

---

## Category: Security

### 9. Security Audit Suite
**Difficulty:** Intermediate  
**Duration:** 4-5 minutes  
**Agents:** security-guardian, bug-hunter, zen-architect

**Description:**
Comprehensive security analysis covering code, dependencies, and configuration.

**Steps:**
1. Scan for common vulnerabilities (security-guardian)
2. Analyze authentication/authorization (zen-architect)
3. Check dependency security (security-guardian)
4. Review configuration for misconfigurations
5. Generate compliance checklist (OWASP, etc.)
6. Prioritize findings by CVSS score

**Input:**
- Source code
- Configuration files
- Dependency manifests
- Compliance requirements (optional)

**Output:**
- Vulnerability report with CVSS scores
- Exploitation scenarios
- Remediation guidance
- Compliance checklist

**Value Proposition:**
"Enterprise-grade security audit in minutes, not days."

---

### 10. Secrets Scanner & Remediator
**Difficulty:** Beginner  
**Duration:** 2 minutes  
**Agents:** security-guardian, modular-builder

**Description:**
Finds hardcoded secrets and helps migrate to secure storage.

**Steps:**
1. Scan for hardcoded secrets (security-guardian)
2. Identify secret types (API keys, passwords, tokens)
3. Assess exposure risk
4. Generate secure configuration template (modular-builder)
5. Create migration guide
6. Validate remediation

**Input:**
- Source code repository
- Configuration files
- Target secret management system

**Output:**
- Secret inventory with risk levels
- Secure configuration templates
- Migration script
- Git history cleanup guide

**Value Proposition:**
"Find and fix secret leaks before they reach production."

---

## Category: Data & Analysis

### 11. Data Quality Validator
**Difficulty:** Intermediate  
**Duration:** 3-4 minutes  
**Agents:** explorer, zen-architect

**Description:**
Analyzes datasets for quality issues and suggests improvements.

**Steps:**
1. Profile data structure (explorer)
2. Detect null patterns, outliers, inconsistencies
3. Validate against schema expectations
4. Assess completeness and accuracy
5. Generate cleaning script (zen-architect)
6. Document data quality metrics

**Input:**
- Dataset (CSV, JSON, database)
- Expected schema (optional)
- Quality thresholds

**Output:**
- Data quality report
- Issue inventory with examples
- Cleaning script
- Recommended validations

**Value Proposition:**
"Know your data quality before it causes problems."

---

### 12. SQL Query Optimizer
**Difficulty:** Intermediate  
**Duration:** 2-3 minutes  
**Agents:** zen-architect, bug-hunter

**Description:**
Analyzes SQL queries for performance issues and suggests optimizations.

**Steps:**
1. Parse query structure (explorer)
2. Identify performance anti-patterns (zen-architect)
3. Analyze index usage
4. Suggest query rewrites
5. Estimate performance impact
6. Generate optimized version

**Input:**
- SQL queries
- Schema information
- Expected data volume

**Output:**
- Performance analysis
- Optimized queries
- Index recommendations
- Execution plan improvements

**Value Proposition:**
"Turn slow queries into fast ones automatically."

---

## Category: DevOps & Automation

### 13. CI/CD Pipeline Generator
**Difficulty:** Intermediate  
**Duration:** 3-4 minutes  
**Agents:** zen-architect, security-guardian, modular-builder

**Description:**
Generates complete CI/CD pipeline based on project characteristics.

**Steps:**
1. Detect project type and tech stack (explorer)
2. Identify test and build requirements
3. Design pipeline stages (zen-architect)
4. Add security scanning (security-guardian)
5. Generate pipeline YAML (modular-builder)
6. Create deployment strategy

**Input:**
- Repository details
- Deployment target (AWS, Azure, etc.)
- Quality gates (test coverage, etc.)

**Output:**
- CI/CD pipeline config (GitHub Actions, GitLab CI, etc.)
- Deployment scripts
- Environment configuration
- Rollback strategy

**Value Proposition:**
"Production-ready CI/CD in minutes, not hours."

---

### 14. Infrastructure-as-Code Validator
**Difficulty:** Advanced  
**Duration:** 4-5 minutes  
**Agents:** security-guardian, zen-architect

**Description:**
Validates Terraform/CloudFormation for security and best practices.

**Steps:**
1. Parse IaC configurations (explorer)
2. Check security best practices (security-guardian)
3. Validate resource relationships (zen-architect)
4. Identify cost optimization opportunities
5. Check compliance requirements
6. Generate remediation plan

**Input:**
- IaC files (Terraform, CloudFormation, etc.)
- Cloud provider
- Compliance requirements

**Output:**
- Security findings
- Cost optimization suggestions
- Compliance checklist
- Refactored configurations

**Value Proposition:**
"Catch infrastructure issues before they're deployed."

---

## Category: Content Creation

### 15. Blog Post Optimizer
**Difficulty:** Beginner  
**Duration:** 2-3 minutes  
**Agents:** zen-architect (configured for content)

**Description:**
Analyzes blog posts for SEO, readability, and engagement.

**Steps:**
1. Analyze content structure
2. Check SEO optimization (keywords, meta, headings)
3. Assess readability (Flesch score, sentence length)
4. Suggest improvements for engagement
5. Generate social media snippets
6. Create meta descriptions

**Input:**
- Blog post content (Markdown or HTML)
- Target keywords
- Audience description

**Output:**
- SEO score and improvements
- Readability analysis
- Engagement suggestions
- Social media variants
- Meta tags

**Value Proposition:**
"Make every blog post SEO-perfect before publishing."

---

### 16. Video Script Generator
**Difficulty:** Beginner  
**Duration:** 2-3 minutes  
**Agents:** zen-architect (content mode)

**Description:**
Creates structured video scripts with timing and shot suggestions.

**Steps:**
1. Understand video topic and goal
2. Research key points to cover
3. Structure narrative arc
4. Write scene-by-scene script
5. Add timing estimates
6. Suggest visuals and B-roll

**Input:**
- Video topic
- Target duration
- Audience type
- Key messages

**Output:**
- Scene-by-scene script
- Timing breakdown
- Visual suggestions
- Hook and CTA copy

**Value Proposition:**
"Go from idea to shoot-ready script in minutes."

---

## Category: Learning & Exploration

### 17. Technology Comparator
**Difficulty:** Beginner  
**Duration:** 3-4 minutes  
**Agents:** explorer, zen-architect

**Description:**
Compares technologies/frameworks to help make informed decisions.

**Steps:**
1. Research each technology (explorer)
2. Extract key features and limitations
3. Analyze use case fit (zen-architect)
4. Compare ecosystem maturity
5. Assess learning curve
6. Generate decision matrix

**Input:**
- Technologies to compare
- Use case description
- Team context (size, skills)

**Output:**
- Side-by-side comparison matrix
- Pros/cons for each option
- Recommendation with reasoning
- Migration considerations

**Value Proposition:**
"Make technology decisions with confidence."

---

### 18. Learning Path Generator
**Difficulty:** Beginner  
**Duration:** 2-3 minutes  
**Agents:** zen-architect

**Description:**
Creates personalized learning roadmap for a technology or skill.

**Steps:**
1. Assess current skill level
2. Define learning goals
3. Research best resources
4. Structure progressive curriculum
5. Create milestone checkpoints
6. Suggest projects to build

**Input:**
- Technology to learn
- Current experience level
- Learning goals
- Time availability

**Output:**
- Step-by-step learning path
- Resource recommendations
- Practice projects
- Milestone assessments

**Value Proposition:**
"Learn anything with a personalized roadmap."

---

## Recipe Template Structure

Each recipe in the gallery should include:

```yaml
name: "recipe-name"
description: "Brief, compelling description"
author: "amplifier-team"
version: "1.0.0"
difficulty: "beginner|intermediate|advanced"
estimated_duration: "2-3 minutes"
category: "code-quality|documentation|security|..."

# Input schema
inputs:
  - name: "file_path"
    type: "file"
    description: "Path to file to analyze"
    required: true
    example: "src/auth.py"
  
  - name: "language"
    type: "select"
    description: "Programming language"
    options: ["python", "javascript", "java", "go"]
    default: "python"

# Context available throughout recipe
context:
  file_path: "{{inputs.file_path}}"
  language: "{{inputs.language}}"

# Recipe steps
steps:
  - id: "step-1"
    name: "Human-readable step name"
    agent: "zen-architect"
    mode: "ANALYZE"
    prompt: |
      Analyze {{file_path}} for architectural issues.
      Language: {{language}}
    output: "analysis"
    
  # Additional steps...

# Output formatting
outputs:
  format: "markdown"
  template: "report.md"
  artifacts:
    - "analysis"
    - "recommendations"
```

---

## Gallery Metadata

Each recipe should have rich metadata for discovery:

- **Tags:** Searchable keywords
- **Use Cases:** When to use this recipe
- **Prerequisites:** Required setup or context
- **Related Recipes:** Recipes that complement this one
- **Success Metrics:** What good output looks like
- **Customization Guide:** How to adapt for specific needs

---

## Community Contribution Template

To encourage community recipes, provide a template:

```yaml
name: "my-custom-recipe"
description: "What this recipe does and why it's useful"
author: "github-username"
version: "1.0.0"
difficulty: "beginner"
estimated_duration: "X minutes"
category: "custom"

# Required: Define what inputs are needed
inputs:
  # Your inputs here

# Required: Define the workflow
steps:
  # Your steps here

# Optional: Configure output format
outputs:
  format: "markdown"

# Required: Document the recipe
documentation: |
  ## Overview
  Explain what this does
  
  ## When to Use
  Describe use cases
  
  ## Example
  Show expected output
```

---

## Featured Recipe Rotation

Homepage should rotate featured recipes weekly:

- **Week 1:** Code Review (show quality focus)
- **Week 2:** API Documentation (show automation)
- **Week 3:** Security Audit (show enterprise value)
- **Week 4:** Learning Path (show versatility)

---

## Recipe Performance Metrics

Track for each recipe:
- Execution count
- Success rate
- Average duration
- User ratings
- Fork count
- Customization rate

Use this data to:
- Identify popular patterns
- Improve failing recipes
- Guide new recipe development
- Showcase in gallery
