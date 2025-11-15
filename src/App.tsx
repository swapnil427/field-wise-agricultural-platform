import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import Weather from './components/Weather';
import CropDiseaseDetector from './components/CropDiseaseDetector';
import CommunityChat from './components/CommunityChat';
import AIChatbot from './components/AIChatbot';
import QueriesPage from './components/QueriesPage';
import NetworkDashboard from './components/NetworkDashboard';
import LandingPage from './components/LandingPage';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <div className="min-h-screen bg-green-50">
          <Routes>
            {/* Landing page without navbar */}
            <Route path="/" element={<LandingPage />} />
            
            {/* All other routes with navbar */}
            <Route path="/*" element={
              <>
                <Navbar />
                <Routes>
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/weather" element={<Weather />} />
                  <Route path="/crop-health" element={<CropDiseaseDetector />} />
                  <Route path="/community" element={<CommunityChat />} />
                  <Route path="/chatbot" element={<AIChatbot />} />
                  <Route path="/queries" element={<QueriesPage />} />
                  <Route path="/network" element={<NetworkDashboard />} />
                </Routes>
              </>
            } />
          </Routes>
        </div>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
