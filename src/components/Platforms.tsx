import React, { useState, useEffect, useRef, useCallback } from 'react';
import TerminalWindow from './TerminalWindow';

interface PlatformItem {
    id: string;
    icon: string;
    color: string;
    softColor: string;
    glowClass: string;
    title: string;
    description: string;
    url: string;
    buttonText: string;
}

const platformData: PlatformItem[] = [
    {
        id: 'github', icon: 'fab fa-github',
        color: '#64748b', softColor: '#8B8FA0',
        glowClass: 'platform-glow-github',
        title: 'GitHub',
        description: '查看我的开源项目、代码仓库和贡献记录。包含C++项目、算法实现和个人工具库。',
        url: 'https://github.com/Sherry-love', buttonText: '访问 GitHub'
    },
    {
        id: 'leetcode', icon: 'fas fa-code',
        color: '#e89457', softColor: '#D4A882',
        glowClass: 'platform-glow-leetcode',
        title: 'LeetCode',
        description: '我的算法练习平台，包含50+道题解，涵盖动态规划、图论等算法专题。',
        url: 'https://leetcode.cn/u/xiao-yao-t3c/', buttonText: '查看题解'
    },
    {
        id: 'nowcoder', icon: 'fas fa-graduation-cap',
        color: '#5885c7', softColor: '#8295B8',
        glowClass: 'platform-glow-nowcoder',
        title: '牛客网',
        description: '编程练习和面试准备平台，包含算法题、面经分享和在线编程评测系统。',
        url: 'https://www.nowcoder.com/users/906354746', buttonText: '访问牛客网'
    },
    {
        id: 'kaggle', icon: 'fab fa-kaggle',
        color: '#4da6c4', softColor: '#7DAAB8',
        glowClass: 'platform-glow-kaggle',
        title: 'Kaggle',
        description: '数据科学和机器学习竞赛平台，参与过多个项目，学习数据分析和机器学习技术。',
        url: 'https://www.kaggle.com/liudonghui666', buttonText: '访问 Kaggle'
    },
    {
        id: 'luogu', icon: 'fas fa-laptop-code',
        color: '#cb6e6e', softColor: '#C49B9B',
        glowClass: 'platform-glow-luogu',
        title: '洛谷',
        description: '中文算法竞赛练习平台，已完成150+道题目。',
        url: 'https://www.luogu.com.cn/user/1658230', buttonText: 'AC'
    },
];

const PlatformCircle: React.FC<{
    platform: PlatformItem;
    index: number;
    isActive: boolean;
    baseRotation: number;
    numPlatforms: number;
    onClick: (index: number) => void;
}> = React.memo(({ platform, index, isActive, baseRotation, numPlatforms, onClick }) => {
    const radius = 210;
    const angle = (index / numPlatforms) * 2 * Math.PI + baseRotation;
    const x = radius * Math.cos(angle);
    const y = radius * Math.sin(angle);

    return (
        <div
            onClick={() => onClick(index)}
            className="absolute left-1/2 top-1/2 rounded-full flex items-center justify-center text-white cursor-pointer w-24 h-24 text-4xl transition-all duration-700 ease-in-out"
            style={{
                transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px)) scale(${isActive ? 1.25 : 0.9})`,
                zIndex: isActive ? 10 : 5,
                opacity: isActive ? 1 : 0.7,
                background: isActive
                    ? `linear-gradient(135deg, ${platform.color}, ${platform.color}cc)`
                    : `linear-gradient(135deg, ${platform.softColor}88, ${platform.softColor}66)`,
                boxShadow: isActive
                    ? `0 0 24px ${platform.color}40, 0 0 48px ${platform.color}20`
                    : `0 0 10px ${platform.softColor}20`,
            }}
            role="button" tabIndex={0} aria-label={platform.title}
        >
            <i className={platform.icon}></i>
        </div>
    );
});
PlatformCircle.displayName = 'PlatformCircle';

const Platforms: React.FC = () => {
    const [activeIndex, setActiveIndex] = useState(0);
    const timerRef = useRef<number | null>(null);

    const resetTimer = useCallback(() => {
        if (timerRef.current) clearTimeout(timerRef.current);
        timerRef.current = window.setTimeout(() => {
            setActiveIndex(prev => (prev + 1) % platformData.length);
        }, 15000);
    }, []);

    const handlePlatformClick = useCallback((index: number) => {
        if (index !== activeIndex) setActiveIndex(index);
    }, [activeIndex]);

    useEffect(() => {
        resetTimer();
        return () => { if (timerRef.current) clearTimeout(timerRef.current); };
    }, [activeIndex, resetTimer]);

    const activePlatform = platformData[activeIndex];
    const numPlatforms = platformData.length;
    const baseRotation = -Math.PI / 2 - (activeIndex / numPlatforms) * 2 * Math.PI;

    return (
        <TerminalWindow title="my_platforms/" icon={<i className="fas fa-folder-open"></i>}>
            <div className="flex flex-col items-center">
                <div className="relative w-full h-[540px] mb-4">
                    {/* 轨道环 */}
                    <div className="orbit-ring" />
                    <div className="orbit-ring-inner" />

                    {/* 中心声纳脉冲 */}
                    <div className="sonar-ring sonar-ring-1" />
                    <div className="sonar-ring sonar-ring-2" />
                    <div className="sonar-ring sonar-ring-3" />

                    {/* 中心毛玻璃球 */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-28 h-28 rounded-full flex items-center justify-center z-20"
                        style={{ background:'var(--pearl-white)',backdropFilter:'blur(8px)',WebkitBackdropFilter:'blur(8px)',border:'1px solid var(--pearl-border)',boxShadow:'0 4px 24px rgba(196,181,213,0.12)' }}>
                        <i className="fas fa-satellite-dish text-3xl" style={{ color:'var(--accent-purple)', opacity:0.7 }}></i>
                    </div>

                    {/* 位置标记点 */}
                    {platformData.map((p, i) => {
                        const angle = (i / numPlatforms) * 2 * Math.PI + baseRotation;
                        const mx = 230 * Math.cos(angle);
                        const my = 230 * Math.sin(angle);
                        return (
                            <div key={`dot-${p.id}`}
                                className="absolute top-1/2 left-1/2 w-2 h-2 rounded-full transition-all duration-700"
                                style={{
                                    transform: `translate(calc(-50% + ${mx}px), calc(-50% + ${my}px))`,
                                    background: i === activeIndex ? p.softColor : 'rgba(196,181,213,0.25)',
                                    boxShadow: i === activeIndex ? `0 0 6px ${p.softColor}` : 'none',
                                    zIndex: 1,
                                }}
                            />
                        );
                    })}

                    {/* 旋转层 */}
                    <div className="absolute top-1/2 left-1/2"
                        style={{ animation: 'orbit-spin 52s linear infinite', width: 0, height: 0 }}>
                        {platformData.map((platform, index) => (
                            <PlatformCircle key={platform.id} platform={platform} index={index}
                                isActive={index === activeIndex} baseRotation={baseRotation}
                                numPlatforms={numPlatforms} onClick={handlePlatformClick} />
                        ))}
                    </div>
                </div>

                {/* 信息卡片 */}
                <div key={activePlatform.id} className="text-center w-full md:w-2/3"
                    style={{ animation: 'text-fade-in 0.5s ease-out forwards' }}>
                    <div className="tag-badge inline-flex items-center gap-2 mb-3 px-4 py-1.5 rounded-full text-sm font-medium">
                        <i className={activePlatform.icon}></i>
                        <span>{activePlatform.title}</span>
                    </div>
                    <p className="mb-6 min-h-[48px] leading-relaxed" style={{ color:'var(--text-secondary)' }}>
                        {activePlatform.description}
                    </p>
                    <a href={activePlatform.url} target="_blank" rel="noopener noreferrer"
                        className="btn-pearl inline-flex items-center gap-2 px-7 py-2.5 rounded-full font-medium text-sm">
                        {activePlatform.buttonText} <i className="fas fa-arrow-right text-xs"></i>
                    </a>
                </div>
            </div>
        </TerminalWindow>
    );
};

export default Platforms;
