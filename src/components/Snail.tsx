import React, { useEffect, useRef, useState } from 'react';

interface Point { x: number; y: number }

/**
 * 一只随机出现的蜗牛：爬到某个角落，点它会缩回壳里，
 * 过一会儿再从别的地方冒出来。
 */
const Snail: React.FC = () => {
    const [visible, setVisible] = useState(false);
    const [sleeping, setSleeping] = useState(false);
    const [pos, setPos] = useState<Point>({ x: -200, y: -200 });
    const [duration, setDuration] = useState(16);
    const timers = useRef<number[]>([]);
    const sleepingRef = useRef(false);

    const randomPoint = (): Point => {
        const margin = 46;
        const minY = 130;
        const x = margin + Math.random() * Math.max(120, window.innerWidth - margin * 2 - 60);
        // 偏向下半屏，别一出现就压住标题
        const usable = Math.max(80, window.innerHeight - minY - margin - 40);
        const y = minY + usable * (0.3 + Math.random() * 0.6);
        return { x, y };
    };

    const schedule = (fn: () => void, ms: number) => {
        const id = window.setTimeout(fn, ms);
        timers.current.push(id);
        return id;
    };

    const appear = () => {
        setPos(randomPoint());
        setVisible(true);
        setSleeping(false);
        sleepingRef.current = false;
        setDuration(18);
    };

    useEffect(() => {
        // 先安静一会儿，别一进站就爬出来
        schedule(appear, 9000);

        const crawl = window.setInterval(() => {
            if (sleepingRef.current) return;
            setPos(randomPoint());
            setDuration(20);
        }, 34_000);

        return () => {
            timers.current.forEach((id) => window.clearTimeout(id));
            timers.current = [];
            window.clearInterval(crawl);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleClick = () => {
        if (sleepingRef.current) return;
        sleepingRef.current = true;
        setSleeping(true);
        schedule(() => setVisible(false), 6000);
        schedule(appear, 26_000);
    };

    if (!visible) return null;

    return (
        <button
            type="button"
            className={`snail${sleeping ? ' is-sleeping' : ''}`}
            style={{
                left: `${pos.x}px`,
                top: `${pos.y}px`,
                transitionDuration: `${duration}s`,
            }}
            onClick={handleClick}
            aria-label={sleeping ? '蜗牛睡着了' : '戳一下蜗牛'}
            title="一只不太怕人的蜗牛"
        >
            <span className="snail-bubble" aria-hidden="true">{sleeping ? 'zZ' : '…'}</span>
            <svg viewBox="0 0 64 40" width="52" height="33" aria-hidden="true">
                <ellipse cx="30" cy="34" rx="22" ry="3.5" fill="rgba(74,68,88,0.12)" />
                <path d="M8 31 Q16 25 27 27 L44 27 Q52 27 55 31 Z" fill="var(--snail-body, #cdb8a8)" />
                <circle cx="30" cy="23" r="12" fill="var(--snail-shell, #a98aa8)" />
                <path d="M30 14 a9 9 0 1 1 -8 12" fill="none" stroke="var(--snail-shell-line, #f2e8f1)" strokeWidth="2" strokeLinecap="round" />
                <path d="M48 29 Q57 27 57 21" fill="none" stroke="var(--snail-body, #cdb8a8)" strokeWidth="4.5" strokeLinecap="round" />
                <circle cx="57.5" cy="20" r="4.2" fill="var(--snail-body, #cdb8a8)" />
                <line x1="57" y1="17" x2="60" y2="10" stroke="var(--snail-body, #cdb8a8)" strokeWidth="1.6" strokeLinecap="round" />
                <circle cx="60.4" cy="9" r="1.5" fill="var(--snail-eye, #4a4458)" />
                <line x1="54" y1="17" x2="53" y2="9.5" stroke="var(--snail-body, #cdb8a8)" strokeWidth="1.6" strokeLinecap="round" />
                <circle cx="52.8" cy="8.6" r="1.5" fill="var(--snail-eye, #4a4458)" />
            </svg>
        </button>
    );
};

export default Snail;
