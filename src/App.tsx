import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { ThemeProvider } from './components/ThemeContext';
import Home from './pages/Home';
import PageA4 from './pages/PageA4';
import EssayPage from './pages/EssayPage';
import ProjectShowcase from './pages/ProjectShowcase';
import ResearchPage from './pages/ResearchPage';
import NotFound from './pages/NotFound';
import PhotosPage from './pages/PhotosPage';
import AmbientMood from './components/AmbientMood';
import { AmbientProvider } from './ambient/AmbientContext';
import Snail from './components/Snail';
import KonamiEgg from './components/KonamiEgg';
import ParticleEffect from './components/ParticleEffect';
import SmoothScroll from './components/SmoothScroll';
import RisingDrops from './components/RisingDrops';
import AmbientBackground from './components/AmbientBackground';
import RouteTransition from './components/RouteTransition';
import ScrollProgress from './components/ScrollProgress';
import MouseGlow from './components/MouseGlow';
import type { FC } from 'react';

const seasonMap: Record<string, 'spring' | 'autumn' | 'morning' | 'default'> = {
    '/': 'spring',
    '/a3': 'autumn',
    '/a4': 'morning',
};

// 部署到 GitHub Pages 的 /MyPersonalWebpage/ 子路径时，路由要带上同样的前缀
const basename = import.meta.env.BASE_URL.replace(/\/$/, '') || '/';

const AppContent: FC = () => {
    const location = useLocation();
    const season = seasonMap[location.pathname] || 'default';

    // 页面加载入场状态
    const [isAppReady, setIsAppReady] = useState(false);
    useEffect(() => {
        const timer = setTimeout(() => setIsAppReady(true), 60);
        return () => clearTimeout(timer);
    }, []);

    return (
        <div
            className="relative min-h-screen"
            style={{
                color: 'var(--text-primary)',
                opacity: isAppReady ? 1 : 0,
                filter: isAppReady ? 'blur(0px)' : 'blur(3px)',
                transition: 'opacity 0.45s cubic-bezier(0.16, 1, 0.3, 1), filter 0.45s cubic-bezier(0.16, 1, 0.3, 1)',
            }}
        >
            <AmbientBackground season={season} />
            <AmbientMood />
            <RisingDrops />
            <MouseGlow />
            <ParticleEffect />
            <Snail />
            <KonamiEgg />
            <SmoothScroll />
            <ScrollProgress />

            <div className="relative z-10">
                <RouteTransition key={location.pathname}>
                    <Routes location={location}>
                        <Route path="/" element={<Home />} />
                        <Route path="/a1" element={<ResearchPage />} />
                        <Route path="/a2" element={<ProjectShowcase />} />
                        <Route path="/a3" element={<EssayPage />} />
                        <Route path="/photos" element={<PhotosPage />} />
                        <Route path="/a4" element={<PageA4 />} />
                        <Route path="*" element={<NotFound />} />
                    </Routes>
                </RouteTransition>
            </div>
        </div>
    );
};

const App: FC = () => (
    <ThemeProvider>
        <AmbientProvider>
            <Router basename={basename}>
                <AppContent />
            </Router>
        </AmbientProvider>
    </ThemeProvider>
);

export default App;
