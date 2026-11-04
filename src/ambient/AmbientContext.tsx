import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

export type TimePhase = 'dawn' | 'morning' | 'day' | 'dusk' | 'night';
export type WeatherKind = 'clear' | 'cloudy' | 'fog' | 'rain' | 'snow' | 'thunder';

interface AmbientValue {
    phase: TimePhase;
    phaseLabel: string;
    weather: WeatherKind;
    weatherLabel: string;
    temperature: number | null;
    city: string;
    /** 天气数据是否已就绪（缓存或请求返回），未就绪时只展示时段 */
    ready: boolean;
}

const PHASE_LABEL: Record<TimePhase, string> = {
    dawn: '破晓',
    morning: '清晨',
    day: '白昼',
    dusk: '黄昏',
    night: '夜色',
};

const WEATHER_LABEL: Record<WeatherKind, string> = {
    clear: '晴',
    cloudy: '多云',
    fog: '雾',
    rain: '雨',
    snow: '雪',
    thunder: '雷雨',
};

const CITY = '青岛';
const CACHE_KEY = 'ambient:qingdao:v1';
const CACHE_TTL = 30 * 60 * 1000;
const WEATHER_URL =
    'https://api.open-meteo.com/v1/forecast?latitude=36.0671&longitude=120.3826&current=temperature_2m,weather_code,is_day&timezone=Asia%2FShanghai';

interface CachedWeather {
    savedAt: number;
    code: number;
    temperature: number | null;
}

export function phaseOf(date: Date): TimePhase {
    const hour = date.getHours();
    if (hour < 5) return 'night';
    if (hour < 7) return 'dawn';
    if (hour < 11) return 'morning';
    if (hour < 16) return 'day';
    if (hour < 19) return 'dusk';
    return 'night';
}

/** WMO weather code → 站点使用的天气类型 */
export function kindOfCode(code: number): WeatherKind {
    if (code === 0) return 'clear';
    if (code <= 3) return 'cloudy';
    if (code === 45 || code === 48) return 'fog';
    if (code >= 51 && code <= 67) return 'rain';
    if (code >= 71 && code <= 77) return 'snow';
    if (code >= 80 && code <= 82) return 'rain';
    if (code === 85 || code === 86) return 'snow';
    if (code >= 95) return 'thunder';
    return 'clear';
}

function readCache(): CachedWeather | null {
    if (typeof window === 'undefined') return null;
    try {
        const raw = window.localStorage.getItem(CACHE_KEY);
        if (!raw) return null;
        const parsed = JSON.parse(raw) as Partial<CachedWeather>;
        if (typeof parsed.savedAt !== 'number' || typeof parsed.code !== 'number') return null;
        return {
            savedAt: parsed.savedAt,
            code: parsed.code,
            temperature:
                typeof parsed.temperature === 'number' && Number.isFinite(parsed.temperature)
                    ? parsed.temperature
                    : null,
        };
    } catch {
        return null;
    }
}

function writeCache(value: CachedWeather) {
    try {
        window.localStorage.setItem(CACHE_KEY, JSON.stringify(value));
    } catch {
        /* 隐私模式下忽略 */
    }
}

const DEFAULT_VALUE: AmbientValue = {
    phase: 'day',
    phaseLabel: PHASE_LABEL.day,
    weather: 'clear',
    weatherLabel: WEATHER_LABEL.clear,
    temperature: null,
    city: CITY,
    ready: false,
};

const AmbientContext = createContext<AmbientValue>(DEFAULT_VALUE);

export const useAmbient = () => useContext(AmbientContext);

export const AmbientProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [phase, setPhase] = useState<TimePhase>(() => phaseOf(new Date()));
    const [weather, setWeather] = useState<WeatherKind>(() => {
        const cache = readCache();
        return cache ? kindOfCode(cache.code) : 'clear';
    });
    const [temperature, setTemperature] = useState<number | null>(() => readCache()?.temperature ?? null);
    const [ready, setReady] = useState<boolean>(() => readCache() !== null);

    // 时段每分钟重算一次
    useEffect(() => {
        const tick = () => setPhase(phaseOf(new Date()));
        tick();
        const id = window.setInterval(tick, 60_000);
        return () => window.clearInterval(id);
    }, []);

    // 天气：优先读 30 分钟内的缓存，否则请求一次，失败就沿用缓存/晴天
    useEffect(() => {
        const cache = readCache();
        if (cache && Date.now() - cache.savedAt < CACHE_TTL) {
            setWeather(kindOfCode(cache.code));
            setTemperature(cache.temperature);
            setReady(true);
            return;
        }

        const controller = new AbortController();
        const timeout = window.setTimeout(() => controller.abort(), 8000);
        let cancelled = false;

        fetch(WEATHER_URL, { signal: controller.signal })
            .then((response) => (response.ok ? response.json() : Promise.reject(new Error(String(response.status)))))
            .then((data: { current?: { weather_code?: number; temperature_2m?: number } }) => {
                if (cancelled) return;
                const code = Number(data.current?.weather_code);
                const temp = Number(data.current?.temperature_2m);
                if (!Number.isFinite(code)) return;
                const nextTemp = Number.isFinite(temp) ? temp : null;
                setWeather(kindOfCode(code));
                setTemperature(nextTemp);
                setReady(true);
                writeCache({ savedAt: Date.now(), code, temperature: nextTemp });
            })
            .catch(() => {
                if (cancelled || !cache) return;
                setWeather(kindOfCode(cache.code));
                setTemperature(cache.temperature);
                setReady(true);
            })
            .finally(() => window.clearTimeout(timeout));

        return () => {
            cancelled = true;
            controller.abort();
            window.clearTimeout(timeout);
        };
    }, []);

    // 把状态挂到 <html> 上，CSS 直接按属性切换光线
    useEffect(() => {
        const root = document.documentElement;
        root.dataset.phase = phase;
        root.dataset.weather = weather;
    }, [phase, weather]);

    const value = useMemo<AmbientValue>(
        () => ({
            phase,
            phaseLabel: PHASE_LABEL[phase],
            weather,
            weatherLabel: WEATHER_LABEL[weather],
            temperature,
            city: CITY,
            ready,
        }),
        [phase, weather, temperature, ready]
    );

    return <AmbientContext.Provider value={value}>{children}</AmbientContext.Provider>;
};
