"""
Édition des visuels abstraits LCPI (sources fournies par l'utilisateur) :
recadrage, calibrage vers la charte cyan/noir IntrepidCore, compression web.
"""
from PIL import Image, ImageEnhance, ImageOps
import numpy as np

SRC = "D:/ANNEXE/intrepidcore-web/public/illustrations/lcpi"
CYAN = np.array([0, 196, 212], dtype=np.float32)

def grade(im, cyan_push=0.14, contrast=1.08, saturation=1.05):
    """Pousse doucement les tons vers le cyan de marque + contraste."""
    im = im.convert("RGB")
    arr = np.asarray(im).astype(np.float32)
    # Mélange additif discret vers le cyan sur les tons clairs (highlights)
    lum = arr.mean(axis=2, keepdims=True) / 255.0
    weight = (lum ** 1.5) * cyan_push
    arr = arr * (1 - weight) + CYAN * weight
    arr = np.clip(arr, 0, 255).astype(np.uint8)
    im = Image.fromarray(arr)
    im = ImageEnhance.Contrast(im).enhance(contrast)
    im = ImageEnhance.Color(im).enhance(saturation)
    return im

def finish(im, max_w, out, quality=88):
    if im.width > max_w:
        h = int(im.height * max_w / im.width)
        im = im.resize((max_w, h), Image.LANCZOS)
    im.convert("RGB").save(f"{SRC}/{out}", "JPEG", quality=quality, optimize=True)
    print(out, im.size)

# 1) Stochastique — réseau de particules (chaos exploré)
im = Image.open(f"{SRC}/stochastic-abstract.png")
im = grade(im, cyan_push=0.16, contrast=1.1, saturation=1.0)
finish(im, 1800, "lcpi_abstract_stochastique_01.jpg")

# 2) Stochastique — variante tourbillon
im = Image.open(f"{SRC}/stochastic-abstract_2.png")
im = grade(im, cyan_push=0.16, contrast=1.1, saturation=1.0)
finish(im, 1800, "lcpi_abstract_stochastique_02.jpg")

# 3) Déterministe — grille de verre ordonnée
im = Image.open(f"{SRC}/determinist-abstract.png")
im = grade(im, cyan_push=0.10, contrast=1.05, saturation=1.02)
finish(im, 1800, "lcpi_abstract_deterministe_01.jpg")

# 4) Chaos -> Ordre — transition (Dossier Double)
im = Image.open(f"{SRC}/img.png")
im = grade(im, cyan_push=0.12, contrast=1.06, saturation=1.0)
finish(im, 2200, "lcpi_abstract_chaos_ordre.jpg")

# 5) Scellement — noyau cristallisé (Ed25519)
im = Image.open(f"{SRC}/img4.png")
im = grade(im, cyan_push=0.08, contrast=1.08, saturation=1.03)
finish(im, 2000, "lcpi_abstract_scellement.jpg")

print("ok")
