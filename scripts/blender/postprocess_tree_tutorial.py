"""把教程场景的 288 帧渲染编码成网页视频与 poster。

前置：Blender 5.2.3 渲染 design/blender/tutorial_frames/frame_0001..0288.png
用法：python scripts/blender/postprocess_tree_tutorial.py
"""
from __future__ import annotations

import pathlib
import subprocess

from PIL import Image
import imageio_ffmpeg

ROOT = pathlib.Path(__file__).resolve().parents[2]
FRAMES = ROOT / "design" / "blender" / "tutorial_frames"
VIDEO = ROOT / "public" / "video"
IMAGES = ROOT / "public" / "images"

FRAME_COUNT = 288
FPS = 24
POSTER_FRAME = 96


def main() -> None:
    frames = sorted(FRAMES.glob("frame_*.png"))
    if len(frames) < FRAME_COUNT:
        raise SystemExit(f"只有 {len(frames)} 帧，至少要 {FRAME_COUNT} 帧")

    VIDEO.mkdir(parents=True, exist_ok=True)
    IMAGES.mkdir(parents=True, exist_ok=True)

    poster = Image.open(FRAMES / f"frame_{POSTER_FRAME:04d}.png").convert("RGB")
    poster.save(IMAGES / "four-seasons-poster.webp", "WEBP", quality=90)

    ffmpeg = imageio_ffmpeg.get_ffmpeg_exe()
    pattern = str(FRAMES / "frame_%04d.png")

    mp4 = VIDEO / "four-seasons.mp4"
    subprocess.run([
        ffmpeg, "-y", "-framerate", str(FPS), "-i", pattern,
        "-c:v", "libx264", "-pix_fmt", "yuv420p", "-crf", "21",
        "-preset", "slow", "-movflags", "+faststart", "-an", str(mp4),
    ], check=True, capture_output=True)

    webm = None

    for path in (mp4, IMAGES / "four-seasons-poster.webp"):
        print(f"{path.relative_to(ROOT)}  {path.stat().st_size / 1024:.0f} KB")


if __name__ == "__main__":
    main()
