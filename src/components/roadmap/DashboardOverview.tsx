/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Clock,
  Calendar,
  Award,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  ArrowRight,
  Download,
  RefreshCw,
  Sparkles,
  GitBranch,
  Target,
  Share2,
} from 'lucide-react';
import { RoadmapOutput } from '../../types/career';
import { ProgressSummary } from '../../utils/progressCalculator';
import { ReadinessInfoModal } from '../common/ReadinessInfoModal';

interface DashboardOverviewProps {
  roadmap: RoadmapOutput;
  progress: ProgressSummary;
  onNavigateTab: (tab: string) => void;
  onRegenerate: () => void;
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({
  roadmap,
  progress,
  onNavigateTab,
  onRegenerate,
}) => {
  const [showReadinessModal, setShowReadinessModal] = useState(false);
  const [copiedNotification, setCopiedNotification] = useState(false);

  const handleExport = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(roadmap, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `${roadmap.careerGoal.replace(/\s+/g, '_')}_Roadmap.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedNotification(true);
    setTimeout(() => setCopiedNotification(false), 2000);
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Top Header Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs text-indigo-400 font-medium">
              <Sparkles className="w-4 h-4" />
              <span>Tailored Career Roadmap</span>
              <span aria-hidden="true">·</span>
              <span className="text-slate-400 font-mono text-[11px]">
                {roadmap.generatedWith.source === 'groq' ? 'Groq LLaMA 3.3' : 'Adaptive AI Engine'}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {roadmap.careerGoal}
            </h1>

            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              Curated progression pathway designed around your current background. Follow the phased milestones to close skill gaps and build a portfolio ready for junior hiring.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              onClick={handleExport}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-750 border border-slate-700/60 rounded-lg transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export JSON</span>
            </button>

            <button
              onClick={handleCopyLink}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-750 border border-slate-700/60 rounded-lg transition-colors cursor-pointer"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>{copiedNotification ? 'Copied!' : 'Share Plan'}</span>
            </button>

            <button
              onClick={onRegenerate}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg shadow-sm transition-colors cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Regenerate</span>
            </button>
          </div>
        </div>

        {/* Core Metric Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-slate-800/80">
          <div className="bg-slate-850/60 border border-slate-800 p-4 rounded-xl">
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <Calendar className="w-3.5 h-3.5 text-indigo-400" />
              <span>Est. Preparation</span>
            </div>
            <div className="text-xl sm:text-2xl font-bold font-mono text-white mt-1 tabular-nums">
              {roadmap.estimatedWeeks} <span className="text-xs font-normal text-slate-400">Weeks</span>
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">
              Approx. {Math.round(roadmap.estimatedWeeks / 4.3)} months
            </div>
          </div>

          <div className="bg-slate-850/60 border border-slate-800 p-4 rounded-xl">
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <Clock className="w-3.5 h-3.5 text-blue-400" />
              <span>Weekly Commitment</span>
            </div>
            <div className="text-xl sm:text-2xl font-bold font-mono text-white mt-1 tabular-nums">
              {roadmap.weeklyHours} <span className="text-xs font-normal text-slate-400">Hours</span>
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">
              Total ~{roadmap.estimatedWeeks * roadmap.weeklyHours} hrs study
            </div>
          </div>

          <div className="bg-slate-850/60 border border-slate-800 p-4 rounded-xl relative group">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <Award className="w-3.5 h-3.5 text-emerald-400" />
                <span>Readiness Score</span>
              </div>
              <button
                onClick={() => setShowReadinessModal(true)}
                className="text-slate-400 hover:text-indigo-400 p-0.5 transition-colors cursor-pointer"
                title="View score methodology"
              >
                <HelpCircle className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="text-xl sm:text-2xl font-bold font-mono text-emerald-400 mt-1 tabular-nums flex items-baseline gap-1">
              {roadmap.readiness.score}
              <span className="text-xs font-normal text-slate-400">/ 100</span>
            </div>
            <button
              onClick={() => setShowReadinessModal(true)}
              className="text-[11px] text-indigo-400 hover:underline mt-0.5 text-left block cursor-pointer"
            >
              Formula Breakdown →
            </button>
          </div>

          <div className="bg-slate-850/60 border border-slate-800 p-4 rounded-xl">
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <CheckCircle2 className="w-3.5 h-3.5 text-purple-400" />
              <span>Milestones Finished</span>
            </div>
            <div className="text-xl sm:text-2xl font-bold font-mono text-white mt-1 tabular-nums">
              {progress.completedMilestones}{' '}
              <span className="text-xs font-normal text-slate-400">/ {progress.totalMilestones}</span>
            </div>
            <div className="text-[11px] text-purple-300 font-mono mt-0.5">
              {progress.completionPercentage}% overall progress
            </div>
          </div>
        </div>

        {/* Global Progress Bar */}
        <div className="mt-6 pt-5 border-t border-slate-800/80 space-y-2">
          <div className="flex justify-between items-center text-xs">
            <span className="font-semibold text-white">Overall Roadmap Completion</span>
            <span className="font-mono text-indigo-300 font-semibold tabular-nums">{progress.completionPercentage}%</span>
          </div>
          <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
            <div
              className="bg-gradient-to-r from-blue-500 via-indigo-500 to-emerald-400 h-2 rounded-full transition-all duration-500"
              style={{ width: `${progress.completionPercentage}%` }}
            />
          </div>
        </div>
      </div>

      {/* Grid: Strengths & Skill Gap Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Declared Strengths Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <h2 className="text-sm font-bold text-white">Verified Current Strengths</h2>
            </div>
            <span className="text-xs text-slate-400">{roadmap.strengths.length} Identified</span>
          </div>

          {roadmap.strengths.length > 0 ? (
            <ul className="space-y-2.5">
              {roadmap.strengths.map((strength, idx) => (
                <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-300 bg-slate-850/50 p-2.5 rounded-xl border border-slate-800">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                  <span className="leading-relaxed">{strength}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-xs text-slate-400">Baseline beginner starting profile declared.</p>
          )}

          <div className="pt-2 text-xs text-slate-400">
            These existing proficiencies reduce prerequisites for introductory modules.
          </div>
        </div>

        {/* Skill Gap Priority Summary */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4 text-indigo-400" />
              <h2 className="text-sm font-bold text-white">Top Priority Skill Gaps</h2>
            </div>
            <button
              onClick={() => onNavigateTab('skills')}
              className="text-xs text-indigo-400 hover:text-indigo-300 font-medium cursor-pointer"
            >
              Full Analysis →
            </button>
          </div>

          <div className="space-y-2.5">
            {roadmap.skillGaps.slice(0, 4).map((gap, idx) => (
              <div key={idx} className="p-3 bg-slate-850/50 rounded-xl border border-slate-800 space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-semibold text-white">{gap.skill}</span>
                  <div className="flex items-center gap-2 font-mono text-[11px]">
                    <span className="text-slate-400">Lvl {gap.currentLevel} → {gap.targetLevel}</span>
                    <span className={`px-1.5 py-0.5 rounded text-[10px] font-semibold ${
                      gap.priority === 'High' ? 'bg-red-950/60 text-red-300 border border-red-800/50' : 'bg-amber-950/60 text-amber-300 border border-amber-800/50'
                    }`}>
                      {gap.priority}
                    </span>
                  </div>
                </div>
                <p className="text-[11px] text-slate-400 line-clamp-1">{gap.reason}</p>
              </div>
            ))}
          </div>

          <div className="pt-1">
            <button
              onClick={() => onNavigateTab('skills')}
              className="w-full text-center py-2 px-3 text-xs font-semibold text-indigo-300 hover:text-white bg-slate-800/80 hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
            >
              View Interactive Gap Radar & Charts
            </button>
          </div>
        </div>
      </div>

      {/* Phased Curriculum Walkthrough Preview */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-indigo-400 font-medium">
              <GitBranch className="w-4 h-4" />
              <span>Step-by-Step Learning Path</span>
            </div>
            <h2 className="text-lg font-bold text-white mt-1">Phased Milestone Curriculum</h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Structured sequentially from foundations to junior interview preparation.
            </p>
          </div>

          <button
            onClick={() => onNavigateTab('timeline')}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl transition-colors shrink-0 cursor-pointer"
          >
            <span>Interactive Timeline</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {roadmap.phases.map((phase, pIdx) => {
            const pInfo = progress.phaseProgress.find((p) => p.phaseId === phase.id);
            const isCompleted = pInfo && pInfo.percentage === 100;
            return (
              <div
                key={phase.id}
                className="bg-slate-850/50 border border-slate-800 hover:border-slate-700 p-4 rounded-xl space-y-3 transition-colors"
              >
                <div className="flex justify-between items-center text-xs">
                  <span className="font-mono text-indigo-400 font-bold">Phase 0{phase.phaseNumber}</span>
                  <span className="text-[11px] font-mono text-slate-400">{phase.durationWeeks} Weeks</span>
                </div>

                <h3 className="text-sm font-bold text-white line-clamp-1">{phase.title}</h3>
                <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">{phase.description}</p>

                {/* Phase progress */}
                <div className="pt-2 border-t border-slate-800 space-y-1.5">
                  <div className="flex justify-between text-[11px] font-mono">
                    <span className="text-slate-400">{phase.milestones.length} Milestones</span>
                    <span className={isCompleted ? 'text-emerald-400 font-semibold' : 'text-slate-300'}>
                      {pInfo?.completed || 0}/{phase.milestones.length}
                    </span>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-1 overflow-hidden">
                    <div
                      className="bg-indigo-500 h-1 rounded-full transition-all"
                      style={{ width: `${pInfo?.percentage || 0}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Assumptions & Risk Disclaimers */}
      {roadmap.assumptions && roadmap.assumptions.length > 0 && (
        <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6 space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-300">
            <AlertCircle className="w-4 h-4 text-amber-400" />
            <span>Assumptions & Planning Constraints</span>
          </div>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-400">
            {roadmap.assumptions.map((assumption, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="text-slate-600 font-mono">·</span>
                <span>{assumption}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Methodology Modal */}
      <ReadinessInfoModal
        isOpen={showReadinessModal}
        onClose={() => setShowReadinessModal(false)}
        readiness={roadmap.readiness}
      />
    </div>
  );
};
