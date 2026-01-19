import React from 'react';
import TerminalWindow from './TerminalWindow.tsx';

const skills = [
    'C++', 'Python', 'Data Structures & Algorithms', 'Operating Systems',
    'Machine Learning', 'Deep Learning', 'R', 'SAS'
];

const Skills: React.FC = () => {
    return (
        <TerminalWindow title="tech_stack.json" icon={<i className="fas fa-cogs"></i>}>
            <div className="flex flex-wrap gap-3">
                {skills.map(skill => (
                    <div key={skill} className="font-mono text-sm bg-violet-200/50 text-violet-700 px-4 py-2 rounded-full cursor-default transition-all duration-300 hover:bg-pink-200 hover:text-pink-800 hover:shadow-md hover:shadow-pink-200/50 transform hover:-translate-y-1">
                        {skill}
                    </div>
                ))}
            </div>
        </TerminalWindow>
    );
};

export default Skills;
