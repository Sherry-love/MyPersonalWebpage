import React, { useRef, useCallback } from 'react';
import TerminalWindow from './TerminalWindow';
import TypingEffect from './TypingEffect';
import CountUp from './CountUp';

const StatItem: React.FC<{ end: number; suffix: string; label: string }> = React.memo(({ end, suffix, label }) => (
    <div className="p-4 rounded-md text-center border transition-all duration-300 hover:-translate-y-0.5"
        style={{ background: 'rgba(232,226,240,0.3)', borderColor: 'var(--pearl-border)' }}>
        <div className="text-3xl font-bold font-mono" style={{ color: 'var(--accent-purple)' }}>
            <CountUp end={end} suffix={suffix} />
        </div>
        <div className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>{label}</div>
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
        image.style.transform = `perspective(600px) rotateX(${((cy-y)/cy)*12}deg) rotateY(${((x-cx)/cx)*12}deg) scale3d(1.05,1.05,1.05)`;
        glare.style.opacity = '0.3';
        glare.style.background = `radial-gradient(circle at ${(x/rect.width)*100}% ${(y/rect.height)*100}%, rgba(255,255,255,0.45) 0%, transparent 60%)`;
    }, []);
    const handleMouseLeave = useCallback(() => {
        if (imageRef.current) imageRef.current.style.transform = 'perspective(600px) rotateX(0deg) rotateY(0deg) scale3d(1,1,1)';
        if (glareRef.current) glareRef.current.style.opacity = '0';
    }, []);

    return (
        <div ref={containerRef} className="tilt-container relative w-48 h-48 md:w-56 md:h-56 rounded-full"
            onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave}>
            <div ref={imageRef} className="tilt-target w-full h-full rounded-full overflow-hidden border-4 shadow-lg"
                style={{ borderColor: 'var(--pearl-border)', transition: 'transform 0.1s ease-out, box-shadow 0.3s' }}>
                <img src={src} alt={alt} className="w-full h-full object-cover" draggable={false} />
                <div className="absolute inset-0 rounded-full border-2 border-white/20 pointer-events-none"></div>
            </div>
            <div ref={glareRef} className="tilt-glare rounded-full"></div>
        </div>
    );
};

const About: React.FC = () => {
    return (
        <TerminalWindow title="about_me.txt" icon={<i className="fas fa-user-circle"></i>}>
            <div className="flex flex-col lg:flex-row gap-8 items-center">
                <div className="w-full lg:w-1/3 flex flex-col items-center">
                    <PhotoTilt src={`${import.meta.env.BASE_URL}images/reza.webp`} alt="个人头像插画" />
                    <div className="mt-6 text-center">
                        <h3 className="text-xl font-serif font-bold mb-1" style={{ color: 'var(--text-primary)' }}>刘东徽(Anthony)</h3>
                        <p style={{ color: 'var(--text-secondary)' }}>我是一名充满热情的计算机科学专业学生，专注于系统编程和算法设计。</p>
                        <div className="flex justify-center gap-3 mt-3">
                            {[
                                { href: 'https://github.com/Sherry-love', icon: 'fab fa-github', title: 'GitHub' },
                                { href: 'https://space.bilibili.com/487062571', icon: 'fab fa-bilibili', title: 'Bilibili' },
                                { href: 'https://www.zhihu.com/people/wei-xin-yong-hu-63-11-4', icon: 'fab fa-zhihu', title: '知乎' },
                                { href: 'https://www.douyin.com/user/self', icon: 'fab fa-tiktok', title: '抖音' },
                            ].map(s => (
                                <a key={s.title} href={s.href} className="social-icon transition-colors" title={s.title}
                                    style={{ color: 'var(--accent-purple)' }}
                                    onMouseEnter={e => e.currentTarget.style.color = 'var(--accent-pink)'}
                                    onMouseLeave={e => e.currentTarget.style.color = 'var(--accent-purple)'}>
                                    <i className={`${s.icon} text-lg`}></i>
                                </a>
                            ))}
                        </div>
                    </div>
                </div>
                <div className="w-full lg:w-2/3">
                    <div className="leading-relaxed mb-8 min-h-[100px] sm:min-h-[70px]" style={{ color: 'var(--text-secondary)' }}>
                        <TypingEffect text="在坚冰还盖着北海的时候，我看到了怒放的梅花。" speed={30} loop loopDelay={30000} />
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <StatItem end={50} suffix="+" label="LeetCode Solved" />
                        <StatItem end={2} suffix="+" label="GitHub Projects" />
                        <StatItem end={1} suffix="+" label="Kaggle Competitions" />
                        <StatItem end={150} suffix="+" label="Luogu Solved" />
                    </div>
                </div>
            </div>
        </TerminalWindow>
    );
};

export default About;
