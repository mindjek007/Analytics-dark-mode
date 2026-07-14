from PIL import Image, ImageDraw, ImageFont
import os

d = r'C:\Users\Mindjek\Documents\Analytics dark mode\Screenshots'

img1 = Image.open(os.path.join(d, 'chrome_dJqzRjiqHb.jpg'))
img2 = Image.open(os.path.join(d, 'chrome_pXWKQ4GrMT.jpg'))

# ===== SMALL PROMO TILE: 440x280 =====
canvas = Image.new('RGB', (440, 280), (26, 26, 46))

# Left half
img1_s = img1.copy()
img1_s.thumbnail((220, 280), Image.LANCZOS)
x1 = (220 - img1_s.size[0]) // 2
canvas.paste(img1_s, (x1, 0))

# Right half
img2_s = img2.copy()
img2_s.thumbnail((220, 280), Image.LANCZOS)
x2 = 220 + (220 - img2_s.size[0]) // 2
canvas.paste(img2_s, (x2, 0))

# Gradient overlay at bottom
draw = ImageDraw.Draw(canvas, 'RGBA')
for y in range(200, 280):
    alpha = int(255 * (1 - (y - 200) / 80))
    draw.rectangle([0, y, 440, y], fill=(26, 26, 46, alpha))

# Text
try:
    font_l = ImageFont.truetype('arial.ttf', 18)
    font_s = ImageFont.truetype('arial.ttf', 11)
except:
    font_l = ImageFont.load_default()
    font_s = ImageFont.load_default()

draw = ImageDraw.Draw(canvas)
draw.text((220, 215), 'Analytics Dark Mode', fill=(200, 200, 255), font=font_l, anchor='mt')
draw.text((220, 242), '8 color schemes / Dark theme for GA4', fill=(150, 150, 200), font=font_s, anchor='mt')

out_small = os.path.join(d, 'promo-small-440x280.jpg')
canvas.save(out_small, 'JPEG', quality=95)
print(f'Small promo: {os.path.getsize(out_small)} bytes - 440x280')

# ===== MARQUEE PROMO TILE: 1400x560 =====
canvas2 = Image.new('RGB', (1400, 560), (26, 26, 46))

# Background from screenshot
bg = img1.copy()
bg.thumbnail((1400, 560), Image.LANCZOS)
cx = (1400 - bg.size[0]) // 2
cy = (560 - bg.size[1]) // 2
canvas2.paste(bg, (cx, cy))

# Darken
overlay = Image.new('RGB', (1400, 560), (0, 0, 0))
canvas2 = Image.blend(canvas2, overlay, 0.45)

# Left gradient
draw2 = ImageDraw.Draw(canvas2, 'RGBA')
for x in range(0, 750):
    alpha = int(220 * (1 - x / 750))
    draw2.rectangle([x, 0, x, 560], fill=(26, 26, 46, alpha))

# Text
try:
    ft = ImageFont.truetype('arial.ttf', 44)
    fs = ImageFont.truetype('arial.ttf', 22)
    fi = ImageFont.truetype('arial.ttf', 16)
    fb = ImageFont.truetype('arial.ttf', 17)
except:
    ft = ImageFont.load_default()
    fs = ImageFont.load_default()
    fi = ImageFont.load_default()
    fb = ImageFont.load_default()

draw2 = ImageDraw.Draw(canvas2)
draw2.text((60, 130), 'Analytics Dark Mode', fill=(200, 200, 255), font=ft)
draw2.text((60, 195), 'Dark theme for Google Analytics', fill=(180, 180, 220), font=fs)
draw2.text((60, 235), '8 beautiful color schemes to choose from', fill=(150, 150, 190), font=fi)

features = [
    '  Zero white flash on load',
    '  Works with SPA navigation',
    '  Map support for real-time view',
    '  No data collected',
]
for idx, feat in enumerate(features):
    draw2.text((60, 300 + idx * 32), feat, fill=(170, 210, 170), font=fb)

# Color swatches at bottom
colors = ['#8b8bf8', '#ffffff', '#d4a76a', '#88c0d0', '#8a8ae0', '#bd93f9', '#ffffff', '#ffb74d']
swatch_y = 480
swatch_h = 16
swatch_gap = 4
total_w = len(colors) * (24 + swatch_gap) - swatch_gap
start_x = (1400 - total_w) // 2
for idx, c in enumerate(colors):
    sx = start_x + idx * (24 + swatch_gap)
    draw2.rectangle([sx, swatch_y, sx + 24, swatch_y + swatch_h], fill=c)

out_marquee = os.path.join(d, 'promo-marquee-1400x560.jpg')
canvas2.save(out_marquee, 'JPEG', quality=95)
print(f'Marquee promo: {os.path.getsize(out_marquee)} bytes - 1400x560')
print('All promo tiles generated!')
