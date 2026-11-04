import React, { useEffect, useCallback, useRef } from 'react';

const particleColors = ['#c4b5d5', '#d4b8c0', '#b8c8d8', '#e8dcc8', '#e8e2f0', '#e1ecec'];

const ParticleEffect: React.FC = () => {
    const particlesRef = useRef<HTMLDivElement[]>([]);
    const lastPosRef = useRef({ x: 0, y: 0 });

    const createParticle = useCallback((x: number, y: number) => {
        // 节流：鼠标移动小于 8px 不生成粒子
        const dx = x - lastPosRef.current.x;
        const dy = y - lastPosRef.current.y;
        if (Math.sqrt(dx * dx + dy * dy) < 8) return;
        lastPosRef.current = { x, y };

        const particle = document.createElement('div');
        const size = Math.floor(Math.random() * 10 + 5);
        particle.style.cssText = `
            width:${size}px;height:${size}px;position:fixed;top:${y}px;left:${x}px;
            border-radius:50%;pointer-events:none;z-index:9999;
            background:${particleColors[Math.floor(Math.random() * particleColors.length)]};
        `;
        document.body.appendChild(particle);
        particlesRef.current.push(particle);

        const destX = x + (Math.random() - 0.5) * 2 * 75;
        const destY = y + (Math.random() - 0.5) * 2 * 75;
        const anim = particle.animate([
            { transform: 'translate(-50%,-50%)', opacity: 1 },
            { transform: `translate(${destX - x - size / 2}px,${destY - y - size / 2}px)`, opacity: 0 }
        ], { duration: 500 + Math.random() * 1000, easing: 'cubic-bezier(0,.9,.57,1)' });
        anim.onfinish = () => {
            particle.remove();
            particlesRef.current = particlesRef.current.filter(p => p !== particle);
        };
    }, []);

    useEffect(() => {
        const handler = (e: MouseEvent) => createParticle(e.clientX, e.clientY);
        window.addEventListener('mousemove', handler);
        return () => {
            window.removeEventListener('mousemove', handler);
            // 卸载时清理所有未完成动画的粒子
            particlesRef.current.forEach(p => p.remove());
            particlesRef.current = [];
        };
    }, [createParticle]);

    return null;
};

export default ParticleEffect;
