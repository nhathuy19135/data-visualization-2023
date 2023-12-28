// App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LandingPage from './LandingPage';
import DashBoard from './Dashboard';// Import your existing components

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/dashboard" element={<DashBoard />} />
        {/* Add more routes for other components/pages */}
      </Routes>
    </Router>
  );
};

export default App;
