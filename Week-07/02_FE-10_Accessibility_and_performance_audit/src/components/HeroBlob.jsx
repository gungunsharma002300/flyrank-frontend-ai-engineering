import { useEffect, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';

const tmpColor = new THREE.Color();

export default function HeroBlob({ theme, scrollProgress, onAdvance }) {
  const mesh = useRef();
  const material = useRef();
  const targetColor = useRef(new THREE.Color(theme.core));

  // Update the lerp target only when the theme actually changes.
  useEffect(() => {
    targetColor.current.set(theme.core);
  }, [theme]);

  useFrame((state, delta) => {
    if (mesh.current) {
      mesh.current.rotation.x += delta * (0.12 + scrollProgress * 0.25);
      mesh.current.rotation.y += delta * (0.18 + scrollProgress * 0.35);
      const breathe = 1 + Math.sin(state.clock.elapsedTime * 0.6) * 0.03;
      mesh.current.scale.setScalar(breathe);
    }
    if (material.current) {
      tmpColor.copy(material.current.color);
      tmpColor.lerp(targetColor.current, Math.min(delta * 4, 1));
      material.current.color.copy(tmpColor);
      material.current.distort = 0.35 + scrollProgress * 0.25;
    }
  });

  return (
    <mesh
      ref={mesh}
      castShadow
      onClick={(e) => {
        e.stopPropagation();
        onAdvance();
      }}
      onPointerOver={() => (document.body.style.cursor = 'pointer')}
      onPointerOut={() => (document.body.style.cursor = 'auto')}
    >
      <icosahedronGeometry args={[1.15, 12]} />
      <MeshDistortMaterial
        ref={material}
        color={theme.core}
        speed={2.2}
        distort={0.35}
        radius={1}
        roughness={0.15}
        metalness={0.6}
        clearcoat={0.4}
        clearcoatRoughness={0.2}
      />
    </mesh>
  );
}
