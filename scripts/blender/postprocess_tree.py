"""把 Blender 的透明 PNG 序列合成到站点底色，编码成 MP4/WebM，并生成 poster。

用法：python scripts/blender/postprocess_tree.py
依赖：Pillow、imageio-ffmpeg
"""
from __future__ import annotations

import pathlib
import subprocess

from PIL import Image
import imageio_ffmpeg

ROOT = pathlib.Path(__file__).resolve().parents[2]
FRAMES = ROOT / "design" / "blender" / "frames"
COMP = ROOT / "design" / "blender" / "comp"
VIDEO = ROOT / "public" / "video"
IMAGES = ROOT / "public" / "images"
CREAM = (250, 247, 244, 255)

FRAME_COUNT = 144
FPS = 24


def main() -> None:
    frames = sorted(FRAMES.glob("frame_*.png"))
    if len(frames) < FRAME_COUNT:
        raise SystemExit(f"只有 {len(frames)} 帧，至少要 {FRAME_COUNT} 帧")

    COMP.mkdir(parents=True, exist_ok=True)
    VIDEO.mkdir(parents=True, exist_ok=True)
    IMAGES.mkdir(parents=True, exist_ok=True)

    for index, path in enumerate(frames[:FRAME_COUNT], start=1):
        image = Image.open(path).convert("RGBA")
        background = Image.new("RGBA", image.size, CREAM)
        background.alpha_composite(image)
        background.convert("RGB").save(
            COMP / f"frame_{index:04d}.jpg", quality=95, subsampling=0
        )

    poster = Image.open(frames[0]).convert("RGBA")
    poster_bg = Image.new("RGBA", poster.size, CREAM)
    poster_bg.alpha_composite(poster)
    poster_bg.convert("RGB").save(IMAGES / "four-seasons-poster.webp", "WEBP", quality=88)

    ffmpeg = imageio_ffmpeg.get_ffmpeg_exe()
    input_pattern = str(COMP / "frame_%04d.jpg")

    mp4 = VIDEO / "four-seasons.mp4"
    subprocess.run([
        ffmpeg, "-y", "-framerate", str(FPS), "-i", input_pattern,
        "-c:v", "libx264", "-pix_fmt", "yuv420p", "-crf", "20",
        "-preset", "slow", "-movflags", "+faststart", "-an", str(mp4),
    ], check=True, capture_output=True)

    webm = VIDEO / "four-seasons.webm"
    subprocess.run([
        ffmpeg, "-y", "-framerate", str(FPS), "-i", input_pattern,
        "-c:v", "libvpx-vp9", "-b:v", "0", "-crf", "34",
        "-row-mt", "1", "-deadline", "good", "-cpu-used", "2", "-an", str(webm),
    ], check=True, capture_output=True)

    for path in (mp4, webm, IMAGES / "four-seasons-poster.webp"):
        print(f"{path.relative_to(ROOT)}  {path.stat().st_size / 1024:.0f} KB")


if __name__ == "__main__":
    main()
