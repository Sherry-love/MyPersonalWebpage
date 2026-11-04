import React, { useRef, useEffect } from 'react';

/**
 * 鼠标跟随柔光效果
 * 在鼠标周围渲染一个 200px 直径的极淡光晕
 * 使用 requestAnimationFrame + lerp 实现平滑跟随
 * opacity 0.06-0.12，极克制
 */
const MouseGlow: React.FC = () => {
    const glowRef = useRef<HTMLDivElement>(null);
    const targetRef = useRef({ x: -500, y: -500 });
    const currentRef = useRef({ x: -500, y: -500 });

    useEffect(() => {
        const glow = glowRef.current;
        if (!glow) return;

        const handleMouseMove = (e: MouseEvent) => {
            targetRef.current = { x: e.clientX, y: e.clientY };
        };

        let raf: number;
        const animate = () => {
            const target = targetRef.current;
            const current = currentRef.current;

            // Lerp 平滑跟随（0.08 系数，约 100ms 追上）
            current.x += (target.x - current.x) * 0.08;
            current.y += (target.y - current.y) * 0.08;

            glow.style.left = `${current.x}px`;
            glow.style.top = `${current.y}px`;

            raf = requestAnimationFrame(animate);
        };

        window.addEventListener('mousemove', handleMouseMove, { passive: true });
        raf = requestAnimationFrame(animate);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            cancelAnimationFrame(raf);
        };
    }, []);

    return (
        <div
            ref={glowRef}
            style={{
                position: 'fixed',
                width: '200px',
                height: '200px',
                transform: 'translate(-50%, -50%)',
                borderRadius: '50%',
                pointerEvents: 'none',
                zIndex: 1,
                background: 'radial-gradient(circle at center, rgba(196,181,213,0.1) 0%, rgba(212,184,192,0.05) 40%, transparent 70%)',
                mixBlendMode: 'screen',
                willChange: 'left, top',
            }}
            aria-hidden="true"
        />
    );
};

export default MouseGlow;
