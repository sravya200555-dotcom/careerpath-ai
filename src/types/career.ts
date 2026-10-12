/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type MilestoneStatus = 'not-started' | 'in-progress' | 'completed';

export interface SkillRating {
  skill: string;
  level: number; // 1 to 5 scale
}

export interface AssessmentInput {
  desiredCareer: string;
  isCustomCareer?: boolean;
  educationLevel: 'High School' | 'Associate Degree' | 'Bachelor Degree' | 'Master / PhD' | 'Self-Taught / Bootcamp';
  fieldOfStudy: string;
  currentSkills: SkillRating[];
  experienceLevel: 'Complete Beginner' | 'Some Basics / Hobbyist' | 'Intermediate Student' | 'Junior Developer / Career Switcher';
  weeklyHours: number; // e.g. 5 to 40
  targetMonths: number; // e.g. 3 to 24 months
  preferredTechnologies?: string[];
  learningStyle: 'Project-First' | 'Structured Theory & Exercises' | 'Video & Interactive' | 'Fast-Paced Bootcamp';
  careerNotes?: string;
}

export interface ResourceLink {
  title: string;
  type: 'documentation' | 'course' | 'book' | 'interactive' | 'practice';
  url?: string;
  isFree?: boolean;
}

export interface Milestone {
  id: string;
  title: string;
  description: string;
  estimatedHours: number;
  learningOutcomes: string[];
  prerequisites: string[];
  suggestedResources: ResourceLink[];
}

export interface Phase {
  id: string;
  phaseNumber: number;
  title: string;
  durationWeeks: number;
  description: string;
  learningOutcomes: string[];
  prerequisites: string[];
  milestones: Milestone[];
}

export interface SkillGap {
  skill: string;
  currentLevel: number; // 1 to 5
  targetLevel: number; // 1 to 5
  gap: number;
  priority: 'High' | 'Medium' | 'Foundational';
  reason: string;
  suggestedAction: string;
}

export interface RecommendedProject {
  id: string;
  title: string;
  problemStatement: string;
  description: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  estimatedDurationWeeks: number;
  requiredSkills: string[];
  techStack: string[];
  deliverables: string[];
  portfolioValue: 'High' | 'Very High' | 'Exceptional';
}

export interface CertificationRecommendation {
  name: string;
  issuer: string;
  estimatedCost: string;
  relevance: string;
  recommendedPhase: string;
}

export interface InterviewPreparationTopic {
  category: 'Fundamentals' | 'System Architecture' | 'Practical Coding' | 'Behavioral';
  topics: string[];
  recommendedPractice: string;
  sampleQuestions: string[];
}

export interface CareerReadiness {
  score: number; // 0 to 100
  explanation: string;
  methodology: {
    baselineFoundation: number;
    skillsCoverage: number;
    timeCommitmentFactor: number;
    formulaNotes: string;
  };
}

export interface RoadmapOutput {
  id: string;
  createdAt: string;
  careerGoal: string;
  estimatedWeeks: number;
  weeklyHours: number;
  readiness: CareerReadiness;
  strengths: string[];
  skillGaps: SkillGap[];
  phases: Phase[];
  projects: RecommendedProject[];
  certifications: CertificationRecommendation[];
  interviewPreparation: InterviewPreparationTopic[];
  portfolioRecommendations: string[];
  assumptions: string[];
  generatedWith: {
    source: 'groq' | 'fallback-ai';
    model: string;
    timestamp: string;
  };
}

export interface MilestoneProgressMap {
  [milestoneId: string]: MilestoneStatus;
}

export interface CareerComparison {
  id: string;
  title: string;
  category: string;
  description: string;
  coreSkills: string[];
  technologies: string[];
  learningDifficulty: 'Moderate' | 'Challenging' | 'Steep';
  estimatedMonthsToJunior: string;
  typicalResponsibilities: string[];
  keyDeliverables: string[];
  averageEntrySalary: string;
}
