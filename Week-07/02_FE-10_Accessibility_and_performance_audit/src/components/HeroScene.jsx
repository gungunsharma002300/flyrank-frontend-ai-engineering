import { Canvas } from '@react-three/fiber';
import { Sparkles } from '@react-three/drei';
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing';
import HeroBlob from './HeroBlob';
import OrbitRings from './OrbitRings';
import SceneRig from './SceneRig';

export default function HeroScene({ theme, scrollProgress, onAdvanceTheme }) {
  return (
    <Canvas
      dpr={[1, 1.5]}
      camera={{ position: [0, 0, 4.4], fov: 45 }}
      gl={{ antialias: true, powerPreference: 'high-performance', alpha: true }}
    >
      <ambientLight intensity={0.4} />
      <directionalLight position={[3, 4, 4]} intensity={1.1} color="#ffffff" />
      <pointLight position={[-4, -2, -2]} intensity={0.8} color={theme.glow} />

      <SceneRig scrollProgress={scrollProgress}>
        <HeroBlob theme={theme} scrollProgress={scrollProgress} onAdvance={onAdvanceTheme} />
        <OrbitRings theme={theme} />
      </SceneRig>

      <Sparkles count={90} scale={7} size={2.4} speed={0.25} color={theme.glow} opacity={0.6} />

      <EffectComposer multisampling={0}>
        <Bloom mipmapBlur luminanceThreshold={0.35} luminanceSmoothing={0.25} intensity={0.7} />
        <Vignette eskil={false} offset={0.2} darkness={0.65} />
      </EffectComposer>
    </Canvas>
  );
}
