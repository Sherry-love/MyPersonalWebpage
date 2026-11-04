#!/usr/bin/env python3
"""从系统 Noto Serif SC 生成站点专用的中文字体子集。

为什么需要这个脚本：
  中文字体动辄 20MB，直接自托管不现实；而 Google Fonts CDN 在国内/离线时
  不可靠。这里把「站点源码里实际出现过的字符」抽出来做子集，通常只有
  300~400KB，一次下载长期缓存，同时保留 200~900 可变字重。

用法：
  python scripts/build-font-subset.py

注意：
  新增中文文案（尤其是随笔/README）后，重新跑一次本脚本，否则新字符会
  回退到系统字体（不会出现方块，但字形可能不一致）。

输出：src/assets/fonts/noto-serif-sc-subset.woff2
"""
from __future__ import annotations

import pathlib
import sys

from fontTools import subset
from fontTools.ttLib import TTFont

ROOT = pathlib.Path(__file__).resolve().parent.parent
OUT = ROOT / "src" / "assets" / "fonts" / "noto-serif-sc-subset.woff2"

SOURCE_CANDIDATES = [
    "C:/Windows/Fonts/NotoSerifSC-VF.ttf",
    "C:/Windows/Fonts/NotoSerifSC-Regular.otf",
    "/System/Library/Fonts/Supplemental/NotoSerifSC-Regular.otf",
    "/usr/share/fonts/opentype/noto/NotoSerifCJK-Regular.ttc",
]

TEXT_GLOBS = [
    "src/**/*.tsx",
    "src/**/*.ts",
    "src/**/*.css",
    "src/**/*.md",
    "README.md",
    "index.html",
]


def find_source() -> pathlib.Path:
    for candidate in SOURCE_CANDIDATES:
        path = pathlib.Path(candidate)
        if path.exists():
            return path
    raise SystemExit(
        "找不到 Noto Serif SC 字体文件。\n"
        "可从这里下载后放到任意路径，并修改本脚本的 SOURCE_CANDIDATES：\n"
        "https://github.com/notofonts/noto-cjk/raw/main/Serif/Variable/OTF/Subset/NotoSerifSC-VF.otf"
    )


def collect_chars() -> str:
    chars: set[str] = set()
    for pattern in TEXT_GLOBS:
        for path in ROOT.glob(pattern):
            if not path.is_file():
                continue
            try:
                chars.update(path.read_text(encoding="utf-8"))
            except UnicodeDecodeError:
                continue
    # 常用 ASCII 与标点，保证降级时排版不塌
    chars.update(chr(code) for code in range(32, 127))
    chars.update("·—…“”‘’《》〈〉「」『』【】、，。；：？！（）")
    chars.discard("\r")
    chars.discard("\n")
    chars.discard("\t")
    return "".join(sorted(chars))


def main() -> None:
    if hasattr(sys.stdout, "reconfigure"):
        sys.stdout.reconfigure(encoding="utf-8", errors="replace")
    source = find_source()
    text = collect_chars()
    cjk = sum(1 for ch in text if "\u4e00" <= ch <= "\u9fff")

    options = subset.Options()
    options.flavor = "woff2"
    options.layout_features = ["*"]
    options.name_IDs = ["*"]
    options.notdef_outline = True
    options.recalc_bounds = True
    options.drop_tables += ["DSIG"]

    font = TTFont(str(source))
    subsetter = subset.Subsetter(options=options)
    subsetter.populate(text=text)
    subsetter.subset(font)

    OUT.parent.mkdir(parents=True, exist_ok=True)
    font.flavor = "woff2"
    font.save(str(OUT))

    size_kb = OUT.stat().st_size / 1024
    print(f"字符数 {len(text)}（汉字 {cjk}）→ {OUT.relative_to(ROOT)}  {size_kb:.0f} KB")


if __name__ == "__main__":
    try:
        main()
    except Exception as exc:  # noqa: BLE001
        print(f"子集化失败: {exc}", file=sys.stderr)
        raise
