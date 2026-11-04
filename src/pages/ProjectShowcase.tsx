import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import ProjectShelf from '../components/ProjectShelf';
import { projects, categories, type Project } from '../data/projects';

const ProjectShowcase: React.FC = () => {
    const [activeCategory, setActiveCategory] = useState<Project['category'] | 'all'>('all');

    const filtered = useMemo(
        () => (activeCategory === 'all' ? projects : projects.filter((project) => project.category === activeCategory)),
        [activeCategory]
    );

    return (
        <div className="min-h-screen" style={{ background: 'transparent' }}>
            <Navbar />
            <div className="container mx-auto p-4 md:p-8" style={{ paddingTop: '7rem' }}>
                <div className="max-w-4xl mx-auto">
                    <div className="mb-10 text-center">
                        <p className="shelf-kicker">MY SHELF</p>
                        <h1 className="text-4xl font-serif mb-2" style={{ color: 'var(--text-primary)' }}>项目书架</h1>
                        <p style={{ color: 'var(--text-secondary)' }}>从课程设计到个人探索，每一本都翻过不少遍</p>
                    </div>

                    {/* 分类筛选器 */}
                    <div className="flex flex-wrap justify-center gap-2 mb-8">
                        {categories.map((cat) => (
                            <button
                                key={cat.key}
                                onClick={() => setActiveCategory(cat.key)}
                                className="px-5 py-2 rounded-full text-sm font-medium transition-all duration-200"
                                style={{
                                    background: activeCategory === cat.key
                                        ? 'linear-gradient(135deg, var(--accent-purple), var(--accent-pink))'
                                        : 'var(--glass-bg)',
                                    color: activeCategory === cat.key ? '#fff' : 'var(--text-secondary)',
                                    border: activeCategory === cat.key ? 'none' : '1px solid var(--pearl-border)',
                                    transform: activeCategory === cat.key ? 'scale(1.02)' : 'scale(1)',
                                }}
                            >
                                {cat.label}
                            </button>
                        ))}
                    </div>

                    <ProjectShelf items={filtered} />

                    <div className="mt-12 text-center">
                        <Link to="/" className="btn-pearl inline-flex items-center gap-2 px-6 py-3 font-medium rounded-lg">
                            <i className="fas fa-home"></i>返回首页
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProjectShowcase;
