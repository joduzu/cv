
import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Box, Environment, PerspectiveCamera, MeshDistortMaterial, Cloud } from '@react-three/drei';
import * as THREE from 'three';

const Wave = ({ position, delay }: { position: [number, number, number], delay: number }) => {
    const ref = useRef<THREE.Mesh>(null);
    useFrame((state) => {
        if (ref.current) {
            const t = state.clock.getElapsedTime();
            ref.current.position.y = position[1] + Math.sin(t + delay) * 0.15;
        }
    });
    return (
        <mesh ref={ref} position={position} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[2, 2, 16, 16]} />
            <MeshDistortMaterial color="#0ea5e9" speed={2} distort={0.3} transparent opacity={0.8} />
        </mesh>
    )
}

const LandChunk = ({ position, color }: { position: [number, number, number], color: string }) => {
    return (
        <Box args={[1.9, 0.5, 1.9]} position={position}>
            <meshStandardMaterial color={color} roughness={0.6} />
        </Box>
    )
}

export const CoastalHeroScene: React.FC = () => {
  return (
    <div className="absolute inset-0 z-0">
      <Canvas>
        <PerspectiveCamera makeDefault position={[8, 6, 8]} fov={40} />
        <color attach="background" args={['#f8fafc']} />
        <ambientLight intensity={0.6} />
        <directionalLight position={[-5, 10, -5]} intensity={1} castShadow color="#fff7ed" />
        <pointLight position={[5, 5, 5]} intensity={0.5} color="#0ea5e9" />
        
        <Float speed={1} rotationIntensity={0.05} floatIntensity={0.1}>
           <group position={[0, -1, 0]} rotation={[0, -Math.PI / 4, 0]}>
                
                {/* Hydrogeology / Water System Concept */}
                
                {/* Water Source */}
                <group position={[-2, 0, -2]}>
                    <Wave position={[0, 0.2, 0]} delay={0} />
                    <Wave position={[0, 0.2, 2]} delay={1} />
                    <Wave position={[2, 0.2, 0]} delay={0.5} />
                    <Box args={[4, 0.8, 4]} position={[1, -0.4, 1]}>
                        <meshStandardMaterial color="#0284c7" transparent opacity={0.9} />
                    </Box>
                </group>

                {/* Land / Geology Layers */}
                <group position={[2, 0, 2]}>
                     <LandChunk position={[0, 0, 0]} color="#e2e8f0" /> {/* Topo */}
                     <LandChunk position={[2, -0.2, 0]} color="#cbd5e1" />
                     <LandChunk position={[0, -0.2, 2]} color="#cbd5e1" />
                     
                     {/* Abstract Infrastructure Blocks */}
                     <Box args={[0.5, 0.5, 0.5]} position={[0.5, 0.5, 0.5]}>
                        <meshStandardMaterial color="#d97706" />
                     </Box>
                     <Box args={[0.5, 0.8, 0.5]} position={[1.5, 0.6, 0.5]}>
                        <meshStandardMaterial color="#0f172a" />
                     </Box>
                </group>

           </group>
        </Float>

        <Cloud opacity={0.3} speed={0.2} bounds={[10, 2, 1.5]} segments={10} position={[-5, 2, -5]} color="#e2e8f0" />
        <Environment preset="city" />
        <fog attach="fog" args={['#f8fafc', 5, 25]} />
      </Canvas>
    </div>
  );
};
