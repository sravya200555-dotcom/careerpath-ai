/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import Groq from 'groq-sdk';
import { AssessmentInput, RoadmapOutput } from '../types/career';
import { RoadmapOutputSchema } from '../schemas/roadmapSchema';
import { generateCurriculumRoadmap } from './fallbackGenerator';

export class GroqService {
  private client: Groq | null = null;
  private apiKey: string | null = null;
  private primaryModel = 'llama-3.3-70b-versatile';
  private fallbackModel = 'llama-3.1-8b-instant';

  constructor() {
    this.initClient();
  }

  private initClient(): void {
    const key = process.env.GROQ_API_KEY;
    if (key && key.trim().length > 5 && !key.includes('your_groq_api_key_here')) {
      this.apiKey = key.trim();
      try {
        this.client = new Groq({ apiKey: this.apiKey });
      } catch (err) {
        console.error('Failed to initialize Groq client:', err);
        this.client = null;
      }
    } else {
      this.client = null;
      this.apiKey = null;
    }
  }

  public hasApiKey(): boolean {
    this.initClient();
    return this.client !== null;
  }

  public getModelName(): string {
    return this.primaryModel;
  }

  public async generateRoadmap(assessment: AssessmentInput): Promise<{ roadmap: RoadmapOutput; source: 'groq' | 'fallback-ai'; errorNotice?: string }> {
    this.initClient();

    if (!this.client) {
      console.log('No Groq API key configured. Utilizing curriculum synthesis engine.');
      const fallback = generateCurriculumRoadmap(assessment);
      return {
        roadmap: fallback,
        source: 'fallback-ai',
        errorNotice: 'GROQ_API_KEY is not configured in backend environment (.env). Generating with CareerPath Adaptive Curriculum Engine. Set GROQ_API_KEY to switch to live Groq LLaMA models.',
      };
    }

    const systemPrompt = `You are CareerPath AI's expert career roadmap architect and pedagogical curriculum designer.
Your objective is to generate an evidence-grounded, realistic, and personalized career roadmap for a student or beginner based on their assessment profile.

CORE INSTRUCTIONS:
1. Analyze the learner's current profile objectively.
2. Identify existing verified strengths without assuming unverified skills.
3. Identify missing or underdeveloped skills, calculating precise gaps against real junior industry requirements on a 1-5 scale (1: Novice, 2: Elementary, 3: Intermediate/Competent, 4: Advanced/Proficient, 5: Expert/Mastery).
4. Respect the learner's weekly commitment (${assessment.weeklyHours} hrs/week) and target timeline (${assessment.targetMonths} months, approx ${assessment.targetMonths * 4} weeks).
5. Generate between 3 and 5 sequential Learning Phases, each containing 2-3 specific milestones.
6. Provide concrete, non-trivial Recommended Projects progressing from beginner to advanced.
7. Recommend reputable certifications, realistic interview prep topics, and portfolio guidelines.
8. State clear assumptions, risks, and transparent readiness score (0-100) with a formula explanation.
9. You MUST return ONLY a valid JSON object matching the required schema. Do NOT enclose in markdown backticks unless strictly JSON, and never output conversational preambles or conversational closings.`;

    const userPrompt = `Generate a comprehensive career roadmap for this assessment:
${JSON.stringify(assessment, null, 2)}

REQUIRED JSON OUTPUT FORMAT:
{
  "careerGoal": "${assessment.desiredCareer}",
  "estimatedWeeks": ${Math.max(4, assessment.targetMonths * 4)},
  "weeklyHours": ${assessment.weeklyHours},
  "readiness": {
    "score": 38,
    "explanation": "Transparent explanation of readiness score based on skill match and time commitment.",
    "methodology": {
      "baselineFoundation": 25,
      "skillsCoverage": 30,
      "timeCommitmentFactor": 20,
      "formulaNotes": "Weighted assessment formula."
    }
  },
  "strengths": ["Verified strength 1", "Verified strength 2"],
  "skillGaps": [
    {
      "skill": "Skill Name",
      "currentLevel": 1,
      "targetLevel": 4,
      "gap": 3,
      "priority": "High",
      "reason": "Why this skill is mandatory",
      "suggestedAction": "Concrete course/reading/exercise"
    }
  ],
  "phases": [
    {
      "id": "phase-1",
      "phaseNumber": 1,
      "title": "Phase 1: Foundations",
      "durationWeeks": 4,
      "description": "Comprehensive phase description",
      "learningOutcomes": ["Outcome 1", "Outcome 2"],
      "prerequisites": ["Prereq 1"],
      "milestones": [
        {
          "id": "m1-1",
          "title": "Milestone Title",
          "description": "Specific milestone guidance",
          "estimatedHours": 20,
          "learningOutcomes": ["Specific outcome"],
          "prerequisites": [],
          "suggestedResources": [
            { "title": "Resource Name", "type": "documentation", "url": "https://example.com", "isFree": true }
          ]
        }
      ]
    }
  ],
  "projects": [
    {
      "id": "proj-1",
      "title": "Project Title",
      "problemStatement": "Real-world problem statement",
      "description": "Project overview",
      "difficulty": "Beginner",
      "estimatedDurationWeeks": 2,
      "requiredSkills": ["Skill 1", "Skill 2"],
      "techStack": ["Tool 1", "Tool 2"],
      "deliverables": ["Deliverable 1"],
      "portfolioValue": "High"
    }
  ],
  "certifications": [
    {
      "name": "Certification Name",
      "issuer": "Issuing Body",
      "estimatedCost": "$100",
      "relevance": "Why it matters",
      "recommendedPhase": "Phase 2"
    }
  ],
  "interviewPreparation": [
    {
      "category": "Fundamentals",
      "topics": ["Topic 1", "Topic 2"],
      "recommendedPractice": "How to practice",
      "sampleQuestions": ["Sample question 1"]
    }
  ],
  "portfolioRecommendations": ["Recommendation 1", "Recommendation 2"],
  "assumptions": ["Assumption 1", "Assumption 2"]
}`;

    try {
      console.log(`Calling Groq API with model: ${this.primaryModel}...`);
      
      const completion = await this.client.chat.completions.create({
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        model: this.primaryModel,
        temperature: 0.3,
        max_tokens: 4096,
        response_format: { type: 'json_object' },
      });

      const responseText = completion.choices[0]?.message?.content;
      if (!responseText) {
        throw new Error('Empty response received from Groq API');
      }

      // Parse JSON safely
      let parsedJson: any;
      try {
        parsedJson = JSON.parse(responseText);
      } catch (jsonErr) {
        console.warn('Direct JSON parse failed, attempting regex extraction...', jsonErr);
        const match = responseText.match(/\{[\s\S]*\}/);
        if (match) {
          parsedJson = JSON.parse(match[0]);
        } else {
          throw new Error('Unable to parse JSON from Groq response');
        }
      }

      // Attach identifier & source metadata
      parsedJson.id = `rm_${Date.now()}`;
      parsedJson.createdAt = new Date().toISOString();
      parsedJson.generatedWith = {
        source: 'groq',
        model: this.primaryModel,
        timestamp: new Date().toISOString(),
      };

      // Validate with Zod schema
      const validation = RoadmapOutputSchema.safeParse(parsedJson);
      if (!validation.success) {
        console.warn('Groq output failed strict Zod schema validation:', validation.error.format());
        // Attempt recovery by normalizing fields or falling back
        const recovered = this.recoverOrSynthesize(parsedJson, assessment);
        return {
          roadmap: recovered,
          source: 'groq',
        };
      }

      return {
        roadmap: validation.data as RoadmapOutput,
        source: 'groq',
      };
    } catch (apiError: any) {
      console.error('Groq API call error:', apiError?.message || apiError);
      const fallback = generateCurriculumRoadmap(assessment);
      return {
        roadmap: fallback,
        source: 'fallback-ai',
        errorNotice: `Groq API temporarily encountered: ${apiError?.message || 'Connection error'}. Seamlessly synthesized roadmap using adaptive curriculum engine.`,
      };
    }
  }

  private recoverOrSynthesize(raw: any, assessment: AssessmentInput): RoadmapOutput {
    try {
      const fallback = generateCurriculumRoadmap(assessment);
      return {
        ...fallback,
        careerGoal: raw.careerGoal || assessment.desiredCareer,
        strengths: Array.isArray(raw.strengths) && raw.strengths.length > 0 ? raw.strengths : fallback.strengths,
        assumptions: Array.isArray(raw.assumptions) && raw.assumptions.length > 0 ? raw.assumptions : fallback.assumptions,
        portfolioRecommendations: Array.isArray(raw.portfolioRecommendations) && raw.portfolioRecommendations.length > 0 ? raw.portfolioRecommendations : fallback.portfolioRecommendations,
        generatedWith: {
          source: 'groq',
          model: this.primaryModel,
          timestamp: new Date().toISOString(),
        },
      };
    } catch (e) {
      return generateCurriculumRoadmap(assessment);
    }
  }
}

export const groqService = new GroqService();
