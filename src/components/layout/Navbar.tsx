/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Sparkles, Menu, X } from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenAssessment: () => void;
  hasRoadmap: boolean;
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onOpenAssessment,
  hasRoadmap,
  mobileMenuOpen,
  setMobileMenuOpen,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-md border-b border-slate-800/80 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-8 h-16">
          {/* Zone 1: Single Brand Wordmark Element */}
          <button
            onClick={() => setActiveTab(hasRoadmap ? 'dashboard' : 'home')}
            className="flex items-center gap-2.5 text-left group focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded-lg p-1"
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-600 to-blue-500 flex items-center justify-center text-white shadow-sm shadow-indigo-500/20">
              <Sparkles className="w-4 h-4" />
            </div>
            <span className="text-lg font-bold tracking-tight text-white whitespace-nowrap shrink-0">
              CareerPath <span className="text-indigo-400">AI</span>
            </span>
          </button>

          {/* Zone 2: 4-5 Clean Single-Line Nav Links */}
          <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-300">
            {hasRoadmap ? (
              <>
                <button
                  onClick={() => setActiveTab('dashboard')}
                  className={`hover:text-white transition-colors whitespace-nowrap shrink-0 py-1 ${
                    activeTab === 'dashboard' ? 'text-white border-b-2 border-indigo-500 font-semibold' : ''
                  }`}
                >
                  Dashboard
                </button>
                <button
                  onClick={() => setActiveTab('timeline')}
                  className={`hover:text-white transition-colors whitespace-nowrap shrink-0 py-1 ${
                    activeTab === 'timeline' ? 'text-white border-b-2 border-indigo-500 font-semibold' : ''
                  }`}
                >
                  Visual Roadmap
                </button>
                <button
                  onClick={() => setActiveTab('skills')}
                  className={`hover:text-white transition-colors whitespace-nowrap shrink-0 py-1 ${
                    activeTab === 'skills' ? 'text-white border-b-2 border-indigo-500 font-semibold' : ''
                  }`}
                >
                  Skill Gap Analysis
                </button>
                <button
                  onClick={() => setActiveTab('projects')}
                  className={`hover:text-white transition-colors whitespace-nowrap shrink-0 py-1 ${
                    activeTab === 'projects' ? 'text-white border-b-2 border-indigo-500 font-semibold' : ''
                  }`}
                >
                  Projects & Prep
                </button>
                <button
                  onClick={() => setActiveTab('comparison')}
                  className={`hover:text-white transition-colors whitespace-nowrap shrink-0 py-1 ${
                    activeTab === 'comparison' ? 'text-white border-b-2 border-indigo-500 font-semibold' : ''
                  }`}
                >
                  Career Comparison
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => setActiveTab('home')}
                  className={`hover:text-white transition-colors whitespace-nowrap shrink-0 py-1 ${
                    activeTab === 'home' ? 'text-white border-b-2 border-indigo-500 font-semibold' : ''
                  }`}
                >
                  Overview
                </button>
                <button
                  onClick={() => setActiveTab('comparison')}
                  className={`hover:text-white transition-colors whitespace-nowrap shrink-0 py-1 ${
                    activeTab === 'comparison' ? 'text-white border-b-2 border-indigo-500 font-semibold' : ''
                  }`}
                >
                  Career Comparison
                </button>
                <a
                  href="#how-it-works"
                  onClick={() => {
                    setActiveTab('home');
                    setTimeout(() => {
                      document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' });
                    }, 50);
                  }}
                  className="hover:text-white transition-colors whitespace-nowrap shrink-0 py-1"
                >
                  Methodology
                </a>
              </>
            )}
          </nav>

          {/* Zone 3: 1 Primary Action */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={onOpenAssessment}
              className="px-4 py-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg shadow-sm shadow-indigo-600/30 transition-all whitespace-nowrap shrink-0 cursor-pointer active:scale-98 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400"
            >
              {hasRoadmap ? 'New Assessment' : 'Create My Roadmap'}
            </button>

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 focus:outline-none"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-800 bg-slate-900 px-4 pt-2 pb-4 space-y-1">
          {hasRoadmap ? (
            <>
              <button
                onClick={() => { setActiveTab('dashboard'); setMobileMenuOpen(false); }}
                className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium ${activeTab === 'dashboard' ? 'bg-indigo-600/20 text-indigo-300' : 'text-slate-300 hover:bg-slate-800'}`}
              >
                Dashboard
              </button>
              <button
                onClick={() => { setActiveTab('timeline'); setMobileMenuOpen(false); }}
                className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium ${activeTab === 'timeline' ? 'bg-indigo-600/20 text-indigo-300' : 'text-slate-300 hover:bg-slate-800'}`}
              >
                Visual Roadmap
              </button>
              <button
                onClick={() => { setActiveTab('skills'); setMobileMenuOpen(false); }}
                className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium ${activeTab === 'skills' ? 'bg-indigo-600/20 text-indigo-300' : 'text-slate-300 hover:bg-slate-800'}`}
              >
                Skill Gap Analysis
              </button>
              <button
                onClick={() => { setActiveTab('projects'); setMobileMenuOpen(false); }}
                className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium ${activeTab === 'projects' ? 'bg-indigo-600/20 text-indigo-300' : 'text-slate-300 hover:bg-slate-800'}`}
              >
                Projects & Prep
              </button>
              <button
                onClick={() => { setActiveTab('comparison'); setMobileMenuOpen(false); }}
                className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium ${activeTab === 'comparison' ? 'bg-indigo-600/20 text-indigo-300' : 'text-slate-300 hover:bg-slate-800'}`}
              >
                Career Comparison
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => { setActiveTab('home'); setMobileMenuOpen(false); }}
                className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium ${activeTab === 'home' ? 'bg-indigo-600/20 text-indigo-300' : 'text-slate-300 hover:bg-slate-800'}`}
              >
                Overview
              </button>
              <button
                onClick={() => { setActiveTab('comparison'); setMobileMenuOpen(false); }}
                className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium ${activeTab === 'comparison' ? 'bg-indigo-600/20 text-indigo-300' : 'text-slate-300 hover:bg-slate-800'}`}
              >
                Career Comparison
              </button>
            </>
          )}
        </div>
      )}
    </header>
  );
};
