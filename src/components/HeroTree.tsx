import React, { useEffect, useState } from 'react';

/**
 * Hero 里的四季树：基于 Blender 教程工程渲染的 12 秒四季循环。
 * 尊重减少动态偏好；视频加载失败时回退到静帧。
 */
const HeroTree: React.FC = () => {
    const [reduced, setReduced] = useState(false);
    const [failed, setFailed] = useState(false);

    useEffect(() => {
        const query = window.matchMedia('(prefers-reduced-motion: reduce)');
        const update = () => setReduced(query.matches);
        update();
        query.addEventListener('change', update);
        return () => query.removeEventListener('change', update);
    }, []);

    const base = import.meta.env.BASE_URL;
    const poster = `${base}images/four-seasons-poster.webp`;

    return (
        <div className="hero-tree" title="四季树 · 场景来自 @再来一瓶辣椒酱 的 Blender 教程">
            {reduced || failed ? (
                <img src={poster} alt="一棵随四季轮转的树" />
            ) : (
                <video
                    autoPlay
                    muted
                    loop
                    playsInline
                    preload="metadata"
                    poster={poster}
                    aria-label="一棵随四季轮转的树，正在缓慢旋转"
                    onError={() => setFailed(true)}
                >
                    <source src={`${base}video/four-seasons.mp4`} type="video/mp4" />
                </video>
            )}
            <span className="hero-tree-ring" aria-hidden="true" />
        </div>
    );
};

export default HeroTree;
