import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import Header from './components/Header';
import Peer from './components/Peer';
import Webhooks from './components/Webhooks';
import Login from './components/Login';
import Navbar from './components/Navbar';

const API_BASE_URL = 'https://bhs.popwu.com/api/v1';

const App: React.FC = () => {
  const [token, setToken] = useState<string | null>(null);

  const handleLogin = (newToken: string) => {
    setToken(newToken);
  };

  if (!token) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <Navbar />
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <Routes>
            <Route path="/" element={<Navigate to="/header" replace />} />
            <Route path="/header" element={<Header token={token} apiBaseUrl={API_BASE_URL} />} />
            <Route path="/peer" element={<Peer token={token} apiBaseUrl={API_BASE_URL} />} />
            <Route path="/webhooks" element={<Webhooks token={token} apiBaseUrl={API_BASE_URL} />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;