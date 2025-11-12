import React, { useState } from 'react';
import {
  VideoCameraIcon,
  DocumentIcon,
  PhotoIcon,
  PlusIcon,
  TrashIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  LinkIcon
} from '@heroicons/react/24/outline';
import YouTubeVideoInput from '../../../components/common/YouTubeVideoInput';
import YouTubeVideoPlayer from '../../../components/common/YouTubeVideoPlayer';

const CreateContent = ({ data, updateData, onNext, onPrev }) => {
  
  // Initialize sections with frontend 'id' for tracking
  const initializeSections = () => {
    // Safely check if sections exist and is an array
    if (data?.sections && Array.isArray(data.sections) && data.sections.length > 0) {
      // If we have existing sections, add frontend 'id' based on order or generate timestamp
      return data.sections.map((section, sectionIndex) => ({
        ...section,
        id: section._id || section.id || Date.now() + sectionIndex,
        lectures: Array.isArray(section.lectures) 
          ? section.lectures.map((lecture, lectureIndex) => ({
              ...lecture,
              id: lecture._id || lecture.id || Date.now() + sectionIndex + lectureIndex
            }))
          : []
      }));
    }
    
    // Default initial section
    return [
      {
        id: Date.now(),
        title: '',
        description: '',
        lectures: [
          {
            id: Date.now() + 1,
            title: '',
            description: '',
            type: 'video',
            duration: '',
            videoData: null,
            resources: []
          }
        ]
      }
    ];
  };

  const [sections, setSections] = useState(initializeSections());

  const addSection = () => {
    const newSection = {
      id: Date.now(),
      title: '',
      description: '',
      lectures: []
    };
    // ✅ SAFE: Validate sections before spreading
    const safeSections = Array.isArray(sections) ? sections : [];
    setSections([...safeSections, newSection]);
  };

  const deleteSection = (sectionId) => {
    // ✅ SAFE: Validate sections before filtering
    const safeSections = Array.isArray(sections) ? sections : [];
    setSections(safeSections.filter(section => section.id !== sectionId));
  };

  const updateSection = (sectionId, field, value) => {
    // ✅ SAFE: Validate sections before mapping
    const safeSections = Array.isArray(sections) ? sections : [];
    setSections(safeSections.map(section => 
      section.id === sectionId 
        ? { ...section, [field]: value }
        : section
    ));
  };

  const addLecture = (sectionId) => {
    const newLecture = {
      id: Date.now(),
      title: '',
      description: '',
      type: 'video',
      duration: '',
      videoData: null, // YouTube video data
      resources: []
    };
    
    // ✅ SAFE: Validate sections and lectures before spreading
    const safeSections = Array.isArray(sections) ? sections : [];
    setSections(safeSections.map(section => {
      if (section.id === sectionId) {
        const safeLectures = Array.isArray(section.lectures) ? section.lectures : [];
        return { ...section, lectures: [...safeLectures, newLecture] };
      }
      return section;
    }));
  };

  const deleteLecture = (sectionId, lectureId) => {
    // ✅ SAFE: Already has validation
    const safeSections = Array.isArray(sections) ? sections : [];
    setSections(safeSections.map(section => 
      section.id === sectionId 
        ? { 
            ...section, 
            lectures: Array.isArray(section.lectures) 
              ? section.lectures.filter(lecture => lecture.id !== lectureId)
              : []
          }
        : section
    ));
  };

  const updateLecture = (sectionId, lectureId, field, value) => {
    // ✅ SAFE: Already has validation
    const safeSections = Array.isArray(sections) ? sections : [];
    setSections(safeSections.map(section => 
      section.id === sectionId 
        ? {
            ...section,
            lectures: Array.isArray(section.lectures)
              ? section.lectures.map(lecture => 
                  lecture.id === lectureId 
                    ? { ...lecture, [field]: value }
                    : lecture
                )
              : []
          }
        : section
    ));
  };

  const moveLecture = (sectionId, lectureId, direction) => {
    // ✅ SAFE: Validate sections before mapping
    const safeSections = Array.isArray(sections) ? sections : [];
    setSections(safeSections.map(section => {
      if (section.id === sectionId && Array.isArray(section.lectures)) {
        const lectures = [...section.lectures];
        const currentIndex = lectures.findIndex(lecture => lecture.id === lectureId);
        const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
        
        if (newIndex >= 0 && newIndex < lectures.length) {
          [lectures[currentIndex], lectures[newIndex]] = [lectures[newIndex], lectures[currentIndex]];
        }
        
        return { ...section, lectures };
      }
      return section;
    }));
  };

  const handleSave = () => {
    // Transform sections to match backend schema with safe array handling
    const transformedSections = Array.isArray(sections) 
      ? sections.map((section, sectionIndex) => {
          // Ensure section is an object before destructuring
          if (!section || typeof section !== 'object') {
            return {
              title: '',
              description: '',
              order: sectionIndex + 1,
              lectures: []
            };
          }
          
          // Remove frontend 'id' field and add 'order'
          const { id, ...sectionData } = section;
          
          return {
            ...sectionData,
            order: sectionIndex + 1,
            lectures: Array.isArray(section.lectures)
              ? section.lectures.map((lecture, lectureIndex) => {
                  // Ensure lecture is an object before destructuring
                  if (!lecture || typeof lecture !== 'object') {
                    return {
                      title: '',
                      description: '',
                      type: 'video',
                      videoUrl: '',
                      duration: 0,
                      order: lectureIndex + 1
                    };
                  }
                  
                  // Remove frontend 'id' field and add 'order'
                  const { id, ...lectureData } = lecture;
                  
                  return {
                    ...lectureData,
                    order: lectureIndex + 1
                  };
                })
              : []
          };
        })
      : [];

    updateData({
      sections: transformedSections
    });
    onNext();
  };

  return (
    <div className="space-y-8">
      <div className="theme-card rounded-lg p-6">
        <h2 className="text-2xl font-bold theme-text-primary mb-6">Course Content</h2>
        
        {Array.isArray(sections) && sections.map((section, sectionIndex) => (
          <div key={section.id} className="mb-8 theme-border-primary border rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold theme-text-primary">
                Section {sectionIndex + 1}
              </h3>
              {sections.length > 1 && (
                <button
                  onClick={() => deleteSection(section.id)}
                  className="text-red-600 hover:text-red-700 p-2"
                >
                  <TrashIcon className="h-5 w-5" />
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium theme-text-secondary mb-2">
                  Section Title *
                </label>
                <input
                  type="text"
                  value={section.title}
                  onChange={(e) => updateSection(section.id, 'title', e.target.value)}
                  className="theme-input w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="e.g., Introduction to React"
                />
              </div>
              <div>
                <label className="block text-sm font-medium theme-text-secondary mb-2">
                  Section Description
                </label>
                <textarea
                  value={section.description}
                  onChange={(e) => updateSection(section.id, 'description', e.target.value)}
                  rows={2}
                  className="theme-input w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Brief description of what this section covers"
                />
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-md font-medium theme-text-primary">Lectures</h4>
              
              {Array.isArray(section.lectures) && section.lectures.map((lecture, lectureIndex) => (
                <div key={lecture.id} className="theme-bg-secondary rounded-lg p-4 border theme-border-primary">
                  <div className="flex items-center justify-between mb-4">
                    <h5 className="text-sm font-medium theme-text-primary">
                      Lecture {lectureIndex + 1}
                    </h5>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => moveLecture(section.id, lecture.id, 'up')}
                        disabled={lectureIndex === 0}
                        className="theme-text-tertiary hover:theme-text-secondary disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <ArrowUpIcon className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => moveLecture(section.id, lecture.id, 'down')}
                        disabled={lectureIndex === section.lectures.length - 1}
                        className="theme-text-tertiary hover:theme-text-secondary disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <ArrowDownIcon className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => deleteLecture(section.id, lecture.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium theme-text-secondary mb-2">
                        Lecture Title *
                      </label>
                      <input
                        type="text"
                        value={lecture.title}
                        onChange={(e) => updateLecture(section.id, lecture.id, 'title', e.target.value)}
                        className="theme-input w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="e.g., Setting up React Environment"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium theme-text-secondary mb-2">
                        Duration (minutes)
                      </label>
                      <input
                        type="number"
                        value={lecture.duration}
                        onChange={(e) => updateLecture(section.id, lecture.id, 'duration', e.target.value)}
                        className="theme-input w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="e.g., 15"
                      />
                    </div>
                  </div>

                  <div className="mt-4">
                    <label className="block text-sm font-medium theme-text-secondary mb-2">
                      Lecture Description
                    </label>
                    <textarea
                      value={lecture.description}
                      onChange={(e) => updateLecture(section.id, lecture.id, 'description', e.target.value)}
                      rows={2}
                      className="theme-input w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="What will students learn in this lecture?"
                    />
                  </div>

                  <div className="mt-4">
                    <label className="block text-sm font-medium theme-text-secondary mb-2">
                      Content Type
                    </label>
                    <select
                      value={lecture.type}
                      onChange={(e) => updateLecture(section.id, lecture.id, 'type', e.target.value)}
                      className="theme-input w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    >
                      <option value="video">Video (YouTube)</option>
                      <option value="article">Article</option>
                      <option value="quiz">Quiz</option>
                      <option value="assignment">Assignment</option>
                    </select>
                  </div>

                  {/* Video Content Input */}
                  {lecture.type === 'video' && (
                    <div className="mt-4">
                      <YouTubeVideoInput
                        value={lecture.videoData?.url || ''}
                        onChange={(videoData) => {
                          updateLecture(section.id, lecture.id, 'videoData', videoData);
                        }}
                        label="YouTube Video URL"
                        placeholder="Paste your YouTube video URL here (e.g., https://www.youtube.com/watch?v=...)"
                        required
                        showPreview={true}
                      />
                      
                      {/* Video Preview */}
                      {lecture.videoData?.videoId && (
                        <div className="mt-4">
                          <label className="block text-sm font-medium theme-text-secondary mb-2">
                            Video Preview
                          </label>
                          <div className="max-w-md">
                            <YouTubeVideoPlayer
                              videoId={lecture.videoData.videoId}
                              title={lecture.title || `Lecture ${lectureIndex + 1}`}
                              height="200px"
                              autoplay={false}
                              controls={true}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Other Content Types */}
                  {lecture.type === 'article' && (
                    <div className="mt-4 p-4 border-2 border-dashed theme-border-primary rounded-lg text-center">
                      <DocumentIcon className="h-8 w-8 mx-auto theme-text-tertiary mb-2" />
                      <p className="text-sm theme-text-tertiary">Article content editor will be added here</p>
                    </div>
                  )}

                  {lecture.type === 'quiz' && (
                    <div className="mt-4 p-4 border-2 border-dashed theme-border-primary rounded-lg text-center">
                      <PhotoIcon className="h-8 w-8 mx-auto theme-text-tertiary mb-2" />
                      <p className="text-sm theme-text-tertiary">Quiz builder will be added here</p>
                    </div>
                  )}

                  {lecture.type === 'assignment' && (
                    <div className="mt-4 p-4 border-2 border-dashed theme-border-primary rounded-lg text-center">
                      <DocumentIcon className="h-8 w-8 mx-auto theme-text-tertiary mb-2" />
                      <p className="text-sm theme-text-tertiary">Assignment creator will be added here</p>
                    </div>
                  )}
                </div>
              ))}

              <button
                onClick={() => addLecture(section.id)}
                className="w-full py-3 border-2 border-dashed theme-border-primary rounded-lg theme-text-tertiary hover:theme-text-accent transition-colors flex items-center justify-center"
              >
                <PlusIcon className="h-5 w-5 mr-2" />
                Add Lecture
              </button>
            </div>
          </div>
        ))}

        <button
          onClick={addSection}
          className="w-full py-4 border-2 border-dashed theme-border-primary rounded-lg theme-text-tertiary hover:theme-text-accent transition-colors flex items-center justify-center"
        >
          <PlusIcon className="h-6 w-6 mr-2" />
          Add Section
        </button>
      </div>

      <div className="flex justify-between">
        <button
          onClick={onPrev}
          className="theme-button-secondary px-6 py-3 border rounded-md transition-colors"
        >
          Previous
        </button>
        <button
          onClick={handleSave}
          className="theme-button-primary px-6 py-3 text-white rounded-md transition-colors"
        >
          Continue
        </button>
      </div>
    </div>
  );
};

export default CreateContent;