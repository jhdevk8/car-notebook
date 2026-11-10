import { useEffect, useRef, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { ContactShadows, Environment, Lightformer, OrbitControls } from '@react-three/drei';
import ToyCar from './ToyCar.jsx';

// 손을 떼고 이만큼 지나면 다시 천천히 돌기 시작한다.
const RESUME_AUTO_ROTATE_MS = 3000;

export default function CarScene() {
  const [autoRotate, setAutoRotate] = useState(true);
  const timer = useRef(null);

  useEffect(() => () => clearTimeout(timer.current), []);

  const pauseAutoRotate = () => {
    clearTimeout(timer.current);
    setAutoRotate(false);
  };

  const resumeAutoRotateLater = () => {
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setAutoRotate(true), RESUME_AUTO_ROTATE_MS);
  };

  return (
    <Canvas dpr={[1, 2]} camera={{ position: [5.5, 2.9, 6.2], fov: 32 }}>
      <hemisphereLight args={['#ffffff', '#c9b8ff', 0.6]} />
      <directionalLight position={[4, 6, 3]} intensity={1.1} />

      {/* 사진 스튜디오처럼 큰 조명판을 둘러서 차체에 반사가 비치게 한다. 외부 파일 없이 만든다. */}
      <Environment resolution={256}>
        <Lightformer form="rect" intensity={2.2} position={[0, 5, 0]} rotation-x={Math.PI / 2} scale={[10, 6, 1]} />
        <Lightformer form="rect" intensity={1.4} color="#d9ccff" position={[-6, 1.5, 0]} rotation-y={Math.PI / 2} scale={[12, 1.6, 1]} />
        <Lightformer form="rect" intensity={1.4} color="#ffd6ef" position={[6, 1.5, 0]} rotation-y={-Math.PI / 2} scale={[12, 1.6, 1]} />
        <Lightformer form="ring" intensity={1.6} position={[0, 2.5, 7]} scale={3} />
      </Environment>

      <ToyCar />
      <ContactShadows position={[0, 0, 0]} opacity={0.35} scale={9} blur={2.4} far={2} />

      <OrbitControls
        enablePan={false}
        enableZoom={false}
        minPolarAngle={Math.PI / 5}
        maxPolarAngle={Math.PI / 2.15}
        target={[0, 0.8, 0]}
        autoRotate={autoRotate}
        autoRotateSpeed={1.2}
        onStart={pauseAutoRotate}
        onEnd={resumeAutoRotateLater}
      />
    </Canvas>
  );
}
