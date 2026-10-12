/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { RoadmapOutput, AssessmentInput, MilestoneProgressMap } from '../types/career';

const STORAGE_KEYS = {
  CURRENT_ROADMAP: 'careerpath_current_roadmap',
  LAST_ASSESSMENT: 'careerpath_last_assessment',
  MILESTONE_PROGRESS: 'careerpath_milestone_progress',
  SAVED_ROADMAPS: 'careerpath_saved_roadmaps',
} as const;

export const StorageService = {
  getCurrentRoadmap(): RoadmapOutput | null {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.CURRENT_ROADMAP);
      return data ? JSON.parse(data) : null;
    } catch (e) {
      console.warn('Failed to read roadmap from localStorage', e);
      return null;
    }
  },

  saveCurrentRoadmap(roadmap: RoadmapOutput): void {
    try {
      localStorage.setItem(STORAGE_KEYS.CURRENT_ROADMAP, JSON.stringify(roadmap));
      
      // Also save into roadmap history if not already there
      const history = this.getSavedRoadmaps();
      const existingIdx = history.findIndex((r) => r.id === roadmap.id);
      if (existingIdx >= 0) {
        history[existingIdx] = roadmap;
      } else {
        history.unshift(roadmap);
      }
      // Keep last 10
      localStorage.setItem(STORAGE_KEYS.SAVED_ROADMAPS, JSON.stringify(history.slice(0, 10)));
    } catch (e) {
      console.warn('Failed to save roadmap to localStorage', e);
    }
  },

  clearCurrentRoadmap(): void {
    try {
      localStorage.removeItem(STORAGE_KEYS.CURRENT_ROADMAP);
      localStorage.removeItem(STORAGE_KEYS.MILESTONE_PROGRESS);
    } catch (e) {
      console.warn('Failed to clear current roadmap from localStorage', e);
    }
  },

  getLastAssessment(): AssessmentInput | null {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.LAST_ASSESSMENT);
      return data ? JSON.parse(data) : null;
    } catch (e) {
      return null;
    }
  },

  saveLastAssessment(assessment: AssessmentInput): void {
    try {
      localStorage.setItem(STORAGE_KEYS.LAST_ASSESSMENT, JSON.stringify(assessment));
    } catch (e) {
      console.warn('Failed to save assessment to localStorage', e);
    }
  },

  getMilestoneProgress(): MilestoneProgressMap {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.MILESTONE_PROGRESS);
      return data ? JSON.parse(data) : {};
    } catch (e) {
      return {};
    }
  },

  saveMilestoneProgress(progress: MilestoneProgressMap): void {
    try {
      localStorage.setItem(STORAGE_KEYS.MILESTONE_PROGRESS, JSON.stringify(progress));
    } catch (e) {
      console.warn('Failed to save milestone progress to localStorage', e);
    }
  },

  setMilestoneStatus(milestoneId: string, status: 'not-started' | 'in-progress' | 'completed'): MilestoneProgressMap {
    const current = this.getMilestoneProgress();
    const updated = { ...current, [milestoneId]: status };
    this.saveMilestoneProgress(updated);
    return updated;
  },

  getSavedRoadmaps(): RoadmapOutput[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SAVED_ROADMAPS);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      return [];
    }
  },
};
