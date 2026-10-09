# Guide "Shy With A Camera" : street photo pour les timides.
# Meme systeme visuel que le guide du Pack 101 (creme, serif vert, terra).
# Produit /tmp/shy_product/TGWAC Shy With A Camera/Shy With A Camera.pdf
# + les pages en JPG dans /tmp/shy_product/preview pour relecture.
import os
from PIL import Image, ImageDraw, ImageFont

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = '/tmp/shy_product'
PREV = f'{OUT}/preview'
PKG = f'{OUT}/TGWAC Shy With A Camera'
os.makedirs(PREV, exist_ok=True)
os.makedirs(PKG, exist_ok=True)

W, H = 1654, 2339  # A4 a 200 dpi
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

MX = 150  # marge
pages = []

def new_page():
    im = Image.new('RGB', (W, H), CREAM)
    return im, ImageDraw.Draw(im)

def footer(d, num):
    d.line([MX, H - 170, W - MX, H - 170], fill=LINE, width=2)
    d.text((MX, H - 140), 'THE GIRL WITH A CAMERA · SHY WITH A CAMERA', font=F(26, 1), fill=STONE)
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

def head(d, y, title):
    return wrap(d, MX, y, title, FI(92), GREEN, W - 2 * MX, 108) + 40

def bullets(d, y, items, maxw=None):
    maxw = maxw or (W - 2 * MX - 80)
    for it in items:
        d.rectangle([MX, y + 14, MX + 24, y + 38], fill=TERRA)
        y = wrap(d, MX + 56, y, it, F(34), INK, maxw, 48) + 34
    return y

def numbered(d, y, items):
    for i, it in enumerate(items, 1):
        d.ellipse([MX, y - 2, MX + 56, y + 54], outline=GREEN, width=3)
        d.text((MX + 28, y + 26), str(i), font=F(32, 1), fill=GREEN, anchor='mm')
        y = wrap(d, MX + 92, y, it, F(34), INK, W - 2 * MX - 92, 48) + 40
    return y

def photo_band(im, path, y0, y1, dark=0.0):
    ph = Image.open(os.path.join(ROOT, path)).convert('RGB')
    bw, bh = W - 2 * MX, y1 - y0
    r, tr = ph.width / ph.height, bw / bh
    if r > tr:
        nw = int(ph.height * tr); ph = ph.crop(((ph.width - nw) // 2, 0, (ph.width + nw) // 2, ph.height))
    else:
        nh = int(ph.width / tr); top = (ph.height - nh) // 3
        ph = ph.crop((0, top, ph.width, top + nh))
    ph = ph.resize((bw, bh))
    if dark:
        ph = Image.eval(ph, lambda v: int(v * (1 - dark)))
    im.paste(ph, (MX, y0))

# ---------- COUVERTURE ----------
im, d = new_page()
photo_band(im, 'public/presets101/street-after.jpg', 150, 1430)
d.text((MX, 1510), 'THE GIRL WITH A CAMERA', font=F(34, 1), fill=TERRA)
y = wrap(d, MX, 1570, 'Shy With', FI(170), GREEN, W - 2 * MX, 180)
y = wrap(d, MX, y - 30, 'A Camera', FI(170), GREEN, W - 2 * MX, 180)
wrap(d, MX, y + 20, 'Street photography for shy people. How I photograph strangers without talking to anyone, and how you can too.',
     FS(44), STONE, W - 2 * MX - 100, 62)
d.line([MX, H - 240, W - MX, H - 240], fill=LINE, width=2)
d.text((MX, H - 200), 'BY SANDRINE CEUPPENS · @SANDRINECPPNS', font=F(26, 1), fill=STONE)
d.text((W - MX, H - 200), 'TOKYO · BRUSSELS · 2026', font=F(26, 1), fill=STONE, anchor='ra')
pages.append(im)

# ---------- 1. INTRO ----------
im, d = new_page()
y = head(d, 170, "I am shy too. That is the point.")
y = wrap(d, MX, y, 'I did not start street photography because I am brave. I started because a camera gave me a reason to be outside, alone, without having to explain myself. Ten years of being the person who looks at the floor in the metro, and somehow my favorite thing today is photographing strangers in Tokyo.', F(34), INK, W - 2 * MX, 50) + 30
y = wrap(d, MX, y, 'This guide is everything I wish someone had told me: not "just be confident", but the actual techniques, settings and little social scripts that let a shy person shoot in the street comfortably. Nothing here requires talking to anyone. The last chapter is a 30-day plan that starts embarrassingly easy on purpose.', F(34), INK, W - 2 * MX, 50) + 50
d.rounded_rectangle([MX, y, W - MX, y + 230], radius=16, fill=(232, 226, 212))
wrap(d, MX + 50, y + 45, 'One rule before we start: shyness is not a flaw to fix. Quiet people see more. We notice light, gestures, the in-between moments. This guide does not make you louder. It makes your camera quieter.', FI(38), GREEN, W - 2 * MX - 100, 54)
footer(d, 1)
pages.append(im)

# ---------- 2. MINDSET ----------
im, d = new_page()
y = head(d, 170, 'Nobody is looking at you.')
y = wrap(d, MX, y, 'The spotlight effect is a documented bias: we massively overestimate how much strangers notice us. Test it: stand still in a busy street for two minutes and count who actually looks at you. The answer is almost nobody. Everyone is busy being the main character of their own day.', F(34), INK, W - 2 * MX, 50) + 36
y = bullets(d, y, [
    'You are allowed to be there. Standing in a public street with a camera is as normal as standing there with a coffee.',
    'In most countries, photographing people in public spaces is legal. Publishing is where rules differ: check your country, and when in doubt, favor scenes over faces.',
    'The worst realistic case is someone frowning. In years of shooting I have been asked to delete a photo twice. I said "of course", deleted it, smiled. End of story.',
    'A shy person with a plan beats a confident person without one. This guide is the plan.',
])
footer(d, 2)
pages.append(im)

# ---------- 3. GEAR ----------
im, d = new_page()
y = head(d, 170, 'Small camera, quiet shutter.')
y = wrap(d, MX, y, 'Big cameras make you look like a professional on assignment, and that attracts attention. I shoot a Ricoh GR III: it fits in a jacket pocket, it is completely silent, and people read it as a tourist gadget, not a lens pointed at them. You do not need this exact camera. You need these properties:', F(34), INK, W - 2 * MX, 50) + 36
y = bullets(d, y, [
    'Pocketable. If the camera disappears in your hand, you disappear with it.',
    'Silent shutter. Sound is what turns heads, not the camera itself.',
    'A fixed wide lens, 28 or 35mm. It forces you close to the scene but reads as "snapshot", never as "surveillance". Zooms are what feel creepy, to you and to them.',
    'Your phone counts. Nobody has ever been surprised by a person holding a phone. It is the most invisible camera ever made.',
])
y += 20
d.rounded_rectangle([MX, y, W - MX, y + 170], radius=16, fill=(232, 226, 212))
wrap(d, MX + 50, y + 42, 'Wrist strap, never neck strap. A camera around your neck says photographer. A camera in your hand says nothing at all.', FI(38), GREEN, W - 2 * MX - 100, 54)
footer(d, 3)
pages.append(im)

# ---------- 4. REGLAGES ----------
im, d = new_page()
y = head(d, 170, 'Settings that remove the pressure.')
y = wrap(d, MX, y, 'Hesitation is what gets you noticed. These settings mean the camera is always ready, so the shot takes half a second and you keep walking. Set them once at home, then stop thinking about them.', F(34), INK, W - 2 * MX, 50) + 36
y = numbered(d, y, [
    'Zone focus or snap focus. Set focus to 2.5 meters, f/8. Everything from 1.5 to 5 meters is sharp, no autofocus delay, no beep, no green box.',
    'Auto ISO, up to 6400. Grain is a style. A missed moment is nothing.',
    'Minimum shutter speed 1/250. People walk; you might be walking too.',
    'Burst of two or three frames per press. The second frame is often the one where the gesture lands.',
    'Screen brightness low, all sounds off, autofocus assist lamp OFF. The little orange lamp is the single most attention-grabbing thing on a camera.',
    'Program mode is fine. Street photography is not a camera exam. Rhythm matters more than aperture.',
])
footer(d, 4)
pages.append(im)

# ---------- 5. TECHNIQUES 1 ----------
im, d = new_page()
y = head(d, 170, 'Shoot the scene, not the face.')
photo_band(im, 'public/presets101/travel-after.jpg', y, y + 620)
y += 660
y = wrap(d, MX, y, 'The easiest street photos for a shy person are the ones where people are small inside a bigger story: a figure crossing a sunlit intersection, a silhouette under a sign, a market stall where the vendor is one element among crates and prices. You are visibly photographing the place. Any person in it is just a bonus, and everyone reads it that way, including you.', F(34), INK, W - 2 * MX, 50) + 30
y = bullets(d, y, [
    'Start wider than you think. Wide frames feel honest and calm.',
    'If a face would make you nervous, wait for a back, a profile, a shadow. They often make stronger photos anyway.',
])
footer(d, 5)
pages.append(im)

# ---------- 6. TECHNIQUES 2 ----------
im, d = new_page()
y = head(d, 170, 'Let the photo come to you.')
y = wrap(d, MX, y, 'Chasing subjects is stressful. Waiting is not. The technique photographers call "fishing" is made for shy people:', F(34), INK, W - 2 * MX, 50) + 36
y = numbered(d, y, [
    'Find light or a backdrop you love: a beam of sun between buildings, a red wall, a neon sign, a puddle.',
    'Compose the frame completely, as if the photo just needs one actor.',
    'Stay. Sit on a bench, lean on a wall, order a coffee by the window. You are a person resting, which is invisible.',
    'When someone walks into your frame, press. They enter YOUR photo; you never point at anyone.',
    'Give a spot ten minutes before moving on. The patience is the technique.',
])
y += 20
d.rounded_rectangle([MX, y, W - MX, y + 230], radius=16, fill=(232, 226, 212))
wrap(d, MX + 50, y + 45, 'Benches, cafe windows, museum steps, train platforms: the shy photographer’s studios. You are not hiding. You are early, and the scene is late.', FI(38), GREEN, W - 2 * MX - 100, 54)
footer(d, 6)
pages.append(im)

# ---------- 7. TECHNIQUES 3 ----------
im, d = new_page()
y = head(d, 170, 'Places where cameras are expected.')
photo_band(im, 'public/presets101/market-after.jpg', y, y + 620)
y += 660
y = wrap(d, MX, y, 'Context does half the work. In some places a camera is so normal that nobody registers it. Train yourself there first:', F(34), INK, W - 2 * MX, 50) + 30
y = bullets(d, y, [
    'Markets. Everyone photographs vegetables. Vendors are busy, tourists shoot everything, you blend in completely.',
    'Festivals, parades, matches, station halls: events give everyone a reason to point a camera.',
    'Touristic spots. Be the tourist. Photograph the landmark, and the real photo is the people in front of it.',
    'Rain and night. Umbrellas and darkness make everyone anonymous, including you. Neon does the rest.',
])
footer(d, 7)
pages.append(im)

# ---------- 8. SI QUELQU'UN REMARQUE ----------
im, d = new_page()
y = head(d, 170, 'If someone notices: the script.')
y = wrap(d, MX, y, 'This is the part that actually scares us, so let us rehearse it like a fire drill. It will almost never happen, and when it does, it goes like this:', F(34), INK, W - 2 * MX, 50) + 36
y = numbered(d, y, [
    'They look at you. You smile, nod, lower the camera. In ninety percent of cases this is the whole interaction. A smile says "I am harmless and a little embarrassed", which is exactly true.',
    'They look annoyed. You say the one sentence you memorized: "Sorry, I was photographing the light here. Want me to delete it?" Learn it in the local language. In Japanese: "Sumimasen, keshimasu ne" while showing the delete screen.',
    'They say delete it. You delete it, visibly, no debate, and thank them. Their face, their call. You lose one frame and keep your whole evening.',
    'Never explain street photography, never show your Instagram, never argue about your rights. Shy people overthink conflicts that one sentence would have ended.',
])
y += 20
d.rounded_rectangle([MX, y, W - MX, y + 170], radius=16, fill=(232, 226, 212))
wrap(d, MX + 50, y + 42, 'Rehearse the sentence out loud once, at home, today. A script you have said before is ten times easier to say again.', FI(38), GREEN, W - 2 * MX - 100, 54)
footer(d, 8)
pages.append(im)

# ---------- 9. ETHIQUE ----------
im, d = new_page()
y = head(d, 170, 'Quiet does not mean sneaky.')
y = wrap(d, MX, y, 'Being discreet is a style. Being predatory is a choice, and it is the thing that makes people distrust all street photographers. My own lines, and I suggest you adopt them:', F(34), INK, W - 2 * MX, 50) + 36
y = bullets(d, y, [
    'No children as main subjects, ever, even when the scene is adorable.',
    'No people in vulnerable moments: sleeping rough, medical situations, arguments, grief. A photo that costs someone dignity is not worth a like.',
    'Inside shops, temples and homes, different rules apply. When a space has a doorway, the street rulebook stays outside it.',
    'Before posting a recognizable face, ask yourself one question: if this person found the photo, would they feel seen or exposed? Seen: post it. Exposed: it stays in the archive.',
    'Respect a no instantly, in photography and in posting. The goal is a practice you are proud of, so your shyness never has a real reason to be ashamed.',
])
footer(d, 9)
pages.append(im)

# ---------- 10. CHALLENGE ----------
im, d = new_page()
y = head(d, 170, 'The 30-day shy street plan.')
y = wrap(d, MX, y, 'Four weeks, fifteen minutes a day, difficulty rising so slowly you will barely notice. Do not skip ahead: the easy days build the calm you will need later.', F(34), INK, W - 2 * MX, 50) + 36
weeks = [
    ('WEEK 1 · PLACES, NO PEOPLE', 'Your street empty at dawn. Shadows, signs, textures, parked bikes. Learn your camera until settings are muscle memory. People allowed only as distant silhouettes.'),
    ('WEEK 2 · PEOPLE AS ELEMENTS', 'Wide scenes where people are small: crossings from above, markets, reflections in windows, backs and umbrellas. Practice the bench technique twice.'),
    ('WEEK 3 · CLOSER', 'One fishing session with a composed frame. Shoot inside a market. One photo where a person fills a third of the frame. Rehearse your script out loud.'),
    ('WEEK 4 · THE QUIET GRADUATION', 'A full golden-hour walk, thirty frames minimum. One night session with neon. Day 30: hold your camera visibly all day, and notice that nobody ever cared.'),
]
for title, txt in weeks:
    d.text((MX, y), title, font=F(32, 1), fill=TERRA)
    y = wrap(d, MX, y + 50, txt, F(34), INK, W - 2 * MX, 50) + 36
footer(d, 10)
pages.append(im)

# ---------- 11. EDIT + FR ----------
im, d = new_page()
y = head(d, 170, 'Edit like you meant it.')
y = wrap(d, MX, y, 'Confidence also comes after the walk. A consistent edit makes ten shy snapshots look like a series by a photographer with a vision, which is what you are becoming. Pick one look and keep it. If you want mine, my Street preset is the exact rendering from this guide’s photos, and Pack 101 adds Travel, Market and Neon. shop.thegirlwithacamera.com', F(34), INK, W - 2 * MX, 50) + 60
d.line([MX, y, W - MX, y], fill=LINE, width=2)
y += 50
y = wrap(d, MX, y, "En français, l'essentiel", FI(72), GREEN, W - 2 * MX, 86) + 30
y = bullets(d, y, [
    'Personne ne te regarde : le "spotlight effect" est un biais documenté. Teste-le deux minutes dans la rue.',
    'Petit appareil silencieux, dragonne au poignet, lampe AF éteinte, mise au point à 2,5 m et f/8 : tout est net, zéro hésitation.',
    'Photographie la scène, pas le visage : cadres larges, silhouettes, dos, reflets. Ou compose ton cadre et attends que quelqu’un y entre.',
    'Si on te remarque : sourire, et la phrase magique "Pardon, je photographiais la lumière. Je l’efface ?" Efface sans discuter si on te le demande.',
    'Éthique : pas d’enfants en sujet principal, pas de moments de vulnérabilité, un non s’applique tout de suite.',
    'Le plan 30 jours monte très doucement : semaine 1 sans personne, semaine 4 l’appareil visible toute la journée.',
])
footer(d, 11)
pages.append(im)

# ---------- 12. OUTRO ----------
im, d = new_page()
photo_band(im, 'public/presets101/neon-after.jpg', 150, 1300, dark=0.12)
y = 1380
y = wrap(d, MX, y, 'See you out there. Quietly.', FI(96), GREEN, W - 2 * MX, 112) + 36
y = wrap(d, MX, y, 'Send me your day-30 photo on Instagram. I answer everything, especially the shy ones.', F(34), INK, W - 2 * MX, 50) + 44
d.text((MX, y), 'shop.thegirlwithacamera.com', font=F(36, 1), fill=TERRA); y += 64
d.text((MX, y), 'Instagram @sandrinecppns · www.thegirlwithacamera.com', font=F(30), fill=STONE); y += 48
d.text((MX, y), 'Shot on Ricoh GR III & Pentax 17. Made in Brussels, tested from Lake Como to Tokyo.', font=F(28), fill=STONE); y += 70
d.text((MX, y), 'License: personal use. No resale, no redistribution, no sharing of this file. One purchase, one reader.', font=F(26), fill=STONE)
footer(d, 12)
pages.append(im)

# ---------- SORTIE ----------
for i, p in enumerate(pages):
    p.resize((827, 1169)).save(f'{PREV}/p{i:02d}.jpg', quality=80)
pages[0].save(f'{PKG}/Shy With A Camera.pdf', save_all=True, append_images=pages[1:], resolution=200)
print('pdf ok,', len(pages), 'pages')
