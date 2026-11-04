import React, { useState, useEffect } from 'react';

/**
 * 顶部滚动进度条
 * 2px 极细渐变线条，从 0→100% 随页面滚动变化
 * 固定在页面最顶部，z-index 高于导航栏
 */
const ScrollProgress: React.FC = () => {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const handleScroll = () => {
            const scrollTop = window.scrollY;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            if (docHeight <= 0) {
                setProgress(0);
                return;
            }
            setProgress(Math.min(100, Math.round((scrollTop / docHeight) * 100)));
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll();
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                height: '2px',
                width: `${progress}%`,
                background: 'linear-gradient(90deg, var(--accent-purple), var(--accent-pink), var(--accent-gold))',
                transition: 'width 0.12s linear',
                zIndex: 100,
                pointerEvents: 'none',
                borderRadius: '0 2px 2px 0',
            }}
            aria-hidden="true"
        />
    );
};

export default ScrollProgress;
