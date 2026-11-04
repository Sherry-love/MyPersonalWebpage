import React, { useEffect, useRef, useState, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { contributions, type ContributionDay } from '../utils/github';
import { GITHUB_URL, GITHUB_USERNAME } from '../data/site';
import TerminalWindow from './TerminalWindow';

// ---- 常量 ----
const CELL = 13;
const GAP = 3;
const PAD = 20;
const WEEKS = 53;
const DAYS = 7;
const SNAKE_SEGMENTS = 5;
const SNAKE_SPEED = 0.025;
const BODY_SPACING = 45; // 帧间隔，保证小球不重合

// 没有公开贡献时，用它渲染一张空花园（只影响画布，不会被当作真实数据展示）
const EMPTY_DAYS: ContributionDay[] = Array.from(
    { length: WEEKS * DAYS },
    () => ({ date: '', count: 0, level: 0 as const })
);

const GARDEN_COLORS: Record<number, string> = {
    0: 'rgba(200,192,210,0.12)',
    1: '#c8dcdc',
    2: '#d4c8dc',
    3: '#e0c8cc',
    4: '#c4b5d5',
};
const DARK_GARDEN_COLORS: Record<number, string> = {
    0: 'rgba(80,75,95,0.15)',
    1: '#3d5252',
    2: '#524d60',
    3: '#5c4a50',
    4: '#8A7DA8',
};

// ---- 类型 ----
interface Vec2 { x: number; y: number }
interface Particle { x: number; y: number; vx: number; vy: number; life: number; maxLife: number; color: string; size: number; }
type Phase = 'idle' | 'wandering' | 'dissolving' | 'exploding' | 'rebirth';

// ---- 工具函数 ----
function cellCenter(col: number, row: number): Vec2 {
    return { x: PAD + col * (CELL + GAP) + CELL / 2, y: PAD + row * (CELL + GAP) + CELL / 2 };
}
function dist(a: Vec2, b: Vec2): number { return Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2); }
function lerp(a: number, b: number, t: number): number { return a + (b - a) * t; }
function lerpColor(c1: string, c2: string, t: number): string {
    const r1 = parseInt(c1.slice(1, 3), 16), g1 = parseInt(c1.slice(3, 5), 16), b1 = parseInt(c1.slice(5, 7), 16);
    const r2 = parseInt(c2.slice(1, 3), 16), g2 = parseInt(c2.slice(3, 5), 16), b2 = parseInt(c2.slice(5, 7), 16);
    return `rgb(${Math.round(lerp(r1,r2,t))},${Math.round(lerp(g1,g2,t))},${Math.round(lerp(b1,b2,t))})`;
}

// ---- 贪心路径规划 ----
function planPath(days: ContributionDay[]): Vec2[] {
    const visited = new Set<number>();
    const path: Vec2[] = [];

    // 从边缘随机起点开始，优先高贡献格子
    const candidates = days.map((d, i) => ({ i, ...d }))
        .filter(d => d.level > 0)
        .sort((a, b) => b.level - a.level || b.count - a.count);

    if (candidates.length === 0) return path;

    // 用贪心：从当前点出发，找最近且贡献最高的未访问点
    const getColRow = (idx: number) => ({ col: Math.floor(idx / DAYS), row: idx % DAYS });

    let current = { col: 0, row: Math.floor(Math.random() * DAYS) };
    path.push(cellCenter(current.col, current.row));

    while (visited.size < candidates.length) {
        let bestIdx = -1;
        let bestScore = -Infinity;

        for (const c of candidates) {
            if (visited.has(c.i)) continue;
            const { col, row } = getColRow(c.i);
            const d = Math.abs(col - current.col) + Math.abs(row - current.row);
            const score = c.level * 10 - d;
            if (score > bestScore) { bestScore = score; bestIdx = c.i; }
        }

        if (bestIdx === -1) break;
        visited.add(bestIdx);
        const { col, row } = getColRow(bestIdx);
        // 中间插入一两个平滑点
        const prev = path[path.length - 1];
        const target = cellCenter(col, row);
        const mid = { x: lerp(prev.x, target.x, 0.5) + (Math.random() - 0.5) * 20, y: lerp(prev.y, target.y, 0.5) + (Math.random() - 0.5) * 20 };
        path.push(mid, target);
        current = { col, row };
    }

    return path;
}

// 从头部历史采样出身体节段（等间距分布）
function getBodySegments(history: Vec2[]): Vec2[] {
    if (history.length < 2) return history;
    const segments: Vec2[] = [];
    for (let i = 0; i < SNAKE_SEGMENTS && i * BODY_SPACING < history.length; i++) {
        segments.push(history[i * BODY_SPACING]);
    }
    return segments;
}

// ---- 主组件 ----
const GitHubGarden: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    // 没有公开贡献时，仍然画一张空花园，而不是留白
    const displayDays = contributions.days.length > 0 ? contributions.days : EMPTY_DAYS;
    const total = contributions.total;
    const [tooltip, setTooltip] = useState<{ x: number; y: number; date: string; count: number } | null>(null);

    // 动画状态（用 ref 避免每帧重渲染）
    const animRef = useRef({
        phase: 'idle' as Phase,
        headHistory: [] as Vec2[],   // 头部历史位置，供身体采样
        path: [] as Vec2[],
        pathIdx: 0,
        t: 0,
        particles: [] as Particle[],
        eaten: new Set<number>(),
        idleTimer: 0,
        dissolveTimer: 0,
        headColor: '#c4b5d5',
        frameCount: 0,
    });

    // 初始化：按真实贡献数据规划一条巡游路径
    useEffect(() => {
        const path = planPath(displayDays);
        const a = animRef.current;
        a.path = path;
        a.headHistory = [{ ...(path[0] || { x: PAD, y: PAD + 50 }) }];
        a.pathIdx = 0;
        a.t = 0;
        a.idleTimer = 60;
    }, [displayDays]);

    // 主动画循环
    useEffect(() => {
        if (displayDays.length === 0) return;
        let raf: number;

        const loop = () => {
            const a = animRef.current;
            const canvas = canvasRef.current;
            if (!canvas || a.path.length === 0) { raf = requestAnimationFrame(loop); return; }

            const ctx = canvas.getContext('2d');
            if (!ctx) return;

            const isDark = document.documentElement.classList.contains('dark');
            const colors = isDark ? DARK_GARDEN_COLORS : GARDEN_COLORS;
            const width = WEEKS * (CELL + GAP) + PAD * 2;
            const height = DAYS * (CELL + GAP) + PAD * 2;
            const dpr = window.devicePixelRatio || 1;
            canvas.width = width * dpr;
            canvas.height = height * dpr;
            canvas.style.width = `${width}px`;
            canvas.style.height = `${height}px`;
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

            // ---- 状态机更新 ----
            if (a.phase === 'idle') {
                a.idleTimer--;
                if (a.idleTimer <= 0) { a.phase = 'wandering'; }
            }

            if (a.phase === 'wandering') {
                // 蛇头沿路径前进
                if (a.pathIdx < a.path.length - 1) {
                    a.t += SNAKE_SPEED;
                    if (a.t >= 1) { a.t -= 1; a.pathIdx++; }
                    const p0 = a.path[a.pathIdx];
                    const p1 = a.path[Math.min(a.pathIdx + 1, a.path.length - 1)];
                    const headX = lerp(p0.x, p1.x, a.t);
                    const headY = lerp(p0.y, p1.y, a.t);

                    // 记录头部历史
                    a.headHistory.unshift({ x: headX, y: headY });
                    if (a.headHistory.length > 280) a.headHistory.length = 280;

                    // 检测蛇头是否碰到格子
                    const head = a.headHistory[0];
                    for (let col = 0; col < WEEKS; col++) {
                        for (let row = 0; row < DAYS; row++) {
                            const idx = col * DAYS + row;
                            if (a.eaten.has(idx)) continue;
                            const cc = cellCenter(col, row);
                            if (dist(head, cc) < CELL) {
                                a.eaten.add(idx);
                                // 生成粒子
                                const day = displayDays[idx];
                                if (day && day.level > 0) {
                                    const color = colors[day.level];
                                    for (let p = 0; p < 6; p++) {
                                        a.particles.push({
                                            x: cc.x, y: cc.y,
                                            vx: (Math.random() - 0.5) * 3,
                                            vy: (Math.random() - 0.5) * 3 - 1.5,
                                            life: 1, maxLife: 40 + Math.random() * 20,
                                            color, size: 2 + Math.random() * 3,
                                        });
                                    }
                                    // 蛇头短暂染色
                                    a.headColor = color;
                                }
                            }
                        }
                    }
                } else {
                    // 所有格子吃完 → 进入溶解阶段
                    a.phase = 'dissolving';
                    a.dissolveTimer = 120;
                }
            }

            if (a.phase === 'dissolving') {
                a.dissolveTimer--;
                // 蛇游向中心
                const cx = width / 2, cy = height / 2;
                const head = a.headHistory[0] || { x: width / 2, y: height / 2 };
                const dx = cx - head.x, dy = cy - head.y;
                const d = Math.sqrt(dx * dx + dy * dy);
                if (d > 2) {
                    const hx = head.x + (dx / d) * 2;
                    const hy = head.y + (dy / d) * 2;
                    a.headHistory.unshift({ x: hx, y: hy });
                    if (a.headHistory.length > 280) a.headHistory.length = 280;
                }
                if (a.dissolveTimer <= 0) {
                    // 蛇解体为粒子风暴
                    a.phase = 'exploding';
                    const body = getBodySegments(a.headHistory);
                    for (const seg of body) {
                        for (let p = 0; p < 3; p++) {
                            a.particles.push({
                                x: seg.x, y: seg.y,
                                vx: (Math.random() - 0.5) * 8,
                                vy: (Math.random() - 0.5) * 8,
                                life: 1, maxLife: 80 + Math.random() * 60,
                                color: isDark ? '#8A7DA8' : '#c4b5d5',
                                size: 3 + Math.random() * 4,
                            });
                        }
                    }
                }
            }

            if (a.phase === 'exploding') {
                // 粒子飘散，等全部死亡后重生
                if (a.particles.length === 0) {
                    a.phase = 'rebirth';
                    // 生成飞回原位的粒子（只为有贡献的格子生成）
                    displayDays.forEach((day, idx) => {
                        if (day.level === 0) return;
                        const col = Math.floor(idx / DAYS);
                        const row = idx % DAYS;
                        const cc = cellCenter(col, row);
                        const startX = width / 2 + (Math.random() - 0.5) * 400;
                        const startY = height / 2 + (Math.random() - 0.5) * 300;
                        a.particles.push({
                            x: startX, y: startY,
                            vx: (cc.x - startX) * 0.05,
                            vy: (cc.y - startY) * 0.05,
                            life: 1, maxLife: 120 + Math.random() * 60,
                            color: colors[day.level],
                            size: 2 + Math.random() * 3,
                        });
                    });
                    a.eaten.clear();
                }
            }

            if (a.phase === 'rebirth') {
                if (a.particles.length === 0) {
                    // 重启循环
                    const path = planPath(displayDays);
                    a.path = path;
                    a.headHistory = [{ ...(path[0] || { x: PAD, y: PAD + 50 }) }];
                    a.pathIdx = 0;
                    a.t = 0;
                    a.idleTimer = 90;
                    a.phase = 'idle';
                }
            }

            // 更新粒子
            a.particles = a.particles.filter(p => {
                p.life -= 1 / p.maxLife;
                p.x += p.vx;
                p.y += p.vy;
                p.vx *= 0.98;
                p.vy *= 0.98;
                return p.life > 0;
            });

            // ---- 绘制 ----
            ctx.clearRect(0, 0, width, height);

            // 热力图格子
            displayDays.forEach((day, i) => {
                const col = Math.floor(i / DAYS);
                const row = i % DAYS;
                const idx = col * DAYS + row;
                const eaten = a.eaten.has(idx);
                const x = PAD + col * (CELL + GAP);
                const y = PAD + row * (CELL + GAP);
                const r = CELL * 0.35;

                ctx.beginPath();
                ctx.moveTo(x + r, y);
                ctx.lineTo(x + CELL - r, y);
                ctx.quadraticCurveTo(x + CELL, y, x + CELL, y + r);
                ctx.lineTo(x + CELL, y + CELL - r);
                ctx.quadraticCurveTo(x + CELL, y + CELL, x + CELL - r, y + CELL);
                ctx.lineTo(x + r, y + CELL);
                ctx.quadraticCurveTo(x, y + CELL, x, y + CELL - r);
                ctx.lineTo(x, y + r);
                ctx.quadraticCurveTo(x, y, x + r, y);
                ctx.closePath();

                if (eaten) {
                    ctx.fillStyle = isDark ? 'rgba(80,75,95,0.06)' : 'rgba(200,192,210,0.06)';
                } else {
                    ctx.fillStyle = colors[day.level] || colors[0];
                }
                ctx.fill();
            });

            // ---- 蛇 ----
            if (a.headHistory.length > 1 && a.phase !== 'exploding') {
                const body = getBodySegments(a.headHistory);
                if (body.length >= 2) {

                const head = body[0];
                const next = body[1];
                const angle = Math.atan2(head.y - next.y, head.x - next.x);

                // 身体节段：从头到尾颜色渐变（头色 → 基色）
                const baseColor = isDark ? '#8A7DA8' : '#c4b5d5';
                for (let i = body.length - 1; i >= 1; i--) {
                    const seg = body[i];
                    const t = i / (body.length - 1);
                    const segColor = lerpColor(baseColor, a.headColor, 1 - t);
                    const r = 5.5;
                    ctx.beginPath();
                    ctx.arc(seg.x, seg.y, r, 0, Math.PI * 2);
                    ctx.fillStyle = segColor;
                    ctx.globalAlpha = 0.35 + (1 - t) * 0.45;
                    ctx.fill();
                }

                // 蛇头（比格子略大）
                ctx.beginPath();
                ctx.arc(head.x, head.y, 8, 0, Math.PI * 2);
                ctx.fillStyle = a.headColor;
                ctx.globalAlpha = 0.65;
                ctx.fill();
                // 头部高光
                ctx.beginPath();
                ctx.arc(head.x - 2, head.y - 2, 3, 0, Math.PI * 2);
                ctx.fillStyle = 'rgba(255,255,255,0.4)';
                ctx.fill();

                // 眼睛
                const perpX = Math.cos(angle + Math.PI / 2) * 3;
                const perpY = Math.sin(angle + Math.PI / 2) * 3;
                for (const side of [-1, 1]) {
                    const ex = head.x + Math.cos(angle) * 3 + perpX * side;
                    const ey = head.y + Math.sin(angle) * 3 + perpY * side;
                    ctx.beginPath();
                    ctx.arc(ex, ey, 2, 0, Math.PI * 2);
                    ctx.fillStyle = '#fff';
                    ctx.fill();
                    ctx.beginPath();
                    ctx.arc(ex + Math.cos(angle) * 0.8, ey + Math.sin(angle) * 0.8, 1, 0, Math.PI * 2);
                    ctx.fillStyle = isDark ? '#1B1C24' : '#4a4458';
                    ctx.fill();
                }
                ctx.globalAlpha = 1;
                }
            }

            // 粒子
            for (const p of a.particles) {
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size * p.life, 0, Math.PI * 2);
                ctx.fillStyle = p.color;
                ctx.globalAlpha = p.life * 0.7;
                ctx.fill();
            }
            ctx.globalAlpha = 1;

            raf = requestAnimationFrame(loop);
        };

        raf = requestAnimationFrame(loop);
        return () => cancelAnimationFrame(raf);
    }, [displayDays]);

    // 暗色模式切换时不需要重跑 loop，数据不变
    const handleMouseMove = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
        const canvas = canvasRef.current;
        if (!canvas) { setTooltip(null); return; }
        const rect = canvas.getBoundingClientRect();
        const mx = e.clientX - rect.left;
        const my = e.clientY - rect.top;
        const col = Math.floor((mx - PAD) / (CELL + GAP));
        const row = Math.floor((my - PAD) / (CELL + GAP));
        if (col >= 0 && col < WEEKS && row >= 0 && row < DAYS) {
            const idx = col * DAYS + row;
            const day = displayDays[idx];
            if (day?.date) {
                setTooltip({ x: e.clientX, y: e.clientY - 28, date: day.date, count: day.count });
                return;
            }
        }
        setTooltip(null);
    }, [displayDays]);

    return (
        <TerminalWindow title="code_garden.txt" icon={<i className="fab fa-github"></i>}>
            <div className="flex flex-col items-center">
                {total > 0 ? (
                    <p style={{ color: 'var(--text-secondary)' }} className="text-sm mb-3">
                        过去一年共 {total} 次贡献
                    </p>
                ) : (
                    <p style={{ color: 'var(--text-secondary)' }} className="text-sm mb-3 text-center">
                        这一年花园里还没有脚印——暂无公开的贡献记录。
                    </p>
                )}
                <div style={{ position: 'relative', overflowX: 'auto', maxWidth: '100%' }}>
                    <canvas ref={canvasRef} onMouseMove={handleMouseMove} onMouseLeave={() => setTooltip(null)} style={{ cursor: 'default' }} aria-label="GitHub 贡献热力图" role="img" />
                </div>
                {tooltip && createPortal(
                    <div className="glass-card" style={{ position: 'fixed', left: tooltip.x, top: tooltip.y, transform: 'translate(-50%,-100%)', padding: '6px 12px', fontSize: '12px', zIndex: 10000, pointerEvents: 'none', whiteSpace: 'nowrap', backdropFilter: 'blur(8px)' }}>
                        <span style={{ color: 'var(--text-primary)' }}>{tooltip.date}</span>
                        <span style={{ color: 'var(--text-secondary)' }} className="ml-2">{tooltip.count} 次贡献</span>
                    </div>,
                    document.body
                )}
                <p className="mt-4 text-xs" style={{ color: 'var(--text-secondary)', opacity: 0.6 }}>
                    在旧日余温里穿行，身影融化处，时间正安静地重新开花。
                </p>
                <p className="mt-2 text-xs" style={{ color: 'var(--text-secondary)', opacity: 0.5 }}>
                    数据更新于 {contributions.updatedAt} ·{' '}
                    <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer" className="underline" style={{ color: 'inherit' }}>
                        @{GITHUB_USERNAME}
                    </a>
                </p>
            </div>
        </TerminalWindow>
    );
};

export default GitHubGarden;
