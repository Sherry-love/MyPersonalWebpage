import React, { useMemo } from 'react';

interface Petal {
    id: number;
    left: string;
    size: string;
    duration: string;
    delay: string;
    drift: string;
    spin: string;
    sway: string;
    swayDur: string;
    color: string;
    opacity: number;
}

interface PetalFallProps {
    /** 花瓣颜色主题：spring=pink, autumn=gold, morning=white, default=lavender */
    theme?: 'spring' | 'autumn' | 'morning' | 'default';
}

const THEME_COLORS: Record<string, string[]> = {
    spring:  ['#f0d0d8', '#e8c0d0', '#f2dae0', '#ecd4dc'],
    autumn:  ['#e8dcc8', '#d8c898', '#f0e4d0', '#e0d4b8'],
    morning: ['#e8e8f0', '#dce0ec', '#f0f0f8', '#e4e8f0'],
    default: ['#e8d8f0', '#dcd0e8', '#f0e4f8', '#e4d8ec'],
};

/**
 * 花瓣飘落组件
 * 渲染 3-5 片极低透明度花瓣，极慢速度自然飘落
 * 仅在首页使用，营造若隐若现的意境
 */
const PetalFall: React.FC<PetalFallProps> = ({ theme = 'default' }) => {
    const petals = useMemo(() => {
        const colors = THEME_COLORS[theme] || THEME_COLORS.default;
        const count = 4;
        const items: Petal[] = [];

        for (let i = 0; i < count; i++) {
            items.push({
                id: i,
                left: `${Math.random() * 90 + 5}%`,
                size: `${Math.random() * 8 + 6}px`,
                duration: `${Math.random() * 20 + 40}s`,
                delay: `${Math.random() * 30}s`,
                drift: `${(Math.random() - 0.5) * 120}px`,
                spin: `${(Math.random() - 0.5) * 720}deg`,
                sway: `${(Math.random() - 0.5) * 40}px`,
                swayDur: `${Math.random() * 3 + 4}s`,
                color: colors[Math.floor(Math.random() * colors.length)],
                opacity: Math.random() * 0.08 + 0.06,
            });
        }
        return items;
    }, [theme]);

    return (
        <>
            {petals.map((p) => (
                <div
                    key={p.id}
                    className="petal"
                    style={{
                        left: p.left,
                        width: p.size,
                        height: p.size,
                        borderRadius: '50% 0 50% 0',
                        background: p.color,
                        opacity: p.opacity,
                        animationDelay: p.delay,
                        '--duration': p.duration,
                        '--drift': p.drift,
                        '--spin': p.spin,
                        '--sway': p.sway,
                        '--sway-dur': p.swayDur,
                    } as React.CSSProperties}
                />
            ))}
        </>
    );
};

export default PetalFall;
