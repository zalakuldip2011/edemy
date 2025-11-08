import React from 'react';
import { Routes, Route } from 'react-router-dom';
import CourseExplorer from './CourseExplorer';
import CourseDetails from './CourseDetails';
import CourseViewer from './CourseViewer';

const CoursesRoutes = () => {
  return (
    <Routes>
      <Route index element={<CourseExplorer />} />
      <Route path="explore" element={<CourseExplorer />} />
      <Route path=":courseId" element={<CourseDetails />} />
      <Route path=":courseId/learn" element={<CourseViewer />} />
    </Routes>
  );
};

export default CoursesRoutes;