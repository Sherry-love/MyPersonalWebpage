import React, { useEffect, useState } from 'react';

/** 代码花园右侧的小装饰：紫色小岛 + 会来回游走的小幽灵（Blender 动画 WebP）。 */
const GhostIsland: React.FC = () => {
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
    const staticSrc = `${base}images/ghost-island.webp`;
    const animatedSrc = `${base}images/ghost-island-anim.webp`;
    const src = reduced || failed ? staticSrc : animatedSrc;

    return (
        <div className="ghost-island" aria-hidden="true">
            <img
                src={src}
                alt=""
                decoding="async"
                onError={() => setFailed(true)}
            />
        </div>
    );
};

export default GhostIsland;
