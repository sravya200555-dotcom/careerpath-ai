/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { AssessmentInput, RoadmapOutput, CareerComparison } from '../types/career';

export interface GenerationResponse {
  success: boolean;
  data: RoadmapOutput;
  source: 'groq' | 'fallback-ai';
  errorNotice?: string;
  durationMs: number;
}

export interface HealthResponse {
  status: string;
  hasGroqKey: boolean;
  model: string;
  timestamp: string;
}

export const ApiService = {
  async checkHealth(): Promise<HealthResponse> {
    try {
      const response = await fetch('/api/health');
      if (!response.ok) {
        throw new Error(`Health check failed with status: ${response.status}`);
      }
      return await response.json();
    } catch (e) {
      return {
        status: 'offline',
        hasGroqKey: false,
        model: 'unknown',
        timestamp: new Date().toISOString(),
      };
    }
  },

  async generateRoadmap(assessment: AssessmentInput): Promise<GenerationResponse> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 60000); // 60s timeout for complex LLM generation

    try {
      const response = await fetch('/api/roadmap/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(assessment),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      const json = await response.json();
      if (!response.ok || !json.success) {
        throw new Error(json.error || `Server responded with status ${response.status}`);
      }

      return json;
    } catch (err: any) {
      clearTimeout(timeoutId);
      if (err.name === 'AbortError') {
        throw new Error('Roadmap generation request timed out. Please retry.');
      }
      throw new Error(err.message || 'Failed to generate career roadmap');
    }
  },

  async getCareerComparisons(): Promise<CareerComparison[]> {
    try {
      const response = await fetch('/api/careers/compare');
      if (!response.ok) {
        throw new Error('Failed to fetch career comparisons');
      }
      const json = await response.json();
      return json.data;
    } catch (e) {
      console.warn('Using client comparison data fallback', e);
      const { CAREER_COMPARISON_DATA } = await import('../data/careerComparisonData');
      return CAREER_COMPARISON_DATA;
    }
  },
};
