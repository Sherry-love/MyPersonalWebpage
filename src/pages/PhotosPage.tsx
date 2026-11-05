import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Lightbox from 'yet-another-react-lightbox';
import Captions from 'yet-another-react-lightbox/plugins/captions';
import Counter from 'yet-another-react-lightbox/plugins/counter';
import 'yet-another-react-lightbox/styles.css';
import 'yet-another-react-lightbox/plugins/captions.css';
import 'yet-another-react-lightbox/plugins/counter.css';
import { photos, photoAsset, type PhotoCollection } from '../data/photos';

type Filter = 'all' | PhotoCollection;

const TABS: { key: Filter; label: string }[] = [
    { key: 'all', label: '全部' },
    { key: 'qingdao', label: '青岛' },
    { key: 'painting', label: '画' },
];

const PhotosPage: React.FC = () => {
    const [filter, setFilter] = useState<Filter>('all');
    const [index, setIndex] = useState(-1);

    // 只有真的放了自己的照片，才显示「我的」这一栏
    const tabs = useMemo(
        () =>
            photos.some((photo) => photo.collection === 'mine')
                ? [...TABS, { key: 'mine' as Filter, label: '我的' }]
                : TABS,
        []
    );

    const filtered = useMemo(
        () => (filter === 'all' ? photos : photos.filter((photo) => photo.collection === filter)),
        [filter]
    );

    const slides = useMemo(
        () =>
            filtered.map((photo) => ({
                src: photoAsset(photo.src),
                width: photo.width,
                height: photo.height,
                title: photo.title,
                description: (
                    <span className="photo-lightbox-credit">
                        {photo.credit}
                        {photo.source && (
                            <>
                                {' · '}
                                <a href={photo.source} target="_blank" rel="noopener noreferrer">
                                    查看来源
                                </a>
                            </>
                        )}
                    </span>
                ),
            })),
        [filtered]
    );

    const countOf = (key: Filter) =>
        key === 'all' ? photos.length : photos.filter((photo) => photo.collection === key).length;

    return (
        <div className="min-h-screen" style={{ background: 'transparent' }}>
            <Navbar />

            <div className="container mx-auto p-4 md:p-8" style={{ paddingTop: '7rem' }}>
                <div className="max-w-5xl mx-auto">
                    <header className="gallery-head">
                        <p className="gallery-kicker">PHOTO ALBUM</p>
                        <h1 className="gallery-title">相册</h1>
                        <p className="gallery-sub">青岛的海，和几幅喜欢的画。点开看大图。</p>
                    </header>

                    <div className="gallery-tabs">
                        {tabs.map((tab) => (
                            <button
                                key={tab.key}
                                type="button"
                                className={`gallery-tab${filter === tab.key ? ' is-active' : ''}`}
                                onClick={() => {
                                    setFilter(tab.key);
                                    setIndex(-1);
                                }}
                                aria-pressed={filter === tab.key}
                            >
                                {tab.label}
                                <span>{countOf(tab.key)}</span>
                            </button>
                        ))}
                    </div>

                    <div className="photo-grid">
                        {filtered.map((photo, i) => (
                            <button
                                key={photo.id}
                                type="button"
                                className="photo-card"
                                onClick={() => setIndex(i)}
                                aria-label={`查看大图：${photo.title}`}
                            >
                                <span className="photo-frame">
                                    <img
                                        src={photoAsset(photo.thumb)}
                                        alt={photo.alt}
                                        width={photo.width}
                                        height={photo.height}
                                        loading="lazy"
                                        decoding="async"
                                    />
                                </span>
                                <span className="photo-caption">
                                    <span className="photo-title">{photo.title}</span>
                                    <span className="photo-sub">{photo.subtitle}</span>
                                </span>
                            </button>
                        ))}
                    </div>

                    <p className="gallery-credits">
                        青岛的照片来自 Wikimedia Commons（CC BY / CC BY-SA 授权），莫奈作品为公有领域；
                        每张图的作者与许可都可以在大图里看到。之后会慢慢换成自己拍的照片。
                    </p>

                    <div className="mt-10 text-center">
                        <Link to="/" className="btn-pearl inline-flex items-center gap-2 px-6 py-3 font-medium rounded-lg">
                            <i className="fas fa-home"></i>返回首页
                        </Link>
                    </div>
                </div>
            </div>

            <Lightbox
                open={index >= 0}
                close={() => setIndex(-1)}
                index={index}
                slides={slides}
                plugins={[Captions, Counter]}
                on={{ view: ({ index: current }) => setIndex(current) }}
                carousel={{ finite: false, padding: 0, spacing: 24 }}
                animation={{ fade: 220, swipe: 260 }}
                controller={{ closeOnBackdropClick: true }}
                styles={{ container: { backgroundColor: 'rgba(22, 20, 30, 0.97)' } }}
            />
        </div>
    );
};

export default PhotosPage;
