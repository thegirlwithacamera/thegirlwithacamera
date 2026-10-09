# Packshot du guide "Shy With A Camera" : zine pose sur fond blanc pur,
# couverture = page 1 du PDF, tranche de pages visible, ombre douce.
# Produit public/store/shy.jpg (1200x1500), meme etagere que les autres.
import os, re, io, zlib
import numpy as np
from PIL import Image, ImageDraw, ImageFilter

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PDF = '/tmp/shy_product/TGWAC Shy With A Camera/Shy With A Camera.pdf'

# page 1 du PDF (premier stream image)
data = open(PDF, 'rb').read()
cover = None
for m in re.finditer(rb'stream\r?\n(.*?)\r?\nendstream', data, re.S):
    raw = m.group(1)
    try:
        cover = Image.open(io.BytesIO(raw)); cover.load(); cover = cover.convert('RGB')
        break
    except Exception:
        try:
            cover = Image.open(io.BytesIO(zlib.decompress(raw))); cover.load(); cover = cover.convert('RGB')
            break
        except Exception:
            continue
assert cover is not None

W, H = 1200, 1500
ZW, ZH = 760, 1075  # zine ~A4
canvas = Image.new('RGBA', (W, H), (255, 255, 255, 255))

# ombre portee douce
sh = Image.new('RGBA', (W, H), (0, 0, 0, 0))
ImageDraw.Draw(sh).rounded_rectangle(
    [(W - ZW) // 2 + 16, (H - ZH) // 2 + 26, (W + ZW) // 2 + 16, (H + ZH) // 2 + 26],
    radius=8, fill=(30, 25, 20, 90))
canvas.alpha_composite(sh.filter(ImageFilter.GaussianBlur(22)))

# tranche de pages (petit bloc blanc decale)
x0, y0 = (W - ZW) // 2, (H - ZH) // 2
d = ImageDraw.Draw(canvas)
for i in range(4, 0, -1):
    g = 252 - i * 7
    d.rounded_rectangle([x0 + i * 2, y0 + i * 2, x0 + ZW + i * 2, y0 + ZH + i * 2],
                        radius=6, fill=(g, g - 1, g - 4, 255))

# couverture avec legere courbure lumineuse
cov = cover.resize((ZW, ZH))
a = np.array(cov).astype(float)
xx = np.linspace(0, 1, ZW)[None, :, None]
a *= (0.97 + 0.05 * np.sin(np.pi * xx * 0.9 + 0.2))
a += np.random.default_rng(7).normal(0, 1.2, (ZH, ZW, 1))
cov = Image.fromarray(np.clip(a, 0, 255).astype(np.uint8))
mask = Image.new('L', (ZW, ZH), 0)
ImageDraw.Draw(mask).rounded_rectangle([0, 0, ZW - 1, ZH - 1], radius=6, fill=255)
canvas.paste(cov, (x0, y0), mask)

# agrafes de zine
for yy in (y0 + int(ZH * 0.3), y0 + int(ZH * 0.7)):
    d.rounded_rectangle([x0 + 6, yy, x0 + 12, yy + 36], radius=3, fill=(180, 178, 172, 255))

canvas.convert('RGB').save(os.path.join(ROOT, 'public/store/shy.jpg'), quality=92)
print('packshot shy ok')
