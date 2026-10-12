# CareerPath AI — LLM-Powered Career Roadmap Generator

CareerPath AI is a production-grade, structured career roadmap platform for students and career switchers. Powered by Groq API large language models (`llama-3.3-70b-versatile` / `llama-3.1-8b-instant`), it turns career aspirations into concrete, week-by-week learning curricula, skill gap analyses, recommended portfolio projects, and milestone progress tracking.

> **Architecture Note**: This is an assessment-driven, structured reporting platform — **not a chatbot**. All interactions happen via multi-step forms, diagnostic charts, timelines, and progress bars.

---

## Key Features

1. **Multi-Step Career Assessment**
   - Collects desired career goal (popular presets or custom title).
   - Records education level, field of study, and experience baseline.
   - Interactive declared skills inventory with a documented **1–5 proficiency scale**.
   - Available study hours per week and target preparation horizon in months.
   - Learning styles (Project-First, Structured Theory, Interactive, Fast-Paced Bootcamp).
   - Fast-track 1-click preset student profiles for rapid evaluation.

2. **AI Roadmap Synthesis Engine**
   - High-speed Groq API integration via official `groq-sdk` using JSON Mode.
   - Validated against strict Zod runtime schemas on the server.
   - Multi-stage loading animation with real-time phase updates.
   - Resilient Adaptive Curriculum engine fallback when `GROQ_API_KEY` is not yet configured, ensuring zero broken states out of the box.

3. **Visual Roadmap Timeline**
   - Phased milestones ordered logically by dependencies and prerequisites.
   - Milestone status toggles: **Not Started**, **In Progress**, and **Completed**.
   - Expandable milestone cards with learning outcomes and curated free study links.
   - Dynamic phase and status filtering.

4. **Skill Gap Analysis**
   - Interactive **Recharts** Bar Comparison and Radar Map.
   - Compares self-declared baseline against junior market expectations on a 1–5 scale.
   - Explicitly documented proficiency levels (Novice to Mastery) with priority badges (High, Medium, Foundational).
   - Actionable learning recommendations for each gap.

5. **Recommended Portfolio Projects**
   - Concrete project blueprints progressing from Beginner to Advanced.
   - Real problem statements, tech stack requirements, and expected deliverables.
   - Recruiter portfolio value ratings (High, Very High, Exceptional).

6. **Certifications, Interview Prep & Portfolio Checklist**
   - High-impact industry certifications with estimated cost, issuer, and recommended phase.
   - Interview prep matrix covering Fundamentals, Practical Coding, System Architecture, and Behavioral rounds.
   - Verified portfolio readiness checklist.

7. **Multi-Career Trajectory Comparison**
   - Side-by-side comparative matrix for **AI Engineer**, **Data Scientist**, **Full Stack Developer**, **Cybersecurity Engineer**, and **DevOps / Cloud Engineer**.
   - Compares difficulty curves, entry compensation benchmarks, and typical responsibilities.

8. **Persistence & Safety**
   - LocalStorage persistence for generated roadmaps and completed milestone statuses.
   - Confirmation warnings before regenerating or overwriting an existing roadmap.
   - Never exposes API keys in frontend client code.

---

## Tech Stack

- **Frontend**: React 19, TypeScript, Vite, Tailwind CSS v4, Lucide React, Motion
- **Visualizations**: Recharts (BarChart, RadarChart)
- **Validation**: Zod (Form input schemas and LLM output sanitization)
- **Backend**: Node.js, Express, Vite middleware integration, rate limiter
- **AI Inference**: Groq SDK (`groq-sdk`), LLaMA 3.3 70B & LLaMA 3.1 8B

---

## Getting Started

### 1. Prerequisites
- Node.js (v18+)
- npm

### 2. Environment Setup
Copy the example environment file:
```bash
cp .env.example .env
```

### 3. Configuring your Groq API Key
1. Sign up for a free Groq account at [https://console.groq.com/keys](https://console.groq.com/keys).
2. Generate an API Key (starts with `gsk_...`).
3. Add it to your `.env` file:
```env
GROQ_API_KEY="gsk_your_groq_api_key_here"
PORT="3000"
```
*(If `GROQ_API_KEY` is omitted, the app smoothly runs using the built-in Adaptive Curriculum Synthesis Engine.)*

### 4. Running the Application
Start the full-stack server (runs Express with Vite dev middleware on port 3000):
```bash
npm run dev
```
Open `http://localhost:3000` in your browser.

### 5. Running Validation & Progress Tests
Execute the automated test suite:
```bash
npm run test
```

### 6. Building for Production
```bash
npm run build
npm run start
```

---

## Example Assessment Data for Testing

You can paste or select any of these profiles via the **"Fast Track Demo"** cards on the landing page:

```json
{
  "desiredCareer": "AI Engineer",
  "educationLevel": "Bachelor Degree",
  "fieldOfStudy": "Computer Science",
  "currentSkills": [
    { "skill": "Python", "level": 3 },
    { "skill": "Data Structures & Algorithms", "level": 2 },
    { "skill": "Linear Algebra & Calculus", "level": 3 },
    { "skill": "Git & Command Line", "level": 2 }
  ],
  "experienceLevel": "Intermediate Student",
  "weeklyHours": 12,
  "targetMonths": 6,
  "preferredTechnologies": ["PyTorch", "Hugging Face", "FastAPI", "LangChain"],
  "learningStyle": "Project-First",
  "careerNotes": "Interested in RAG systems, vector embeddings, and deploying open-weights models."
}
```

---

## API Endpoints

- `GET /api/health` — Checks server status and Groq API key configuration.
- `GET /api/careers/compare` — Retrieves multi-career comparison data.
- `POST /api/roadmap/generate` — Validates assessment input, calls Groq API (or adaptive engine fallback), sanitizes output with Zod, and returns complete roadmap.

---

## License
Apache-2.0
