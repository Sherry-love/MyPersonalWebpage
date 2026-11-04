import React, { useEffect, useState, useRef } from 'react';

interface RouteTransitionProps {
    children: React.ReactNode;
}

/**
 * 页面路由过渡包装器
 * 每次路由切换时，新页面从下方 6px + opacity 0 淡入（200ms）
 * 使用 location.key 作为切换触发器
 */
const RouteTransition: React.FC<RouteTransitionProps> = ({ children }) => {
    const [visible, setVisible] = useState(false);
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        // 延迟一帧确保 CSS transition 被触发
        timerRef.current = setTimeout(() => setVisible(true), 30);
        return () => {
            if (timerRef.current) clearTimeout(timerRef.current);
        };
    }, []);

    return (
        <div
            style={{
                opacity: visible ? 1 : 0,
                transform: visible ? 'translateY(0)' : 'translateY(6px)',
                transition: 'opacity 0.2s cubic-bezier(0.16, 1, 0.3, 1), transform 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                minHeight: '100vh',
            }}
        >
            {children}
        </div>
    );
};

export default RouteTransition;
