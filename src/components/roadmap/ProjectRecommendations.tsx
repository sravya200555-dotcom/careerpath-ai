/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  FolderGit2,
  Clock,
  Layers,
  Award,
  CheckCircle2,
  Filter,
  Flame,
  FileCode,
} from 'lucide-react';
import { RecommendedProject } from '../../types/career';

interface ProjectRecommendationsProps {
  projects: RecommendedProject[];
  careerGoal: string;
}

export const ProjectRecommendations: React.FC<ProjectRecommendationsProps> = ({
  projects,
  careerGoal,
}) => {
  const [filterDifficulty, setFilterDifficulty] = useState<string>('all');

  const filteredProjects = projects.filter((p) => {
    if (filterDifficulty !== 'all' && p.difficulty !== filterDifficulty) {
      return false;
    }
    return true;
  });

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-indigo-400">
              <FolderGit2 className="w-4 h-4" />
              <span>Industry-Grade Portfolio Proof</span>
              <span aria-hidden="true">·</span>
              <span>Direct Junior Recruiter Proof</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1 tracking-tight">
              Recommended Projects
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
              Recruiters evaluate working GitHub code and architectural decisions. These projects progress from foundational to advanced end-to-end applications for <span className="text-white font-semibold">{careerGoal}</span>.
            </p>
          </div>

          {/* Difficulty Filter */}
          <div className="flex items-center gap-1 p-1 bg-slate-850 rounded-xl border border-slate-750 shrink-0 self-start sm:self-center">
            {['all', 'Beginner', 'Intermediate', 'Advanced'].map((diff) => (
              <button
                key={diff}
                onClick={() => setFilterDifficulty(diff)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                  filterDifficulty === diff
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {diff === 'all' ? 'All Tiers' : diff}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Projects Grid */}
      <div className="space-y-6">
        {filteredProjects.map((project, idx) => (
          <div
            key={project.id || idx}
            className="bg-slate-900 border border-slate-800 rounded-2xl p-6 hover:border-slate-700 transition-all shadow-sm space-y-5"
          >
            {/* Top Bar: Title, Difficulty, Duration */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2.5 text-xs">
                  <span className="font-mono text-indigo-400 font-bold">PROJECT 0{idx + 1}</span>
                  <span aria-hidden="true">·</span>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold tracking-wide uppercase ${
                      project.difficulty === 'Beginner'
                        ? 'bg-emerald-950/70 text-emerald-300 border border-emerald-800/60'
                        : project.difficulty === 'Intermediate'
                        ? 'bg-blue-950/70 text-blue-300 border border-blue-800/60'
                        : 'bg-purple-950/70 text-purple-300 border border-purple-800/60'
                    }`}
                  >
                    {project.difficulty}
                  </span>
                  <span aria-hidden="true">·</span>
                  <span className="text-slate-400 flex items-center gap-1 font-mono text-[11px]">
                    <Clock className="w-3 h-3 text-slate-500" />
                    ~{project.estimatedDurationWeeks} Weeks Build
                  </span>
                </div>

                <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                  {project.title}
                </h2>
              </div>

              {/* Portfolio Value Rating Badge */}
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-850 rounded-xl border border-slate-750 shrink-0 self-start lg:self-center text-xs">
                <Award className="w-4 h-4 text-amber-400" />
                <span className="text-slate-400">Portfolio Value:</span>
                <span className="font-bold text-amber-300">{project.portfolioValue}</span>
              </div>
            </div>

            {/* Problem Statement Box */}
            <div className="p-3.5 bg-slate-850/70 rounded-xl border border-slate-750 space-y-1">
              <div className="text-[11px] font-bold text-indigo-300 uppercase tracking-wider">
                Real-World Problem Statement
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {project.problemStatement}
              </p>
            </div>

            {/* Description */}
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {project.description}
            </p>

            {/* Tech Stack & Required Skills */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-slate-800/80">
              <div>
                <div className="text-xs font-semibold text-slate-400 mb-2 flex items-center gap-1.5">
                  <FileCode className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Suggested Tech Stack:</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {project.techStack.map((tech, tIdx) => (
                    <span
                      key={tIdx}
                      className="px-2 py-0.5 rounded text-[11px] font-mono bg-slate-800 text-slate-200 border border-slate-700/60"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <div className="text-xs font-semibold text-slate-400 mb-2 flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-blue-400" />
                  <span>Required Skills Exercised:</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {project.requiredSkills.map((skill, sIdx) => (
                    <span
                      key={sIdx}
                      className="px-2 py-0.5 rounded text-[11px] bg-indigo-950/40 text-indigo-300 border border-indigo-800/40"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Concrete Deliverables */}
            {project.deliverables && project.deliverables.length > 0 && (
              <div className="pt-2 border-t border-slate-800/80">
                <div className="text-xs font-semibold text-slate-400 mb-2">
                  Expected Portfolio Deliverables:
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {project.deliverables.map((deliv, dIdx) => (
                    <div
                      key={dIdx}
                      className="p-2.5 rounded-xl bg-slate-850/40 border border-slate-800 flex items-start gap-2 text-xs text-slate-300"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{deliv}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
