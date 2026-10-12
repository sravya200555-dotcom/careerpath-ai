/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { z } from 'zod';

export const ResourceLinkSchema = z.object({
  title: z.string(),
  type: z.enum(['documentation', 'course', 'book', 'interactive', 'practice']).default('documentation'),
  url: z.string().optional(),
  isFree: z.boolean().optional().default(true),
});

export const MilestoneSchema = z.object({
  id: z.string(),
  title: z.string().min(2),
  description: z.string(),
  estimatedHours: z.number().nonnegative().default(10),
  learningOutcomes: z.array(z.string()).default([]),
  prerequisites: z.array(z.string()).default([]),
  suggestedResources: z.array(ResourceLinkSchema).default([]),
});

export const PhaseSchema = z.object({
  id: z.string(),
  phaseNumber: z.number().int().default(1),
  title: z.string().min(2),
  durationWeeks: z.number().positive().default(4),
  description: z.string(),
  learningOutcomes: z.array(z.string()).default([]),
  prerequisites: z.array(z.string()).default([]),
  milestones: z.array(MilestoneSchema).min(1),
});

export const SkillGapSchema = z.object({
  skill: z.string(),
  currentLevel: z.number().min(1).max(5),
  targetLevel: z.number().min(1).max(5),
  gap: z.number(),
  priority: z.enum(['High', 'Medium', 'Foundational']),
  reason: z.string(),
  suggestedAction: z.string(),
});

export const RecommendedProjectSchema = z.object({
  id: z.string(),
  title: z.string(),
  problemStatement: z.string(),
  description: z.string(),
  difficulty: z.enum(['Beginner', 'Intermediate', 'Advanced']),
  estimatedDurationWeeks: z.number().positive().default(2),
  requiredSkills: z.array(z.string()).default([]),
  techStack: z.array(z.string()).default([]),
  deliverables: z.array(z.string()).default([]),
  portfolioValue: z.enum(['High', 'Very High', 'Exceptional']).default('High'),
});

export const CertificationSchema = z.object({
  name: z.string(),
  issuer: z.string(),
  estimatedCost: z.string(),
  relevance: z.string(),
  recommendedPhase: z.string(),
});

export const InterviewTopicSchema = z.object({
  category: z.enum(['Fundamentals', 'System Architecture', 'Practical Coding', 'Behavioral']),
  topics: z.array(z.string()),
  recommendedPractice: z.string(),
  sampleQuestions: z.array(z.string()),
});

export const CareerReadinessSchema = z.object({
  score: z.number().min(0).max(100),
  explanation: z.string(),
  methodology: z.object({
    baselineFoundation: z.number(),
    skillsCoverage: z.number(),
    timeCommitmentFactor: z.number(),
    formulaNotes: z.string(),
  }),
});

export const RoadmapOutputSchema = z.object({
  id: z.string().default(() => `rm_${Date.now()}`),
  createdAt: z.string().default(() => new Date().toISOString()),
  careerGoal: z.string(),
  estimatedWeeks: z.number().positive(),
  weeklyHours: z.number().positive(),
  readiness: CareerReadinessSchema,
  strengths: z.array(z.string()).default([]),
  skillGaps: z.array(SkillGapSchema).default([]),
  phases: z.array(PhaseSchema).min(1),
  projects: z.array(RecommendedProjectSchema).default([]),
  certifications: z.array(CertificationSchema).default([]),
  interviewPreparation: z.array(InterviewTopicSchema).default([]),
  portfolioRecommendations: z.array(z.string()).default([]),
  assumptions: z.array(z.string()).default([]),
  generatedWith: z.object({
    source: z.enum(['groq', 'fallback-ai']),
    model: z.string(),
    timestamp: z.string(),
  }),
});

export type ValidatedRoadmapOutput = z.infer<typeof RoadmapOutputSchema>;
