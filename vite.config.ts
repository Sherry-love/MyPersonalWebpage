import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// 不引入 @types/node，也能安全读取构建环境变量
const env = (globalThis as { process?: { env?: Record<string, string | undefined> } }).process?.env ?? {}

/**
 * GitHub Pages 的项目站点固定部署在 /<repo>/ 子路径下。
 *  - 本地 dev / preview：'/'
 *  - GitHub Actions 构建：'/MyPersonalWebpage/'
 *  - 需要自定义域名或根路径部署时：设置 VITE_BASE（如 VITE_BASE=/）
 */
const base = env.VITE_BASE ?? (env.GITHUB_ACTIONS === 'true' ? '/MyPersonalWebpage/' : '/')

export default defineConfig({
    base,
    plugins: [react(), tailwindcss()],
})
