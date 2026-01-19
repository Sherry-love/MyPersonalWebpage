import React from 'react';

const Footer: React.FC = () => {
    return (
        <footer className="text-center text-slate-500 text-sm py-12">
            <p>© 2026 刘东徽 - Interactive Portfolio | Last Updated: Jan 2026</p>
            <p className="mt-4 font-mono text-violet-400/80">
                <i className="fas fa-heart text-pink-400/80"></i>
                {' '}用代码改变世界，用算法解决问题
            </p>
        </footer>
    );
};

export default Footer;
