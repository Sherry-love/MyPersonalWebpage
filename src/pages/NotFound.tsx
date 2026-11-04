import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';

const NotFound: React.FC = () => (
    <div className="min-h-screen" style={{ background: 'transparent' }}>
        <Navbar />
        <div className="container mx-auto p-6 flex items-center justify-center" style={{ minHeight: '70vh' }}>
            <div className="glass-card p-10 md:p-14 text-center max-w-lg">
                <div className="font-serif text-6xl mb-4" style={{ color: 'var(--accent-purple)' }}>
                    404
                </div>
                <h1 className="font-serif text-2xl mb-3" style={{ color: 'var(--text-primary)' }}>
                    这条小径没有通向任何地方
                </h1>
                <p className="mb-8 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                    页面可能已经被搬走了，或者链接里混进了一个错字。
                </p>
                <Link to="/" className="btn-pearl inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-medium">
                    <i className="fas fa-home"></i>
                    回到花园入口
                </Link>
            </div>
        </div>
    </div>
);

export default NotFound;
