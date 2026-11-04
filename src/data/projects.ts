export interface Project {
    id: string;
    title: string;
    /** 书脊上的短标题（不填则用 title），太长会把书脊挤爆 */
    spineTitle?: string;
    category: 'personal' | 'course' | 'opensource';
    description: string;
    techs: string[];
    link?: string;
    github?: string;
    year: string;
    cover?: string;
}

export const projects: Project[] = [
    {
        id: 'personal-webpage',
        title: '印象派花园 · 个人网页',
        spineTitle: '印象派花园',
        category: 'personal',
        description: '基于 React + TypeScript 构建的个人作品集网站，以印象派花园为设计灵感，实现毛玻璃卡片、主题切换、Canvas 代码花园、平滑滚动等交互效果。',
        techs: ['React', 'TypeScript', 'Tailwind CSS', 'Vite', 'Lenis'],
        github: 'https://github.com/Sherry-love',
        year: '2026',
    },
    {
        id: 'ds-course',
        title: '数据结构课程设计',
        category: 'course',
        description: '实现红黑树、B树、跳表等高级数据结构的 C++ 模板类库，包含完整单元测试和性能基准对比。',
        techs: ['C++', 'CMake', 'GTest'],
        github: 'https://github.com/Sherry-love',
        year: '2025',
    },
    {
        id: 'ml-intro',
        title: '机器学习入门实践',
        category: 'course',
        description: '使用 scikit-learn 完成分类、回归、聚类经典算法实践，包含 Kaggle 数据集的分析报告和可视化。',
        techs: ['Python', 'scikit-learn', 'Pandas', 'Matplotlib'],
        github: 'https://github.com/Sherry-love',
        year: '2025',
    },
    {
        id: 'os-lab',
        title: '操作系统课程实验',
        category: 'course',
        description: '实现进程调度模拟器、页面置换算法对比、简易 Shell 解释器、多线程生产者-消费者模型。',
        techs: ['C', 'Linux', 'POSIX Threads'],
        github: 'https://github.com/Sherry-love',
        year: '2025',
    },
    {
        id: 'leetcode-solutions',
        title: 'LeetCode 题解集',
        spineTitle: 'LeetCode 题解',
        category: 'opensource',
        description: '50+ 道算法题解，涵盖动态规划、图论、二叉树、贪心等专题，附带思路注释和复杂度分析。',
        techs: ['C++', 'Python'],
        link: 'https://leetcode.cn/u/xiao-yao-t3c/',
        github: 'https://github.com/Sherry-love',
        year: '2024-2026',
    },
    {
        id: 'networking-lab',
        title: '计算机网络课设',
        category: 'course',
        description: '基于 Socket 编程实现简易 HTTP 服务器和聊天室，支持多客户端并发连接和文件传输。',
        techs: ['C', 'Socket', 'TCP/IP'],
        github: 'https://github.com/Sherry-love',
        year: '2025',
    },
];

export const categories: { key: Project['category'] | 'all'; label: string }[] = [
    { key: 'all', label: '全部' },
    { key: 'personal', label: '个人项目' },
    { key: 'course', label: '课程项目' },
    { key: 'opensource', label: '开源贡献' },
];
