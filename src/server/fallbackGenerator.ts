/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { AssessmentInput, RoadmapOutput, Phase, SkillGap, RecommendedProject, CertificationRecommendation, InterviewPreparationTopic } from '../types/career';

/**
 * High-fidelity curriculum synthesis engine tailored to the learner's assessment inputs.
 * Used when GROQ_API_KEY is not configured or as resilient fallback.
 */
export function generateCurriculumRoadmap(assessment: AssessmentInput): RoadmapOutput {
  const { desiredCareer, weeklyHours, targetMonths, currentSkills, educationLevel, experienceLevel } = assessment;
  const estimatedWeeks = Math.max(4, Math.min(104, targetMonths * 4));

  // Determine strengths from verified skills with level >= 3
  const verifiedStrengths = currentSkills
    .filter((s) => s.level >= 3)
    .map((s) => `${s.skill} (Level ${s.level}/5 - Demonstrated capability)`);

  if (verifiedStrengths.length === 0 && currentSkills.length > 0) {
    verifiedStrengths.push(`${currentSkills[0].skill} (Level ${currentSkills[0].level}/5 - Starting baseline foundation)`);
  }

  // Calculate career readiness score transparently
  const avgSkillLevel = currentSkills.length > 0
    ? currentSkills.reduce((acc, curr) => acc + curr.level, 0) / currentSkills.length
    : 1;
  
  const skillFactor = Math.min(40, (avgSkillLevel / 5) * 40);
  const educationFactor = educationLevel === 'Master / PhD' ? 25 : educationLevel === 'Bachelor Degree' ? 20 : educationLevel === 'Associate Degree' ? 15 : 12;
  const commitmentFactor = Math.min(25, (weeklyHours / 20) * 25);
  const expFactor = experienceLevel === 'Junior Developer / Career Switcher' ? 15 : experienceLevel === 'Intermediate Student' ? 10 : 5;

  const rawScore = Math.round(skillFactor + educationFactor + commitmentFactor + expFactor);
  const readinessScore = Math.max(15, Math.min(85, rawScore));

  // Generate target career specific skills & gap analysis
  const skillGaps = synthesizeSkillGaps(desiredCareer, currentSkills);

  // Generate phases based on weeks and weekly hours
  const phases = synthesizePhases(desiredCareer, estimatedWeeks, weeklyHours, skillGaps);

  // Projects tailored to career
  const projects = synthesizeProjects(desiredCareer);

  // Certifications
  const certifications = synthesizeCertifications(desiredCareer);

  // Interview preparation
  const interviewPreparation = synthesizeInterviewPrep(desiredCareer);

  const portfolioRecommendations = [
    `Host 3 production-grade, documented repositories on GitHub demonstrating ${desiredCareer} skills.`,
    'Include live deployed demos with interactive READMEs, architectural diagrams, and video walkthroughs.',
    'Write 2 technical breakdown articles detailing engineering trade-offs and performance benchmarks.',
    'Establish a clean personal portfolio domain showcasing problem statements and measurable outcomes.',
  ];

  const assumptions = [
    `Assuming consistent commitment of ${weeklyHours} hours per week without prolonged interruptions.`,
    `Assuming active hands-on coding and project building rather than passive video consumption.`,
    `Self-assessed ratings for [${currentSkills.map((s) => s.skill).join(', ')}] are assumed accurate.`,
    'Junior hiring market requirements may adjust based on regional trends and specialization.',
  ];

  return {
    id: `rm_${Date.now()}`,
    createdAt: new Date().toISOString(),
    careerGoal: desiredCareer,
    estimatedWeeks,
    weeklyHours,
    readiness: {
      score: readinessScore,
      explanation: `Calculated from current skills baseline (${Math.round(skillFactor)}/40), education background (${educationFactor}/25), weekly study commitment (${Math.round(commitmentFactor)}/25), and practical experience factor (${expFactor}/10).`,
      methodology: {
        baselineFoundation: educationFactor + expFactor,
        skillsCoverage: Math.round(skillFactor),
        timeCommitmentFactor: Math.round(commitmentFactor),
        formulaNotes: 'Weighted scoring model based on documented self-assessed proficiencies, education credentials, and expected total hours investment.',
      },
    },
    strengths: verifiedStrengths,
    skillGaps,
    phases,
    projects,
    certifications,
    interviewPreparation,
    portfolioRecommendations,
    assumptions,
    generatedWith: {
      source: 'fallback-ai',
      model: 'CareerPath-Synthesis-Engine (Adaptive Curriculum)',
      timestamp: new Date().toISOString(),
    },
  };
}

function synthesizeSkillGaps(career: string, currentSkills: { skill: string; level: number }[]): SkillGap[] {
  const careerLower = career.toLowerCase();
  const currentMap = new Map<string, number>();
  currentSkills.forEach((s) => currentMap.set(s.skill.toLowerCase().trim(), s.level));

  const standardTargets: Record<string, { skill: string; targetLevel: number; priority: 'High' | 'Medium' | 'Foundational'; reason: string; suggestedAction: string }[]> = {
    ai: [
      { skill: 'Python for Machine Learning', targetLevel: 5, priority: 'High', reason: 'Primary language for modern AI pipelines and modeling libraries.', suggestedAction: 'Deep dive into Python OOP, generators, NumPy vectorization, and profiling.' },
      { skill: 'PyTorch & Neural Networks', targetLevel: 4, priority: 'High', reason: 'Essential deep learning framework for training and fine-tuning models.', suggestedAction: 'Implement CNNs, Transformers, and autoencoders from scratch.' },
      { skill: 'Vector Databases & RAG Architecture', targetLevel: 4, priority: 'High', reason: 'Core architecture for enterprise LLM knowledge retrieval.', suggestedAction: 'Build embeddings pipeline with Qdrant/Pinecone, chunking strategies, and hybrid search.' },
      { skill: 'Linear Algebra & Statistics', targetLevel: 3, priority: 'Foundational', reason: 'Required to understand gradient descent, loss surfaces, and loss metrics.', suggestedAction: 'Review 3Blue1Brown linear algebra series and practical statistics exercises.' },
      { skill: 'FastAPI & Containerized Deployment', targetLevel: 4, priority: 'Medium', reason: 'Required to package AI models as low-latency microservices.', suggestedAction: 'Deploy containerized Docker endpoints with async request streaming.' },
    ],
    data: [
      { skill: 'SQL & Database Querying', targetLevel: 5, priority: 'High', reason: 'Fundamental requirement for extracting and aggregating business datasets.', suggestedAction: 'Master window functions, CTEs, query plan optimization, and indexing.' },
      { skill: 'Pandas & Data Wrangling', targetLevel: 4, priority: 'High', reason: 'Core library for cleaning and reshaping multi-source datasets.', suggestedAction: 'Complete real-world messy dataset normalization challenges on Kaggle.' },
      { skill: 'Statistical Hypothesis Testing', targetLevel: 4, priority: 'High', reason: 'Required to validate findings and design conclusive A/B experiments.', suggestedAction: 'Perform t-tests, ANOVA, and bootstrap resampling on experimental data.' },
      { skill: 'Scikit-Learn Machine Learning', targetLevel: 4, priority: 'Medium', reason: 'Standard toolkit for regression, clustering, and tree-based ensembles.', suggestedAction: 'Train XGBoost and Random Forest models with rigorous cross-validation.' },
      { skill: 'Data Visualization & Storytelling', targetLevel: 3, priority: 'Medium', reason: 'Critical for delivering executive insight summaries.', suggestedAction: 'Build interactive dashboards using Tableau, PowerBI, or Streamlit.' },
    ],
    web: [
      { skill: 'TypeScript & Modern JavaScript', targetLevel: 5, priority: 'High', reason: 'Industry standard language for scalable frontend and backend codebases.', suggestedAction: 'Master generics, utility types, async patterns, and strict typing.' },
      { skill: 'React & Component Architecture', targetLevel: 4, priority: 'High', reason: 'Most demanded frontend framework in the industry.', suggestedAction: 'Build modular apps using custom hooks, state reducers, and Tailwind CSS.' },
      { skill: 'Node.js & Express REST APIs', targetLevel: 4, priority: 'High', reason: 'Foundation for building scalable server-side microservices.', suggestedAction: 'Implement secure RESTful APIs with JWT auth, validation, and middleware.' },
      { skill: 'PostgreSQL & ORM Modeling', targetLevel: 4, priority: 'Medium', reason: 'Critical for persistent relational data schemas and transactional integrity.', suggestedAction: 'Design normalized schemas with Prisma or Drizzle ORM and migrations.' },
      { skill: 'Git & CI/CD Deployment', targetLevel: 3, priority: 'Foundational', reason: 'Essential collaborative developer workflow standard.', suggestedAction: 'Configure GitHub Actions pipelines for automated testing and deployment.' },
    ],
    security: [
      { skill: 'Networking & Protocol Analysis', targetLevel: 5, priority: 'High', reason: 'Underpins all network defense, packet inspection, and firewall policies.', suggestedAction: 'Capture and inspect packets with Wireshark; study TCP handshakes and DNS security.' },
      { skill: 'Linux Hardening & Shell Scripting', targetLevel: 4, priority: 'High', reason: 'Primary operating system for enterprise servers and security toolchains.', suggestedAction: 'Configure iptables, user permissions, SSH key policies, and Bash automation.' },
      { skill: 'OWASP Top 10 Web Security', targetLevel: 4, priority: 'High', reason: 'Critical knowledge for testing and securing web application vulnerabilities.', suggestedAction: 'Practice vulnerability identification in lab environments (PortSwigger Web Academy).' },
      { skill: 'SIEM Tools & Log Analysis', targetLevel: 3, priority: 'Medium', reason: 'Required for incident response, threat triage, and compliance auditing.', suggestedAction: 'Install Splunk or ELK stack and analyze simulated intrusion log records.' },
      { skill: 'Cryptography Fundamentals', targetLevel: 3, priority: 'Foundational', reason: 'Required to understand certificates, encryption at rest, and TLS.', suggestedAction: 'Study asymmetric encryption, hashing algorithms, and PKI infrastructure.' },
    ],
  };

  const domain = careerLower.includes('ai') || careerLower.includes('machine learning')
    ? standardTargets.ai
    : careerLower.includes('data')
    ? standardTargets.data
    : careerLower.includes('cyber') || careerLower.includes('security')
    ? standardTargets.security
    : standardTargets.web;

  return domain.map((target) => {
    const current = currentMap.get(target.skill.toLowerCase().trim()) || 1;
    const gap = Math.max(0, target.targetLevel - current);
    return {
      skill: target.skill,
      currentLevel: current,
      targetLevel: target.targetLevel,
      gap,
      priority: target.priority,
      reason: target.reason,
      suggestedAction: target.suggestedAction,
    };
  });
}

function synthesizePhases(career: string, totalWeeks: number, weeklyHours: number, skillGaps: SkillGap[]): Phase[] {
  const phase1Weeks = Math.max(2, Math.round(totalWeeks * 0.25));
  const phase2Weeks = Math.max(2, Math.round(totalWeeks * 0.35));
  const phase3Weeks = Math.max(2, Math.round(totalWeeks * 0.25));
  const phase4Weeks = Math.max(2, totalWeeks - (phase1Weeks + phase2Weeks + phase3Weeks));

  return [
    {
      id: 'phase-1',
      phaseNumber: 1,
      title: 'Phase 1: Foundations & Prerequisites',
      durationWeeks: phase1Weeks,
      description: `Establish bedrock computational skills, developmental tooling, and fundamental concepts required for ${career}.`,
      learningOutcomes: [
        'Master the fundamental developer environment, version control, and scripting paradigms.',
        'Understand the mathematical and conceptual architecture underpinning the domain.',
        'Build and commit regular code exercises with documented tests.',
      ],
      prerequisites: ['Basic computer literacy', 'Terminal & CLI fundamentals'],
      milestones: [
        {
          id: 'm1-1',
          title: 'Development Environment & Tooling Setup',
          description: 'Configure VS Code, Git version control, virtual environments, and key command line utilities.',
          estimatedHours: Math.round(weeklyHours * 1.5),
          learningOutcomes: ['Configured IDE with linting', 'Git branch workflow mastery', 'Reproducible environments'],
          prerequisites: ['Operating system basics'],
          suggestedResources: [
            { title: 'The Missing Semester of Your CS Education', type: 'course', url: 'https://missing.csail.mit.edu', isFree: true },
            { title: 'Pro Git Documentation', type: 'book', url: 'https://git-scm.com/book/en/v2', isFree: true },
          ],
        },
        {
          id: 'm1-2',
          title: 'Core Domain Syntax & Structural Principles',
          description: `Study and practice fundamental programming and architectural patterns central to ${career}.`,
          estimatedHours: Math.round(weeklyHours * 2.5),
          learningOutcomes: ['Data types, control structures, and memory models', 'Functional and object-oriented principles', 'Clean code practices'],
          prerequisites: ['m1-1'],
          suggestedResources: [
            { title: 'Official Language Documentation & Guides', type: 'documentation', isFree: true },
            { title: 'Interactive Problem Solving Track', type: 'practice', isFree: true },
          ],
        },
      ],
    },
    {
      id: 'phase-2',
      phaseNumber: 2,
      title: 'Phase 2: Core Domain Specialization & Toolchains',
      durationWeeks: phase2Weeks,
      description: `Focus directly on the primary industry libraries, operational frameworks, and data handling required for ${career}.`,
      learningOutcomes: [
        `Achieve intermediate proficiency in standard ${career} toolchains.`,
        'Design and implement functional modules solving domain problems.',
        'Integrate data pipelines, external APIs, and testing suites.',
      ],
      prerequisites: ['Phase 1 Foundations completion'],
      milestones: [
        {
          id: 'm2-1',
          title: 'Key Frameworks & Domain Architecture',
          description: `In-depth hands-on building using standard tools identified in your skill gap analysis.`,
          estimatedHours: Math.round(weeklyHours * 3),
          learningOutcomes: ['Framework lifecycle and abstractions', 'State management and data flow', 'Component/module modularity'],
          prerequisites: ['m1-2'],
          suggestedResources: [
            { title: 'Domain Best Practices & Architecture Patterns', type: 'documentation', isFree: true },
            { title: 'Comprehensive Practical Tutorial Series', type: 'course', isFree: true },
          ],
        },
        {
          id: 'm2-2',
          title: 'Integration, Validation & Error Handling',
          description: 'Implement rigorous data validation schemas, error recovery, and unit test coverage.',
          estimatedHours: Math.round(weeklyHours * 2.5),
          learningOutcomes: ['Defensive programming techniques', 'Automated unit and integration test creation', 'Structured logging'],
          prerequisites: ['m2-1'],
          suggestedResources: [
            { title: 'Testing Strategies & Test-Driven Development', type: 'interactive', isFree: true },
          ],
        },
      ],
    },
    {
      id: 'phase-3',
      phaseNumber: 3,
      title: 'Phase 3: Real-World Systems & Practical Projects',
      durationWeeks: phase3Weeks,
      description: `Build end-to-end, realistic applications that demonstrate applied ${career} capability to recruiters and engineering managers.`,
      learningOutcomes: [
        'Complete two substantial, deployable projects with public repositories.',
        'Optimize performance, security, and edge-case handling.',
        'Document technical decisions and architecture trade-offs.',
      ],
      prerequisites: ['Phase 2 Core Specialization completion'],
      milestones: [
        {
          id: 'm3-1',
          title: 'Intermediate Portfolio Project Implementation',
          description: 'Develop a fully featured solution addressing real industry workflows with persistent storage.',
          estimatedHours: Math.round(weeklyHours * 3.5),
          learningOutcomes: ['Full architecture implementation', 'Authentication, data flow, and error states', 'CI/CD pipeline configuration'],
          prerequisites: ['m2-2'],
          suggestedResources: [
            { title: 'System Design for Beginners', type: 'book', isFree: true },
            { title: 'Production Deployment Walkthrough', type: 'documentation', isFree: true },
          ],
        },
        {
          id: 'm3-2',
          title: 'Performance Benchmarking & Code Refactoring',
          description: 'Profile execution bottlenecks, optimize latency/queries, and clean up technical debt.',
          estimatedHours: Math.round(weeklyHours * 2),
          learningOutcomes: ['Profiling and memory inspection', 'Algorithmic optimization', 'Polished code documentation'],
          prerequisites: ['m3-1'],
          suggestedResources: [
            { title: 'Performance Profiling Guide', type: 'documentation', isFree: true },
          ],
        },
      ],
    },
    {
      id: 'phase-4',
      phaseNumber: 4,
      title: 'Phase 4: Career Readiness & Interview Mastery',
      durationWeeks: phase4Weeks,
      description: `Polish your portfolio, prepare for technical interview rounds, and execute your professional job search strategy.`,
      learningOutcomes: [
        'Complete targeted mock technical and behavioral interview preparation.',
        'Publish an industry-grade portfolio showcasing deployed applications.',
        'Target relevant open roles with a tailored resume highlighting project outcomes.',
      ],
      prerequisites: ['Phase 3 Projects completion'],
      milestones: [
        {
          id: 'm4-1',
          title: 'Portfolio & Public Artifacts Refinement',
          description: 'Audit GitHub repositories, write comprehensive READMEs, record demo videos, and polish online profile.',
          estimatedHours: Math.round(weeklyHours * 2),
          learningOutcomes: ['Executive summary READMEs', 'Live public URLs with zero broken links', 'Clear problem-to-solution storytelling'],
          prerequisites: ['m3-2'],
          suggestedResources: [
            { title: 'Developer Portfolio Best Practices', type: 'documentation', isFree: true },
          ],
        },
        {
          id: 'm4-2',
          title: 'Technical Interview Simulation & Practice',
          description: `Practice key algorithmic, system design, and role-specific technical questions for ${career}.`,
          estimatedHours: Math.round(weeklyHours * 2.5),
          learningOutcomes: ['Structured problem solving communication', 'Domain specific live-coding confidence', 'STAR method behavioral articulation'],
          prerequisites: ['m4-1'],
          suggestedResources: [
            { title: 'Curated Technical Interview Checklist', type: 'practice', isFree: true },
          ],
        },
      ],
    },
  ];
}

function synthesizeProjects(career: string): RecommendedProject[] {
  const careerLower = career.toLowerCase();

  if (careerLower.includes('ai') || careerLower.includes('machine learning')) {
    return [
      {
        id: 'proj-1',
        title: 'Local Document Q&A Agent with Hybrid Vector Search',
        problemStatement: 'Organizations need private, local document retrieval without leaking sensitive intellectual property to public model training sets.',
        description: 'Build an end-to-end RAG system using Python, LangChain, local vector store (Chroma/Qdrant), and Groq/Ollama LLM inference with source citations.',
        difficulty: 'Beginner',
        estimatedDurationWeeks: 2,
        requiredSkills: ['Python', 'Vector Embeddings', 'Prompt Design', 'FastAPI'],
        techStack: ['Python', 'Groq API', 'ChromaDB', 'FastAPI', 'Streamlit'],
        deliverables: ['Working API endpoint', 'Interactive UI demo', 'Chunking performance evaluation report'],
        portfolioValue: 'High',
      },
      {
        id: 'proj-2',
        title: 'Multimodal Semantic Search & Image Recommendation Engine',
        problemStatement: 'E-commerce catalogs lack natural language visual search where users describe complex styles or upload photo queries.',
        description: 'Implement a CLIP-based cross-modal embedding search engine allowing text-to-image and image-to-image nearest neighbor lookups in sub-50ms.',
        difficulty: 'Intermediate',
        estimatedDurationWeeks: 3,
        requiredSkills: ['PyTorch', 'CLIP Model', 'HNSW Vector Indexing', 'Docker'],
        techStack: ['PyTorch', 'Hugging Face', 'Qdrant', 'Docker', 'React'],
        deliverables: ['Pre-processed catalog dataset', 'Benchmarked search latency metrics', 'Containerized docker-compose setup'],
        portfolioValue: 'Very High',
      },
      {
        id: 'proj-3',
        title: 'Autonomous Multi-Agent Task Orchestrator with Evaluation Harness',
        problemStatement: 'Complex multi-step research tasks require coordinated sub-agents with planning, tool invocation, and automated hallucination verification.',
        description: 'Develop an agentic framework where a planner delegates research, code execution, and fact-checking subtasks, followed by an automated LLM-as-a-judge scoring benchmark.',
        difficulty: 'Advanced',
        estimatedDurationWeeks: 4,
        requiredSkills: ['Agent Workflows', 'Tool Calling', 'System Evaluation', 'Python Asyncio'],
        techStack: ['Python', 'LangGraph / LlamaIndex', 'Groq SDK', 'PostgreSQL', 'Next.js'],
        deliverables: ['Self-healing agent loop', 'Synthetic benchmark test suite', 'Live dashboard showing agent reasoning traces'],
        portfolioValue: 'Exceptional',
      },
    ];
  }

  if (careerLower.includes('data')) {
    return [
      {
        id: 'proj-1',
        title: 'Automated E-Commerce Sales Insights & KPI Pipeline',
        problemStatement: 'Business leadership receives delayed monthly reports instead of daily actionable revenue insights.',
        description: 'Clean raw transactional datasets, engineer temporal metrics, and build an automated report generator with automated anomaly detection.',
        difficulty: 'Beginner',
        estimatedDurationWeeks: 2,
        requiredSkills: ['Python', 'Pandas', 'SQL', 'Data Cleaning'],
        techStack: ['Python', 'Pandas', 'PostgreSQL', 'Matplotlib', 'Streamlit'],
        deliverables: ['Automated cleaning ETL script', 'Interactive metric dashboard', 'Executive summary memo'],
        portfolioValue: 'High',
      },
      {
        id: 'proj-2',
        title: 'Customer Churn Prediction with Explainable AI (SHAP)',
        problemStatement: 'Subscription services lose high-value customers without early warning or clear feature attribution.',
        description: 'Train and validate an XGBoost classification pipeline predicting churn probability, equipped with SHAP values explaining individual prediction factors.',
        difficulty: 'Intermediate',
        estimatedDurationWeeks: 3,
        requiredSkills: ['Scikit-Learn', 'Feature Engineering', 'XGBoost', 'Model Interpretability'],
        techStack: ['Python', 'Scikit-Learn', 'XGBoost', 'SHAP', 'FastAPI'],
        deliverables: ['Cross-validated model with ROC-AUC analysis', 'Feature importance visual report', 'Inference API returning risk probabilities and top factors'],
        portfolioValue: 'Very High',
      },
      {
        id: 'proj-3',
        title: 'Algorithmic Dynamic Pricing & Demand Forecasting Engine',
        problemStatement: 'Static pricing fails to maximize revenue during volatile demand cycles and regional seasonal shifts.',
        description: 'Implement a time-series forecasting model combining Prophet and LSTM models with dynamic price elasticity simulations.',
        difficulty: 'Advanced',
        estimatedDurationWeeks: 4,
        requiredSkills: ['Time-Series Analysis', 'Elasticity Modeling', 'A/B Testing Simulation'],
        techStack: ['Python', 'Prophet', 'PyTorch', 'Airflow', 'PostgreSQL'],
        deliverables: ['Automated retraining schedule', 'Simulated revenue impact backtest', 'Comprehensive technical case study'],
        portfolioValue: 'Exceptional',
      },
    ];
  }

  // Default: Full Stack Developer / Software Engineer
  return [
    {
      id: 'proj-1',
      title: 'Real-Time Kanban Task Management Platform',
      problemStatement: 'Distributed teams need intuitive drag-and-drop task workflows with persistent state and instant status sync.',
      description: 'Develop a responsive workspace featuring task boards, column customization, tag filtering, and optimistic UI updates.',
      difficulty: 'Beginner',
      estimatedDurationWeeks: 2,
      requiredSkills: ['TypeScript', 'React', 'Tailwind CSS', 'State Management'],
      techStack: ['TypeScript', 'React', 'Vite', 'Tailwind CSS', 'LocalStorage / IndexedDB'],
      deliverables: ['Fully responsive accessible web app', 'Keyboard accessible controls', 'Deployed live production demo'],
      portfolioValue: 'High',
    },
    {
      id: 'proj-2',
      title: 'Full-Stack E-Commerce API & Storefront with Webhooks',
      problemStatement: 'Merchants require robust order processing, inventory locking, secure checkout integration, and automated webhook handling.',
      description: 'Architect a complete full-stack platform with secure authentication, relational database schema, Stripe payment checkout, and transaction logs.',
      difficulty: 'Intermediate',
      estimatedDurationWeeks: 3,
      requiredSkills: ['Node.js', 'Express', 'PostgreSQL', 'JWT Authentication', 'Stripe API'],
      techStack: ['React', 'TypeScript', 'Node.js', 'Express', 'PostgreSQL', 'Prisma ORM'],
      deliverables: ['Normalized database schema with migrations', 'RESTful API with OpenAPI docs', 'Interactive storefront with cart and checkout'],
      portfolioValue: 'Very High',
    },
    {
      id: 'proj-3',
      title: 'Collaborative Multi-Tenant Document Editor with Role-Based Access',
      problemStatement: 'Enterprise teams require real-time collaborative document creation with granular role-based permissions and version history.',
      description: 'Build a production SaaS application featuring organization workspaces, invite links, rich-text editing, audit logs, and rate-limited API gateway.',
      difficulty: 'Advanced',
      estimatedDurationWeeks: 4,
      requiredSkills: ['Full-Stack Architecture', 'RBAC Security', 'Caching & Redis', 'Docker CI/CD'],
      techStack: ['Next.js / Vite', 'TypeScript', 'Node.js', 'PostgreSQL', 'Docker', 'GitHub Actions'],
      deliverables: ['Production deployment on Cloud', 'Unit & integration test suite (>80% coverage)', 'Architecture diagram and security audit'],
      portfolioValue: 'Exceptional',
    },
  ];
}

function synthesizeCertifications(career: string): CertificationRecommendation[] {
  const careerLower = career.toLowerCase();
  if (careerLower.includes('ai') || careerLower.includes('machine learning')) {
    return [
      { name: 'AWS Certified Machine Learning - Specialty', issuer: 'Amazon Web Services', estimatedCost: '$300', relevance: 'Validates production ML pipeline and cloud modeling knowledge.', recommendedPhase: 'Phase 3' },
      { name: 'DeepLearning.AI Machine Learning Specialization', issuer: 'Coursera / Andrew Ng', estimatedCost: '$49/mo (Financial aid available)', relevance: 'Premier industry curriculum for algorithmic intuition.', recommendedPhase: 'Phase 1' },
      { name: 'TensorFlow Developer Certificate / Hugging Face Certified', issuer: 'Google / Hugging Face', estimatedCost: '$100', relevance: 'Proves practical deep learning model implementation skill.', recommendedPhase: 'Phase 2' },
    ];
  }

  if (careerLower.includes('data')) {
    return [
      { name: 'Google Data Analytics Professional Certificate', issuer: 'Google', estimatedCost: '$49/mo', relevance: 'Strong structured foundation in SQL, spreadsheets, and R.', recommendedPhase: 'Phase 1' },
      { name: 'Microsoft Certified: Power BI Data Analyst Associate', issuer: 'Microsoft', estimatedCost: '$165', relevance: 'Demonstrates enterprise dashboarding and reporting competency.', recommendedPhase: 'Phase 2' },
      { name: 'IBM Data Science Professional Certificate', issuer: 'IBM', estimatedCost: '$49/mo', relevance: 'Comprehensive validation of Python data science and machine learning.', recommendedPhase: 'Phase 2' },
    ];
  }

  if (careerLower.includes('security')) {
    return [
      { name: 'CompTIA Security+ (SY0-701)', issuer: 'CompTIA', estimatedCost: '$392', relevance: 'Industry gold standard for entry-level cybersecurity roles.', recommendedPhase: 'Phase 2' },
      { name: 'Certified in Cybersecurity (CC)', issuer: 'ISC2', estimatedCost: 'Free / $50', relevance: 'Entry credential recognized by major defense contractors and enterprise firms.', recommendedPhase: 'Phase 1' },
      { name: 'eLearnSecurity Junior Penetration Tester (eJPT)', issuer: 'INE Security', estimatedCost: '$249', relevance: 'Practical hands-on penetration testing exam with real lab exercises.', recommendedPhase: 'Phase 3' },
    ];
  }

  return [
    { name: 'Meta Front-End Developer Professional Certificate', issuer: 'Meta', estimatedCost: '$49/mo', relevance: 'Rigorous industry curriculum covering modern React and UI engineering.', recommendedPhase: 'Phase 1' },
    { name: 'AWS Certified Cloud Practitioner or Developer Associate', issuer: 'Amazon Web Services', estimatedCost: '$100 - $150', relevance: 'Demonstrates practical cloud deployment and service integration capability.', recommendedPhase: 'Phase 3' },
    { name: 'GitHub Actions and Foundations Certification', issuer: 'GitHub', estimatedCost: '$99', relevance: 'Validates modern CI/CD automation workflows and repository management.', recommendedPhase: 'Phase 2' },
  ];
}

function synthesizeInterviewPrep(career: string): InterviewPreparationTopic[] {
  return [
    {
      category: 'Fundamentals',
      topics: ['Time and space complexity (Big-O)', 'Core language memory model & closures/pointers', 'Data structures: Hash maps, trees, and queues'],
      recommendedPractice: 'Complete 30 foundational practice questions focusing on clean explanations over speed.',
      sampleQuestions: [
        'How does memory allocation work in your primary language?',
        'Explain the trade-offs between array lookups and hash map lookups under heavy concurrency.',
        'What are the core principles of defensive coding and error propagation?',
      ],
    },
    {
      category: 'Practical Coding',
      topics: ['Live problem solving without IDE autocompletion', 'Writing deterministic unit tests', 'Refactoring naive brute-force solutions'],
      recommendedPractice: 'Simulate 45-minute timed coding sessions with an interviewer speaking your thoughts out loud.',
      sampleQuestions: [
        'Implement an LRU cache with O(1) get and put operations.',
        'Write a utility function to flatten and sanitize deeply nested JSON schemas.',
        'Debug a failing asynchronous pipeline with race conditions.',
      ],
    },
    {
      category: 'System Architecture',
      topics: ['Client-server separation & API contracts', 'Database indexing, transactions, and normalization', 'Caching layers and failure recovery'],
      recommendedPractice: 'Diagram system architectures on a blank whiteboard, defending each chosen technology.',
      sampleQuestions: [
        `How would you design the backend and data architecture for a ${career} application?`,
        'Where would you introduce caching, and how would you invalidate stale records?',
        'How do you handle graceful degradation when an upstream third-party API fails?',
      ],
    },
    {
      category: 'Behavioral',
      topics: ['Conflict resolution in engineering teams', 'Overcoming ambiguous requirements', 'Explaining complex technical concepts to non-engineers'],
      recommendedPractice: 'Prepare 5 STAR stories (Situation, Task, Action, Result) from your academic or project experiences.',
      sampleQuestions: [
        'Tell me about a time you encountered a critical bug right before a project deadline.',
        'Describe an architectural decision you made that you later had to revise.',
        'How do you prioritize competing feature requests when time is constrained?',
      ],
    },
  ];
}
