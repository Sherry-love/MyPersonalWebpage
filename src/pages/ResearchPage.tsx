import React from 'react';
import Navbar from '../components/Navbar';

interface ResearchInterest {
    title: string;
    icon: string;
    items: string[];
}

const interests: ResearchInterest[] = [
    {
        title: '机器学习与深度学习',
        icon: 'fa-brain',
        items: ['监督学习与集成方法', '神经网络基础架构', '自然语言处理入门', 'Kaggle 竞赛实践'],
    },
    {
        title: '数据结构与算法',
        icon: 'fa-project-diagram',
        items: ['高级数据结构（红黑树、B树、跳表）', '图论与动态规划', '算法复杂度分析与优化', 'LeetCode / 洛谷刷题'],
    },
    {
        title: '操作系统',
        icon: 'fa-microchip',
        items: ['进程调度与内存管理', '文件系统与 I/O', '并发编程与同步机制', 'Linux 内核探索'],
    },
    {
        title: '计算机网络',
        icon: 'fa-network-wired',
        items: ['TCP/IP 协议栈', 'HTTP 与 Web 架构', 'Socket 网络编程', '网络安全基础'],
    },
];

const keywords = [
    'C++', 'Python', '机器学习', '数据结构', '算法', '操作系统',
    '计算机网络', 'React', 'TypeScript', 'Linux', 'Git', 'Docker',
];

const ResearchPage: React.FC = () => {
    return (
        <div className="min-h-screen" style={{ background: 'transparent' }}>
            <Navbar />
            <div className="container mx-auto p-4 md:p-8" style={{ paddingTop: '7rem' }}>
                <div className="max-w-3xl mx-auto">
                    {/* 标题区 */}
                    <div className="mb-10 text-center">
                        <h1 className="text-4xl font-serif mb-2" style={{ color: 'var(--text-primary)' }}>学术与研究</h1>
                        <p style={{ color: 'var(--text-secondary)' }}>青岛大学 · 计算机科学与技术专业 · 本科在读</p>
                    </div>

                    {/* 研究兴趣区 */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
                        {interests.map((interest) => (
                            <div key={interest.title} className="glass-card p-5 group">
                                <div className="flex items-center gap-2 mb-3">
                                    <i className={`fas ${interest.icon} text-lg`} style={{ color: 'var(--accent-purple)' }}></i>
                                    <h3 className="font-serif text-base" style={{ color: 'var(--text-primary)' }}>
                                        {interest.title}
                                    </h3>
                                </div>
                                <ul className="space-y-2">
                                    {interest.items.map((item) => (
                                        <li key={item} className="flex items-start gap-2 text-sm"
                                            style={{ color: 'var(--text-secondary)' }}>
                                            <span style={{ color: 'var(--accent-pink)', marginTop: '2px' }}>·</span>
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>

                    {/* 技能关键词云 */}
                    <div className="glass-card p-6 mb-10 text-center">
                        <h3 className="font-serif text-lg mb-4" style={{ color: 'var(--text-primary)' }}>
                            <i className="fas fa-tags mr-2" style={{ color: 'var(--accent-purple)' }}></i>
                            技能关键词
                        </h3>
                        <div className="flex flex-wrap justify-center gap-2">
                            {keywords.map((kw) => (
                                <span key={kw}
                                    className="tag-badge inline-block text-sm px-3 py-1 rounded-full cursor-default"
                                    style={{
                                        transition: 'transform 0.2s ease, background 0.2s ease',
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.transform = 'scale(1.08)';
                                        e.currentTarget.style.background = 'rgba(196,181,213,0.35)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.transform = 'scale(1)';
                                        e.currentTarget.style.background = '';
                                    }}
                                >
                                    {kw}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* 课程亮点 */}
                    <div className="glass-card p-6 mb-10">
                        <h3 className="font-serif text-lg mb-4 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
                            <i className="fas fa-book-open" style={{ color: 'var(--accent-pink)' }}></i>
                            核心课程
                        </h3>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                            {[
                                { name: '数据结构', grade: 'A' },
                                { name: '操作系统', grade: 'A' },
                                { name: '计算机网络', grade: 'A-' },
                                { name: '计算机组成原理', grade: 'A-' },
                                { name: '数据库原理', grade: 'A' },
                                { name: '编译原理', grade: 'A-' },
                            ].map((c) => (
                                <div key={c.name} className="flex items-center justify-between px-3 py-2 rounded-lg border"
                                    style={{ borderColor: 'var(--pearl-border)', background: 'var(--glass-bg)' }}>
                                    <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>{c.name}</span>
                                    <span className="text-xs font-mono font-bold" style={{ color: 'var(--accent-purple)' }}>{c.grade}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="text-center">
                        <a href="/" className="btn-pearl inline-flex items-center gap-2 px-6 py-3 font-medium rounded-lg">
                            <i className="fas fa-home"></i>返回首页
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ResearchPage;
