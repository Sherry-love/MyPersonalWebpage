#!/usr/bin/env python3
"""生成站点所需的优化图片资源。

输入（保留在 design/，不进 public）：
  design/logo-original.jpg   1080x1080 水彩头像插画
  design/reza-original.jpg   1000x1000 黑白漫画头像

输出：
  public/images/logo.webp        导航栏圆形 Logo（脸部特写）
  public/images/reza.webp        关于区头像
  public/favicon-32.png          浏览器标签图标
  public/apple-touch-icon.png    iOS 主屏图标
  public/favicon.ico             16/32/48 多尺寸
  public/og.jpg                  1200x630 社交分享图

用法：python scripts/build-images.py
依赖：Pillow；中文字体使用系统 Noto Serif SC（缺失时回退宋体）。
"""
from __future__ import annotations

import pathlib
import sys

from PIL import Image, ImageDraw, ImageFilter, ImageFont

ROOT = pathlib.Path(__file__).resolve().parent.parent
PUBLIC = ROOT / "public"
IMAGES = PUBLIC / "images"
DESIGN = ROOT / "design"

# 原图中脸部大致范围（1080x1080 坐标系）
FACE_BOX = (230, 260, 670, 700)

FONT_CANDIDATES = [
    "C:/Windows/Fonts/NotoSerifSC-VF.ttf",
    "C:/Windows/Fonts/STSONG.TTF",
    "C:/Windows/Fonts/simsun.ttc",
    "/System/Library/Fonts/Songti.ttc",
]


def load_font(size: int, weight: int | None = None) -> ImageFont.FreeTypeFont:
    for path in FONT_CANDIDATES:
        if not pathlib.Path(path).exists():
            continue
        font = ImageFont.truetype(path, size)
        if weight is not None and hasattr(font, "set_variation_by_axes"):
            try:
                font.set_variation_by_axes([weight])
            except Exception:
                pass
        return font
    raise SystemExit("找不到可用的中文字体，请安装 Noto Serif SC 或宋体")


def load_latin(size: int, bold: bool = False) -> ImageFont.FreeTypeFont:
    name = "georgiab.ttf" if bold else "georgia.ttf"
    path = pathlib.Path("C:/Windows/Fonts") / name
    if path.exists():
        return ImageFont.truetype(str(path), size)
    return load_font(size)


def face_square(src: Image.Image) -> Image.Image:
    return src.crop(FACE_BOX).resize((720, 720), Image.LANCZOS)


def save_webp(img: Image.Image, path: pathlib.Path, quality: int) -> None:
    img.save(path, "WEBP", quality=quality, method=6)


def make_rounded_avatar(img: Image.Image, size: int) -> Image.Image:
    """圆形头像 + 极细白边，用于 OG 图。"""
    avatar = img.resize((size, size), Image.LANCZOS).convert("RGBA")
    mask = Image.new("L", (size, size), 0)
    ImageDraw.Draw(mask).ellipse((0, 0, size - 1, size - 1), fill=255)
    out = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    out.paste(avatar, (0, 0), mask)
    ImageDraw.Draw(out).ellipse(
        (2, 2, size - 3, size - 3), outline=(255, 255, 255, 235), width=6
    )
    return out


def build_og(face: Image.Image) -> Image.Image:
    W, H = 1200, 630
    canvas = Image.new("RGB", (W, H), "#FAF7F4")

    # 柔光色块
    blobs = Image.new("RGB", (W, H), "#FAF7F4")
    bd = ImageDraw.Draw(blobs)
    bd.ellipse((760, -180, 1360, 420), fill="#F0E4E0")
    bd.ellipse((900, 300, 1500, 900), fill="#E8E2F0")
    bd.ellipse((-160, 380, 340, 880), fill="#E1ECEC")
    blobs = blobs.filter(ImageFilter.GaussianBlur(90))
    canvas = Image.blend(canvas, blobs, 0.85).convert("RGBA")

    # 右侧头像：先铺一层模糊投影，再贴圆形头像
    size, cx, cy = 320, 880, 315
    shadow = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    ImageDraw.Draw(shadow).ellipse(
        (cx - size // 2, cy - size // 2 + 14,
         cx + size // 2, cy + size // 2 + 22),
        fill=(140, 120, 170, 70),
    )
    canvas = Image.alpha_composite(canvas, shadow.filter(ImageFilter.GaussianBlur(26)))
    avatar = make_rounded_avatar(face, size)
    canvas.paste(avatar, (cx - size // 2, cy - size // 2), avatar)

    draw = ImageDraw.Draw(canvas)

    # 左侧文字
    x = 96
    draw.text((x, 148), "I M P R E S S I O N I S T   G A R D E N",
              font=load_latin(19), fill="#8A7D9C")

    title_font = load_font(84, weight=700)
    draw.text((x - 4, 190), "刘东徽", font=title_font, fill="#4A4458")

    draw.text((x, 306), "青岛大学 · 计算机科学与技术",
              font=load_font(32, weight=400), fill="#6A637C")
    draw.text((x, 366), "Personal Portfolio · 2026",
              font=load_latin(24), fill="#8A8498")

    # 细分割线
    draw.line((x, 436, x + 420, 436), fill="#D9D2E3", width=2)

    draw.text((x, 468), "github.com/Sherry-love",
              font=load_latin(22), fill="#8A8498")

    # 左下角小装饰：三颗色点
    for i, color in enumerate(("#C4B5D5", "#D4B8C0", "#E1ECEC")):
        cx = x + 8 + i * 26
        draw.ellipse((cx - 6, 560, cx + 6, 572), fill=color)

    return canvas


def main() -> None:
    logo_path = DESIGN / "logo-original.jpg"
    reza_path = DESIGN / "reza-original.jpg"
    if not logo_path.exists() or not reza_path.exists():
        raise SystemExit(f"缺少原图：{logo_path} / {reza_path}")

    IMAGES.mkdir(parents=True, exist_ok=True)

    logo_src = Image.open(logo_path).convert("RGB")
    reza_src = Image.open(reza_path).convert("RGB")
    face = face_square(logo_src)

    # 导航栏 Logo：脸部特写，2x 显示尺寸
    save_webp(face.resize((128, 128), Image.LANCZOS), IMAGES / "logo.webp", 88)

    # 关于区头像：最宽显示 224px，按 2x 输出 560px
    save_webp(
        reza_src.resize((560, 560), Image.LANCZOS), IMAGES / "reza.webp", 86
    )

    # favicon：脸部特写，取 256 源图再缩，避免小尺寸下线条糊掉
    icon = face.resize((256, 256), Image.LANCZOS)
    icon.resize((32, 32), Image.LANCZOS).save(
        PUBLIC / "favicon-32.png", "PNG", optimize=True
    )
    icon.resize((180, 180), Image.LANCZOS).quantize(colors=192).save(
        PUBLIC / "apple-touch-icon.png", "PNG", optimize=True
    )
    icon.save(PUBLIC / "favicon.ico", sizes=[(16, 16), (32, 32), (48, 48)])

    # 社交分享图用 JPEG，体积约为 PNG 的三分之一，兼容性也最好
    build_og(face).convert("RGB").save(
        PUBLIC / "og.jpg", "JPEG", quality=88, optimize=True, progressive=True
    )

    for p in sorted(PUBLIC.rglob("*")):
        if p.is_file() and p.suffix.lower() in {".webp", ".png", ".ico"}:
            print(f"{p.relative_to(ROOT)}  {p.stat().st_size / 1024:.1f} KB")


if __name__ == "__main__":
    try:
        main()
    except Exception as exc:  # noqa: BLE001
        print(f"生成失败: {exc}", file=sys.stderr)
        raise
