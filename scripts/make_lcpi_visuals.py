"""
Visuels techniques /produits/lcpi — style "schéma opérationnel", pas papier académique.
Fond transparent, trait fin monochrome, un seul accent (cyan), aucune grille lourde,
aucun titre ni légende encadrée dans l'image (gérés par la page React).
"""
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
import matplotlib.font_manager as fm
import matplotlib.ticker
from matplotlib.patches import FancyBboxPatch, FancyArrowPatch, Circle, Rectangle, Wedge
from matplotlib.path import Path
import matplotlib.patches as mpatches
import numpy as np

# --- Charte IntrepidCore (registre site, pas registre livre blanc) ---
BG        = "none"           # transparent — s'intègre aux sections noires du site
INK       = "#E5E5E5"        # trait / texte principal sur fond noir
INK_DIM   = "#7A7A7A"        # trait secondaire / structure
CYAN      = "#00C4D4"        # accent unique
CYAN_DIM  = "#0A4A50"
WHITE     = "#FFFFFF"

FONT_PATH = "D:/ANNEXE/intrepid-core/docs/font/Virgil.ttf"
fm.fontManager.addfont(FONT_PATH)
VIRGIL = fm.FontProperties(fname=FONT_PATH).get_name()

plt.rcParams.update({
    "font.family": "DejaVu Sans",   # lisibilité des données — pas Virgil ici
    "font.size": 10,
    "axes.edgecolor": INK_DIM,
    "axes.linewidth": 0.7,
    "axes.grid": False,
    "figure.facecolor": "none",
    "axes.facecolor": "none",
    "savefig.facecolor": "none",
    "text.color": INK,
    "axes.labelcolor": INK,
    "xtick.color": INK_DIM,
    "ytick.color": INK_DIM,
})

OUT = "D:/ANNEXE/intrepidcore-web/public/illustrations/lcpi"

def annotate(ax, x, y, text, size=9, color=INK, ha="left", va="center", weight="normal"):
    ax.text(x, y, text, fontfamily=VIRGIL, fontsize=size, color=color, ha=ha, va=va)

def mono_label(ax, x, y, text, size=8, color=INK_DIM, ha="left", va="center"):
    ax.text(x, y, text, fontfamily="DejaVu Sans Mono", fontsize=size, color=color, ha=ha, va=va,
             transform=ax.transData)

def strip_axes(ax):
    for s in ax.spines.values():
        s.set_visible(False)
    ax.set_xticks([]); ax.set_yticks([])

# ============================================================
# 1) SOLVEUR DOUBLE — schéma d'architecture en 3 couches
# ============================================================
fig, ax = plt.subplots(figsize=(9.5, 6.4), dpi=200)
ax.set_xlim(0, 100); ax.set_ylim(0, 68)
strip_axes(ax)

def band(y0, y1, label, sub=None):
    ax.add_patch(Rectangle((2, y0), 96, y1 - y0, fill=False, edgecolor=INK_DIM, linewidth=0.7))
    mono_label(ax, 4, y1 - 2.2, label, size=8.5, color=INK_DIM)

# Bandes de fond (couches)
band(46, 65.5, "/ ENTRÉES")
band(24, 44.5, "/ NOYAU LCPI")
band(2, 22.5, "/ SORTIES")

# --- ENTRÉES ---
inputs = [("Réseau AEP\n(nœuds, conduites)", 14), ("Charges & matériaux\n(EC2)", 38), ("Tirages Monte Carlo\n(scénarios)", 62), ("Contexte Atlas\n(sol, RGA)", 86)]
for x, cx in inputs:
    pass
for label, cx in [("Réseau AEP\n(nœuds, conduites)", 12), ("Charges & matériaux\n(EC2)", 37), ("Tirages Monte Carlo\n(scénarios)", 62), ("Contexte Atlas\n(sol, RGA)", 87)]:
    box = FancyBboxPatch((cx - 10.5, 50), 21, 10.5, boxstyle="round,pad=0.3,rounding_size=1.2",
                          linewidth=0.8, edgecolor=INK, facecolor="none")
    ax.add_patch(box)
    ax.text(cx, 55.2, label, fontfamily="DejaVu Sans", fontsize=8, color=INK, ha="center", va="center")

# --- NOYAU (2 voies : déterministe / stochastique) ---
det = FancyBboxPatch((6, 27.5), 40, 12.5, boxstyle="round,pad=0.3,rounding_size=1.2",
                      linewidth=0.9, edgecolor=INK, facecolor="none")
ax.add_patch(det)
ax.text(26, 36.7, "NOYAU DÉTERMINISTE", fontfamily="DejaVu Sans Mono", fontsize=8, color=INK, ha="center", weight="bold")
ax.text(26, 32.3, "Hardy-Cross · Eurocode 2", fontfamily="DejaVu Sans", fontsize=8.5, color=INK, ha="center")
ax.text(26, 29.2, "bit-exact · vérifie", fontfamily=VIRGIL, fontsize=8.5, color=CYAN, ha="center")

sto = FancyBboxPatch((54, 27.5), 40, 12.5, boxstyle="round,pad=0.3,rounding_size=1.2",
                      linewidth=0.9, edgecolor=CYAN, facecolor="none")
ax.add_patch(sto)
ax.text(74, 36.7, "MOTEUR STOCHASTIQUE", fontfamily="DejaVu Sans Mono", fontsize=8, color=CYAN, ha="center", weight="bold")
ax.text(74, 32.3, "Ensembles Monte Carlo", fontfamily="DejaVu Sans", fontsize=8.5, color=INK, ha="center")
ax.text(74, 29.2, "réduit (Wasserstein) · arbitre (NSGA-II)", fontfamily=VIRGIL, fontsize=7, color=CYAN, ha="center")

# --- SORTIES --- (gauche = déterministe, centre = fusion signée, droite = stochastique — pas de croisement)
for label, cx in [("Export\nEPANET / DXF", 20), ("Dossier signé\nEd25519", 50), ("Rapport P95\nFascicule 71", 80)]:
    box = FancyBboxPatch((cx - 12, 6), 24, 10.5, boxstyle="round,pad=0.3,rounding_size=1.2",
                          linewidth=0.8, edgecolor=INK, facecolor="none")
    ax.add_patch(box)
    ax.text(cx, 11.2, label, fontfamily="DejaVu Sans", fontsize=8, color=INK, ha="center", va="center")

# Flèches entrées -> noyau
for cx in [12, 37]:
    ax.add_patch(FancyArrowPatch((cx, 50), (26, 40), arrowstyle="-|>", mutation_scale=9, linewidth=0.7, color=INK_DIM))
for cx in [62, 87]:
    ax.add_patch(FancyArrowPatch((cx, 50), (74, 40), arrowstyle="-|>", mutation_scale=9, linewidth=0.7, color=CYAN_DIM))

# Flèches noyau -> sorties (chaque source alimente son côté + la fusion centrale — convergence, pas croisement)
ax.add_patch(FancyArrowPatch((22, 27.5), (20, 16.5), arrowstyle="-|>", mutation_scale=9, linewidth=0.7, color=INK_DIM))
ax.add_patch(FancyArrowPatch((32, 27.5), (46, 16.5), arrowstyle="-|>", mutation_scale=9, linewidth=0.7, color=INK_DIM))
ax.add_patch(FancyArrowPatch((78, 27.5), (80, 16.5), arrowstyle="-|>", mutation_scale=9, linewidth=0.9, color=CYAN))
ax.add_patch(FancyArrowPatch((68, 27.5), (54, 16.5), arrowstyle="-|>", mutation_scale=9, linewidth=0.9, color=CYAN))

# Liaison de vérification croisée (le déterministe vérifie le stochastique)
ax.add_patch(FancyArrowPatch((46, 34), (54, 34), arrowstyle="-|>", mutation_scale=9, linewidth=0.8,
                              color=CYAN, connectionstyle="arc3,rad=-0.25", linestyle=(0, (2, 2))))
ax.text(50, 40.5, "vérifie", fontfamily=VIRGIL, fontsize=8, color=CYAN, ha="center")

plt.savefig(f"{OUT}/lcpi_architecture_solveur_double.png", dpi=200, transparent=True, bbox_inches="tight", pad_inches=0.15)
plt.close()
print("1/7 architecture ok")

# ============================================================
# 2) BANDE DE FRACTILES P10 / P50 / P90 — mécanisme Dossier Double
# ============================================================
np.random.seed(7)
fig, ax = plt.subplots(figsize=(8.6, 4.6), dpi=200)
x = np.linspace(0, 24, 25)  # heures
base = 2.4 + 0.35 * np.sin(x / 24 * 2 * np.pi - 1.2)
spread = 0.18 + 0.10 * np.sin(x / 24 * 2 * np.pi + 0.4) ** 2
p10 = base - 1.28 * spread
p50 = base
p90 = base + 1.28 * spread

ax.fill_between(x, p10, p90, color=CYAN, alpha=0.14, linewidth=0, zorder=1)
ax.plot(x, p10, color=CYAN, linewidth=0.8, alpha=0.55, zorder=2)
ax.plot(x, p90, color=CYAN, linewidth=0.8, alpha=0.55, zorder=2)
ax.plot(x, p50, color=WHITE, linewidth=1.6, zorder=3)

# Seuil normatif de référence (déterministe)
ax.axhline(2.0, color=INK_DIM, linewidth=0.8, linestyle=(0, (4, 3)), zorder=1)
mono_label(ax, 24.3, 2.0, "seuil EN 805\n(2.0 bar)", size=7.5, color=INK_DIM, ha="left", va="center")

annotate(ax, 17, p90[17] + 0.10, "P90", size=9, color=CYAN)
annotate(ax, 17, p50[17] + 0.07, "P50", size=9, color=WHITE)
annotate(ax, 17, p10[17] - 0.14, "P10", size=9, color=CYAN)

ax.set_xlim(0, 26); ax.set_ylim(1.5, 3.3)
ax.set_xticks([0, 6, 12, 18, 24])
ax.set_xticklabels(["0h", "6h", "12h", "18h", "24h"], fontfamily="DejaVu Sans Mono", fontsize=8.5)
ax.set_yticks([])
ax.spines[["top", "right", "left"]].set_visible(False)
ax.spines["bottom"].set_color(INK_DIM)
mono_label(ax, 0.0, 3.22, "PRESSION NŒUD CRITIQUE — P(bar)", size=8, color=INK_DIM, ha="left")

plt.tight_layout()
plt.savefig(f"{OUT}/lcpi_fractiles_p10_p50_p90.png", dpi=200, transparent=True, bbox_inches="tight", pad_inches=0.15)
plt.close()
print("2/7 fractiles ok")

# ============================================================
# 4) WORKFLOW — Solveur stochastique -> P95 -> Fascicule 71 -> PDF signé
# ============================================================
fig, ax = plt.subplots(figsize=(9.2, 2.6), dpi=200)
ax.set_xlim(0, 100); ax.set_ylim(0, 26)
strip_axes(ax)

steps = [
    ("Solveur\nstochastique", "N tirages"),
    ("Fractile\nP95", "conservateur"),
    ("Fascicule 71\n(langage normatif)", "traduction"),
    ("PDF signé\nEd25519", "horodaté"),
]
n = len(steps)
w = 20
gap = (100 - n * w) / (n + 1)
xs = [gap + i * (w + gap) for i in range(n)]
for i, (x0, (title_, sub)) in enumerate(zip(xs, steps)):
    edge = CYAN if i in (1, 2) else INK
    box = FancyBboxPatch((x0, 6), w, 14, boxstyle="round,pad=0.3,rounding_size=1.1",
                          linewidth=0.9, edgecolor=edge, facecolor="none")
    ax.add_patch(box)
    ax.text(x0 + w / 2, 15.2, title_, fontfamily="DejaVu Sans", fontsize=8.5, color=INK, ha="center", va="center")
    ax.text(x0 + w / 2, 9.3, sub, fontfamily=VIRGIL, fontsize=7.5, color=CYAN if i in (1,2) else INK_DIM, ha="center", va="center")
    if i < n - 1:
        ax.add_patch(FancyArrowPatch((x0 + w, 13), (xs[i + 1], 13), arrowstyle="-|>",
                                      mutation_scale=10, linewidth=0.9, color=INK_DIM))

plt.savefig(f"{OUT}/lcpi_workflow_dossier_double.png", dpi=200, transparent=True, bbox_inches="tight", pad_inches=0.12)
plt.close()
print("4/7 workflow ok")

# ============================================================
# 5) CONVERGENCE HARDY-CROSS — résidu de pression / itération
# ============================================================
fig, ax = plt.subplots(figsize=(7.4, 4.6), dpi=200)
iters = np.arange(1, 9)
residual = 4.8 * np.exp(-0.95 * (iters - 1)) + 0.0008
ax.set_yscale("log")
ax.plot(iters, residual, color=CYAN, linewidth=1.3, marker="o", markersize=4.5,
        markerfacecolor="#0A0A0A", markeredgecolor=CYAN, markeredgewidth=1.2, zorder=3)
ax.axhline(1e-3, color=INK_DIM, linewidth=0.8, linestyle=(0, (4, 3)))
mono_label(ax, 8.15, 1e-3, "tolérance\n1×10⁻³", size=7.5, color=INK_DIM, ha="left", va="center")

for i, r in zip(iters, residual):
    if i in (1, 4, 8):
        annotate(ax, i + 0.15, r * 1.5, f"{r:.2g}", size=8, color=INK, ha="left")

ax.set_xlim(0.5, 9.6); ax.set_ylim(4e-4, 22)
ax.set_xticks(iters)
ax.set_xticklabels([str(i) for i in iters], fontfamily="DejaVu Sans Mono", fontsize=8.5)
ax.set_yticks([])
ax.yaxis.set_minor_locator(matplotlib.ticker.NullLocator())
ax.spines[["top", "right", "left"]].set_visible(False)
ax.spines["bottom"].set_color(INK_DIM)
mono_label(ax, 0.5, 17.5, "RÉSIDU ‖ΔH‖ (log) — CONVERGENCE HARDY-CROSS", size=8, color=INK_DIM, ha="left")
ax.set_xlabel("Itération", fontfamily="DejaVu Sans Mono", fontsize=8.5, color=INK_DIM)

plt.tight_layout()
plt.savefig(f"{OUT}/lcpi_convergence_hardy_cross.png", dpi=200, transparent=True, bbox_inches="tight", pad_inches=0.15)
plt.close()
print("5/7 convergence ok")

# ============================================================
# 6) FRONT DE PARETO NSGA-II — coût vs fiabilité
# ============================================================
np.random.seed(3)
fig, ax = plt.subplots(figsize=(7.6, 5.4), dpi=200)

n_dom = 90
cost_dom = np.random.uniform(20, 100, n_dom)
rel_dom = 60 + 0.30 * cost_dom + np.random.normal(0, 6, n_dom) - 0.002 * cost_dom**2 * 0
rel_dom = np.clip(rel_dom - np.random.uniform(4, 22, n_dom), 55, 97)
ax.scatter(cost_dom, rel_dom, s=10, color=INK_DIM, alpha=0.5, linewidths=0, zorder=2)

cost_pf = np.sort(np.random.uniform(22, 98, 14))
rel_pf = 60 + 34 * (1 - np.exp(-(cost_pf - 20) / 35))
rel_pf = np.clip(rel_pf + np.random.normal(0, 0.8, len(cost_pf)), 60, 99)
rel_pf = np.maximum.accumulate(rel_pf)
ax.plot(cost_pf, rel_pf, color=CYAN, linewidth=1.1, zorder=3)
ax.scatter(cost_pf, rel_pf, s=32, color="#0A0A0A", edgecolor=CYAN, linewidths=1.3, zorder=4)

pick = 8
ax.scatter([cost_pf[pick]], [rel_pf[pick]], s=90, facecolor="none", edgecolor=WHITE, linewidths=1.2, zorder=5)
annotate(ax, cost_pf[pick] + 3, rel_pf[pick] - 3, "solution retenue", size=8.5, color=WHITE)

annotate(ax, 78, 62, "configurations dominées", size=8.5, color=INK_DIM)
annotate(ax, 30, 95, "front de Pareto\n(NSGA-II)", size=8.5, color=CYAN)

ax.set_xlim(15, 105); ax.set_ylim(50, 100)
ax.set_xticks([]); ax.set_yticks([])
ax.spines[["top", "right"]].set_visible(False)
ax.spines["left"].set_color(INK_DIM); ax.spines["bottom"].set_color(INK_DIM)
ax.set_xlabel("Coût réseau (matériaux + pose)", fontfamily="DejaVu Sans Mono", fontsize=8.5, color=INK_DIM)
ax.set_ylabel("Fiabilité hydraulique (%)", fontfamily="DejaVu Sans Mono", fontsize=8.5, color=INK_DIM)

plt.tight_layout()
plt.savefig(f"{OUT}/lcpi_pareto_nsga2.png", dpi=200, transparent=True, bbox_inches="tight", pad_inches=0.15)
plt.close()
print("6/7 pareto ok")

# ------------------------------------------------------------
# 6bis) Même graphique, variante claire (encre sombre sur transparent)
# ------------------------------------------------------------
INK_L, DIM_L, DARK = "#1A1A1A", "#8A8A8A", "#0A0A0A"
np.random.seed(3)
fig, ax = plt.subplots(figsize=(7.6, 5.4), dpi=200)

cost_dom = np.random.uniform(20, 100, n_dom)
rel_dom = np.clip(60 + 0.30 * cost_dom + np.random.normal(0, 6, n_dom) - np.random.uniform(4, 22, n_dom), 55, 97)
ax.scatter(cost_dom, rel_dom, s=10, color=DIM_L, alpha=0.45, linewidths=0, zorder=2)

cost_pf = np.sort(np.random.uniform(22, 98, 14))
rel_pf = 60 + 34 * (1 - np.exp(-(cost_pf - 20) / 35))
rel_pf = np.maximum.accumulate(np.clip(rel_pf + np.random.normal(0, 0.8, len(cost_pf)), 60, 99))
ax.plot(cost_pf, rel_pf, color=CYAN, linewidth=1.3, zorder=3)
ax.scatter(cost_pf, rel_pf, s=32, color="white", edgecolor=CYAN, linewidths=1.4, zorder=4)

ax.scatter([cost_pf[pick]], [rel_pf[pick]], s=90, facecolor="none", edgecolor=DARK, linewidths=1.4, zorder=5)
annotate(ax, cost_pf[pick] + 3, rel_pf[pick] - 3, "solution retenue", size=8.5, color=DARK)
annotate(ax, 78, 62, "configurations dominées", size=8.5, color=DIM_L)
annotate(ax, 30, 95, "front de Pareto\n(NSGA-II)", size=8.5, color=CYAN)

ax.set_xlim(15, 105); ax.set_ylim(50, 100)
ax.set_xticks([]); ax.set_yticks([])
ax.spines[["top", "right"]].set_visible(False)
ax.spines["left"].set_color(DIM_L); ax.spines["bottom"].set_color(DIM_L)
ax.set_xlabel("Coût réseau (matériaux + pose)", fontfamily="DejaVu Sans Mono", fontsize=8.5, color=DIM_L)
ax.set_ylabel("Fiabilité hydraulique (%)", fontfamily="DejaVu Sans Mono", fontsize=8.5, color=DIM_L)

plt.tight_layout()
plt.savefig(f"{OUT}/lcpi_pareto_nsga2_light.png", dpi=200, transparent=True, bbox_inches="tight", pad_inches=0.15)
plt.close()
print("6bis/7 pareto (clair) ok")

# ============================================================
# 7) COUPE TECHNIQUE EC2 — section béton armé (poteau 30x30, As=8.04cm²)
# ============================================================
fig, ax = plt.subplots(figsize=(6.2, 6.2), dpi=200)
ax.set_xlim(-3, 33); ax.set_ylim(-3, 33)
ax.set_aspect("equal")
strip_axes(ax)

# Section béton (hachurée)
concrete = Rectangle((0, 0), 30, 30, fill=False, edgecolor=INK, linewidth=1.1, hatch="//////")
concrete.set_hatch_linewidth = 0.3
ax.add_patch(concrete)

# Enrobage (ligne fine en retrait)
cover = 3
ax.add_patch(Rectangle((cover, cover), 30 - 2*cover, 30 - 2*cover, fill=False,
                        edgecolor=CYAN, linewidth=0.6, linestyle=(0, (3, 2))))

# 4 barres d'angle HA16 (rayon proportionnel) + 4 HA14 en milieu de face
r16, r14 = 1.05, 0.95
corners = [(cover, cover), (30-cover, cover), (cover, 30-cover), (30-cover, 30-cover)]
for (cx, cy) in corners:
    ax.add_patch(Circle((cx, cy), r16, facecolor="#0A0A0A", edgecolor=WHITE, linewidth=1.2, zorder=5))
mids = [(15, cover), (15, 30-cover), (cover, 15), (30-cover, 15)]
for (cx, cy) in mids:
    ax.add_patch(Circle((cx, cy), r14, facecolor="#0A0A0A", edgecolor=CYAN, linewidth=1.1, zorder=5))

# Cadre (étrier) HA8
ax.add_patch(Rectangle((cover-1.4, cover-1.4), 30-2*cover+2.8, 30-2*cover+2.8, fill=False,
                        edgecolor=INK_DIM, linewidth=0.8))

# Cotations
def dim_line(x0, y0, x1, y1, text, offset=0):
    ax.annotate("", xy=(x1, y1), xytext=(x0, y0),
                arrowprops=dict(arrowstyle="<->", color=INK_DIM, linewidth=0.7))
    mx, my = (x0 + x1) / 2, (y0 + y1) / 2
    ax.text(mx, my + offset, text, fontfamily="DejaVu Sans Mono", fontsize=8, color=INK_DIM, ha="center", va="center")

dim_line(0, -2.2, 30, -2.2, "30 cm")
dim_line(-2.2, 0, -2.2, 30, "30 cm")

# Étiquette centrale : on "perce" le hachurage avec un fond plein avant d'écrire
ax.add_patch(Rectangle((7.5, 11.6), 15, 6.8, facecolor="#0A0A0A", edgecolor="none", zorder=6))
annotate(ax, 15, 16.9, "4 HA16", size=9, color=WHITE, ha="center")
annotate(ax, 15, 14.9, "4 HA14", size=9, color=CYAN, ha="center")
annotate(ax, 15, 12.9, "cadres HA8/20", size=7.5, color=INK_DIM, ha="center")
for p in [ax.texts[-1], ax.texts[-2], ax.texts[-3]]:
    p.set_zorder(7)
mono_label(ax, 0.0, 32.0, "AS = 8.04 CM²  ·  POTEAU 30×30  ·  EC2 ELU/ELS", size=8.5, color=INK_DIM, ha="left")

plt.savefig(f"{OUT}/lcpi_coupe_ec2_beton_arme.png", dpi=200, transparent=True, bbox_inches="tight", pad_inches=0.2)
plt.close()
print("7/7 coupe EC2 ok")
