import { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { RoundedBox } from '@react-three/drei';
import { ExtrudeGeometry, Shape } from 'three';

const COLORS = {
  body: '#b8a9ff',
  glass: '#2e2a45',
  tire: '#3b3552',
  rim: '#e6e3ef',
  trim: '#2a2638',
  grille: '#2a2638',
  headlight: '#fffaf0',
  taillight: '#ff5f8f',
};

// 사탕처럼 반짝이는 파스텔 도장. 스튜디오 조명이 비쳐 보인다.
function PaintMaterial({ color }) {
  return (
    <meshPhysicalMaterial
      color={color}
      roughness={0.32}
      metalness={0.08}
      clearcoat={1}
      clearcoatRoughness={0.06}
      sheen={0.6}
      sheenColor="#ffffff"
      envMapIntensity={1.2}
    />
  );
}

// 말랑한 고무 장난감 같은 재질
function SoftMaterial({ color, ...props }) {
  return (
    <meshPhysicalMaterial
      color={color}
      roughness={0.45}
      clearcoat={0.6}
      clearcoatRoughness={0.3}
      sheen={1}
      sheenRoughness={0.7}
      sheenColor="#ffffff"
      {...props}
    />
  );
}

function GlassMaterial() {
  return (
    <meshPhysicalMaterial
      color={COLORS.glass}
      roughness={0.04}
      metalness={0.2}
      clearcoat={1}
      clearcoatRoughness={0.02}
      envMapIntensity={1.8}
    />
  );
}

// 옆에서 본 모양(x: 앞뒤, y: 높이)을 그려서 폭(z)만큼 밀어내 입체로 만든다.
// bevel 값으로 모서리를 둥글게 해서 말랑한 느낌을 낸다.
function extrude(draw, depth, bevel) {
  const shape = new Shape();
  draw(shape);
  const geometry = new ExtrudeGeometry(shape, {
    depth,
    curveSegments: 32,
    bevelEnabled: true,
    bevelThickness: bevel,
    bevelSize: bevel * 0.85,
    bevelSegments: 8,
  });
  geometry.translate(0, 0, -depth / 2);
  geometry.computeVertexNormals();
  return geometry;
}

// 아래 차체: 짧은 앞 오버행, 긴 보닛, 높은 트렁크 라인
const WHEEL_X = 1.28;
const WHEEL_Y = 0.41;
// 모서리를 둥글게 깎는 만큼(bevel) 아치가 좁아지므로 바퀴보다 넉넉하게 판다.
const ARCH_RADIUS = 0.58;

const drawArch = (s, centerX) => {
  s.lineTo(centerX - ARCH_RADIUS, 0.32);
  s.lineTo(centerX - ARCH_RADIUS, WHEEL_Y);
  s.absarc(centerX, WHEEL_Y, ARCH_RADIUS, Math.PI, 0, true);
  s.lineTo(centerX + ARCH_RADIUS, 0.32);
};

const drawLowerBody = (s) => {
  s.moveTo(-2.0, 0.32);
  drawArch(s, -WHEEL_X);
  drawArch(s, WHEEL_X);
  s.lineTo(1.95, 0.32);
  s.quadraticCurveTo(2.14, 0.34, 2.12, 0.56);
  s.quadraticCurveTo(2.1, 0.8, 1.85, 0.84);
  s.lineTo(0.7, 0.98);
  s.lineTo(-1.55, 1.0);
  s.quadraticCurveTo(-2.0, 1.0, -2.06, 0.78);
  s.quadraticCurveTo(-2.12, 0.4, -2.0, 0.32);
};

// 유리 부분: 누운 앞유리, 뒤로 길게 흐르는 패스트백 지붕선
const drawGlass = (s) => {
  s.moveTo(0.72, 0.96);
  s.quadraticCurveTo(0.35, 1.16, 0.0, 1.42);
  s.quadraticCurveTo(-0.35, 1.5, -0.75, 1.46);
  s.quadraticCurveTo(-1.25, 1.3, -1.62, 1.0);
  s.lineTo(0.72, 0.96);
};

// 지붕: 유리 위에 차체 색으로 덮는 얇은 판
const drawRoof = (s) => {
  s.moveTo(0.04, 1.42);
  s.quadraticCurveTo(-0.35, 1.52, -0.78, 1.47);
  s.lineTo(-0.76, 1.4);
  s.quadraticCurveTo(-0.35, 1.44, 0.08, 1.36);
  s.lineTo(0.04, 1.42);
};

const WHEEL_POSITIONS = [
  [WHEEL_X, WHEEL_Y, 0.66],
  [WHEEL_X, WHEEL_Y, -0.66],
  [-WHEEL_X, WHEEL_Y, 0.66],
  [-WHEEL_X, WHEEL_Y, -0.66],
];

const SPOKES = [0, 1, 2, 3, 4].map((index) => (index * Math.PI * 2) / 5);

// 도넛(토러스) 모양 타이어라 바퀴 모서리까지 동글동글하다. 바깥쪽에 5개 살 휠을 단다.
function Wheel({ position }) {
  const outward = position[2] > 0 ? 1 : -1;

  return (
    <group position={position}>
      <mesh>
        <torusGeometry args={[0.27, 0.14, 24, 48]} />
        <SoftMaterial color={COLORS.tire} roughness={0.8} clearcoat={0} />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.22, 0.22, 0.2, 32]} />
        <meshPhysicalMaterial color={COLORS.trim} roughness={0.5} />
      </mesh>
      <group position={[0, 0, outward * 0.1]}>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.07, 0.07, 0.04, 20]} />
          <meshPhysicalMaterial color={COLORS.rim} metalness={0.9} roughness={0.2} />
        </mesh>
        {SPOKES.map((angle) => (
          <mesh key={angle} rotation={[0, 0, angle]} position={[Math.sin(-angle) * 0.12, Math.cos(angle) * 0.12, 0]}>
            <boxGeometry args={[0.055, 0.2, 0.03]} />
            <meshPhysicalMaterial color={COLORS.rim} metalness={0.9} roughness={0.2} />
          </mesh>
        ))}
        <mesh>
          <torusGeometry args={[0.215, 0.018, 12, 48]} />
          <meshPhysicalMaterial color={COLORS.rim} metalness={0.9} roughness={0.2} />
        </mesh>
      </group>
    </group>
  );
}

function Lamp({ position, size, color, glow }) {
  return (
    <RoundedBox args={size} radius={0.03} smoothness={4} position={position}>
      <SoftMaterial color={color} emissive={color} emissiveIntensity={glow} />
    </RoundedBox>
  );
}

// 누르면 납작해졌다가 튕겨 오르는 스프링 값
const STIFFNESS = 220;
const DAMPING = 9;
const PRESSED_HEIGHT = 0.7;

export default function ToyCar() {
  const group = useRef();
  const spring = useRef({ value: 1, velocity: 0, target: 1 });

  const geometries = useMemo(
    () => ({
      lowerBody: extrude(drawLowerBody, 1.36, 0.14),
      glass: extrude(drawGlass, 1.26, 0.07),
      roof: extrude(drawRoof, 1.3, 0.05),
    }),
    []
  );

  useEffect(() => () => Object.values(geometries).forEach((geometry) => geometry.dispose()), [geometries]);

  const press = () => {
    spring.current.target = PRESSED_HEIGHT;
  };

  const release = () => {
    spring.current.target = 1;
  };

  // 손가락을 차 밖에서 떼도 원래대로 돌아오게 한다.
  useEffect(() => {
    window.addEventListener('pointerup', release);
    return () => window.removeEventListener('pointerup', release);
  }, []);

  useFrame((state, delta) => {
    const s = spring.current;
    const dt = Math.min(delta, 1 / 30);
    const acceleration = STIFFNESS * (s.target - s.value) - DAMPING * s.velocity;
    s.velocity += acceleration * dt;
    s.value += s.velocity * dt;

    // 위아래로 눌린 만큼 옆으로 퍼져서 부피가 유지되는 것처럼 보이게 한다.
    // 가만히 있어도 숨 쉬듯 아주 살짝 들썩인다.
    const height = s.value * (1 + 0.012 * Math.sin(state.clock.elapsedTime * 2.2));
    const side = 1 / Math.sqrt(height);
    group.current.scale.set(side, height, side);
  });

  return (
    <group
      ref={group}
      onPointerDown={press}
      onPointerOver={() => (document.body.style.cursor = 'grab')}
      onPointerOut={() => (document.body.style.cursor = '')}
    >
      <mesh geometry={geometries.lowerBody}>
        <PaintMaterial color={COLORS.body} />
      </mesh>
      <mesh geometry={geometries.glass}>
        <GlassMaterial />
      </mesh>
      <mesh geometry={geometries.roof}>
        <PaintMaterial color={COLORS.body} />
      </mesh>

      {/* 앞뒤 문 사이 기둥 */}
      <RoundedBox args={[0.08, 0.42, 1.38]} radius={0.03} position={[-0.34, 1.2, 0]}>
        <PaintMaterial color={COLORS.body} />
      </RoundedBox>

      {/* 사이드미러와 도어 손잡이 */}
      {[1, -1].map((side) => (
        <group key={side}>
          <RoundedBox args={[0.2, 0.11, 0.16]} radius={0.05} position={[0.6, 1.06, side * 0.86]}>
            <PaintMaterial color={COLORS.body} />
          </RoundedBox>
          {[0.1, -0.72].map((x) => (
            <RoundedBox key={x} args={[0.14, 0.03, 0.03]} radius={0.012} position={[x, 0.86, side * 0.83]}>
              <meshPhysicalMaterial color={COLORS.rim} metalness={0.9} roughness={0.2} />
            </RoundedBox>
          ))}
        </group>
      ))}

      {WHEEL_POSITIONS.map((position) => (
        <Wheel key={position.join()} position={position} />
      ))}

      {/* 앞: 가로로 긴 헤드램프와 아래쪽 공기 흡입구 */}
      {[0.5, -0.5].map((z) => (
        <Lamp key={`h${z}`} position={[2.12, 0.74, z]} size={[0.08, 0.09, 0.44]} color={COLORS.headlight} glow={0.6} />
      ))}
      <RoundedBox args={[0.06, 0.14, 0.9]} radius={0.04} position={[2.2, 0.48, 0]}>
        <SoftMaterial color={COLORS.grille} roughness={0.6} clearcoat={0} />
      </RoundedBox>

      {/* 뒤: 가로로 긴 테일램프 */}
      {[0.48, -0.48].map((z) => (
        <Lamp key={`t${z}`} position={[-2.15, 0.86, z]} size={[0.06, 0.09, 0.46]} color={COLORS.taillight} glow={0.5} />
      ))}
    </group>
  );
}
