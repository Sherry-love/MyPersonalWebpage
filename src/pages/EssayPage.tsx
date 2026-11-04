import React, { useState, useEffect, useRef } from 'react';
import Navbar from '../components/Navbar';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface Essay {
    id: string;
    title: string;
    date: string;
    source: string;
    excerpt: string;
    body: string;
}

const essayModules = import.meta.glob<string>('../essays/*.md', { query: '?raw', import: 'default', eager: true });

function parseEssay(raw: string, id: string): Essay {
    const lines = raw.trim().split('\n');
    const title = (lines[0]?.replace(/^#\s*/, '') || id).trim();

    let date = '';
    let source = '';
    const metaLine = lines[1] || '';
    const metaMatch = metaLine.match(/^(.+?)\s*·\s*(.+)$/);
    if (metaMatch) { date = metaMatch[1].trim(); source = metaMatch[2].trim(); }

    const sepIdx = lines.findIndex(l => l.trim() === '---');
    const bodyStart = sepIdx !== -1 ? sepIdx + 1 : 3;
    let bodyLines = lines.slice(bodyStart);
    let body = bodyLines.join('\n').trim();

    if (!date) {
        const lastLine = bodyLines[bodyLines.length - 1]?.trim() || '';
        const dateMatch = lastLine.match(/^(\d{4})[年.\-/](\d{1,2})[月.\-/](\d{1,2})日?$/);
        if (dateMatch) {
            date = `${dateMatch[1]}年${dateMatch[2]}月${dateMatch[3]}日`;
            bodyLines = bodyLines.slice(0, -1);
            body = bodyLines.join('\n').trim();
        }
    }

    const plainBody = body.replace(/[#*>`\-\[\]()]/g, '').replace(/\n+/g, ' ');
    const excerpt = plainBody.length > 60 ? plainBody.slice(0, 60) + '…' : plainBody;

    return { id, title, date, source, excerpt, body };
}

const essays: Essay[] = Object.entries(essayModules)
    .map(([path, raw]) => { const id = path.split('/').pop()?.replace('.md', '') || path; return parseEssay(raw, id); })
    .sort((a, b) => b.date.localeCompare(a.date));

const CARD_COLORS = [
    { bg: 'var(--tint-pink)', accent: 'var(--ink-pink)' },
    { bg: 'var(--tint-purple)', accent: 'var(--ink-purple)' },
    { bg: 'var(--tint-cyan)', accent: 'var(--ink-cyan)' },
    { bg: 'var(--tint-gold)', accent: 'var(--ink-gold)' },
];

// ---- 打字机逐段展开 ----
const TypewriterBody: React.FC<{ body: string }> = ({ body }) => {
    const [visibleParas, setVisibleParas] = useState(0);
    const paragraphs = body.split('\n\n').filter(p => p.trim());

    useEffect(() => {
        setVisibleParas(0);
        if (paragraphs.length === 0) return;

        let i = 0;
        const timer = setInterval(() => {
            i++;
            setVisibleParas(i);
            if (i >= paragraphs.length) clearInterval(timer);
        }, 180);
        return () => clearInterval(timer);
    }, [body]);

    return (
        <div>
            {paragraphs.slice(0, visibleParas).map((para, i) => (
                <div
                    key={i}
                    style={{ animation: 'text-fade-in 0.35s ease-out forwards', marginBottom: '0.75rem' }}
                >
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>{para}</ReactMarkdown>
                </div>
            ))}
            {visibleParas < paragraphs.length && (
                <span className="typewriter-cursor"></span>
            )}
        </div>
    );
};

// ---- 阅读进度条 ----
const ReadingProgress: React.FC<{ containerRef: React.RefObject<HTMLDivElement | null> }> = ({ containerRef }) => {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const el = containerRef.current;
        if (!el) return;

        const handleScroll = () => {
            const rect = el.getBoundingClientRect();
            const cardHeight = rect.height;
            const viewportHeight = window.innerHeight;

            // 卡片完全在视口内 → 100%
            if (cardHeight <= viewportHeight && rect.top >= 0 && rect.bottom <= viewportHeight) {
                setProgress(100);
                return;
            }
            // 卡片已在视口上方完全滚出 → 100%
            if (rect.bottom <= 0) { setProgress(100); return; }
            // 卡片还在视口下方未进入 → 0%
            if (rect.top >= viewportHeight) { setProgress(0); return; }

            const scrolled = viewportHeight - rect.top;
            const total = cardHeight + viewportHeight;
            setProgress(Math.min(100, Math.max(0, Math.round((scrolled / total) * 100))));
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll(); // 初始计算
        return () => window.removeEventListener('scroll', handleScroll);
    }, [containerRef]);

    return <div className="reading-progress" style={{ width: `${progress}%` }} />;
};

// ---- 随笔卡片 ----
const EssayCard: React.FC<{ essay: Essay; index: number; isExpanded: boolean; onToggle: () => void }> =
    React.memo(({ essay, index, isExpanded, onToggle }) => {
        const palette = CARD_COLORS[index % CARD_COLORS.length];
        const tilt = (index % 3 - 1) * 1.5;
        const bodyRef = useRef<HTMLDivElement>(null);

        // 展开时滚动到卡片顶部
        useEffect(() => {
            if (isExpanded && bodyRef.current) {
                setTimeout(() => {
                    bodyRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }, 100);
            }
        }, [isExpanded]);

        return (
            <div
                ref={bodyRef}
                className="glass-card cursor-pointer group"
                style={{
                    background: isExpanded ? 'var(--glass-bg)' : palette.bg,
                    transform: isExpanded ? 'rotate(0deg)' : `rotate(${tilt}deg)`,
                    transition: 'all 0.4s cubic-bezier(0.22, 0.61, 0.36, 1)',
                    position: 'relative',
                    overflow: 'hidden',
                }}
                onClick={isExpanded ? undefined : onToggle}
            >
                {/* 阅读进度条（展开时） */}
                {isExpanded && <ReadingProgress containerRef={bodyRef} />}

                <div className="p-5">
                    {essay.date && (
                        <span className="tag-badge inline-block text-xs px-2.5 py-1 rounded-full mb-3">
                            {essay.date}
                        </span>
                    )}
                    <h3 className="font-serif text-lg leading-snug mb-2 truncate" style={{ color: 'var(--text-primary)' }}>
                        {essay.title}
                    </h3>
                    {essay.source && (
                        <p className="text-xs mb-3" style={{ color: palette.accent }}>
                            <i className="fas fa-tag mr-1"></i>{essay.source}
                        </p>
                    )}

                    {isExpanded ? (
                        <div
                            className="mt-4 pt-4 border-t text-sm leading-relaxed"
                            style={{ borderColor: 'var(--pearl-border)', color: 'var(--text-secondary)' }}
                            onClick={e => e.stopPropagation()}
                        >
                            <TypewriterBody body={essay.body} />
                            <div className="mt-6 flex items-center justify-between">
                                {essay.date && (
                                    <span className="text-xs" style={{ color: 'var(--text-secondary)', opacity: 0.6 }}>
                                        {essay.date}
                                    </span>
                                )}
                                <button onClick={onToggle} className="text-xs underline ml-auto" style={{ color: 'var(--accent-purple)' }}>
                                    收起
                                </button>
                            </div>
                        </div>
                    ) : (
                        <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                            {essay.excerpt}
                        </p>
                    )}
                </div>
            </div>
        );
    });

EssayCard.displayName = 'EssayCard';

const EssayPage: React.FC = () => {
    const [expandedId, setExpandedId] = useState<string | null>(null);

    return (
        <div className="min-h-screen" style={{ background: 'transparent' }}>
            <Navbar />
            <div className="container mx-auto p-4 md:p-8" style={{ paddingTop: '7rem' }}>
                <div className="max-w-3xl mx-auto">
                    <div className="mb-10 text-center">
                        <h1 className="text-4xl font-serif mb-2" style={{ color: 'var(--text-primary)' }}>小练笔</h1>
                        <p style={{ color: 'var(--text-secondary)' }}>随手记下的思考、感悟与碎片</p>
                    </div>
                    {essays.length === 0 ? (
                        <div className="glass-card p-12 text-center">
                            <i className="fas fa-feather-alt text-4xl mb-4" style={{ color: 'var(--accent-purple)' }}></i>
                            <p style={{ color: 'var(--text-secondary)' }}>还没有随笔，在 src/essays/ 里添加 .md 文件吧</p>
                        </div>
                    ) : (
                        <div className="space-y-5">
                            {essays.map((essay, i) => (
                                <EssayCard key={essay.id} essay={essay} index={i}
                                    isExpanded={expandedId === essay.id}
                                    onToggle={() => setExpandedId(expandedId === essay.id ? null : essay.id)} />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default EssayPage;
