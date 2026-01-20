import React from 'react';
import Navbar from '../components/Navbar'; // 添加这行
import Header from '../components/Header';
import About from '../components/About';
import Skills from '../components/Skills';
import Platforms from '../components/Platforms';
import Projects from '../components/Projects';
import Footer from '../components/Footer';
import ParticleEffect from '../components/ParticleEffect';
import Hobbies from '../components/Hobbies';
import Achievements from '../components/Achievements';

const Home: React.FC = () => {
    return (
        <div className="bg-rose-50 min-h-screen text-slate-700 font-sans">
            <ParticleEffect />
            {/* 添加导航栏 */}
            <Navbar />
            <div className="relative z-10 container mx-auto p-4 sm:p-6 md:p-8 pt-20"> {/* 添加pt-20给导航栏留出空间 */}
                <main className="space-y-12">
                    <Header />
                    <About />
                    <Skills />
                    <Platforms />
                    <Hobbies />
                    <Achievements />
                    <Projects />
                </main>
                <Footer />
            </div>
        </div>
    );
};

export default Home;