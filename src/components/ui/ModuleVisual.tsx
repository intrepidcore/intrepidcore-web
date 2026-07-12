"use client";

function hex(cx: number, cy: number, r: number): string {
  return Array.from({ length: 6 }, (_, i) => {
    const a = (i * 60 - 30) * (Math.PI / 180);
    return `${(cx + r * Math.cos(a)).toFixed(1)},${(cy + r * Math.sin(a)).toFixed(1)}`;
  }).join(" ");
}

/* ── BioCore Engine — Concentric reactor wireframe ── */
function BioCoreSVG() {
  const C = { x: 200, y: 148 };
  const spokes = Array.from({ length: 6 }, (_, i) => {
    const a = (i * 60 - 30) * (Math.PI / 180);
    return { x: C.x + 115 * Math.cos(a), y: C.y + 115 * Math.sin(a) };
  });
  return (
    <svg viewBox="0 0 400 290" className="w-full max-h-[260px]">
      {spokes.map((s, i) => (
        <line key={i} x1={C.x} y1={C.y} x2={s.x} y2={s.y} stroke="#1a1a1a" strokeWidth="0.5" />
      ))}
      <polygon points={hex(C.x, C.y, 115)} fill="none" stroke="#1a1a1a" strokeWidth="0.5" />
      <polygon points={hex(C.x, C.y, 85)}  fill="none" stroke="#27272A" strokeWidth="0.5" />
      <polygon points={hex(C.x, C.y, 55)}  fill="none" stroke="#3f3f46" strokeWidth="0.8" />
      <polygon points={hex(C.x, C.y, 28)}  fill="none" stroke="#E85D04" strokeWidth="1.5" />
      <circle cx={C.x} cy={C.y} r="16" fill="#E85D04" fillOpacity="0.08" />
      <circle cx={C.x} cy={C.y} r="4"  fill="#E85D04" opacity="0.9" />
      <text x="10" y="18"  fill="#3f3f46" fontSize="7" fontFamily="monospace">// BioCore Engine v1.0</text>
      <text x="10" y="30"  fill="#52525b" fontSize="7" fontFamily="monospace">PCI_net  = 14.2 MJ/kg</text>
      <text x="10" y="40"  fill="#52525b" fontSize="7" fontFamily="monospace">T_react  = 850°C</text>
      <text x="10" y="50"  fill="#E85D04" fontSize="7" fontFamily="monospace">ROI      = 34% ↑</text>
      <text x="10" y="280" fill="#27272A" fontSize="7" fontFamily="monospace">NSGA-II · Pareto · 200 générations</text>
    </svg>
  );
}

/* ── EnergyMap AI — H3 hexagonal territorial grid ── */
function EnergyMapSVG() {
  const R = 22;
  const W = R * Math.sqrt(3);
  const rows: { cx: number; cy: number; weight: number }[] = [];
  const weights = [0,1,3,0,2,1,0,3,2,1,0,2,3,1,0,1,2,3,0,2,1,0,3,1,2,0,1,2,3,0];
  let wi = 0;
  for (let row = 0; row < 5; row++) {
    const cols = row % 2 === 0 ? 6 : 5;
    const offsetX = row % 2 === 0 ? 30 : 30 + W / 2;
    for (let col = 0; col < cols; col++) {
      rows.push({ cx: offsetX + col * W, cy: 30 + row * R * 1.5, weight: weights[wi++ % weights.length] });
    }
  }
  const pillarColor = (w: number) => w === 3 ? "#E85D04" : w === 2 ? "#52525b" : "#27272A";
  const fillOp = (w: number) => w === 3 ? "0.12" : w === 2 ? "0.06" : "0.02";
  return (
    <svg viewBox="0 0 430 230" className="w-full max-h-[230px]">
      {rows.map((h, i) => (
        <g key={i}>
          <polygon points={hex(h.cx, h.cy, R - 1)} fill={pillarColor(h.weight)} fillOpacity={fillOp(h.weight)} stroke={h.weight > 0 ? pillarColor(h.weight) : "#1a1a1a"} strokeWidth="0.4" />
          {h.weight === 3 && (
            <>
              <rect x={h.cx - 4} y={h.cy - 30} width={8} height={20} fill="#E85D04" opacity="0.25" />
              <circle cx={h.cx} cy={h.cy} r="3" fill="#E85D04" opacity="0.8" />
            </>
          )}
        </g>
      ))}
      <text x="8" y="220" fill="#3f3f46" fontSize="7" fontFamily="monospace">// H3 Hexagonal Grid · Résolution 8/9 · OR-Tools Facility Location</text>
    </svg>
  );
}

/* ── PyroSense AI — IoT time-series with anomaly spike ── */
function PyroSenseSVG() {
  const norm = "M10,120 C30,90 50,150 70,120 C90,90 110,150 130,120 C150,90 170,150 190,120 C210,90 230,150 250,120";
  const spike = " C265,90 272,15 280,8 C288,15 292,90 300,120";
  const tail  = " C320,90 340,150 360,120 C380,90 395,150 410,120";
  return (
    <svg viewBox="0 0 420 200" className="w-full max-h-[200px]">
      {[40, 80, 120, 160].map(y => (
        <line key={y} x1="0" y1={y} x2="420" y2={y} stroke="#111111" strokeWidth="0.4" />
      ))}
      {[0, 70, 140, 210, 280, 350, 420].map(x => (
        <line key={x} x1={x} y1="0" x2={x} y2="180" stroke="#111111" strokeWidth="0.4" />
      ))}
      <line x1="0" y1="120" x2="420" y2="120" stroke="#27272A" strokeWidth="0.6" />
      <path d={norm} fill="none" stroke="#3f3f46" strokeWidth="1.5" />
      <path d={"M250,120" + spike} fill="none" stroke="#E85D04" strokeWidth="2" />
      <path d={"M300,120" + tail} fill="none" stroke="#3f3f46" strokeWidth="1.5" />
      <circle cx="280" cy="8" r="4" fill="#E85D04" opacity="0.9" />
      <line x1="280" y1="0" x2="280" y2="180" stroke="#E85D04" strokeWidth="0.5" strokeDasharray="3,3" opacity="0.4" />
      <text x="285" y="22" fill="#E85D04" fontSize="7" fontFamily="monospace">ANOMALY +4.2σ</text>
      <text x="2"   y="38" fill="#27272A" fontSize="6" fontFamily="monospace">+2σ</text>
      <text x="2"   y="78" fill="#27272A" fontSize="6" fontFamily="monospace">+1σ</text>
      <text x="2"  y="118" fill="#27272A" fontSize="6" fontFamily="monospace"> 0</text>
      <text x="2"  y="158" fill="#27272A" fontSize="6" fontFamily="monospace">-1σ</text>
      <text x="8"  y="195" fill="#3f3f46" fontSize="7" fontFamily="monospace">// PyroSense IoT · T=1150°C · LoRaWAN · Anomaly Detection</text>
    </svg>
  );
}

/* ── AgroCore — Satellite precision agriculture scan ── */
function AgroCoreSVG() {
  const plots = [
    { x: 20,  y: 20,  w: 75,  h: 55, score: 3, label: "C +28%" },
    { x: 105, y: 20,  w: 90,  h: 55, score: 2, label: "C +12%" },
    { x: 205, y: 20,  w: 85,  h: 55, score: 3, label: "C +31%" },
    { x: 300, y: 20,  w: 100, h: 55, score: 1, label: "C  −4%" },
    { x: 20,  y: 85,  w: 95,  h: 60, score: 2, label: "C +18%" },
    { x: 125, y: 85,  w: 85,  h: 60, score: 3, label: "C +24%" },
    { x: 220, y: 85,  w: 90,  h: 60, score: 3, label: "C +29%" },
    { x: 320, y: 85,  w: 80,  h: 60, score: 2, label: "C +15%" },
    { x: 20,  y: 155, w: 105, h: 55, score: 1, label: "C  +2%" },
    { x: 135, y: 155, w: 90,  h: 55, score: 2, label: "C +11%" },
    { x: 235, y: 155, w: 80,  h: 55, score: 3, label: "C +22%" },
    { x: 325, y: 155, w: 75,  h: 55, score: 3, label: "C +33%" },
  ];
  const col = (s: number) => s === 3 ? "#E85D04" : s === 2 ? "#3f3f46" : "#27272A";
  const op  = (s: number) => s === 3 ? "0.14" : s === 2 ? "0.07" : "0.03";
  return (
    <svg viewBox="0 0 420 260" className="w-full max-h-[250px]">
      {plots.map((p, i) => (
        <g key={i}>
          <rect x={p.x} y={p.y} width={p.w} height={p.h} fill={col(p.score)} fillOpacity={op(p.score)} stroke={col(p.score)} strokeWidth="0.5" />
          <text x={p.x + 5} y={p.y + 15} fill={col(p.score)} fontSize="7" fontFamily="monospace">{p.label}</text>
        </g>
      ))}
      {/* Scan line */}
      <line x1="0" y1="115" x2="420" y2="115" stroke="#E85D04" strokeWidth="0.8" opacity="0.35" strokeDasharray="4,2" />
      {/* Outer bounding box */}
      <rect x="20" y="20" width="380" height="190" fill="none" stroke="#1a1a1a" strokeWidth="0.3" strokeDasharray="3,5" />
      <text x="8" y="252" fill="#3f3f46" fontSize="7" fontFamily="monospace">// AgroCore · YieldPredict · Biochar +2t/ha · Données Atlas Sol</text>
    </svg>
  );
}

export function ModuleVisual({ num }: { num: string }) {
  switch (num) {
    case "01": return <BioCoreSVG />;
    case "02": return <EnergyMapSVG />;
    case "03": return <PyroSenseSVG />;
    case "04": return <AgroCoreSVG />;
    default: return null;
  }
}
