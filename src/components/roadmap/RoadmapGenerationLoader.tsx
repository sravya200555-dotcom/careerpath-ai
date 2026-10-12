/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { Sparkles, Brain, Cpu, Database, CheckCircle2 } from 'lucide-react';

interface RoadmapGenerationLoaderProps {
  careerGoal: string;
}

const STAGES = [
  { message: 'Evaluating educational foundation & declared skills...', icon: Brain },
  { message: 'Identifying missing competencies & prerequisite graph...', icon: Database },
  { message: 'Calling Groq AI high-speed inference pipeline...', icon: Cpu },
  { message: 'Synthesizing phased weekly milestones & hours budget...', icon: Sparkles },
  { message: 'Validating structured schema & industry readiness score...', icon: CheckCircle2 },
];

export const RoadmapGenerationLoader: React.FC<RoadmapGenerationLoaderProps> = ({ careerGoal }) => {
  const [stageIndex, setStageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setStageIndex((prev) => (prev < STAGES.length - 1 ? prev + 1 : prev));
    }, 1800);
    return () => clearInterval(interval);
  }, []);

  const CurrentIcon = STAGES[stageIndex].icon;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
      <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center space-y-6 shadow-2xl">
        {/* Animated Glow Icon */}
        <div className="relative mx-auto w-20 h-20 flex items-center justify-center">
          <div className="absolute inset-0 bg-indigo-500/20 rounded-full animate-ping duration-1000" />
          <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-600 to-blue-500 flex items-center justify-center text-white shadow-lg shadow-indigo-500/30">
            <CurrentIcon className="w-8 h-8 animate-pulse" />
          </div>
        </div>

        {/* Title & Career Goal */}
        <div className="space-y-1.5">
          <h3 className="text-lg font-bold text-white">Synthesizing Career Roadmap</h3>
          <p className="text-xs text-indigo-400 font-medium">Target Role: {careerGoal}</p>
        </div>

        {/* Dynamic Stage Message */}
        <div className="h-10 flex items-center justify-center">
          <p className="text-xs text-slate-300 transition-all duration-300 font-medium animate-fadeIn">
            {STAGES[stageIndex].message}
          </p>
        </div>

        {/* Progress Bar Indicator */}
        <div className="space-y-2">
          <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
            <div
              className="h-1.5 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 rounded-full transition-all duration-700 ease-out"
              style={{ width: `${((stageIndex + 1) / STAGES.length) * 100}%` }}
            />
          </div>
          <div className="flex justify-between text-[11px] text-slate-500 font-mono">
            <span>Stage {stageIndex + 1} of {STAGES.length}</span>
            <span>LLM Structured Engine</span>
          </div>
        </div>
      </div>
    </div>
  );
};
