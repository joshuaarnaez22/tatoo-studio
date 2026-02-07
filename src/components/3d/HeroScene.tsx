"use client";

import { Suspense, useRef, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import * as THREE from "three";

// Floating triangle - tattoo design element
function Triangle({
  position,
  rotation,
  scale = 1,
  color,
  speed = 1,
}: {
  position: [number, number, number];
  rotation?: [number, number, number];
  scale?: number;
  color: string;
  speed?: number;
}) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.z = state.clock.elapsedTime * 0.2 * speed;
    }
  });

  // Create triangle shape
  const shape = new THREE.Shape();
  shape.moveTo(0, 0.5);
  shape.lineTo(-0.43, -0.25);
  shape.lineTo(0.43, -0.25);
  shape.closePath();

  return (
    <Float speed={1.5 * speed} rotationIntensity={0.2} floatIntensity={0.5}>
      <mesh ref={meshRef} position={position} rotation={rotation} scale={scale}>
        <shapeGeometry args={[shape]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.3}
          transparent
          opacity={0.8}
          side={THREE.DoubleSide}
        />
      </mesh>
    </Float>
  );
}

// Hexagon - geometric tattoo element
function Hexagon({
  position,
  scale = 1,
  color,
  wireframe = false,
}: {
  position: [number, number, number];
  scale?: number;
  color: string;
  wireframe?: boolean;
}) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.z = state.clock.elapsedTime * 0.15;
    }
  });

  return (
    <Float speed={1.2} rotationIntensity={0.15} floatIntensity={0.4}>
      <mesh ref={meshRef} position={position} scale={scale}>
        <circleGeometry args={[0.5, 6]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={wireframe ? 0.5 : 0.2}
          wireframe={wireframe}
          transparent
          opacity={wireframe ? 1 : 0.6}
          side={THREE.DoubleSide}
        />
      </mesh>
    </Float>
  );
}

// Ring - circular tattoo element
function Ring({
  position,
  radius = 0.5,
  color,
  thickness = 0.03,
}: {
  position: [number, number, number];
  radius?: number;
  color: string;
  thickness?: number;
}) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.1;
    }
  });

  return (
    <Float speed={1} rotationIntensity={0.1} floatIntensity={0.3}>
      <mesh ref={meshRef} position={position}>
        <torusGeometry args={[radius, thickness, 16, 64]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.4}
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>
    </Float>
  );
}

// Diamond shape
function Diamond({
  position,
  scale = 1,
  color,
}: {
  position: [number, number, number];
  scale?: number;
  color: string;
}) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.z = state.clock.elapsedTime * 0.25;
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.2;
    }
  });

  return (
    <Float speed={1.8} rotationIntensity={0.25} floatIntensity={0.6}>
      <mesh ref={meshRef} position={position} scale={scale} rotation={[0, 0, Math.PI / 4]}>
        <boxGeometry args={[0.4, 0.4, 0.05]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.3}
          transparent
          opacity={0.7}
          metalness={0.5}
          roughness={0.3}
        />
      </mesh>
    </Float>
  );
}

// Dot/sphere particle
function Dot({
  position,
  size = 0.05,
  color,
}: {
  position: [number, number, number];
  size?: number;
  color: string;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const initialY = useRef(position[1]);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.position.y =
        initialY.current + Math.sin(state.clock.elapsedTime * 2 + position[0]) * 0.15;
    }
  });

  return (
    <mesh ref={meshRef} position={position}>
      <sphereGeometry args={[size, 16, 16]} />
      <meshBasicMaterial color={color} transparent opacity={0.8} />
    </mesh>
  );
}

// Line element - thin cylinder instead of line for better compatibility
function Line({
  start,
  end,
  color,
}: {
  start: [number, number, number];
  end: [number, number, number];
  color: string;
}) {
  const meshRef = useRef<THREE.Mesh>(null);

  // Calculate line properties
  const startVec = new THREE.Vector3(...start);
  const endVec = new THREE.Vector3(...end);
  const midpoint = startVec.clone().add(endVec).multiplyScalar(0.5);
  const length = startVec.distanceTo(endVec);
  const direction = endVec.clone().sub(startVec).normalize();

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.z += Math.sin(state.clock.elapsedTime * 0.3) * 0.001;
    }
  });

  return (
    <Float speed={0.8} rotationIntensity={0.05} floatIntensity={0.2}>
      <mesh
        ref={meshRef}
        position={[midpoint.x, midpoint.y, midpoint.z]}
        rotation={[0, 0, Math.atan2(direction.y, direction.x)]}
      >
        <boxGeometry args={[length, 0.01, 0.01]} />
        <meshBasicMaterial color={color} transparent opacity={0.4} />
      </mesh>
    </Float>
  );
}

function Scene() {
  return (
    <>
      {/* Soft ambient lighting - warm tattoo studio vibe */}
      <ambientLight intensity={0.3} />
      <pointLight position={[5, 5, 5]} intensity={0.8} color="#f59e0b" />
      <pointLight position={[-5, -5, 5]} intensity={0.5} color="#dc2626" />
      <pointLight position={[0, 0, 3]} intensity={0.3} color="#fbbf24" />

      {/* Triangles - main tattoo design elements */}
      <Triangle position={[-2, 1, -1]} scale={0.8} color="#f59e0b" speed={1} />
      <Triangle position={[2.5, 0.5, -0.5]} scale={0.6} color="#d97706" speed={0.8} rotation={[0, 0, Math.PI / 6]} />
      <Triangle position={[-1.5, -1, -1.5]} scale={0.5} color="#dc2626" speed={1.2} rotation={[0, 0, Math.PI]} />
      <Triangle position={[1, 1.5, -2]} scale={0.4} color="#fbbf24" speed={0.9} />

      {/* Hexagons - geometric elements */}
      <Hexagon position={[3, -0.5, -1]} scale={0.5} color="#f59e0b" wireframe />
      <Hexagon position={[-2.5, -0.8, -0.8]} scale={0.4} color="#b45309" />
      <Hexagon position={[0.5, -1.5, -1.2]} scale={0.3} color="#dc2626" wireframe />

      {/* Rings - circular patterns */}
      <Ring position={[-3, 0.5, -1.5]} radius={0.4} color="#f59e0b" />
      <Ring position={[2, -1.2, -1]} radius={0.3} color="#d97706" />
      <Ring position={[0, 2, -2]} radius={0.25} color="#dc2626" />

      {/* Diamonds */}
      <Diamond position={[1.5, 0, -0.5]} scale={0.7} color="#fbbf24" />
      <Diamond position={[-1, 0.8, -1]} scale={0.5} color="#b45309" />

      {/* Floating dots - ink splatter effect */}
      {[
        [-3.5, 1.5, -0.5], [3.5, 1, -1], [-2, -1.5, -0.8], [2.5, -1.5, -1],
        [-1, 2, -1.5], [1, -2, -0.5], [-3, -0.5, -1], [3, 0.5, -1.5],
        [0, 0.5, -0.3], [-0.5, -0.5, -0.5], [0.8, 0.8, -0.8], [-0.8, 1.2, -1],
      ].map((pos, i) => (
        <Dot
          key={i}
          position={pos as [number, number, number]}
          size={0.03 + (i % 3) * 0.015}
          color={i % 4 === 0 ? "#f59e0b" : i % 4 === 1 ? "#d97706" : i % 4 === 2 ? "#dc2626" : "#fbbf24"}
        />
      ))}

      {/* Subtle lines - needle/linework inspiration */}
      <Line start={[-2, 1.5, -1]} end={[-1, 0.5, -1]} color="#f59e0b" />
      <Line start={[1.5, 1, -1]} end={[2.5, 0, -1]} color="#d97706" />
      <Line start={[-1.5, -0.5, -1]} end={[-0.5, -1.5, -1]} color="#dc2626" />
    </>
  );
}

export function HeroScene() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="absolute inset-0 z-0 bg-gradient-to-br from-amber-900/20 via-black to-red-900/20" />
    );
  }

  return (
    <div className="absolute inset-0 z-0">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
        dpr={[1, 2]}
        style={{ background: "transparent" }}
      >
        <Suspense fallback={null}>
          <Scene />
        </Suspense>
      </Canvas>
    </div>
  );
}
