import React from 'react';

interface TerminalWindowProps {
    title: string;
    icon: React.ReactNode;
    children: React.ReactNode;
}

const TerminalWindow: React.FC<TerminalWindowProps> = ({ title, icon, children }) => {
    return (
        <div className="bg-white/60 backdrop-blur-md border border-violet-200 rounded-lg shadow-lg overflow-hidden transition-all duration-300 hover:border-violet-300 hover:shadow-violet-200/50">
            <div className="flex items-center justify-between bg-violet-100/50 px-4 py-2 border-b border-violet-200">
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-pink-300 rounded-full"></div>
                    <div className="w-3 h-3 bg-violet-300 rounded-full"></div>
                    <div className="w-3 h-3 bg-sky-300 rounded-full"></div>
                </div>
                <div className="text-sm font-mono text-violet-600 flex items-center gap-2">
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
