// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProtectedRoute from './components/ProtectedRoute';
import AgentDashboard from './pages/AgentDashboard';
import OperatorDashboard from './pages/OperatorDashboard';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        <Route path="/dashboard/agent" element={
          <ProtectedRoute>
            <AgentDashboard />
          </ProtectedRoute>
        } />

        <Route path="/dashboard/operator" element={
          <ProtectedRoute>
            <OperatorDashboard />
          </ProtectedRoute>
        } />
      </Routes>
    </Router>
  );
};

export default App;
