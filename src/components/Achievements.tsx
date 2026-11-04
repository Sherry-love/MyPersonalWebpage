import React, { useRef, useState, useEffect } from 'react';
import TerminalWindow from './TerminalWindow';
import TypingEffect from './TypingEffect';

interface Achievement {
    id: number; title: string; organization: string; period: string; description: string;
    type: 'competition' | 'award' | 'certification'; link?: string;
}

const achievementsData: Achievement[] = [
    { id:1,title:'本科生优秀校级奖学金',organization:'青岛大学',period:'2024年5月，2025年10月',description:'综合成绩专业前5%，荣获校级一等奖学金；综合成绩专业前10%，荣获校级二等奖学金',type:'award' },
    { id:2,title:'优秀团员',organization:'青岛大学',period:'2024年5月',description:'优秀团员',type:'award' },
    { id:3,title:'优秀学生',organization:'青岛大学',period:'2025年10月',description:'成绩优异，荣获优秀学生',type:'award' },
    { id:4,title:'学习标兵',organization:'青岛大学',period:'2025年10月',description:'成绩优异，荣获学习标兵',type:'award' },
    { id:5,title:'蓝桥杯省三等奖',organization:'工信部',period:'2024年4月',description:'省三等奖',type:'competition' },
];

const TYPE_CFG: Record<Achievement['type'],{icon:string;color:string;label:string;bg:string;border:string;node:string}> = {
    competition:{icon:'fa-briefcase',color:'var(--accent-purple)',label:'竞赛经历',bg:'rgba(232,226,240,0.3)',border:'var(--pearl-border)',node:'var(--accent-purple)'},
    award:{icon:'fa-trophy',color:'var(--accent-pink)',label:'荣誉奖项',bg:'rgba(240,228,224,0.3)',border:'var(--pearl-border)',node:'var(--accent-pink)'},
    certification:{icon:'fa-certificate',color:'var(--mist-cyan)',label:'认证证书',bg:'rgba(225,236,236,0.3)',border:'var(--pearl-border)',node:'var(--mist-cyan)'},
};

const TimelineItem: React.FC<{ achievement: Achievement; index: number }> = ({ achievement, index }) => {
    const ref = useRef<HTMLDivElement>(null);
    const [visible, setVisible] = useState(false);
    const cfg = TYPE_CFG[achievement.type];
    const delay = `${index * 0.15}s`;

    useEffect(() => {
        const node = ref.current; if (!node) return;
        const obs = new IntersectionObserver(([e]) => { if(e.isIntersecting){setVisible(true);obs.disconnect();} },{threshold:0.2});
        obs.observe(node); return () => obs.disconnect();
    }, []);

    return (
        <div ref={ref} className={`relative pl-10 pb-8 last:pb-0 ${visible?'timeline-visible':''}`}>
            <div className="absolute left-[11px] top-3 bottom-0 w-0.5"
                style={{ background: 'linear-gradient(180deg, var(--accent-purple), var(--accent-pink))' }} />
            <div className="timeline-node absolute left-0 top-2 w-6 h-6 rounded-full border-4 z-10 flex items-center justify-center"
                style={{ animationDelay: delay, borderColor: cfg.node, background: 'var(--mist-base)' }}>
                <i className={`fas ${cfg.icon} text-xs`} style={{ color: cfg.node }}></i>
            </div>
            <div className="timeline-card glass-card p-4" style={{ animationDelay: `${index*0.15+0.2}s` }}>
                <div className="flex flex-wrap items-center gap-2 mb-1">
                    <h3 className="font-serif text-base" style={{ color: 'var(--text-primary)' }}>{achievement.title}</h3>
                    <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ background: cfg.bg, color: cfg.node }}>{cfg.label}</span>
                </div>
                <p className="text-sm mb-1" style={{ color: 'var(--text-secondary)' }}>
                    <i className="fas fa-building mr-1"></i>{achievement.organization}
                    <span className="mx-2">·</span>
                    <i className="far fa-calendar mr-1"></i>{achievement.period}
                </p>
                <p className="text-sm mt-2 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{achievement.description}</p>
            </div>
        </div>
    );
};

const Achievements: React.FC = () => (
    <TerminalWindow title="achievements.json" icon={<i className="fas fa-medal"></i>}>
        <div className="space-y-6">
            <div className="leading-relaxed mb-4 min-h-[40px]" style={{ color: 'var(--text-secondary)' }}>
                <TypingEffect text="Here are my professional achievements, awards, and certifications..." speed={30} loop loopDelay={30000} />
            </div>
            <div className="relative">
                {achievementsData.map((a, i) => <TimelineItem key={a.id} achievement={a} index={i} />)}
            </div>
            <div className="mt-8 pt-6 border-t" style={{ borderColor: 'var(--pearl-border)' }}>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                        { n: achievementsData.filter(a=>a.type==='competition').length, label:'竞赛经历', color:'var(--accent-purple)', bg:'rgba(232,226,240,0.3)' },
                        { n: achievementsData.filter(a=>a.type==='award').length, label:'荣誉奖项', color:'var(--accent-pink)', bg:'rgba(240,228,224,0.3)' },
                        { n: achievementsData.filter(a=>a.type==='certification').length, label:'认证证书', color:'var(--mist-cyan)', bg:'rgba(225,236,236,0.3)' },
                        { n: achievementsData.length, label:'总成就数', color:'var(--accent-purple)', bg:'rgba(232,226,240,0.3)' },
                    ].map(s => (
                        <div key={s.label} className="p-4 rounded-md text-center border transition-all duration-300 hover:-translate-y-0.5"
                            style={{ background: s.bg, borderColor: 'var(--pearl-border)' }}>
                            <div className="text-2xl font-bold font-mono" style={{ color: s.color }}>{s.n}</div>
                            <div className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>{s.label}</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    </TerminalWindow>
);

export default Achievements;
