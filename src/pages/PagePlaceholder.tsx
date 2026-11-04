import React from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';

const pageTitles: Record<string, string> = { '/photos': '一些照片' };

const PagePlaceholder: React.FC = () => {
  const location = useLocation();
  return (
    <div className="min-h-screen" style={{ background: 'transparent' }}>
      <Navbar />
      <div className="container mx-auto p-8 pt-20">
        <h1 className="text-4xl font-serif font-bold mb-6" style={{ color: 'var(--text-primary)' }}>
          {pageTitles[location.pathname] || '页面'}
        </h1>
        <div className="glass-card p-8">
          <p className="text-lg" style={{ color: 'var(--text-secondary)' }}>我还没想好写什么</p>
        </div>
      </div>
    </div>
  );
};

export default PagePlaceholder;
