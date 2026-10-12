/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { LandingHero } from './components/landing/LandingHero';
import { AssessmentModal } from './components/assessment/AssessmentModal';
import { RoadmapGenerationLoader } from './components/roadmap/RoadmapGenerationLoader';
import { DashboardOverview } from './components/roadmap/DashboardOverview';
import { VisualRoadmapTimeline } from './components/roadmap/VisualRoadmapTimeline';
import { SkillGapAnalysis } from './components/roadmap/SkillGapAnalysis';
import { ProjectRecommendations } from './components/roadmap/ProjectRecommendations';
import { PreparationPlan } from './components/roadmap/PreparationPlan';
import { CareerComparisonView } from './components/comparison/CareerComparisonView';
import { ConfirmationModal } from './components/common/ConfirmationModal';
import { ApiKeyNotice } from './components/common/ApiKeyNotice';
import { StorageService } from './services/storage';
import { ApiService, HealthResponse } from './services/api';
import { AssessmentInput, RoadmapOutput, MilestoneStatus } from './types/career';
import { calculateRoadmapProgress } from './utils/progressCalculator';
import { AlertCircle, RefreshCw, Sparkles } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('home');
  const [roadmap, setRoadmap] = useState<RoadmapOutput | null>(null);
  const [lastAssessment, setLastAssessment] = useState<AssessmentInput | null>(null);
  const [progressMap, setProgressMap] = useState<Record<string, MilestoneStatus>>({});
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  // Health and API state
  const [health, setHealth] = useState<HealthResponse>({
    status: 'checking',
    hasGroqKey: false,
    model: 'llama-3.3-70b-versatile',
    timestamp: '',
  });

  // Modal and loading states
  const [isAssessmentOpen, setIsAssessmentOpen] = useState<boolean>(false);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [generatingGoal, setGeneratingGoal] = useState<string>('AI Engineer');
  const [generationError, setGenerationError] = useState<string | null>(null);
  const [confirmRegenerateOpen, setConfirmRegenerateOpen] = useState<boolean>(false);
  const [assessmentPreloadCareer, setAssessmentPreloadCareer] = useState<string | null>(null);

  // Initialize data on mount
  useEffect(() => {
    // Check health of backend & Groq key
    ApiService.checkHealth().then((res) => setHealth(res));

    // Load persisted state from LocalStorage
    const savedRoadmap = StorageService.getCurrentRoadmap();
    const savedAssessment = StorageService.getLastAssessment();
    const savedProgress = StorageService.getMilestoneProgress();

    if (savedRoadmap) {
      setRoadmap(savedRoadmap);
      setProgressMap(savedProgress);
      setActiveTab('dashboard');
    }
    if (savedAssessment) {
      setLastAssessment(savedAssessment);
    }
  }, []);

  // Compute live progress summary
  const progressSummary = useMemo(() => {
    return calculateRoadmapProgress(roadmap, progressMap);
  }, [roadmap, progressMap]);

  // Handle milestone status toggle
  const handleUpdateMilestoneStatus = (milestoneId: string, status: MilestoneStatus) => {
    const updated = StorageService.setMilestoneStatus(milestoneId, status);
    setProgressMap(updated);
  };

  // Submit assessment and generate roadmap
  const handleAssessmentSubmit = async (assessment: AssessmentInput) => {
    setIsAssessmentOpen(false);
    setIsGenerating(true);
    setGeneratingGoal(assessment.desiredCareer);
    setGenerationError(null);

    try {
      const response = await ApiService.generateRoadmap(assessment);
      if (response && response.data) {
        setRoadmap(response.data);
        setLastAssessment(assessment);
        StorageService.saveCurrentRoadmap(response.data);
        StorageService.saveLastAssessment(assessment);
        
        // Reset progress map for new career roadmap
        const initialProgress: Record<string, MilestoneStatus> = {};
        StorageService.saveMilestoneProgress(initialProgress);
        setProgressMap(initialProgress);

        setActiveTab('dashboard');
      } else {
        throw new Error('Received unexpected empty roadmap data');
      }
    } catch (err: any) {
      console.error('Roadmap generation error:', err);
      setGenerationError(err.message || 'Failed to generate career roadmap. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  // Select sample profile from landing page for instant test
  const handleSelectSampleProfile = (sample: AssessmentInput) => {
    handleAssessmentSubmit(sample);
  };

  // Preload career into assessment modal from comparison view
  const handleStartAssessmentForCareer = (careerTitle: string) => {
    setAssessmentPreloadCareer(careerTitle);
    setIsAssessmentOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Top Banner Notice regarding Groq Key & Engine status */}
      <ApiKeyNotice hasGroqKey={health.hasGroqKey} model={health.model} />

      {/* Strict 3-zone Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenAssessment={() => {
          setAssessmentPreloadCareer(null);
          setIsAssessmentOpen(true);
        }}
        hasRoadmap={roadmap !== null}
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
      />

      {/* Main Viewport Container */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        {/* Desktop Sidebar (visible when roadmap exists and not on home) */}
        {roadmap && activeTab !== 'home' && (
          <div className="hidden lg:block shrink-0">
            <Sidebar
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              roadmap={roadmap}
              progress={progressSummary}
              onOpenAssessment={() => {
                setAssessmentPreloadCareer(null);
                setIsAssessmentOpen(true);
              }}
              onRegenerate={() => setConfirmRegenerateOpen(true)}
            />
          </div>
        )}

        {/* Content Area */}
        <main className="flex-1 min-w-0 px-4 sm:px-6 lg:px-8 pt-6 pb-16">
          {/* Global Generation Error Banner */}
          {generationError && (
            <div className="mb-6 p-4 bg-red-950/60 border border-red-800 rounded-xl flex items-start justify-between gap-3 text-xs text-red-200">
              <div className="flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white block">Roadmap Generation Notice:</strong>
                  <span>{generationError}</span>
                </div>
              </div>
              <button
                onClick={() => {
                  if (lastAssessment) handleAssessmentSubmit(lastAssessment);
                  else setIsAssessmentOpen(true);
                }}
                className="px-3 py-1.5 bg-red-850 hover:bg-red-800 border border-red-700 rounded-lg text-white font-medium shrink-0 flex items-center gap-1 cursor-pointer"
              >
                <RefreshCw className="w-3 h-3" />
                Retry
              </button>
            </div>
          )}

          {/* View Routing */}
          {activeTab === 'home' && (
            <LandingHero
              onStartAssessment={() => {
                setAssessmentPreloadCareer(null);
                setIsAssessmentOpen(true);
              }}
              onSelectSample={handleSelectSampleProfile}
              onExploreComparison={() => setActiveTab('comparison')}
            />
          )}

          {activeTab === 'dashboard' && roadmap && (
            <DashboardOverview
              roadmap={roadmap}
              progress={progressSummary}
              onNavigateTab={setActiveTab}
              onRegenerate={() => setConfirmRegenerateOpen(true)}
            />
          )}

          {activeTab === 'timeline' && roadmap && (
            <VisualRoadmapTimeline
              roadmap={roadmap}
              progressMap={progressMap}
              onUpdateStatus={handleUpdateMilestoneStatus}
              progressSummary={progressSummary}
            />
          )}

          {activeTab === 'skills' && roadmap && (
            <SkillGapAnalysis
              skillGaps={roadmap.skillGaps}
              careerGoal={roadmap.careerGoal}
            />
          )}

          {activeTab === 'projects' && roadmap && (
            <ProjectRecommendations
              projects={roadmap.projects}
              careerGoal={roadmap.careerGoal}
            />
          )}

          {activeTab === 'prep' && roadmap && (
            <PreparationPlan
              certifications={roadmap.certifications}
              interviewPreparation={roadmap.interviewPreparation}
              portfolioRecommendations={roadmap.portfolioRecommendations}
              careerGoal={roadmap.careerGoal}
            />
          )}

          {activeTab === 'comparison' && (
            <CareerComparisonView
              onStartAssessmentForCareer={handleStartAssessmentForCareer}
            />
          )}
        </main>
      </div>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-6 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-400">CareerPath AI</span>
            <span>·</span>
            <span>LLM-Powered Career Roadmap Generator</span>
          </div>
          <div className="flex items-center gap-4 text-[11px]">
            <span>Groq Accelerated Inference</span>
            <span>·</span>
            <span>Structured JSON Validation</span>
            <span>·</span>
            <span>LocalStorage Persistence</span>
          </div>
        </div>
      </footer>

      {/* Multi-Step Assessment Modal */}
      <AssessmentModal
        isOpen={isAssessmentOpen}
        onClose={() => setIsAssessmentOpen(false)}
        onSubmit={handleAssessmentSubmit}
        initialData={
          assessmentPreloadCareer
            ? {
                desiredCareer: assessmentPreloadCareer,
                isCustomCareer: false,
                educationLevel: 'Bachelor Degree',
                fieldOfStudy: 'Computer Science',
                currentSkills: [{ skill: 'Core Programming', level: 2 }],
                experienceLevel: 'Some Basics / Hobbyist',
                weeklyHours: 12,
                targetMonths: 6,
                learningStyle: 'Project-First',
              }
            : lastAssessment
        }
      />

      {/* Generating Progress Modal */}
      {isGenerating && <RoadmapGenerationLoader careerGoal={generatingGoal} />}

      {/* Regenerate Warning Modal */}
      <ConfirmationModal
        isOpen={confirmRegenerateOpen}
        onClose={() => setConfirmRegenerateOpen(false)}
        onConfirm={() => {
          if (lastAssessment) {
            handleAssessmentSubmit(lastAssessment);
          } else {
            setIsAssessmentOpen(true);
          }
        }}
        title="Regenerate Career Roadmap?"
        message="Regenerating will create a refreshed curriculum from the AI model and reset milestone completion tracking for your current roadmap. Do you want to proceed?"
        confirmLabel="Regenerate Plan"
      />
    </div>
  );
}
