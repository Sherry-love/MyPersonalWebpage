"""把幽灵小岛渲染图调成紫色调、裁切留白、导出透明 WebP。

前置：Blender 渲染 design/blender/ghost_test/frame_0001.png（RGBA）
用法：python scripts/blender/postprocess_ghost.py
"""
from __future__ import annotations

import pathlib

import numpy as np
from PIL import Image

ROOT = pathlib.Path(__file__).resolve().parents[2]
SRC = ROOT / "design" / "blender" / "ghost_test" / "frame_0001.png"
OUT = ROOT / "public" / "images" / "ghost-island.webp"

# 0-255 hue：绿~85、青~128、蓝~170、黄~42、橙~21
SRC_HUES = np.array([0, 21, 42, 60, 85, 110, 128, 150, 170, 190], dtype=np.float32)
DST_HUES = np.array([250, 242, 248, 234, 210, 218, 225, 230, 235, 238], dtype=np.float32)


def main() -> None:
    image = Image.open(SRC).convert("RGBA")
    pixels = np.array(image).astype(np.float32)
    rgb = Image.fromarray(pixels[..., :3].astype(np.uint8), "RGB")

    hsv = np.array(rgb.convert("HSV")).astype(np.float32)
    hue, saturation, value = hsv[..., 0], hsv[..., 1], hsv[..., 2]
    new_hue = np.interp(hue, SRC_HUES, DST_HUES)
    new_sat = np.clip(saturation * 0.76, 0, 255)
    new_val = np.clip(value * 1.03, 0, 255)
    graded = np.stack([new_hue, new_sat, new_val], axis=-1).astype(np.uint8)
    graded_rgb = np.array(Image.fromarray(graded, "HSV").convert("RGB")).astype(np.float32)

    alpha = pixels[..., 3]
    result = Image.fromarray(
        np.dstack([graded_rgb, alpha]).astype(np.uint8), "RGBA"
    )

    bbox = result.getchannel("A").getbbox()
    if not bbox:
        raise SystemExit("图像全透明，检查渲染")

    margin = 36
    width = bbox[2] - bbox[0] + margin * 2
    height = bbox[3] - bbox[1] + margin * 2
    canvas = Image.new("RGBA", (width, height), (0, 0, 0, 0))
    canvas.paste(result, (margin - bbox[0], margin - bbox[1]))

    if canvas.width > 640:
        ratio = 640 / canvas.width
        canvas = canvas.resize((640, round(canvas.height * ratio)), Image.LANCZOS)

    OUT.parent.mkdir(parents=True, exist_ok=True)
    canvas.save(OUT, "WEBP", quality=90, method=6)
    print(f"{OUT.relative_to(ROOT)}  {OUT.stat().st_size / 1024:.0f} KB  {canvas.size[0]}x{canvas.size[1]}")


if __name__ == "__main__":
    main()
