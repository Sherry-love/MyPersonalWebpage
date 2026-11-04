import React, { useState, useEffect } from 'react';
import TypingEffect from './TypingEffect';

const Header: React.FC = () => {
    const [scrollY, setScrollY] = useState(0);

    useEffect(() => {
        const handleScroll = () => setScrollY(window.scrollY);
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // 视差：图标 0.3x，标题 0.15x，范围限制在 0-40px
    const iconOffset = Math.min(scrollY * 0.08, 32);
    const titleOffset = Math.min(scrollY * 0.04, 16);

    return (
        <header className="text-center py-16">
            <div
                className="inline-block p-6 rounded-full mb-6"
                style={{
                    background: 'rgba(232,226,240,0.3)',
                    transform: `translateY(${iconOffset}px)`,
                    transition: 'transform 0.05s linear',
                }}
            >
                <i className="fas fa-feather-alt text-5xl" style={{ color: 'var(--accent-purple)' }}></i>
            </div>
            <h1
                className="text-5xl md:text-7xl font-serif mb-4 heading-gradient"
                style={{
                    transform: `translateY(${titleOffset}px)`,
                    transition: 'transform 0.05s linear',
                }}
            >
                你好哇，我是刘东徽
            </h1>
            <div className="text-lg md:text-xl mb-8 font-mono h-7" style={{ color: 'var(--text-secondary)' }}>
                <span style={{ color: 'var(--accent-pink)' }} className="mr-1">~</span>
                <TypingEffect text="Computer Science & Technology Student" loop loopDelay={30000} />
                <span className="animate-pulse">_</span>
            </div>
            <div className="flex justify-center flex-wrap gap-4 md:gap-6">
                <div className="contact-pill flex items-center gap-2 px-4 py-2 rounded-full">
                    <i className="fas fa-envelope" style={{ color: 'var(--accent-purple)' }}></i>
                    <span>2594188081@qq.com</span>
                </div>
                <div className="contact-pill flex items-center gap-2 px-4 py-2 rounded-full">
                    <i className="fas fa-map-marker-alt" style={{ color: 'var(--accent-purple)' }}></i>
                    <span>中国 · 青岛</span>
                </div>
                <div className="contact-pill flex items-center gap-2 px-4 py-2 rounded-full">
                    <i className="fas fa-university" style={{ color: 'var(--accent-purple)' }}></i>
                    <span>青岛大学计算机系</span>
                </div>
            </div>
        </header>
    );
};

export default Header;
