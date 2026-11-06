import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import type { Components } from 'react-markdown';
import readmeRaw from '../../README.md?raw';
import { lastUpdated, timeline, type TimelineEntry } from '../data/timeline';

// ---- 流态旋转时间轴 ----
const FluidTimeline: React.FC<{ entries: TimelineEntry[] }> = ({ entries }) => {
    const n = entries.length;
    const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
    const [rotation, setRotation] = useState(0);
    const pausedRef = useRef(false);
    // 手机上圆形轨道放不下卡片，降级为竖直时间轴
    const [isNarrow, setIsNarrow] = useState(
        () => typeof window !== 'undefined' && window.innerWidth < 768
    );

    useEffect(() => {
        const onResize = () => setIsNarrow(window.innerWidth < 768);
        window.addEventListener('resize', onResize);
        return () => window.removeEventListener('resize', onResize);
    }, []);

    // JS 驱动旋转，每 50ms 更新，悬停时暂停
    useEffect(() => {
        if (isNarrow) return;
        const interval = setInterval(() => {
            if (!pausedRef.current) {
                setRotation(prev => prev + 0.006);
            }
        }, 50);
        return () => clearInterval(interval);
    }, [isNarrow]);

    if (n === 0) return null;

    if (isNarrow) {
        return (
            <ol className="relative pl-7">
                <div
                    className="absolute left-[5px] top-2 bottom-2 w-px"
                    style={{ background: 'linear-gradient(180deg, var(--accent-purple), var(--accent-pink))' }}
                />
                {entries.map((entry, i) => (
                    <li key={`${entry.date}-${i}`} className="relative pb-6 last:pb-0">
                        <span
                            className="absolute -left-7 top-1.5 w-3 h-3 rounded-full border-2"
                            style={{ borderColor: 'var(--accent-purple)', background: 'var(--mist-base)' }}
                        />
                        <div className="font-mono text-xs mb-1" style={{ color: 'var(--accent-purple)' }}>
                            {entry.date}
                        </div>
                        <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                            {entry.content}
                        </p>
                    </li>
                ))}
            </ol>
        );
    }

    const R = 300;
    const center = R + 80;
    const cx = '50%';
    const cy = '50%';

    return (
        <div style={{ position: 'relative', width: '100%', height: center * 2, overflow: 'hidden' }}>
            {/* 左半圆（CSS radial-gradient，圆心在右边缘，日/夜适配） */}
            <div className="timeline-left-overlay" style={{
                position: 'absolute', left: 0, top: 0,
                width: '50%', height: '100%',
                zIndex: 11,
            }} />


            {/* 中心白圆（独立层，跨越左右，不被左遮罩遮挡） */}
            <div style={{
                position: 'absolute',
                left: cx, top: cy,
                width: R * 0.5, height: R * 0.5,
                transform: 'translate(-50%, -50%)',
                borderRadius: '50%',
                background: '#FFFFFF',
                border: '1px solid var(--pearl-border)',
                zIndex: 12,
            }} />

            {/* 圆环1：紧挨白圆，宽度0.6，深淡紫，仅右半 */}
            <div style={{
                position: 'absolute',
                left: cx, top: cy,
                width: 224, height: 224,
                transform: 'translate(-50%, -50%)',
                borderRadius: '50%',
                border: '42px solid rgba(160,140,180,0.45)',
                clipPath: 'inset(0 0 0 50%)',
                zIndex: 3,
            }} />

            {/* 圆环2：紧接环1，宽度1.2，更淡紫，仅右半 */}
            <div style={{
                position: 'absolute',
                left: cx, top: cy,
                width: 392, height: 392,
                transform: 'translate(-50%, -50%)',
                borderRadius: '50%',
                border: '84px solid rgba(190,180,210,0.25)',
                clipPath: 'inset(0 0 0 50%)',
                zIndex: 3,
            }} />

            {/* 旋转容器（仅公转，不自转） */}
            <div
                onMouseEnter={() => { pausedRef.current = true; }}
                onMouseLeave={() => { pausedRef.current = false; }}
                style={{
                    position: 'absolute',
                    left: cx, top: cy,
                    width: 0, height: 0,
                    transform: `rotate(${rotation}rad)`,
                    zIndex: 4,
                }}
            >
                {entries.map((entry, i) => {
                    const angleStep = (2 * Math.PI) / n;
                    const baseAngle = -Math.PI / 2 + i * angleStep;
                    const currentAngle = baseAngle + rotation;
                    const normalizedAngle = ((currentAngle % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);
                    const cosA = Math.cos(normalizedAngle);
                    const visible = cosA > 0.05;
                    const x = R * Math.cos(baseAngle);
                    const y = R * Math.sin(baseAngle);
                    const isHovered = hoveredIdx === i;
                    const depth = (cosA + 1) / 2;

                    if (!visible) return null;

                    return (
                        <div
                            key={i}
                            onMouseEnter={() => { pausedRef.current = true; setHoveredIdx(i); }}
                            onMouseLeave={() => { pausedRef.current = false; setHoveredIdx(null); }}
                            className="glass-card"
                            style={{
                                position: 'absolute',
                                left: x, top: y,
                                transform: `translate(-50%, -50%) rotate(${-rotation}rad) scale(${isHovered ? 1.06 : 0.85 + depth * 0.15})`,
                                width: 200,
                                padding: '8px 14px',
                                opacity: isHovered ? 1 : 0.35 + depth * 0.65,
                                zIndex: isHovered ? 10 : Math.round(depth * 5),
                                transition: 'opacity 0.6s, transform 0.6s',
                                cursor: 'default',
                            }}
                        >
                            <div className="font-mono text-xs mb-1" style={{ color: 'var(--accent-purple)' }}>
                                {entry.date}
                            </div>
                            {entry.content && (
                                <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                                    {entry.content}
                                </p>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

// README 是这一页的正文来源；时间轴已经独立到 src/data/timeline.ts。
// 网页上只保留自我介绍、技术栈和碎碎念；下面这些偏「仓库说明」的内容
// 仍留在 README 里给仓库看，但不进简介页。
const readmeBody = (() => {
    let body = readmeRaw;

    // 顶部的在线地址
    body = body.replace(/^> 在线地址：.*(?:\r?\n)?/m, '');

    // 「项目介绍」里的功能清单 + 彩蛋清单
    const features = body.indexOf('**几个自己比较喜欢的部分**');
    const thoughts = body.indexOf('## 碎碎念');
    if (features !== -1 && thoughts !== -1 && thoughts > features) {
        body = body.slice(0, features) + body.slice(thoughts);
    }

    // 整段只在仓库里保留的章节
    const stripSection = (markdown: string, title: string) => {
        const start = markdown.indexOf(`\n## ${title}`);
        if (start === -1) return markdown;
        const next = markdown.indexOf('\n## ', start + 4);
        return markdown.slice(0, start) + (next === -1 ? '' : markdown.slice(next));
    };
    for (const title of ['内容介绍', '项目文件注释', '维护与部署', '简单记录']) {
        body = stripSection(body, title);
    }

    return body.replace(/\n{3,}/g, '\n\n').trimEnd();
})();

const PageA4: React.FC = () => {
    const markdownComponents: Components = {
        code: ({ className, children, ...props }) => {
            const isInline = !className?.includes('language-');
            if (isInline) return <code className="tag-badge px-1.5 py-0.5 rounded text-sm font-mono" {...props}>{children}</code>;
            return (
                <div className="my-4 overflow-hidden rounded-lg border" style={{ borderColor: 'var(--pearl-border)' }}>
                    <pre className="p-4 overflow-auto text-sm" style={{ background: 'var(--mist-purple)', color: 'var(--text-primary)' }}>
                        <code className="font-mono" {...props}>{children}</code>
                    </pre>
                </div>
            );
        },
        h1: ({ children, ...props }) => (
            <h1 className="text-3xl font-serif mt-8 mb-6 pb-3 border-b flex items-center gap-3" style={{ borderColor:'var(--pearl-border)',color:'var(--text-primary)' }} {...props}>
                <i className="fas fa-star text-xl" style={{ color:'var(--accent-purple)' }}></i>{children}
            </h1>
        ),
        h2: ({ children, ...props }) => (
            <h2 className="text-2xl font-serif mt-8 mb-4 flex items-center gap-3" style={{ color:'var(--text-primary)' }} {...props}>
                <i className="fas fa-file-alt" style={{ color:'var(--accent-pink)' }}></i>{children}
            </h2>
        ),
        h3: ({ children, ...props }) => <h3 className="text-xl font-serif mt-6 mb-3" style={{ color:'var(--text-primary)' }} {...props}>{children}</h3>,
        p: ({ children, ...props }) => <p className="leading-relaxed mb-4 text-lg" style={{ color:'var(--text-secondary)' }} {...props}>{children}</p>,
        ul: ({ children, ...props }) => <ul className="list-disc pl-6 mb-4 space-y-2" style={{ color:'var(--text-secondary)' }} {...props}>{children}</ul>,
        ol: ({ children, ...props }) => <ol className="list-decimal pl-6 mb-4 space-y-2" style={{ color:'var(--text-secondary)' }} {...props}>{children}</ol>,
        li: ({ children, ...props }) => <li className="mb-1.5" {...props}>{children}</li>,
        blockquote: ({ children, ...props }) => (
            <div className="my-6">
                <div className="relative border-l-4 pl-6 py-2 rounded-r-lg" style={{ borderColor:'var(--accent-purple)',background:'rgba(232,226,240,0.25)' }}>
                    <div className="absolute left-0 top-0 bottom-0 w-1" style={{ background:'linear-gradient(180deg,var(--accent-purple),var(--accent-pink))' }}></div>
                    <blockquote className="italic text-lg leading-relaxed" style={{ color:'var(--text-secondary)' }} {...props}>{children}</blockquote>
                    <div className="mt-3 text-sm flex items-center gap-2" style={{ color:'var(--text-secondary)' }}>
                        <i className="fas fa-quote-right"></i><span>摘自贴吧网友</span>
                    </div>
                </div>
            </div>
        ),
        a: ({ children, ...props }) => <a style={{ color:'var(--accent-purple)' }} className="underline font-medium" target="_blank" rel="noopener noreferrer" {...props}>{children}</a>,
        strong: ({ children, ...props }) => <strong style={{ color:'var(--text-primary)' }} {...props}>{children}</strong>,
        table: ({ children, ...props }) => <table className="min-w-full border-collapse my-4 rounded-lg overflow-hidden" style={{ borderColor:'var(--pearl-border)' }} {...props}>{children}</table>,
        th: ({ children, ...props }) => <th className="p-3 text-left font-semibold" style={{ background:'var(--mist-purple)',color:'var(--text-primary)',borderColor:'var(--pearl-border)' }} {...props}>{children}</th>,
        td: ({ children, ...props }) => <td className="p-3" style={{ borderColor:'var(--pearl-border)' }} {...props}>{children}</td>,
        hr: (props) => <hr className="my-8 border-t" style={{ borderColor:'var(--pearl-border)' }} {...props} />,
    };

    return (
        <div className="min-h-screen" style={{ background: 'transparent' }}>
            <Navbar />
            <div className="container mx-auto p-4 md:p-8" style={{ paddingTop: '6rem' }}>
                <div className="max-w-4xl mx-auto">
                    <div className="mb-8 text-center">
                        <h1 className="text-4xl font-serif mb-2" style={{ color:'var(--text-primary)' }}>我的个人网页</h1>
                        <p style={{ color:'var(--text-secondary)' }}>关于这个项目的设计理念、技术栈和开发历程</p>
                        {lastUpdated && (
                            <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm tag-badge">
                                <i className="fas fa-calendar-alt"></i><span>最后更新: {lastUpdated}</span>
                            </div>
                        )}
                    </div>

                    <div className="glass-card p-6 md:p-8">
                        <div>
                            <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>{readmeBody}</ReactMarkdown>

                                <div className="mt-12 pt-8 border-t" style={{ borderColor:'var(--pearl-border)' }}>
                                    <h3 className="text-2xl font-serif mb-8 flex items-center gap-3" style={{ color:'var(--text-primary)' }}>
                                        <i className="fas fa-history" style={{ color:'var(--accent-purple)' }}></i>开发时间线
                                    </h3>
                                    {/* 流态旋转时间轴 */}
                                    <FluidTimeline entries={timeline} />
                                </div>

                                <div className="mt-12 p-6 rounded-xl border" style={{ background:'linear-gradient(135deg,rgba(232,226,240,0.25),rgba(240,228,224,0.25))',borderColor:'var(--accent-purple)' }}>
                                    <div className="flex items-start gap-4">
                                        <div className="text-3xl" style={{ color:'var(--accent-purple)' }}><i className="fas fa-heart"></i></div>
                                        <div>
                                            <h4 className="text-xl font-serif mb-2" style={{ color:'var(--text-primary)' }}>特别感谢</h4>
                                            <p className="mb-2" style={{ color:'var(--text-secondary)' }}>感谢 Gemini 和 DeepSeek 的帮助，让这个项目能够顺利实现。</p>
                                            <p className="text-sm" style={{ color:'var(--text-secondary)' }}>如果有任何错误或者bug，请您联系我修改，感谢！</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                    </div>

                    <div className="mt-8 text-center">
                        <Link to="/" className="btn-pearl inline-flex items-center gap-2 px-6 py-3 font-medium rounded-lg">
                            <i className="fas fa-home"></i>返回首页
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PageA4;
