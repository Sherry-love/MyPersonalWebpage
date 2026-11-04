import React, { useRef, useCallback } from 'react';
import TypingEffect from './TypingEffect';
import CountUp from './CountUp';

const StatItem: React.FC<{ end: number; suffix: string; label: string }> = React.memo(({ end, suffix, label }) => (
    <div className="paper-stat">
        <div className="paper-stat-number">
            <CountUp end={end} suffix={suffix} />
        </div>
        <div className="paper-stat-label">{label}</div>
    </div>
));
StatItem.displayName = 'StatItem';

const PhotoTilt: React.FC<{ src: string; alt: string }> = ({ src, alt }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const imageRef = useRef<HTMLDivElement>(null);
    const glareRef = useRef<HTMLDivElement>(null);

    const handleMouseMove = useCallback((e: React.MouseEvent) => {
        const container = containerRef.current, image = imageRef.current, glare = glareRef.current;
        if (!container || !image || !glare) return;
        const rect = container.getBoundingClientRect();
        const x = e.clientX - rect.left, y = e.clientY - rect.top;
        const cx = rect.width / 2, cy = rect.height / 2;
        image.style.transform = `perspective(600px) rotateX(${((cy - y) / cy) * 12}deg) rotateY(${((x - cx) / cx) * 12}deg) scale3d(1.05,1.05,1.05)`;
        glare.style.opacity = '0.3';
        glare.style.background = `radial-gradient(circle at ${(x / rect.width) * 100}% ${(y / rect.height) * 100}%, rgba(255,255,255,0.45) 0%, transparent 60%)`;
    }, []);
    const handleMouseLeave = useCallback(() => {
        if (imageRef.current) imageRef.current.style.transform = 'perspective(600px) rotateX(0deg) rotateY(0deg) scale3d(1,1,1)';
        if (glareRef.current) glareRef.current.style.opacity = '0';
    }, []);

    return (
        <div ref={containerRef} className="tilt-container relative w-44 h-44 md:w-52 md:h-52 rounded-full"
            onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave}>
            <div ref={imageRef} className="tilt-target w-full h-full rounded-full overflow-hidden border-4 shadow-lg"
                style={{ borderColor: 'rgba(255,253,248,0.9)', transition: 'transform 0.1s ease-out, box-shadow 0.3s' }}>
                <img src={src} alt={alt} className="w-full h-full object-cover" draggable={false} />
                <div className="absolute inset-0 rounded-full border-2 border-white/20 pointer-events-none"></div>
            </div>
            <div ref={glareRef} className="tilt-glare rounded-full"></div>
        </div>
    );
};

const About: React.FC = () => {
    return (
        <section className="paper-sheet">
            <span className="paper-tape paper-tape-left" aria-hidden="true" />
            <span className="paper-tape paper-tape-right" aria-hidden="true" />
            <span className="paper-stamp" aria-hidden="true">徽</span>

            <header className="paper-head">
                <p className="paper-kicker">ABOUT ME · 青岛</p>
                <h2 className="paper-title">先把手弄脏的人</h2>
            </header>

            <div className="paper-body">
                <div className="paper-photo">
                    <PhotoTilt src={`${import.meta.env.BASE_URL}images/reza.webp`} alt="个人头像插画" />
                    <h3 className="paper-name">刘东徽 (Anthony)</h3>
                    <p className="paper-bio">我是一名充满热情的计算机科学专业学生，专注于系统编程和算法设计。</p>
                    <div className="paper-socials">
                        {[
                            { href: 'https://github.com/Sherry-love', icon: 'fab fa-github', title: 'GitHub' },
                            { href: 'https://space.bilibili.com/487062571', icon: 'fab fa-bilibili', title: 'Bilibili' },
                            { href: 'https://www.zhihu.com/people/wei-xin-yong-hu-63-11-4', icon: 'fab fa-zhihu', title: '知乎' },
                            { href: 'https://www.douyin.com/user/self', icon: 'fab fa-tiktok', title: '抖音' },
                        ].map((s) => (
                            <a key={s.title} href={s.href} className="social-icon" title={s.title}
                                target="_blank" rel="noopener noreferrer" style={{ color: 'var(--ink-purple)' }}>
                                <i className={`${s.icon} text-lg`}></i>
                            </a>
                        ))}
                    </div>
                </div>

                <div className="paper-main">
                    <div className="paper-quote">
                        <TypingEffect text="在坚冰还盖着北海的时候，我看到了怒放的梅花。" speed={30} loop loopDelay={30000} />
                    </div>

                    <div className="paper-stats">
                        <StatItem end={50} suffix="+" label="LeetCode Solved" />
                        <StatItem end={2} suffix="+" label="GitHub Projects" />
                        <StatItem end={1} suffix="+" label="Kaggle Competitions" />
                        <StatItem end={150} suffix="+" label="Luogu Solved" />
                    </div>

                    <p className="paper-note">
                        还在学，还在写。这个页面本身也是练习的一部分——
                        有些代码是 AI 帮我写的，但每一个想留下的东西是我自己选的。
                    </p>
                </div>
            </div>

            <footer className="paper-foot">
                <span>青岛 · 二〇二六</span>
                <span>page 1 / 1</span>
            </footer>
        </section>
    );
};

export default About;
