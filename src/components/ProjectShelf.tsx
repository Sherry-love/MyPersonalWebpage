import React, { useEffect, useState } from 'react';
import type { CSSProperties } from 'react';
import { projects, type Project } from '../data/projects';

const CATEGORY_LABEL: Record<Project['category'], string> = {
    personal: '个人项目',
    course: '课程项目',
    opensource: '开源贡献',
};

/* 布面书脊的颜色：低饱和，和花园色盘同一个家族 */
const BOOK_COLOR: Record<Project['category'], string> = {
    personal: '#a98aa8',
    course: '#8b93b5',
    opensource: '#8fa58f',
};

const LEANS = [-1.6, 1.1, -0.7, 1.7, -1.1, 0.8];

interface ProjectShelfProps {
    items?: Project[];
    /** 是否展示下方的借阅卡（详情） */
    showDetail?: boolean;
}

const ProjectShelf: React.FC<ProjectShelfProps> = ({ items = projects, showDetail = true }) => {
    const [activeId, setActiveId] = useState<string>(items[0]?.id ?? '');

    // 筛选条件变化后，原来的选中项可能不在列表里了
    useEffect(() => {
        if (!items.some((project) => project.id === activeId)) {
            setActiveId(items[0]?.id ?? '');
        }
    }, [items, activeId]);

    const active = items.find((project) => project.id === activeId) ?? items[0];

    if (items.length === 0) {
        return (
            <div className="shelf-empty">
                <i className="fas fa-book" />
                <p>这一格书架还空着</p>
            </div>
        );
    }

    return (
        <div className="project-shelf">
            <div className="shelf-books" role="group" aria-label="项目书架，可点击书本查看详情">
                {items.map((project, index) => {
                    const isActive = project.id === active?.id;
                    const style = {
                        '--book': BOOK_COLOR[project.category],
                        '--lean': `${LEANS[index % LEANS.length]}deg`,
                    } as CSSProperties;

                    return (
                        <button
                            key={project.id}
                            type="button"
                            className={`shelf-book${isActive ? ' is-active' : ''}`}
                            style={style}
                            onClick={() => setActiveId(project.id)}
                            onFocus={() => setActiveId(project.id)}
                            aria-pressed={isActive}
                            title={`${project.title} · ${CATEGORY_LABEL[project.category]}`}
                        >
                            <span className="shelf-book-title">{project.spineTitle ?? project.title}</span>
                            <span className="shelf-book-year">
                                {project.year.length > 4 ? project.year.slice(0, 4) : project.year}
                            </span>
                        </button>
                    );
                })}
                <span className="shelf-bookend" aria-hidden="true" />
                <span className="shelf-plant" aria-hidden="true" />
            </div>
            <div className="shelf-plank" aria-hidden="true" />

            {showDetail && active && (
                <article className="borrow-card" key={active.id}>
                    <div className="borrow-head">
                        <span>借阅卡 · {CATEGORY_LABEL[active.category]}</span>
                        <span>{active.year}</span>
                    </div>
                    <h3 className="borrow-title">{active.title}</h3>
                    <p className="borrow-desc">{active.description}</p>

                    <div className="borrow-tags">
                        {active.techs.map((tech) => (
                            <span key={tech}>{tech}</span>
                        ))}
                    </div>

                    <div className="borrow-actions">
                        {active.github && (
                            <a href={active.github} target="_blank" rel="noopener noreferrer">
                                <i className="fab fa-github" />
                                GitHub
                            </a>
                        )}
                        {active.link && (
                            <a href={active.link} target="_blank" rel="noopener noreferrer">
                                <i className="fas fa-arrow-up-right-from-square" />
                                去看看
                            </a>
                        )}
                    </div>

                    <span className="borrow-stamp" aria-hidden="true">已借阅</span>
                </article>
            )}
        </div>
    );
};

export default ProjectShelf;
