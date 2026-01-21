import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import PageA1 from './pages/PageA1';
import PageA2 from './pages/PageA2';
import PageA3 from './pages/PageA3';
import PageA4 from './pages/PageA4';
import ParticleEffect from './components/ParticleEffect';

const App: React.FC = () => {
    return (
        <div className="relative min-h-screen text-slate-700 font-sans">
            {/* 全局粒子特效 - 放在最外层 */}
            <ParticleEffect />

            {/* 页面内容 */}
            <div className="relative z-10">
                <Router>
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/a1" element={<PageA1 />} />
                        <Route path="/a2" element={<PageA2 />} />
                        <Route path="/a3" element={<PageA3 />} />
                        <Route path="/a4" element={<PageA4 />} />
                    </Routes>
                </Router>
            </div>
        </div>
    );
};

export default App;