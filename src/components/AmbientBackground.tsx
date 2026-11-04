import React from 'react';

type Season = 'spring' | 'autumn' | 'morning' | 'default';

interface Props {
    season?: Season;
}

const SEASON_OPACITIES: Record<Season, { pink: number; purple: number; cyan: number; gold: number }> = {
    spring:    { pink: 0.55, purple: 0.48, cyan: 0.22, gold: 0.15 },
    autumn:    { pink: 0.48, purple: 0.18, cyan: 0.08, gold: 0.45 },
    morning:   { pink: 0.22, purple: 0.30, cyan: 0.52, gold: 0.08 },
    default:   { pink: 0.45, purple: 0.40, cyan: 0.35, gold: 0.18 },
};

const AmbientBackground: React.FC<Props> = ({ season = 'default' }) => {
    const o = SEASON_OPACITIES[season];

    return (
        <div className="fixed inset-0 overflow-hidden pointer-events-none" style={{ zIndex: 0 }}>
            <div style={{ width:'55vw',height:'55vw',top:'-10%',left:'-15%',background:'var(--mist-pink)',filter:'blur(160px)',opacity:o.pink,animation:'blob-drift-1 48s ease-in-out infinite' }} />
            <div style={{ width:'50vw',height:'50vw',top:'-5%',right:'-12%',background:'var(--mist-purple)',filter:'blur(150px)',opacity:o.purple,animation:'blob-drift-2 55s ease-in-out infinite' }} />
            <div style={{ width:'45vw',height:'45vw',bottom:'5%',left:'-8%',background:'var(--mist-cyan)',filter:'blur(140px)',opacity:o.cyan,animation:'blob-drift-3 60s ease-in-out infinite' }} />
            <div style={{ width:'42vw',height:'42vw',bottom:'-8%',right:'-10%',background:'var(--mist-pink)',filter:'blur(130px)',opacity:o.pink * 0.7,animation:'blob-drift-4 52s ease-in-out infinite' }} />
            <div style={{ width:'25vw',height:'25vw',top:'45%',right:'5%',background:'var(--accent-gold)',filter:'blur(120px)',opacity:o.gold,animation:'blob-drift-5 65s ease-in-out infinite' }} />
        </div>
    );
};

export default AmbientBackground;
