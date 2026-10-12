/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { AssessmentInput } from '../types/career';

export interface SampleProfile {
  id: string;
  label: string;
  summary: string;
  data: AssessmentInput;
}

export const SAMPLE_PROFILES: SampleProfile[] = [
  {
    id: 'ai-student',
    label: 'CS Student → AI Engineer',
    summary: 'Sophomore CS student with basic Python & Calculus wanting to build production LLM systems.',
    data: {
      desiredCareer: 'AI Engineer',
      isCustomCareer: false,
      educationLevel: 'Bachelor Degree',
      fieldOfStudy: 'Computer Science',
      currentSkills: [
        { skill: 'Python', level: 3 },
        { skill: 'Data Structures & Algorithms', level: 2 },
        { skill: 'Linear Algebra & Calculus', level: 3 },
        { skill: 'Git & Command Line', level: 2 },
      ],
      experienceLevel: 'Intermediate Student',
      weeklyHours: 12,
      targetMonths: 6,
      preferredTechnologies: ['PyTorch', 'Hugging Face', 'FastAPI', 'LangChain'],
      learningStyle: 'Project-First',
      careerNotes: 'Interested in RAG systems, vector embeddings, and deploying open-weights models.',
    },
  },
  {
    id: 'self-taught-web',
    label: 'Beginner → Full Stack Developer',
    summary: 'Self-taught learner with foundational HTML/CSS seeking structured path to junior dev role.',
    data: {
      desiredCareer: 'Full Stack Developer',
      isCustomCareer: false,
      educationLevel: 'Self-Taught / Bootcamp',
      fieldOfStudy: 'Business Administration (Switching careers)',
      currentSkills: [
        { skill: 'HTML & CSS', level: 2 },
        { skill: 'Basic JavaScript', level: 2 },
        { skill: 'Problem Solving', level: 3 },
      ],
      experienceLevel: 'Some Basics / Hobbyist',
      weeklyHours: 15,
      targetMonths: 6,
      preferredTechnologies: ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'Tailwind CSS'],
      learningStyle: 'Structured Theory & Exercises',
      careerNotes: 'Wants to build a portfolio of full-stack web applications with authentication and database storage.',
    },
  },
  {
    id: 'data-analyst-switch',
    label: 'Math Grad → Data Scientist',
    summary: 'Math graduate with strong statistics and Excel looking to master ML & Python pipelines.',
    data: {
      desiredCareer: 'Data Scientist',
      isCustomCareer: false,
      educationLevel: 'Bachelor Degree',
      fieldOfStudy: 'Applied Mathematics',
      currentSkills: [
        { skill: 'Applied Statistics & Probability', level: 4 },
        { skill: 'Excel & Data Manipulation', level: 4 },
        { skill: 'Basic Python & Pandas', level: 2 },
        { skill: 'SQL Basics', level: 2 },
      ],
      experienceLevel: 'Some Basics / Hobbyist',
      weeklyHours: 10,
      targetMonths: 8,
      preferredTechnologies: ['Python', 'Pandas', 'Scikit-Learn', 'PostgreSQL', 'Tableau'],
      learningStyle: 'Project-First',
      careerNotes: 'Focus on business analytics, statistical predictive modeling, and feature engineering.',
    },
  },
  {
    id: 'it-support-security',
    label: 'IT Specialist → Cybersecurity Engineer',
    summary: 'IT helpdesk professional with networking basics aiming for SOC analyst or security engineering.',
    data: {
      desiredCareer: 'Cybersecurity Engineer',
      isCustomCareer: false,
      educationLevel: 'Associate Degree',
      fieldOfStudy: 'Information Technology',
      currentSkills: [
        { skill: 'TCP/IP & Networking Basics', level: 3 },
        { skill: 'Windows & Linux Admin', level: 3 },
        { skill: 'Hardware & Troubleshooting', level: 4 },
        { skill: 'Bash Scripting', level: 1 },
      ],
      experienceLevel: 'Junior Developer / Career Switcher',
      weeklyHours: 14,
      targetMonths: 7,
      preferredTechnologies: ['Wireshark', 'Linux', 'Python', 'Splunk', 'Nmap'],
      learningStyle: 'Structured Theory & Exercises',
      careerNotes: 'Focus on network defense, vulnerability assessments, and preparing for Security+ certification.',
    },
  },
];
