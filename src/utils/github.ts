import snapshot from '../data/contributions.json';

export type ContributionLevel = 0 | 1 | 2 | 3 | 4;

export interface ContributionDay {
    date: string;
    count: number;
    level: ContributionLevel;
}

export interface ContributionData {
    username: string;
    /** 快照抓取日期（YYYY-MM-DD），由 scripts/fetch-contributions.mjs 写入 */
    updatedAt: string;
    total: number;
    days: ContributionDay[];
}

function clampLevel(value: number): ContributionLevel {
    return Math.min(4, Math.max(0, Math.round(value))) as ContributionLevel;
}

/**
 * 贡献数据来自构建期快照（src/data/contributions.json），
 * 不再在浏览器里请求接口，也不再用随机数伪造。
 * 想更新数据：npm run fetch:contributions（npm run build 前也会自动执行）。
 */
export const contributions: ContributionData = {
    username: snapshot.username,
    updatedAt: snapshot.updatedAt,
    total: snapshot.total,
    days: snapshot.days.map((day) => ({
        date: day.date,
        count: day.count,
        level: clampLevel(day.level),
    })),
};
