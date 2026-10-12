/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Layers,
  Check,
  Clock,
  Sparkles,
  Info,
  DollarSign,
  Briefcase,
  FolderGit2,
  Cpu,
} from 'lucide-react';
import { CAREER_COMPARISON_DATA } from '../../data/careerComparisonData';
import { CareerComparison } from '../../types/career';

interface CareerComparisonViewProps {
  onStartAssessmentForCareer?: (careerTitle: string) => void;
}

export const CareerComparisonView: React.FC<CareerComparisonViewProps> = ({
  onStartAssessmentForCareer,
}) => {
  const [selectedCareerIds, setSelectedCareerIds] = useState<string[]>([
    'ai-engineer',
    'full-stack-developer',
  ]);

  const toggleSelectCareer = (id: string) => {
    if (selectedCareerIds.includes(id)) {
      if (selectedCareerIds.length > 1) {
        setSelectedCareerIds(selectedCareerIds.filter((c) => c !== id));
      }
    } else {
      setSelectedCareerIds([...selectedCareerIds, id]);
    }
  };

  const selectedCareers: CareerComparison[] = CAREER_COMPARISON_DATA.filter((c) =>
    selectedCareerIds.includes(c.id)
  );

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-indigo-400">
              <Layers className="w-4 h-4" />
              <span>Multi-Track Comparative Intelligence</span>
              <span aria-hidden="true">·</span>
              <span>Side-by-Side Analysis</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1 tracking-tight">
              Career Trajectory Comparison
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
              Compare prerequisite complexity, daily responsibilities, estimated timelines, and typical compensation across top technology careers.
            </p>
          </div>
        </div>

        {/* Disclaimer Callout */}
        <div className="p-3 bg-slate-850/80 border border-slate-750 rounded-xl flex items-start gap-2.5 text-xs text-slate-300">
          <Info className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <span className="font-semibold text-white">Baseline Notice:</span> Learning difficulty and estimated preparation time are indicative industry medians for learners with high school math literacy studying 12–15 hours per week. Your actual timeline will vary based on your personal starting point.
          </p>
        </div>

        {/* Selection Bar */}
        <div className="pt-2">
          <div className="text-xs font-semibold text-slate-400 mb-2.5">
            Select Careers to Compare (Pick 2 or more):
          </div>
          <div className="flex flex-wrap gap-2">
            {CAREER_COMPARISON_DATA.map((career) => {
              const isSelected = selectedCareerIds.includes(career.id);
              return (
                <button
                  key={career.id}
                  onClick={() => toggleSelectCareer(career.id)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all inline-flex items-center gap-2 cursor-pointer ${
                    isSelected
                      ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/30'
                      : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800 hover:text-white border border-slate-750'
                  }`}
                >
                  <div
                    className={`w-3.5 h-3.5 rounded flex items-center justify-center border ${
                      isSelected ? 'bg-white text-indigo-600 border-white' : 'border-slate-600'
                    }`}
                  >
                    {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                  </div>
                  <span>{career.title}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Side-by-Side Comparison Matrix */}
      <div className={`grid grid-cols-1 md:grid-cols-${Math.min(4, Math.max(2, selectedCareers.length))} gap-6`}>
        {selectedCareers.map((career) => (
          <div
            key={career.id}
            className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6 flex flex-col justify-between shadow-sm hover:border-slate-700 transition-colors"
          >
            <div className="space-y-4">
              {/* Career Title & Category */}
              <div>
                <span className="text-[11px] font-mono text-indigo-400 uppercase tracking-wider">
                  {career.category}
                </span>
                <h2 className="text-xl font-bold text-white mt-0.5 tracking-tight">
                  {career.title}
                </h2>
                <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                  {career.description}
                </p>
              </div>

              {/* Quick Key Metrics */}
              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800 text-xs">
                <div className="p-2.5 rounded-xl bg-slate-850 border border-slate-750">
                  <span className="text-[11px] text-slate-400 block">Difficulty</span>
                  <span
                    className={`font-semibold font-mono text-xs ${
                      career.learningDifficulty === 'Steep'
                        ? 'text-red-400'
                        : career.learningDifficulty === 'Challenging'
                        ? 'text-amber-400'
                        : 'text-emerald-400'
                    }`}
                  >
                    {career.learningDifficulty}
                  </span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-850 border border-slate-750">
                  <span className="text-[11px] text-slate-400 block">Prep Time</span>
                  <span className="font-semibold text-white font-mono text-xs">
                    {career.estimatedMonthsToJunior}
                  </span>
                </div>
              </div>

              {/* Salary Guidance */}
              <div className="p-3 rounded-xl bg-slate-850/60 border border-slate-750 text-xs">
                <div className="text-[11px] text-slate-400 font-medium">Estimated Entry Compensation:</div>
                <div className="font-bold font-mono text-emerald-400 mt-0.5 tabular-nums">
                  {career.averageEntrySalary}
                </div>
              </div>

              {/* Core Required Skills */}
              <div className="space-y-2">
                <div className="text-xs font-semibold text-white flex items-center gap-1.5">
                  <Cpu className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Required Skills:</span>
                </div>
                <ul className="space-y-1.5 text-xs text-slate-300">
                  {career.coreSkills.map((skill, sIdx) => (
                    <li key={sIdx} className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-1.5 shrink-0" />
                      <span>{skill}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Technologies */}
              <div className="space-y-2">
                <div className="text-xs font-semibold text-white">Primary Technologies:</div>
                <div className="flex flex-wrap gap-1.5">
                  {career.technologies.map((tech, tIdx) => (
                    <span
                      key={tIdx}
                      className="px-2 py-0.5 rounded text-[11px] font-mono bg-slate-800 text-slate-300 border border-slate-700/60"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Typical Responsibilities */}
              <div className="space-y-2 pt-2 border-t border-slate-800">
                <div className="text-xs font-semibold text-white flex items-center gap-1.5">
                  <Briefcase className="w-3.5 h-3.5 text-blue-400" />
                  <span>Typical Daily Responsibilities:</span>
                </div>
                <ul className="space-y-1.5 text-xs text-slate-300">
                  {career.typicalResponsibilities.map((resp, rIdx) => (
                    <li key={rIdx} className="flex items-start gap-2">
                      <span className="text-slate-500 font-mono">·</span>
                      <span className="leading-relaxed">{resp}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Key Deliverables */}
              <div className="space-y-2 pt-2 border-t border-slate-800">
                <div className="text-xs font-semibold text-white flex items-center gap-1.5">
                  <FolderGit2 className="w-3.5 h-3.5 text-purple-400" />
                  <span>Sample Portfolio Deliverables:</span>
                </div>
                <ul className="space-y-1.5 text-xs text-slate-300">
                  {career.keyDeliverables.map((deliv, dIdx) => (
                    <li key={dIdx} className="p-2 rounded bg-slate-850 text-[11px] border border-slate-800">
                      {deliv}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Launch Assessment for this Career */}
            {onStartAssessmentForCareer && (
              <div className="pt-4 border-t border-slate-800">
                <button
                  onClick={() => onStartAssessmentForCareer(career.title)}
                  className="w-full py-2.5 px-4 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl transition-colors shadow-sm cursor-pointer"
                >
                  Create Roadmap for {career.title}
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
