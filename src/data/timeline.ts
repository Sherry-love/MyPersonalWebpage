/**
 * 开发时间线（/a4 页面的流态旋转时间轴）。
 *
 * 为什么从 README 里拆出来：
 *   之前是用正则从 README 的「简单记录」段落里抓日期和条目，
 *   改一句 README 的排版就可能让整条时间轴空掉。现在这里是唯一数据源，
 *   README 里保留一份给人看的版本即可。
 */
export interface TimelineEntry {
    /** 展示用日期，格式：YYYY年M月D日 */
    date: string;
    content: string;
}

export const timeline: TimelineEntry[] = [
    {
        date: '2026年1月9日',
        content: '开始搭建个人网页，添加打字机效果和动态粒子效果。',
    },
    {
        date: '2026年1月10日',
        content: 'Platforms 从静态分栏改为动态旋转。',
    },
    {
        date: '2026年1月19日',
        content: '添加 Hobbies 和 Achievements 部分。',
    },
    {
        date: '2026年1月20日',
        content: '加入图片与导航栏，新增 4 个空白页面。',
    },
    {
        date: '2026年1月21日',
        content: 'pages4 改为网页介绍。',
    },
    {
        date: '2026年6月15日',
        content: '全面重构：滚动渐入、照片倾斜、卡片翻转、页面过渡。',
    },
    {
        date: '2026年6月16日',
        content: '新增暗色模式与小练笔：Markdown、打字机、阅读进度。',
    },
    {
        date: '2026年6月17日',
        content: '新增「代码花园」：Canvas 热力图、贪吃蛇与粒子。',
    },
    {
        date: '2026年6月19日',
        content: '开发时间线改为流态旋转时间轴。',
    },
    {
        date: '2026年11月4日',
        content: '字体图标本地化、真实贡献数据、Pages 自动部署。',
    },
    {
        date: '2026年11月5日',
        content: '新增「此刻的青岛」光线与天气层；五个板块换成信纸、调色盘、奖状墙、拍立得和书架；藏了油画滤镜、萤火虫和一只蜗牛。',
    },
    {
        date: '2026年11月5日',
        content: '相册上线：青岛与莫奈两个抽屉，14 张可看大图的作品，支持自己投递照片。',
    },
    {
        date: '2026年11月5日',
        content: '首页新增 3D 词云小组件：36 个词在球面上缓慢旋转，放在调色盘右侧，可拖拽、暂停、点词跳转。',
    },
    {
        date: '2026年11月6日',
        content: '四季树上线：基于 Blender 教程工程渲染 12 秒四季循环，放在首页标题上方，首屏不跑实时 3D。',
    },
];

export const lastUpdated = timeline[timeline.length - 1]?.date ?? '';
