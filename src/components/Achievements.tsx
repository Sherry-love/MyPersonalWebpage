import React from 'react';
import type { CSSProperties } from 'react';

interface Achievement {
    id: number;
    title: string;
    organization: string;
    period: string;
    description: string;
    type: 'competition' | 'award' | 'certification';
}

const achievementsData: Achievement[] = [
    { id: 1, title: '本科生优秀校级奖学金', organization: '青岛大学', period: '2024年5月，2025年10月', description: '综合成绩专业前5%，荣获校级一等奖学金；综合成绩专业前10%，荣获校级二等奖学金', type: 'award' },
    { id: 2, title: '优秀团员', organization: '青岛大学', period: '2024年5月', description: '优秀团员', type: 'award' },
    { id: 3, title: '优秀学生', organization: '青岛大学', period: '2025年10月', description: '成绩优异，荣获优秀学生', type: 'award' },
    { id: 4, title: '学习标兵', organization: '青岛大学', period: '2025年10月', description: '成绩优异，荣获学习标兵', type: 'award' },
    { id: 5, title: '蓝桥杯省三等奖', organization: '工信部', period: '2024年4月', description: '省三等奖', type: 'competition' },
];

const TYPE_CFG: Record<Achievement['type'], { label: string; seal: string; accent: string }> = {
    competition: { label: '竞赛经历', seal: '赛', accent: '#8e7fae' },
    award: { label: '荣誉奖项', seal: '奖', accent: '#b07f8c' },
    certification: { label: '认证证书', seal: '证', accent: '#6d9494' },
};

const TILTS = [-1.1, 1.3, -0.7, 1.6, -1.4];

const Achievements: React.FC = () => {
    const counts = {
        competition: achievementsData.filter((item) => item.type === 'competition').length,
        award: achievementsData.filter((item) => item.type === 'award').length,
        certification: achievementsData.filter((item) => item.type === 'certification').length,
    };

    return (
        <section className="award-wall">
            <header className="award-head">
                <p className="award-kicker">AWARDS</p>
                <h2 className="award-title">挂在墙上的证明</h2>
                <p className="award-sub">有些是奖状，有些只是提醒自己别停下</p>
            </header>

            <div className="award-rail" aria-hidden="true" />
            <div className="award-grid">
                {achievementsData.map((achievement, index) => {
                    const cfg = TYPE_CFG[achievement.type];
                    const style = {
                        '--tilt': `${TILTS[index % TILTS.length]}deg`,
                        '--seal': cfg.accent,
                    } as CSSProperties;

                    return (
                        <article key={achievement.id} className="award-frame" style={style}>
                            <span className="award-nail" aria-hidden="true" />
                            <div className="award-paper">
                                <span className="award-kind" style={{ color: cfg.accent }}>{cfg.label}</span>
                                <h3 className="award-name">{achievement.title}</h3>
                                <p className="award-org">
                                    <span>{achievement.organization}</span>
                                    <span className="award-dot">·</span>
                                    <span>{achievement.period}</span>
                                </p>
                                <p className="award-desc">{achievement.description}</p>
                                <span className="award-seal" aria-hidden="true">{cfg.seal}</span>
                            </div>
                        </article>
                    );
                })}
            </div>

            <div className="award-summary">
                {[
                    { n: counts.competition, label: '竞赛经历' },
                    { n: counts.award, label: '荣誉奖项' },
                    { n: counts.certification, label: '认证证书' },
                    { n: achievementsData.length, label: '总计' },
                ].map((item) => (
                    <div key={item.label} className="award-plaque">
                        <span className="award-plaque-number">{item.n}</span>
                        <span className="award-plaque-label">{item.label}</span>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default Achievements;
