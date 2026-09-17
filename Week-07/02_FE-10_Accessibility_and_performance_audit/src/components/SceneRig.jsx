import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';

export default function SceneRig({ scrollProgress, children }) {
  const group = useRef();

  useFrame((state, delta) => {
    // Pointer parallax: gently tilt the group toward the cursor / touch point.
    const targetRotX = state.pointer.y * 0.18;
    const targetRotY = state.pointer.x * 0.25;
    if (group.current) {
      group.current.rotation.x += (targetRotX - group.current.rotation.x) * Math.min(delta * 3, 1);
      group.current.rotation.y += (targetRotY - group.current.rotation.y) * Math.min(delta * 3, 1);
    }

    // Scroll: pull the camera back and drift it up slightly as the visitor scrolls.
    const targetZ = 4.4 + scrollProgress * 2.6;
    const targetY = scrollProgress * 0.6;
    state.camera.position.z += (targetZ - state.camera.position.z) * Math.min(delta * 3, 1);
    state.camera.position.y += (targetY - state.camera.position.y) * Math.min(delta * 3, 1);
    state.camera.lookAt(0, 0, 0);
  });

  return <group ref={group}>{children}</group>;
}
