import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';
import {
  CheckCircleIcon,
  ExclamationTriangleIcon,
  XMarkIcon,
  ClockIcon,
  GlobeAltIcon
} from '@heroicons/react/24/outline';

const PublishToggle = ({ course, onToggle, onValidationError }) => {
  const { isDarkMode } = useTheme();
  const [isToggling, setIsToggling] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showValidationModal, setShowValidationModal] = useState(false);
  const [validationErrors, setValidationErrors] = useState([]);
  const [checklist, setChecklist] = useState(null);

  const isPublished = course.status === 'published';

  const handleToggleClick = async () => {
    // If unpublishing, just show confirmation
    if (isPublished) {
      setShowConfirmModal(true);
      return;
    }

    // If publishing, attempt to toggle and handle validation
    await performToggle();
  };

  const performToggle = async () => {
    setIsToggling(true);

    try {
      const response = await fetch(
        `http://localhost:5000/api/courses/instructor/${course._id}/publish`,
        {
          method: 'PUT',
          credentials: 'include',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          }
        }
      );

      const data = await response.json();

      if (data.success) {
        // Success - notify parent component
        if (onToggle) {
          onToggle(course._id, data.data.status);
        }
        setShowConfirmModal(false);
      } else {
        // Validation failed
        if (data.validationErrors) {
          setValidationErrors(data.validationErrors);
          setChecklist(data.completionChecklist);
          setShowValidationModal(true);
          
          if (onValidationError) {
            onValidationError(course._id, data.validationErrors);
          }
        }
      }
    } catch (error) {
      console.error('Error toggling course status:', error);
      alert('An error occurred while updating the course status');
    } finally {
      setIsToggling(false);
    }
  };

  const handleConfirmUnpublish = () => {
    performToggle();
  };

  return (
    <>
      {/* Toggle Switch */}
      <div className="flex items-center gap-2">
        <button
          onClick={handleToggleClick}
          disabled={isToggling}
          className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 ${
            isPublished
              ? 'bg-green-600 focus:ring-green-500'
              : isDarkMode
              ? 'bg-slate-600 focus:ring-slate-500'
              : 'bg-gray-300 focus:ring-gray-400'
          } ${isToggling ? 'opacity-50 cursor-not-allowed' : ''}`}
          role="switch"
          aria-checked={isPublished}
        >
          <span
            className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
              isPublished ? 'translate-x-5' : 'translate-x-0'
            }`}
          />
        </button>
        
        <span className={`text-sm font-medium ${
          isDarkMode ? 'text-slate-300' : 'text-gray-700'
        }`}>
          {isToggling ? 'Updating...' : isPublished ? 'Published' : 'Draft'}
        </span>
      </div>

      {/* Unpublish Confirmation Modal */}
      <AnimatePresence>
        {showConfirmModal && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex min-h-screen items-center justify-center p-4">
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowConfirmModal(false)}
                className="fixed inset-0 bg-black/50 backdrop-blur-sm"
              />

              {/* Modal */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className={`relative w-full max-w-md rounded-2xl p-6 shadow-xl ${
                  isDarkMode
                    ? 'bg-slate-800 border border-slate-700'
                    : 'bg-white'
                }`}
              >
                <button
                  onClick={() => setShowConfirmModal(false)}
                  className={`absolute top-4 right-4 p-1 rounded-lg transition-colors ${
                    isDarkMode
                      ? 'hover:bg-slate-700 text-slate-400'
                      : 'hover:bg-gray-100 text-gray-400'
                  }`}
                >
                  <XMarkIcon className="h-5 w-5" />
                </button>

                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <ExclamationTriangleIcon className="h-10 w-10 text-yellow-500" />
                  </div>
                  <div className="flex-1">
                    <h3 className={`text-lg font-semibold mb-2 ${
                      isDarkMode ? 'text-white' : 'text-gray-900'
                    }`}>
                      Unpublish Course?
                    </h3>
                    <p className={`text-sm mb-4 ${
                      isDarkMode ? 'text-slate-400' : 'text-gray-600'
                    }`}>
                      This will remove the course from the public catalog. Students who have already
                      enrolled will still have access, but new students won't be able to enroll.
                    </p>
                    <p className={`text-sm font-medium mb-4 ${
                      isDarkMode ? 'text-slate-300' : 'text-gray-700'
                    }`}>
                      Course: <span className="text-purple-600">{course.title}</span>
                    </p>
                  </div>
                </div>

                <div className="mt-6 flex gap-3 justify-end">
                  <button
                    onClick={() => setShowConfirmModal(false)}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      isDarkMode
                        ? 'bg-slate-700 text-white hover:bg-slate-600'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleConfirmUnpublish}
                    disabled={isToggling}
                    className="px-4 py-2 bg-yellow-600 text-white rounded-lg font-medium hover:bg-yellow-700 transition-colors disabled:opacity-50"
                  >
                    {isToggling ? 'Unpublishing...' : 'Yes, Unpublish'}
                  </button>
                </div>
              </motion.div>
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* Validation Error Modal */}
      <AnimatePresence>
        {showValidationModal && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex min-h-screen items-center justify-center p-4">
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowValidationModal(false)}
                className="fixed inset-0 bg-black/50 backdrop-blur-sm"
              />

              {/* Modal */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className={`relative w-full max-w-lg rounded-2xl p-6 shadow-xl ${
                  isDarkMode
                    ? 'bg-slate-800 border border-slate-700'
                    : 'bg-white'
                }`}
              >
                <button
                  onClick={() => setShowValidationModal(false)}
                  className={`absolute top-4 right-4 p-1 rounded-lg transition-colors ${
                    isDarkMode
                      ? 'hover:bg-slate-700 text-slate-400'
                      : 'hover:bg-gray-100 text-gray-400'
                  }`}
                >
                  <XMarkIcon className="h-5 w-5" />
                </button>

                <div className="flex items-start gap-4 mb-4">
                  <div className="flex-shrink-0">
                    <ExclamationTriangleIcon className="h-10 w-10 text-red-500" />
                  </div>
                  <div className="flex-1">
                    <h3 className={`text-lg font-semibold mb-2 ${
                      isDarkMode ? 'text-white' : 'text-gray-900'
                    }`}>
                      Course Cannot Be Published
                    </h3>
                    <p className={`text-sm ${
                      isDarkMode ? 'text-slate-400' : 'text-gray-600'
                    }`}>
                      Please complete all required fields before publishing this course.
                    </p>
                  </div>
                </div>

                {/* Completion Checklist */}
                {checklist && (
                  <div className={`rounded-lg p-4 mb-4 ${
                    isDarkMode ? 'bg-slate-700/50' : 'bg-gray-50'
                  }`}>
                    <h4 className={`text-sm font-semibold mb-3 ${
                      isDarkMode ? 'text-white' : 'text-gray-900'
                    }`}>
                      Publishing Checklist:
                    </h4>
                    <div className="space-y-2">
                      {[
                        { key: 'hasTitle', label: 'Course Title' },
                        { key: 'hasDescription', label: 'Course Description' },
                        { key: 'hasThumbnail', label: 'Course Thumbnail' },
                        { key: 'hasCategory', label: 'Course Category' },
                        { key: 'hasPrice', label: 'Course Pricing' },
                        { key: 'hasSections', label: 'At least 1 Section' },
                        { key: 'hasLectures', label: 'At least 1 Lecture' }
                      ].map(({ key, label }) => (
                        <div key={key} className="flex items-center gap-2">
                          {checklist[key] ? (
                            <CheckCircleIcon className="h-5 w-5 text-green-500 flex-shrink-0" />
                          ) : (
                            <ClockIcon className="h-5 w-5 text-red-500 flex-shrink-0" />
                          )}
                          <span className={`text-sm ${
                            checklist[key]
                              ? isDarkMode ? 'text-slate-300' : 'text-gray-700'
                              : 'text-red-500 font-medium'
                          }`}>
                            {label}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Error List */}
                {validationErrors.length > 0 && (
                  <div className={`rounded-lg p-4 mb-4 ${
                    isDarkMode ? 'bg-red-900/20 border border-red-800' : 'bg-red-50 border border-red-200'
                  }`}>
                    <h4 className={`text-sm font-semibold mb-2 ${
                      isDarkMode ? 'text-red-400' : 'text-red-800'
                    }`}>
                      Issues Found:
                    </h4>
                    <ul className="space-y-1">
                      {validationErrors.map((error, index) => (
                        <li key={index} className={`text-sm ${
                          isDarkMode ? 'text-red-300' : 'text-red-700'
                        }`}>
                          • {error}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="flex gap-3 justify-end">
                  <button
                    onClick={() => setShowValidationModal(false)}
                    className="px-4 py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors"
                  >
                    Got It
                  </button>
                </div>
              </motion.div>
            </div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default PublishToggle;
