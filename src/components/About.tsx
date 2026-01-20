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
    const aboutText = "在坚冰还盖着北海的时候，我看到了怒放的梅花。";

    return (
        <TerminalWindow title="about_me.txt" icon={<i className="fas fa-user-circle"></i>}>
            <div className="flex flex-col lg:flex-row gap-8 items-center">
                {/* 左侧：圆形照片框 */}
                <div className="w-full lg:w-1/3 flex flex-col items-center">
                    <div className="relative w-48 h-48 md:w-56 md:h-56 rounded-full overflow-hidden border-4 border-violet-200 shadow-lg shadow-violet-200/50 hover:shadow-violet-300/70 transition-all duration-500 hover:scale-105 hover:border-pink-300 group">
                        {}
                        <img
                            src="/Reza.jpg"
                            alt="个人照片"
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />

                        {/* 装饰性的光圈效果 */}
                        <div className="absolute inset-0 rounded-full border-2 border-white/30 pointer-events-none"></div>
                        <div className="absolute inset-0 rounded-full border-4 border-transparent group-hover:border-pink-200/50 pointer-events-none transition-all duration-500"></div>
                    </div>

                    {/* 照片下方的描述 */}
                    <div className="mt-6 text-center">
                        <h3 className="text-xl font-bold text-slate-800 mb-1">刘东徽(Anthony)</h3>
                        <p className="text-slate-600">我是一名充满热情的计算机科学专业学生，专注于系统编程和算法设计。</p>
                        <div className="flex justify-center gap-3 mt-3">
                            <a href="https://github.com/Sherry-love" className="text-violet-500 hover:text-pink-500 transition-colors" title="GitHub">
                                <i className="fab fa-github text-lg"></i>
                            </a>
                            <a href="https://space.bilibili.com/487062571" className="text-violet-500 hover:text-pink-500 transition-colors" title="Bilibili">
                                <i className="fab fa-bilibili text-lg"></i>
                            </a>
                            <a href="https://www.zhihu.com/people/wei-xin-yong-hu-63-11-4" className="text-violet-500 hover:text-pink-500 transition-colors" title="知乎">
                                <i className="fab fa-zhihu text-lg"></i>
                            </a>
                            <a href="#" className="text-violet-500 hover:text-pink-500 transition-colors" title="抖音">
                                <i className="fab fa-tiktok text-lg"></i>
                            </a>
                        </div>
                    </div>
                </div>

                {/* 右侧：文本和统计信息 */}
                <div className="w-full lg:w-2/3">
                    <div className="text-slate-600 leading-relaxed mb-8 min-h-[100px] sm:min-h-[70px]">
                        <TypingEffect text={aboutText} speed={30} loop loopDelay={30000} />
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <StatItem value="50+" label="LeetCode Solved" />
                        <StatItem value="2+" label="GitHub Projects" />
                        <StatItem value="1+" label="Kaggle Competitions" />
                        <StatItem value="150+" label="Luogu Solved" />
                    </div>
                </div>
            </div>
        </TerminalWindow>
    );
};

export default About;