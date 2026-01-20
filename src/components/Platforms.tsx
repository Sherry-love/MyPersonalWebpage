import React, { useState, useEffect, useRef, useCallback } from 'react';
import TerminalWindow from './TerminalWindow';

// Data for each platform
const platformData = [
    {
        id: 'github',
        icon: 'fab fa-github',
        colorClasses: 'bg-slate-500 hover:bg-slate-600',
        title: 'GitHub',
        description: '查看我的开源项目、代码仓库和贡献记录。包含C++项目、算法实现和个人工具库。',
        url: 'https://github.com/Sherry-love',
        buttonText: '访问 GitHub'
    },
    {
        id: 'leetcode',
        icon: 'fas fa-code',
        colorClasses: 'bg-orange-500 hover:bg-orange-600',
        title: 'LeetCode',
        description: '我的算法练习平台，包含50+道题解，涵盖动态规划、图论、数据结构等算法专题。',
        url: 'https://leetcode.cn/u/xiao-yao-t3c/',
        buttonText: '查看题解'
    },
    {
        id: 'kaggle',
        icon: 'fab fa-kaggle',
        colorClasses: 'bg-sky-500 hover:bg-sky-600',
        title: 'Kaggle',
        description: '数据科学和机器学习竞赛平台，参与过多个项目，学习数据分析和机器学习技术。',
        url: 'https://www.kaggle.com/liudonghui666',
        buttonText: '访问 Kaggle'
    },
    {
        id: 'luogu',
        icon: 'fas fa-laptop-code',
        colorClasses: 'bg-red-500 hover:bg-red-600',
        title: '洛谷',
        description: '中文算法竞赛练习平台，已完成150+道题目。',
        url: 'https://www.luogu.com.cn/user/1658230',
        buttonText: 'AC'
    },
];

const Platforms: React.FC = () => {
    const [activeIndex, setActiveIndex] = useState(0);
    const [continuousRotation, setContinuousRotation] = useState(0);
    const timerRef = useRef<number | null>(null);
    const animationFrameRef = useRef<number | null>(null);

    const resetTimer = useCallback(() => {
        if (timerRef.current) clearTimeout(timerRef.current);
        timerRef.current = window.setTimeout(() => {
            setActiveIndex(prev => (prev + 1) % platformData.length);
        }, 15000);
    }, []);

    const handlePlatformClick = (index: number) => {
        if (index !== activeIndex) {
            setActiveIndex(index);
        }
    };

    useEffect(() => {
        resetTimer();
        return () => {
            if (timerRef.current) clearTimeout(timerRef.current);
        };
    }, [activeIndex, resetTimer]);

    useEffect(() => {
        const animate = () => {
            setContinuousRotation(prev => (prev + 0.002) % (Math.PI * 2));
            animationFrameRef.current = requestAnimationFrame(animate);
        };
        animationFrameRef.current = requestAnimationFrame(animate);
        return () => {
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }
        };
    }, []);

    const activePlatform = platformData[activeIndex];
    const radius = 200;
    const numPlatforms = platformData.length;

    // Calculate the base rotation to bring the active item to the top (-90 degrees)
    const targetAngle = -Math.PI / 2;
    const baseRotation = targetAngle - (activeIndex / numPlatforms) * 2 * Math.PI;

    return (
        <TerminalWindow title="my_platforms/" icon={<i className="fas fa-folder-open"></i>}>
            <div className="flex flex-col items-center">
                <div className="relative w-full h-[500px] mb-6">
                    {/* Decorative static center piece */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-white/30 backdrop-blur-sm rounded-full flex items-center justify-center border border-violet-200 transition-all duration-500">
                        <i className="fas fa-satellite-dish text-5xl text-violet-400 text-glow"></i>
                    </div>

                    {platformData.map((platform, index) => {
                        const isActive = index === activeIndex;
                        const angle = (index / numPlatforms) * 2 * Math.PI + baseRotation + continuousRotation;

                        const x = radius * Math.cos(angle);
                        const y = radius * Math.sin(angle);

                        const style: React.CSSProperties = {
                            transition: 'transform 0.7s ease-in-out, opacity 0.7s, filter 0.7s',
                            position: 'absolute', left: '50%', top: '50%',
                            transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px)) scale(${isActive ? 1.2 : 0.9})`,
                            zIndex: isActive ? 10 : 5,
                            opacity: isActive ? 1 : 0.6,
                            filter: isActive ? 'brightness(1)' : 'brightness(0.8)',
                        };

                        return (
                            <div
                                key={platform.id}
                                onClick={() => handlePlatformClick(index)}
                                className={`rounded-full flex items-center justify-center text-white shadow-lg cursor-pointer w-24 h-24 text-4xl ${platform.colorClasses}`}
                                style={style}
                                role="button"
                                tabIndex={0}
                                aria-label={platform.title}
                            >
                                <i className={platform.icon}></i>
                            </div>
                        );
                    })}
                </div>

                <div key={activePlatform.id} className="text-center w-full md:w-2/3" style={{ animation: 'text-fade-in 0.5s ease-out forwards' }}>
                    <h3 className="text-3xl font-bold text-slate-800 mb-2">{activePlatform.title}</h3>
                    <p className="text-slate-500 mb-6 min-h-[48px]">{activePlatform.description}</p>
                    <a
                        href={activePlatform.url} target="_blank" rel="noopener noreferrer"
                        className={`inline-block text-white font-semibold px-8 py-3 rounded-full transition-all duration-300 transform hover:-translate-y-1 shadow-lg hover:shadow-xl ${activePlatform.colorClasses}`}
                    >
                        {activePlatform.buttonText}
                    </a>
                </div>
            </div>
        </TerminalWindow>
    );
};

export default Platforms;
