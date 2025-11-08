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
    level: '',
    thumbnail: null,
    price: 0,
    isPaid: false,
    tags: [],
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
      console.log('Saving course with data:', courseData);
      
      // Prepare the data to send
      const dataToSend = {
        ...courseData,
        status: publish ? 'published' : 'draft',
        // Ensure these fields are arrays
        learningOutcomes: courseData.learningOutcomes || [],
        prerequisites: courseData.prerequisites || [],
        sections: courseData.sections || [],
        tags: courseData.tags || []
      };

      // Validate required fields after preparing data
      if (!dataToSend.title || dataToSend.title.trim() === '') {
        alert('Please enter a course title before publishing.');
        return;
      }

      if (!dataToSend.description || dataToSend.description.trim() === '') {
        alert('Please enter a course description before publishing.');
        return;
      }

      if (!dataToSend.category) {
        alert('Please select a course category before publishing.');
        return;
      }
      
      const response = await fetch('/api/courses/instructor', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(dataToSend)
      });

      const data = await response.json();
      console.log('Backend response:', data);

      if (response.ok && data.success) {
        localStorage.removeItem('courseCreateData');
        alert(publish ? 'Course published successfully!' : 'Course saved as draft!');
        navigate('/instructor/courses');
        return data;
      } else {
        const errorMessage = data.error || data.message || 'Failed to save course';
        console.error('Backend error:', errorMessage);
        throw new Error(errorMessage);
      }
    } catch (error) {
      console.error('Error saving course:', error);
      alert('Error creating course: ' + error.message);
      throw error;
    }
  };

  // Local save (just save to localStorage, don't send to backend)
  const saveProgress = () => {
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
      <div className="theme-page">
        {/* Header */}
        <div className="theme-bg-card border-b theme-border-primary">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold theme-text-primary">Create Course</h1>
                <p className="theme-text-secondary mt-1">
                  Step {currentStep} of {steps.length}: {steps[currentStep - 1]?.name}
                </p>
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
      </div>
    </InstructorLayout>
  );
};

export default CourseCreate;