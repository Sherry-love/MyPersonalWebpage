import React, { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

const SEQUENCE = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];

/**
 * Konami 秘技：↑↑↓↓←→←→BA
 * 给整站套 5 秒 SVG 置换滤镜，像被画笔搅过一遍。
 */
const KonamiEgg: React.FC = () => {
    const [toast, setToast] = useState(false);
    const effectTimer = useRef<number | null>(null);
    const toastTimer = useRef<number | null>(null);

    const activate = useCallback(() => {
        const root = document.documentElement;
        root.classList.remove('oil-paint');
        // 强制重排，让连续触发时滤镜重新开始
        void root.offsetWidth;
        root.classList.add('oil-paint');
        setToast(true);

        if (effectTimer.current) window.clearTimeout(effectTimer.current);
        if (toastTimer.current) window.clearTimeout(toastTimer.current);
        effectTimer.current = window.setTimeout(() => {
            root.classList.remove('oil-paint');
        }, 5000);
        toastTimer.current = window.setTimeout(() => setToast(false), 3400);
    }, []);

    useEffect(() => {
        let index = 0;
        const onKeyDown = (event: KeyboardEvent) => {
            const key = event.key.length === 1 ? event.key.toLowerCase() : event.key;
            if (key === SEQUENCE[index]) {
                index += 1;
                if (index === SEQUENCE.length) {
                    index = 0;
                    activate();
                }
            } else {
                index = key === SEQUENCE[0] ? 1 : 0;
            }
        };

        window.addEventListener('keydown', onKeyDown);
        return () => {
            window.removeEventListener('keydown', onKeyDown);
            if (effectTimer.current) window.clearTimeout(effectTimer.current);
            if (toastTimer.current) window.clearTimeout(toastTimer.current);
            document.documentElement.classList.remove('oil-paint');
        };
    }, [activate]);

    return (
        <>
            <svg className="oil-filter-defs" aria-hidden="true" focusable="false">
                <filter id="oil-paint-filter" x="-6%" y="-6%" width="112%" height="112%" colorInterpolationFilters="sRGB">
                    <feTurbulence type="fractalNoise" baseFrequency="0.012 0.02" numOctaves="3" seed="9" result="noise" />
                    <feDisplacementMap in="SourceGraphic" in2="noise" scale="10" xChannelSelector="R" yChannelSelector="G" />
                </filter>
            </svg>

            {toast && createPortal(
                <div className="oil-toast" role="status">
                    <i className="fas fa-paint-brush" />
                    印象派滤镜 · 5 秒
                </div>,
                document.body
            )}
        </>
    );
};

export default KonamiEgg;
