import React, { useState } from 'react';
import { 
  PlusIcon, 
  TrashIcon,
  BookOpenIcon,
  UsersIcon,
  AcademicCapIcon
} from '@heroicons/react/24/outline';
import { useTheme } from '../../../context/ThemeContext';

const PlanYourCourse = ({ data, updateData, onNext, onSave }) => {
  const [loading, setSaving] = useState(false);
  const { isDarkMode } = useTheme();

  // Safely get arrays with defaults
  const learningOutcomes = Array.isArray(data?.learningOutcomes) && data.learningOutcomes.length > 0 
    ? data.learningOutcomes 
    : [''];
  const prerequisites = Array.isArray(data?.prerequisites) && data.prerequisites.length > 0
    ? data.prerequisites
    : [''];

  const addLearningOutcome = () => {
    // ✅ SAFE: learningOutcomes already validated above, but extra safety
    const safeOutcomes = Array.isArray(learningOutcomes) ? learningOutcomes : [''];
    const newOutcomes = [...safeOutcomes, ''];
    updateData({ learningOutcomes: newOutcomes });
  };

  const removeLearningOutcome = (index) => {
    const safeOutcomes = Array.isArray(learningOutcomes) ? learningOutcomes : [''];
    if (safeOutcomes.length > 1) {
      const newOutcomes = safeOutcomes.filter((_, i) => i !== index);
      updateData({ learningOutcomes: newOutcomes });
    }
  };

  const updateLearningOutcome = (index, value) => {
    const safeOutcomes = Array.isArray(learningOutcomes) ? learningOutcomes : [''];
    const newOutcomes = safeOutcomes.map((outcome, i) => 
      i === index ? value : outcome
    );
    updateData({ learningOutcomes: newOutcomes });
  };

  const addPrerequisite = () => {
    // ✅ SAFE: prerequisites already validated above, but extra safety
    const safePrereqs = Array.isArray(prerequisites) ? prerequisites : [''];
    const newPrerequisites = [...safePrereqs, ''];
    updateData({ prerequisites: newPrerequisites });
  };

  const removePrerequisite = (index) => {
    const safePrereqs = Array.isArray(prerequisites) ? prerequisites : [''];
    if (safePrereqs.length > 1) {
      const newPrerequisites = safePrereqs.filter((_, i) => i !== index);
      updateData({ prerequisites: newPrerequisites });
    }
  };

  const updatePrerequisite = (index, value) => {
    const safePrereqs = Array.isArray(prerequisites) ? prerequisites : [''];
    const newPrerequisites = safePrereqs.map((prerequisite, i) => 
      i === index ? value : prerequisite
    );
    updateData({ prerequisites: newPrerequisites });
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      await onSave();
    } catch (error) {
      console.error('Error saving course:', error);
    } finally {
      setSaving(false);
    }
  };

  const canProceed = () => {
    return data.learningOutcomes.some(outcome => outcome.trim() !== '') &&
           data.targetAudience.trim() !== '';
  };

  return (
    <div className="space-y-8">
      {/* Intended Learners */}
      <div className={`rounded-xl shadow-lg border p-6 transition-colors ${
        isDarkMode 
          ? 'bg-slate-800/50 border-slate-700/50 backdrop-blur-sm' 
          : 'bg-white border-gray-200'
      }`}>
        <div className="flex items-center mb-6">
          <div className="flex-shrink-0">
            <AcademicCapIcon className={`h-6 w-6 ${
              isDarkMode ? 'text-purple-400' : 'text-purple-600'
            }`} />
          </div>
          <div className="ml-3">
            <h2 className={`text-xl font-semibold transition-colors ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>Intended Learners</h2>
            <p className={`transition-colors ${
              isDarkMode ? 'text-slate-400' : 'text-gray-600'
            }`}>Define what students will learn and who should take this course</p>
          </div>
        </div>

        <div className="space-y-6">
          {/* Learning Outcomes */}
          <div>
            <label className={`block text-sm font-medium mb-3 transition-colors ${
              isDarkMode ? 'text-slate-200' : 'text-gray-700'
            }`}>
              What will students learn? *
              <span className={`font-normal ml-1 transition-colors ${
                isDarkMode ? 'text-slate-400' : 'text-gray-500'
              }`}>(Minimum 4 outcomes)</span>
            </label>
            <div className="space-y-3">
              {learningOutcomes.map((outcome, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <span className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium transition-colors ${
                    isDarkMode 
                      ? 'bg-slate-700 text-slate-300' 
                      : 'bg-gray-100 text-gray-600'
                  }`}>
                    {index + 1}
                  </span>
                  <input
                    type="text"
                    value={outcome}
                    onChange={(e) => updateLearningOutcome(index, e.target.value)}
                    placeholder="Example: Build responsive websites using HTML, CSS, and JavaScript"
                    className={`flex-1 px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 transition-colors ${
                      isDarkMode 
                        ? 'bg-slate-700/50 border-slate-600 text-white placeholder-slate-400 focus:border-purple-500' 
                        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400 focus:border-purple-500'
                    }`}
                  />
                  {learningOutcomes.length > 1 && (
                    <button
                      onClick={() => removeLearningOutcome(index)}
                      className={`flex-shrink-0 p-2 transition-colors ${
                        isDarkMode 
                          ? 'text-slate-400 hover:text-red-400' 
                          : 'text-gray-400 hover:text-red-600'
                      }`}
                    >
                      <TrashIcon className="h-4 w-4" />
                    </button>
                  )}
                </div>
              ))}
              <button
                onClick={addLearningOutcome}
                className={`flex items-center text-sm font-medium transition-colors ${
                  isDarkMode 
                    ? 'text-purple-400 hover:text-purple-300' 
                    : 'text-purple-600 hover:text-purple-700'
                }`}
              >
                <PlusIcon className="h-4 w-4 mr-1" />
                Add more learning outcomes
              </button>
            </div>
          </div>

          {/* Target Audience */}
          <div>
            <label className={`block text-sm font-medium mb-3 transition-colors ${
              isDarkMode ? 'text-slate-200' : 'text-gray-700'
            }`}>
              Who is this course for? *
            </label>
            <textarea
              value={data.targetAudience}
              onChange={(e) => updateData({ targetAudience: e.target.value })}
              placeholder="Example: Beginners who want to learn web development, students with no prior programming experience, professionals looking to change careers"
              rows={4}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 transition-colors ${
                isDarkMode 
                  ? 'bg-slate-700/50 border-slate-600 text-white placeholder-slate-400 focus:border-purple-500' 
                  : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400 focus:border-purple-500'
              }`}
            />
          </div>

          {/* Prerequisites */}
          <div>
            <label className={`block text-sm font-medium mb-3 transition-colors ${
              isDarkMode ? 'text-slate-200' : 'text-gray-700'
            }`}>
              Prerequisites
              <span className={`font-normal ml-1 transition-colors ${
                isDarkMode ? 'text-slate-400' : 'text-gray-500'
              }`}>(Optional)</span>
            </label>
            <div className="space-y-3">
              {prerequisites.map((prerequisite, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <span className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium transition-colors ${
                    isDarkMode 
                      ? 'bg-slate-700 text-slate-300' 
                      : 'bg-gray-100 text-gray-600'
                  }`}>
                    {index + 1}
                  </span>
                  <input
                    type="text"
                    value={prerequisite}
                    onChange={(e) => updatePrerequisite(index, e.target.value)}
                    placeholder="Example: Basic computer skills and internet access"
                    className={`flex-1 px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 transition-colors ${
                      isDarkMode 
                        ? 'bg-slate-700/50 border-slate-600 text-white placeholder-slate-400 focus:border-purple-500' 
                        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400 focus:border-purple-500'
                    }`}
                  />
                  {prerequisites.length > 1 && (
                    <button
                      onClick={() => removePrerequisite(index)}
                      className={`flex-shrink-0 p-2 transition-colors ${
                        isDarkMode 
                          ? 'text-slate-400 hover:text-red-400' 
                          : 'text-gray-400 hover:text-red-600'
                      }`}
                    >
                      <TrashIcon className="h-4 w-4" />
                    </button>
                  )}
                </div>
              ))}
              <button
                onClick={addPrerequisite}
                className={`flex items-center text-sm font-medium transition-colors ${
                  isDarkMode 
                    ? 'text-purple-400 hover:text-purple-300' 
                    : 'text-purple-600 hover:text-purple-700'
                }`}
              >
                <PlusIcon className="h-4 w-4 mr-1" />
                Add prerequisite
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Course Structure Preview */}
      <div className={`rounded-xl shadow-lg border p-6 transition-colors ${
        isDarkMode 
          ? 'bg-slate-800/50 border-slate-700/50 backdrop-blur-sm' 
          : 'bg-white border-gray-200'
      }`}>
        <div className="flex items-center mb-4">
          <div className="flex-shrink-0">
            <BookOpenIcon className={`h-6 w-6 ${
              isDarkMode ? 'text-purple-400' : 'text-purple-600'
            }`} />
          </div>
          <div className="ml-3">
            <h2 className={`text-xl font-semibold transition-colors ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>Course Structure</h2>
            <p className={`transition-colors ${
              isDarkMode ? 'text-slate-400' : 'text-gray-600'
            }`}>You'll build your curriculum in the next step</p>
          </div>
        </div>

        <div className={`rounded-lg p-4 transition-colors ${
          isDarkMode ? 'bg-slate-700/30' : 'bg-gray-50'
        }`}>
          <div className="text-center py-8">
            <div className={`mb-2 transition-colors ${
              isDarkMode ? 'text-slate-500' : 'text-gray-400'
            }`}>
              <BookOpenIcon className="h-12 w-12 mx-auto" />
            </div>
            <h3 className={`text-lg font-medium mb-2 transition-colors ${
              isDarkMode ? 'text-slate-200' : 'text-gray-900'
            }`}>Ready to build your curriculum</h3>
            <p className={`transition-colors ${
              isDarkMode ? 'text-slate-400' : 'text-gray-600'
            }`}>
              In the next step, you'll add sections and lectures to create your course structure
            </p>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className={`flex items-center justify-between rounded-xl shadow-lg border p-6 transition-colors ${
        isDarkMode 
          ? 'bg-slate-800/50 border-slate-700/50 backdrop-blur-sm' 
          : 'bg-white border-gray-200'
      }`}>
        <button
          onClick={handleSave}
          disabled={loading}
          className={`px-6 py-2 border rounded-lg transition-all disabled:opacity-50 ${
            isDarkMode 
              ? 'text-slate-300 border-slate-600 hover:bg-slate-700' 
              : 'text-gray-600 border-gray-300 hover:bg-gray-50'
          }`}
        >
          {loading ? 'Saving...' : 'Save Draft'}
        </button>

        <button
          onClick={onNext}
          disabled={!canProceed()}
          className={`px-6 py-2 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
            isDarkMode 
              ? 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white shadow-lg shadow-purple-500/20' 
              : 'bg-purple-600 hover:bg-purple-700 text-white'
          }`}
        >
          Continue to Content Creation
        </button>
      </div>
    </div>
  );
};

export default PlanYourCourse;