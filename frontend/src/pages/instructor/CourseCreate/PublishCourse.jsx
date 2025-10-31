import React, { useState } from 'react';
import {
  CheckCircleIcon,
  ExclamationTriangleIcon,
  EyeIcon,
  GlobeAltIcon,
  TagIcon,
  CurrencyDollarIcon
} from '@heroicons/react/24/outline';

const PublishCourse = ({ courseData, setCourseData, onPrev, onSubmit }) => {
  const [publishSettings, setPublishSettings] = useState({
    isPublished: false,
    visibility: 'public', // public, private, unlisted
    price: courseData.price || 0,
    enableDiscounts: false,
    discountPercentage: 0,
    featured: false,
    enableCertificate: true,
    enableQA: true,
    enableReviews: true
  });

  const [validationErrors, setValidationErrors] = useState([]);

  const validateCourse = () => {
    const errors = [];
    
    if (!courseData.title) errors.push('Course title is required');
    if (!courseData.description) errors.push('Course description is required');
    if (!courseData.category) errors.push('Course category is required');
    if (!courseData.level) errors.push('Course level is required');
    if (!courseData.learningOutcomes || courseData.learningOutcomes.length === 0) {
      errors.push('At least one learning outcome is required');
    }
    if (!courseData.sections || courseData.sections.length === 0) {
      errors.push('At least one section is required');
    }
    if (courseData.sections) {
      const hasLectures = courseData.sections.some(section => 
        section.lectures && section.lectures.length > 0
      );
      if (!hasLectures) errors.push('At least one lecture is required');
    }

    setValidationErrors(errors);
    return errors.length === 0;
  };

  const handlePublish = () => {
    if (validateCourse()) {
      const finalCourseData = {
        ...courseData,
        ...publishSettings,
        isPublished: true,
        publishedAt: new Date().toISOString()
      };
      setCourseData(finalCourseData);
      onSubmit(finalCourseData);
    }
  };

  const handleSaveDraft = () => {
    const draftCourseData = {
      ...courseData,
      ...publishSettings,
      isPublished: false
    };
    setCourseData(draftCourseData);
    onSubmit(draftCourseData);
  };

  const updatePublishSettings = (field, value) => {
    setPublishSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Publish Your Course</h2>
        
        {/* Course Validation */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Course Readiness Check</h3>
          
          {validationErrors.length > 0 ? (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center mb-3">
                <ExclamationTriangleIcon className="h-5 w-5 text-red-600 mr-2" />
                <h4 className="text-sm font-medium text-red-800">
                  Please fix the following issues before publishing:
                </h4>
              </div>
              <ul className="list-disc list-inside space-y-1">
                {validationErrors.map((error, index) => (
                  <li key={index} className="text-sm text-red-700">{error}</li>
                ))}
              </ul>
            </div>
          ) : (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center">
                <CheckCircleIcon className="h-5 w-5 text-green-600 mr-2" />
                <p className="text-sm text-green-800">
                  Your course is ready to be published!
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Publishing Settings */}
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Publishing Settings</h3>
            
            <div className="space-y-4">
              {/* Visibility */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Course Visibility
                </label>
                <select
                  value={publishSettings.visibility}
                  onChange={(e) => updatePublishSettings('visibility', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="public">Public - Anyone can find and enroll</option>
                  <option value="unlisted">Unlisted - Only accessible via direct link</option>
                  <option value="private">Private - Invitation only</option>
                </select>
              </div>

              {/* Pricing */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Course Price
                </label>
                <div className="relative">
                  <CurrencyDollarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="number"
                    value={publishSettings.price}
                    onChange={(e) => updatePublishSettings('price', parseFloat(e.target.value) || 0)}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Set to $0 for a free course
                </p>
              </div>

              {/* Discount Settings */}
              <div>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={publishSettings.enableDiscounts}
                    onChange={(e) => updatePublishSettings('enableDiscounts', e.target.checked)}
                    className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-700">Enable promotional pricing</span>
                </label>
                
                {publishSettings.enableDiscounts && (
                  <div className="mt-3">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Discount Percentage
                    </label>
                    <input
                      type="number"
                      value={publishSettings.discountPercentage}
                      onChange={(e) => updatePublishSettings('discountPercentage', parseInt(e.target.value) || 0)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="20"
                      min="0"
                      max="90"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Course Features */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Course Features</h3>
            
            <div className="space-y-3">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={publishSettings.enableCertificate}
                  onChange={(e) => updatePublishSettings('enableCertificate', e.target.checked)}
                  className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                />
                <span className="ml-2 text-sm text-gray-700">Issue completion certificates</span>
              </label>
              
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={publishSettings.enableQA}
                  onChange={(e) => updatePublishSettings('enableQA', e.target.checked)}
                  className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                />
                <span className="ml-2 text-sm text-gray-700">Enable Q&A section</span>
              </label>
              
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={publishSettings.enableReviews}
                  onChange={(e) => updatePublishSettings('enableReviews', e.target.checked)}
                  className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                />
                <span className="ml-2 text-sm text-gray-700">Allow student reviews</span>
              </label>
              
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={publishSettings.featured}
                  onChange={(e) => updatePublishSettings('featured', e.target.checked)}
                  className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                />
                <span className="ml-2 text-sm text-gray-700">Request featured placement</span>
              </label>
            </div>
          </div>

          {/* Course Summary */}
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Course Summary</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-600">Title:</p>
                <p className="font-medium text-gray-900">{courseData.title || 'Not set'}</p>
              </div>
              <div>
                <p className="text-gray-600">Category:</p>
                <p className="font-medium text-gray-900">{courseData.category || 'Not set'}</p>
              </div>
              <div>
                <p className="text-gray-600">Level:</p>
                <p className="font-medium text-gray-900">{courseData.level || 'Not set'}</p>
              </div>
              <div>
                <p className="text-gray-600">Price:</p>
                <p className="font-medium text-gray-900">
                  ${publishSettings.price === 0 ? 'Free' : publishSettings.price}
                </p>
              </div>
              <div>
                <p className="text-gray-600">Sections:</p>
                <p className="font-medium text-gray-900">
                  {courseData.sections?.length || 0}
                </p>
              </div>
              <div>
                <p className="text-gray-600">Total Lectures:</p>
                <p className="font-medium text-gray-900">
                  {courseData.sections?.reduce((total, section) => 
                    total + (section.lectures?.length || 0), 0
                  ) || 0}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-between">
        <button
          onClick={onPrev}
          className="px-6 py-3 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
        >
          Previous
        </button>
        
        <div className="flex space-x-4">
          <button
            onClick={handleSaveDraft}
            className="px-6 py-3 border border-purple-600 text-purple-600 rounded-md hover:bg-purple-50 transition-colors"
          >
            Save as Draft
          </button>
          
          <button
            onClick={handlePublish}
            disabled={validationErrors.length > 0}
            className="px-6 py-3 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Publish Course
          </button>
        </div>
      </div>
    </div>
  );
};

export default PublishCourse;