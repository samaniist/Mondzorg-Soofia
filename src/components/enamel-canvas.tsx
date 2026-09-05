"use client";

import { Environment, Float } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { useMemo, useRef, type RefObject } from "react";
import * as THREE from "three";

type SceneProps = {
  active: boolean;
  pointerRef: RefObject<{ x: number; y: number }>;
  reducedMotion: boolean;
};

function Sculpture({ pointerRef, reducedMotion }: Omit<SceneProps, "active">) {
  const group = useRef<THREE.Group>(null);
  const toothGeometry = useMemo(() => {
    const shape = new THREE.Shape();
    shape.moveTo(-0.08, 1.38);
    shape.bezierCurveTo(-0.42, 1.58, -1.12, 1.6, -1.3, 0.98);
    shape.bezierCurveTo(-1.48, 0.34, -1.02, -0.18, -0.86, -0.64);
    shape.bezierCurveTo(-0.72, -1.06, -0.72, -1.65, -0.38, -1.77);
    shape.bezierCurveTo(-0.02, -1.9, -0.08, -0.8, 0.18, -0.7);
    shape.bezierCurveTo(0.5, -0.58, 0.4, -1.62, 0.78, -1.57);
    shape.bezierCurveTo(1.15, -1.5, 0.98, -0.84, 1.06, -0.48);
    shape.bezierCurveTo(1.18, 0.02, 1.5, 0.48, 1.3, 1.04);
    shape.bezierCurveTo(1.08, 1.66, 0.38, 1.58, -0.08, 1.38);
    return new THREE.ExtrudeGeometry(shape, {
      depth: 0.72,
      bevelEnabled: true,
      bevelSegments: 7,
      steps: 1,
      bevelSize: 0.18,
      bevelThickness: 0.18,
      curveSegments: 18,
    });
  }, []);

  const smileCurve = useMemo(
    () => new THREE.QuadraticBezierCurve3(
      new THREE.Vector3(-1.65, -0.12, 0.85),
      new THREE.Vector3(0, -1.18, 1.05),
      new THREE.Vector3(1.65, -0.12, 0.85),
    ),
    [],
  );

  useFrame((state, delta) => {
    if (!group.current) return;
    const targetX = reducedMotion ? -0.08 : pointerRef.current.y * 0.13 - 0.08;
    const targetY = reducedMotion ? -0.3 : pointerRef.current.x * 0.24 - 0.3;
    group.current.rotation.x = THREE.MathUtils.damp(group.current.rotation.x, targetX, 4, delta);
    group.current.rotation.y = THREE.MathUtils.damp(group.current.rotation.y, targetY, 4, delta);
    if (!reducedMotion) group.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.45) * 0.025;
  });

  return (
    <group ref={group} scale={0.92} position={[0, 0.05, 0]}>
      <mesh geometry={toothGeometry} position={[0, 0, -0.35]} rotation={[0, 0, -0.04]} castShadow>
        <meshPhysicalMaterial
          color="#f5f0e6"
          clearcoat={1}
          clearcoatRoughness={0.08}
          envMapIntensity={1.2}
          ior={1.46}
          metalness={0.02}
          roughness={0.18}
          sheen={0.55}
          sheenColor="#fffaf0"
          transmission={0.06}
          thickness={1.3}
        />
      </mesh>
      <mesh position={[0, 0, -0.02]}>
        <tubeGeometry args={[smileCurve, 56, 0.026, 10, false]} />
        <meshStandardMaterial color="#b99a57" metalness={0.72} roughness={0.24} />
      </mesh>
      <pointLight color="#fff5d6" intensity={14} position={[-2.2, 2.4, 3.2]} distance={8} />
      <pointLight color="#819083" intensity={9} position={[2.4, -1.2, 2.4]} distance={7} />
    </group>
  );
}

export default function EnamelCanvas({ active, pointerRef, reducedMotion }: SceneProps) {
  return (
    <Canvas
      camera={{ fov: 35, position: [0, 0, 7.1] }}
      dpr={[1, 1.5]}
      frameloop={active ? "always" : "never"}
      gl={{ alpha: true, antialias: true, powerPreference: "high-performance" }}
      shadows={false}
    >
      <ambientLight intensity={1.35} />
      <directionalLight color="#fffaf0" intensity={2.2} position={[3, 4, 4]} />
      <Float speed={reducedMotion ? 0 : 0.55} rotationIntensity={reducedMotion ? 0 : 0.08} floatIntensity={reducedMotion ? 0 : 0.18}>
        <Sculpture pointerRef={pointerRef} reducedMotion={reducedMotion} />
      </Float>
      <Environment preset="studio" environmentIntensity={0.42} />
    </Canvas>
  );
}
