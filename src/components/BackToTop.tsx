import React, { useState, useEffect } from 'react';

const BackToTop: React.FC = () => {
    const [visible, setVisible] = useState(false);
    const [entering, setEntering] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            const shouldShow = window.scrollY > 500;
            if (shouldShow && !visible) { setVisible(true); setEntering(true); setTimeout(() => setEntering(false), 400); }
            else if (!shouldShow && visible) { setVisible(false); setEntering(false); }
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, [visible]);

    if (!visible) return null;

    return (
        <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className={`fixed bottom-8 right-8 z-50 w-12 h-12 rounded-full text-white shadow-lg
                hover:scale-110 active:scale-95 transition-all duration-300 flex items-center justify-center
                ${entering ? 'back-to-top-enter' : 'back-to-top-visible'}`}
            style={{
                background: 'linear-gradient(135deg, var(--accent-purple), var(--accent-pink))',
                boxShadow: '0 4px 20px rgba(196,181,213,0.3)',
            }}
            aria-label="回到顶部">
            <i className="fas fa-arrow-up text-lg"></i>
        </button>
    );
};

export default BackToTop;
