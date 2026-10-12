/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import {
  LayoutDashboard,
  GitFork,
  BarChart2,
  FolderGit2,
  Award,
  Layers,
  RefreshCw,
  PlusCircle,
} from 'lucide-react';
import { RoadmapOutput } from '../../types/career';
import { ProgressSummary } from '../../utils/progressCalculator';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  roadmap: RoadmapOutput | null;
  progress: ProgressSummary;
  onOpenAssessment: () => void;
  onRegenerate: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  roadmap,
  progress,
  onOpenAssessment,
  onRegenerate,
}) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard Overview', icon: LayoutDashboard },
    { id: 'timeline', label: 'Visual Roadmap', icon: GitFork },
    { id: 'skills', label: 'Skill Gap Analysis', icon: BarChart2 },
    { id: 'projects', label: 'Recommended Projects', icon: FolderGit2 },
    { id: 'prep', label: 'Certifications & Prep', icon: Award },
    { id: 'comparison', label: 'Career Comparison', icon: Layers },
  ];

  return (
    <aside className="w-64 bg-slate-900/60 border-r border-slate-800/80 flex flex-col shrink-0 min-h-[calc(100vh-4rem)] p-4 space-y-6">
      {/* Current Roadmap Context */}
      {roadmap ? (
        <div className="bg-slate-800/50 rounded-xl p-3.5 border border-slate-750">
          <div className="text-xs text-slate-400 font-medium">Active Roadmap</div>
          <div className="text-sm font-bold text-white truncate mt-0.5">{roadmap.careerGoal}</div>
          
          {/* Progress Mini Bar */}
          <div className="mt-3 space-y-1.5">
            <div className="flex justify-between text-xs text-slate-400 font-mono tabular-nums">
              <span>Progress</span>
              <span className="text-indigo-300 font-semibold">{progress.completionPercentage}%</span>
            </div>
            <div className="w-full bg-slate-700/60 rounded-full h-1.5 overflow-hidden">
              <div
                className="bg-gradient-to-r from-blue-500 to-indigo-500 h-1.5 rounded-full transition-all duration-500"
                style={{ width: `${progress.completionPercentage}%` }}
              />
            </div>
            <div className="text-[11px] text-slate-500 tabular-nums">
              {progress.completedMilestones} of {progress.totalMilestones} milestones completed
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-slate-800/40 rounded-xl p-3.5 border border-slate-750 text-center">
          <div className="text-xs text-slate-400">No active roadmap</div>
          <button
            onClick={onOpenAssessment}
            className="mt-2 w-full text-xs font-semibold py-1.5 px-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition-colors inline-flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            Start Assessment
          </button>
        </div>
      )}

      {/* Main Navigation Links */}
      <nav className="flex-1 space-y-1">
        <div className="text-[11px] font-semibold text-slate-400 px-2 pb-1.5 tracking-wider uppercase">
          Navigation
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer text-left ${
                isActive
                  ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-indigo-400' : 'text-slate-500'}`} />
              <span className="truncate">{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Secondary Actions */}
      <div className="pt-4 border-t border-slate-800/80 space-y-2">
        {roadmap && (
          <button
            onClick={onRegenerate}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-medium text-slate-300 hover:text-white bg-slate-800/60 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Regenerate Roadmap</span>
          </button>
        )}
        <button
          onClick={onOpenAssessment}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-medium text-indigo-300 hover:text-white bg-indigo-950/40 hover:bg-indigo-900/60 border border-indigo-800/40 rounded-lg transition-colors cursor-pointer"
        >
          <PlusCircle className="w-3.5 h-3.5" />
          <span>New Assessment</span>
        </button>
      </div>
    </aside>
  );
};
