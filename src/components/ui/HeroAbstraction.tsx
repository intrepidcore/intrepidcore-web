"use client";

const NODES = [
  { x: 120, y: 80  }, { x: 280, y: 140 }, { x: 450, y: 60  },
  { x: 580, y: 200 }, { x: 180, y: 250 }, { x: 350, y: 300 },
  { x: 650, y: 130 }, { x: 720, y: 280 }, { x: 80,  y: 350 },
  { x: 400, y: 180 }, { x: 520, y: 330 }, { x: 240, y: 380 },
];
const EDGES = [[0,1],[1,4],[1,9],[2,6],[3,6],[3,7],[4,5],[9,5],[6,7],[2,9],[7,10],[10,11],[4,11]];

const DELAYS = ["0s","0.8s","1.6s","0.4s","1.2s","2.0s","0.6s","1.8s","2.4s","0.2s","1.1s","1.9s"];
const DURS   = ["3s","2.8s","3.4s","2.6s","3.1s","2.9s","3.3s","2.7s","3.5s","2.5s","3.2s","3.0s"];

export function HeroAbstraction({ color = "#E85D04" }: { color?: string }) {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {/* Hex grid via CSS background pattern */}
      <div
        className="absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='52' height='60'%3E%3Cpolygon points='26,0 52,15 52,45 26,60 0,45 0,15' fill='none' stroke='%23ffffff' stroke-width='0.4'/%3E%3C/svg%3E")`,
          backgroundSize: "52px 60px",
        }}
      />
      {/* Network SVG overlay */}
      <svg
        className="absolute inset-0 w-full h-full opacity-[0.20]"
        viewBox="0 0 800 450"
        preserveAspectRatio="xMidYMid slice"
      >
        {/* Connection lines */}
        {EDGES.map(([a, b], i) => (
          <line
            key={i}
            x1={NODES[a].x} y1={NODES[a].y}
            x2={NODES[b].x} y2={NODES[b].y}
            stroke={color} strokeWidth="0.6" opacity="0.3"
          />
        ))}
        {/* Halo + node per point */}
        {NODES.map((n, i) => (
          <g key={i}>
            <circle cx={n.x} cy={n.y} r="14" fill={color} opacity="0.05" />
            <circle cx={n.x} cy={n.y} r="2.5" fill={color} opacity="0.85">
              <animate attributeName="opacity" values="0.85;0.2;0.85"
                dur={DURS[i]} begin={DELAYS[i]} repeatCount="indefinite" />
              <animate attributeName="r" values="2.5;3.8;2.5"
                dur={DURS[i]} begin={DELAYS[i]} repeatCount="indefinite" />
            </circle>
          </g>
        ))}
        {/* Scan line — subtle horizontal sweep */}
        <line x1="0" y1="225" x2="800" y2="225" stroke={color} strokeWidth="0.4" opacity="0.08" />
      </svg>
      {/* Radial gradient vignette */}
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(ellipse at 15% 80%, ${color}0D 0%, transparent 55%), radial-gradient(ellipse at 85% 15%, ${color}08 0%, transparent 45%)`,
        }}
      />
    </div>
  );
}
