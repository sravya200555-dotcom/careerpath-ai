/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
} from 'recharts';
import { Target, Info, ShieldCheck, CheckCircle2, AlertTriangle, BookOpen } from 'lucide-react';
import { SkillGap } from '../../types/career';

interface SkillGapAnalysisProps {
  skillGaps: SkillGap[];
  careerGoal: string;
}

export const SkillGapAnalysis: React.FC<SkillGapAnalysisProps> = ({
  skillGaps,
  careerGoal,
}) => {
  const [chartType, setChartType] = useState<'bar' | 'radar'>('bar');
  const [filterPriority, setFilterPriority] = useState<string>('all');

  const chartData = skillGaps.map((item) => ({
    skill: item.skill,
    'Current Level': item.currentLevel,
    'Target Level': item.targetLevel,
    'Gap Delta': Math.max(0, item.targetLevel - item.currentLevel),
  }));

  const filteredGaps = skillGaps.filter((item) => {
    if (filterPriority !== 'all' && item.priority !== filterPriority) {
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
              <Target className="w-4 h-4" />
              <span>Diagnostic Proficiency Breakdown</span>
              <span aria-hidden="true">·</span>
              <span>1 - 5 Proficiency Metric</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1 tracking-tight">
              Skill Gap Analysis
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
              Comparison between your declared current baseline and typical entry-level requirements for <span className="text-white font-semibold">{careerGoal}</span>.
            </p>
          </div>

          {/* Chart View Toggle */}
          <div className="flex items-center gap-1 p-1 bg-slate-850 rounded-xl border border-slate-750 shrink-0 self-start sm:self-center">
            <button
              onClick={() => setChartType('bar')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                chartType === 'bar' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              Bar Comparison
            </button>
            <button
              onClick={() => setChartType('radar')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                chartType === 'radar' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              Radar Map
            </button>
          </div>
        </div>

        {/* Explicitly Documented Proficiency Scale Legend */}
        <div className="mt-4 pt-4 border-t border-slate-800/80 bg-slate-850/40 p-4 rounded-xl border border-slate-800">
          <div className="flex items-center gap-2 text-xs font-bold text-white mb-2">
            <ShieldCheck className="w-4 h-4 text-indigo-400" />
            <span>Documented 1–5 Proficiency Scale:</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-5 gap-2 text-[11px] text-slate-300">
            <div className="p-2 rounded bg-slate-800/80 border border-slate-750">
              <span className="font-mono text-indigo-400 font-bold block">Level 1: Novice</span>
              <span>Awareness of syntax; requires step-by-step guidance.</span>
            </div>
            <div className="p-2 rounded bg-slate-800/80 border border-slate-750">
              <span className="font-mono text-indigo-400 font-bold block">Level 2: Elementary</span>
              <span>Can write basic scripts and solve simple exercises.</span>
            </div>
            <div className="p-2 rounded bg-slate-800/80 border border-slate-750">
              <span className="font-mono text-indigo-400 font-bold block">Level 3: Competent</span>
              <span>Builds independent features; understands standard APIs.</span>
            </div>
            <div className="p-2 rounded bg-slate-800/80 border border-slate-750">
              <span className="font-mono text-indigo-400 font-bold block">Level 4: Proficient</span>
              <span>Junior job-ready; designs architecture and debugs errors.</span>
            </div>
            <div className="p-2 rounded bg-slate-800/80 border border-slate-750">
              <span className="font-mono text-indigo-400 font-bold block">Level 5: Mastery</span>
              <span>Advanced optimization, internals, and production scale.</span>
            </div>
          </div>
          <p className="text-[11px] text-slate-400 mt-2">
            Note: This scale is an indicative self-assessment rubric. It is not an accredited psychometric examination.
          </p>
        </div>
      </div>

      {/* Visual Chart Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
        <div className="flex justify-between items-center text-xs font-semibold text-slate-300">
          <span>Comparative Proficiency Graph (Levels 1 - 5)</span>
          <div className="flex items-center gap-4 text-xs font-mono">
            <span className="flex items-center gap-1.5 text-slate-400">
              <span className="w-3 h-3 rounded-sm bg-slate-500 inline-block" /> Current Baseline
            </span>
            <span className="flex items-center gap-1.5 text-indigo-400">
              <span className="w-3 h-3 rounded-sm bg-indigo-500 inline-block" /> Target Requirement
            </span>
          </div>
        </div>

        <div className="w-full h-80 pt-4">
          {chartType === 'bar' ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 20, left: -20, bottom: 40 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                <XAxis
                  dataKey="skill"
                  stroke="#94a3b8"
                  tick={{ fill: '#cbd5e1', fontSize: 11 }}
                  angle={-20}
                  textAnchor="end"
                  interval={0}
                  height={50}
                />
                <YAxis
                  domain={[0, 5]}
                  ticks={[1, 2, 3, 4, 5]}
                  stroke="#94a3b8"
                  tick={{ fill: '#cbd5e1', fontSize: 11 }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: '#334155',
                    borderRadius: '0.75rem',
                    color: '#f8fafc',
                    fontSize: '12px',
                  }}
                />
                <Bar dataKey="Current Level" fill="#64748b" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Target Level" fill="#6366f1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={chartData} cx="50%" cy="50%" outerRadius="80%">
                <PolarGrid stroke="#334155" />
                <PolarAngleAxis dataKey="skill" tick={{ fill: '#cbd5e1', fontSize: 11 }} />
                <PolarRadiusAxis angle={30} domain={[0, 5]} stroke="#94a3b8" />
                <Radar
                  name="Current Level"
                  dataKey="Current Level"
                  stroke="#64748b"
                  fill="#64748b"
                  fillOpacity={0.4}
                />
                <Radar
                  name="Target Level"
                  dataKey="Target Level"
                  stroke="#6366f1"
                  fill="#6366f1"
                  fillOpacity={0.5}
                />
                <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: '#334155',
                    borderRadius: '0.75rem',
                    color: '#f8fafc',
                    fontSize: '12px',
                  }}
                />
              </RadarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Detailed Skill Gap Cards with Recommended Action */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h2 className="text-lg font-bold text-white tracking-tight">
            Detailed Gap Breakdown & Suggested Actions
          </h2>

          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-400">Filter Priority:</span>
            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              className="bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-indigo-500 cursor-pointer"
            >
              <option value="all">All Priorities</option>
              <option value="High">High Priority</option>
              <option value="Medium">Medium Priority</option>
              <option value="Foundational">Foundational</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredGaps.map((item, idx) => (
            <div
              key={idx}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3 hover:border-slate-700 transition-colors shadow-sm"
            >
              <div className="flex items-center justify-between gap-2">
                <h3 className="text-sm font-bold text-white truncate">{item.skill}</h3>
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-semibold tracking-wide uppercase ${
                    item.priority === 'High'
                      ? 'bg-red-950/70 text-red-300 border border-red-800/60'
                      : item.priority === 'Medium'
                      ? 'bg-amber-950/70 text-amber-300 border border-amber-800/60'
                      : 'bg-blue-950/70 text-blue-300 border border-blue-800/60'
                  }`}
                >
                  {item.priority} Priority
                </span>
              </div>

              {/* Progress scale bar */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-slate-400">Current: Lvl {item.currentLevel}/5</span>
                  <span className="text-indigo-300 font-bold">Target: Lvl {item.targetLevel}/5 (+{item.gap})</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden flex">
                  <div
                    className="bg-slate-600 h-2"
                    style={{ width: `${(item.currentLevel / 5) * 100}%` }}
                    title={`Current: ${item.currentLevel}`}
                  />
                  <div
                    className="bg-indigo-500 h-2"
                    style={{ width: `${(item.gap / 5) * 100}%` }}
                    title={`Gap: +${item.gap}`}
                  />
                </div>
              </div>

              {/* Reason */}
              <div className="text-xs text-slate-300">
                <span className="font-semibold text-slate-200">Relevance:</span> {item.reason}
              </div>

              {/* Suggested Action */}
              <div className="p-3 bg-slate-850 rounded-xl border border-slate-750 flex items-start gap-2 text-xs text-indigo-200">
                <BookOpen className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-white">Suggested Action: </span>
                  {item.suggestedAction}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
