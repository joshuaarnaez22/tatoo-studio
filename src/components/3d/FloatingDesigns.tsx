"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { Float, RoundedBox } from "@react-three/drei";
import * as THREE from "three";

interface FloatingDesignProps {
  position: [number, number, number];
  rotation?: [number, number, number];
  scale?: number;
  floatIntensity?: number;
  rotationSpeed?: number;
  color: string;
}

function FloatingDesign({
  position,
  rotation = [0, 0, 0],
  scale = 1,
  floatIntensity = 1,
  rotationSpeed = 0.5,
  color,
}: FloatingDesignProps) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y =
        Math.sin(state.clock.elapsedTime * rotationSpeed) * 0.3 + rotation[1];
      meshRef.current.rotation.x =
        Math.cos(state.clock.elapsedTime * rotationSpeed * 0.5) * 0.1 + rotation[0];
    }
  });

  return (
    <Float
      speed={2}
      rotationIntensity={0.2}
      floatIntensity={floatIntensity}
      floatingRange={[-0.1, 0.1]}
    >
      <RoundedBox
        ref={meshRef}
        position={position}
        scale={scale}
        args={[1, 1, 0.05]}
        radius={0.1}
        smoothness={4}
      >
        <meshStandardMaterial
          color={color}
          transparent
          opacity={0.8}
          roughness={0.3}
          metalness={0.5}
        />
      </RoundedBox>
    </Float>
  );
}

// Glowing orb particle
function GlowOrb({
  position,
  color,
  size = 0.05,
}: {
  position: [number, number, number];
  color: string;
  size?: number;
}) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.position.y =
        position[1] + Math.sin(state.clock.elapsedTime * 2 + position[0]) * 0.3;
      const scale = 1 + Math.sin(state.clock.elapsedTime * 3) * 0.2;
      meshRef.current.scale.setScalar(scale * size);
    }
  });

  return (
    <mesh ref={meshRef} position={position}>
      <sphereGeometry args={[1, 16, 16]} />
      <meshBasicMaterial color={color} transparent opacity={0.6} />
    </mesh>
  );
}

export function FloatingDesigns() {
  // Generate random particle positions
  const particles = useMemo(() => {
    const positions: [number, number, number][] = [];
    for (let i = 0; i < 30; i++) {
      positions.push([
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 6,
        (Math.random() - 0.5) * 4 - 2,
      ]);
    }
    return positions;
  }, []);

  // Floating card designs with colors
  const designs = [
    {
      position: [-2.5, 1, -1] as [number, number, number],
      scale: 1.2,
      color: "#a855f7",
    },
    {
      position: [2.5, 0.5, -0.5] as [number, number, number],
      scale: 1,
      color: "#06b6d4",
    },
    {
      position: [-1.5, -1, -1.5] as [number, number, number],
      scale: 0.9,
      color: "#ec4899",
    },
    {
      position: [1.8, -0.8, -1] as [number, number, number],
      scale: 0.8,
      color: "#8b5cf6",
    },
    {
      position: [0, 1.5, -2] as [number, number, number],
      scale: 1.1,
      color: "#14b8a6",
    },
    {
      position: [-3, -0.5, -2] as [number, number, number],
      scale: 0.7,
      color: "#f43f5e",
    },
    {
      position: [3, 1.2, -1.5] as [number, number, number],
      scale: 0.85,
      color: "#6366f1",
    },
  ];

  return (
    <>
      {/* Floating tattoo design cards */}
      {designs.map((design, i) => (
        <FloatingDesign
          key={i}
          position={design.position}
          scale={design.scale}
          color={design.color}
          floatIntensity={0.5 + Math.random() * 0.5}
          rotationSpeed={0.3 + Math.random() * 0.4}
        />
      ))}

      {/* Glowing particles */}
      {particles.map((pos, i) => (
        <GlowOrb
          key={i}
          position={pos}
          color={i % 2 === 0 ? "#a855f7" : "#06b6d4"}
          size={0.02 + Math.random() * 0.03}
        />
      ))}
    </>
  );
}
