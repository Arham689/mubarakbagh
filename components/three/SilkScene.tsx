"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, Float, Lightformer, Sparkles, useTexture } from "@react-three/drei";
import { useMemo, useRef } from "react";
import * as THREE from "three";

const vertex = /* glsl */ `
  uniform float uTime;
  uniform vec2 uMouse;
  uniform float uScroll;
  varying vec2 vUv;
  varying float vWave;
  void main() {
    vUv = uv;
    vec3 p = position;
    // slow silk billow
    float w = sin(p.x * 1.4 + uTime * 0.8) * 0.12 + sin(p.y * 2.1 + uTime * 0.55) * 0.08;
    // ripple from the cursor
    float d = distance(uv, uMouse);
    w += smoothstep(0.38, 0.0, d) * 0.22 * sin(d * 20.0 - uTime * 3.2);
    // drape falls as you scroll
    w += uScroll * sin(uv.y * 3.14) * 0.6;
    p.z += w;
    vWave = w;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
  }
`;

const fragment = /* glsl */ `
  uniform sampler2D uTex;
  uniform float uTime;
  varying vec2 vUv;
  varying float vWave;
  void main() {
    vec3 c = texture2D(uTex, vUv).rgb;
    float shade = 0.8 + vWave * 1.8;
    // moving gold sheen like light across silk
    float sheen = smoothstep(0.85, 1.0, sin((vUv.x + vUv.y) * 6.0 - uTime * 0.9) * 0.5 + 0.5);
    vec3 gold = vec3(0.95, 0.78, 0.45);
    vec3 col = c * shade + gold * (max(vWave, 0.0) * 0.5 + sheen * 0.12);
    // soft vignette at the fabric edge
    float edge = smoothstep(0.0, 0.06, vUv.x) * smoothstep(1.0, 0.94, vUv.x) * smoothstep(0.0, 0.06, vUv.y) * smoothstep(1.0, 0.94, vUv.y);
    gl_FragColor = vec4(col, edge);
  }
`;

function Silk({ texUrl, mobile }: { texUrl: string; mobile: boolean }) {
  const tex = useTexture(texUrl);
  const mat = useRef<THREE.ShaderMaterial>(null);
  const mesh = useRef<THREE.Mesh>(null);
  const { viewport } = useThree();
  const mouse = useRef(new THREE.Vector2(0.5, 0.5));

  const uniforms = useMemo(
    () => ({
      uTex: { value: tex },
      uTime: { value: 0 },
      uMouse: { value: new THREE.Vector2(0.5, 0.5) },
      uScroll: { value: 0 },
    }),
    [tex],
  );

  const portrait = viewport.aspect < 1;
  const w = portrait ? viewport.width * 0.92 : Math.min(viewport.width * 0.62, viewport.height * 1.15);
  const h = portrait ? w * 1.35 : w * 0.66;
  const seg = mobile ? 48 : 110;

  useFrame((state, dt) => {
    if (!mat.current || !mesh.current) return;
    const u = mat.current.uniforms;
    u.uTime.value += dt;
    // on touch screens the "cursor" drifts on its own
    const target = mobile
      ? new THREE.Vector2(0.5 + Math.sin(u.uTime.value * 0.5) * 0.3, 0.5 + Math.cos(u.uTime.value * 0.4) * 0.3)
      : new THREE.Vector2(state.pointer.x * 0.5 + 0.5, state.pointer.y * 0.5 + 0.5);
    mouse.current.lerp(target, 0.06);
    u.uMouse.value.copy(mouse.current);
    const s = Math.min(window.scrollY / window.innerHeight, 1);
    u.uScroll.value = THREE.MathUtils.lerp(u.uScroll.value, s, 0.1);
    mesh.current.rotation.x = THREE.MathUtils.lerp(mesh.current.rotation.x, -0.18 - s * 0.5 + (mobile ? 0 : state.pointer.y * 0.06), 0.08);
    mesh.current.rotation.y = THREE.MathUtils.lerp(mesh.current.rotation.y, mobile ? 0 : state.pointer.x * 0.12, 0.08);
  });

  return (
    <mesh ref={mesh}>
      <planeGeometry args={[w, h, seg, seg]} />
      <shaderMaterial ref={mat} vertexShader={vertex} fragmentShader={fragment} uniforms={uniforms} transparent side={THREE.DoubleSide} />
    </mesh>
  );
}

function Bangle({ position, scale = 1, speed = 1 }: { position: [number, number, number]; scale?: number; speed?: number }) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((_, dt) => {
    if (ref.current) {
      ref.current.rotation.x += dt * 0.3 * speed;
      ref.current.rotation.y += dt * 0.45 * speed;
    }
  });
  return (
    <Float speed={1.6 * speed} rotationIntensity={0.6} floatIntensity={1.2}>
      <mesh ref={ref} position={position} scale={scale}>
        <torusGeometry args={[0.5, 0.07, 48, 160]} />
        <meshStandardMaterial color="#d9b25f" metalness={1} roughness={0.18} />
      </mesh>
    </Float>
  );
}

export default function SilkScene({ texUrl, mobile, active }: { texUrl: string; mobile: boolean; active: boolean }) {
  return (
    <Canvas
      frameloop={active ? "always" : "never"}
      dpr={[1, mobile ? 1.5 : 2]}
      camera={{ position: [0, 0, 5], fov: 35 }}
      gl={{ antialias: !mobile, alpha: true }}
    >
      <ambientLight intensity={0.4} />
      <directionalLight position={[3, 4, 5]} intensity={1.4} />
      {/* Studio reflections built from light panels — no HDR download needed */}
      <Environment resolution={mobile ? 64 : 256}>
        <Lightformer intensity={3} position={[0, 4, -6]} scale={[10, 2, 1]} color="#fff1d6" />
        <Lightformer intensity={2} position={[-5, 1, 1]} rotation-y={Math.PI / 2} scale={[8, 2, 1]} color="#f2c879" />
        <Lightformer intensity={1.5} position={[5, -1, 1]} rotation-y={-Math.PI / 2} scale={[8, 2, 1]} color="#8a2030" />
      </Environment>
      <Silk texUrl={texUrl} mobile={mobile} />
      <Bangle position={mobile ? [-0.9, 1.9, 0.8] : [-2.4, 0.9, 0.6]} scale={mobile ? 0.6 : 0.85} />
      <Bangle position={mobile ? [1.0, -1.9, 1] : [2.5, -0.8, 0.9]} scale={mobile ? 0.5 : 0.7} speed={1.3} />
      {!mobile && <Bangle position={[1.9, 1.3, -0.4]} scale={0.45} speed={0.8} />}
      <Sparkles count={mobile ? 40 : 90} scale={[8, 5, 3]} size={2.2} speed={0.35} color="#f1d58a" opacity={0.8} />
    </Canvas>
  );
}
