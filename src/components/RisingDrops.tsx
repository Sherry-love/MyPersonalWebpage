import React, { useEffect, useRef } from 'react';

interface Drop {
    x: number;
    y: number;
    radius: number;
    speed: number;
    drift: number;
    phase: number;
    phaseSpeed: number;
    color: string;
    opacity: number;
}

const DROP_COLORS = [
    'rgba(196, 181, 213, ',   // 淡紫
    'rgba(212, 184, 192, ',   // 淡粉
    'rgba(184, 200, 216, ',   // 淡青
    'rgba(232, 220, 200, ',   // 淡金
    'rgba(232, 226, 240, ',   // 淡薰衣草
];

const RisingDrops: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let width = window.innerWidth;
        let height = window.innerHeight;
        let raf = 0;
        const drops: Drop[] = [];

        const resize = () => {
            width = window.innerWidth;
            height = window.innerHeight;
            const dpr = window.devicePixelRatio || 1;
            canvas.width = width * dpr;
            canvas.height = height * dpr;
            canvas.style.width = `${width}px`;
            canvas.style.height = `${height}px`;
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        };
        resize();

        // 初始化气泡
        const initDrops = () => {
            drops.length = 0;
            const count = Math.min(28, Math.floor(width / 40));
            for (let i = 0; i < count; i++) {
                drops.push(createDrop(true));
            }
        };

        const createDrop = (randomY: boolean): Drop => {
            const color = DROP_COLORS[Math.floor(Math.random() * DROP_COLORS.length)];
            return {
                x: Math.random() * width,
                y: randomY ? Math.random() * height : height + Math.random() * 40,
                radius: Math.random() * 3 + 1.5,
                speed: Math.random() * 0.4 + 0.15,
                drift: Math.random() * 0.3 + 0.05,
                phase: Math.random() * Math.PI * 2,
                phaseSpeed: Math.random() * 0.02 + 0.005,
                color,
                opacity: Math.random() * 0.35 + 0.15,
            };
        };

        const resetDrop = (d: Drop) => {
            Object.assign(d, createDrop(false));
        };

        const isDark = () => document.documentElement.classList.contains('dark');

        const draw = () => {
            ctx.clearRect(0, 0, width, height);
            const dark = isDark();

            for (const d of drops) {
                // 上升 + 正弦横向摇摆
                d.y -= d.speed;
                d.phase += d.phaseSpeed;
                const sway = Math.sin(d.phase) * d.drift;

                // 重置到底部
                if (d.y < -20) resetDrop(d);

                const x = d.x + sway;
                const alpha = d.opacity * (dark ? 0.7 : 1);

                // 光晕
                const glow = ctx.createRadialGradient(x, d.y, 0, x, d.y, d.radius * 3);
                glow.addColorStop(0, `${d.color}${alpha})`);
                glow.addColorStop(1, `${d.color}0)`);
                ctx.fillStyle = glow;
                ctx.beginPath();
                ctx.arc(x, d.y, d.radius * 3, 0, Math.PI * 2);
                ctx.fill();

                // 核心
                ctx.fillStyle = `${d.color}${Math.min(alpha * 1.4, 0.7)})`;
                ctx.beginPath();
                ctx.arc(x, d.y, d.radius, 0, Math.PI * 2);
                ctx.fill();
            }

            raf = requestAnimationFrame(draw);
        };

        initDrops();
        draw();

        window.addEventListener('resize', resize);
        return () => {
            cancelAnimationFrame(raf);
            window.removeEventListener('resize', resize);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            style={{
                position: 'fixed',
                inset: 0,
                pointerEvents: 'none',
                zIndex: 1,
            }}
        />
    );
};

export default RisingDrops;
