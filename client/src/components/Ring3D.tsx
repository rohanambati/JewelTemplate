import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export function Ring({ progress = 0 }) {
  const ringRef = useRef<THREE.Mesh>(null);
  const diamondRef = useRef<THREE.Mesh>(null);
  const ringGeometry = useMemo(() => new THREE.TorusGeometry(1, 0.1, 16, 100), []);
  const diamondGeometry = useMemo(() => new THREE.OctahedronGeometry(0.3, 0), []);
  const ringMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#e6e6e6',
    metalness: 0.8,
    roughness: 0.2,
    envMapIntensity: 1,
  }), []);
  const diamondMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#ffffff',
    metalness: 0.1,
    roughness: 0.1,
    transparent: true,
    opacity: 0.9,
    envMapIntensity: 1,
  }), []);

  useFrame(() => {
    if (ringRef.current) ringRef.current.rotation.y += 0.01;
    if (diamondRef.current) diamondRef.current.rotation.y += 0.02;
  });

  return (
    <>
      <mesh ref={ringRef} geometry={ringGeometry} material={ringMaterial} rotation={[Math.PI / 2, 0, 0]} />
      <group ref={diamondRef} position={[0, 0, 0]}>
        <mesh geometry={diamondGeometry} material={diamondMaterial} position={[0, 0, 0]} />
      </group>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[1.6, 1.7, 64, 1, Math.PI * 1.5, Math.PI * 2 * progress]} />
        <meshBasicMaterial color="#ffffff" side={THREE.DoubleSide} transparent opacity={0.8} />
      </mesh>
    </>
  );
}

export function LoadingRing3D({ progress = 0 }) {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black bg-opacity-90">
      <div className="w-64 h-64">
        <Canvas camera={{ position: [0, 0, 3], fov: 50 }}>
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} intensity={1} />
          <pointLight position={[-10, -10, -10]} intensity={0.5} />
          <Ring progress={progress} />
        </Canvas>
      </div>
      <div className="mt-8 text-center">
        <h2 className="text-2xl font-light text-white mb-4">SparkleForge</h2>
        <div className="w-64 h-1 bg-white bg-opacity-20 rounded-full overflow-hidden">
          <div 
            className="h-full bg-white transition-all duration-300 ease-out"
            style={{ width: `${progress * 100}%` }}
          />
        </div>
        <p className="text-white text-opacity-70 mt-2 text-sm">
          Loading {Math.round(progress * 100)}%
        </p>
      </div>
    </div>
  );
}
