"""
Refonte isométrique des schémas LCPI (architecture + workflow) — approche
immersive façon Palantir Ontology : plateformes empilées en perspective,
faisceaux de courbes de Bézier convergentes, un seul accent cyan.
Typographie conservée : sans-serif géométrique + annotations Virgil.
Les 3 graphiques de données (fractiles, convergence, Pareto) et la coupe EC2
NE sont PAS transformés en isométrique — ce sont des données réelles, pas des
schémas d'architecture ; ils gardent leur projection 2D fidèle.
"""
import math
import numpy as np
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
import matplotlib.font_manager as fm
from matplotlib.patches import Polygon, PathPatch, FancyBboxPatch, Circle
from matplotlib.path import Path

INK, INK_DIM = "#E5E5E5", "#8A8A8A"
CYAN, CYAN_DIM = "#00C4D4", "#0A4A50"
BG_PANE = "#111318"

FONT_PATH = "D:/ANNEXE/intrepid-core/docs/font/Virgil.ttf"
fm.fontManager.addfont(FONT_PATH)
VIRGIL = fm.FontProperties(fname=FONT_PATH).get_name()

plt.rcParams.update({
    "font.family": "DejaVu Sans", "font.size": 10,
    "axes.edgecolor": INK_DIM, "axes.grid": False,
    "figure.facecolor": "none", "axes.facecolor": "none", "savefig.facecolor": "none",
})

OUT = "D:/ANNEXE/intrepidcore-web/public/illustrations/lcpi"
A = math.radians(30)

def iso(x, y, z=0.0):
    sx = (x - y) * math.cos(A)
    sy = (x + y) * math.sin(A) - z
    return sx, sy

def platform(ax, cx, cy, z, w, d, face="#15171c", edge=INK_DIM, lw=0.8, thickness=0.35, hatch_edge=True):
    """Plateforme isométrique rectangulaire centrée sur (cx,cy) à hauteur z."""
    corners = [(cx-w/2, cy-d/2), (cx+w/2, cy-d/2), (cx+w/2, cy+d/2), (cx-w/2, cy+d/2)]
    top = [iso(x, y, z) for x, y in corners]
    ax.add_patch(Polygon(top, closed=True, facecolor=face, edgecolor=edge, linewidth=lw, zorder=z*10))
    if hatch_edge:
        # tranche hachurée (front-left + front-right) façon coupe technique
        bot = [iso(x, y, z - thickness) for x, y in corners]
        for i in (0, 1):
            j = (i + 1) % 4
            side = [top[i], top[j], bot[j], bot[i]]
            ax.add_patch(Polygon(side, closed=True, facecolor="#0a0b0d", edgecolor=edge,
                                  linewidth=lw*0.7, hatch="//////", alpha=0.9, zorder=z*10 - 1))
    return top

def iso_box(ax, cx, cy, z, w=0.85, d=0.85, h=0.5, edge=INK, face="none", lw=0.9):
    """Petit cube isométrique (nœud d'entrée/sortie) posé sur une plateforme."""
    c = [(cx-w/2, cy-d/2), (cx+w/2, cy-d/2), (cx+w/2, cy+d/2), (cx-w/2, cy+d/2)]
    top = [iso(x, y, z+h) for x, y in c]
    bot = [iso(x, y, z) for x, y in c]
    for i in range(4):
        j = (i+1) % 4
        ax.add_patch(Polygon([top[i], top[j], bot[j], bot[i]], closed=True,
                              facecolor=face, edgecolor=edge, linewidth=lw*0.7, zorder=z*10+1))
    ax.add_patch(Polygon(top, closed=True, facecolor=face, edgecolor=edge, linewidth=lw, zorder=z*10+2))
    return iso(cx, cy, z+h)

def bezier_bundle(ax, starts, end, color=CYAN, lw=0.6, alpha=0.55, curve=0.55, n_extra=0, seed=0):
    """Faisceau de courbes de Bézier convergeant vers un point (style Palantir)."""
    rng = np.random.default_rng(seed)
    pts_start = list(starts)
    if n_extra:
        bx, by = end
        for p in starts:
            for _ in range(n_extra):
                jitter = (rng.normal(0, 0.15), rng.normal(0, 0.15))
                pts_start.append((p[0]+jitter[0], p[1]+jitter[1]))
    for i, (sx, sy) in enumerate(pts_start):
        ex, ey = end
        mx1 = sx + (ex - sx) * 0.35 + rng.normal(0, 0.25)
        my1 = sy + (ey - sy) * curve
        mx2 = sx + (ex - sx) * 0.7 + rng.normal(0, 0.18)
        my2 = sy + (ey - sy) * (curve * 0.4)
        path = Path([(sx, sy), (mx1, my1), (mx2, my2), (ex, ey)],
                    [Path.MOVETO, Path.CURVE4, Path.CURVE4, Path.CURVE4])
        a = alpha * rng.uniform(0.55, 1.0)
        ax.add_patch(PathPatch(path, facecolor="none", edgecolor=color, linewidth=lw, alpha=a, zorder=50))

def label(ax, x, y, txt, size=9, color=INK, ha="center", va="center", font="sans", weight="normal"):
    fam = VIRGIL if font == "virgil" else "DejaVu Sans"
    ax.text(x, y, txt, fontsize=size, color=color, ha=ha, va=va, fontfamily=fam,
            fontweight=weight, zorder=1000)

def mono(ax, x, y, txt, size=8, color=INK_DIM, ha="center"):
    ax.text(x, y, txt, fontsize=size, color=color, ha=ha, va="center",
            fontfamily="DejaVu Sans Mono", zorder=1000)

# ============================================================
# ARCHITECTURE — Solveur Double, plateformes isométriques empilées
# ============================================================
fig, ax = plt.subplots(figsize=(10, 14), dpi=200)
ax.set_aspect("equal")
ax.axis("off")

Z0, Z1, Z2 = 0.0, 9.0, 18.0  # ENTRÉES, NOYAU, SORTIES — écart large pour éviter tout chevauchement

platform(ax, 0, 0, Z0, 9.5, 5.0, face="#121418")
platform(ax, -1.9, 0, Z1, 5.6, 3.2, face="#101319", edge=INK_DIM)
platform(ax, 2.2, 0, Z1, 3.8, 2.8, face="#0d1f21", edge=CYAN)
platform(ax, 0, 0, Z2, 7.6, 4.2, face="#121418")

entrees = [(-3.2, -1.3), (-1.0, -1.3), (1.2, -1.3), (3.2, -1.3)]
entree_labels = ["Réseau\nAEP", "Charges\nEC2", "Tirages\nMonte Carlo", "Contexte\nAtlas"]
entree_pts = []
for (ex, ey), name in zip(entrees, entree_labels):
    iso_box(ax, ex, ey, Z0, w=1.3, d=1.0, h=0.55, edge=INK)
    entree_pts.append((ex, ey))
    px, py = iso(ex, ey - 0.85, Z0)
    label(ax, px, py, name, size=8, color=INK)

bezier_bundle(ax, [iso(x, y, Z0 + 0.55) for x, y in entree_pts[:2]], iso(-1.9, 0.9, Z1 - 0.3),
              color=INK_DIM, lw=0.6, alpha=0.5, curve=0.4, seed=1)
bezier_bundle(ax, [iso(x, y, Z0 + 0.55) for x, y in entree_pts[2:]], iso(2.2, 0.9, Z1 - 0.3),
              color=CYAN_DIM, lw=0.6, alpha=0.5, curve=0.4, seed=2)

dcx, dcy = iso(-1.9, 0, Z1)
label(ax, dcx, dcy + 0.65, "NOYAU DÉTERMINISTE", size=9.5, color=INK, weight="bold")
label(ax, dcx, dcy + 0.28, "Hardy-Cross · Eurocode 2", size=8.5, color=INK)
label(ax, dcx, dcy - 0.12, "bit-exact", size=9, color=CYAN, font="virgil")

scx, scy = iso(2.2, 0, Z1)
label(ax, scx, scy + 0.65, "MOTEUR STOCHASTIQUE", size=9.5, color=CYAN, weight="bold")
label(ax, scx, scy + 0.28, "Ensembles Monte Carlo", size=8.5, color=INK)
label(ax, scx, scy - 0.12, "réduit · arbitre", size=9, color=CYAN, font="virgil")

bx1, by1 = iso(-0.3, -1.2, Z1 - 0.1)
bx2, by2 = iso(1.6, -1.2, Z1 - 0.1)
path = Path([(bx1, by1), ((bx1+bx2)/2, by1 - 0.45), (bx2, by2)],
            [Path.MOVETO, Path.CURVE3, Path.CURVE3])
ax.add_patch(PathPatch(path, facecolor="none", edgecolor=CYAN, linewidth=0.9,
                        linestyle=(0, (2, 2)), zorder=60))
label(ax, (bx1+bx2)/2, by1 - 0.7, "vérifie", size=9, color=CYAN, font="virgil")

sorties = [(-2.4, 0), (0, 0), (2.4, 0)]
sortie_labels = ["Export\nEPANET/DXF", "Dossier signé\nEd25519", "Rapport P95\nFascicule 71"]
for (sx, sy), name in zip(sorties, sortie_labels):
    iso_box(ax, sx, sy, Z2, w=1.5, d=1.1, h=0.5, edge=INK)
    px, py = iso(sx, sy - 0.95, Z2)
    label(ax, px, py, name, size=8, color=INK)

bezier_bundle(ax, [iso(-1.9, 0.9, Z1 + 0.3)], iso(-2.4, -0.8, Z2 - 0.3),
              color=INK_DIM, lw=0.7, alpha=0.55, curve=0.35, n_extra=1, seed=3)
bezier_bundle(ax, [iso(-1.9, -0.9, Z1 + 0.3), iso(2.2, -0.9, Z1 + 0.3)], iso(0, -0.8, Z2 - 0.3),
              color=CYAN, lw=0.8, alpha=0.6, curve=0.3, seed=4)
bezier_bundle(ax, [iso(2.2, 0.9, Z1 + 0.3)], iso(2.4, -0.8, Z2 - 0.3),
              color=CYAN, lw=0.7, alpha=0.6, curve=0.35, n_extra=1, seed=5)

lx, ly = iso(-4.6, -2.4, Z0 + 0.2)
mono(ax, lx, ly, "/ ENTRÉES", size=9, color=INK_DIM, ha="left")
lx, ly = iso(-4.9, -1.6, Z1 + 0.2)
mono(ax, lx, ly, "/ NOYAU LCPI", size=9, color=INK_DIM, ha="left")
lx, ly = iso(-3.7, -2.1, Z2 + 0.2)
mono(ax, lx, ly, "/ SORTIES", size=9, color=INK_DIM, ha="left")

ax.set_xlim(-9.5, 9.5)
ax.set_ylim(-23, 5)
plt.savefig(f"{OUT}/lcpi_architecture_solveur_double.png", dpi=200, transparent=True,
            bbox_inches="tight", pad_inches=0.25)
plt.close()
print("architecture isométrique ok")

# ============================================================
# WORKFLOW — Dossier Double, 4 plateformes en séquence isométrique
# ============================================================
fig, ax = plt.subplots(figsize=(12, 4.6), dpi=200)
ax.set_aspect("equal")
ax.axis("off")

steps = [
    ("Solveur\nstochastique", "N tirages", False),
    ("Fractile\nP95", "conservateur", True),
    ("Fascicule 71\nnormatif", "traduction", True),
    ("PDF signé\nEd25519", "horodaté", False),
]
xs = [-6.0, -2.0, 2.0, 6.0]
for x0, (title_, sub, accent) in zip(xs, steps):
    edge = CYAN if accent else INK_DIM
    face = "#0d1f21" if accent else "#121418"
    platform(ax, x0, 0, 0.6, 3.0, 2.0, face=face, edge=edge, thickness=0.3)
    px, py = iso(x0, 0, 1.0)
    label(ax, px, py + 0.15, title_, size=9.5, color=INK, weight="bold")
    label(ax, px, py - 0.32, sub, size=8.5, color=CYAN if accent else INK_DIM, font="virgil")

for i in range(len(xs) - 1):
    a_pt = iso(xs[i] + 1.5, 0, 0.9)
    b_pt = iso(xs[i+1] - 1.5, 0, 0.9)
    bezier_bundle(ax, [a_pt], b_pt, color=CYAN if i in (0, 1) else INK_DIM,
                  lw=1.0, alpha=0.7, curve=0.15, n_extra=2, seed=10 + i)

ax.set_xlim(-9.5, 9.5)
ax.set_ylim(-3.2, 3.6)
plt.savefig(f"{OUT}/lcpi_workflow_dossier_double.png", dpi=200, transparent=True,
            bbox_inches="tight", pad_inches=0.2)
plt.close()
print("workflow isométrique ok")
