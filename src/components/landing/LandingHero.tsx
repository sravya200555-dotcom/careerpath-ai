/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import {
  Compass,
  BarChart3,
  GitBranch,
  Layers,
  ArrowRight,
  Target,
  CheckCircle2,
  Cpu,
} from 'lucide-react';
import { SAMPLE_PROFILES } from '../../data/sampleAssessments';
import { AssessmentInput } from '../../types/career';

interface LandingHeroProps {
  onStartAssessment: () => void;
  onSelectSample: (profile: AssessmentInput) => void;
  onExploreComparison: () => void;
}

export const LandingHero: React.FC<LandingHeroProps> = ({
  onStartAssessment,
  onSelectSample,
  onExploreComparison,
}) => {
  return (
    <div className="space-y-20 pb-20">
      {/* Hero Section */}
      <section className="relative pt-12 md:pt-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Headline and Call-to-Action */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 text-xs font-semibold text-indigo-400">
              <span className="w-2 h-2 rounded-full bg-indigo-400" />
              <span>Structured AI Career Planning</span>
              <span aria-hidden="true">·</span>
              <span>Groq High-Speed Inference</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
              Turn Your Career Goal <br className="hidden sm:inline" />
              Into a <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent">Clear Roadmap</span>
            </h1>

            <p className="text-base sm:text-lg text-slate-300 max-w-2xl leading-relaxed">
              Stop guessing what to learn next. CareerPath AI evaluates your current background, calculates your exact skill gaps, and synthesizes a realistic, week-by-week learning roadmap with real portfolio projects and milestone tracking.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={onStartAssessment}
                className="inline-flex items-center gap-2.5 px-6 py-3.5 text-base font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl shadow-lg shadow-indigo-600/30 transition-all cursor-pointer active:scale-98"
              >
                <span>Create My Roadmap</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={onExploreComparison}
                className="inline-flex items-center gap-2 px-5 py-3.5 text-base font-semibold text-slate-200 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-750 rounded-xl transition-all cursor-pointer"
              >
                <Layers className="w-4 h-4 text-slate-400" />
                <span>Compare Careers</span>
              </button>
            </div>

            {/* Quick Proof Metrics */}
            <div className="pt-6 border-t border-slate-800/80 grid grid-cols-3 gap-6 max-w-lg">
              <div>
                <div className="text-2xl font-bold font-mono text-white tabular-nums">100%</div>
                <div className="text-xs text-slate-400 mt-0.5">Objective Curriculum</div>
              </div>
              <div>
                <div className="text-2xl font-bold font-mono text-white tabular-nums">1 - 5</div>
                <div className="text-xs text-slate-400 mt-0.5">Proficiency Metric Scale</div>
              </div>
              <div>
                <div className="text-2xl font-bold font-mono text-white tabular-nums">0 Chat</div>
                <div className="text-xs text-slate-400 mt-0.5">Structured Reports Only</div>
              </div>
            </div>
          </div>

          {/* Right Column: Visual Learning Roadmap Illustration */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-2xl overflow-hidden border border-slate-800/90 shadow-2xl bg-slate-900 group">
              <img
                src="/src/assets/images/career_roadmap_hero_1791823662021.jpg"
                alt="CareerPath AI Visual Learning Roadmap Network"
                className="w-full h-auto object-cover group-hover:scale-102 transition-transform duration-700"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent pointer-events-none" />
              <div className="absolute bottom-4 left-4 right-4 p-3 bg-slate-900/90 backdrop-blur-md rounded-xl border border-slate-800 flex items-center justify-between text-xs text-slate-300">
                <div className="flex items-center gap-2">
                  <GitBranch className="w-4 h-4 text-indigo-400" />
                  <span className="font-semibold text-white">Dynamic Phased Timeline</span>
                </div>
                <span className="text-slate-400">Milestone Driven</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Instant Test Profiles (For Quick 1-Click Evaluation) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <div className="text-xs font-semibold text-indigo-400 uppercase tracking-wider">Fast Track Demo</div>
              <h2 className="text-xl font-bold text-white mt-1">Try With a Pre-Configured Student Profile</h2>
              <p className="text-sm text-slate-400 mt-0.5">Click any profile below to instantly generate a tailored roadmap without filling the form.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {SAMPLE_PROFILES.map((profile) => (
              <button
                key={profile.id}
                onClick={() => onSelectSample(profile.data)}
                className="text-left p-4 rounded-xl bg-slate-850 hover:bg-slate-800/80 border border-slate-750 hover:border-indigo-500/40 transition-all group cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-indigo-400 group-hover:text-indigo-300">{profile.data.desiredCareer}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-indigo-400 group-hover:translate-x-0.5 transition-all" />
                </div>
                <div className="text-sm font-semibold text-white mt-1 group-hover:text-white">{profile.label}</div>
                <p className="text-xs text-slate-400 mt-2 line-clamp-2 leading-relaxed">{profile.summary}</p>
                <div className="mt-3 flex items-center gap-2 text-[11px] text-slate-400 font-mono">
                  <span>{profile.data.weeklyHours}h/wk</span>
                  <span>·</span>
                  <span>{profile.data.targetMonths} mos</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Feature Pillar Cards */}
      <section id="how-it-works" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="text-xs font-semibold text-indigo-400 uppercase tracking-wider">Comprehensive Architecture</div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-2">
            Everything You Need To Achieve Your Career Transition
          </h2>
          <p className="text-sm sm:text-base text-slate-400 mt-3">
            Not a chat stream. CareerPath AI delivers structured, auditable plans designed around cognitive load and industry job requirements.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-6 hover:border-slate-700 transition-colors">
            <div className="w-10 h-10 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 mb-4">
              <BarChart3 className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Skill Gap Analysis</h3>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              Objective 1-5 proficiency comparisons between your verified current capabilities and actual junior requirements.
            </p>
            <div className="mt-4 text-xs font-medium text-blue-400 flex items-center gap-1">
              <span>Interactive Recharts</span>
            </div>
          </div>

          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-6 hover:border-slate-700 transition-colors">
            <div className="w-10 h-10 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 mb-4">
              <GitBranch className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Visual Phased Timeline</h3>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              Logical milestones ordered by prerequisites, featuring learning outcomes, estimated hours, and curated free resources.
            </p>
            <div className="mt-4 text-xs font-medium text-indigo-400 flex items-center gap-1">
              <span>Progress Tracking</span>
            </div>
          </div>

          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-6 hover:border-slate-700 transition-colors">
            <div className="w-10 h-10 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 mb-4">
              <Target className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Portfolio Projects</h3>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              Industry-grade project blueprints with real problem statements, required tech stacks, and concrete deliverables.
            </p>
            <div className="mt-4 text-xs font-medium text-purple-400 flex items-center gap-1">
              <span>Beginner to Advanced</span>
            </div>
          </div>

          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-6 hover:border-slate-700 transition-colors">
            <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-4">
              <Compass className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Career Comparison</h3>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              Compare AI Engineer, Data Scientist, Full Stack, and Security Engineer across difficulty, timelines, and salaries.
            </p>
            <div className="mt-4 text-xs font-medium text-emerald-400 flex items-center gap-1">
              <span>Side-by-Side Matrix</span>
            </div>
          </div>
        </div>
      </section>

      {/* Methodology & Transparency */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-slate-900 to-indigo-950/40 border border-slate-800 rounded-2xl p-8 sm:p-10">
          <div className="max-w-3xl">
            <div className="text-xs font-semibold text-indigo-400 uppercase tracking-wider">Methodology & Transparency</div>
            <h2 className="text-2xl font-bold text-white mt-1">Designed Against AI Hallucinations</h2>
            <p className="text-sm text-slate-300 mt-3 leading-relaxed">
              Standard AI chatbots offer generic advice without understanding learning prerequisites. CareerPath AI uses structured system prompting, explicit proficiency frameworks, and mathematical readiness modeling. We do not invent test scores or make unrealistic promises.
            </p>
            <div className="mt-6 flex flex-wrap gap-4 text-xs text-slate-300">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Explicit 1-5 proficiency scale</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Transparent scoring weights</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Prerequisite dependency ordering</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
