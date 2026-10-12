/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  CheckCircle,
  Circle,
  Clock,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  BookOpen,
  Filter,
  CheckCircle2,
  Hourglass,
  Layers,
} from 'lucide-react';
import { RoadmapOutput, MilestoneStatus, Milestone } from '../../types/career';
import { ProgressSummary } from '../../utils/progressCalculator';

interface VisualRoadmapTimelineProps {
  roadmap: RoadmapOutput;
  progressMap: Record<string, MilestoneStatus>;
  onUpdateStatus: (milestoneId: string, status: MilestoneStatus) => void;
  progressSummary: ProgressSummary;
}

export const VisualRoadmapTimeline: React.FC<VisualRoadmapTimelineProps> = ({
  roadmap,
  progressMap,
  onUpdateStatus,
  progressSummary,
}) => {
  const [selectedPhaseFilter, setSelectedPhaseFilter] = useState<string>('all');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('all');
  const [expandedMilestones, setExpandedMilestones] = useState<Record<string, boolean>>({});

  const toggleExpand = (id: string) => {
    setExpandedMilestones((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const filteredPhases = roadmap.phases.filter((phase) => {
    if (selectedPhaseFilter !== 'all' && phase.id !== selectedPhaseFilter) {
      return false;
    }
    return true;
  });

  return (
    <div className="space-y-8 pb-12">
      {/* Header and Filter Controls */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-indigo-400">
              <Layers className="w-4 h-4" />
              <span>Interactive Phased Milestones</span>
              <span aria-hidden="true">·</span>
              <span className="text-slate-400 font-mono text-[11px]">
                {progressSummary.completedMilestones} / {progressSummary.totalMilestones} Completed
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1 tracking-tight">
              Visual Roadmap Timeline
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
              Track your execution milestone by milestone. Toggle completion statuses to update your verified readiness in real time.
            </p>
          </div>

          {/* Quick Progress Dial */}
          <div className="flex items-center gap-3 bg-slate-850 p-3 rounded-xl border border-slate-800 shrink-0">
            <div className="w-10 h-10 rounded-lg bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center font-mono font-bold text-sm text-indigo-300 tabular-nums">
              {progressSummary.completionPercentage}%
            </div>
            <div className="text-xs">
              <div className="font-semibold text-white">Overall Path</div>
              <div className="text-slate-400 text-[11px] font-mono">
                {progressSummary.inProgressMilestones} in progress
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-800/80">
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="text-slate-400 flex items-center gap-1 font-medium mr-1">
              <Filter className="w-3.5 h-3.5" />
              <span>Filter Phase:</span>
            </span>
            <button
              onClick={() => setSelectedPhaseFilter('all')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
                selectedPhaseFilter === 'all'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-750'
              }`}
            >
              All Phases
            </button>
            {roadmap.phases.map((phase) => (
              <button
                key={phase.id}
                onClick={() => setSelectedPhaseFilter(phase.id)}
                className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
                  selectedPhaseFilter === phase.id
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-750'
                }`}
              >
                Phase 0{phase.phaseNumber}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-400">Status:</span>
            <select
              value={selectedStatusFilter}
              onChange={(e) => setSelectedStatusFilter(e.target.value)}
              className="bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-indigo-500 cursor-pointer"
            >
              <option value="all">All Statuses</option>
              <option value="not-started">Not Started</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </div>
        </div>
      </div>

      {/* Phased Timeline Nodes */}
      <div className="space-y-10">
        {filteredPhases.map((phase, phaseIndex) => {
          // Filter milestones in this phase by status
          const visibleMilestones = phase.milestones.filter((m) => {
            const status = progressMap[m.id] || 'not-started';
            if (selectedStatusFilter !== 'all' && status !== selectedStatusFilter) {
              return false;
            }
            return true;
          });

          if (visibleMilestones.length === 0 && selectedStatusFilter !== 'all') {
            return null;
          }

          const phaseProgress = progressSummary.phaseProgress.find((p) => p.phaseId === phase.id);

          return (
            <div key={phase.id} className="relative space-y-4">
              {/* Phase Header Card */}
              <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-xs font-mono text-indigo-400 font-bold">
                      <span>PHASE 0{phase.phaseNumber}</span>
                      <span>·</span>
                      <span className="text-slate-400">{phase.durationWeeks} Weeks Target</span>
                    </div>
                    <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">{phase.title}</h2>
                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">{phase.description}</p>
                  </div>

                  <div className="text-right shrink-0">
                    <div className="text-xs font-mono text-slate-400">
                      Phase Progress:{' '}
                      <span className="font-bold text-indigo-300">{phaseProgress?.percentage || 0}%</span>
                    </div>
                    <div className="w-32 bg-slate-800 rounded-full h-1.5 mt-1.5 overflow-hidden">
                      <div
                        className="bg-indigo-500 h-1.5 rounded-full transition-all"
                        style={{ width: `${phaseProgress?.percentage || 0}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Key Learning Outcomes summary */}
                {phase.learningOutcomes && phase.learningOutcomes.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-slate-800/80">
                    <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
                      Target Phase Outcomes:
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-300">
                      {phase.learningOutcomes.map((outcome, idx) => (
                        <div key={idx} className="flex items-start gap-2">
                          <CheckCircle className="w-3.5 h-3.5 text-indigo-400 shrink-0 mt-0.5" />
                          <span>{outcome}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Milestones in this phase */}
              <div className="pl-4 sm:pl-8 border-l-2 border-slate-800 space-y-4 ml-4">
                {visibleMilestones.map((milestone, mIdx) => {
                  const currentStatus = progressMap[milestone.id] || 'not-started';
                  const isExpanded = !!expandedMilestones[milestone.id];

                  return (
                    <div
                      key={milestone.id}
                      className={`relative bg-slate-900 border rounded-2xl p-5 transition-all shadow-sm ${
                        currentStatus === 'completed'
                          ? 'border-emerald-800/50 bg-slate-900/90'
                          : currentStatus === 'in-progress'
                          ? 'border-indigo-700/60 bg-slate-900'
                          : 'border-slate-800 hover:border-slate-750'
                      }`}
                    >
                      {/* Timeline dot */}
                      <div
                        className={`absolute -left-[25px] sm:-left-[41px] top-6 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                          currentStatus === 'completed'
                            ? 'bg-emerald-500 border-emerald-400 text-white'
                            : currentStatus === 'in-progress'
                            ? 'bg-indigo-600 border-indigo-400 text-white'
                            : 'bg-slate-900 border-slate-700 text-slate-500'
                        }`}
                      >
                        {currentStatus === 'completed' ? (
                          <CheckCircle2 className="w-3 h-3" />
                        ) : currentStatus === 'in-progress' ? (
                          <Hourglass className="w-2.5 h-2.5 animate-spin" />
                        ) : (
                          <Circle className="w-2 h-2" />
                        )}
                      </div>

                      {/* Milestone Header */}
                      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                        <div className="space-y-1.5 flex-1">
                          <div className="flex flex-wrap items-center gap-2 text-xs">
                            <span className="font-mono text-indigo-400 font-semibold">
                              Milestone 0{mIdx + 1}
                            </span>
                            <span aria-hidden="true">·</span>
                            <span className="text-slate-400 flex items-center gap-1 font-mono text-[11px]">
                              <Clock className="w-3 h-3 text-slate-500" />
                              ~{milestone.estimatedHours} hrs study
                            </span>
                          </div>

                          <h3 className="text-base font-bold text-white tracking-tight">
                            {milestone.title}
                          </h3>

                          <p className="text-xs text-slate-300 leading-relaxed">
                            {milestone.description}
                          </p>
                        </div>

                        {/* Interactive Status Segmented Controller */}
                        <div className="flex items-center gap-1 p-1 bg-slate-850 rounded-xl border border-slate-750 shrink-0 self-start lg:self-center">
                          <button
                            onClick={() => onUpdateStatus(milestone.id, 'not-started')}
                            className={`px-2.5 py-1 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
                              currentStatus === 'not-started'
                                ? 'bg-slate-700 text-white font-semibold'
                                : 'text-slate-400 hover:text-white'
                            }`}
                          >
                            Not Started
                          </button>
                          <button
                            onClick={() => onUpdateStatus(milestone.id, 'in-progress')}
                            className={`px-2.5 py-1 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
                              currentStatus === 'in-progress'
                                ? 'bg-indigo-600 text-white font-semibold shadow-sm'
                                : 'text-slate-400 hover:text-white'
                            }`}
                          >
                            In Progress
                          </button>
                          <button
                            onClick={() => onUpdateStatus(milestone.id, 'completed')}
                            className={`px-2.5 py-1 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
                              currentStatus === 'completed'
                                ? 'bg-emerald-600 text-white font-semibold shadow-sm'
                                : 'text-slate-400 hover:text-white'
                            }`}
                          >
                            Completed
                          </button>
                        </div>
                      </div>

                      {/* Expand/Collapse Toggle */}
                      <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                        <button
                          onClick={() => toggleExpand(milestone.id)}
                          className="text-indigo-400 hover:text-indigo-300 font-medium inline-flex items-center gap-1 transition-colors cursor-pointer"
                        >
                          <span>{isExpanded ? 'Hide Outcomes & Free Resources' : 'View Outcomes & Free Resources'}</span>
                          {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                        </button>

                        {milestone.prerequisites && milestone.prerequisites.length > 0 && (
                          <div className="text-[11px] text-slate-400">
                            Prereq: <span className="font-mono text-slate-300">{milestone.prerequisites.join(', ')}</span>
                          </div>
                        )}
                      </div>

                      {/* Expandable Details Container */}
                      {isExpanded && (
                        <div className="mt-4 pt-4 border-t border-slate-800 space-y-4 text-xs animate-fadeIn">
                          {/* Learning Outcomes */}
                          <div>
                            <div className="font-semibold text-slate-200 mb-2">Specific Learning Outcomes:</div>
                            <ul className="space-y-1.5 text-slate-300">
                              {milestone.learningOutcomes.map((lo, lIdx) => (
                                <li key={lIdx} className="flex items-start gap-2">
                                  <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-1.5 shrink-0" />
                                  <span>{lo}</span>
                                </li>
                              ))}
                            </ul>
                          </div>

                          {/* Curated Resources */}
                          {milestone.suggestedResources && milestone.suggestedResources.length > 0 && (
                            <div>
                              <div className="font-semibold text-slate-200 mb-2">Curated Free Study Resources:</div>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                {milestone.suggestedResources.map((res, rIdx) => (
                                  <div
                                    key={rIdx}
                                    className="p-2.5 bg-slate-850 rounded-xl border border-slate-750 flex items-center justify-between gap-2"
                                  >
                                    <div className="flex items-center gap-2 truncate">
                                      <BookOpen className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                                      <span className="text-white truncate font-medium">{res.title}</span>
                                    </div>
                                    <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 shrink-0">
                                      {res.type}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
