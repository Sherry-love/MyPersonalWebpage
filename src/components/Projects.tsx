import React from 'react';
import TerminalWindow from './TerminalWindow.tsx';

const Projects: React.FC = () => {
    return (
        <TerminalWindow title="current_project.cpp" icon={<i className="fas fa-project-diagram"></i>}>
            <p className="text-slate-600 leading-relaxed mb-6">
                我正在开发一个项目。
            </p>
            <div className="flex flex-wrap gap-4">
                <a href="#" className="bg-violet-500 text-white font-semibold px-6 py-2 rounded-full transition-all duration-300 hover:bg-pink-400 hover:shadow-lg hover:shadow-pink-300/50">
                    <i className="fas fa-search mr-2"></i>查看项目详情
                </a>
                <a href="#" className="bg-slate-400 text-white font-semibold px-6 py-2 rounded-full transition-all duration-300 hover:bg-slate-500 hover:shadow-lg hover:shadow-slate-400/30">
                    <i className="fas fa-folder-plus mr-2"></i>更多项目
                </a>
            </div>
        </TerminalWindow>
    );
};

export default Projects;
