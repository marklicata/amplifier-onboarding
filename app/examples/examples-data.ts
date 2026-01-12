// Examples data structure for product transformation examples

export interface ProductExample {
  id: string;
  name: string;
  icon: string;
  category: 'developer' | 'productivity' | 'cloud' | 'consumer' | 'gaming';
  
  asIs: {
    title: string;
    description: string;
    structure: string[];
  };
  
  toBe: {
    title: string;
    description: string;
    structure: string[];
  };
  
  enables: Capability[];
  scenarios: Scenario[];
  summary: string;
}

export interface Capability {
  title: string;
  description: string;
  details?: string;
  codeExample?: string;
  yamlExample?: string;
}

export interface Scenario {
  title: string;
  before: string;
  after: string;
  impact?: string;
}

// VS Code Example
export const vsCodeExample: ProductExample = {
  id: 'vs-code',
  name: 'VS Code',
  icon: '🖥️',
  category: 'developer',
  
  asIs: {
    title: 'Editor with AI',
    description: 'VS Code today offers fixed features with generic AI assistance',
    structure: [
      'Python Extension (fixed features)',
      'Linting (predefined rules)',
      'IntelliSense (static completion)',
      'Copilot (generic code suggestions)',
      'Standard debugging',
      'Basic Git integration'
    ]
  },
  
  toBe: {
    title: 'Development Intelligence Platform',
    description: 'VS Code as an Amplifier runtime hosts org-specific, composable intelligence',
    structure: [
      'Core Editor (mechanisms: text, UI, filesystem)',
      '[Your Org\'s Python Development Bundle]',
      '  • Architecture advisor (knows your patterns)',
      '  • Security reviewer (knows your policies)',
      '  • Multi-agent code review workflow',
      '  • Org-specific linters and validators',
      '[Domain Bundles] (finance, healthcare, etc.)',
      '[Project-Specific Bundles]'
    ]
  },
  
  enables: [
    {
      title: 'Org-Specific Development Environment',
      description: 'New engineers get your organization\'s development intelligence from day one',
      details: 'Install `amplifier bundle install contoso/python-dev` and immediately get Contoso\'s architecture patterns, security policies, code style, and review workflows. Not generic Python help—Contoso\'s way of building Python.',
      yamlExample: `# contoso-python-dev-bundle.yaml
behaviors:
  - architecture-advisor:
      patterns: ./docs/architecture-patterns.md
      enforces: [clean-architecture, dependency-injection]
  - security-reviewer:
      policies: ./security/policies.yaml
      blocks_commits_on: [critical, high]
  - code-review-workflow:
      agents: [architect, security, test-coverage, docs]
      approval_required: true`
    },
    {
      title: 'Dynamic Capability Composition',
      description: 'Switch intelligence contexts instantly based on what you\'re working on',
      details: 'Load different bundles for different projects or domains without changing your editor.',
      codeExample: `# Switch context based on project
$ amplifier bundle load finance/compliance
# Now: Financial domain knowledge, PCI-DSS validation

$ amplifier bundle load healthcare/hipaa  
# Now: Healthcare compliance, HIPAA validation`
    },
    {
      title: 'Multi-Agent Development Workflows',
      description: 'Right-click to run comprehensive reviews following your org\'s exact process',
      details: 'Spawn coordinated agent workflows: architect agent → security agent → test coverage agent → documentation agent. Each brings different expertise, results aggregated into actionable recommendations.',
      yamlExample: `# code-review-recipe.yaml
steps:
  - agent: architect-reviewer
    instruction: "Review for architecture compliance"
  - agent: security-scanner
    instruction: "Scan for vulnerabilities"
  - agent: test-analyzer
    instruction: "Check test coverage and quality"
  - agent: doc-validator
    instruction: "Ensure documentation standards"`
    },
    {
      title: 'Intelligence That Learns Your Codebase',
      description: 'Bundles that understand your specific project and enforce your standards',
      yamlExample: `# project-bundle.yaml
behaviors:
  - codebase-aware:
      learns_from: ./src
      enforces: ./docs/architecture.md
  - testing-workflow:
      requires_integration_tests: true
      runs_on_save: true
  - commit-standards:
      format: conventional-commits
      requires_issue_reference: true`
    }
  ],
  
  scenarios: [
    {
      title: 'New Engineer Onboarding',
      before: 'Developer joins Contoso, installs VS Code + standard extensions. Reads wiki pages on "how we do things". Learns patterns through code review feedback over months. Inconsistent application of org standards.',
      after: 'Developer installs VS Code + `amplifier bundle install contoso/dev-environment`. Architect agent knows Contoso patterns, suggests them proactively. Security agent blocks commits violating Contoso policies. Code review recipe runs Contoso\'s exact review process automatically.',
      impact: 'Consistent enforcement from day one. Months of tribal knowledge transferred instantly.'
    },
    {
      title: 'Context Switching Between Projects',
      before: 'Developer switches from finance project to healthcare project. Must remember different compliance rules, different architecture patterns, different security requirements. Often makes mistakes that are caught in review.',
      after: 'Developer switches bundles: `amplifier bundle load healthcare/hipaa`. Editor now has HIPAA compliance validation, healthcare architecture patterns, PHI data handling rules. Context-appropriate intelligence automatically.',
      impact: 'Zero context-switch overhead. Reduced compliance violations.'
    }
  ],
  
  summary: 'VS Code stops being "a code editor with AI" → becomes "a development intelligence platform running your org\'s bundles"'
};

// Excel Example
export const excelExample: ProductExample = {
  id: 'excel',
  name: 'Excel',
  icon: '📊',
  category: 'productivity',
  
  asIs: {
    title: 'Spreadsheet with AI',
    description: 'Excel today offers generic analysis and standard formulas',
    structure: [
      'Formulas (predefined functions)',
      'Charts (standard visualizations)',
      'AI Insights (generic analysis)',
      'Copilot (generic data suggestions)'
    ]
  },
  
  toBe: {
    title: 'Domain Analysis Platform',
    description: 'Excel as Amplifier runtime hosts industry-specific intelligence',
    structure: [
      'Core Engine (grid, formulas, charts)',
      '[Finance Bundle]',
      '  • Financial model auditor',
      '  • DCF validation workflow',
      '  • GAAP compliance checker',
      '[Healthcare Analytics Bundle]',
      '[Your Company\'s FP&A Bundle]'
    ]
  },
  
  enables: [
    {
      title: 'Industry-Specific Intelligence',
      description: 'Load domain bundles that bring expert-level analysis to your spreadsheets',
      codeExample: `# Financial analyst loads:
$ amplifier bundle load finance/equity-analysis

# Now Excel has:
- "Analyze company using Porter's Five Forces"
- "Validate DCF assumptions" 
- "Generate investment memo"`
    },
    {
      title: 'Company-Specific Workflows',
      description: 'Automate your organization\'s exact processes with one click',
      yamlExample: `# contoso-fpa-bundle.yaml
recipes:
  monthly_close:
    - agent: data-validator
      context: "Contoso's GL structure"
    - agent: variance-analyzer  
      thresholds: ./config/variance-thresholds.yaml
    - agent: report-generator
      format: ./templates/executive-report.xlsx
    - approval_gate: CFO_review`
    },
    {
      title: 'Real-Time Domain Validation',
      description: 'Agents validate compliance and correctness as you work',
      details: 'Healthcare: HIPAA compliance validation. Finance: GAAP formula checking. Pharma: FDA regulations validation.'
    }
  ],
  
  scenarios: [
    {
      title: 'Financial Analyst Building DCF Model',
      before: 'Analyst builds DCF model manually. Validates against company\'s investment criteria by hand. Sends to senior analyst for review. Multiple rounds of back-and-forth. Process takes days.',
      after: 'Analyst builds DCF with `contoso/equity-analysis` bundle loaded. Real-time validation against Contoso\'s criteria. "Run Investment Analysis Recipe" → multi-agent workflow validates model, analyzes comparables, assesses risk, generates memo.',
      impact: 'Complete analysis in minutes, ready for senior review. Consistent application of company standards.'
    },
    {
      title: 'Monthly Financial Close',
      before: 'FP&A team manually validates data, calculates variances, formats reports. Takes 2-3 days. Error-prone. Different analysts format differently.',
      after: 'Click "Run Monthly Close Recipe". Agents validate data against GL structure, analyze variances using company thresholds, generate executive report in company format. CFO approval gate. Complete in hours.',
      impact: 'Close process accelerated 10x. Zero formatting inconsistencies. Automated compliance documentation.'
    }
  ],
  
  summary: 'Excel stops being "a spreadsheet with AI" → becomes "a domain analysis platform running your industry\'s bundles"'
};

// Word Example
export const wordExample: ProductExample = {
  id: 'word',
  name: 'Word',
  icon: '📝',
  category: 'productivity',

  asIs: {
    title: 'Word Processor',
    description: 'Word today offers generic writing assistance',
    structure: [
      'Spelling/Grammar (generic rules)',
      'Copilot (generic writing suggestions)',
      'Editor (general writing feedback)'
    ]
  },

  toBe: {
    title: 'Document Intelligence Platform',
    description: 'Word as Amplifier runtime hosts domain-specific document intelligence',
    structure: [
      'Core Engine (text editing, formatting)',
      '[Legal Bundle]',
      '  • Contract clause analyzer',
      '  • Risk assessor (flags problematic language)',
      '  • Multi-agent contract review',
      '  • Case law citation validator',
      '[Regulatory Compliance Bundle]',
      '[Your Company\'s Communications Bundle]'
    ]
  },

  enables: [
    {
      title: 'Domain-Specific Document Creation',
      description: 'Get domain expert assistance, not generic writing help',
      details: 'Lawyer writing contract: Legal bundle identifies missing clauses, suggests precedent-based language. Pharma researcher writing submission: Regulatory bundle validates against FDA requirements.'
    },
    {
      title: 'Org-Specific Process Enforcement',
      description: 'Enforce your organization\'s workflows and approval processes',
      yamlExample: `# contoso-legal-bundle.yaml
workflows:
  contract_review:
    - agent: financial-terms
      validates: "Contoso's risk tolerance"
    - agent: liability-analyzer
      flags: "Contoso-specific concerns"
    - agent: compliance
      checks: "Contoso's legal policies"
    - approval_gate: legal_counsel`
    },
    {
      title: 'Multi-Agent Document Analysis',
      description: 'Comprehensive document review from multiple expert perspectives',
      details: '"Review this contract" spawns: legal agent → financial agent → risk agent → compliance agent. Each brings different expertise, produces comprehensive analysis. Result aggregated into actionable recommendations.'
    }
  ],

  scenarios: [
    {
      title: 'Legal Contract Review',
      before: 'Legal team drafts contract using templates. Senior lawyer reviews for missing clauses. Finance reviews for problematic terms. Compliance reviews for policy violations. Multiple review cycles, takes weeks.',
      after: 'Legal team drafts contract with `contoso/legal` bundle loaded. Real-time flagging of missing standard clauses. Financial terms automatically checked against risk tolerance. "Run Contract Review Recipe" → comprehensive multi-agent analysis.',
      impact: 'Most issues caught before human review. Cycle time reduced from weeks to days.'
    },
    {
      title: 'Regulatory Document Submission',
      before: 'Pharma researcher writes FDA submission. Compliance team reviews against 21 CFR Part 11. Multiple rounds of revisions. Manual audit trail creation. Process takes months.',
      after: 'Researcher writes with `pharma/regulatory` bundle loaded. Real-time validation against FDA requirements. Automatic version control with audit trail. Compliance pre-approved issues flagged immediately.',
      impact: 'Submission quality improved. Review cycles reduced. Continuous compliance documentation.'
    }
  ],

  summary: 'Word stops being "a word processor with AI" → becomes "a document intelligence platform running your domain\'s bundles"'
};

// Azure Example
export const azureExample: ProductExample = {
  id: 'azure',
  name: 'Azure',
  icon: '☁️',
  category: 'cloud',

  asIs: {
    title: 'Cloud Platform',
    description: 'Azure today offers generic cloud infrastructure',
    structure: [
      'Portal (manual configuration)',
      'ARM Templates (static infrastructure-as-code)',
      'Azure Advisor (generic recommendations)',
      'Cost Management (basic usage tracking)',
      'Copilot in Azure (generic assistance)'
    ]
  },

  toBe: {
    title: 'Infrastructure Intelligence Platform',
    description: 'Azure as Amplifier runtime hosts industry and org-specific infrastructure intelligence',
    structure: [
      'Core Infrastructure (compute, storage, networking)',
      '[FinServ Compliance Bundle]',
      '  • PCI-DSS validator (real-time compliance)',
      '  • Data residency enforcer',
      '  • Audit-ready deployment workflow',
      '[Cost Optimization Bundle]',
      '[Healthcare Workload Bundle]',
      '[Your Company\'s Azure Standards Bundle]'
    ]
  },

  enables: [
    {
      title: 'Industry-Specific Cloud Deployment',
      description: 'Automatic compliance validation for your industry',
      codeExample: `# Healthcare company deploying new app:
$ amplifier bundle load azure/healthcare-hipaa

# Now Azure automatically:
- Validates HIPAA compliance for every resource
- Enforces data encryption at rest and in transit
- Validates network isolation for PHI
- Documents compliance posture in real-time`
    },
    {
      title: 'Intelligent Cost Management',
      description: 'Multi-agent workflows for comprehensive cost optimization',
      yamlExample: `# cost-optimization-bundle.yaml
recipes:
  monthly_optimization:
    - agent: workload-analyzer
      identifies: "underutilized resources"
    - agent: right-sizing-advisor
      recommends: "optimal SKUs"
    - agent: reserved-capacity-optimizer
      analyzes: "commitment opportunities"
    - agent: architecture-optimizer
      suggests: "architectural improvements"
    - approval_gate: engineering_lead
    - agent: implementation-planner
      generates: "migration plan"`
    },
    {
      title: 'Org-Specific Infrastructure Standards',
      description: 'Enforce your organization\'s naming, networking, and cost allocation standards',
      yamlExample: `# contoso-azure-standards.yaml
behaviors:
  - naming-enforcer:
      pattern: "{env}-{region}-{app}-{resource}"
      requires_approval_for_exceptions: true
  - network-topology:
      validates_against: ./docs/network-architecture.md
      auto_suggests_peering: true
  - cost-allocation:
      tags_required: [cost-center, project, environment]
      chargeback_model: ./finance/chargeback-rules.yaml`
    },
    {
      title: 'Deployment Intelligence',
      description: 'Multi-agent validation and orchestration for production deployments',
      details: '"Deploy production environment" triggers: Architecture validator → Security analyzer → Compliance checker → Cost estimator → Documentation generator → Approval gate → Deployment orchestrator with rollback plan.'
    }
  ],

  scenarios: [
    {
      title: 'Financial Services Deployment',
      before: 'Engineer deploys resources manually via portal. Security team reviews configuration (days later). Compliance team audits for PCI-DSS (weeks later). Issues found → Engineer redeploys → Review cycle repeats. Production deployment takes months.',
      after: 'Engineer deploys with `finserv/pci-dss` bundle loaded. Real-time PCI-DSS validation as resources are configured. Automated security posture documentation. Compliance agent pre-approves or flags issues immediately.',
      impact: 'Production deployment takes days with continuous compliance. Security and compliance issues caught immediately.'
    },
    {
      title: 'Cost Crisis Response',
      before: 'Monthly bill arrives, 40% over budget. Manual spreadsheet analysis of usage. Engineer investigates each resource. Ad-hoc right-sizing recommendations. Weeks to identify and implement optimizations.',
      after: 'Cost spike detected → "Run Cost Analysis Recipe". Multi-agent analysis identifies anomalies, recommends SKU changes, suggests design improvements, calculates ROI, prioritizes by impact.',
      impact: 'Complete analysis and prioritized action plan in hours instead of weeks.'
    }
  ],

  summary: 'Azure stops being "a cloud platform with generic tools" → becomes "an infrastructure intelligence platform running your industry\'s bundles"'
};

// Gaming Example
export const gamingExample: ProductExample = {
  id: 'gaming',
  name: 'Xbox/Gaming',
  icon: '🎮',
  category: 'gaming',

  asIs: {
    title: 'Fixed Gaming Experience',
    description: 'Gaming today offers the same experience for everyone',
    structure: [
      'Game Library (install and play)',
      'Achievements (predefined milestones)',
      'Social Features (friends, parties, chat)',
      'Game Pass (curated recommendations)',
      'Xbox Assist (generic help)'
    ]
  },

  toBe: {
    title: 'Personalized Gaming Intelligence',
    description: 'Gaming as Amplifier runtime hosts personalized gaming intelligence',
    structure: [
      'Core Platform (game execution, social, marketplace)',
      '[Player Style Bundle]',
      '  • Playstyle analyzer (learns your preferences)',
      '  • Challenge calibrator (adjusts difficulty)',
      '  • Content recommender (truly personalized)',
      '[Competitive Gaming Bundle]',
      '[Accessibility Bundle]',
      '[Content Creation Bundle]',
      '[Parent/Guardian Bundle]'
    ]
  },

  enables: [
    {
      title: 'Truly Personalized Gaming Experience',
      description: 'Different bundles for different play styles',
      codeExample: `# Casual player loads:
$ amplifier bundle load gaming/casual-explorer
# Gets: Story-focused recommendations, reduced challenge,
# cooperative social features, guided assistance

# Competitive player loads:
$ amplifier bundle load gaming/esports-competitor
# Gets: Meta-analysis, performance optimization,
# match analysis and coaching, team coordination`
    },
    {
      title: 'Adaptive Difficulty and Challenge',
      description: 'Game adapts in real-time to maintain flow state',
      yamlExample: `# adaptive-challenge-bundle.yaml
behaviors:
  - difficulty-calibration:
      analyzes: [death_frequency, completion_time, stress_indicators]
      adjusts: [enemy_health, resource_availability, hint_frequency]
      goal: maintain_flow_state
  - learning-path:
      identifies_skill_gaps: true
      suggests_practice_scenarios: true
      celebrates_mastery: true`
    },
    {
      title: 'Smart Content Discovery',
      description: 'Multi-agent analysis for truly personalized recommendations',
      details: 'Not just "people who played X also played Y". Analyzes: playstyle, current mood, social context, time availability, genre preference evolution. Result: "Based on your playstyle tonight, here\'s what will feel great"'
    },
    {
      title: 'Performance Coaching for Competitive Players',
      description: 'AI-powered post-match analysis for competitive improvement',
      yamlExample: `# esports-coaching-bundle.yaml
recipes:
  post_match_analysis:
    - agent: mechanics-analyzer
      tracks: "APM, accuracy, timing"
    - agent: strategy-evaluator
      assesses: "decision quality"
    - agent: positioning-coach
      reviews: "map awareness"
    - agent: team-synergy-analyst
      evaluates: "coordination"
    - agent: mental-game-coach
      detects: "tilt patterns"
    - output: personalized_improvement_plan`
    },
    {
      title: 'Accessibility That Learns You',
      description: 'Adaptive accessibility based on your specific needs',
      details: 'Agent learns: which visual cues you struggle with, which audio signals you miss, your input patterns and limitations, your cognitive processing speed. Result: Accessibility that adapts to you, not preset options.'
    },
    {
      title: 'Family Gaming Management',
      yamlExample: `# family-gaming-bundle.yaml
behaviors:
  - content-guidance:
      age_appropriate: auto_filter
      educational_value: highlight
      social_interaction: monitor_and_guide
  - time-management:
      respects_schedules: true
      suggests_stopping_points: true
      rewards_healthy_habits: true
  - skill-development:
      tracks_learning: [problem_solving, coordination, creativity]
      suggests_growth_opportunities: true`,
      description: 'Smart management tools for parents and guardians',
    }
  ],

  scenarios: [
    {
      title: 'The Casual Player',
      before: 'Sarah plays after work to unwind. Gets same difficulty as hardcore players. Dies repeatedly, gets frustrated. Gives up, game collects dust.',
      after: 'Sarah loads `casual-explorer` bundle. Game analyzes: tired, wants story, dislikes frustration. Difficulty adapts: more forgiving, more guidance. Content recommends: story-rich, lower stress.',
      impact: 'Relaxing experience. Sarah keeps playing instead of quitting.'
    },
    {
      title: 'The Competitive Player',
      before: 'Jake wants to go pro. Watches YouTube tutorials for hours. Doesn\'t know what to practice. Progress is slow and unfocused.',
      after: 'Jake loads `esports-competitor` bundle. After each match: "Run Performance Analysis Recipe". Multi-agent analysis identifies: accuracy drops under pressure, over-commits to early fights, exposed positioning. Personalized practice scenarios generated.',
      impact: 'Focused improvement with measurable progress toward pro level.'
    },
    {
      title: 'The Parent',
      before: 'Parent worried about gaming impact. Sets arbitrary time limits. Conflicts with child. No insight into what child is experiencing.',
      after: 'Parent loads `family-gaming` bundle. Smart time management suggests natural stopping points. Content guidance flags concerning interactions. Skill development tracking shows improved problem-solving.',
      impact: 'Informed parenting decisions. Healthier gaming relationship.'
    }
  ],

  summary: 'Gaming stops being "same experience for everyone" → becomes "personalized intelligence that adapts to each player\'s needs"'
};

// Consumer Copilot Example
export const copilotConsumerExample: ProductExample = {
  id: 'copilot-consumer',
  name: 'Copilot Consumer',
  icon: '🤖',
  category: 'consumer',

  asIs: {
    title: 'AI Assistant',
    description: 'Copilot today offers the same AI for everyone',
    structure: [
      'Chat Interface (generic conversations)',
      'Web Search (standard results)',
      'Image Generation (basic prompts)',
      'Document Analysis (simple Q&A)',
      'Task Suggestions (generic productivity)'
    ]
  },

  toBe: {
    title: 'Personalized Intelligence Companion',
    description: 'Copilot as Amplifier runtime hosts deeply personalized intelligence',
    structure: [
      'Core LLM (language understanding, generation)',
      '[Professional Context Bundle]',
      '  • Career domain expert (your industry)',
      '  • Work style optimizer (learns how you work)',
      '[Learning & Development Bundle]',
      '[Personal Finance Bundle]',
      '[Health & Wellness Bundle]',
      '[Your Personal Context Bundle]'
    ]
  },

  enables: [
    {
      title: 'Context-Aware Daily Intelligence',
      description: 'Morning planning that understands you holistically',
      codeExample: `User: "What should I focus on today?"

# Without Amplifier:
Generic productivity suggestions

# With Amplifier (professional + personal bundles):
- "Your presentation is in 3 days, you work best with 2-day lead"
- "You have deep work capacity 9-11am based on your patterns"
- "Your stress indicators suggest taking lunch outside today"
- "The project deadline shift affects your vacation planning"`
    },
    {
      title: 'Personalized Learning Acceleration',
      description: 'Learning adapted to your background, style, and pace',
      yamlExample: `# learning-bundle.yaml
behaviors:
  - learning-style-adapter:
      detects: [visual_learner, needs_examples, prefers_hands_on]
      adjusts_explanations: true
      provides_analogies_from: [your_background, your_interests]
  - knowledge-building:
      tracks_what_you_know: true
      fills_gaps_systematically: true
      connects_to_prior_knowledge: true`
    },
    {
      title: 'Decision Support That Knows You',
      description: 'Analysis based on your values, patterns, and context',
      yamlExample: `# decision-support-bundle.yaml
recipes:
  major_decision_analysis:
    - agent: values-alignment-checker
      uses: "your stated values"
    - agent: pattern-analyzer
      learns_from: "how you've decided similar things"
    - agent: regret-minimizer
      teaches_from: "your past regrets"
    - agent: stakeholder-impact
      considers: "people who matter to you"
    - agent: time-horizon-matcher
      matches: "your planning style"
    - output: decision_framework_personalized_to_you`
    },
    {
      title: 'Proactive Life Management',
      description: 'Anticipates conflicts and bottlenecks before they become crises',
      details: 'Knows your goals, commitments, deadlines. Anticipates conflicts. Suggests interventions early. Example: "Your project deadline and vacation overlap in 2 weeks. Want to adjust?"'
    },
    {
      title: 'Communication Style Adaptation',
      description: 'Drafts that sound like you, not generic AI',
      yamlExample: `# communication-bundle.yaml
behaviors:
  - style-matcher:
      learns_your_voice: true
      adapts_formality: context_dependent
      preserves_your_quirks: true
  - email-drafter:
      knows_your_relationships: true
      matches_previous_tone: true
      flags_out_of_character: true`
    },
    {
      title: 'Privacy-Preserving Personal Intelligence',
      description: 'Sensitive analysis happens locally, you control what is shared',
      details: 'Financial analysis happens locally, not cloud. Health data never leaves your device. Sensitive contexts flagged automatically. You control what intelligence is shared vs local-only.'
    }
  ],

  scenarios: [
    {
      title: 'Career Decision',
      before: 'User: "Should I take this job offer?" Copilot: Generic pros/cons list, salary comparison, career progression info.',
      after: 'User: "Should I take this job offer?" Copilot runs Decision Analysis Recipe analyzing: values alignment (remote work + family priority), pattern analysis (left 2 jobs due to lack of autonomy), regret minimization (prioritized salary over culture before), stakeholder impact (partner\'s job change timing), time horizon (5-year goal to start business).',
      impact: 'Decision framework personalized to you, not generic advice.'
    },
    {
      title: 'Learning New Skill',
      before: 'User: "Teach me about machine learning" Copilot: Standard ML explanation with math.',
      after: 'User as designer: "Teach me about machine learning" Copilot explains using design analogies ("Like A/B testing but automated"), examples from design tools (Figma\'s auto-layout), pacing matched to absorption speed, design-relevant ML exercises, progress tracking ("ready for neural networks because you mastered regression").',
      impact: 'Learning path designed for your background, pace, and goals.'
    },
    {
      title: 'Daily Productivity',
      before: 'User: "Plan my day" Copilot: Suggests calendar review, task prioritization.',
      after: 'Copilot knows: writing-heavy in mornings (your patterns), deadline pressure (project context), skipped exercise 4 days (health tracking), partner\'s important evening plans (personal context). Suggests: "Block 9-11am for deep writing (your peak time). Lunch walk—you need movement. Defer low-priority meeting—conflicts with evening plans. Review client deck at 3pm—you\'re good at quick reviews then."',
      impact: 'Day plan that understands you holistically, not just your calendar.'
    },
    {
      title: 'Financial Health',
      before: 'User: "How\'s my spending?" Copilot: Basic budget analysis.',
      after: 'Multi-agent analysis (privacy-preserving): Pattern detector (stress spending up 30%), Goal tracker (down payment savings on track), Future predictor (car insurance renews next month, budget $200), Optimizer (switching streaming saves $15/month based on usage), Values check (80% spending aligns with priorities, up from 65%).',
      impact: 'Financial guidance that understands your psychology, not just numbers.'
    }
  ],

  summary: 'Copilot stops being "same AI for everyone" → becomes "intelligence companion that deeply understands you"'
};

// Export all examples
export const examples: ProductExample[] = [
  vsCodeExample,
  excelExample,
  wordExample,
  azureExample,
  gamingExample,
  copilotConsumerExample
];

export const examplesByCategory = {
  developer: [vsCodeExample],
  productivity: [excelExample, wordExample],
  cloud: [azureExample],
  gaming: [gamingExample],
  consumer: [copilotConsumerExample]
};
