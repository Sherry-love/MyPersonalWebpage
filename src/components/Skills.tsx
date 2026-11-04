import React from 'react';
import type { CSSProperties } from 'react';

const skills = ['C++/C', 'Python', 'ML & DL', 'Data Structures & Algorithms', 'Operating Systems', 'Computer Networking', 'R', 'SAS'];

/* 颜料色：都是低饱和的矿物质色 */
const DAB_COLORS = ['#c9a7c7', '#a8c4c9', '#d9b48f', '#b9c9a3', '#d4a5a5', '#a9b3d4', '#cbb98f', '#b0a8c9'];

const Skills: React.FC = () => (
    <section className="palette-board">
        <span className="palette-hole" aria-hidden="true" />
        <header className="palette-head">
            <p className="palette-kicker">MY PALETTE</p>
            <h2 className="palette-title">调色盘上的技术</h2>
        </header>

        <div className="palette-dabs">
            {skills.map((skill, index) => (
                <span
                    key={skill}
                    className="paint-dab"
                    style={{ '--dab': DAB_COLORS[index % DAB_COLORS.length] } as CSSProperties}
                >
                    {skill}
                </span>
            ))}
        </div>

        <span className="palette-brush" aria-hidden="true" />
    </section>
);

export default Skills;
