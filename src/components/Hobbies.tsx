import React, { useState } from 'react';
import type { CSSProperties } from 'react';

interface Hobby { name: string; chinese: string; icon: string; description: string }

const hobbies: Hobby[] = [
    { name:'Badminton',chinese:'羽毛球',icon:'fa-shuttlecock',description:'Regular player, focusing on techniques and strategies' },
    { name:'Table Tennis',chinese:'乒乓球',icon:'fa-table-tennis-paddle-ball',description:'Competitive player, enjoy fast-paced rallies' },
    { name:'Anime',chinese:'动漫',icon:'fa-tv',description:'Enthusiastic about Japanese animation and culture' },
    { name:'Reading',chinese:'阅读',icon:'fa-book-open',description:'Books on technology, psychology, and fiction' },
    { name:'Fitness',chinese:'健身',icon:'fa-dumbbell',description:'Gym regular, focused on strength and endurance' },
    { name:'Movies',chinese:'电影',icon:'fa-film',description:'Film enthusiast, especially sci-fi and documentaries' },
    { name:'Calligraphy',chinese:'书法',icon:'fa-pen-nib',description:'Traditional Chinese brush writing practice' },
    { name:"Rubik's Cube",chinese:'魔方',icon:'fa-cube',description:'Speedcubing, personal best under 30 seconds' },
    { name:'Guitar',chinese:'吉他',icon:'fa-guitar',description:'Acoustic guitar player, learning fingerstyle' },
    { name:'Sudoku',chinese:'数独',icon:'fa-table-cells',description:'Daily puzzle solver, enjoy logical challenges' },
];

const HOBBY_INK = ['#b07f8c', '#7f96b8', '#8a7da8', '#6d9494', '#9c8552', '#a8798a', '#6f8a7f', '#8b7fa8', '#a58a6f', '#7f8a9c'];

const PHOTO_GRADIENTS = [
    'linear-gradient(145deg,#f4dfe6,#e9d7e8)',
    'linear-gradient(145deg,#e3ecec,#d7e3ea)',
    'linear-gradient(145deg,#efe3d5,#e6d9c6)',
    'linear-gradient(145deg,#e6e0f0,#dcd7ea)',
    'linear-gradient(145deg,#e4ecd9,#d9e4cf)',
    'linear-gradient(145deg,#f2e0d8,#e8d3c9)',
];

const TILTS = [-2.4, 1.8, -1.2, 2.6, -1.8, 1.2, -2.8, 2.2, -1.6, 1.6];

const Hobbies: React.FC = () => {
    const [flipped, setFlipped] = useState<Record<number, boolean>>({});

    const toggle = (index: number) => {
        setFlipped((prev) => ({ ...prev, [index]: !prev[index] }));
    };

    return (
        <section className="hobby-wall">
            <header className="hobby-head">
                <p className="hobby-kicker">HOBBIES</p>
                <h2 className="hobby-title">让我保持平衡的小事</h2>
                <p className="hobby-sub">摊在桌上的拍立得，点一张翻到背面</p>
            </header>

            <div className="hobby-grid">
                {hobbies.map((hobby, index) => {
                    const style = {
                        '--tilt': `${TILTS[index % TILTS.length]}deg`,
                        '--photo': PHOTO_GRADIENTS[index % PHOTO_GRADIENTS.length],
                        '--hobby-ink': HOBBY_INK[index % HOBBY_INK.length],
                    } as CSSProperties;

                    return (
                        <button
                            key={hobby.name}
                            type="button"
                            className={`polaroid${flipped[index] ? ' is-flipped' : ''}`}
                            style={style}
                            onClick={() => toggle(index)}
                            aria-pressed={Boolean(flipped[index])}
                            aria-label={`${hobby.chinese}：${hobby.description}`}
                        >
                            <span className="polaroid-pin" aria-hidden="true" />
                            <span className="polaroid-inner">
                                <span className="polaroid-face polaroid-front">
                                    <span className="polaroid-photo">
                                        <i className={`fas ${hobby.icon}`} aria-hidden="true" />
                                    </span>
                                    <span className="polaroid-caption">
                                        <em>{hobby.chinese}</em>
                                        <span>{hobby.name}</span>
                                    </span>
                                </span>
                                <span className="polaroid-face polaroid-back">
                                    <span className="polaroid-back-text">{hobby.description}</span>
                                    <span className="polaroid-back-hint">再点一下翻回去</span>
                                </span>
                            </span>
                        </button>
                    );
                })}
            </div>
        </section>
    );
};

export default Hobbies;
