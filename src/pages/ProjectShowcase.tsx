import React, { useState, useMemo } from 'react';
import Navbar from '../components/Navbar';
import { projects, categories, Project } from '../data/projects';

const TAG_COLORS = [
    { bg: 'var(--tint-purple)', color: 'var(--ink-purple)' },
    { bg: 'var(--tint-pink)', color: 'var(--ink-pink)' },
    { bg: 'var(--tint-cyan)', color: 'var(--ink-cyan)' },
    { bg: 'var(--tint-gold)', color: 'var(--ink-gold)' },
];

const ProjectCard: React.FC<{ project: Project; index: number }> = React.memo(({ project, index }) => {
    const tilt = (index % 3 - 1) * 1.2;
    return (
        <div
            className="glass-card p-5 flex flex-col h-full group"
            style={{
                transform: `rotate(${tilt}deg)`,
                transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
            }}
        >
            {/* 年份角标 */}
            <div className="flex items-center justify-between mb-3">
                <span className="tag-badge text-xs px-2.5 py-1 rounded-full">{project.year}</span>
                <div className="flex gap-2">
                    {project.github && (
                        <a href={project.github} target="_blank" rel="noopener noreferrer"
                            className="text-sm transition-colors hover:opacity-70"
                            style={{ color: 'var(--text-secondary)' }} title="GitHub">
                            <i className="fab fa-github"></i>
                        </a>
                    )}
                    {project.link && (
                        <a href={project.link} target="_blank" rel="noopener noreferrer"
                            className="text-sm transition-colors hover:opacity-70"
                            style={{ color: 'var(--text-secondary)' }} title="访问">
                            <i className="fas fa-external-link-alt"></i>
                        </a>
                    )}
                </div>
            </div>

            {/* 标题 */}
            <h3 className="font-serif text-lg mb-2" style={{ color: 'var(--text-primary)' }}>
                {project.title}
            </h3>

            {/* 描述 */}
            <p className="text-sm leading-relaxed mb-4 flex-1" style={{ color: 'var(--text-secondary)' }}>
                {project.description}
            </p>

            {/* 技术标签 */}
            <div className="flex flex-wrap gap-1.5 mt-auto">
                {project.techs.map((tech) => {
                    const c = TAG_COLORS[Math.floor(tech.length) % TAG_COLORS.length];
                    return (
                        <span key={tech} className="text-xs px-2 py-0.5 rounded-full border"
                            style={{ background: c.bg, color: c.color, borderColor: 'transparent' }}>
                            {tech}
                        </span>
                    );
                })}
            </div>
        </div>
    );
});
ProjectCard.displayName = 'ProjectCard';

const ProjectShowcase: React.FC = () => {
    const [activeCategory, setActiveCategory] = useState<Project['category'] | 'all'>('all');

    const filtered = useMemo(
        () => activeCategory === 'all' ? projects : projects.filter(p => p.category === activeCategory),
        [activeCategory]
    );

    return (
        <div className="min-h-screen" style={{ background: 'transparent' }}>
            <Navbar />
            <div className="container mx-auto p-4 md:p-8" style={{ paddingTop: '7rem' }}>
                <div className="max-w-4xl mx-auto">
                    {/* 标题区 */}
                    <div className="mb-10 text-center">
                        <h1 className="text-4xl font-serif mb-2" style={{ color: 'var(--text-primary)' }}>项目展示</h1>
                        <p style={{ color: 'var(--text-secondary)' }}>从课程设计到个人探索，每一行代码都是成长的印记</p>
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

                    {/* 项目网格 */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        {filtered.map((project, i) => (
                            <ProjectCard key={project.id} project={project} index={i} />
                        ))}
                    </div>

                    {filtered.length === 0 && (
                        <div className="glass-card p-12 text-center mt-8">
                            <i className="fas fa-folder-open text-4xl mb-4" style={{ color: 'var(--accent-purple)' }}></i>
                            <p style={{ color: 'var(--text-secondary)' }}>该分类下暂无项目</p>
                        </div>
                    )}

                    {/* 返回首页 */}
                    <div className="mt-12 text-center">
                        <a href="/" className="btn-pearl inline-flex items-center gap-2 px-6 py-3 font-medium rounded-lg">
                            <i className="fas fa-home"></i>返回首页
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProjectShowcase;
