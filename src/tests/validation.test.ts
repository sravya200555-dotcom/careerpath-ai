/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { AssessmentInputSchema } from '../schemas/assessmentSchema';
import { RoadmapOutputSchema } from '../schemas/roadmapSchema';
import { calculateRoadmapProgress } from '../utils/progressCalculator';
import { generateCurriculumRoadmap } from '../server/fallbackGenerator';
import { AssessmentInput } from '../types/career';

let passed = 0;
let failed = 0;

function assert(condition: boolean, testName: string) {
  if (condition) {
    console.log(`  ✓ ${testName}`);
    passed++;
  } else {
    console.error(`  ✗ FAIL: ${testName}`);
    failed++;
  }
}

console.log('\n--- Running CareerPath AI Validation & Logic Tests ---');

// Test 1: Assessment Form Validation (Valid input)
const validAssessment: AssessmentInput = {
  desiredCareer: 'AI Engineer',
  educationLevel: 'Bachelor Degree',
  fieldOfStudy: 'Computer Science',
  currentSkills: [
    { skill: 'Python', level: 3 },
    { skill: 'Math', level: 3 },
  ],
  experienceLevel: 'Intermediate Student',
  weeklyHours: 15,
  targetMonths: 6,
  learningStyle: 'Project-First',
};

const validResult = AssessmentInputSchema.safeParse(validAssessment);
assert(validResult.success === true, 'AssessmentInputSchema accepts valid input');

// Test 2: Assessment Form Validation (Invalid weekly hours < 3)
const invalidHours = { ...validAssessment, weeklyHours: 1 };
const invalidHoursResult = AssessmentInputSchema.safeParse(invalidHours);
assert(invalidHoursResult.success === false, 'AssessmentInputSchema rejects weeklyHours < 3');

// Test 3: Assessment Form Validation (Empty skills array)
const emptySkills = { ...validAssessment, currentSkills: [] };
const emptySkillsResult = AssessmentInputSchema.safeParse(emptySkills);
assert(emptySkillsResult.success === false, 'AssessmentInputSchema rejects empty skills list');

// Test 4: Assessment Form Validation (Skill level out of bounds > 5)
const invalidSkillLevel = {
  ...validAssessment,
  currentSkills: [{ skill: 'Python', level: 6 }],
};
const invalidSkillResult = AssessmentInputSchema.safeParse(invalidSkillLevel);
assert(invalidSkillResult.success === false, 'AssessmentInputSchema rejects skill level > 5');

// Test 5: Roadmap Generator & Schema Validation
const generatedRoadmap = generateCurriculumRoadmap(validAssessment);
const roadmapSchemaResult = RoadmapOutputSchema.safeParse(generatedRoadmap);
assert(roadmapSchemaResult.success === true, 'RoadmapOutputSchema validates generated roadmap structure');
assert(generatedRoadmap.phases.length >= 3, 'Roadmap contains at least 3 distinct learning phases');
assert(generatedRoadmap.projects.length >= 3, 'Roadmap contains recommended progression projects');
assert(generatedRoadmap.readiness.score >= 0 && generatedRoadmap.readiness.score <= 100, 'Career readiness score is bounded between 0 and 100');

// Test 6: Progress Calculation Logic
const progressInitial = calculateRoadmapProgress(generatedRoadmap, {});
assert(progressInitial.totalMilestones > 0, 'Progress calculator detects total milestones');
assert(progressInitial.completedMilestones === 0, 'Initial completed milestones count is 0');
assert(progressInitial.completionPercentage === 0, 'Initial completion percentage is 0%');

// Test 7: Progress Calculation with marked milestones
const firstMilestoneId = generatedRoadmap.phases[0].milestones[0].id;
const secondMilestoneId = generatedRoadmap.phases[0].milestones[1]?.id || 'm-none';

const progressWithComplete = calculateRoadmapProgress(generatedRoadmap, {
  [firstMilestoneId]: 'completed',
  [secondMilestoneId]: 'in-progress',
});
assert(progressWithComplete.completedMilestones === 1, 'Correctly registers 1 completed milestone');
assert(progressWithComplete.inProgressMilestones === 1, 'Correctly registers 1 in-progress milestone');
assert(progressWithComplete.completionPercentage > 0, 'Completion percentage increases above 0%');

console.log(`\nTest Summary: ${passed} passed, ${failed} failed.\n`);

if (failed > 0) {
  process.exit(1);
} else {
  console.log('All validation and calculation tests PASSED successfully!\n');
}
