
import React from 'react';
import TerminalWindow from './TerminalWindow.tsx';

interface PlatformCardProps {
    icon: string;
    iconBgClass: string;
    title: string;
    description: string;
    url: string;
    buttonText: string;
}

const PlatformCard: React.FC<PlatformCardProps> = ({ icon, iconBgClass, title, description, url, buttonText }) => (
    <div className="bg-white/50 p-6 rounded-lg border border-violet-200 flex flex-col h-full transition-all duration-300 hover:border-pink-300 hover:bg-white/80 transform hover:-translate-y-1">
        <div className={`w-16 h-16 rounded-full flex items-center justify-center text-3xl text-white mb-4 ${iconBgClass}`}>
            <i className={icon}></i>
        </div>
        <h3 className="text-xl font-bold text-slate-800 mb-2">{title}</h3>
        <p className="text-slate-500 mb-6 text-sm flex-grow">{description}</p>
        <a href={url} target="_blank" rel="noopener noreferrer" className="mt-auto inline-block text-center bg-violet-500 text-white font-semibold px-6 py-2 rounded-full transition-all duration-300 hover:bg-pink-400 hover:shadow-lg hover:shadow-pink-300/50">
            {buttonText}
        </a>
    </div>
);

const Platforms: React.FC = () => {
    return (
        <TerminalWindow title="my_platforms/" icon={<i className="fas fa-folder-open"></i>}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <PlatformCard
                    icon="fab fa-github"
                    iconBgClass="bg-slate-400"
                    title="GitHub"
                    description="查看我的开源项目、代码仓库和贡献记录。包含C++项目、算法实现和个人工具库。"
                    url="https://github.com/Sherry-love"
                    buttonText="访问 GitHub"
                />
                <PlatformCard
                    icon="fas fa-code"
                    iconBgClass="bg-orange-300"
                    title="LeetCode"
                    description="我的算法练习平台，包含50+道题解，涵盖动态规划、图论、数据结构等算法专题。"
                    url="https://leetcode.cn/u/xiao-yao-t3c/"
                    buttonText="查看题解"
                />
                <PlatformCard
                    icon="fab fa-kaggle"
                    iconBgClass="bg-sky-300"
                    title="Kaggle"
                    description="数据科学和机器学习竞赛平台，参与过多个项目，学习数据分析和机器学习技术。"
                    url="https://www.kaggle.com/liudonghui666"
                    buttonText="访问 Kaggle"
                />
                <PlatformCard
                    icon="fas fa-laptop-code"
                    iconBgClass="bg-red-300"
                    title="洛谷"
                    description="中文算法竞赛练习平台，已完成150+道题目。"
                    url="https://www.luogu.com.cn/user/1658230"
                    buttonText="查看洛谷"
                />
            </div>
        </TerminalWindow>
    );
};

export default Platforms;
