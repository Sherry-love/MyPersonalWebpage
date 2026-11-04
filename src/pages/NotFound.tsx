import React, { useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

const NotFound: React.FC = () => {
    const navigate = useNavigate();
    const flyRef = useRef<HTMLButtonElement>(null);

    // 萤火虫跟着鼠标飞；没人动时自己绕小圈
    useEffect(() => {
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

        const target = { x: window.innerWidth * 0.7, y: window.innerHeight * 0.42 };
        const current = { ...target };
        let t = 0;
        let raf = 0;

        const onMove = (event: PointerEvent) => {
            target.x = event.clientX;
            target.y = event.clientY;
        };

        const frame = () => {
            t += 0.016;
            const tx = target.x + Math.cos(t * 0.9) * 24;
            const ty = target.y + Math.sin(t * 1.4) * 18;
            current.x += (tx - current.x) * 0.05;
            current.y += (ty - current.y) * 0.05;
            if (flyRef.current) {
                flyRef.current.style.transform = `translate3d(${current.x - 11}px, ${current.y - 11}px, 0)`;
            }
            raf = requestAnimationFrame(frame);
        };

        window.addEventListener('pointermove', onMove, { passive: true });
        raf = requestAnimationFrame(frame);

        return () => {
            cancelAnimationFrame(raf);
            window.removeEventListener('pointermove', onMove);
        };
    }, []);

    return (
        <div className="min-h-screen" style={{ background: 'transparent' }}>
            <Navbar />

            <button
                ref={flyRef}
                type="button"
                className="firefly"
                onClick={() => navigate('/')}
                aria-label="跟着萤火虫回到首页"
                title="点我，带你回去"
            >
                <span className="firefly-wing firefly-wing-left" aria-hidden="true" />
                <span className="firefly-wing firefly-wing-right" aria-hidden="true" />
                <span className="firefly-glow" aria-hidden="true" />
            </button>

            <div className="container mx-auto p-6 flex items-center justify-center" style={{ minHeight: '72vh' }}>
                <div className="notfound-card">
                    <div className="notfound-code">404</div>
                    <h1 className="notfound-title">这条小径没有通向任何地方</h1>
                    <p className="notfound-text">
                        页面可能已经被搬走了，或者链接里混进了一个错字。
                        <br />
                        跟着那只萤火虫，或者从这里回去。
                    </p>
                    <Link to="/" className="btn-pearl inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-medium">
                        <i className="fas fa-home"></i>
                        回到花园入口
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default NotFound;
