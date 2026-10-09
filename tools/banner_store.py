# Banniere de la page Store : les 4 photos presets en bandes verticales
# (Street, Travel, Market, Neon), legere vignette pour le titre overlay.
# Produit public/store/banner.jpg (2400x1000).
import numpy as np
import os
from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
W, H = 2400, 1000
GAP = 6
banner = Image.new('RGB', (W, H), (20, 20, 20))

names = ['street', 'travel', 'market', 'neon']
sw = (W - GAP * (len(names) - 1)) // len(names)
x = 0
for n in names:
    im = Image.open(os.path.join(ROOT, f'public/presets101/{n}-after.jpg')).convert('RGB')
    tr = sw / H
    r = im.width / im.height
    if r > tr:
        nw = int(im.height * tr)
        im = im.crop(((im.width - nw) // 2, 0, (im.width + nw) // 2, im.height))
    else:
        nh = int(im.width / tr)
        top = (im.height - nh) // 3
        im = im.crop((0, top, im.width, top + nh))
    banner.paste(im.resize((sw, H)), (x, 0))
    x += sw + GAP

# assombrissement doux au centre pour la lisibilite du titre
a = np.array(banner).astype(float)
yy, xx = np.mgrid[0:H, 0:W]
d = np.sqrt(((xx - W / 2) / (W / 2)) ** 2 + ((yy - H / 2) / (H / 2)) ** 2)
a *= (1 - 0.22 * np.exp(-d ** 2 / 0.5))[..., None]
Image.fromarray(np.clip(a, 0, 255).astype(np.uint8)).save(
    os.path.join(ROOT, 'public/store/banner.jpg'), quality=90)
print('banner ok')
