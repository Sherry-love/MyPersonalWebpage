import React from 'react';
import GhostIsland from './GhostIsland';

const Footer: React.FC = React.memo(() => {
    return (
        <footer className="relative text-center text-sm py-12" style={{ color: 'var(--text-secondary)' }}>
            <GhostIsland />
            <div className="relative z-10">
                <p>2026 刘东徽 · Impressionist Garden</p>
                <p className="mt-4 font-mono">
                    <i className="fas fa-feather-alt mr-1" style={{ color: 'var(--accent-pink)' }}></i>
                    用代码改变世界，用算法解决问题
                </p>
            </div>
        </footer>
    );
});
Footer.displayName = 'Footer';
export default Footer;
