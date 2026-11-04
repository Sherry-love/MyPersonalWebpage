import React, { useCallback, useRef } from 'react';
import TerminalWindow from './TerminalWindow';

const skills = ['C++/C', 'Python', 'ML & DL', 'Data Structures & Algorithms', 'Operating Systems', 'Computer Networking', 'R', 'SAS'];

interface MousePos { x: number; y: number }

const Skills: React.FC = () => {
    const tagRefs = useRef<(HTMLSpanElement | null)[]>([]);
    const mouseRef = useRef<MousePos>({ x: -9999, y: -9999 });

    const handleMouseMove = useCallback((e: React.MouseEvent) => {
        mouseRef.current = { x: e.clientX, y: e.clientY };
        tagRefs.current.forEach((el) => {
            if (!el) return;
            const rect = el.getBoundingClientRect();
            const cx = rect.left + rect.width / 2, cy = rect.top + rect.height / 2;
            const dx = mouseRef.current.x - cx, dy = mouseRef.current.y - cy;
            const dist = Math.sqrt(dx * dx + dy * dy);
            const maxDist = 160;
            if (dist < maxDist) {
                const strength = (1 - dist / maxDist) * 24;
                const angle = Math.atan2(dy, dx);
                el.style.transform = `translate(${-Math.cos(angle)*strength}px,${-Math.sin(angle)*strength}px) scale(${1+(1-dist/maxDist)*0.18})`;
                el.style.zIndex = '10';
            } else {
                el.style.transform = ''; el.style.zIndex = '';
            }
        });
    }, []);
    const handleMouseLeave = useCallback(() => {
        tagRefs.current.forEach(el => { if (el) { el.style.transform = ''; el.style.zIndex = ''; } });
    }, []);

    return (
        <TerminalWindow title="tech_stack.json" icon={<i className="fas fa-cogs"></i>}>
            <div className="skill-tag-container flex flex-wrap gap-3 justify-center py-4" onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave}>
                {skills.map((skill, i) => (
                    <span key={skill} ref={(el) => { tagRefs.current[i] = el; }}
                        className="skill-tag tag-badge inline-block font-mono text-sm px-4 py-2 rounded-full cursor-default"
                        style={{
                            animationDelay: `${(i * 0.4).toFixed(1)}s`,
                            transition: 'transform 0.25s ease-out, background-color 0.3s, color 0.3s',
                        }}>
                        {skill}
                    </span>
                ))}
            </div>
        </TerminalWindow>
    );
};

export default Skills;
