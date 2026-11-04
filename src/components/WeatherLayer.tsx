import React, { useEffect, useRef } from 'react';
import { useAmbient } from '../ambient/AmbientContext';

interface Drop {
    x: number;
    y: number;
    vy: number;
    len: number;
    size: number;
    phase: number;
    speed: number;
}

/**
 * 天气层：下雨 / 下雪 / 雷雨时在背景上画一层很轻的粒子。
 * 只在对应天气下挂载；尊重 prefers-reduced-motion 与页面可见性。
 */
const WeatherLayer: React.FC = () => {
    const { weather } = useAmbient();
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const active = weather === 'rain' || weather === 'snow' || weather === 'thunder';

    useEffect(() => {
        if (!active) return;
        const canvas = canvasRef.current;
        if (!canvas) return;
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const isSnow = weather === 'snow';
        const isThunder = weather === 'thunder';
        let width = window.innerWidth;
        let height = window.innerHeight;
        let drops: Drop[] = [];
        let raf = 0;
        let flash = 0;

        const createDrop = (initial: boolean): Drop => ({
            x: Math.random() * width,
            y: initial ? Math.random() * height : -40,
            vy: isSnow ? Math.random() * 0.6 + 0.35 : Math.random() * 7 + 7,
            len: isSnow ? 0 : Math.random() * 14 + 10,
            size: isSnow ? Math.random() * 1.8 + 1 : 1,
            phase: Math.random() * Math.PI * 2,
            speed: Math.random() * 0.02 + 0.008,
        });

        const count = () => {
            if (isSnow) return Math.min(80, Math.round(width / 18));
            return Math.min(150, Math.round(width / 9));
        };

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

        const init = () => {
            resize();
            drops = Array.from({ length: count() }, () => createDrop(true));
        };

        const draw = () => {
            ctx.clearRect(0, 0, width, height);

            if (isThunder) {
                if (flash <= 0 && Math.random() < 0.002) flash = 0.55;
                if (flash > 0) {
                    ctx.fillStyle = `rgba(226, 228, 255, ${flash})`;
                    ctx.fillRect(0, 0, width, height);
                    flash *= 0.88;
                    if (flash < 0.02) flash = 0;
                }
            }

            for (const drop of drops) {
                if (isSnow) {
                    drop.phase += drop.speed;
                    drop.y += drop.vy;
                    drop.x += Math.sin(drop.phase) * 0.5;
                    if (drop.y > height + 10 || drop.x < -10 || drop.x > width + 10) {
                        Object.assign(drop, createDrop(false), { x: Math.random() * width });
                    }
                    ctx.beginPath();
                    ctx.fillStyle = 'rgba(255, 255, 255, 0.72)';
                    ctx.arc(drop.x, drop.y, drop.size, 0, Math.PI * 2);
                    ctx.fill();
                } else {
                    drop.y += drop.vy;
                    drop.x -= 1.1;
                    if (drop.y > height + 30 || drop.x < -30) {
                        Object.assign(drop, createDrop(false));
                    }
                    ctx.beginPath();
                    ctx.strokeStyle = isThunder
                        ? 'rgba(170, 180, 220, 0.42)'
                        : 'rgba(150, 165, 195, 0.34)';
                    ctx.lineWidth = 1;
                    ctx.moveTo(drop.x, drop.y);
                    ctx.lineTo(drop.x + 2, drop.y + drop.len);
                    ctx.stroke();
                }
            }

            raf = requestAnimationFrame(draw);
        };

        const start = () => {
            cancelAnimationFrame(raf);
            raf = requestAnimationFrame(draw);
        };
        const stop = () => cancelAnimationFrame(raf);

        const onVisibility = () => {
            if (document.hidden) stop();
            else start();
        };

        init();
        start();
        window.addEventListener('resize', init);
        document.addEventListener('visibilitychange', onVisibility);

        return () => {
            stop();
            window.removeEventListener('resize', init);
            document.removeEventListener('visibilitychange', onVisibility);
        };
    }, [active, weather]);

    if (!active) return null;
    return <canvas ref={canvasRef} className="weather-canvas" aria-hidden="true" />;
};

export default WeatherLayer;
