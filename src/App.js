import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Analysis from './pages/Analysis';
import Result from './pages/Result';
import LocationSelector from './pages/LocationSelector'; // 새로 추가

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/analysis" element={<Analysis />} />
        <Route path="/result" element={<Result />} />
        <Route path="/location-selector" element={<LocationSelector />} /> {/* 새로 추가 */}
      </Routes>
    </Router>
  );
}

export default App;