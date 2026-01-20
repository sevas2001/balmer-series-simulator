import React, { useRef, useMemo, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text, Html, Sphere, Trail } from '@react-three/drei';
import * as THREE from 'three';
import { SimulationState } from '../types';

interface Atom3DProps {
    state: SimulationState;
}

const Nucleus = () => {
    return (
        <group>
            <Sphere args={[0.4, 32, 32]}>
                <meshStandardMaterial color="#ef4444" emissive="#7f1d1d" emissiveIntensity={0.5} roughness={0.2} />
            </Sphere>
            {/* Protons/Neutrons rough visual */}
            <Sphere args={[0.25, 32, 32]} position={[0.2, 0.2, 0]}>
                <meshStandardMaterial color="#ef4444" />
            </Sphere>
            <Sphere args={[0.25, 32, 32]} position={[-0.2, -0.1, 0.2]}>
                <meshStandardMaterial color="#94a3b8" />
            </Sphere>
            <Sphere args={[0.25, 32, 32]} position={[0.1, -0.3, -0.1]}>
                <meshStandardMaterial color="#94a3b8" />
            </Sphere>
            <pointLight position={[0, 0, 0]} intensity={2} distance={5} color="#ef4444" />
        </group>
    );
};

const Photon = ({ position, color, onUnmount }: { position: THREE.Vector3, color: string, onUnmount: () => void }) => {
    const ref = useRef<THREE.Group>(null);
    const [t, setT] = useState(0);

    // Store initial direction vector to move away from center
    // Normalizing position gives direction from (0,0,0)
    const direction = useMemo(() => position.clone().normalize(), []);
    const startPos = useMemo(() => position.clone(), []);

    useFrame((state, delta) => {
        if (!ref.current) return;
        setT(prev => prev + delta);

        // Move outwards
        const speed = 5.0;
        ref.current.position.copy(startPos).add(direction.clone().multiplyScalar(t * speed));

        // Sine wave oscillation for "wave" effect perpendicular to direction? 
        // Simplification: Just wiggle slightly or scale
        const scale = 1 + Math.sin(t * 10) * 0.2;
        ref.current.scale.setScalar(scale);

        if (t > 2.0) {
            onUnmount();
        }
    });

    return (
        <group ref={ref} position={startPos}>
            <mesh>
                <sphereGeometry args={[0.15, 16, 16]} />
                <meshBasicMaterial color={color} transparent opacity={1.0 - t / 2.0} />
            </mesh>
            <pointLight distance={2} intensity={2} color={color} />
        </group>
    );
};

const Electron = ({ activeTransition }: { activeTransition: number | null }) => {
    const electronRef = useRef<THREE.Mesh>(null);
    const [targetLevel, setTargetLevel] = useState(2);
    const [currentLevel, setCurrentLevel] = useState(2);
    const [angle, setAngle] = useState(0);

    // Photon State
    const [photons, setPhotons] = useState<{ id: number, position: THREE.Vector3, color: string }[]>([]);
    const photonIdCounter = useRef(0);

    // Orbits radii: simplistic visualization scaling (not exact n^2 to manage screen space)
    // n=1: 1.5, n=2: 2.5, n=3: 3.5, n=4: 4.5, n=5: 5.5, n=6: 6.5
    const getRadius = (n: number) => 1.5 + (n - 1) * 1.0;

    useEffect(() => {
        if (activeTransition) {
            // Instant jump to start level for clarity of "Here is where we start"
            setCurrentLevel(activeTransition);
            // Delay the drop to let user see it appear at start
            const timer = setTimeout(() => {
                setTargetLevel(2);
            }, 500);
            return () => clearTimeout(timer);
        } else {
            setTargetLevel(2);
        }
    }, [activeTransition]);

    useFrame((state, delta) => {
        if (!electronRef.current) return;

        setAngle((prev) => prev + delta * (2 / Math.sqrt(currentLevel)));

        // Animate radius
        let r = getRadius(currentLevel);
        if (currentLevel !== targetLevel) {
            const speed = 4.0 * delta; // Faster drop

            // Check if we are about to finish a drop (emission point)
            const oldLevel = currentLevel;

            if (currentLevel > targetLevel) {
                const nextLevel = Math.max(targetLevel, currentLevel - speed);
                setCurrentLevel(nextLevel);

                // Trigger photon emission right as it starts dropping or midway? 
                // Let's do it when it reaches the destination (or close to it)
                if (oldLevel > 2.1 && nextLevel <= 2.1) {
                    // Just landed
                    const n_initial = activeTransition || 3;
                    const color = n_initial === 3 ? '#FF2200' // Red
                        : n_initial === 4 ? '#00FFFF' // Cyan
                            : n_initial === 5 ? '#4444FF' // Blue
                                : '#7A00FF'; // Violet

                    const pos = electronRef.current.position.clone();

                    setPhotons(prev => [...prev, {
                        id: photonIdCounter.current++,
                        position: pos,
                        color: color
                    }]);
                }

            } else {
                setCurrentLevel(Math.min(targetLevel, currentLevel + speed));
            }
            r = getRadius(currentLevel);
        }

        electronRef.current.position.x = Math.cos(angle) * r;
        electronRef.current.position.z = Math.sin(angle) * r;
    });

    const removePhoton = (id: number) => {
        setPhotons(prev => prev.filter(p => p.id !== id));
    };

    return (
        <group>
            <Trail width={0.4} length={12} color="#38bdf8" attenuation={(t) => t}>
                <Sphere ref={electronRef} args={[0.15, 16, 16]}>
                    <meshBasicMaterial color="#38bdf8" />
                </Sphere>
            </Trail>
            {photons.map(p => (
                <Photon
                    key={p.id}
                    position={p.position}
                    color={p.color}
                    onUnmount={() => removePhoton(p.id)}
                />
            ))}
        </group>
    );
};

const OrbitRing = ({ n }: { n: number }) => {
    const radius = 1.5 + (n - 1) * 1.0;
    return (
        <group rotation={[Math.PI / 2, 0, 0]}>
            <mesh>
                <ringGeometry args={[radius - 0.02, radius + 0.02, 64]} />
                <meshBasicMaterial color="#ffffff" opacity={0.1} transparent side={THREE.DoubleSide} />
            </mesh>
            <Html position={[radius, 0, 0]} center>
                <div className="text-[10px] text-slate-500 font-mono select-none">n={n}</div>
            </Html>
        </group>
    );
};

export const Atom3D: React.FC<Atom3DProps> = ({ state }) => {
    return (
        <div className="w-full h-full min-h-[300px] bg-[#0B0F19] relative rounded-xl overflow-hidden shadow-inner border border-gray-800">
            <Canvas camera={{ position: [0, 5, 10], fov: 45 }}>
                <ambientLight intensity={0.5} />
                <pointLight position={[10, 10, 10]} intensity={1} />

                <Nucleus />
                {[1, 2, 3, 4, 5, 6].map(n => <OrbitRing key={n} n={n} />)}
                <Electron activeTransition={state.activeTransition} />

                <OrbitControls enableZoom={true} minDistance={5} maxDistance={20} />
            </Canvas>
            <div className="absolute top-2 left-2 pointer-events-none">
                <h3 className="text-slate-200 font-bold text-sm">Modelo de Bohr</h3>
                <p className="text-slate-500 text-xs">Visualización de Transiciones</p>
            </div>
        </div>
    );
};
