export type WordCategory = '技术' | '生活' | '写作' | '城市' | '站点';

export interface CloudWord {
    text: string;
    /** 3–10，决定字号 */
    weight: number;
    category: WordCategory;
    /** 有对应页面时，点击直接跳过去 */
    href?: string;
}

export const cloudWords: CloudWord[] = [
    // 技术
    { text: '算法', weight: 10, category: '技术', href: '/a2' },
    { text: 'C++', weight: 8, category: '技术' },
    { text: 'Python', weight: 9, category: '技术' },
    { text: '数据结构', weight: 8, category: '技术', href: '/a1' },
    { text: '操作系统', weight: 7, category: '技术', href: '/a1' },
    { text: '计算机网络', weight: 7, category: '技术', href: '/a1' },
    { text: '机器学习', weight: 8, category: '技术', href: '/a1' },
    { text: 'React', weight: 7, category: '技术', href: '/a2' },
    { text: 'TypeScript', weight: 6, category: '技术', href: '/a2' },
    { text: '前端', weight: 6, category: '技术' },
    { text: '数据库', weight: 5, category: '技术' },
    { text: 'Git', weight: 4, category: '技术' },

    // 生活
    { text: '羽毛球', weight: 9, category: '生活' },
    { text: '乒乓球', weight: 6, category: '生活' },
    { text: '动漫', weight: 7, category: '生活' },
    { text: '电影', weight: 6, category: '生活' },
    { text: '阅读', weight: 7, category: '生活' },
    { text: '健身', weight: 5, category: '生活' },
    { text: '书法', weight: 4, category: '生活' },
    { text: '吉他', weight: 6, category: '生活' },
    { text: '魔方', weight: 4, category: '生活' },
    { text: '数独', weight: 5, category: '生活' },

    // 写作
    { text: '随笔', weight: 8, category: '写作', href: '/a3' },
    { text: '暮色', weight: 5, category: '写作', href: '/a3' },
    { text: '时间', weight: 7, category: '写作', href: '/a3' },
    { text: '记忆', weight: 6, category: '写作', href: '/a3' },
    { text: '成长', weight: 5, category: '写作' },

    // 城市
    { text: '青岛', weight: 10, category: '城市', href: '/photos' },
    { text: '海', weight: 9, category: '城市', href: '/photos' },
    { text: '栈桥', weight: 6, category: '城市', href: '/photos' },
    { text: '八大关', weight: 5, category: '城市', href: '/photos' },
    { text: '崂山', weight: 5, category: '城市', href: '/photos' },
    { text: '相册', weight: 6, category: '城市', href: '/photos' },

    // 站点
    { text: '个人网页', weight: 8, category: '站点', href: '/a4' },
    { text: '花园', weight: 7, category: '站点', href: '/a4' },
    { text: '代码花园', weight: 6, category: '站点', href: '/a4' },
];
