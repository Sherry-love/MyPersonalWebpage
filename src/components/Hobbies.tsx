import React from 'react';
import TerminalWindow from './TerminalWindow';

const Hobbies: React.FC = () => {
    const hobbies = [
        {
            name: 'Badminton',
            chinese: '羽毛球',
            icon: '🏸',
            description: 'Regular player, focusing on techniques and strategies'
        },
        {
            name: 'Table Tennis',
            chinese: '乒乓球',
            icon: '🏓',
            description: 'Competitive player, enjoy fast-paced rallies'
        },
        {
            name: 'Anime',
            chinese: '动漫',
            icon: '🎬',
            description: 'Enthusiastic about Japanese animation and culture'
        },
        {
            name: 'Reading',
            chinese: '阅读',
            icon: '📚',
            description: 'Books on technology, psychology, and fiction'
        },
        {
            name: 'Fitness',
            chinese: '健身',
            icon: '💪',
            description: 'Gym regular, focused on strength and endurance'
        },
        {
            name: 'Movies',
            chinese: '电影',
            icon: '🎥',
            description: 'Film enthusiast, especially sci-fi and documentaries'
        },
        {
            name: 'Calligraphy',
            chinese: '书法',
            icon: '✍️',
            description: 'Traditional Chinese brush writing practice'
        },
        {
            name: 'Rubik\'s Cube',
            chinese: '魔方',
            icon: '🧩',
            description: 'Speedcubing, personal best under 30 seconds'
        },
        {
            name: 'Guitar',
            chinese: '吉他',
            icon: '🎸',
            description: 'Acoustic guitar player, learning fingerstyle'
        },
        {
            name: 'Sudoku',
            chinese: '数独',
            icon: '🔢',
            description: 'Daily puzzle solver, enjoy logical challenges'
        }
    ];

    return (
        <TerminalWindow title="hobbies.txt" icon={<i className="fas fa-heart"></i>}>
            <div className="space-y-6">
                <p className="text-slate-600 leading-relaxed font-mono text-sm">
                    These are the activities that fuel my creativity and keep me balanced...
                </p>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                    {hobbies.map((hobby) => (
                        <div
                            key={hobby.name}
                            className="flex flex-col items-center p-4 rounded-lg border border-violet-200 bg-violet-50/30 hover:bg-pink-50/50 transition-all duration-300 hover:border-pink-300 hover:shadow-md hover:shadow-pink-200/30 hover:-translate-y-1 cursor-default group"
                        >
                            <div className="text-3xl mb-2 group-hover:scale-110 transition-transform duration-300">
                                {hobby.icon}
                            </div>
                            <div className="text-center">
                                <h3 className="font-bold text-violet-700 group-hover:text-pink-700">
                                    {hobby.name}
                                </h3>
                                <p className="text-xs text-slate-500 mt-1">{hobby.chinese}</p>
                                <div className="mt-2 text-xs text-slate-600 leading-tight opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    {hobby.description}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </TerminalWindow>
    );
};

export default Hobbies;