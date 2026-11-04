import React from 'react';
import { Link } from 'react-router-dom';
import { projects } from '../data/projects';
import TerminalWindow from './TerminalWindow';

const FEATURED_COUNT = 3;

const Projects: React.FC = () => {
    const featured = projects.slice(0, FEATURED_COUNT);

    return (
        <TerminalWindow title="featured_projects.json" icon={<i className="fas fa-project-diagram"></i>}>
            <p className="leading-relaxed mb-6" style={{ color: 'var(--text-secondary)' }}>
                挑几个最近在做的项目放在这里，完整的项目列表在「项目」页。
            </p>

            <div className="space-y-3">
                {featured.map((project) => (
                    <div
                        key={project.id}
                        className="flex flex-col gap-2 p-4 rounded-lg border transition-all duration-200 hover:-translate-y-0.5 sm:flex-row sm:items-start sm:justify-between"
                        style={{ background: 'var(--glass-bg)', borderColor: 'var(--pearl-border)' }}
                    >
                        <div className="min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                                <h3 className="font-serif text-base" style={{ color: 'var(--text-primary)' }}>
                                    {project.title}
                                </h3>
                                <span className="tag-badge text-xs px-2 py-0.5 rounded-full font-mono">
                                    {project.year}
                                </span>
                            </div>
                            <p className="text-sm mt-1 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                                {project.description}
                            </p>
                            <div className="flex flex-wrap gap-1.5 mt-2">
                                {project.techs.map((tech) => (
                                    <span key={tech} className="text-xs px-2 py-0.5 rounded-full"
                                        style={{ background: 'var(--tint-purple)', color: 'var(--ink-purple)' }}>
                                        {tech}
                                    </span>
                                ))}
                            </div>
                        </div>
                        <div className="flex gap-3 shrink-0 sm:pl-4">
                            {project.github && (
                                <a href={project.github} target="_blank" rel="noopener noreferrer"
                                    className="text-sm transition-opacity hover:opacity-70"
                                    style={{ color: 'var(--text-secondary)' }} title="GitHub">
                                    <i className="fab fa-github"></i>
                                </a>
                            )}
                            {project.link && (
                                <a href={project.link} target="_blank" rel="noopener noreferrer"
                                    className="text-sm transition-opacity hover:opacity-70"
                                    style={{ color: 'var(--text-secondary)' }} title="访问">
                                    <i className="fas fa-external-link-alt"></i>
                                </a>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-6 text-center">
                <Link to="/a2" className="btn-pearl-secondary inline-flex items-center gap-2 px-5 py-2 rounded-full text-sm font-medium">
                    查看全部 {projects.length} 个项目
                    <i className="fas fa-arrow-right text-xs"></i>
                </Link>
            </div>
        </TerminalWindow>
    );
};

export default Projects;
