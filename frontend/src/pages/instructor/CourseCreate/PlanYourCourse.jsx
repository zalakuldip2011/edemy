import React, { useState } from 'react';
import { 
  PlusIcon, 
  TrashIcon,
  BookOpenIcon,
  UsersIcon,
  AcademicCapIcon
} from '@heroicons/react/24/outline';

const PlanYourCourse = ({ data, updateData, onNext, onSave }) => {
  const [loading, setSaving] = useState(false);

  const addLearningOutcome = () => {
    const newOutcomes = [...data.learningOutcomes, ''];
    updateData({ learningOutcomes: newOutcomes });
  };

  const removeLearningOutcome = (index) => {
    if (data.learningOutcomes.length > 1) {
      const newOutcomes = data.learningOutcomes.filter((_, i) => i !== index);
      updateData({ learningOutcomes: newOutcomes });
    }
  };

  const updateLearningOutcome = (index, value) => {
    const newOutcomes = data.learningOutcomes.map((outcome, i) => 
      i === index ? value : outcome
    );
    updateData({ learningOutcomes: newOutcomes });
  };

  const addPrerequisite = () => {
    const newPrerequisites = [...data.prerequisites, ''];
    updateData({ prerequisites: newPrerequisites });
  };

  const removePrerequisite = (index) => {
    if (data.prerequisites.length > 1) {
      const newPrerequisites = data.prerequisites.filter((_, i) => i !== index);
      updateData({ prerequisites: newPrerequisites });
    }
  };

  const updatePrerequisite = (index, value) => {
    const newPrerequisites = data.prerequisites.map((prerequisite, i) => 
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
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center mb-6">
          <div className="flex-shrink-0">
            <AcademicCapIcon className="h-6 w-6 text-purple-600" />
          </div>
          <div className="ml-3">
            <h2 className="text-xl font-semibold text-gray-900">Intended Learners</h2>
            <p className="text-gray-600">Define what students will learn and who should take this course</p>
          </div>
        </div>

        <div className="space-y-6">
          {/* Learning Outcomes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              What will students learn? *
              <span className="text-gray-500 font-normal ml-1">(Minimum 4 outcomes)</span>
            </label>
            <div className="space-y-3">
              {data.learningOutcomes.map((outcome, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center text-xs font-medium text-gray-600">
                    {index + 1}
                  </span>
                  <input
                    type="text"
                    value={outcome}
                    onChange={(e) => updateLearningOutcome(index, e.target.value)}
                    placeholder="Example: Build responsive websites using HTML, CSS, and JavaScript"
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  />
                  {data.learningOutcomes.length > 1 && (
                    <button
                      onClick={() => removeLearningOutcome(index)}
                      className="flex-shrink-0 p-2 text-gray-400 hover:text-red-600 transition-colors"
                    >
                      <TrashIcon className="h-4 w-4" />
                    </button>
                  )}
                </div>
              ))}
              <button
                onClick={addLearningOutcome}
                className="flex items-center text-purple-600 hover:text-purple-700 text-sm font-medium"
              >
                <PlusIcon className="h-4 w-4 mr-1" />
                Add more learning outcomes
              </button>
            </div>
          </div>

          {/* Target Audience */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Who is this course for? *
            </label>
            <textarea
              value={data.targetAudience}
              onChange={(e) => updateData({ targetAudience: e.target.value })}
              placeholder="Example: Beginners who want to learn web development, students with no prior programming experience, professionals looking to change careers"
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            />
          </div>

          {/* Prerequisites */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Prerequisites
              <span className="text-gray-500 font-normal ml-1">(Optional)</span>
            </label>
            <div className="space-y-3">
              {data.prerequisites.map((prerequisite, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center text-xs font-medium text-gray-600">
                    {index + 1}
                  </span>
                  <input
                    type="text"
                    value={prerequisite}
                    onChange={(e) => updatePrerequisite(index, e.target.value)}
                    placeholder="Example: Basic computer skills and internet access"
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  />
                  {data.prerequisites.length > 1 && (
                    <button
                      onClick={() => removePrerequisite(index)}
                      className="flex-shrink-0 p-2 text-gray-400 hover:text-red-600 transition-colors"
                    >
                      <TrashIcon className="h-4 w-4" />
                    </button>
                  )}
                </div>
              ))}
              <button
                onClick={addPrerequisite}
                className="flex items-center text-purple-600 hover:text-purple-700 text-sm font-medium"
              >
                <PlusIcon className="h-4 w-4 mr-1" />
                Add prerequisite
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Course Structure Preview */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center mb-4">
          <div className="flex-shrink-0">
            <BookOpenIcon className="h-6 w-6 text-purple-600" />
          </div>
          <div className="ml-3">
            <h2 className="text-xl font-semibold text-gray-900">Course Structure</h2>
            <p className="text-gray-600">You'll build your curriculum in the next step</p>
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-4">
          <div className="text-center py-8">
            <div className="text-gray-400 mb-2">
              <BookOpenIcon className="h-12 w-12 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Ready to build your curriculum</h3>
            <p className="text-gray-600">
              In the next step, you'll add sections and lectures to create your course structure
            </p>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-between bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <button
          onClick={handleSave}
          disabled={loading}
          className="px-6 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
        >
          {loading ? 'Saving...' : 'Save Draft'}
        </button>

        <button
          onClick={onNext}
          disabled={!canProceed()}
          className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Continue to Content Creation
        </button>
      </div>
    </div>
  );
};

export default PlanYourCourse;