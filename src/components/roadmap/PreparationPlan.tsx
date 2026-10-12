/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import {
  Award,
  BookOpen,
  CheckCircle,
  HelpCircle,
  DollarSign,
  Briefcase,
  Layers,
  Sparkles,
} from 'lucide-react';
import {
  CertificationRecommendation,
  InterviewPreparationTopic,
} from '../../types/career';

interface PreparationPlanProps {
  certifications: CertificationRecommendation[];
  interviewPreparation: InterviewPreparationTopic[];
  portfolioRecommendations: string[];
  careerGoal: string;
}

export const PreparationPlan: React.FC<PreparationPlanProps> = ({
  certifications,
  interviewPreparation,
  portfolioRecommendations,
  careerGoal,
}) => {
  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-3">
        <div className="flex items-center gap-2 text-xs font-semibold text-indigo-400">
          <Award className="w-4 h-4" />
          <span>Professional Market Readiness</span>
          <span aria-hidden="true">·</span>
          <span>Target: {careerGoal}</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Certifications, Interviews & Portfolio
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
          Comprehensive preparation guide to convert academic knowledge and projects into passed technical interviews and job offers.
        </p>
      </div>

      {/* Recommended Industry Certifications */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-indigo-400" />
            <h2 className="text-base font-bold text-white">Recommended Industry Certifications</h2>
          </div>
          <span className="text-xs text-slate-400">{certifications.length} High-Impact Certifications</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {certifications.map((cert, idx) => (
            <div
              key={idx}
              className="bg-slate-850/60 border border-slate-750 p-4 rounded-xl space-y-3 flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex justify-between items-start gap-2">
                  <span className="text-xs font-mono text-indigo-400 font-semibold">{cert.recommendedPhase}</span>
                  <span className="text-[11px] font-mono text-slate-300 bg-slate-800 px-2 py-0.5 rounded">
                    {cert.estimatedCost}
                  </span>
                </div>
                <h3 className="text-sm font-bold text-white leading-snug">{cert.name}</h3>
                <div className="text-xs text-slate-400">Issuer: {cert.issuer}</div>
              </div>

              <div className="pt-2 border-t border-slate-800 text-xs text-slate-300">
                <span className="font-semibold text-slate-200">Relevance:</span> {cert.relevance}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Interview Preparation Rounds */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-blue-400" />
            <h2 className="text-base font-bold text-white">Interview Preparation Matrix</h2>
          </div>
          <span className="text-xs text-slate-400">Junior Technical Loops</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {interviewPreparation.map((prep, idx) => (
            <div
              key={idx}
              className="bg-slate-850/60 border border-slate-750 p-5 rounded-xl space-y-3"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white">{prep.category} Round</h3>
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-slate-800 text-indigo-300">
                  {prep.topics.length} Key Topics
                </span>
              </div>

              {/* Topics */}
              <div className="flex flex-wrap gap-1.5">
                {prep.topics.map((t, tIdx) => (
                  <span
                    key={tIdx}
                    className="px-2 py-0.5 rounded text-[11px] bg-slate-800 text-slate-300 border border-slate-700/50"
                  >
                    {t}
                  </span>
                ))}
              </div>

              {/* Recommended Practice Method */}
              <div className="p-3 bg-slate-800/60 rounded-lg text-xs text-slate-300">
                <span className="font-semibold text-white">Recommended Practice: </span>
                {prep.recommendedPractice}
              </div>

              {/* Sample Questions */}
              {prep.sampleQuestions && prep.sampleQuestions.length > 0 && (
                <div className="space-y-1.5 pt-1">
                  <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                    Sample Technical Questions:
                  </div>
                  <ul className="space-y-1 text-xs text-slate-300">
                    {prep.sampleQuestions.map((q, qIdx) => (
                      <li key={qIdx} className="flex items-start gap-2">
                        <HelpCircle className="w-3.5 h-3.5 text-indigo-400 shrink-0 mt-0.5" />
                        <span>{q}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Portfolio Recommendations */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
        <div className="flex items-center gap-2">
          <CheckCircle className="w-5 h-5 text-emerald-400" />
          <h2 className="text-base font-bold text-white">Portfolio Polish Checklist</h2>
        </div>
        <p className="text-xs text-slate-400">
          Essential elements required on your public GitHub and developer profile before submitting job applications:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          {portfolioRecommendations.map((rec, idx) => (
            <div
              key={idx}
              className="p-3.5 bg-slate-850/60 border border-slate-750 rounded-xl flex items-start gap-3 text-xs text-slate-300"
            >
              <div className="w-5 h-5 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0 mt-0.5">
                {idx + 1}
              </div>
              <span className="leading-relaxed">{rec}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
