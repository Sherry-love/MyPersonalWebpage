import React from 'react';
import TerminalWindow from './TerminalWindow';

interface Hobby { name: string; chinese: string; icon: string; description: string }

const hobbies: Hobby[] = [
    { name:'Badminton',chinese:'羽毛球',icon:'🏸',description:'Regular player,focusing on techniques and strategies' },
    { name:'Table Tennis',chinese:'乒乓球',icon:'🏓',description:'Competitive player,enjoy fast-paced rallies' },
    { name:'Anime',chinese:'动漫',icon:'🎬',description:'Enthusiastic about Japanese animation and culture' },
    { name:'Reading',chinese:'阅读',icon:'📚',description:'Books on technology,psychology,and fiction' },
    { name:'Fitness',chinese:'健身',icon:'💪',description:'Gym regular,focused on strength and endurance' },
    { name:'Movies',chinese:'电影',icon:'🎥',description:'Film enthusiast,especially sci-fi and documentaries' },
    { name:'Calligraphy',chinese:'书法',icon:'✍️',description:'Traditional Chinese brush writing practice' },
    { name:"Rubik's Cube",chinese:'魔方',icon:'🧩',description:'Speedcubing,personal best under 30 seconds' },
    { name:'Guitar',chinese:'吉他',icon:'🎸',description:'Acoustic guitar player,learning fingerstyle' },
    { name:'Sudoku',chinese:'数独',icon:'🔢',description:'Daily puzzle solver,enjoy logical challenges' },
];

const HobbyCard: React.FC<{ hobby: Hobby }> = React.memo(({ hobby }) => (
    <div className="flip-card cursor-default group">
        <div className="flip-card-inner">
            <div className="flip-card-front">
                <div className="text-3xl mb-1 transition-transform duration-300 group-hover:scale-110">{hobby.icon}</div>
                <h3 className="font-serif text-sm" style={{ color: 'var(--accent-purple)' }}>{hobby.name}</h3>
                <p className="text-xs mt-0.5" style={{ color: 'var(--text-secondary)' }}>{hobby.chinese}</p>
            </div>
            <div className="flip-card-back" style={{ background: 'var(--tint-pink)', borderColor: 'var(--accent-pink)' }}>
                <div className="text-2xl mb-1">{hobby.icon}</div>
                <p className="text-xs leading-tight text-center" style={{ color: 'var(--text-secondary)' }}>{hobby.description}</p>
            </div>
        </div>
    </div>
));
HobbyCard.displayName = 'HobbyCard';

const Hobbies: React.FC = () => (
    <TerminalWindow title="hobbies.txt" icon={<i className="fas fa-heart"></i>}>
        <div className="space-y-6">
            <p className="leading-relaxed font-mono text-sm" style={{ color: 'var(--text-secondary)' }}>
                These are the activities that fuel my creativity and keep me balanced...
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                {hobbies.map(h => <HobbyCard key={h.name} hobby={h} />)}
            </div>
        </div>
    </TerminalWindow>
);

export default Hobbies;
