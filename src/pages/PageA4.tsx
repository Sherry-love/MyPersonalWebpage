import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const PageA4: React.FC = () => {
    const [markdownContent, setMarkdownContent] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [lastUpdated, setLastUpdated] = useState<string>('');

    // 从public文件夹加载Markdown文件
    useEffect(() => {
        fetch('/website-intro.md')
            .then(response => {
                if (!response.ok) {
                    throw new Error('无法加载Markdown文件');
                }
                return response.text();
            })
            .then(text => {
                setMarkdownContent(text);
                setIsLoading(false);

                // 尝试从Markdown中提取最后更新日期
                const dateMatch = text.match(/(\d{4}年\d{1,2}月\d{1,2}日)/g);
                if (dateMatch && dateMatch.length > 0) {
                    // 取最后一个日期作为最后更新
                    setLastUpdated(dateMatch[dateMatch.length - 1]);
                }
            })
            .catch(error => {
                console.error('加载Markdown文件失败:', error);
                setMarkdownContent('# 加载失败\n\n抱歉，无法加载网站介绍文档。');
                setIsLoading(false);
            });
    }, []);

    return (
        <div className="bg-rose-50 min-h-screen text-slate-700 font-sans">
            <Navbar />
            <div className="container mx-auto p-4 md:p-8 pt-24">
                <div className="max-w-4xl mx-auto">
                    {/* 页面标题 */}
                    <div className="mb-8 text-center">
                        <h1 className="text-4xl font-bold text-slate-800 mb-2">我的个人网页</h1>
                        <p className="text-slate-500">关于这个项目的设计理念、技术栈和开发历程</p>
                        {lastUpdated && (
                            <div className="mt-4 inline-flex items-center gap-2 bg-violet-50 text-violet-700 px-4 py-2 rounded-full text-sm">
                                <i className="fas fa-calendar-alt"></i>
                                <span>最后更新: {lastUpdated}</span>
                            </div>
                        )}
                    </div>

                    {/* 主要内容卡片 */}
                    <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
                        {isLoading ? (
                            <div className="flex justify-center items-center h-64">
                                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-violet-500"></div>
                                <p className="ml-4 text-slate-600">正在加载文档...</p>
                            </div>
                        ) : (
                            <div className="markdown-content">
                                <ReactMarkdown
                                    remarkPlugins={[remarkGfm]}
                                    components={{
                                        // 代码块样式 - 修复类型问题
                                        code: ({node, className, children, ...props}: any) => {
                                            const isInline = !className?.includes('language-');

                                            if (isInline) {
                                                return (
                                                    <code className="bg-violet-100 text-violet-800 px-1.5 py-0.5 rounded text-sm font-mono" {...props}>
                                                        {children}
                                                    </code>
                                                );
                                            }

                                            return (
                                                <div className="my-4 overflow-hidden rounded-lg border border-slate-200">
                                                    <pre className="bg-slate-50 text-slate-800 p-4 overflow-auto text-sm">
                                                        <code className="font-mono" {...props}>
                                                            {children}
                                                        </code>
                                                    </pre>
                                                </div>
                                            );
                                        },
                                        // 标题样式
                                        h1: ({node, children, ...props}: any) => (
                                            <h1 className="text-3xl font-bold text-slate-800 mt-8 mb-6 pb-3 border-b border-slate-200 flex items-center gap-3" {...props}>
                                                <i className="fas fa-star text-violet-500 text-xl"></i>
                                                {children}
                                            </h1>
                                        ),
                                        h2: ({node, children, ...props}: any) => (
                                            <h2 className="text-2xl font-bold text-slate-800 mt-8 mb-4 flex items-center gap-3" {...props}>
                                                <i className="fas fa-file-alt text-pink-500"></i>
                                                {children}
                                            </h2>
                                        ),
                                        h3: ({node, children, ...props}: any) => (
                                            <h3 className="text-xl font-bold text-slate-700 mt-6 mb-3" {...props}>
                                                {children}
                                            </h3>
                                        ),
                                        // 段落
                                        p: ({node, children, ...props}: any) => (
                                            <p className="text-slate-700 leading-relaxed mb-4 text-lg" {...props}>
                                                {children}
                                            </p>
                                        ),
                                        // 列表
                                        ul: ({node, children, ...props}: any) => (
                                            <ul className="list-disc pl-6 mb-4 text-slate-700 space-y-2" {...props}>
                                                {children}
                                            </ul>
                                        ),
                                        ol: ({node, children, ...props}: any) => (
                                            <ol className="list-decimal pl-6 mb-4 text-slate-700 space-y-2" {...props}>
                                                {children}
                                            </ol>
                                        ),
                                        li: ({node, children, ...props}: any) => (
                                            <li className="mb-1.5" {...props}>
                                                {children}
                                            </li>
                                        ),
                                        // 引用块 - 特别为你的名言设计
                                        blockquote: ({node, children, ...props}: any) => (
                                            <div className="my-6">
                                                <div className="relative border-l-4 border-violet-500 pl-6 py-2 bg-violet-50/50 rounded-r-lg">
                                                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-violet-500 to-pink-500"></div>
                                                    <blockquote className="italic text-slate-700 text-lg leading-relaxed" {...props}>
                                                        {children}
                                                    </blockquote>
                                                    <div className="mt-3 text-sm text-slate-500 flex items-center gap-2">
                                                        <i className="fas fa-quote-right"></i>
                                                        <span>摘自贴吧网友</span>
                                                    </div>
                                                </div>
                                            </div>
                                        ),
                                        // 链接
                                        a: ({node, children, ...props}: any) => (
                                            <a className="text-violet-600 hover:text-violet-800 underline font-medium" {...props}>
                                                {children}
                                            </a>
                                        ),
                                        // 强调文本
                                        strong: ({node, children, ...props}: any) => (
                                            <strong className="font-bold text-slate-800" {...props}>
                                                {children}
                                            </strong>
                                        ),
                                        // 表格
                                        table: ({node, children, ...props}: any) => (
                                            <table className="min-w-full border-collapse border border-slate-300 my-4 rounded-lg overflow-hidden" {...props}>
                                                {children}
                                            </table>
                                        ),
                                        th: ({node, children, ...props}: any) => (
                                            <th className="border border-slate-300 bg-slate-100 p-3 text-left font-semibold text-slate-800" {...props}>
                                                {children}
                                            </th>
                                        ),
                                        td: ({node, children, ...props}: any) => (
                                            <td className="border border-slate-300 p-3" {...props}>
                                                {children}
                                            </td>
                                        ),
                                        // 水平线
                                        hr: ({node, ...props}: any) => <hr className="my-8 border-t border-slate-300" {...props} />,
                                    }}
                                >
                                    {markdownContent}
                                </ReactMarkdown>

                                {/* 添加时间线效果 - 专门为"简单记录"部分 */}
                                <div className="mt-12 pt-8 border-t border-slate-200">
                                    <h3 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-3">
                                        <i className="fas fa-history text-green-500"></i>
                                        开发时间线
                                    </h3>
                                    <div className="relative pl-8">
                                        {/* 时间线垂直线 */}
                                        <div className="absolute left-[15px] top-0 bottom-0 w-0.5 bg-gradient-to-b from-violet-500 to-pink-500"></div>

                                        {/* 从Markdown中提取的日期记录 */}
                                        {markdownContent
                                            .split('\n')
                                            .filter(line => line.includes('年') && line.includes('月') && line.includes('日'))
                                            .map((line, index) => {
                                                const dateMatch = line.match(/(\d{4}年\d{1,2}月\d{1,2}日)/);
                                                const content = line.replace(/^\d+\.\s*/, '').replace(/(\d{4}年\d{1,2}月\d{1,2}日\s*)/, '');

                                                if (!dateMatch) return null;

                                                return (
                                                    <div key={index} className="relative mb-6 last:mb-0">
                                                        {/* 时间线节点 */}
                                                        <div className="absolute left-[-26px] top-1.5 w-6 h-6 rounded-full bg-white border-4 border-violet-500 z-10"></div>

                                                        <div className="ml-4">
                                                            <div className="font-bold text-violet-700 mb-1 flex items-center gap-2">
                                                                <i className="fas fa-calendar-day text-sm"></i>
                                                                {dateMatch[0]}
                                                            </div>
                                                            <p className="text-slate-700 bg-slate-50 p-3 rounded-lg border border-slate-200">
                                                                {content}
                                                            </p>
                                                        </div>
                                                    </div>
                                                );
                                            })
                                        }
                                    </div>
                                </div>

                                {/* 感谢信息 */}
                                <div className="mt-12 p-6 bg-gradient-to-r from-violet-50 to-pink-50 rounded-xl border border-violet-200">
                                    <div className="flex items-start gap-4">
                                        <div className="text-3xl text-violet-600">
                                            <i className="fas fa-heart"></i>
                                        </div>
                                        <div>
                                            <h4 className="text-xl font-bold text-slate-800 mb-2">特别感谢</h4>
                                            <p className="text-slate-700 mb-2">
                                                感谢 Gemini 和 DeepSeek 的帮助，让这个项目能够顺利实现。
                                            </p>
                                            <p className="text-sm text-slate-500">
                                                如果有任何错误或者bug，请您联系我修改，感谢！
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* 返回首页按钮 */}
                    <div className="mt-8 text-center">
                        <a
                            href="/"
                            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-violet-500 to-pink-500 text-white font-medium rounded-lg hover:shadow-lg transition-all duration-300"
                        >
                            <i className="fas fa-home"></i>
                            返回首页
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PageA4;