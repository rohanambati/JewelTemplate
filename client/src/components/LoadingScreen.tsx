import { useRef, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import * as THREE from 'three';
import { Ring } from './Ring3D';

export default function LoadingScreen({ progress = 0 }) {
  const normalizedProgress = Math.min(progress / 100, 0.99); // Cap at 99% until fully loaded
  
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-foreground/80 backdrop-blur-sm text-background">
      <div className="w-64 h-64">
        <Canvas 
          camera={{ position: [0, 0, 3], fov: 50 }}
          gl={{ antialias: true }}
          className="w-full h-full"
        >
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} intensity={1} />
          <pointLight position={[-10, -10, -10]} intensity={0.5} />
          <Ring progress={normalizedProgress} />
        </Canvas>
      </div>
      <div className="mt-8 text-center">
        <h2 className="text-2xl font-light mb-4">SparkleForge</h2>
        <div className="w-64 h-1 bg-background/20 rounded-full overflow-hidden">
          <div 
            className="h-full bg-background transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-background/70 mt-2 text-sm">
          {progress < 100 ? `Loading ${Math.round(progress)}%` : 'Almost there...'}
        </p>
      </div>
    </div>
  );
}
