import React, { useRef, useMemo, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Html, Line } from "@react-three/drei";
import * as THREE from "three";

const NODES = [
  { id: "voice",   label: "voice agent",    pos: [ 1.9, 0.8,  0.1], hub: false },
  { id: "text",    label: "text agent",     pos: [-1.7, 1.2, -0.4], hub: false },
  { id: "review",  label: "review loop",    pos: [-2.0, -0.6, 0.6], hub: false },
  { id: "crm",     label: "crm sync",       pos: [ 1.5, -1.1, -0.3], hub: false },
  { id: "cal",     label: "calendar",       pos: [ 0.3,  1.8, -0.7], hub: false },
  { id: "data",    label: "data ops",       pos: [ 0.1, -1.9,  0.2], hub: false },
  { id: "core",    label: "ackra core",     pos: [ 0,    0,    0   ], hub: true  },
];

const EDGES = [
  ["core", "voice"], ["core", "text"], ["core", "review"], ["core", "crm"],
  ["core", "cal"], ["core", "data"],
  ["voice", "cal"], ["text", "crm"], ["review", "crm"], ["cal", "data"],
];

function NodeDot({ pos, hub, label }) {
  const r = hub ? 0.13 : 0.07;
  return (
    <group position={pos}>
      <mesh>
        <sphereGeometry args={[r, 24, 24]} />
        <meshBasicMaterial color={hub ? "#7B7FE8" : "#ffffff"} />
      </mesh>
      {hub ? (
        <mesh>
          <sphereGeometry args={[r * 2.2, 24, 24]} />
          <meshBasicMaterial color="#7B7FE8" transparent opacity={0.12} />
        </mesh>
      ) : null}
      <Html
        position={[0.18, 0.0, 0]}
        center={false}
        zIndexRange={[10, 0]}
        style={{ pointerEvents: "none" }}
      >
        <span
          style={{
            fontFamily: "JetBrains Mono, monospace",
            fontSize: 10,
            letterSpacing: "0.16em",
            color: hub ? "#7B7FE8" : "rgba(255,255,255,0.65)",
            whiteSpace: "nowrap",
            textTransform: "uppercase",
          }}
        >
          {label}
        </span>
      </Html>
    </group>
  );
}

function EdgeLine({ from, to }) {
  const points = useMemo(() => [new THREE.Vector3(...from), new THREE.Vector3(...to)], [from, to]);
  return (
    <Line
      points={points}
      color="#ffffff"
      transparent
      opacity={0.22}
      lineWidth={1}
    />
  );
}

function Network() {
  const group = useRef();
  useFrame((state, delta) => {
    if (!group.current) return;
    group.current.rotation.y += delta * 0.07;
    const m = state.mouse;
    group.current.rotation.x = THREE.MathUtils.lerp(group.current.rotation.x, -m.y * 0.25, 0.05);
  });
  const byId = useMemo(() => Object.fromEntries(NODES.map((n) => [n.id, n.pos])), []);
  return (
    <group ref={group}>
      {EDGES.map(([a, b], i) => (
        <EdgeLine key={i} from={byId[a]} to={byId[b]} />
      ))}
      {NODES.map((n) => (
        <NodeDot key={n.id} pos={n.pos} hub={n.hub} label={n.label} />
      ))}
    </group>
  );
}

export default function HeroScene({ className = "" }) {
  return (
    <div className={className} data-testid="hero-globe-canvas">
      <Canvas
        camera={{ position: [0, 0, 6.2], fov: 42 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={1.2} />
          <Network />
        </Suspense>
      </Canvas>
    </div>
  );
}
