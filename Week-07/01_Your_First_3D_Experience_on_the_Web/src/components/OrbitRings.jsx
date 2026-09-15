import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';

export default function OrbitRings({ theme }) {
  const ringA = useRef();
  const ringB = useRef();

  useFrame((_, delta) => {
    if (ringA.current) {
      ringA.current.rotation.x += delta * 0.15;
      ringA.current.rotation.z += delta * 0.08;
    }
    if (ringB.current) {
      ringB.current.rotation.y += delta * 0.2;
      ringB.current.rotation.z -= delta * 0.1;
    }
  });

  return (
    <>
      <mesh ref={ringA} rotation={[Math.PI / 3, 0, 0]}>
        <torusGeometry args={[1.9, 0.006, 16, 120]} />
        <meshBasicMaterial color={theme.glow} transparent opacity={0.5} />
      </mesh>
      <mesh ref={ringB} rotation={[Math.PI / 2.4, Math.PI / 5, 0]}>
        <torusGeometry args={[2.35, 0.004, 16, 120]} />
        <meshBasicMaterial color={theme.glow} transparent opacity={0.3} />
      </mesh>
    </>
  );
}
