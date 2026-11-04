import React, { useState, useEffect } from 'react';
import TypingEffect from './TypingEffect';
import { useAmbient, type TimePhase, type WeatherKind } from '../ambient/AmbientContext';

const WEATHER_ICON: Record<WeatherKind, string> = {
    clear: 'fa-sun',
    cloudy: 'fa-cloud',
    fog: 'fa-smog',
    rain: 'fa-cloud-rain',
    snow: 'fa-snowflake',
    thunder: 'fa-cloud-bolt',
};

function weatherIcon(weather: WeatherKind, phase: TimePhase): string {
    if (weather === 'clear' && (phase === 'night' || phase === 'dawn')) return 'fa-moon';
    return WEATHER_ICON[weather];
}

const Header: React.FC = () => {
    const [scrollY, setScrollY] = useState(0);
    const ambient = useAmbient();

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
                <div className="contact-pill flex items-center gap-2 px-4 py-2 rounded-full"
                    title={`${ambient.phaseLabel} · 天气数据来自 open-meteo`}>
                    <i className={`fas ${weatherIcon(ambient.weather, ambient.phase)}`} style={{ color: 'var(--accent-purple)' }}></i>
                    <span>
                        此刻 · {ambient.city} ·{' '}
                        {ambient.ready
                            ? `${ambient.weatherLabel}${ambient.temperature !== null ? ` ${Math.round(ambient.temperature)}°C` : ''}`
                            : ambient.phaseLabel}
                    </span>
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
