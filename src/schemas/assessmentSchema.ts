/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { z } from 'zod';

export const SkillRatingSchema = z.object({
  skill: z.string().min(1, 'Skill name is required').max(50),
  level: z.number().int().min(1, 'Level must be at least 1').max(5, 'Level must be at most 5'),
});

export const AssessmentInputSchema = z.object({
  desiredCareer: z.string().min(2, 'Career goal must be at least 2 characters').max(80),
  isCustomCareer: z.boolean().optional().default(false),
  educationLevel: z.enum([
    'High School',
    'Associate Degree',
    'Bachelor Degree',
    'Master / PhD',
    'Self-Taught / Bootcamp',
  ]),
  fieldOfStudy: z.string().min(1, 'Field of study is required').max(80),
  currentSkills: z.array(SkillRatingSchema).min(1, 'At least 1 skill must be provided'),
  experienceLevel: z.enum([
    'Complete Beginner',
    'Some Basics / Hobbyist',
    'Intermediate Student',
    'Junior Developer / Career Switcher',
  ]),
  weeklyHours: z
    .number()
    .min(3, 'Weekly study time must be at least 3 hours')
    .max(60, 'Weekly study time cannot exceed 60 hours'),
  targetMonths: z
    .number()
    .min(1, 'Target timeline must be at least 1 month')
    .max(36, 'Target timeline cannot exceed 36 months'),
  preferredTechnologies: z.array(z.string()).optional().default([]),
  learningStyle: z.enum([
    'Project-First',
    'Structured Theory & Exercises',
    'Video & Interactive',
    'Fast-Paced Bootcamp',
  ]),
  careerNotes: z.string().max(500).optional().default(''),
});

export type ValidatedAssessmentInput = z.infer<typeof AssessmentInputSchema>;
