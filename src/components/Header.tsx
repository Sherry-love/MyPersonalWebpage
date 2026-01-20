import React from 'react';
import TypingEffect from './TypingEffect';

const Header: React.FC = () => {
    return (
        <header className="text-center py-16">
            <div className="inline-block p-6 rounded-full bg-violet-200/30 mb-6">
                <i className="fas fa-code text-5xl text-violet-500 text-glow"></i>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold text-slate-800 mb-4">
                <span className="animate-gradient-text text-glow">你好哇，我是刘东徽</span>
            </h1>
            <div className="tagline text-lg md:text-xl text-slate-500 mb-8 font-mono h-7">
                <span className="text-pink-500 mr-1">~</span>
                <TypingEffect text="Computer Science & Technology Student" loop loopDelay={30000} />
                <span className="animate-pulse">_</span>
            </div>
            <div className="flex justify-center flex-wrap gap-4 md:gap-6">
                <div className="contact-item flex items-center gap-2 bg-white/70 px-4 py-2 rounded-full border border-violet-200">
                    <i className="fas fa-envelope text-violet-500"></i>
                    <span>2594188081@qq.com</span>
                </div>
                <div className="contact-item flex items-center gap-2 bg-white/70 px-4 py-2 rounded-full border border-violet-200">
                    <i className="fas fa-map-marker-alt text-violet-500"></i>
                    <span>中国 • 青岛</span>
                </div>
                <div className="contact-item flex items-center gap-2 bg-white/70 px-4 py-2 rounded-full border border-violet-200">
                    <i className="fas fa-university text-violet-500"></i>
                    <span>青岛大学计算机系</span>
                </div>
            </div>
        </header>
    );
};

export default Header;