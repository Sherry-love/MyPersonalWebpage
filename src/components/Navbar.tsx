import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar: React.FC = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const location = useLocation();

    const navItems = [
        { path: '/', label: '首页', icon: 'fa-home' },
        { path: '/a1', label: 'A1', icon: 'fa-file-alt' },
        { path: '/a2', label: 'A2', icon: 'fa-file-alt' },
        { path: '/a3', label: 'A3', icon: 'fa-file-alt' },
        { path: '/a4', label: 'A4', icon: 'fa-file-alt' },
    ];

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-sm border-b border-rose-200 shadow-sm">
            <div className="container mx-auto px-4 py-3">
                <div className="flex items-center justify-between">
                    {/* Logo - 使用自定义图片 */}
                    <Link to="/" className="flex items-center gap-2 group">
                        <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-violet-200 group-hover:border-violet-400 transition-all duration-300 shadow-md">
                            {/* 使用public文件夹中的图片 */}
                            <img
                                src="/logo.jpg" // 图片放在public文件夹中
                                alt="刘东徽 Logo"
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                    // 如果图片加载失败，显示默认图标
                                    e.currentTarget.style.display = 'none';
                                    const parent = e.currentTarget.parentElement;
                                    if (parent) {
                                        parent.innerHTML =
                                            '<div class="w-full h-full bg-gradient-to-br from-violet-500 to-pink-500 flex items-center justify-center">' +
                                            '<i class="fas fa-terminal text-white text-lg"></i>' +
                                            '</div>';
                                    }
                                }}
                            />
                        </div>
                        <span className="font-mono font-bold text-lg text-slate-800 group-hover:text-violet-600 transition-colors">
                            刘东徽
                        </span>
                    </Link>

                    {/* 桌面导航 */}
                    <div className="hidden md:flex items-center gap-1">
                        {navItems.map((item) => (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 ${
                                    location.pathname === item.path
                                        ? 'text-violet-600 bg-violet-50'
                                        : 'text-slate-600 hover:text-violet-600 hover:bg-violet-50'
                                }`}
                            >
                                <i className={`fas ${item.icon} text-sm`}></i>
                                <span className="font-medium">{item.label}</span>
                            </Link>
                        ))}
                    </div>

                    {/* 移动端菜单按钮 */}
                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="md:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100"
                    >
                        <i className={`fas ${isMenuOpen ? 'fa-times' : 'fa-bars'} text-lg`}></i>
                    </button>
                </div>

                {/* 移动端导航菜单 */}
                {isMenuOpen && (
                    <div className="md:hidden mt-4 pb-4">
                        <div className="flex flex-col gap-2">
                            {navItems.map((item) => (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    onClick={() => setIsMenuOpen(false)}
                                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 ${
                                        location.pathname === item.path
                                            ? 'text-violet-600 bg-violet-50'
                                            : 'text-slate-600 hover:text-violet-600 hover:bg-violet-50'
                                    }`}
                                >
                                    <i className={`fas ${item.icon} w-6 text-center`}></i>
                                    <span className="font-medium">{item.label}</span>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;