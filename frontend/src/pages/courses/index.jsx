import React from 'react';
import { Routes, Route } from 'react-router-dom';
import CourseExplorer from './CourseExplorer';

const CoursesRoutes = () => {
  return (
    <Routes>
      <Route index element={<CourseExplorer />} />
      <Route path="explore" element={<CourseExplorer />} />
      {/* Future routes can be added here:
      <Route path=":id" element={<CourseDetails />} />
      <Route path="my-courses" element={<MyCourses />} />
      */}
    </Routes>
  );
};

export default CoursesRoutes;