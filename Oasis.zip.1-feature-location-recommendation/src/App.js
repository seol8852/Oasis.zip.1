import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import LocationSelector from './pages/LocationSelector';
import Analysis from './pages/Analysis';
import Result from './pages/Result';
import AiRecommendation from './pages/AiRecommendation';
import Mood from './pages/Mood'; // 👈 새로 추가된 부분! Mood 컴포넌트 불러오기

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/nearby" element={<LocationSelector />} />
        <Route path="/analysis" element={<Analysis />} />
        <Route path="/result" element={<Result />} />
        <Route path="/ai-recommendation" element={<AiRecommendation />} />
        
        {/* 👈 새로 추가된 부분! /mood 경로로 오면 Mood 페이지를 보여주도록 설정 */}
        <Route path="/mood" element={<Mood />} /> 
      </Routes>
    </BrowserRouter>
  );
}

export default App;