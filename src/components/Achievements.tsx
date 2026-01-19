import React from 'react';
import TerminalWindow from './TerminalWindow';
import TypingEffect from './TypingEffect';

interface Achievement {
    id: number;
    title: string;
    organization: string;
    period: string;
    description: string;
    type: 'competition' | 'award' | 'certification';
    link?: string;
}

const Achievements: React.FC = () => {
    const achievementsData: Achievement[] = [
        {
            id: 1,
            title: '本科生优秀校级奖学金',
            organization: '青岛大学',
            period: '2024年5月，2025年10月',
            description: '综合成绩专业前5%，荣获校级一等奖学金' +
                '综合成绩专业前10%，荣获校级二等奖学金',
            type: 'award'
        },
        {
            id: 2,
            title: '优秀团员',
            organization: '青岛大学',
            period: '2024年5月',
            description: '优秀团员',
            type: 'award'
        },
        {
            id: 3,
            title: '优秀学生',
            organization: '青岛大学',
            period: '2025年10月',
            description: '成绩优异，荣获优秀学生',
            type: 'award'
        },
        {
            id: 4,
            title: '学习标兵',
            organization: '青岛大学',
            period: '2025年10月',
            description: '成绩优异，荣获学习标兵',
            type: 'award'
        },
        {
            id: 5,
            title: '蓝桥杯省三等奖',
            organization: '工信部',
            period: '2024年4月',
            description: '省三等奖',
            type: 'competition'
        },
    ];

    const getTypeIcon = (type: Achievement['type']) => {
        switch (type) {
            case 'competition':
                return <i className="fas fa-briefcase text-blue-500"></i>;
            case 'award':
                return <i className="fas fa-trophy text-yellow-500"></i>;
            case 'certification':
                return <i className="fas fa-certificate text-green-500"></i>;
            default:
                return <i className="fas fa-star text-violet-500"></i>;
        }
    };

    const getTypeColor = (type: Achievement['type']) => {
        switch (type) {
            case 'competition':
                return 'border-blue-200 bg-blue-50/30 hover:bg-blue-50/50';
            case 'award':
                return 'border-yellow-200 bg-yellow-50/30 hover:bg-yellow-50/50';
            case 'certification':
                return 'border-green-200 bg-green-50/30 hover:bg-green-50/50';
            default:
                return 'border-violet-200 bg-violet-50/30 hover:bg-violet-50/50';
        }
    };

    const getTypeLabel = (type: Achievement['type']) => {
        switch (type) {
            case 'competition':
                return <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">竞赛经历</span>;
            case 'award':
                return <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full">荣誉奖项</span>;
            case 'certification':
                return <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">认证证书</span>;
            default:
                return <span className="text-xs bg-violet-100 text-violet-700 px-2 py-1 rounded-full">成就</span>;
        }
    };

    return (
        <TerminalWindow title="achievements.json" icon={<i className="fas fa-medal"></i>}>
            <div className="space-y-6">
                <div className="text-slate-600 leading-relaxed mb-4 min-h-[40px]">
                    <TypingEffect
                        text="Here are my professional achievements, awards, and certifications that showcase my journey and accomplishments..."
                        speed={30}
                        loop
                        loopDelay={30000}
                    />
                </div>

                <div className="space-y-4">
                    {achievementsData.map((achievement) => (
                        <div
                            key={achievement.id}
                            className={`p-4 rounded-lg border transition-all duration-300 hover:shadow-md hover:-translate-y-1 cursor-default ${getTypeColor(achievement.type)}`}
                        >
                            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                                <div className="flex items-start gap-3">
                                    <div className="text-2xl mt-1">
                                        {getTypeIcon(achievement.type)}
                                    </div>
                                    <div>
                                        <div className="flex flex-wrap items-center gap-2 mb-1">
                                            <h3 className="font-bold text-lg text-slate-800">
                                                {achievement.title}
                                            </h3>
                                            {getTypeLabel(achievement.type)}
                                        </div>
                                        <p className="text-slate-600 font-medium">
                                            {achievement.organization}
                                        </p>
                                        <p className="text-sm text-slate-500 mb-2">
                                            {achievement.period}
                                        </p>
                                        <p className="text-slate-700">
                                            {achievement.description}
                                        </p>
                                    </div>
                                </div>

                                {achievement.link && (
                                    <a
                                        href={achievement.link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-1 text-sm text-violet-600 hover:text-violet-800 transition-colors duration-300 self-start sm:self-center"
                                    >
                                        <i className="fas fa-external-link-alt"></i>
                                        查看详情
                                    </a>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                {}
                <div className="mt-8 pt-6 border-t border-slate-200">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="bg-violet-100/50 p-4 rounded-md text-center border border-violet-200 transition-all duration-300 hover:bg-violet-200/50 hover:border-violet-300">
                            <div className="text-2xl font-bold font-mono text-violet-600">
                                {achievementsData.filter(a => a.type === 'competition').length}
                            </div>
                            <div className="text-sm text-slate-500 mt-1">竞赛经历</div>
                        </div>
                        <div className="bg-yellow-100/50 p-4 rounded-md text-center border border-yellow-200 transition-all duration-300 hover:bg-yellow-200/50 hover:border-yellow-300">
                            <div className="text-2xl font-bold font-mono text-yellow-600">
                                {achievementsData.filter(a => a.type === 'award').length}
                            </div>
                            <div className="text-sm text-slate-500 mt-1">荣誉奖项</div>
                        </div>
                        <div className="bg-green-100/50 p-4 rounded-md text-center border border-green-200 transition-all duration-300 hover:bg-green-200/50 hover:border-green-300">
                            <div className="text-2xl font-bold font-mono text-green-600">
                                {achievementsData.filter(a => a.type === 'certification').length}
                            </div>
                            <div className="text-sm text-slate-500 mt-1">认证证书</div>
                        </div>
                        <div className="bg-pink-100/50 p-4 rounded-md text-center border border-pink-200 transition-all duration-300 hover:bg-pink-200/50 hover:border-pink-300">
                            <div className="text-2xl font-bold font-mono text-pink-600">
                                {achievementsData.length}
                            </div>
                            <div className="text-sm text-slate-500 mt-1">总成就数</div>
                        </div>
                    </div>
                </div>
            </div>
        </TerminalWindow>
    );
};

export default Achievements;