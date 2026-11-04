import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTheme } from './ThemeContext';

const CONFETTI_COLORS = ['#d4b8c0', '#c4b5d5', '#b8c8d8', '#e8dcc8', '#e8e2f0', '#e1ecec'];
const EASTER_EGG_THRESHOLD = 5;

const Navbar: React.FC = () => {
    const { theme, toggleTheme } = useTheme();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [logoShake, setLogoShake] = useState(false);
    const clickCountRef = useRef(0);
    const clickTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const logoSpanRef = useRef<HTMLAnchorElement>(null);
    const location = useLocation();

    const navItems = [
        { path: '/', label: '首页', icon: 'fa-home' },
        { path: '/a1', label: '学术', icon: 'fa-graduation-cap' },
        { path: '/a2', label: '项目', icon: 'fa-code' },
        { path: '/a3', label: '小练笔', icon: 'fa-feather-alt' },
        { path: '/photos', label: '照片', icon: 'fa-image' },
        { path: '/a4', label: '简介', icon: 'fa-info-circle' },
    ];

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 50);
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const confettiRef = useRef<HTMLDivElement[]>([]);

    const spawnConfetti = useCallback((originX: number, originY: number) => {
        for (let i = 0; i < 30; i++) {
            const particle = document.createElement('div');
            particle.className = 'confetti-particle';
            const size = Math.random() * 10 + 4;
            const angle = Math.random() * Math.PI * 2;
            const distance = Math.random() * 100 + 50;
            const tx = Math.cos(angle) * distance;
            const ty = Math.sin(angle) * distance - 50;
            particle.style.cssText = `
                width:${size}px;height:${size}px;left:${originX}px;top:${originY}px;
                background:${CONFETTI_COLORS[Math.floor(Math.random()*CONFETTI_COLORS.length)]};
                border-radius:${Math.random()>0.5?'50%':'3px'};--tx:${tx}px;--ty:${ty}px;
            `;
            document.body.appendChild(particle);
            confettiRef.current.push(particle);
            setTimeout(() => {
                particle.remove();
                confettiRef.current = confettiRef.current.filter(p => p !== particle);
            }, 1000);
        }
        setLogoShake(true);
        setTimeout(() => setLogoShake(false), 500);
    }, []);

    const handleLogoClick = useCallback((e: React.MouseEvent) => {
        clickCountRef.current += 1;
        if (clickTimerRef.current) clearTimeout(clickTimerRef.current);
        clickTimerRef.current = setTimeout(() => { clickCountRef.current = 0; }, 3000);
        if (clickCountRef.current >= EASTER_EGG_THRESHOLD) {
            e.preventDefault();
            clickCountRef.current = 0;
            if (clickTimerRef.current) { clearTimeout(clickTimerRef.current); clickTimerRef.current = null; }
            spawnConfetti(e.clientX, e.clientY);
        }
    }, [spawnConfetti]);

    useEffect(() => {
        return () => {
            if (clickTimerRef.current) clearTimeout(clickTimerRef.current);
            confettiRef.current.forEach(p => p.remove());
            confettiRef.current = [];
        };
    }, []);

    return (
        <nav
            className={`fixed top-0 left-0 right-0 z-50 border-b transition-all duration-300 ${scrolled ? 'nav-scrolled' : ''}`}
            style={{
                background: scrolled ? 'var(--nav-scrolled-bg, rgba(250,247,244,0.85))' : 'var(--nav-bg, rgba(250,247,244,0.55))',
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
                borderColor: 'var(--pearl-border)',
            }}
        >
            <div className="container mx-auto px-4 py-3 transition-all duration-300">
                <div className="flex items-center justify-between">
                    <Link
                        to="/" ref={logoSpanRef} onClick={handleLogoClick}
                        className={`flex items-center gap-2 cursor-pointer select-none ${logoShake ? 'animate-shake' : ''}`}
                        aria-label="回到首页"
                    >
                        <div className="nav-logo-img w-8 h-8 rounded-full overflow-hidden border-2 shadow-md transition-all duration-300" style={{ borderColor: 'var(--accent-purple)' }}>
                            <img src={`${import.meta.env.BASE_URL}images/logo.webp`} alt="刘东徽 Logo" className="w-full h-full object-cover"
                                onError={(e) => {
                                    e.currentTarget.style.display = 'none';
                                    const p = e.currentTarget.parentElement;
                                    if (p) p.innerHTML = '<div class="w-full h-full flex items-center justify-center" style="background:linear-gradient(135deg,var(--accent-purple),var(--accent-pink))"><i class="fas fa-terminal text-white text-lg"></i></div>';
                                }}
                            />
                        </div>
                        <span className="nav-logo-text font-serif font-bold text-lg transition-all duration-300" style={{ color: 'var(--text-primary)' }}>
                            刘东徽
                        </span>
                    </Link>

                    <div className="hidden md:flex items-center gap-1">
                        {navItems.map((item) => (
                            <Link key={item.path} to={item.path}
                                className="nav-link nav-link-hover flex items-center gap-2 px-4 py-2 rounded-lg"
                                style={{
                                    color: location.pathname === item.path ? 'var(--accent-purple)' : 'var(--text-secondary)',
                                    background: location.pathname === item.path ? 'rgba(232,226,240,0.4)' : 'transparent',
                                }}
                            >
                                <i className={`fas ${item.icon} text-sm`}></i>
                                <span className="font-medium">{item.label}</span>
                            </Link>
                        ))}
                    </div>

                    <div className="flex items-center gap-2">
                        <button onClick={toggleTheme} className="theme-toggle" aria-label={theme === 'light' ? '切换到暗色模式' : '切换到亮色模式'}>
                            {theme === 'light' ? '🌙' : '☀️'}
                        </button>
                        <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden p-2 rounded-lg" style={{ color: 'var(--text-secondary)' }}
                        aria-label={isMenuOpen ? '关闭菜单' : '打开菜单'} aria-expanded={isMenuOpen}>
                        <i className={`fas ${isMenuOpen ? 'fa-times' : 'fa-bars'} text-lg`}></i>
                    </button>
                </div>
                </div>

                {isMenuOpen && (
                    <div className="md:hidden mt-4 pb-4">
                        <div className="flex flex-col gap-2">
                            {navItems.map((item) => (
                                <Link key={item.path} to={item.path} onClick={() => setIsMenuOpen(false)}
                                    className="flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300"
                                    style={{
                                        color: location.pathname === item.path ? 'var(--accent-purple)' : 'var(--text-secondary)',
                                        background: location.pathname === item.path ? 'rgba(232,226,240,0.4)' : 'transparent',
                                    }}
                                >
                                    <i className={`fas ${item.icon} w-6 text-center`}></i>
                                    <span className="font-medium">{item.label}</span>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
