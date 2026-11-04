import React from 'react';
import { useAmbient } from '../ambient/AmbientContext';
import WeatherLayer from './WeatherLayer';

/**
 * 「此刻的青岛」视觉层：天空渐变 + 雾带 + 天气粒子。
 * 颜色由 <html data-phase> / <html data-weather> 在 CSS 里切换。
 */
const AmbientMood: React.FC = () => {
    const { weather } = useAmbient();

    return (
        <>
            <div className={`ambient-sky${weather === 'fog' ? ' is-fog' : ''}`} aria-hidden="true">
                <span className="fog-band fog-band-1" />
                <span className="fog-band fog-band-2" />
            </div>
            <WeatherLayer />
        </>
    );
};

export default AmbientMood;
