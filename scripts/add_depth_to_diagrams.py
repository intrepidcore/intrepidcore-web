"""
Ajoute de la profondeur aux 6 schémas techniques LCPI : halo lumineux doux
sous les éléments cyan (glow), sans flouter le trait ni le texte.
Fond transparent conservé.
"""
from PIL import Image, ImageFilter
import numpy as np

DIR = "D:/ANNEXE/intrepidcore-web/public/illustrations/lcpi"

FILES = [
    "lcpi_architecture_solveur_double.png",
    "lcpi_fractiles_p10_p50_p90.png",
    "lcpi_workflow_dossier_double.png",
    "lcpi_convergence_hardy_cross.png",
    "lcpi_pareto_nsga2.png",
    "lcpi_coupe_ec2_beton_arme.png",
]

CYAN = np.array([0, 196, 212], dtype=np.float32)
THRESH = 60  # tolérance couleur pour isoler les pixels cyan/blancs lumineux

def add_glow(path, blur_radius=14, glow_alpha=0.55, glow_scale=1.0):
    im = Image.open(path).convert("RGBA")
    arr = np.asarray(im).astype(np.float32)
    rgb, a = arr[..., :3], arr[..., 3]

    dist_cyan = np.linalg.norm(rgb - CYAN, axis=-1)
    is_cyan = (dist_cyan < THRESH) & (a > 10)
    # blanc pur (texte "vérifie", points p50) compte aussi un peu pour le glow
    dist_white = np.linalg.norm(rgb - np.array([245, 245, 245]), axis=-1)
    is_white = (dist_white < 20) & (a > 10)

    glow_mask = np.where(is_cyan, a, np.where(is_white, a * 0.5, 0)).astype(np.uint8)
    glow_rgba = np.zeros_like(arr, dtype=np.uint8)
    glow_rgba[..., 0] = CYAN[0]; glow_rgba[..., 1] = CYAN[1]; glow_rgba[..., 2] = CYAN[2]
    glow_rgba[..., 3] = glow_mask
    glow_im = Image.fromarray(glow_rgba, "RGBA")
    if glow_scale != 1.0:
        glow_im = glow_im.resize((int(im.width*glow_scale), int(im.height*glow_scale)), Image.LANCZOS)
        glow_im = glow_im.resize(im.size, Image.LANCZOS)
    glow_im = glow_im.filter(ImageFilter.GaussianBlur(blur_radius))
    # atténue le glow
    g = np.asarray(glow_im).astype(np.float32)
    g[..., 3] *= glow_alpha
    glow_im = Image.fromarray(np.clip(g, 0, 255).astype(np.uint8), "RGBA")

    out = Image.new("RGBA", im.size, (0, 0, 0, 0))
    out.alpha_composite(glow_im)
    out.alpha_composite(im)
    out.save(path)
    print("depth added:", path.split("/")[-1])

for f in FILES:
    add_glow(f"{DIR}/{f}")

print("ok")
