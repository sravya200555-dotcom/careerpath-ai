/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { RoadmapOutput, MilestoneProgressMap } from '../types/career';

export interface ProgressSummary {
  totalMilestones: number;
  completedMilestones: number;
  inProgressMilestones: number;
  notStartedMilestones: number;
  completionPercentage: number;
  phaseProgress: {
    phaseId: string;
    phaseTitle: string;
    total: number;
    completed: number;
    percentage: number;
  }[];
}

export function calculateRoadmapProgress(
  roadmap: RoadmapOutput | null,
  progressMap: MilestoneProgressMap
): ProgressSummary {
  if (!roadmap || !roadmap.phases || roadmap.phases.length === 0) {
    return {
      totalMilestones: 0,
      completedMilestones: 0,
      inProgressMilestones: 0,
      notStartedMilestones: 0,
      completionPercentage: 0,
      phaseProgress: [],
    };
  }

  let total = 0;
  let completed = 0;
  let inProgress = 0;

  const phaseProgress = roadmap.phases.map((phase) => {
    let pTotal = 0;
    let pCompleted = 0;

    phase.milestones.forEach((m) => {
      total++;
      pTotal++;
      const status = progressMap[m.id] || 'not-started';
      if (status === 'completed') {
        completed++;
        pCompleted++;
      } else if (status === 'in-progress') {
        inProgress++;
      }
    });

    const percentage = pTotal > 0 ? Math.round((pCompleted / pTotal) * 100) : 0;
    return {
      phaseId: phase.id,
      phaseTitle: phase.title,
      total: pTotal,
      completed: pCompleted,
      percentage,
    };
  });

  const completionPercentage = total > 0 ? Math.round((completed / total) * 100) : 0;
  const notStarted = Math.max(0, total - (completed + inProgress));

  return {
    totalMilestones: total,
    completedMilestones: completed,
    inProgressMilestones: inProgress,
    notStartedMilestones: notStarted,
    completionPercentage,
    phaseProgress,
  };
}
