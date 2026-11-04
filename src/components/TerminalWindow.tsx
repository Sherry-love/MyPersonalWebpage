import React from 'react';

interface TerminalWindowProps {
    title: string;
    icon: React.ReactNode;
    children: React.ReactNode;
}

const TerminalWindow: React.FC<TerminalWindowProps> = ({ title, icon, children }) => {
    return (
        <div className="glass-card overflow-hidden terminal-card">
            <div
                className="flex items-center justify-between px-4 py-2 border-b"
                style={{ background: 'rgba(232,226,240,0.3)', borderColor: 'var(--pearl-border)' }}
            >
                <div className="flex items-center gap-2">
                    <div className="terminal-dot-1 w-3 h-3 rounded-full" style={{ background: 'var(--accent-pink)' }}></div>
                    <div className="terminal-dot-2 w-3 h-3 rounded-full" style={{ background: 'var(--accent-purple)' }}></div>
                    <div className="terminal-dot-3 w-3 h-3 rounded-full" style={{ background: 'var(--mist-cyan)' }}></div>
                </div>
                <div className="text-sm font-mono flex items-center gap-2" style={{ color: 'var(--accent-purple)' }}>
                    {icon}
                    <span>{title}</span>
                </div>
                <div className="w-16"></div>
            </div>
            <div className="p-6">
                {children}
            </div>
        </div>
    );
};

export default TerminalWindow;
