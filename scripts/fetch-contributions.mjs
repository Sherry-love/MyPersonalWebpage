#!/usr/bin/env node
/**
 * 抓取真实的 GitHub 贡献数据，写入 src/data/contributions.json。
 *
 * 为什么在构建期抓、而不是浏览器运行时抓：
 *   1. GitHub 没有公开的 CORS 接口，前端直接请求会被浏览器拦；
 *   2. 构建期抓一次，页面零网络依赖，国内访问也稳定；
 *   3. 抓不到时沿用上一次的快照，构建不会失败，更不会退化成随机假数据。
 *
 * 用法：
 *   node scripts/fetch-contributions.mjs [username]
 *   npm run fetch:contributions
 *
 * 数据源：github-contributions-api.jogruber.de（公开、无需 token）。
 */
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

const USERNAME =
  process.argv[2] || process.env.GITHUB_USERNAME || 'Sherry-love';
const OUTPUT = path.resolve('src/data/contributions.json');
const ENDPOINT = `https://github-contributions-api.jogruber.de/v4/${encodeURIComponent(
  USERNAME
)}?y=last`;
const TIMEOUT_MS = 15_000;

function normalize(raw) {
  if (!raw || !Array.isArray(raw.contributions)) {
    throw new Error('返回数据缺少 contributions 字段');
  }

  const days = raw.contributions
    .filter((day) => /^\d{4}-\d{2}-\d{2}$/.test(day?.date ?? ''))
    .map((day) => ({
      date: day.date,
      count: Math.max(0, Math.trunc(Number(day.count) || 0)),
      level: Math.min(4, Math.max(0, Math.round(Number(day.level) || 0))),
    }))
    .sort((a, b) => a.date.localeCompare(b.date));

  if (days.length < 300) {
    throw new Error(`天数异常（${days.length}），可能是接口结构变化`);
  }
  return days;
}

function summarize(days) {
  return {
    days: days.length,
    total: days.reduce((sum, day) => sum + day.count, 0),
    activeDays: days.filter((day) => day.count > 0).length,
  };
}

async function write(payload) {
  await mkdir(path.dirname(OUTPUT), { recursive: true });
  await writeFile(OUTPUT, `${JSON.stringify(payload, null, 2)}\n`, 'utf8');
}

async function main() {
  const today = new Date().toISOString().slice(0, 10);

  try {
    const response = await fetch(ENDPOINT, {
      headers: { 'User-Agent': 'impressionist-garden-build' },
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    const days = normalize(await response.json());
    const stats = summarize(days);

    await write({
      username: USERNAME,
      updatedAt: today,
      total: stats.total,
      days,
    });

    console.log(
      `贡献数据已更新：${USERNAME} · ${stats.days} 天 / ${stats.activeDays} 个活跃日 / 共 ${stats.total} 次`
    );
  } catch (error) {
    const existing = await readFile(OUTPUT, 'utf8').catch(() => null);
    if (existing) {
      console.warn(
        `贡献数据抓取失败（${error.message}），沿用已有快照，构建继续。`
      );
      return;
    }

    console.warn(`贡献数据抓取失败（${error.message}），写入空数据集占位。`);
    await write({ username: USERNAME, updatedAt: today, total: 0, days: [] });
  }
}

main();
