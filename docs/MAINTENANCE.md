# 部署与维护

## 本地开发

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # 类型检查 + 构建到 dist/
npm run preview    # 预览 dist/
```

`npm run build` 会先执行 `prebuild`，从 GitHub 抓一次贡献数据（见下文）。
抓取失败只会打印警告并沿用上一份快照，不会让构建失败。

## 部署到 GitHub Pages

仓库已经带好 `.github/workflows/deploy.yml`：

1. 把改动推到 `master`。
2. 仓库 **Settings → Pages → Build and deployment → Source** 选择 **GitHub Actions**。
3. Actions 里的 “Deploy to GitHub Pages” 跑完，站点地址是
   `https://sherry-love.github.io/MyPersonalWebpage/`。

> **注意**：GitHub Pages 目前只对公开仓库免费开放。这个仓库是私有的，
> 需要账号是 Pro/Team（私有仓库 Pages），或者把仓库改为 public。否则
> `actions/configure-pages` 这一步会失败。

### 路径是怎么处理的

GitHub Pages 的项目站点挂在 `/<仓库名>/` 子路径下，所以：

- `vite.config.ts` 里 `GITHUB_ACTIONS=true` 时自动使用 `base = '/MyPersonalWebpage/'`，
  本地开发仍然是 `/`。
- 路由用 `basename={import.meta.env.BASE_URL}`，图片地址用
  `${import.meta.env.BASE_URL}images/...`，所以两套路径都能跑。
- `public/404.html` 负责把 `/MyPersonalWebpage/a1` 这类深链接改写成
  `/?/a1`，`index.html` 里的脚本在应用启动前把路径还原，刷新不会 404。

### 换域名 / 部署到根路径

1. 构建时设置 `VITE_BASE=/`（或写进 CI 的环境变量）。
2. 改 `index.html` 里的 `og:url`、`og:image`、`twitter:image`。
3. 改 `public/404.html`：`pathSegmentsToKeep` 改成 `0`，返回首页链接改成 `/`。

## 更换 GitHub 账号

代码花园读的是 `Sherry-love` 的公开贡献。当前这个账号有 0 个公开仓库、
过去一年 0 次公开贡献，所以花园是空的——这是真实情况，不是渲染错误。

- 改账号：`src/data/site.ts` 里的 `GITHUB_USERNAME`，以及
  `scripts/fetch-contributions.mjs` 的默认值（也可以直接传参：
  `node scripts/fetch-contributions.mjs 你的用户名`）。
- 想让私有仓库的提交也出现在花园里：GitHub → Settings → Profile →
  勾选 **Include private contributions on my profile**，然后重新构建。
  贡献数会显示，但不会暴露仓库内容。
- 刷新数据：`npm run fetch:contributions`，或直接重新构建（prebuild 会跑）。
- 数据源是公开的 <https://github-contributions-api.jogruber.de>，无需 token；
  接口变更时脚本会保留旧快照并在终端报警。

## 字体

- 拉丁字母：`@fontsource/playfair-display`、`@fontsource/lato`、
  `@fontsource/jetbrains-mono`，在 `src/index.tsx` 里按字重引入。
- 中文：`scripts/build-font-subset.py` 从系统的 Noto Serif SC 里抽出
  站点实际用到的字符（约 900 个汉字，390KB，可变字重 200–900），
  输出到 `src/assets/fonts/noto-serif-sc-subset.woff2`。

**新增中文文案后**（尤其是 `src/essays/` 里的随笔），重新跑一次：

```bash
python scripts/build-font-subset.py
```

漏掉的字符不会变成方块，会自动回退到系统宋体，只是字形可能不一致。

依赖：`fonttools`、`brotli`，以及系统里的 `NotoSerifSC-VF.ttf`（脚本里有候选路径）。

## 图片

原图放在 `design/`（不参与构建），生成脚本：

```bash
python scripts/build-images.py
```

会输出：

- `public/images/logo.webp`：导航栏圆形头像（脸部特写）
- `public/images/reza.webp`：关于区头像
- `public/favicon-32.png`、`public/favicon.ico`、`public/apple-touch-icon.png`
- `public/og.jpg`：1200×630 分享卡片

换头像时替换 `design/` 里的原图，必要时调整脚本顶部的 `FACE_BOX` 裁切框。

## 相册

相册页是 `/photos`，数据在 `src/data/photos.json`，图片在 `public/gallery/`
（不要命名为 `public/photos/`，否则会和 `/photos` 路由冲突，被 Pages 301 成目录）。

**现在的内容从哪来**

- 「青岛」8 张：Wikimedia Commons 上 CC BY / CC BY-SA 授权的照片；
- 「画」6 张：莫奈作品，已进入公有领域；
- 每张图的作者、许可、来源都写在 JSON 里，页面上（大图的底部）会显示。

**换成自己的照片**

1. 把照片丢进 `design/photos/`（支持 jpg / png / webp，文件名会作为标题）；
2. 运行：

   ```bash
   npm run assets:photos
   ```

3. 脚本会生成 WebP、写入 `photos.json`，相册自动多出「我的」这一栏。

想改标题、副标题、alt，直接编辑 `src/data/photos.json` 里对应条目
（脚本重新跑会覆盖「我的」条目的标题，所以更稳的做法是改文件名）。
替换 Commons 素材则改 `scripts/fetch-photos.py` 顶部的 `ITEMS` 列表，删掉旧 slug 的图片再跑。

**授权注意**

- 只收公有领域、CC0、CC BY、CC BY-SA 的图；脚本里有白名单，其他许可会跳过；
- CC BY / CC BY-SA 必须保留作者和许可，页面已经做了；不要把自己的照片标成别人的作品；
- 他人的照片（尤其是人像）要拿到本人同意再放。

## 词云

技术栈右侧的「词云」小组件是一个 3D 标签球：`src/components/WordCloud.tsx` 用 Fibonacci 球面分布
+ CSS 3D 投影实现，没有引入 three.js。

- 词表在 `src/data/words.ts`：`text`、`weight`（3–10，决定字号）、`category`、
  `href`（可选，点击跳转）。
- 分类决定颜色：`技术 / 生活 / 写作 / 城市 / 站点`，对应样式在 `src/styles/words.css`
  的 `.word-chip--tech` 等。
- 交互：自动旋转；鼠标悬停暂停并把词提到最前；拖拽改变角度（松手后有惯性）；
  右上角可暂停；`prefers-reduced-motion` 下保持静止。
- 加词不需要动组件，只改 `words.ts`；词太多会互相遮挡，30–40 个比较合适。
- 布局：`Home.tsx` 里 `.home-duo` 是「调色盘 + 词云」的两栏网格
  （`1.75fr / 0.9fr`），900px 以下自动纵向堆叠；`<WordCloud compact />`
  会隐藏副标题、把球缩到 340px，适合当侧边小组件。

## 四季树（Blender 渲染）

首页标题上方的小树不是实时 3D，而是一段 **Blender 离线渲染的 6 秒无缝循环**
（144 帧 / 24fps，480×480），网页端只是一个 `<video>`。

- 场景：`design/blender/four-seasons.blend`；生成脚本 `scripts/blender/build_four_seasons.py`
- 结构：低多边形小岛 + 四色树冠（春粉 / 夏绿 / 秋橙 / 冬蓝）+ 转台 360° 线性旋转
- 渲染：Cycles + OptiX，32 采样 + OpenImageDenoise，透明背景

重新渲染：

```bash
# 1. 生成场景（会覆盖 four-seasons.blend）
& "$env:LOCALAPPDATA\Programs\Blender\blender-4.5.9-windows-x64\blender.exe" -b --factory-startup --python scripts/blender/build_four_seasons.py

# 2. 渲染 144 帧，约 8–10 分钟
& "$env:LOCALAPPDATA\Programs\Blender\blender-4.5.9-windows-x64\blender.exe" -b design/blender/four-seasons.blend -a

# 3. 合成奶油底、编码 MP4/WebM、生成 poster
python scripts/blender/postprocess_tree.py
```

产物：

- `public/video/four-seasons.mp4`、`.webm`
- `public/images/four-seasons-poster.webp`
- 组件：`src/components/HeroTree.tsx`，`prefers-reduced-motion` 或视频加载失败时回退到 poster

渲染帧和合成中间文件在 `design/blender/frames/`、`design/blender/comp/`，已 gitignore；
只有 `.blend`、脚本和最终视频会进仓库。

## 此刻的青岛（时间与天气）
首页那颗「此刻 · 青岛 · 雨 15°C」的小胶囊不是装饰，它同时驱动整站的光线与天气层：

- **时间相位**：按访问者本地时间分成 `dawn / morning / day / dusk / night`，
  写到 `<html data-phase>` 上，CSS 在 `src/styles/ambient.css` 里按它换天空与光斑色温。
- **天气**：`src/ambient/AmbientContext.tsx` 请求
  `https://api.open-meteo.com/v1/forecast?...latitude=36.0671&longitude=120.3826...`，
  把 WMO 天气码映射成 `clear / cloudy / fog / rain / snow / thunder`，
  写到 `<html data-weather>`。雨雪由 `WeatherLayer` 的 Canvas 绘制，雾由 CSS 雾带表现。
- **缓存**：结果存在 `localStorage` 的 `ambient:qingdao:v1`，30 分钟内不再请求；
  请求失败就沿用缓存，没有缓存就只显示「夜色」这类时段，不会显示错误的「晴」。
- **换城市**：改 `AmbientContext.tsx` 顶部的 `WEATHER_URL` 里的经纬度与 `CITY` 常量。
  找坐标可以用 open-meteo 的 geocoding 接口。
- **关掉天气**：把 `AmbientProvider` 里的 `fetch` 段落删掉，或让 `weather` 恒为 `'clear'`。
- 所有动画都遵守 `prefers-reduced-motion`：开启后不加雨雪粒子，只留色温。

## 彩蛋

| 彩蛋 | 触发 | 代码 |
| --- | --- | --- |
| 油画滤镜 | `↑↑↓↓←→←→BA`，持续 5 秒 | `src/components/KonamiEgg.tsx`（SVG `feDisplacementMap`） |
| 404 萤火虫 | 访问不存在的路径，萤火虫会跟着鼠标飞，点它回首页 | `src/pages/NotFound.tsx` |
| 蜗牛 | 进站约 9 秒后随机出现，之后每半分钟换个位置；点一下缩回壳里，过一会儿再从别处出来 | `src/components/Snail.tsx` |

不想要某个彩蛋：从 `src/App.tsx` 里移除对应组件即可
（蜗牛和 Konami 挂在 `AppContent`，萤火虫在 `NotFound` 页面内）。

## 内容在哪改

| 想改什么 | 改哪里 |
| --- | --- |
| 首页项目区、项目页、书架 | `src/data/projects.ts`（`spineTitle` 控制书脊上的短标题） |
| 开发时间轴 | `src/data/timeline.ts`（README 的「简单记录」只是给人看的镜像） |
| 小练笔 | 在 `src/essays/` 新建 `.md`：首行 `# 标题`，末行日期 `YYYY年M月D日` |
| 关于本站的正文 | `README.md`（`/a4` 页面会直接渲染，自动去掉「简单记录」段） |
| 自我介绍、平台 | `src/components/About.tsx`、`Platforms.tsx` |
| 技能（调色盘颜料） | `src/components/Skills.tsx` 的 `skills` 与 `DAB_COLORS` |
| 爱好（拍立得） | `src/components/Hobbies.tsx` 的 `hobbies`（图标用 Font Awesome 类名） |
| 奖项（奖状墙） | `src/components/Achievements.tsx` 的 `achievementsData` |
| 天气城市 | `src/ambient/AmbientContext.tsx` 的 `CITY` 与 `WEATHER_URL` |
| 相册 | 自己的照片放 `design/photos/` 后跑 `npm run assets:photos`；Commons 素材改 `scripts/fetch-photos.py` 的 `ITEMS` |
| 词云 | `src/data/words.ts` 的 `cloudWords`（权重、分类、可选 `href`） |
| 四季树 | 改 `scripts/blender/build_four_seasons.py` 后重新渲染，见「四季树」一节 |

## 已知限制

- 贡献数据是**构建时的快照**，不是实时数据；页面底部会显示快照日期。
- 天气需要联网，30 分钟缓存；断网时保留上次结果或只显示时段。
- 中文子集字体需要手动重跑脚本（见上），否则新加的生僻字走系统回退。
- `public/404.html` 的深链接回退依赖项目站点子路径（`pathSegmentsToKeep = 1`）。
- 移动端（< 768px）的时间轴是竖直列表，不是圆环。
- 油画滤镜生效的 5 秒内，`position: fixed` 的元素会被滤镜容器接管，导航栏在滚动状态下会暂时离开视口；这是效果的副作用，不想接受就把 `html.oil-paint #root` 的 `filter` 去掉。
- 相册的 14 张原图约 6.5MB（网格只加载 640px 缩略图，大图在点开时才加载）；自己的照片多起来后，可以考虑把 `fetch-photos.py` 里的 1800 改成 1400 再压一轮。
- 四季树是 6 秒视频：iOS 低电量模式、禁用自动播放或 `prefers-reduced-motion` 下会停在 poster；这是有意的降级，不是加载失败。
