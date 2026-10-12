/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  X,
  ArrowRight,
  ArrowLeft,
  Check,
  Plus,
  Trash2,
  Sparkles,
  Info,
  BookOpen,
} from 'lucide-react';
import { AssessmentInput, SkillRating } from '../../types/career';
import { SAMPLE_PROFILES } from '../../data/sampleAssessments';

interface AssessmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (assessment: AssessmentInput) => void;
  initialData?: AssessmentInput | null;
}

const POPULAR_CAREERS = [
  'AI Engineer',
  'Data Scientist',
  'Full Stack Developer',
  'Cybersecurity Engineer',
  'Cloud / DevOps Engineer',
  'Machine Learning Researcher',
  'Mobile App Developer (iOS/Android)',
  'Backend Engineer',
];

const EDUCATION_LEVELS: AssessmentInput['educationLevel'][] = [
  'High School',
  'Associate Degree',
  'Bachelor Degree',
  'Master / PhD',
  'Self-Taught / Bootcamp',
];

const EXPERIENCE_LEVELS: AssessmentInput['experienceLevel'][] = [
  'Complete Beginner',
  'Some Basics / Hobbyist',
  'Intermediate Student',
  'Junior Developer / Career Switcher',
];

const LEARNING_STYLES: AssessmentInput['learningStyle'][] = [
  'Project-First',
  'Structured Theory & Exercises',
  'Video & Interactive',
  'Fast-Paced Bootcamp',
];

export const AssessmentModal: React.FC<AssessmentModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
}) => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const totalSteps = 5;

  // Form state
  const [desiredCareer, setDesiredCareer] = useState<string>(
    initialData?.desiredCareer || 'AI Engineer'
  );
  const [isCustomCareer, setIsCustomCareer] = useState<boolean>(
    initialData?.isCustomCareer || false
  );
  const [customCareerText, setCustomCareerText] = useState<string>(
    initialData?.isCustomCareer ? initialData.desiredCareer : ''
  );

  const [educationLevel, setEducationLevel] = useState<AssessmentInput['educationLevel']>(
    initialData?.educationLevel || 'Bachelor Degree'
  );
  const [fieldOfStudy, setFieldOfStudy] = useState<string>(
    initialData?.fieldOfStudy || 'Computer Science'
  );

  const [currentSkills, setCurrentSkills] = useState<SkillRating[]>(
    initialData?.currentSkills || [
      { skill: 'Python', level: 3 },
      { skill: 'Data Structures & Algorithms', level: 2 },
    ]
  );
  const [newSkillName, setNewSkillName] = useState<string>('');
  const [newSkillLevel, setNewSkillLevel] = useState<number>(2);

  const [experienceLevel, setExperienceLevel] = useState<AssessmentInput['experienceLevel']>(
    initialData?.experienceLevel || 'Intermediate Student'
  );

  const [weeklyHours, setWeeklyHours] = useState<number>(
    initialData?.weeklyHours || 12
  );
  const [targetMonths, setTargetMonths] = useState<number>(
    initialData?.targetMonths || 6
  );

  const [learningStyle, setLearningStyle] = useState<AssessmentInput['learningStyle']>(
    initialData?.learningStyle || 'Project-First'
  );
  const [preferredTechInput, setPreferredTechInput] = useState<string>(
    initialData?.preferredTechnologies?.join(', ') || 'PyTorch, Docker, FastAPI'
  );
  const [careerNotes, setCareerNotes] = useState<string>(
    initialData?.careerNotes || ''
  );

  const [validationError, setValidationError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleAddSkill = () => {
    if (!newSkillName.trim()) return;
    if (currentSkills.some((s) => s.skill.toLowerCase() === newSkillName.trim().toLowerCase())) {
      setValidationError(`Skill "${newSkillName}" is already listed.`);
      return;
    }
    setCurrentSkills([
      ...currentSkills,
      { skill: newSkillName.trim(), level: newSkillLevel },
    ]);
    setNewSkillName('');
    setNewSkillLevel(2);
    setValidationError(null);
  };

  const handleRemoveSkill = (index: number) => {
    setCurrentSkills(currentSkills.filter((_, i) => i !== index));
  };

  const handleUpdateSkillLevel = (index: number, level: number) => {
    const updated = [...currentSkills];
    updated[index].level = level;
    setCurrentSkills(updated);
  };

  const loadSample = (sampleIndex: number) => {
    const sample = SAMPLE_PROFILES[sampleIndex]?.data;
    if (!sample) return;
    setDesiredCareer(sample.desiredCareer);
    setIsCustomCareer(false);
    setEducationLevel(sample.educationLevel);
    setFieldOfStudy(sample.fieldOfStudy);
    setCurrentSkills(sample.currentSkills);
    setExperienceLevel(sample.experienceLevel);
    setWeeklyHours(sample.weeklyHours);
    setTargetMonths(sample.targetMonths);
    setLearningStyle(sample.learningStyle);
    setPreferredTechInput(sample.preferredTechnologies?.join(', ') || '');
    setCareerNotes(sample.careerNotes || '');
    setValidationError(null);
  };

  const validateStep = (step: number): boolean => {
    setValidationError(null);
    if (step === 1) {
      const career = isCustomCareer ? customCareerText.trim() : desiredCareer;
      if (!career) {
        setValidationError('Please select or specify your target career.');
        return false;
      }
    }
    if (step === 2) {
      if (!fieldOfStudy.trim()) {
        setValidationError('Please enter your field of study or background.');
        return false;
      }
    }
    if (step === 3) {
      if (currentSkills.length === 0) {
        setValidationError('Please add at least 1 current skill (or your primary interest).');
        return false;
      }
    }
    if (step === 4) {
      if (weeklyHours < 3 || weeklyHours > 60) {
        setValidationError('Weekly hours must be between 3 and 60 hours.');
        return false;
      }
      if (targetMonths < 1 || targetMonths > 36) {
        setValidationError('Target duration must be between 1 and 36 months.');
        return false;
      }
    }
    return true;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(totalSteps, prev + 1));
    }
  };

  const handlePrev = () => {
    setValidationError(null);
    setCurrentStep((prev) => Math.max(1, prev - 1));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep(currentStep)) return;

    const finalCareer = isCustomCareer ? customCareerText.trim() : desiredCareer;
    const preferredTechList = preferredTechInput
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    const assessment: AssessmentInput = {
      desiredCareer: finalCareer,
      isCustomCareer,
      educationLevel,
      fieldOfStudy: fieldOfStudy.trim(),
      currentSkills,
      experienceLevel,
      weeklyHours,
      targetMonths,
      preferredTechnologies: preferredTechList,
      learningStyle,
      careerNotes: careerNotes.trim(),
    };

    onSubmit(assessment);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl my-8">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/80">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Career Assessment</h2>
              <div className="text-xs text-slate-400">Step {currentStep} of {totalSteps}</div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Progress Bar */}
        <div className="w-full bg-slate-800 h-1">
          <div
            className="bg-indigo-500 h-1 transition-all duration-300"
            style={{ width: `${(currentStep / totalSteps) * 100}%` }}
          />
        </div>

        {/* Form Body */}
        <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
          {/* Quick preset profile filler */}
          {currentStep === 1 && (
            <div className="p-3 bg-indigo-950/30 border border-indigo-800/40 rounded-xl flex items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2 text-indigo-300">
                <BookOpen className="w-4 h-4 shrink-0" />
                <span>Want to test quickly? Fill with a preset profile:</span>
              </div>
              <div className="flex gap-1.5 shrink-0">
                <button
                  type="button"
                  onClick={() => loadSample(0)}
                  className="px-2 py-1 bg-indigo-600 hover:bg-indigo-500 text-white rounded font-medium text-[11px] cursor-pointer"
                >
                  AI Eng
                </button>
                <button
                  type="button"
                  onClick={() => loadSample(1)}
                  className="px-2 py-1 bg-indigo-600 hover:bg-indigo-500 text-white rounded font-medium text-[11px] cursor-pointer"
                >
                  Full Stack
                </button>
                <button
                  type="button"
                  onClick={() => loadSample(2)}
                  className="px-2 py-1 bg-indigo-600 hover:bg-indigo-500 text-white rounded font-medium text-[11px] cursor-pointer"
                >
                  Data Sci
                </button>
              </div>
            </div>
          )}

          {validationError && (
            <div className="p-3 bg-red-950/40 border border-red-800/50 rounded-xl text-xs text-red-300 flex items-center gap-2">
              <Info className="w-4 h-4 shrink-0 text-red-400" />
              <span>{validationError}</span>
            </div>
          )}

          {/* Step 1: Desired Career */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-white">Target Career Goal</label>
                <p className="text-xs text-slate-400 mt-0.5">Select a primary path or specify a custom role.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {POPULAR_CAREERS.map((career) => (
                  <button
                    key={career}
                    type="button"
                    onClick={() => {
                      setDesiredCareer(career);
                      setIsCustomCareer(false);
                    }}
                    className={`text-left px-3.5 py-2.5 rounded-xl border text-xs font-medium transition-all cursor-pointer ${
                      !isCustomCareer && desiredCareer === career
                        ? 'bg-indigo-600/20 border-indigo-500 text-indigo-200 shadow-sm shadow-indigo-600/20'
                        : 'bg-slate-800/50 border-slate-750 text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    {career}
                  </button>
                ))}
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => setIsCustomCareer(true)}
                  className={`text-left w-full px-3.5 py-2.5 rounded-xl border text-xs font-medium transition-all cursor-pointer ${
                    isCustomCareer
                      ? 'bg-indigo-600/20 border-indigo-500 text-indigo-200'
                      : 'bg-slate-800/40 border-slate-750 text-slate-400 hover:bg-slate-800'
                  }`}
                >
                  + Specify Custom Career Role
                </button>
              </div>

              {isCustomCareer && (
                <div className="space-y-1 pt-1">
                  <label className="text-xs text-slate-300 font-medium">Custom Career Title</label>
                  <input
                    type="text"
                    value={customCareerText}
                    onChange={(e) => setCustomCareerText(e.target.value)}
                    placeholder="e.g. Quantitative Developer, Embedded IoT Engineer"
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-800 border border-slate-700 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              )}
            </div>
          )}

          {/* Step 2: Education & Experience Level */}
          {currentStep === 2 && (
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-white">Educational Background</label>
                <p className="text-xs text-slate-400 mt-0.5">Your highest completed or currently enrolled program.</p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {EDUCATION_LEVELS.map((lvl) => (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() => setEducationLevel(lvl)}
                    className={`text-center px-3 py-2 rounded-xl border text-xs font-medium transition-all cursor-pointer ${
                      educationLevel === lvl
                        ? 'bg-indigo-600/20 border-indigo-500 text-indigo-200'
                        : 'bg-slate-800/50 border-slate-750 text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    {lvl}
                  </button>
                ))}
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-white">Current Field of Study or Prior Domain</label>
                <input
                  type="text"
                  value={fieldOfStudy}
                  onChange={(e) => setFieldOfStudy(e.target.value)}
                  placeholder="e.g. Computer Science, Mechanical Engineering, Business, High School"
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-800 border border-slate-700 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-semibold text-white">Current Experience Level</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {EXPERIENCE_LEVELS.map((exp) => (
                    <button
                      key={exp}
                      type="button"
                      onClick={() => setExperienceLevel(exp)}
                      className={`text-left px-3.5 py-2 rounded-xl border text-xs font-medium transition-all cursor-pointer ${
                        experienceLevel === exp
                          ? 'bg-indigo-600/20 border-indigo-500 text-indigo-200'
                          : 'bg-slate-800/50 border-slate-750 text-slate-300 hover:bg-slate-800'
                      }`}
                    >
                      {exp}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Current Skills & Proficiency Ratings */}
          {currentStep === 3 && (
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-white">Current Skills & Baseline</label>
                <p className="text-xs text-slate-400 mt-0.5">
                  Rate your current proficiency on our documented 1-5 scale (1: Novice, 3: Competent, 5: Mastery).
                </p>
              </div>

              {/* Skills list */}
              <div className="space-y-2.5">
                {currentSkills.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-3 bg-slate-800/60 border border-slate-750 rounded-xl gap-2"
                  >
                    <div className="text-xs font-semibold text-white truncate max-w-xs">{item.skill}</div>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((num) => (
                          <button
                            key={num}
                            type="button"
                            onClick={() => handleUpdateSkillLevel(idx, num)}
                            className={`w-6 h-6 rounded-md text-xs font-mono font-medium transition-colors cursor-pointer ${
                              item.level >= num
                                ? 'bg-indigo-600 text-white'
                                : 'bg-slate-700/60 text-slate-400 hover:bg-slate-700'
                            }`}
                          >
                            {num}
                          </button>
                        ))}
                      </div>
                      <span className="text-[11px] text-slate-400 w-12 text-right font-mono">
                        Lvl {item.level}/5
                      </span>
                      <button
                        type="button"
                        onClick={() => handleRemoveSkill(idx)}
                        className="text-slate-500 hover:text-red-400 p-1 transition-colors"
                        aria-label="Remove skill"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Add New Skill Input */}
              <div className="p-3 bg-slate-800/30 border border-slate-750 rounded-xl space-y-3">
                <div className="text-xs font-semibold text-slate-300">Add Skill or Technology</div>
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="text"
                    value={newSkillName}
                    onChange={(e) => setNewSkillName(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddSkill();
                      }
                    }}
                    placeholder="e.g. JavaScript, SQL, Statistics, Git"
                    className="flex-1 px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                  />
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-400">Level:</span>
                    <select
                      value={newSkillLevel}
                      onChange={(e) => setNewSkillLevel(parseInt(e.target.value, 10))}
                      className="px-2 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-xs text-white"
                    >
                      <option value={1}>1 - Novice</option>
                      <option value={2}>2 - Elementary</option>
                      <option value={3}>3 - Competent</option>
                      <option value={4}>4 - Proficient</option>
                      <option value={5}>5 - Mastery</option>
                    </select>
                    <button
                      type="button"
                      onClick={handleAddSkill}
                      className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-medium inline-flex items-center gap-1 cursor-pointer"
                    >
                      <Plus className="w-3 h-3" />
                      Add
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Time Commitment & Learning Preferences */}
          {currentStep === 4 && (
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-white">Time Commitment & Preferences</label>
                <p className="text-xs text-slate-400 mt-0.5">Realistic time allocation prevents burnout and ensures sustainable milestones.</p>
              </div>

              {/* Weekly Hours Slider */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="font-semibold text-white">Available Study Time Per Week</span>
                  <span className="font-mono text-indigo-300 font-semibold tabular-nums">{weeklyHours} hours / week</span>
                </div>
                <input
                  type="range"
                  min={3}
                  max={40}
                  step={1}
                  value={weeklyHours}
                  onChange={(e) => setWeeklyHours(parseInt(e.target.value, 10))}
                  className="w-full accent-indigo-500"
                />
                <div className="flex justify-between text-[11px] text-slate-500">
                  <span>3h (Casual)</span>
                  <span>15h (Part-time)</span>
                  <span>40h (Full-time Bootcamp)</span>
                </div>
              </div>

              {/* Target Months Slider */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="font-semibold text-white">Target Preparation Horizon</span>
                  <span className="font-mono text-indigo-300 font-semibold tabular-nums">{targetMonths} months (~{targetMonths * 4} weeks)</span>
                </div>
                <input
                  type="range"
                  min={2}
                  max={18}
                  step={1}
                  value={targetMonths}
                  onChange={(e) => setTargetMonths(parseInt(e.target.value, 10))}
                  className="w-full accent-indigo-500"
                />
                <div className="flex justify-between text-[11px] text-slate-500">
                  <span>2 months (Sprint)</span>
                  <span>6 months (Standard)</span>
                  <span>18 months (Comprehensive)</span>
                </div>
              </div>

              {/* Learning Style */}
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-white">Preferred Learning Style</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {LEARNING_STYLES.map((style) => (
                    <button
                      key={style}
                      type="button"
                      onClick={() => setLearningStyle(style)}
                      className={`text-left px-3 py-2 rounded-xl border text-xs font-medium transition-all cursor-pointer ${
                        learningStyle === style
                          ? 'bg-indigo-600/20 border-indigo-500 text-indigo-200'
                          : 'bg-slate-800/50 border-slate-750 text-slate-300 hover:bg-slate-800'
                      }`}
                    >
                      {style}
                    </button>
                  ))}
                </div>
              </div>

              {/* Preferred Technologies */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-white">Preferred Frameworks or Tools (Optional)</label>
                <input
                  type="text"
                  value={preferredTechInput}
                  onChange={(e) => setPreferredTechInput(e.target.value)}
                  placeholder="e.g. PyTorch, React, Docker, FastAPI"
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>
          )}

          {/* Step 5: Review & Submit */}
          {currentStep === 5 && (
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-white">Review Your Assessment Profile</label>
                <p className="text-xs text-slate-400 mt-0.5">Verify your details before synthesizing your custom AI roadmap.</p>
              </div>

              <div className="bg-slate-800/60 border border-slate-750 rounded-xl p-4 space-y-3 text-xs">
                <div className="flex justify-between py-1 border-b border-slate-700/60">
                  <span className="text-slate-400">Target Career:</span>
                  <span className="font-semibold text-white">{isCustomCareer ? customCareerText : desiredCareer}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-700/60">
                  <span className="text-slate-400">Education & Field:</span>
                  <span className="font-semibold text-white">{educationLevel} · {fieldOfStudy}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-700/60">
                  <span className="text-slate-400">Experience Baseline:</span>
                  <span className="font-semibold text-white">{experienceLevel}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-700/60">
                  <span className="text-slate-400">Commitment & Horizon:</span>
                  <span className="font-mono text-indigo-300 font-semibold">{weeklyHours}h/week · {targetMonths} months</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-700/60">
                  <span className="text-slate-400">Learning Style:</span>
                  <span className="font-semibold text-white">{learningStyle}</span>
                </div>
                <div>
                  <span className="text-slate-400 block mb-1">Declared Skills:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {currentSkills.map((s, idx) => (
                      <span key={idx} className="bg-slate-700/60 px-2 py-0.5 rounded text-[11px] text-slate-200 font-mono">
                        {s.skill} (L{s.level})
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-white">Specific Goals or Notes (Optional)</label>
                <textarea
                  value={careerNotes}
                  onChange={(e) => setCareerNotes(e.target.value)}
                  placeholder="e.g. Want to focus on generative AI and RAG pipelines; aiming for summer internships."
                  rows={2}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>
          )}
        </div>

        {/* Footer Controls */}
        <div className="px-6 py-4 border-t border-slate-800 bg-slate-900/90 flex items-center justify-between">
          {currentStep > 1 ? (
            <button
              type="button"
              onClick={handlePrev}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-750 rounded-lg transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>
          ) : (
            <div />
          )}

          {currentStep < totalSteps ? (
            <button
              type="button"
              onClick={handleNext}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg shadow-sm shadow-indigo-600/30 transition-all cursor-pointer"
            >
              <span>Continue</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              className="inline-flex items-center gap-2 px-5 py-2 text-xs font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 rounded-lg shadow-md shadow-indigo-600/30 transition-all cursor-pointer active:scale-98"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Generate My Roadmap</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
