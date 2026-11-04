import React, { useRef, useState, useEffect } from 'react';

type RevealVariant = 'up' | 'down' | 'left' | 'right';

interface RevealOnScrollProps {
    children: React.ReactNode;
    className?: string;
    delay?: number;
    variant?: RevealVariant;
}

const variantStyles: Record<RevealVariant, { from: React.CSSProperties; to: React.CSSProperties }> = {
    up:    { from: { opacity: 0, transform: 'translateY(12px)' }, to: { opacity: 1, transform: 'translateY(0)' } },
    down:  { from: { opacity: 0, transform: 'translateY(-8px)' }, to: { opacity: 1, transform: 'translateY(0)' } },
    left:  { from: { opacity: 0, transform: 'translateX(-12px)' }, to: { opacity: 1, transform: 'translateX(0)' } },
    right: { from: { opacity: 0, transform: 'translateX(12px)' }, to: { opacity: 1, transform: 'translateX(0)' } },
};

const RevealOnScroll: React.FC<RevealOnScrollProps> = ({
    children,
    className = '',
    delay = 0,
    variant = 'up',
}) => {
    const ref = useRef<HTMLDivElement>(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const node = ref.current;
        if (!node) return;

        let delayTimer: ReturnType<typeof setTimeout> | null = null;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    if (delay > 0) {
                        delayTimer = setTimeout(() => setIsVisible(true), delay);
                    } else {
                        setIsVisible(true);
                    }
                    observer.disconnect();
                }
            },
            { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
        );

        observer.observe(node);
        return () => {
            observer.disconnect();
            if (delayTimer) clearTimeout(delayTimer);
        };
    }, [delay]);

    const v = variantStyles[variant];
    const style: React.CSSProperties = {
        ...v.from,
        transition: `opacity 0.55s cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms, transform 0.55s cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms`,
        ...(isVisible ? v.to : {}),
    };

    return (
        <div ref={ref} className={className} style={style}>
            {children}
        </div>
    );
};

export default RevealOnScroll;
