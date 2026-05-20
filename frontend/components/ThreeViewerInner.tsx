'use client';

import { Suspense, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, useGLTF, Environment, Center, ContactShadows } from '@react-three/drei';
import type * as THREE from 'three';

function Model({ url, autoRotate }: { url: string; autoRotate: boolean }) {
  const { scene } = useGLTF(url);
  const groupRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (autoRotate && groupRef.current) {
      groupRef.current.rotation.y += delta * 0.4;
    }
  });

  return (
    <group ref={groupRef}>
      <Center>
        <primitive object={scene} />
      </Center>
    </group>
  );
}

function Loader() {
  return (
    <mesh>
      <boxGeometry args={[0.5, 0.5, 0.5]} />
      <meshStandardMaterial color="#7c6fff" wireframe />
    </mesh>
  );
}

interface Props {
  modelUrl: string;
}

export default function ThreeViewerInner({ modelUrl }: Props) {
  const [autoRotate, setAutoRotate] = useState(true);

  return (
    <div className="h-full w-full relative">
      <Canvas
        camera={{ position: [0, 1.5, 4], fov: 45, near: 0.01, far: 1000 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
      >
        <color attach="background" args={['#1a1a22']} />
        <ambientLight intensity={0.6} />
        <directionalLight position={[5, 8, 3]} intensity={1.2} castShadow />
        <directionalLight position={[-3, 2, -3]} intensity={0.4} color="#7c6fff" />

        <Suspense fallback={<Loader />}>
          <Model url={modelUrl} autoRotate={autoRotate} />
          <ContactShadows position={[0, -1.5, 0]} opacity={0.4} scale={8} blur={2} />
          <Environment preset="studio" />
        </Suspense>

        <OrbitControls
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          onStart={() => setAutoRotate(false)}
          makeDefault
        />
      </Canvas>

      <button
        onClick={() => setAutoRotate((v) => !v)}
        className={`absolute top-3 right-3 p-2 rounded-lg border text-xs transition-all backdrop-blur-sm
          ${autoRotate
            ? 'bg-accent/20 border-accent/40 text-accent'
            : 'bg-bg/50 border-border text-muted hover:text-fg'
          }`}
        title={autoRotate ? 'Pause rotation' : 'Auto rotate'}
      >
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
      </button>
    </div>
  );
}
