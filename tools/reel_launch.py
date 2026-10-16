# Kit de lancement Instagram : reel 9:16 pour le feed + 3 stories.
# Reel : wipe avant/apres sur les 4 presets, packshot, carte CTA
# "Comment PACK". Sans audio : Sandrine ajoute un son tendance dans l'app.
# Sortie : /tmp/launch_kit/ (reel-pack101.mp4, story-1/2/3.png, caption.txt)
import os, subprocess, shutil
import numpy as np
from PIL import Image, ImageDraw, ImageFont, ImageFilter

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = '/tmp/launch_kit'
FRAMES = f'{OUT}/frames'
shutil.rmtree(FRAMES, ignore_errors=True)
os.makedirs(FRAMES, exist_ok=True)

W, H = 1080, 1920
FPS = 30
CREAM = (240, 236, 228)
GREEN = (29, 58, 47)
TERRA = (199, 91, 57)
INK = (24, 24, 22)
STONE = (120, 114, 100)

HELV = '/System/Library/Fonts/Helvetica.ttc'
GEOI = '/System/Library/Fonts/Supplemental/Georgia Italic.ttf'
F = lambda s, i=0: ImageFont.truetype(HELV, s, index=i)
FI = lambda s: ImageFont.truetype(GEOI, s)

def fill_crop(path, w=W, h=H):
    im = Image.open(path).convert('RGB')
    r, tr = im.width / im.height, w / h
    if r > tr:
        nw = int(im.height * tr); im = im.crop(((im.width - nw) // 2, 0, (im.width + nw) // 2, im.height))
    else:
        nh = int(im.width / tr); top = (im.height - nh) // 3
        im = im.crop((0, top, im.width, top + nh))
    return np.array(im.resize((w, h))).astype(np.uint8)

def ease(t):
    return 3 * t * t - 2 * t * t * t

def chip(d, x, y, text, dark):
    f = F(34, 1)
    tw = d.textlength(text, font=f)
    pad = 18
    if dark:
        d.rectangle([x, y, x + tw + 2 * pad, y + 62], fill=(20, 20, 18))
        d.text((x + pad, y + 13), text, font=f, fill=(244, 239, 228))
    else:
        d.rectangle([x, y, x + tw + 2 * pad, y + 62], fill=(244, 239, 228))
        d.text((x + pad, y + 13), text, font=f, fill=(24, 24, 22))

frames = []  # liste de np.array

PRESETS = [
    ('street', 'Street', 'STREET & EVERYDAY'),
    ('travel', 'Travel', 'TRAVEL & GOLDEN LIGHT'),
    ('market', 'Market', 'BOLD COLOR'),
    ('neon', 'Neon', 'URBAN NIGHT'),
]

for key, name, usage in PRESETS:
    before = fill_crop(f'{ROOT}/public/presets101/{key}-before.jpg')
    after = fill_crop(f'{ROOT}/public/presets101/{key}-after.jpg')
    hold_a, wipe_n, hold_b = 14, 32, 22  # 0.47s / 1.07s / 0.73s
    total = hold_a + wipe_n + hold_b
    for i in range(total):
        if i < hold_a:
            pos = 0.0
        elif i < hold_a + wipe_n:
            pos = ease((i - hold_a) / wipe_n)
        else:
            pos = 1.0
        x = int(pos * W)
        fr = before.copy()
        if x > 0:
            fr[:, :x] = after[:, :x]
        im = Image.fromarray(fr)
        d = ImageDraw.Draw(im)
        if 0 < x < W:
            d.rectangle([x - 2, 0, x + 2, H], fill=(255, 255, 255))
        # pastilles : preset a gauche de la ligne, raw a droite
        chip(d, 36, H - 320, name.upper(), dark=True)
        chip(d, W - 36 - int(d.textlength('RAW', font=F(34, 1))) - 36, H - 320, 'RAW', dark=False)
        # fin de segment : nom en grand
        if i >= hold_a + wipe_n:
            k = (i - hold_a - wipe_n) / hold_b
            a = min(1.0, k * 3)
            ov = Image.new('RGBA', (W, H), (0, 0, 0, 0))
            do = ImageDraw.Draw(ov)
            do.text((W // 2 + 4, 304), name, font=FI(170), fill=(10, 20, 16, int(200 * a)), anchor='mm')
            do.text((W // 2, 300), name, font=FI(170), fill=(244, 239, 228, int(255 * a)), anchor='mm')
            do.text((W // 2, 420), usage, font=F(36, 1), fill=(244, 239, 228, int(235 * a)), anchor='mm')
            im = Image.alpha_composite(im.convert('RGBA'), ov).convert('RGB')
        frames.append(np.array(im))

# --- packshot : zoom lent sur le sachet
pack = Image.open(f'{ROOT}/public/store/pack-101.jpg').convert('RGB')
for i in range(54):  # 1.8s
    t = i / 53
    z = 1.0 + 0.06 * ease(t)
    bg = Image.new('RGB', (W, H), CREAM)
    pw = int(880 * z)
    ph = int(pw * pack.height / pack.width)
    bg.paste(pack.resize((pw, ph)), ((W - pw) // 2, (H - ph) // 2 - 60))
    d = ImageDraw.Draw(bg)
    d.text((W // 2, H - 420), 'Pack 101', font=FI(110), fill=GREEN, anchor='mm')
    d.text((W // 2, H - 320), '4 FILM PRESETS · 39 €', font=F(40, 1), fill=TERRA, anchor='mm')
    d.text((W // 2, H - 250), 'STREET SOLO · 15 €', font=F(32, 1), fill=STONE, anchor='mm')
    frames.append(np.array(bg))

# --- carte finale CTA
for i in range(84):  # 2.8s
    t = min(1.0, i / 12)
    bg = Image.new('RGB', (W, H), CREAM)
    d = ImageDraw.Draw(bg)
    d.text((W // 2, 640), 'Comment', font=FI(150), fill=(GREEN if t == 1 else tuple(int(c * t + 240 * (1 - t)) for c in GREEN)), anchor='mm')
    d.text((W // 2, 810), 'PACK', font=F(230, 1), fill=TERRA, anchor='mm')
    d.text((W // 2, 1000), 'and I will send you the link', font=FI(64), fill=INK, anchor='mm')
    d.text((W // 2, 1180), 'STREET · TRAVEL · MARKET · NEON', font=F(36, 1), fill=STONE, anchor='mm')
    d.text((W // 2, 1250), 'DESKTOP & FREE MOBILE APP', font=F(30, 1), fill=STONE, anchor='mm')
    d.rectangle([W // 2 - 110, 1330, W // 2 + 110, 1338], fill=TERRA)
    d.text((W // 2, 1420), 'shop.thegirlwithacamera.com', font=F(40, 1), fill=GREEN, anchor='mm')
    frames.append(np.array(bg))

for i, fr in enumerate(frames):
    Image.fromarray(fr).save(f'{FRAMES}/f{i:05d}.jpg', quality=92)
print('frames:', len(frames), '=', round(len(frames) / FPS, 1), 's')

subprocess.run(['ffmpeg', '-y', '-framerate', str(FPS), '-i', f'{FRAMES}/f%05d.jpg',
                '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-crf', '18', '-movflags', '+faststart',
                f'{OUT}/reel-pack101.mp4'], check=True, capture_output=True)
print('reel ok')
shutil.rmtree(FRAMES, ignore_errors=True)

# ---------- STORIES (zone basse laissee libre pour le sticker lien) ----------
def story_base():
    im = Image.new('RGB', (W, H), CREAM)
    return im, ImageDraw.Draw(im)

# S1 : split avant/apres Street vertical
im, d = story_base()
before = fill_crop(f'{ROOT}/public/presets101/street-before.jpg', W, 1150)
after = fill_crop(f'{ROOT}/public/presets101/street-after.jpg', W, 1150)
split = np.concatenate([before[:, :W // 2], after[:, W // 2:]], axis=1)
im.paste(Image.fromarray(split), (0, 360))
d.rectangle([W // 2 - 2, 360, W // 2 + 2, 1510], fill=(255, 255, 255))
d.ellipse([W // 2 - 34, 905, W // 2 + 34, 973], fill=(244, 239, 228))
d.text((W // 2, 939), '< >', font=F(30, 1), fill=INK, anchor='mm')
d.text((W // 2, 160), 'MY PRESETS ARE LIVE', font=F(44, 1), fill=TERRA, anchor='mm')
d.text((W // 2, 260), 'My look, finally yours.', font=FI(72), fill=GREEN, anchor='mm')
chipd = ImageDraw.Draw(im)
chip(chipd, 36, 1400, 'RAW', dark=False)
chip(chipd, W - 220, 1400, 'STREET', dark=True)
d.text((W // 2, 1600), 'the link is right here', font=FI(54), fill=INK, anchor='mm')
d.text((W // 2, 1670), 'V', font=F(44, 1), fill=TERRA, anchor='mm')
im.save(f'{OUT}/story-1-slider.png')

# S2 : le sachet
im, d = story_base()
pack = Image.open(f'{ROOT}/public/store/pack-101.jpg').convert('RGB')
pw = 800; ph = int(pw * pack.height / pack.width)
im.paste(pack.resize((pw, ph)), ((W - pw) // 2, 330))
d.text((W // 2, 150), 'ONE PRESET PER SITUATION', font=F(40, 1), fill=TERRA, anchor='mm')
d.text((W // 2, 240), 'Pack 101 · 39 €', font=FI(80), fill=GREEN, anchor='mm')
d.text((W // 2, 1560), 'Street solo · 15 €', font=FI(54), fill=INK, anchor='mm')
d.text((W // 2, 1650), 'V', font=F(44, 1), fill=TERRA, anchor='mm')
im.save(f'{OUT}/story-2-pack.png')

# S3 : le guide Shy + mini-guide offert
im, d = story_base()
shy = Image.open(f'{ROOT}/public/store/shy.jpg').convert('RGB')
sw = 760; sh2 = int(sw * shy.height / shy.width)
im.paste(shy.resize((sw, sh2)), ((W - sw) // 2, 330))
d.text((W // 2, 150), 'SHY IN THE STREET? SAME.', font=F(40, 1), fill=TERRA, anchor='mm')
d.text((W // 2, 240), 'The guide is here · 19 €', font=FI(76), fill=GREEN, anchor='mm')
d.text((W // 2, 1560), 'Free mini guide on the site', font=FI(54), fill=INK, anchor='mm')
d.text((W // 2, 1650), 'V', font=F(44, 1), fill=TERRA, anchor='mm')
im.save(f'{OUT}/story-3-shy.png')
print('stories ok')

CAPTION = """LEGENDE DU REEL (feed principal) :

My look, finally as presets.

Four of them, one per situation: Street for the everyday, Travel for golden light, Market for bold color, Neon for the night. Built on my in-camera recipe, for Lightroom desktop and the FREE mobile app.

Comment PACK and I'll send you the link

#lightroompresets #presetpack #streetphotography #ricohgriii #filmlook #tokyophotography #travelphotography

---
MODE D'EMPLOI :
1. Poste le reel sur ton FEED (pas en trial) avec un son tendance ajoute dans l'app, volume bas.
2. Les 3 stories : ajoute le sticker LIEN (shop.thegirlwithacamera.com) dans la zone libre en bas, au-dessus du V.
3. Verifie que le lien de ta bio pointe vers shop.thegirlwithacamera.com.
ManyChat repond deja aux commentaires PACK / PRESET / RECIPE.
"""
open(f'{OUT}/caption.txt', 'w').write(CAPTION)
print('caption ok')
