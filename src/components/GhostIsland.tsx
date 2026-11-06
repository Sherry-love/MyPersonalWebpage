import React from 'react';

/** 页脚右侧的小装饰：紫色小岛 + 淡紫小幽灵（Blender 渲染的透明贴纸）。 */
const GhostIsland: React.FC = () => {
    const src = `${import.meta.env.BASE_URL}images/ghost-island.webp`;

    return (
        <div className="ghost-island" aria-hidden="true">
            <img src={src} alt="" decoding="async" />
        </div>
    );
};

export default GhostIsland;
