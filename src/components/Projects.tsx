import React from 'react';
import { Link } from 'react-router-dom';
import { projects } from '../data/projects';
import ProjectShelf from './ProjectShelf';

const Projects: React.FC = () => (
    <section className="shelf-section">
        <header className="shelf-head">
            <div>
                <p className="shelf-kicker">MY SHELF</p>
                <h2 className="shelf-heading">最近在做的项目</h2>
                <p className="shelf-sub">抽一本下来，翻开看看</p>
            </div>
            <Link to="/a2" className="shelf-more">
                全部 {projects.length} 个项目
                <i className="fas fa-arrow-right" />
            </Link>
        </header>

        <ProjectShelf items={projects.slice(0, 3)} />
    </section>
);

export default Projects;
