# Generateur du packshot "sachet konbini" du Pack 101.
# Usage : python3 tools/packshot_pack101.py [fond]   (fond = blanc | creme)
# Produit public/store/pack-101.jpg (1200x1500). Photo du corps :
# public/presets101/neon-after.jpg (export Lightroom de Sandrine).
import numpy as np
import sys, os
from PIL import Image, ImageDraw, ImageFont

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
FOND = (255, 255, 255) if (len(sys.argv) < 2 or sys.argv[1] == 'blanc') else (235, 229, 215)

PW, PH = 940, 1600
CRIMP = 112
TEETH, AMP = 24, 14
CREAM = (244, 239, 228)
GREEN = (25, 70, 52)
RED = (214, 60, 40)

HELV = '/System/Library/Fonts/Helvetica.ttc'
GEO = '/System/Library/Fonts/Supplemental/Georgia Italic.ttf'
JP = '/System/Library/Fonts/ヒラギノ角ゴシック W4.ttc'
def F(p, s, i=0):
    return ImageFont.truetype(p, s, index=i)

rng = np.random.default_rng(3)
pouch = Image.new('RGBA', (PW, PH), (0, 0, 0, 0))

# corps : la photo, legerement assombrie
photo = Image.open(os.path.join(ROOT, 'public/presets101/neon-after.jpg')).convert('RGB')
body_h = PH - 2 * CRIMP
r = photo.width / photo.height
tr = PW / body_h
if r > tr:
    nw = int(photo.height * tr)
    photo = photo.crop(((photo.width - nw) // 2, 0, (photo.width + nw) // 2, photo.height))
else:
    nh = int(photo.width / tr)
    top = (photo.height - nh) // 3
    photo = photo.crop((0, top, photo.width, top + nh))
photo = photo.resize((PW, body_h))
photo = Image.fromarray(np.clip(np.array(photo).astype(float) * 0.94, 0, 255).astype(np.uint8))
pouch.paste(photo, (0, CRIMP))

# bandes serties cotelees
def crimp_band(width, height):
    a2 = np.linspace(0, 1, height)[:, None] * np.ones((1, width))
    stripes = 13 * np.sin(np.linspace(0, width / 2.1, width))[None, :]
    v = np.clip(222 + 20 * np.sin(a2 * np.pi) + stripes, 190, 246)
    return Image.fromarray(np.stack([v, v - 2, v - 8], axis=-1).astype(np.uint8))
pouch.paste(crimp_band(PW, CRIMP), (0, 0))
pouch.paste(crimp_band(PW, CRIMP), (0, PH - CRIMP))

# masque zigzag + oeillet + encoche
mask = Image.new('L', (PW, PH), 0)
md = ImageDraw.Draw(mask)
top_pts, bot_pts = [], []
x, up = 0, True
while x < PW:
    top_pts.append((x, AMP if up else 0)); x += TEETH; up = not up
top_pts.append((PW, 0))
x, up = PW, True
while x > 0:
    bot_pts.append((x, PH - (AMP if up else 0))); x -= TEETH; up = not up
bot_pts.append((0, PH))
md.polygon(top_pts + bot_pts, fill=255)
md.rounded_rectangle([PW/2 - 70, 34, PW/2 + 70, 62], radius=14, fill=0)
md.polygon([(PW, CRIMP + 36), (PW - 26, CRIMP + 52), (PW, CRIMP + 68)], fill=0)
pouch.putalpha(mask)
pd = ImageDraw.Draw(pouch)
pd.line([PW - 120, CRIMP + 52, PW - 30, CRIMP + 52], fill=(255, 255, 255, 180), width=2)

WHITE_T = (255, 255, 255, 240)
def tracked(d, xy, text, fnt, fill, tr=5):
    x, y = xy
    for ch in text:
        d.text((x, y), ch, font=fnt, fill=fill)
        x += d.textlength(ch, font=fnt) + tr

# bande de marque
pd.rectangle([0, CRIMP, PW, CRIMP + 86], fill=(25, 70, 52, 255))
tracked(pd, (26, CRIMP + 24), 'THE GIRL WITH A CAMERA', F(HELV, 30, 1), CREAM, 6)
pd.text((PW - 26, CRIMP + 43), 'フィルム調プリセット', font=F(JP, 26), fill=(222, 216, 200), anchor='rm')

# badge rouge
bx, by, br = PW - 108, CRIMP + 190, 78
pd.ellipse([bx - br, by - br, bx + br, by + br], fill=(214, 60, 40, 255))
pd.text((bx, by - 22), '4', font=F(HELV, 74, 1), fill=(255, 255, 255, 255), anchor='mm')
pd.text((bx, by + 34), 'PRESETS', font=F(HELV, 22, 1), fill=(255, 235, 225, 255), anchor='mm')

# japonais vertical
yv = CRIMP + 150
for ch in '写真を、あなたの色に。':
    pd.text((46, yv + 2), ch, font=F(JP, 34), fill=(20, 30, 25, 160), anchor='mm')
    pd.text((44, yv), ch, font=F(JP, 34), fill=WHITE_T, anchor='mm')
    yv += 44

# logo booster
lx, lyo = PW / 2, CRIMP + 340
for dx, dy in ((8, 9), (4, 5)):
    pd.text((lx + dx, lyo + dy), 'Pack 101', font=F(GEO, 132), fill=(10, 28, 22, 230), anchor='mm')
pd.text((lx, lyo), 'Pack 101', font=F(GEO, 132), fill=(244, 239, 228, 255), anchor='mm')
pd.text((lx + 2, lyo + 92), '4 FILM PRESETS INSIDE', font=F(HELV, 27, 1), fill=(10, 28, 22, 220), anchor='mm')
pd.text((lx, lyo + 90), '4 FILM PRESETS INSIDE', font=F(HELV, 27, 1), fill=(255, 255, 255, 235), anchor='mm')

# infos bas en overlay
bot_y = PH - CRIMP
pd.text((38, bot_y - 116), 'STREET · TRAVEL · MARKET · NEON', font=F(HELV, 23, 1), fill=(10, 24, 18, 200))
pd.text((36, bot_y - 118), 'STREET · TRAVEL · MARKET · NEON', font=F(HELV, 23, 1), fill=(255, 255, 255, 240))
pd.text((38, bot_y - 76), '内容量:プリセット4種 · LIGHTROOM', font=F(JP, 22), fill=(10, 24, 18, 200))
pd.text((36, bot_y - 78), '内容量:プリセット4種 · LIGHTROOM', font=F(JP, 22), fill=(235, 235, 232, 235))
pd.text((38, bot_y - 42), 'DESKTOP & MOBILE · MADE IN BRUSSELS', font=F(HELV, 19), fill=(10, 24, 18, 190))
pd.text((36, bot_y - 44), 'DESKTOP & MOBILE · MADE IN BRUSSELS', font=F(HELV, 19), fill=(220, 220, 216, 220))

# pastille code-barres
pd.rounded_rectangle([PW - 258, bot_y - 132, PW - 34, bot_y - 34], radius=10, fill=(246, 244, 238, 255))
rngb = np.random.default_rng(11)
xb = PW - 238
while xb < PW - 58:
    wbar = int(rngb.integers(3, 8))
    pd.rectangle([xb, bot_y - 116, xb + wbar, bot_y - 64], fill=(30, 28, 24, 255))
    xb += wbar + int(rngb.integers(3, 7))
pd.text(((PW - 238 + PW - 58) / 2, bot_y - 58), '4 002026 000101', font=F(HELV, 18), fill=(80, 76, 66, 255), anchor='ma')

# physique : bombe + froissements + satine metallise
parr = np.array(pouch).astype(float)
yy2, xx2 = np.mgrid[0:PH, 0:PW]
bulge = np.clip(0.86 + 0.26 * np.sin(np.pi * xx2 / PW), 0.86, 1.09)
parr[..., :3] *= bulge[..., None]
rngw = np.random.default_rng(5)
wr = np.zeros((PH, PW))
for _ in range(9):
    x0, y0 = rngw.uniform(0, PW), rngw.uniform(CRIMP, PH - CRIMP)
    ang = rngw.uniform(-0.9, 0.9)
    dd = np.cos(ang) * (yy2 - y0) - np.sin(ang) * (xx2 - x0)
    along = np.sin(ang) * (yy2 - y0) + np.cos(ang) * (xx2 - x0)
    sigma = rngw.uniform(2.5, 6.0); Ln = rngw.uniform(180, 520); amp = rngw.uniform(16, 38)
    wr += amp * np.exp(-dd**2 / (2 * sigma**2)) * np.exp(-along**2 / (2 * Ln**2))
for _ in range(4):
    x0, y0 = rngw.uniform(0, PW), rngw.uniform(CRIMP, PH - CRIMP)
    ang = rngw.uniform(-0.9, 0.9)
    dd = np.cos(ang) * (yy2 - y0) - np.sin(ang) * (xx2 - x0)
    along = np.sin(ang) * (yy2 - y0) + np.cos(ang) * (xx2 - x0)
    sigma = rngw.uniform(4.0, 9.0); Ln = rngw.uniform(150, 420); amp = rngw.uniform(10, 18)
    wr -= amp * np.exp(-dd**2 / (2 * sigma**2)) * np.exp(-along**2 / (2 * Ln**2))
parr[..., :3] = np.clip(parr[..., :3] + wr[..., None], 0, 255)
tt = (xx2 + 0.62 * yy2) / (PW + 0.62 * PH)
lum = 12 * np.exp(-((tt - 0.38) ** 2) / 0.02) - 7 * np.exp(-((tt - 0.68) ** 2) / 0.015)
lum += 2.5 * np.sin(xx2 / 2.6)
silver = 0.06 * np.exp(-((tt - 0.38) ** 2) / 0.02)
gray = parr[..., :3].mean(-1, keepdims=True)
parr[..., :3] = parr[..., :3] * (1 - silver[..., None]) + (gray * 0.3 + 215 * 0.7) * silver[..., None]
parr[..., :3] = np.clip(parr[..., :3] + lum[..., None] + rng.normal(0, 2.0, (PH, PW, 1)), 0, 255)
pouch = Image.fromarray(parr.astype(np.uint8))

# composition finale sur fond uni
W, H = 1200, 1500
canvas = Image.new('RGBA', (W, H), FOND + (255,))
pw2 = 760
ph2 = int(pw2 * PH / PW)
canvas.alpha_composite(pouch.resize((pw2, ph2)), ((W - pw2) // 2, (H - ph2) // 2))
canvas.convert('RGB').save(os.path.join(ROOT, 'public/store/pack-101.jpg'), quality=92)
print('packshot ecrit sur fond', 'blanc' if FOND == (255, 255, 255) else 'creme')
