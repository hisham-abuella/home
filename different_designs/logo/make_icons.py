"""Turn a generated logo mark into favicon-ready files.

Usage:  python3 make_icons.py concepts/7a-wave-h.png [more.png ...]

For each mark: crop to the artwork (the model leaves a margin of background around the
icon), make it square with a small even margin, and write
    icons/<name>/icon-512.png   source for everything else
    icons/<name>/apple-touch-icon.png   180×180
    icons/<name>/favicon-48.png, favicon-32.png, favicon-16.png
The flat background around the icon becomes transparent. Metadata is not copied, so no
EXIF reaches the site.
"""

import sys
from pathlib import Path

from PIL import Image, ImageChops, ImageDraw

HERE = Path(__file__).parent
SIZES = {'icon-512.png': 512, 'apple-touch-icon.png': 180, 'favicon-48.png': 48,
         'favicon-32.png': 32, 'favicon-16.png': 16}


def crop_to_art(img: Image.Image, margin: float = 0.04) -> Image.Image:
    """Crop away the flat background the model put around the icon, then square it."""
    rgb = img.convert('RGB')
    corner = rgb.getpixel((4, 4))
    diff = ImageChops.difference(rgb, Image.new('RGB', rgb.size, corner)).convert('L')
    box = diff.point(lambda v: 255 if v > 24 else 0).getbbox() or (0, 0, *rgb.size)
    left, top, right, bottom = box
    side = max(right - left, bottom - top)
    side = int(side * (1 + 2 * margin))
    cx, cy = (left + right) // 2, (top + bottom) // 2
    x0, y0 = cx - side // 2, cy - side // 2
    # Fill with the background colour, then paste only the part that lies inside the image,
    # so a square that runs past the edge never picks up black padding.
    square = Image.new('RGB', (side, side), corner)
    inside = (max(x0, 0), max(y0, 0), min(x0 + side, rgb.width), min(y0 + side, rgb.height))
    square.paste(rgb.crop(inside), (inside[0] - x0, inside[1] - y0))
    return square


def clear_background(square: Image.Image, tolerance: int = 40) -> Image.Image:
    """Make the flat background around the icon transparent, so the favicon sits cleanly
    on light and dark browser tabs. Flood-fills inward from each corner only, so colours
    inside the artwork are never touched."""
    rgba = square.convert('RGBA')
    w, h = rgba.size
    for corner in ((0, 0), (w - 1, 0), (0, h - 1), (w - 1, h - 1)):
        if rgba.getpixel(corner)[3]:
            ImageDraw.floodfill(rgba, corner, (0, 0, 0, 0), thresh=tolerance)
    return rgba


def main(paths):
    for p in paths:
        src = Path(p)
        art = clear_background(crop_to_art(Image.open(src)))
        out = HERE / 'icons' / src.stem
        out.mkdir(parents=True, exist_ok=True)
        for name, size in SIZES.items():
            art.resize((size, size), Image.LANCZOS).save(out / name, optimize=True)
        print(f'{src.name}: cropped to {art.size[0]}px square -> {out.relative_to(HERE)}/')


if __name__ == '__main__':
    main(sys.argv[1:])
