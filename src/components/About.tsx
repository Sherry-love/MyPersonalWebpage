import React from 'react';
import TerminalWindow from './TerminalWindow';
import TypingEffect from './TypingEffect';

const StatItem: React.FC<{ value: string; label: string }> = ({ value, label }) => (
    <div className="bg-violet-100/50 p-4 rounded-md text-center border border-violet-200 transition-all duration-300 hover:bg-violet-200/50 hover:border-violet-300">
        <div className="text-3xl font-bold font-mono text-violet-500">{value}</div>
        <div className="text-sm text-slate-500 mt-1">{label}</div>
    </div>
);

const About: React.FC = () => {
    const aboutText = "我是一名充满热情的计算机科学专业学生，专注于系统编程和算法设计。" +
        "在坚冰还盖着北海的时候，我看到了怒放的梅花。";

    return (
        <TerminalWindow title="about_me.txt" icon={<i className="fas fa-user-circle"></i>}>
            <div className="text-slate-600 leading-relaxed mb-8 min-h-[100px] sm:min-h-[70px]">
                <TypingEffect text={aboutText} speed={30} loop loopDelay={30000} />
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <StatItem value="50+" label="LeetCode Solved" />
                <StatItem value="2+" label="GitHub Projects" />
                <StatItem value="1+" label="Kaggle Competitions" />
                <StatItem value="150+" label="Luogu Solved" />
            </div>
        </TerminalWindow>
    );
};

export default About;