import React, { Suspense, useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { ContactShadows, Environment } from "@react-three/drei";
import * as THREE from "three";

/* Metallic chevron-A modeled as an extruded Shape with a triangular hole. */
function ALogo({ rotateSpeed = 0.4 }) {
  const ref = useRef();
  const accentRef = useRef();

  useFrame((state, delta) => {
    if (ref.current) {
      ref.current.rotation.y += delta * rotateSpeed;
      const m = state.mouse;
      ref.current.rotation.x = THREE.MathUtils.lerp(
        ref.current.rotation.x,
        -m.y * 0.2,
        0.06
      );
    }
    if (accentRef.current) {
      const t = state.clock.getElapsedTime();
      const i = 2.0 + Math.sin(t * 1.4) * 0.6;
      accentRef.current.material.emissiveIntensity = i;
    }
  });

  const geometry = useMemo(() => {
    const shape = new THREE.Shape();
    // Outer triangle, CCW (with y-up)
    shape.moveTo(-1.25, -1.4);
    shape.lineTo(0, 1.65);
    shape.lineTo(1.25, -1.4);
    shape.closePath();

    // Hole MUST wind opposite (CW) to outer to subtract correctly
    const hole = new THREE.Path();
    hole.moveTo(0.5, -1.35);
    hole.lineTo(0, 0.7);
    hole.lineTo(-0.5, -1.35);
    hole.closePath();
    shape.holes.push(hole);

    const settings = {
      depth: 0.5,
      bevelEnabled: true,
      bevelThickness: 0.06,
      bevelSize: 0.06,
      bevelSegments: 6,
      curveSegments: 1,
    };
    const geo = new THREE.ExtrudeGeometry(shape, settings);
    // Center on origin
    geo.translate(0, -0.15, -0.25);
    return geo;
  }, []);

  return (
    <group ref={ref} rotation={[0, 0.25, 0]}>
      {/* Main metallic A body */}
      <mesh geometry={geometry} castShadow receiveShadow>
        <meshStandardMaterial
          color="#9ea0b3"
          metalness={1}
          roughness={0.28}
          envMapIntensity={1.6}
        />
      </mesh>

      {/* Periwinkle emissive accent panel aligned with right leg */}
      <mesh
        ref={accentRef}
        position={[0.5, -0.65, 0.265]}
        rotation={[0, 0, -0.385]}
      >
        <boxGeometry args={[0.24, 1.0, 0.04]} />
        <meshStandardMaterial
          color="#7B7FE8"
          emissive="#7B7FE8"
          emissiveIntensity={2.2}
          metalness={0.5}
          roughness={0.3}
          toneMapped={false}
        />
      </mesh>
    </group>
  );
}

export default function LogoA3D({ className = "", height = 520 }) {
  return (
    <div className={className} data-testid="hero-logo-3d" style={{ height }}>
      <Canvas
        camera={{ position: [0, 0.1, 5.6], fov: 38 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
        shadows
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.55} />
          <directionalLight
            position={[-3, 4, 5]}
            intensity={2.4}
            color="#ffffff"
            castShadow
          />
          <directionalLight
            position={[4, -1, 3]}
            intensity={0.8}
            color="#a8acff"
          />
          <directionalLight
            position={[0, 2, -4]}
            intensity={1.0}
            color="#ffffff"
          />
          <pointLight position={[1, -0.5, 1.5]} intensity={1.2} color="#7B7FE8" />
          <Environment preset="city" />
          <ALogo />
          <ContactShadows
            position={[0, -2.0, 0]}
            opacity={0.55}
            blur={2.4}
            scale={6.5}
            far={3}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}
