import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Auth from './components/Auth';
import Dashboard from './components/Dashboard';
import PuzzlePage from './pages/PuzzlePage';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Auth type="login" />} />
        <Route path="/register" element={<Auth type="register" />} />
        <Route path="/puzzle" element={<PuzzlePage />} />
        <Route
          path="/dashboard"
          element={
            <div className="page-container">
              <Dashboard />
            </div>
          }
        />
        <Route path="/" element={<Navigate to="/puzzle" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
