import React from 'react';
import Navbar from '../components/Navbar';
import Header from '../components/Header';
import About from '../components/About';
import Skills from '../components/Skills';
import Platforms from '../components/Platforms';
import Projects from '../components/Projects';
import Footer from '../components/Footer';
import Hobbies from '../components/Hobbies';
import Achievements from '../components/Achievements';
import GitHubGarden from '../components/GitHubGarden';
import WordCloud from '../components/WordCloud';
import RevealOnScroll from '../components/RevealOnScroll';
import BackToTop from '../components/BackToTop';
import PetalFall from '../components/PetalFall';

const Home: React.FC = () => {
    return (
        <div className="min-h-screen" style={{ background: 'transparent' }}>
            <PetalFall theme="spring" />
            <Navbar />
            <div className="relative z-10 container mx-auto p-4 sm:p-6 md:p-8 pt-20">
                <main className="space-y-12">
                    <RevealOnScroll delay={0}><Header /></RevealOnScroll>
                    <RevealOnScroll delay={60}><About /></RevealOnScroll>
                    <RevealOnScroll delay={120}><GitHubGarden /></RevealOnScroll>
                    <RevealOnScroll delay={180}><Skills /></RevealOnScroll>
                    <RevealOnScroll delay={210}><WordCloud /></RevealOnScroll>
                    <RevealOnScroll delay={240}><Platforms /></RevealOnScroll>
                    <RevealOnScroll delay={300}><Hobbies /></RevealOnScroll>
                    <RevealOnScroll delay={360}><Achievements /></RevealOnScroll>
                    <RevealOnScroll delay={420}><Projects /></RevealOnScroll>
                </main>
                <RevealOnScroll delay={480}><Footer /></RevealOnScroll>
            </div>
            <BackToTop />
        </div>
    );
};

export default Home;
