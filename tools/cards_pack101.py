# Cartes "facon Pokemon" du Pack 101 : cadre vert arrondi, bandeau nom,
# fenetre d'illustration, ligne Pokedex, deux attaques, pied avec rarete.
# Produit : /tmp/cards2/card-*.png (880x1240), public/store/street.jpg,
# et le composite public/store/pack-101-contents.jpg (sachet + eventail).
import numpy as np
import os
from PIL import Image, ImageDraw, ImageFont, ImageFilter

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = '/tmp/cards2'
os.makedirs(OUT, exist_ok=True)

CREAM = (244, 239, 228)
GREEN = (29, 58, 47)
GREEN_SOFT = (56, 92, 76)
TERRA = (199, 91, 57)
STONE = (120, 114, 100)
INK = (24, 24, 22)
GOLDLINE = (205, 198, 182)

HELV = '/System/Library/Fonts/Helvetica.ttc'
GEO = '/System/Library/Fonts/Supplemental/Georgia Italic.ttf'
F = lambda s, i=0: ImageFont.truetype(HELV, s, index=i)
FG = lambda s: ImageFont.truetype(GEO, s)

CW, CH = 880, 1240
R = 44  # rayon des coins

def rounded_mask(w, h, r):
    m = Image.new('L', (w, h), 0)
    ImageDraw.Draw(m).rounded_rectangle([0, 0, w-1, h-1], radius=r, fill=255)
    return m

def wrap(d, x, y, text, font, fill, maxw, lh):
    words = text.split(' ')
    line = ''
    for w_ in words:
        t = (line + ' ' + w_).strip()
        if d.textlength(t, font=font) > maxw and line:
            d.text((x, y), line, font=font, fill=fill); y += lh; line = w_
        else:
            line = t
    if line:
        d.text((x, y), line, font=font, fill=fill); y += lh
    return y

def diamond(d, cx, cy, r1, fill):
    r2 = r1 * 0.4
    d.polygon([(cx, cy-r1), (cx+r2, cy-r2), (cx+r1, cy), (cx+r2, cy+r2),
               (cx, cy+r1), (cx-r2, cy+r2), (cx-r1, cy), (cx-r2, cy-r2)], fill=fill)

def texture_border(card):
    # leger grain raye dans le cadre vert, facon holo discret
    a = np.array(card).astype(float)
    h, w = a.shape[:2]
    yy, xx = np.mgrid[0:h, 0:w]
    tex = 5 * np.sin((xx + yy) / 7.0)
    mask = np.zeros((h, w), bool)
    B = 36
    mask[:B+18, :] = True; mask[-(B+18):, :] = True
    mask[:, :B+18] = True; mask[:, -(B+18):] = True
    a[mask] = np.clip(a[mask] + tex[mask][:, None], 0, 255)
    return Image.fromarray(a.astype(np.uint8))

def make_card(img_path, name, flavor, atk1, atk2, num, price):
    card = Image.new('RGB', (CW, CH), GREEN)
    d = ImageDraw.Draw(card)
    # interieur creme
    d.rounded_rectangle([36, 36, CW-37, CH-37], radius=24, fill=CREAM)
    # bandeau nom
    d.text((64, 78), name, font=F(64, 1), fill=INK)
    # pastille prix facon PV
    if price:
        d.text((CW-136, 104), price, font=F(48, 1), fill=TERRA, anchor='rm')
    diamond(d, CW-90, 104, 26, TERRA)
    # fenetre d'illustration
    ix, iy, iw, ih = 76, 170, CW-152, 560
    im = Image.open(img_path).convert('RGB')
    r_ = im.width / im.height
    if r_ > iw / ih:
        nw = int(im.height * iw / ih); im = im.crop(((im.width-nw)//2, 0, (im.width+nw)//2, im.height))
    else:
        nh = int(im.width * ih / iw); im = im.crop((0, (im.height-nh)//2, im.width, (im.height-nh)//2+nh))
    card.paste(im.resize((iw, ih)), (ix, iy))
    d.rectangle([ix-6, iy-6, ix+iw+6, iy+ih+6], outline=GREEN, width=6)
    # ligne pokedex
    d.rounded_rectangle([76, iy+ih+26, CW-76, iy+ih+78], radius=10, fill=(233, 226, 211))
    d.text((CW//2, iy+ih+52), flavor, font=FG(30), fill=GREEN_SOFT, anchor='mm')
    # attaques
    y = iy + ih + 118
    for title, desc in (atk1, atk2):
        diamond(d, 100, y+22, 18, GREEN)
        d.text((136, y), title, font=F(40, 1), fill=INK)
        y = wrap(d, 136, y+52, desc, F(28), STONE, CW-220, 38) + 26
        d.line([76, y-8, CW-76, y-8], fill=GOLDLINE, width=2)
    # pied
    d.text((76, CH-104), num, font=F(30, 1), fill=TERRA)
    diamond(d, CW//2, CH-90, 14, TERRA)
    d.text((CW-76, CH-104), 'TGWAC · PACK 101', font=F(24, 1), fill=STONE, anchor='ra')
    card = texture_border(card)
    # coins arrondis
    out = Image.new('RGBA', (CW, CH), (0, 0, 0, 0))
    out.paste(card, (0, 0))
    out.putalpha(rounded_mask(CW, CH, R))
    return out

def make_bonus():
    card = Image.new('RGB', (CW, CH), TERRA)
    d = ImageDraw.Draw(card)
    d.rounded_rectangle([36, 36, CW-37, CH-37], radius=24, outline=CREAM, width=4)
    d.text((CW//2, 150), 'ALSO INSIDE', font=F(40, 1), fill=(255, 225, 210), anchor='mm')
    y = 300
    for title, sub in (('The Guide', '4-PAGE PDF · EN + FR'),
                       ('Mobile DNG', 'FREE LIGHTROOM APP · NO SUB'),
                       ('License', 'PERSONAL USE')):
        d.text((CW//2, y), title, font=FG(96), fill=CREAM, anchor='mm')
        d.text((CW//2, y+78), sub, font=F(30, 1), fill=(255, 225, 210), anchor='mm')
        if title != 'License':
            d.line([150, y+150, CW-150, y+150], fill=(255, 225, 210), width=2)
        y += 240
    d.text((76, CH-104), '05/05', font=F(30, 1), fill=CREAM)
    d.text((CW-76, CH-104), 'TGWAC · PACK 101', font=F(24, 1), fill=(255, 225, 210), anchor='ra')
    out = Image.new('RGBA', (CW, CH), (0, 0, 0, 0))
    out.paste(card, (0, 0))
    out.putalpha(rounded_mask(CW, CH, R))
    return out

P = lambda n: os.path.join(ROOT, f'public/presets101/{n}-after.jpg')
CARDS = [
    make_card(P('street'), 'Street', 'Base preset. Born from an in-camera recipe, Tokyo tested.',
              ('Clean Highlights', 'Whites stay honest in any light, skies keep their detail.'),
              ('Aqua Boost', 'Waters and skies turn rich teal, greens calm down.'),
              '01/05', '15 €'),
    make_card(P('travel'), 'Travel', 'Golden light type. Evolves any trip into a postcard.',
              ('Golden Hour', 'Warms places and skin softly, never burns.'),
              ('Soft Shadows', 'Opens the dark parts, keeps the mood intact.'),
              '02/05', ''),
    make_card(P('market'), 'Market', 'Bold color type. Thrives in busy, colorful places.',
              ('Color Pop', 'Saturated colors that stay honest, grays stay gray.'),
              ('Crisp Light', 'A cool clean bite for crowded scenes.'),
              '03/05', ''),
    make_card(P('neon'), 'Neon', 'Night type. Only comes out after dark.',
              ('Night Glow', 'Signs bloom and glow, blacks stay deep.'),
              ('Warm Neon', 'The city after dark, done warm, never blue.'),
              '04/05', ''),
    make_bonus(),
]
for i, c in enumerate(CARDS):
    c.save(f'{OUT}/card{i}.png')
print('5 cartes ok')

# carte Street du store, sur blanc pur
W, H = 1200, 1500
canvas = Image.new('RGB', (W, H), (255, 255, 255))
ch2 = 1300; cw2 = int(CW * ch2 / CH)
street = CARDS[0].resize((cw2, ch2))
canvas.paste(street, ((W - cw2) // 2, (H - ch2) // 2), street)
canvas.save(os.path.join(ROOT, 'public/store/street.jpg'), quality=92)
print('store street ok')

# composite What you get : sachet + eventail
W2, H2 = 1600, 2000
PAPER = (235, 229, 215)
bg = Image.new('RGB', (W2, H2), PAPER)
arr = np.array(bg).astype(float)
rng = np.random.default_rng(5)
arr += rng.normal(0, 2, (H2, W2, 1))
arr -= np.linspace(0, 1, H2)[:, None, None] * 10
bg = Image.fromarray(np.clip(arr, 0, 255).astype('uint8')).convert('RGBA')
d = ImageDraw.Draw(bg)
d.text((80, 90), 'WHAT YOU GET', font=F(44, 1), fill=GREEN)
d.rectangle([80, 160, 300, 168], fill=TERRA)

def paste_rot(base, im, center, angle):
    im = im.convert('RGBA')
    rot = im.rotate(angle, expand=True, resample=Image.BICUBIC)
    alpha = rot.split()[3].point(lambda v: int(v * 0.45))
    shadow = Image.new('RGBA', rot.size, (20, 15, 10, 255)); shadow.putalpha(alpha)
    shadow = shadow.filter(ImageFilter.GaussianBlur(14))
    base.alpha_composite(shadow, (center[0]-rot.width//2+12, center[1]-rot.height//2+18))
    base.alpha_composite(rot, (center[0]-rot.width//2, center[1]-rot.height//2))

pack = Image.open(os.path.join(ROOT, 'public/store/pack-101.jpg')).convert('RGBA')
crop = pack.crop((int(0.16*pack.width), int(0.03*pack.height), int(0.84*pack.width), int(0.97*pack.height)))
pw = 620; ph = int(pw * crop.height / crop.width)
paste_rot(bg, crop.resize((pw, ph)), (W2//2, 580), 4)

positions = [(300, 1500, -12), (545, 1445, -6), (800, 1425, 0), (1055, 1445, 6), (1300, 1500, 12)]
for (x, y, ang), i in zip(positions, range(5)):
    cc = CARDS[i].resize((int(CW*0.42), int(CH*0.42)))
    paste_rot(bg, cc, (x, y), ang)
bg.convert('RGB').save(os.path.join(ROOT, 'public/store/pack-101-contents.jpg'), quality=90)
print('composite ok')
