import React from 'react';
import Header from './components/Header';
import About from './components/About';
import Skills from './components/Skills';
import Platforms from './components/Platforms';
import Projects from './components/Projects';
import Footer from './components/Footer';
import ParticleEffect from './components/ParticleEffect';

const App: React.FC = () => {
    return (
        <div className="bg-rose-50 min-h-screen text-slate-700 font-sans">
            <ParticleEffect />
            <div className="relative z-10 container mx-auto p-4 sm:p-6 md:p-8">
                <main className="space-y-12">
                    <Header />
                    <About />
                    <Skills />
                    <Platforms />
                    <Projects />
                </main>
                <Footer />
            </div>
        </div>
    );
};

export default App;
