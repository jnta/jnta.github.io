import type { ReactNode } from 'react';

function hash(str: string): number {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function mulberry32(a: number) {
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function wobbleRect(
  rnd: () => number,
  x: number,
  y: number,
  w: number,
  h: number,
  amp = 2,
): string {
  const jx = () => (rnd() - 0.5) * 2 * amp;
  const jy = () => (rnd() - 0.5) * 2 * amp;
  const mx = x + w / 2;
  const my = y + h / 2;
  const p = (px: number, py: number) =>
    `${(px + jx()).toFixed(1)},${(py + jy()).toFixed(1)}`;
  const pts = [
    p(x, y),
    p(mx, y),
    p(x + w, y),
    p(x + w, my),
    p(x + w, y + h),
    p(mx, y + h),
    p(x, y + h),
    p(x, my),
  ];
  return `M ${pts.join(' L ')} Z`;
}

function wobbleLine(
  rnd: () => number,
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  amp = 2,
): string {
  const mx = (x1 + x2) / 2;
  const my = (y1 + y2) / 2;
  const jx = () => (rnd() - 0.5) * 2 * amp;
  const jy = () => (rnd() - 0.5) * 2 * amp;
  return `M ${x1},${y1} L ${(mx + jx()).toFixed(1)},${(my + jy()).toFixed(
    1,
  )} L ${x2},${y2}`;
}

type NodeBox = { x: number; y: number; w: number; h: number; label: string };

export default function Diagram({
  seed,
  label,
  className,
  children,
}: {
  seed: string;
  label: string;
  className?: string;
  children?: ReactNode;
}) {
  const rnd = mulberry32(hash(seed));
  const count = 2 + Math.floor(rnd() * 2); // 2..3 nodes
  const nodeLabels =
    count === 3
      ? ['IN', 'PROC', 'OUT']
      : ['SRC', 'TGT'];

  const frame = wobbleRect(rnd, 10, 10, 300, 180, 2.5);

  const gap = 18;
  const nodeW = count === 3 ? 78 : 108;
  const nodeH = 52;
  const totalW = count * nodeW + (count - 1) * gap;
  const startX = (320 - totalW) / 2;
  const nodeY = 78;

  const nodes: NodeBox[] = [];
  for (let i = 0; i < count; i++) {
    nodes.push({
      x: startX + i * (nodeW + gap),
      y: nodeY,
      w: nodeW,
      h: nodeH,
      label: nodeLabels[i] ?? String(i),
    });
  }

  const arrows: string[] = [];
  for (let i = 0; i < nodes.length - 1; i++) {
    const a = nodes[i];
    const b = nodes[i + 1];
    arrows.push(wobbleLine(rnd, a.x + a.w, a.y + a.h / 2, b.x, b.y + b.h / 2, 1.5));
  }

  const accentNode = Math.floor(rnd() * nodes.length);

  return (
    <svg
      viewBox="0 0 320 200"
      className={className}
      role="img"
      aria-label={`Diagrama de ${label}`}
      style={{ display: 'block', width: '100%', height: 'auto' }}
    >
      <defs>
        <marker
          id="arrowhead"
          viewBox="0 0 10 10"
          refX="9"
          refY="5"
          markerWidth="7"
          markerHeight="7"
          orient="auto-start-reverse"
        >
          <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--line)" />
        </marker>
      </defs>
      <path d={frame} className="diagram-stroke" stroke="var(--line)" strokeWidth="1.5" />

      <text
        x="22"
        y="38"
        fontFamily="var(--font-mono)"
        fontSize="13"
        letterSpacing="0.08em"
        fill="var(--muted)"
      >
        {label}
      </text>

      {arrows.map((d, i) => (
        <path
          key={`arrow-${i}`}
          d={d}
          className="diagram-stroke"
          stroke="var(--line)"
          strokeWidth="1.5"
          markerEnd="url(#arrowhead)"
        />
      ))}

      {nodes.map((n, i) => (
        <g key={`node-${i}`}>
          <path
            d={wobbleRect(rnd, n.x, n.y, n.w, n.h, 2)}
            fill={i === accentNode ? 'var(--terracotta)' : 'var(--surface)'}
            fillOpacity={i === accentNode ? 0.14 : 0.6}
            stroke={i === accentNode ? 'var(--terracotta)' : 'var(--line)'}
            strokeWidth="1.5"
            className="diagram-stroke"
          />
          <text
            x={n.x + n.w / 2}
            y={n.y + n.h / 2 + 4}
            textAnchor="middle"
            fontFamily="var(--font-mono)"
            fontSize="13"
            fill={i === accentNode ? 'var(--terracotta)' : 'var(--ink)'}
          >
            {n.label}
          </text>
        </g>
      ))}

      {children}
    </svg>
  );
}
