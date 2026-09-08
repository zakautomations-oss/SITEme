// The two open legs follow the coordinates in public/ackra-logo.svg.
const LEGS = [
  [[107, 34], [93, 34], [50, 150], [72, 150]],
  [[93, 34], [107, 34], [150, 150], [128, 150]],
];

function rotate([x, y, z], yaw, pitch) {
  const horizontal = x * Math.cos(yaw) + z * Math.sin(yaw);
  const depth = -x * Math.sin(yaw) + z * Math.cos(yaw);
  return [horizontal, y * Math.cos(pitch) - depth * Math.sin(pitch), y * Math.sin(pitch) + depth * Math.cos(pitch)];
}

function faceNormal(points) {
  const a = points[1].map((n, i) => n - points[0][i]);
  const b = points[2].map((n, i) => n - points[0][i]);
  const cross = [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
  const length = Math.hypot(...cross) || 1;
  return cross.map(n => n / length);
}

const model = LEGS.flatMap((leg, index) => {
  // Normalize both winding orders so their front faces point toward the viewer.
  const points = leg.map(([x, y]) => [(x - 100) / 50, (92 - y) / 50]);
  const area = points.reduce((total, [x, y], i) => {
    const next = points[(i + 1) % points.length];
    return total + x * next[1] - next[0] * y;
  }, 0);
  if (area < 0) points.reverse();
  const front = points.map(([x, y]) => [x, y, 0.18]);
  const back = points.map(([x, y]) => [x, y, -0.18]);
  return [
    { id: `${index}-front`, leg: index, surface: "front", points: front },
    { id: `${index}-back`, leg: index, surface: "back", points: [...back].reverse() },
    ...points.map((_, i) => ({
      id: `${index}-edge-${i}`, leg: index, surface: "edge",
      points: [front[i], back[i], back[(i + 1) % 4], front[(i + 1) % 4]],
    })),
  ];
});

export function projectAckra(yaw, pitch) {
  return model.map(face => {
    const points = face.points.map(point => rotate(point, yaw, pitch));
    const normal = faceNormal(points);
    const illumination = Math.max(0, Math.min(1, (normal[0] * -0.4 + normal[1] * 0.6 + normal[2] * 0.7 + 1) / 2));
    return {
      ...face,
      depth: points.reduce((sum, point) => sum + point[2], 0) / points.length,
      facing: normal[2] > 0,
      illumination,
      polygon: points.map(([x, y, z]) => {
        const perspective = 6 / (6 - z);
        return `${(300 + x * 165 * perspective).toFixed(2)},${(266 - y * 165 * perspective).toFixed(2)}`;
      }).join(" "),
    };
  }).sort((a, b) => a.depth - b.depth);
}
