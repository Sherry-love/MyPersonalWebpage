import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { cloudWords, type CloudWord, type WordCategory } from '../data/words';

interface Vec3 { x: number; y: number; z: number }

const CATEGORY_KEY: Record<WordCategory, string> = {
    技术: 'tech',
    生活: 'life',
    写作: 'writing',
    城市: 'city',
    站点: 'site',
};

interface WordCloudProps {
    /** 作为侧边小组件：标题压缩、球更小、词更密 */
    compact?: boolean;
}

/**
 * 3D 词云：词分布在球面上，按 Y/X 旋转后用透视投影落到 2D。
 * 没有引 three.js —— 标签保持 DOM，清晰、可点击、可拖拽。
 */
const WordCloud: React.FC<WordCloudProps> = ({ compact = false }) => {
    const navigate = useNavigate();
    const stageRef = useRef<HTMLDivElement>(null);
    const chipRefs = useRef<(HTMLButtonElement | null)[]>([]);

    const [active, setActive] = useState<CloudWord | null>(null);
    const [paused, setPaused] = useState(false);
    const [reduced, setReduced] = useState(false);

    const pausedRef = useRef(false);
    const hoverRef = useRef(false);
    const rotRef = useRef({ y: 0.4, x: -0.42, v: 0.003 });
    const dragRef = useRef({ active: false, lastX: 0, lastY: 0, moved: 0 });

    // 球面均匀分布（Fibonacci lattice）
    const points = useMemo<Vec3[]>(() => {
        const n = cloudWords.length;
        return cloudWords.map((_, i) => {
            const y = n === 1 ? 0 : 1 - (i / (n - 1)) * 2;
            const r = Math.sqrt(Math.max(0, 1 - y * y));
            const theta = i * Math.PI * (3 - Math.sqrt(5));
            return { x: Math.cos(theta) * r, y, z: Math.sin(theta) * r };
        });
    }, []);

    useEffect(() => {
        pausedRef.current = paused;
    }, [paused]);

    useEffect(() => {
        const stage = stageRef.current;
        if (!stage) return;

        const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        setReduced(prefersReduced);

        let radius = 180;
        let raf = 0;

        const render = () => {
            const { y: ry, x: rx } = rotRef.current;
            const cosY = Math.cos(ry);
            const sinY = Math.sin(ry);
            const cosX = Math.cos(rx);
            const sinX = Math.sin(rx);
            const perspective = 2.6;

            points.forEach((point, i) => {
                const el = chipRefs.current[i];
                if (!el) return;

                const x1 = point.x * cosY - point.z * sinY;
                const z1 = point.x * sinY + point.z * cosY;
                const y1 = point.y * cosX - z1 * sinX;
                const z2 = point.y * sinX + z1 * cosX;

                const scale = perspective / (perspective - z2);
                const px = x1 * radius * scale;
                const py = y1 * radius * scale;
                const depth = (z2 + 1) / 2; // 0 最远，1 最近

                el.style.transform = `translate(-50%, -50%) translate3d(${px}px, ${py}px, 0) scale(${0.62 + depth * 0.5})`;
                el.style.opacity = `${0.4 + depth * 0.6}`;
                el.style.zIndex = `${Math.round(depth * 100)}`;
                el.style.filter = depth < 0.32 ? `blur(${((0.32 - depth) * 1.4).toFixed(2)}px)` : 'none';
            });
        };

        const measure = () => {
            const rect = stage.getBoundingClientRect();
            // 用视口宽度判断移动端，避免把侧边窄栏误判成手机
            const narrow = window.innerWidth < 640;
            radius = Math.min(rect.width, rect.height) * (compact ? 0.46 : 0.44);
            const base = compact ? 8.8 : 10;
            const factor = compact ? 0.42 : 0.55;
            const fontScale = compact ? (narrow ? 0.9 : 1) : (narrow ? 0.8 : 1);
            cloudWords.forEach((word, i) => {
                const el = chipRefs.current[i];
                if (el) el.style.fontSize = `${(base + word.weight * factor) * fontScale}px`;
            });
            render();
        };

        const frame = () => {
            const r = rotRef.current;
            const dragging = dragRef.current.active;
            if (!dragging && !pausedRef.current && !hoverRef.current && !prefersReduced) {
                // 拖拽后的速度缓慢回到匀速自转
                r.v += (0.003 - r.v) * 0.03;
                r.y += r.v;
                // 轻微点头，让球体更有体积感
                const targetX = -0.42 + Math.sin(performance.now() * 0.00028) * 0.07;
                r.x += (targetX - r.x) * 0.02;
            }
            render();
            raf = requestAnimationFrame(frame);
        };

        measure();
        if (prefersReduced) {
            render();
        } else {
            raf = requestAnimationFrame(frame);
        }
        window.addEventListener('resize', measure);

        return () => {
            cancelAnimationFrame(raf);
            window.removeEventListener('resize', measure);
        };
    }, [points, compact]);

    const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
        dragRef.current = { active: true, lastX: event.clientX, lastY: event.clientY, moved: 0 };
    };

    const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
        const drag = dragRef.current;
        if (!drag.active) return;
        const dx = event.clientX - drag.lastX;
        const dy = event.clientY - drag.lastY;
        drag.lastX = event.clientX;
        drag.lastY = event.clientY;
        drag.moved += Math.abs(dx) + Math.abs(dy);
        rotRef.current.y += dx * 0.006;
        rotRef.current.x = Math.max(-0.65, Math.min(0.65, rotRef.current.x + dy * 0.003));
        rotRef.current.v = dx * 0.006;
    };

    const handlePointerEnd = () => {
        dragRef.current.active = false;
    };

    const selectWord = (word: CloudWord) => {
        if (dragRef.current.moved > 8) return;
        setActive(word);
        if (word.href) navigate(word.href);
    };

    return (
        <section className={`word-cloud-section${compact ? ' word-cloud--compact' : ''}`}>
            <header className="word-cloud-head">
                <div>
                    <p className="word-cloud-kicker">WORD CLOUD</p>
                    <h2 className="word-cloud-title">词云</h2>
                    {!compact && <p className="word-cloud-sub">我最近反复想到的词。拖一下会转，点一个看看。</p>}
                </div>
                <button
                    type="button"
                    className="word-cloud-pause"
                    onClick={() => setPaused((value) => !value)}
                    aria-pressed={paused}
                    aria-label={paused ? '继续旋转' : '暂停旋转'}
                >
                    <i className={`fas ${paused ? 'fa-play' : 'fa-pause'}`} aria-hidden="true" />
                    <span className="word-cloud-pause-label">{paused ? '继续' : '暂停'}</span>
                </button>
            </header>

            <div
                ref={stageRef}
                className="word-cloud"
                role="group"
                aria-label={`词云，共 ${cloudWords.length} 个词，可拖动旋转`}
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerEnd}
                onPointerCancel={handlePointerEnd}
                onPointerLeave={() => { hoverRef.current = false; handlePointerEnd(); }}
                onPointerEnter={(event) => { if (event.pointerType === 'mouse') hoverRef.current = true; }}
            >
                {cloudWords.map((word, index) => (
                    <button
                        key={word.text}
                        type="button"
                        ref={(el) => { chipRefs.current[index] = el; }}
                        className={`word-chip word-chip--${CATEGORY_KEY[word.category]}`}
                        style={{ fontSize: `${8.8 + word.weight * 0.42}px` }}
                        onMouseEnter={() => { setActive(word); }}
                        onFocus={() => { setActive(word); }}
                        onClick={() => selectWord(word)}
                        aria-label={`${word.text}（${word.category}）${word.href ? '，点击前往相关页面' : ''}`}
                    >
                        {word.text}
                    </button>
                ))}
            </div>

            <div className="word-cloud-status" aria-live="polite">
                <span>{active ? `${active.category} · ${active.text}` : '拖动旋转 · 悬停查看分类'}</span>
                <span>{active?.href ? '点击前往 →' : ''}</span>
            </div>

            {reduced && (
                <p className="word-cloud-reduced">已按系统设置减少动态，词云保持静止。</p>
            )}
        </section>
    );
};

export default WordCloud;
