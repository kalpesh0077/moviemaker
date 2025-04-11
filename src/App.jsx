import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import MovieGenerator from './components/MovieGenerator';
import './App.css';
import ImageToVideo from './components/ImageToVideo';
import ImageGenerator from './components/VideoGenerator';

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <Routes>
          <Route path="/" element={<MovieGenerator />} />
          <Route path="/video" element={<ImageGenerator />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App; 