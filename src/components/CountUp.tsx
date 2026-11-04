import React, { useRef, useState, useEffect } from 'react';

interface CountUpProps {
    end: number;
    suffix?: string;
    duration?: number;
}

const CountUp: React.FC<CountUpProps> = ({ end, suffix = '', duration = 2400 }) => {
    const [count, setCount] = useState(0);
    const [started, setStarted] = useState(false);
    const ref = useRef<HTMLSpanElement>(null);

    useEffect(() => {
        const node = ref.current;
        if (!node) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting && !started) {
                    setStarted(true);
                    observer.disconnect();
                }
            },
            { threshold: 0.3 }
        );
        observer.observe(node);
        return () => observer.disconnect();
    }, [started]);

    useEffect(() => {
        if (!started) return;
        const startTime = performance.now();
        let frameId: number;

        const animate = (now: number) => {
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);
            // ease-out quartic — 前快后慢，末尾缓缓停下
            const eased = 1 - Math.pow(1 - progress, 4);
            setCount(Math.round(eased * end));

            if (progress < 1) {
                frameId = requestAnimationFrame(animate);
            }
        };

        frameId = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(frameId);
    }, [started, end, duration]);

    return (
        <span ref={ref}>
            {count}{suffix}
        </span>
    );
};

export default CountUp;
