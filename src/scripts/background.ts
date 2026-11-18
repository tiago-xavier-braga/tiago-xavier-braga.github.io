type Point = [number, number];
type Rgb = [number, number, number];

const COLS = 10;
const ROWS = 16;
const NEUTRALS: Rgb[] = [
  [175, 183, 185],
  [196, 202, 204],
  [214, 218, 219],
  [186, 193, 195],
  [160, 170, 173],
];
const ACCENTS: Rgb[] = [
  [243, 167, 18],
  [255, 27, 28],
];

function pickColor(): Rgb {
  const roll = Math.random();
  if (roll > 0.985) return ACCENTS[1];
  if (roll > 0.97) return ACCENTS[0];
  return NEUTRALS[Math.floor(Math.random() * NEUTRALS.length)];
}

function buildPoints(width: number, height: number): Point[] {
  const points: Point[] = [];
  for (let r = 0; r <= ROWS; r++) {
    for (let c = 0; c <= COLS; c++) {
      const onEdge = r === 0 || r === ROWS || c === 0 || c === COLS;
      const jx = onEdge ? 0 : (Math.random() - 0.5) * (width / COLS) * 0.6;
      const jy = onEdge ? 0 : (Math.random() - 0.5) * (height / ROWS) * 0.6;
      points.push([
        Math.max(0, Math.min(width, (c / COLS) * width + jx)),
        Math.max(0, Math.min(height, (r / ROWS) * height + jy)),
      ]);
    }
  }
  return points;
}

function buildTriangles(): [number, number, number][] {
  const triangles: [number, number, number][] = [];
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      const tl = r * (COLS + 1) + c;
      const bl = tl + COLS + 1;
      triangles.push([tl, tl + 1, bl + 1], [tl, bl + 1, bl]);
    }
  }
  return triangles;
}

function render(layer: HTMLElement) {
  const width = document.documentElement.clientWidth;
  const height = Math.max(document.body.scrollHeight, window.innerHeight);
  const points = buildPoints(width, height);
  const polygons = buildTriangles().map((corners) => {
    const [r, g, b] = pickColor();
    const alpha = 0.06 + Math.random() * 0.08;
    const coords = corners.map((i) => points[i].map((v) => v.toFixed(1)).join(',')).join(' ');
    return `<polygon points="${coords}" fill="rgb(${r} ${g} ${b} / ${alpha.toFixed(2)})" stroke="rgb(${r} ${g} ${b} / ${(alpha * 0.4).toFixed(2)})" stroke-width="0.6"/>`;
  });
  layer.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">${polygons.join('')}</svg>`;
}

export function initBackground() {
  const layer = document.getElementById('poly-bg');
  if (!layer) return;
  let size = '';
  let frame = 0;
  const update = () => {
    const next = `${document.documentElement.clientWidth}x${document.body.scrollHeight}`;
    if (next === size) return;
    size = next;
    render(layer);
  };
  new ResizeObserver(() => {
    cancelAnimationFrame(frame);
    frame = requestAnimationFrame(update);
  }).observe(document.body);
}
