/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { X, ShieldAlert, CheckCircle2, Calculator } from 'lucide-react';
import { CareerReadiness } from '../../types/career';

interface ReadinessInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  readiness: CareerReadiness;
}

export const ReadinessInfoModal: React.FC<ReadinessInfoModalProps> = ({
  isOpen,
  onClose,
  readiness,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg p-6 space-y-5 shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <Calculator className="w-5 h-5 text-indigo-400" />
            <h3 className="text-base font-bold text-white">Career Readiness Score Methodology</h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4 text-xs text-slate-300">
          <p className="leading-relaxed">
            The readiness score is an <span className="text-white font-semibold">indicative mathematical estimate</span> derived strictly from your self-reported assessment inputs and junior job benchmarks. It is <span className="text-indigo-300 font-semibold">never presented as a standardized clinical or psychometric certification</span>.
          </p>

          <div className="bg-slate-800/60 border border-slate-750 rounded-xl p-4 space-y-3">
            <div className="text-xs font-semibold text-white">Formula Weight Distribution:</div>
            
            <div className="space-y-2">
              <div>
                <div className="flex justify-between text-[11px] font-mono">
                  <span className="text-slate-300">1. Declared Skills & Baseline Match (Max 40 pts)</span>
                  <span className="text-indigo-300 font-bold tabular-nums">{readiness.methodology.skillsCoverage} pts</span>
                </div>
                <div className="w-full bg-slate-700/60 rounded-full h-1 mt-1">
                  <div
                    className="bg-indigo-500 h-1 rounded-full"
                    style={{ width: `${(readiness.methodology.skillsCoverage / 40) * 100}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-[11px] font-mono">
                  <span className="text-slate-300">2. Academic & Experience Factor (Max 35 pts)</span>
                  <span className="text-blue-300 font-bold tabular-nums">{readiness.methodology.baselineFoundation} pts</span>
                </div>
                <div className="w-full bg-slate-700/60 rounded-full h-1 mt-1">
                  <div
                    className="bg-blue-500 h-1 rounded-full"
                    style={{ width: `${(readiness.methodology.baselineFoundation / 35) * 100}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-[11px] font-mono">
                  <span className="text-slate-300">3. Time Commitment Factor (Max 25 pts)</span>
                  <span className="text-purple-300 font-bold tabular-nums">{readiness.methodology.timeCommitmentFactor} pts</span>
                </div>
                <div className="w-full bg-slate-700/60 rounded-full h-1 mt-1">
                  <div
                    className="bg-purple-500 h-1 rounded-full"
                    style={{ width: `${(readiness.methodology.timeCommitmentFactor / 25) * 100}%` }}
                  />
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-700/60 flex justify-between items-center text-xs font-bold text-white font-mono">
              <span>Total Estimated Readiness:</span>
              <span className="text-indigo-400 text-sm">{readiness.score} / 100</span>
            </div>
          </div>

          <div className="p-3 bg-amber-950/30 border border-amber-800/40 rounded-xl text-amber-300/90 flex gap-2">
            <ShieldAlert className="w-4 h-4 shrink-0 text-amber-400 mt-0.5" />
            <p className="text-[11px] leading-relaxed">
              {readiness.explanation} As you complete milestones and projects in your roadmap, your practical readiness advances.
            </p>
          </div>
        </div>

        <div className="pt-2 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-white bg-slate-800 hover:bg-slate-750 rounded-lg transition-colors cursor-pointer"
          >
            Understood
          </button>
        </div>
      </div>
    </div>
  );
};
