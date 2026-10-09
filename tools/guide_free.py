# Mini-guide OFFERT (lead magnet de la porte email du store) :
# "Five Shy Street Tricks", 4 pages, teaser du guide paye Shy With A Camera.
# Produit public/downloads/TGWAC-Five-Shy-Street-Tricks.pdf
import os
from PIL import Image, ImageDraw, ImageFont

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, 'public/downloads')
os.makedirs(OUT, exist_ok=True)

W, H = 1654, 2339
CREAM = (240, 236, 228)
GREEN = (29, 58, 47)
TERRA = (199, 91, 57)
INK = (40, 40, 40)
STONE = (120, 114, 100)
LINE = (210, 203, 188)

HELV = '/System/Library/Fonts/Helvetica.ttc'
GEOI = '/System/Library/Fonts/Supplemental/Georgia Italic.ttf'
GEO = '/System/Library/Fonts/Supplemental/Georgia.ttf'
F = lambda s, i=0: ImageFont.truetype(HELV, s, index=i)
FI = lambda s: ImageFont.truetype(GEOI, s)
FS = lambda s: ImageFont.truetype(GEO, s)

MX = 150
pages = []

def new_page():
    im = Image.new('RGB', (W, H), CREAM)
    return im, ImageDraw.Draw(im)

def footer(d, num):
    d.line([MX, H - 170, W - MX, H - 170], fill=LINE, width=2)
    d.text((MX, H - 140), 'THE GIRL WITH A CAMERA · FREE MINI GUIDE', font=F(26, 1), fill=STONE)
    d.text((W - MX, H - 140), str(num), font=F(26, 1), fill=STONE, anchor='ra')

def wrap(d, x, y, text, font, fill, maxw, lh):
    for para in text.split('\n'):
        line = ''
        for w_ in para.split(' '):
            t = (line + ' ' + w_).strip()
            if d.textlength(t, font=font) > maxw and line:
                d.text((x, y), line, font=font, fill=fill); y += lh; line = w_
            else:
                line = t
        if line:
            d.text((x, y), line, font=font, fill=fill); y += lh
    return y

def trick(d, y, num, title, txt):
    d.ellipse([MX, y, MX + 70, y + 70], outline=TERRA, width=4)
    d.text((MX + 35, y + 35), str(num), font=F(38, 1), fill=TERRA, anchor='mm')
    d.text((MX + 100, y + 6), title, font=F(42, 1), fill=INK)
    y = wrap(d, MX + 100, y + 66, txt, F(33), STONE, W - 2 * MX - 100, 47) + 44
    return y

def photo_band(im, path, y0, y1):
    ph = Image.open(os.path.join(ROOT, path)).convert('RGB')
    bw, bh = W - 2 * MX, y1 - y0
    r, tr = ph.width / ph.height, bw / bh
    if r > tr:
        nw = int(ph.height * tr); ph = ph.crop(((ph.width - nw) // 2, 0, (ph.width + nw) // 2, ph.height))
    else:
        nh = int(ph.width / tr); top = (ph.height - nh) // 3
        ph = ph.crop((0, top, ph.width, top + nh))
    im.paste(ph.resize((bw, bh)), (MX, y0))

# ---------- COUVERTURE ----------
im, d = new_page()
photo_band(im, 'public/presets101/market-after.jpg', 150, 1330)
d.text((MX, 1410), 'THE GIRL WITH A CAMERA · FREE MINI GUIDE', font=F(32, 1), fill=TERRA)
y = wrap(d, MX, 1480, 'Five Shy', FI(160), GREEN, W - 2 * MX, 172)
y = wrap(d, MX, y - 26, 'Street Tricks', FI(160), GREEN, W - 2 * MX, 172)
wrap(d, MX, y + 16, 'Street photography without the fear. Five things I actually do, from someone who is shy too.',
     FS(42), STONE, W - 2 * MX - 100, 60)
d.line([MX, H - 240, W - MX, H - 240], fill=LINE, width=2)
d.text((MX, H - 200), 'BY SANDRINE CEUPPENS · @SANDRINECPPNS', font=F(26, 1), fill=STONE)
pages.append(im)

# ---------- TRICKS 1-3 ----------
im, d = new_page()
y = wrap(d, MX, 170, 'The first three.', FI(92), GREEN, W - 2 * MX, 108) + 50
y = trick(d, y, 1, 'Test the spotlight.',
          'Stand still in a busy street for two minutes and count who looks at you. Almost nobody. We massively overestimate how much strangers notice us: once you have SEEN it, half the fear is gone.')
y = trick(d, y, 2, 'Go quiet and small.',
          'Silent shutter, sounds off, autofocus lamp off, wrist strap instead of neck strap. A small camera in a hand reads as nothing at all. Your phone works too: nobody has ever been surprised by a phone.')
y = trick(d, y, 3, 'Shoot the scene, not the face.',
          'A figure crossing a sunlit intersection, a silhouette under a sign, a back under an umbrella. You are visibly photographing the place, and everyone reads it that way. Wide frames feel honest, and they are often the stronger photos anyway.')
footer(d, 1)
pages.append(im)

# ---------- TRICKS 4-5 + UPSELL ----------
im, d = new_page()
y = wrap(d, MX, 170, 'The two that change everything.', FI(92), GREEN, W - 2 * MX, 108) + 50
y = trick(d, y, 4, 'Let the photo come to you.',
          'Find light or a backdrop you love, compose the full frame, then stay: a bench, a cafe window, a wall. When someone walks into your frame, press. They enter YOUR photo; you never point at anyone.')
y = trick(d, y, 5, 'The half-second rule.',
          'Raise, frame, press, keep walking, all in half a second. Hesitation is what gets you noticed, not the camera. Set focus to 2.5 meters at f/8 beforehand and the camera is always ready.')
y += 30
d.rounded_rectangle([MX, y, W - MX, y + 420], radius=16, fill=(232, 226, 212))
y2 = wrap(d, MX + 50, y + 50, 'Want the full method?', FI(64), GREEN, W - 2 * MX - 100, 76) + 16
y2 = wrap(d, MX + 50, y2, 'Shy With A Camera is the complete 12-page guide: the exact settings, ten techniques, the script if someone notices, my ethical lines, and a 30-day plan that starts embarrassingly easy.',
          F(32), INK, W - 2 * MX - 100, 46) + 20
d.text((MX + 50, y2), 'shop.thegirlwithacamera.com/l/shy', font=F(34, 1), fill=TERRA)
footer(d, 2)
pages.append(im)

# ---------- OUTRO ----------
im, d = new_page()
photo_band(im, 'public/presets101/travel-after.jpg', 150, 1400)
y = 1480
y = wrap(d, MX, y, 'See you out there. Quietly.', FI(92), GREEN, W - 2 * MX, 108) + 32
y = wrap(d, MX, y, 'Tag me on your first shy street photo, I answer everything. The looks in this guide come from my presets, also in the shop.',
         F(33), INK, W - 2 * MX, 48) + 40
d.text((MX, y), 'shop.thegirlwithacamera.com', font=F(36, 1), fill=TERRA); y += 60
d.text((MX, y), 'Instagram @sandrinecppns · www.thegirlwithacamera.com', font=F(30), fill=STONE)
footer(d, 3)
pages.append(im)

pages[0].save(os.path.join(OUT, 'TGWAC-Five-Shy-Street-Tricks.pdf'),
              save_all=True, append_images=pages[1:], resolution=200)
print('mini-guide ok,', len(pages), 'pages')
