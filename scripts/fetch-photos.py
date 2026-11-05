#!/usr/bin/env python3
"""抓取相册素材（Wikimedia Commons），压缩成 WebP，并生成元数据。

为什么用 Commons：
  - 莫奈作品已是公有领域；青岛照片选用 CC BY / CC BY-SA / 公有领域；
  - 每条都保留作者、许可、来源页，页面上会标注；
  - 全部下载到本地，运行时不依赖外链。

输出：
  public/gallery/<slug>.webp        长边 1800，详情页用
  public/gallery/<slug>-thumb.webp  长边 640，网格用
  src/data/photos.json             标题、作者、许可、来源、尺寸

用法：
  python scripts/fetch-photos.py

注意：Commons 对匿名请求有频率限制，脚本一次请求取全部元数据，图片之间 sleep。
"""
from __future__ import annotations

import html
import io
import json
import pathlib
import re
import time
import urllib.parse
import urllib.request

from PIL import Image

ROOT = pathlib.Path(__file__).resolve().parent.parent
OUT_DIR = ROOT / "public" / "gallery"
DATA_FILE = ROOT / "src" / "data" / "photos.json"
UA = {"User-Agent": "impressionist-garden/1.0 (personal portfolio; contact: site owner)"}

ALLOWED = {
    "public domain",
    "cc0",
    "cc by 2.0",
    "cc by 3.0",
    "cc by 4.0",
    "cc by-sa 2.0",
    "cc by-sa 2.5",
    "cc by-sa 3.0",
    "cc by-sa 4.0",
}

# slug, Commons 文件名, 合集, 标题, 副标题, alt
ITEMS = [
    ("zhanqiao-01", "File:20240729 Zhanqiao 01.jpg", "qingdao", "栈桥", "青岛 · 2024", "青岛栈桥伸入海面的长堤"),
    ("zhanqiao-night", "File:Evening lightshow at Zhanqiao Pier.jpg", "qingdao", "栈桥的夜", "青岛", "夜晚灯光下的栈桥与海面"),
    ("pier", "File:Qingdao Pier.jpg", "qingdao", "回澜阁", "青岛", "栈桥尽头的回澜阁"),
    ("beach-2", "File:20240729 Qingdao No. 2 Beach 01.jpg", "qingdao", "第二海水浴场", "青岛 · 2024", "青岛第二海水浴场的沙滩与海岸"),
    ("xiaoyushan", "File:20240729 View around Xiaoyushan, Qingdao.jpg", "qingdao", "小鱼山远眺", "青岛 · 2024", "从小鱼山俯瞰青岛的红瓦与海岸"),
    ("laoshan-coast", "File:Laoshan rocky beach near taiqing gong.jpg", "qingdao", "崂山海岸", "青岛", "崂山太清宫附近的礁石海岸"),
    ("badaguan", "File:Badaguan, Qingdao.jpg", "qingdao", "八大关", "青岛", "八大关的林荫街道"),
    ("may-fourth", "File:51361-Qingdao May Fourth Square.jpg", "qingdao", "五四广场", "青岛", "五四广场与远处天际线"),

    ("impression-sunrise", "File:Monet - Impression, Sunrise.jpg", "painting", "印象·日出", "莫奈 · 1872", "莫奈《印象·日出》，橘色太阳与雾气中的港口"),
    ("poppy-field", "File:Claude Monet - Poppy Field - Google Art Project (430231).jpg", "painting", "罂粟花田", "莫奈 · 1873", "莫奈《罂粟花田》，红色花田与远山"),
    ("water-lilies", "File:Claude Monet - Water Lilies - Google Art Project.jpg", "painting", "睡莲", "莫奈 · 1906", "莫奈《睡莲》，水面与倒影"),
    ("seerosen", "File:Claude Monet - Seerosen.jpg", "painting", "睡莲（绿）", "莫奈", "莫奈的绿色睡莲"),
    ("water-lilies-bridgestone", "File:Claude Monet - Water-Lilies (Bridgestone Museum).jpg", "painting", "睡莲（桥）", "莫奈 · 1907", "莫奈《睡莲》，日本桥与水面"),
    ("monet-044", "File:Claude Monet 044.jpg", "painting", "睡莲长卷", "莫奈", "莫奈的睡莲长卷"),
]

# 自己的照片：丢进 design/photos/ 即可，文件名会作为标题
LOCAL_DIR = ROOT / "design" / "photos"
LOCAL_SUFFIXES = {".jpg", ".jpeg", ".png", ".webp"}


def strip_html(value: str) -> str:
    text = re.sub(r"<[^>]+>", "", value or "")
    return html.unescape(text).strip()


def fetch_metadata(titles: list[str]) -> dict:
    params = {
        "action": "query",
        "format": "json",
        "titles": "|".join(titles),
        "prop": "imageinfo",
        "iiprop": "url|extmetadata|size",
        "iiurlwidth": "1800",
    }
    url = "https://commons.wikimedia.org/w/api.php?" + urllib.parse.urlencode(params)
    with urllib.request.urlopen(urllib.request.Request(url, headers=UA), timeout=60) as response:
        data = json.load(response)
    pages = data.get("query", {}).get("pages", {})
    return {page["title"]: page for page in pages.values() if "imageinfo" in page}


def download(urls: list[str]) -> Image.Image:
    """按顺序尝试多个地址，每个地址重试 3 次。"""
    last_error: Exception | None = None
    for url in urls:
        for attempt in range(3):
            try:
                request = urllib.request.Request(url, headers=UA)
                with urllib.request.urlopen(request, timeout=90) as response:
                    return Image.open(io.BytesIO(response.read())).convert("RGB")
            except Exception as error:  # noqa: BLE001
                last_error = error
                time.sleep(2 + attempt * 2)
    raise last_error or RuntimeError("下载失败")


def main() -> None:
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    DATA_FILE.parent.mkdir(parents=True, exist_ok=True)

    titles = [item[1] for item in ITEMS]
    pages = fetch_metadata(titles)
    print(f"拿到 {len(pages)} / {len(titles)} 条元数据")

    result = []
    for slug, title, collection, name, subtitle, alt in ITEMS:
        page = pages.get(title)
        if not page:
            print(f"跳过（没有元数据）：{title}")
            continue

        info = page["imageinfo"][0]
        meta = info.get("extmetadata", {})
        license_name = strip_html(meta.get("LicenseShortName", {}).get("value", ""))
        if license_name.lower() not in ALLOWED:
            print(f"跳过（许可不在白名单）：{title} => {license_name}")
            continue

        image_url = info.get("thumburl") or info.get("url")
        if not image_url:
            print(f"跳过（没有图片地址）：{title}")
            continue

        full_path = OUT_DIR / f"{slug}.webp"
        thumb_path = OUT_DIR / f"{slug}-thumb.webp"

        # 断点续跑：已经处理过的图片直接复用
        if full_path.exists():
            image = Image.open(full_path).convert("RGB")
        else:
            fallback = (
                "https://commons.wikimedia.org/wiki/Special:FilePath/"
                + urllib.parse.quote(title.replace("File:", "").replace(" ", "_"))
                + "?width=1800"
            )
            image = download([image_url, fallback])

            # 长边限制在 1800
            width, height = image.size
            scale = min(1.0, 1800 / max(width, height))
            if scale < 1.0:
                image = image.resize((round(width * scale), round(height * scale)), Image.LANCZOS)
            image.save(full_path, "WEBP", quality=82, method=6)

        if not thumb_path.exists() or thumb_path.stat().st_mtime < full_path.stat().st_mtime:
            thumb = image.copy()
            thumb.thumbnail((640, 640), Image.LANCZOS)
            thumb.save(thumb_path, "WEBP", quality=78, method=6)

        artist = strip_html(meta.get("Artist", {}).get("value", ""))
        license_url = strip_html(meta.get("LicenseUrl", {}).get("value", ""))
        source = info.get("descriptionurl") or f"https://commons.wikimedia.org/wiki/{urllib.parse.quote(title.replace(' ', '_'))}"
        credit = (
            f"Claude Monet · Public domain · Wikimedia Commons"
            if collection == "painting"
            else f"摄影：{artist or 'Wikimedia 贡献者'} / {license_name} · Wikimedia Commons"
        )

        result.append({
            "id": slug,
            "collection": collection,
            "title": name,
            "subtitle": subtitle,
            "alt": alt,
            "src": f"gallery/{slug}.webp",
            "thumb": f"gallery/{slug}-thumb.webp",
            "width": image.width,
            "height": image.height,
            "credit": credit,
            "license": license_name,
            "licenseUrl": license_url,
            "source": source,
        })
        print(f"✓ {slug}: {image.width}x{image.height} · {license_name}")
        time.sleep(0.4)

    add_local_photos(result)

    DATA_FILE.write_text(json.dumps(result, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"写入 {DATA_FILE.relative_to(ROOT)}（{len(result)} 张）")


def add_local_photos(result: list[dict]) -> None:
    """把 design/photos/ 里的个人照片追加进相册（合集 mine）。"""
    if not LOCAL_DIR.exists():
        return

    for path in sorted(LOCAL_DIR.iterdir()):
        if not path.is_file() or path.suffix.lower() not in LOCAL_SUFFIXES:
            continue

        slug = re.sub(r"[^a-z0-9-]+", "-", path.stem.lower()).strip("-") or "photo"
        slug = f"mine-{slug}"
        image = Image.open(path).convert("RGB")
        width, height = image.size
        scale = min(1.0, 1800 / max(width, height))
        if scale < 1.0:
            image = image.resize((round(width * scale), round(height * scale)), Image.LANCZOS)

        image.save(OUT_DIR / f"{slug}.webp", "WEBP", quality=84, method=6)
        thumb = image.copy()
        thumb.thumbnail((640, 640), Image.LANCZOS)
        thumb.save(OUT_DIR / f"{slug}-thumb.webp", "WEBP", quality=78, method=6)

        result.append({
            "id": slug,
            "collection": "mine",
            "title": path.stem,
            "subtitle": "我的照片",
            "alt": path.stem,
            "src": f"gallery/{slug}.webp",
            "thumb": f"gallery/{slug}-thumb.webp",
            "width": image.width,
            "height": image.height,
            "credit": "自己的照片",
            "license": "",
            "licenseUrl": "",
            "source": "",
        })
        print(f"✓ {slug}: {image.width}x{image.height} · 本地照片")


if __name__ == "__main__":
    main()