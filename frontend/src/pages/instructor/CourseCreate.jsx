import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import InstructorLayout from '../../components/instructor/InstructorLayout';
import Stepper from '../../components/instructor/Stepper';
import PlanYourCourse from './CourseCreate/PlanYourCourse';
import CreateContent from './CourseCreate/CreateContent';
import PublishCourse from './CourseCreate/PublishCourse';

const CourseCreate = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [courseData, setCourseData] = useState({
    // Step 1: Plan Your Course
    learningOutcomes: [''],
    targetAudience: '',
    prerequisites: [''],
    courseStructure: {
      sections: []
    },
    
    // Step 2: Create Content
    sections: [],
    
    // Step 3: Publish Course
    title: '',
    subtitle: '',
    description: '',
    language: 'English',
    category: '',
    thumbnail: null,
    price: 0,
    isPaid: false,
    welcomeMessage: '',
    congratulationsMessage: ''
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

  // Auto-save course data to localStorage
  useEffect(() => {
    const savedData = localStorage.getItem('courseCreateData');
    if (savedData) {
      setCourseData(JSON.parse(savedData));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('courseCreateData', JSON.stringify(courseData));
  }, [courseData]);

  const updateCourseData = (newData) => {
    setCourseData(prev => ({
      ...prev,
      ...newData
    }));
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

  const saveCourse = async (publish = false) => {
    try {
      const response = await fetch('/api/instructor/courses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          ...courseData,
          status: publish ? 'published' : 'draft'
        })
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.removeItem('courseCreateData');
        navigate('/instructor/courses');
        return data;
      } else {
        throw new Error('Failed to save course');
      }
    } catch (error) {
      console.error('Error saving course:', error);
      throw error;
    }
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <PlanYourCourse
            data={courseData}
            updateData={updateCourseData}
            onNext={nextStep}
            onSave={() => saveCourse(false)}
          />
        );
      case 2:
        return (
          <CreateContent
            data={courseData}
            updateData={updateCourseData}
            onNext={nextStep}
            onPrev={prevStep}
            onSave={() => saveCourse(false)}
          />
        );
      case 3:
        return (
          <PublishCourse
            data={courseData}
            updateData={updateCourseData}
            onPrev={prevStep}
            onSaveDraft={() => saveCourse(false)}
            onPublish={() => saveCourse(true)}
          />
        );
      default:
        return null;
    }
  };

  return (
    <InstructorLayout>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white border-b border-gray-200">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Create Course</h1>
                <p className="text-gray-600 mt-1">
                  Step {currentStep} of {steps.length}: {steps[currentStep - 1]?.name}
                </p>
              </div>
              <button
                onClick={() => navigate('/instructor/courses')}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
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
      </div>
    </InstructorLayout>
  );
};

export default CourseCreate;