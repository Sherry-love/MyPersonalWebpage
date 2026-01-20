// src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import PageA1 from './pages/PageA1';
import PageA2 from './pages/PageA2';
import PageA3 from './pages/PageA3';
import PageA4 from './pages/PageA4';

const App: React.FC = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/a1" element={<PageA1 />} />
                <Route path="/a2" element={<PageA2 />} />
                <Route path="/a3" element={<PageA3 />} />
                <Route path="/a4" element={<PageA4 />} />
            </Routes>
        </Router>
    );
};

export default App;