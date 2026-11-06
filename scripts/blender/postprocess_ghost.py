"""把幽灵小岛序列调成紫色调、统一裁切，导出静态 + 动画 WebP。

前置：Blender 渲染 design/blender/ghost_frames/frame_0001..0048.png（RGBA）
用法：python scripts/blender/postprocess_ghost.py
"""
from __future__ import annotations

import pathlib

import numpy as np
from PIL import Image

ROOT = pathlib.Path(__file__).resolve().parents[2]
FRAMES = ROOT / "design" / "blender" / "ghost_frames"
STATIC_OUT = ROOT / "public" / "images" / "ghost-island.webp"
ANIM_OUT = ROOT / "public" / "images" / "ghost-island-anim.webp"

# 0-255 hue：绿~85、青~128、蓝~170、黄~42、橙~21
SRC_HUES = np.array([0, 21, 42, 60, 85, 110, 128, 150, 170, 190], dtype=np.float32)
DST_HUES = np.array([250, 242, 248, 234, 210, 218, 225, 230, 235, 238], dtype=np.float32)


def grade(image: Image.Image) -> Image.Image:
    pixels = np.array(image).astype(np.float32)
    rgb = Image.fromarray(pixels[..., :3].astype(np.uint8), "RGB")

    hsv = np.array(rgb.convert("HSV")).astype(np.float32)
    hue, saturation, value = hsv[..., 0], hsv[..., 1], hsv[..., 2]
    new_hue = np.interp(hue, SRC_HUES, DST_HUES)
    new_sat = np.clip(saturation * 0.76, 0, 255)
    new_val = np.clip(value * 1.03, 0, 255)
    graded = np.stack([new_hue, new_sat, new_val], axis=-1).astype(np.uint8)
    graded_rgb = np.array(Image.fromarray(graded, "HSV").convert("RGB")).astype(np.float32)

    return Image.fromarray(
        np.dstack([graded_rgb, pixels[..., 3]]).astype(np.uint8), "RGBA"
    )


def main() -> None:
    files = sorted(FRAMES.glob("frame_*.png"))
    if len(files) < 36:
        raise SystemExit(f"只有 {len(files)} 帧，至少要 36 帧")

    # 从 48 帧里均匀取 36 帧，压到 3 秒循环，减小动画体积
    picks = [files[round(i * (len(files) - 1) / 35)] for i in range(36)]
    picks = list(dict.fromkeys(picks))
    graded = [grade(Image.open(path).convert("RGBA")) for path in picks]

    # 所有帧取并集，保证游走时裁切框不抖
    left = min(frame.getchannel("A").getbbox()[0] for frame in graded)
    top = min(frame.getchannel("A").getbbox()[1] for frame in graded)
    right = max(frame.getchannel("A").getbbox()[2] for frame in graded)
    bottom = max(frame.getchannel("A").getbbox()[3] for frame in graded)

    margin = 36
    left = max(0, left - margin)
    top = max(0, top - margin)
    right = min(graded[0].width, right + margin)
    bottom = min(graded[0].height, bottom + margin)
    box = (left, top, right, bottom)

    cropped = [frame.crop(box) for frame in graded]
    if cropped[0].width > 360:
        ratio = 360 / cropped[0].width
        size = (360, round(cropped[0].height * ratio))
        cropped = [frame.resize(size, Image.LANCZOS) for frame in cropped]

    STATIC_OUT.parent.mkdir(parents=True, exist_ok=True)
    cropped[0].save(STATIC_OUT, "WEBP", quality=90, method=6)
    cropped[0].save(
        ANIM_OUT,
        "WEBP",
        save_all=True,
        append_images=cropped[1:],
        duration=83,
        loop=0,
        quality=72,
        method=6,
    )

    for path in (STATIC_OUT, ANIM_OUT):
        print(f"{path.relative_to(ROOT)}  {path.stat().st_size / 1024:.0f} KB  {cropped[0].size[0]}x{cropped[0].size[1]}")


if __name__ == "__main__":
    main()
