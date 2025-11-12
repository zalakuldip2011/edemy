import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import InstructorLayout from '../../components/instructor/InstructorLayout';
import Stepper from '../../components/instructor/Stepper';
import PlanYourCourse from './CourseCreate/PlanYourCourse';
import CreateContent from './CourseCreate/CreateContent';
import PublishCourse from './CourseCreate/PublishCourse';

const CourseCreate = () => {
  const navigate = useNavigate();
  const { id: urlParamId } = useParams();
  const [searchParams] = useSearchParams();
  const editCourseId = urlParamId || searchParams.get('edit');
  const isEditMode = !!editCourseId;
  
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(isEditMode);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [courseData, setCourseData] = useState({
    // Step 1: Plan Your Course
    learningOutcomes: [''],
    targetAudience: '',
    prerequisites: [''],
    
    // Step 2: Create Content
    sections: [],
    
    // Step 3: Publish Course
    title: '',
    subtitle: '',
    description: '',
    language: 'English',
    category: '',
    level: '',
    thumbnail: '',
    price: 0,
    featured: false,
    tags: []
  });

  const steps = [
    {
      id: 1,
      name: 'Plan Your Course',
      description: 'Define your course structure'
    },
    {
      id: 2,
      name: 'Create Your Content',
      description: 'Add sections and lectures'
    },
    {
      id: 3,
      name: 'Publish Your Course',
      description: 'Set up course details'
    }
  ];

  // Fetch existing course data if in edit mode
  useEffect(() => {
    const fetchCourseData = async () => {
      if (!isEditMode || !editCourseId) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const response = await fetch(
          `http://localhost:5000/api/courses/instructor/${editCourseId}`,
          {
            credentials: 'include',
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
          }
        );

        const data = await response.json();

        if (data.success && data.data) {
          const course = data.data;
          
          // Map backend data to courseData structure
          setCourseData({
            learningOutcomes: course.learningOutcomes || [''],
            targetAudience: course.targetAudience || '',
            prerequisites: course.requirements || [''],
            sections: course.sections || [],
            title: course.title || '',
            subtitle: course.subtitle || '',
            description: course.description || '',
            language: course.language || 'English',
            category: course.category || '',
            level: course.level || '',
            thumbnail: course.thumbnail || '',
            price: course.price || 0,
            featured: course.featured || false,
            tags: course.tags || []
          });
        } else {
          alert('Failed to load course data. Redirecting to courses page.');
          navigate('/instructor/courses');
        }
      } catch (error) {
        console.error('Error fetching course:', error);
        alert('Error loading course. Redirecting to courses page.');
        navigate('/instructor/courses');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCourseData();
  }, [isEditMode, editCourseId, navigate]);

  // Auto-save course data to localStorage (only in create mode)
  useEffect(() => {
    if (isEditMode) return; // Don't use localStorage in edit mode
    
    const savedData = localStorage.getItem('courseCreateData');
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        // Clean up old fields that might cause issues
        const cleanedData = {
          learningOutcomes: parsed.learningOutcomes || [''],
          targetAudience: parsed.targetAudience || '',
          prerequisites: parsed.prerequisites || [''],
          sections: parsed.sections || [],
          title: parsed.title || '',
          subtitle: parsed.subtitle || '',
          description: parsed.description || '',
          language: parsed.language || 'English',
          category: parsed.category || '',
          level: parsed.level || '',
          thumbnail: parsed.thumbnail || '',
          price: parsed.price || 0,
          featured: parsed.featured || false,
          tags: parsed.tags || []
        };
        setCourseData(cleanedData);
      } catch (error) {
        console.error('Error parsing saved course data:', error);
        localStorage.removeItem('courseCreateData');
      }
    }
  }, []);

  useEffect(() => {
    if (!isEditMode) {
      localStorage.setItem('courseCreateData', JSON.stringify(courseData));
    }
  }, [courseData, isEditMode]);

  const updateCourseData = (newData) => {
    setCourseData(prev => {
      const safePrev = prev && typeof prev === 'object' ? prev : {};
      const safeNewData = newData && typeof newData === 'object' ? newData : {};
      return {
        ...safePrev,
        ...safeNewData
      };
    });
  };

  const nextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const goToStep = (stepNumber) => {
    if (stepNumber >= 1 && stepNumber <= steps.length) {
      setCurrentStep(stepNumber);
    }
  };

  const showSuccessDialog = (message, isPublish) => {
    setSuccessMessage(message);
    setShowSuccessModal(true);
    
    // Auto-redirect after 2 seconds
    setTimeout(() => {
      setShowSuccessModal(false);
      navigate('/instructor/courses');
    }, 2000);
  };

  const saveCourse = async (publish = false, dataOverride = null) => {
    try {
      // ============ SAFE DEFAULTS ============
      const defaultCourseData = {
        title: '',
        subtitle: '',
        description: '',
        category: '',
        level: '',
        price: 0,
        language: 'English',
        learningOutcomes: [],
        prerequisites: [],
        requirements: [],
        targetAudience: '',
        tags: [],
        sections: [],
        thumbnail: '',
        featured: false,
        status: 'draft'
      };

      // ============ SAFE OBJECT SPREADING ============
      // Never spread undefined/null - always use safe fallbacks
      const safeCourseData = (courseData && typeof courseData === 'object') ? courseData : {};
      const safeDataOverride = (dataOverride && typeof dataOverride === 'object') ? dataOverride : {};
      
      // Three-way merge with defaults first
      const sourceData = {
        ...defaultCourseData,
        ...safeCourseData,
        ...safeDataOverride
      };
      
      console.log('📦 saveCourse - Input data:', { courseData, dataOverride });
      console.log('🔄 saveCourse - Merged sourceData:', sourceData);

      // ============ ARRAY NORMALIZATION HELPER ============
      const normalizeArray = (arr) => {
        if (!arr || !Array.isArray(arr)) return [];
        return arr.filter(item => {
          if (item === null || item === undefined) return false;
          if (typeof item === 'string') return item.trim() !== '';
          if (typeof item === 'object') return true;
          return false;
        });
      };

      // ============ OBJECT NORMALIZATION HELPER ============
      const normalizeObject = (obj) => {
        if (!obj || typeof obj !== 'object' || Array.isArray(obj)) return {};
        return obj;
      };

      // ============ SECTIONS NORMALIZATION ============
      const normalizeSections = (sections) => {
        if (!sections || !Array.isArray(sections)) return [];
        
        return sections
          .filter(section => section && typeof section === 'object')
          .map((section, sIndex) => {
            const normalizedSection = {
              title: (section.title || '').toString().trim(),
              description: (section.description || '').toString().trim(),
              order: typeof section.order === 'number' ? section.order : sIndex,
              lectures: []
            };

            // Normalize lectures array
            if (section.lectures && Array.isArray(section.lectures)) {
              normalizedSection.lectures = section.lectures
                .filter(lecture => lecture && typeof lecture === 'object')
                .map((lecture, lIndex) => ({
                  title: (lecture.title || '').toString().trim(),
                  description: (lecture.description || '').toString().trim(),
                  type: (lecture.type || 'video').toString(),
                  videoData: normalizeObject(lecture.videoData),
                  videoUrl: (lecture.videoUrl || '').toString().trim(),
                  duration: parseFloat(lecture.duration) || 0,
                  resources: normalizeArray(lecture.resources),
                  isPreview: Boolean(lecture.isPreview),
                  order: typeof lecture.order === 'number' ? lecture.order : lIndex
                }));
            }

            return normalizedSection;
          });
      };

      // ============ BUILD PAYLOAD ============
      const payload = {
        title: (sourceData.title || '').toString().trim(),
        subtitle: (sourceData.subtitle || '').toString().trim(),
        description: (sourceData.description || '').toString().trim(),
        category: (sourceData.category || '').toString().trim(),
        level: (sourceData.level || '').toString().trim(),
        price: parseFloat(sourceData.price) || 0,
        language: (sourceData.language || 'English').toString().trim(),
        learningOutcomes: normalizeArray(sourceData.learningOutcomes),
        requirements: normalizeArray(sourceData.prerequisites || sourceData.requirements),
        targetAudience: (sourceData.targetAudience || '').toString().trim(),
        tags: normalizeArray(sourceData.tags),
        sections: normalizeSections(sourceData.sections),
        thumbnail: (sourceData.thumbnail || '').toString().trim(),
        featured: Boolean(sourceData.featured),
        status: publish ? 'published' : 'draft'
      };

      // ============ RECURSIVE CLEANUP (Remove null/undefined) ============
      const deepClean = (obj) => {
        if (Array.isArray(obj)) {
          return obj
            .map(item => deepClean(item))
            .filter(item => item !== null && item !== undefined);
        }
        
        if (obj !== null && typeof obj === 'object') {
          const cleaned = {};
          Object.keys(obj).forEach(key => {
            const value = obj[key];
            if (value !== null && value !== undefined) {
              if (typeof value === 'string' && value === '') {
                // Keep empty strings for optional fields
                cleaned[key] = value;
              } else {
                cleaned[key] = deepClean(value);
              }
            }
          });
          return cleaned;
        }
        
        return obj;
      };

      const cleanedPayload = deepClean(payload);
      console.log('✅ saveCourse - Cleaned payload:', JSON.stringify(cleanedPayload, null, 2));

      // ============ VALIDATION FOR PUBLISH ============
      if (publish) {
        const errors = [];
        
        if (!cleanedPayload.title || cleanedPayload.title.trim() === '') {
          errors.push('❌ Course title is required');
        }
        if (!cleanedPayload.description || cleanedPayload.description.trim() === '') {
          errors.push('❌ Course description is required');
        }
        if (!cleanedPayload.category || cleanedPayload.category.trim() === '') {
          errors.push('❌ Course category is required');
        }
        if (!cleanedPayload.level || cleanedPayload.level.trim() === '') {
          errors.push('❌ Course level is required');
        }
        if (!cleanedPayload.thumbnail || cleanedPayload.thumbnail.trim() === '') {
          errors.push('❌ Course thumbnail is required');
        }
        if (!cleanedPayload.learningOutcomes || cleanedPayload.learningOutcomes.length === 0) {
          errors.push('❌ At least one learning outcome is required');
        }
        if (!cleanedPayload.sections || cleanedPayload.sections.length === 0) {
          errors.push('❌ At least one section is required');
        }
        
        const hasLectures = cleanedPayload.sections?.some(s => s.lectures && s.lectures.length > 0);
        if (!hasLectures) {
          errors.push('❌ At least one lecture is required');
        }

        if (errors.length > 0) {
          const errorMessage = 'Please fix the following errors:\n\n' + errors.join('\n');
          console.error('🚫 Validation errors:', errors);
          alert(errorMessage);
          return { success: false, errors };
        }
      }

      // ============ API CALL WITH ERROR HANDLING ============
      const url = isEditMode 
        ? `http://localhost:5000/api/courses/instructor/${editCourseId}`
        : 'http://localhost:5000/api/courses/instructor';
      
      const method = isEditMode ? 'PUT' : 'POST';
      
      console.log(`🌐 saveCourse - ${method} ${url}`);

      let response;
      let data;
      
      try {
        response = await fetch(url, {
          method: method,
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          credentials: 'include',
          body: JSON.stringify(cleanedPayload)
        });

        // Parse JSON response
        data = await response.json();
        console.log('📨 Backend response:', data);

      } catch (fetchError) {
        console.error('🔥 Network/Parse error:', fetchError);
        const errorMsg = `Network error: ${fetchError.message}. Please check your connection and try again.`;
        alert(errorMsg);
        throw new Error(errorMsg);
      }

      // ============ RESPONSE HANDLING ============
      if (response.ok && data.success) {
        // Clear localStorage on successful creation
        if (!isEditMode) {
          localStorage.removeItem('courseCreateData');
        }
        
        const message = isEditMode
          ? (publish ? 'Course updated and published successfully!' : 'Course updated successfully!')
          : (publish ? 'Course published successfully!' : 'Course saved as draft!');
        
        console.log('🎉 Success:', message);
        
        // Show custom success dialog
        showSuccessDialog(message, publish);
        
        return { success: true, data: data.data, message };
        
      } else {
        // Extract clear error message from backend
        const errorMessage = 
          data.error || 
          data.message || 
          data.errors?.[0]?.msg || 
          `Failed to ${publish ? 'publish' : 'save'} course (Status: ${response.status})`;
        
        console.error('❌ Backend error:', {
          status: response.status,
          statusText: response.statusText,
          error: errorMessage,
          data
        });
        
        alert(`Error: ${errorMessage}`);
        throw new Error(errorMessage);
      }
      
    } catch (error) {
      console.error('💥 saveCourse - Fatal error:', error);
      
      // Don't re-alert if we already showed an error
      if (!error.message.includes('Network error') && !error.message.includes('Failed to')) {
        alert(`Error ${publish ? 'publishing' : 'saving'} course: ${error.message}`);
      }
      
      throw error;
    }
  };

  // ============ UNIT TEST CHECK (Development only) ============
  // Uncomment to verify saveCourse handles edge cases without throwing
  /*
  useEffect(() => {
    const testSaveCourse = async () => {
      console.log('🧪 Running saveCourse unit tests...');
      
      try {
        // Test 1: undefined input
        console.log('Test 1: saveCourse with undefined');
        await saveCourse(false, undefined);
        console.log('✅ Test 1 passed');
      } catch (e) {
        console.log('✅ Test 1: Caught expected error:', e.message);
      }
      
      try {
        // Test 2: minimal valid input
        console.log('Test 2: saveCourse with minimal data');
        await saveCourse(false, { title: 'Test Course' });
        console.log('✅ Test 2 passed');
      } catch (e) {
        console.log('✅ Test 2: Caught expected error:', e.message);
      }
      
      try {
        // Test 3: null courseData
        console.log('Test 3: saveCourse with null');
        await saveCourse(false, null);
        console.log('✅ Test 3 passed');
      } catch (e) {
        console.log('✅ Test 3: Caught expected error:', e.message);
      }
      
      console.log('🧪 All saveCourse tests completed');
    };
    
    // Run tests only in development
    if (process.env.NODE_ENV === 'development') {
      testSaveCourse();
    }
  }, []);
  */

  // Local save (just save to localStorage, don't send to backend)
  const saveProgress = () => {
    if (isEditMode) {
      alert('Changes are auto-saved. Use "Save Draft" to save to the server.');
      return;
    }
    localStorage.setItem('courseCreateData', JSON.stringify(courseData));
    alert('Progress saved locally! You can continue later.');
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <PlanYourCourse
            data={courseData}
            updateData={updateCourseData}
            onNext={nextStep}
            onSave={saveProgress}
          />
        );
      case 2:
        return (
          <CreateContent
            data={courseData}
            updateData={updateCourseData}
            onNext={nextStep}
            onPrev={prevStep}
            onSave={saveProgress}
          />
        );
      case 3:
        return (
          <PublishCourse
            data={courseData}
            updateData={updateCourseData}
            onPrev={prevStep}
            onSaveDraft={(updatedData) => {
              console.log('CourseCreate - onSaveDraft received:', updatedData);
              console.log('CourseCreate - Current courseData:', courseData);
              // Safely merge the updated data before saving
              const safeCourseData = courseData && typeof courseData === 'object' ? courseData : {};
              const safeUpdatedData = updatedData && typeof updatedData === 'object' ? updatedData : {};
              const mergedData = { ...safeCourseData, ...safeUpdatedData };
              console.log('CourseCreate - Merged data:', mergedData);
              updateCourseData(safeUpdatedData);
              saveCourse(false, mergedData);
            }}
            onPublish={(updatedData) => {
              console.log('CourseCreate - onPublish received:', updatedData);
              console.log('CourseCreate - Current courseData:', courseData);
              // Safely merge the updated data before publishing
              const safeCourseData = courseData && typeof courseData === 'object' ? courseData : {};
              const safeUpdatedData = updatedData && typeof updatedData === 'object' ? updatedData : {};
              const mergedData = { ...safeCourseData, ...safeUpdatedData };
              console.log('CourseCreate - Merged data:', mergedData);
              updateCourseData(safeUpdatedData);
              saveCourse(true, mergedData);
            }}
          />
        );
      default:
        return null;
    }
  };

  return (
    <InstructorLayout>
      <div className="theme-page">
        {/* Loading State */}
        {isLoading ? (
          <div className="flex items-center justify-center min-h-screen">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
              <p className="theme-text-secondary">Loading course data...</p>
            </div>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="theme-bg-card border-b theme-border-primary">
              <div className="px-6 py-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="text-2xl font-bold theme-text-primary">
                      {isEditMode ? 'Edit Course' : 'Create Course'}
                    </h1>
                    <p className="theme-text-secondary mt-1">
                      Step {currentStep} of {steps.length}: {steps[currentStep - 1]?.name}
                    </p>
                    {isEditMode && courseData.title && (
                      <p className="text-sm text-purple-600 mt-1">
                        Editing: {courseData.title}
                      </p>
                    )}
                  </div>
                  <button
                    onClick={() => navigate('/instructor/courses')}
                    className="px-4 py-2 theme-text-tertiary hover:theme-text-secondary transition-colors"
                  >
                    Exit
                  </button>
                </div>
              </div>
            </div>

            {/* Stepper */}
            <Stepper
              currentStep={currentStep}
              steps={steps}
              onStepClick={goToStep}
            />

            {/* Content */}
            <div className="max-w-4xl mx-auto py-8">
              {renderCurrentStep()}
            </div>
          </>
        )}

        {/* Success Modal */}
        {showSuccessModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
            <div className="bg-white rounded-lg shadow-2xl p-8 max-w-md mx-4 transform animate-scale-in">
              <div className="text-center">
                {/* Success Icon */}
                <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
                  <svg
                    className="h-10 w-10 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                
                {/* Success Message */}
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Success!
                </h3>
                <p className="text-gray-600 mb-6">
                  {successMessage}
                </p>
                
                {/* OK Button */}
                <button
                  onClick={() => {
                    setShowSuccessModal(false);
                    navigate('/instructor/courses');
                  }}
                  className="w-full px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                >
                  OK
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </InstructorLayout>
  );
};

export default CourseCreate;