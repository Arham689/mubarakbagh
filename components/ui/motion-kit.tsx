"use client";

import {
  animate,
  motion,
  useInView,
  useMotionValue,
  useMotionTemplate,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "motion/react";
import { useEffect, useLayoutEffect, useRef, useState } from "react";

export const ease = [0.22, 1, 0.36, 1] as const;

/* ---------- Breakpoint / pointer helpers for mobile-safe effects ---------- */
export function useMedia(query: string, fallback = false) {
  const [match, setMatch] = useState(fallback);
  useEffect(() => {
    const m = window.matchMedia(query);
    const on = () => setMatch(m.matches);
    on();
    m.addEventListener("change", on);
    return () => m.removeEventListener("change", on);
  }, [query]);
  return match;
}
export const useIsMobile = () => useMedia("(max-width: 767px)");
/** True on touch devices — used to skip cursor-only effects (tilt, magnetic, cursor previews). */
export const useCoarsePointer = () => useMedia("(hover: none), (pointer: coarse)");

/* ---------- Word-by-word mask reveal (headline entrance) ---------- */
export function RevealText({
  text,
  className = "",
  delay = 0,
  as: Tag = "h2",
}: {
  text: string;
  className?: string;
  delay?: number;
  as?: "h1" | "h2" | "h3" | "p" | "span";
}) {
  const words = text.split(" ");
  // The in-view trigger lives on the visible wrapper: the hidden words sit outside
  // their clipping box, so observing them directly would never fire.
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -10% 0px" });
  return (
    <Tag ref={ref as never} className={className} aria-label={text}>
      {words.map((w, i) => (
        <span key={i} aria-hidden className="inline-block overflow-hidden pb-[0.08em] align-bottom">
          <motion.span
            className="inline-block"
            initial={{ y: "110%" }}
            animate={inView ? { y: "0%" } : { y: "110%" }}
            transition={{ duration: 1.1, ease, delay: delay + i * 0.06 }}
          >
            {w}
            {i < words.length - 1 ? " " : ""}
          </motion.span>
        </span>
      ))}
    </Tag>
  );
}

/* ---------- Letters rising one by one (hero wordmarks) ---------- */
export function RevealLetters({
  text,
  className = "",
  letterClassName = "",
  delay = 0,
}: {
  text: string;
  className?: string;
  /** Applied to each animated letter — use for gradient text (background-clip must sit on the letter itself). */
  letterClassName?: string;
  delay?: number;
}) {
  return (
    <span className={className} aria-label={text}>
      {text.split("").map((c, i) => (
        <span key={i} aria-hidden className="inline-block overflow-hidden align-bottom">
          <motion.span
            className={`inline-block ${letterClassName}`}
            initial={{ y: "105%", rotate: 6 }}
            animate={{ y: "0%", rotate: 0 }}
            transition={{ duration: 1.2, ease, delay: delay + i * 0.045 }}
          >
            {c === " " ? " " : c}
          </motion.span>
        </span>
      ))}
    </span>
  );
}

/* ---------- Scroll-linked word highlight (manifesto paragraphs) ---------- */
export function ScrollHighlight({ text, className = "" }: { text: string; className?: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 85%", "end 45%"] });
  const words = text.split(" ");
  return (
    <p ref={ref} className={className}>
      {words.map((w, i) => (
        <Word key={i} progress={scrollYProgress} range={[i / words.length, (i + 1) / words.length]}>
          {w}
        </Word>
      ))}
    </p>
  );
}
function Word({ children, progress, range }: { children: string; progress: MotionValue<number>; range: [number, number] }) {
  const opacity = useTransform(progress, range, [0.15, 1]);
  return (
    <motion.span style={{ opacity }} className="mr-[0.25em] inline-block">
      {children}
    </motion.span>
  );
}

/* ---------- Fade/slide up on view ---------- */
export function FadeUp({
  children,
  className = "",
  delay = 0,
  y = 40,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  y?: number;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-8% 0px" }}
      transition={{ duration: 1, ease, delay }}
    >
      {children}
    </motion.div>
  );
}

/* ---------- Magnetic hover (buttons, icons) ---------- */
export function Magnetic({ children, strength = 0.35, className = "" }: { children: React.ReactNode; strength?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const coarse = useCoarsePointer();
  const x = useSpring(0, { stiffness: 220, damping: 15, mass: 0.4 });
  const y = useSpring(0, { stiffness: 220, damping: 15, mass: 0.4 });
  return (
    <motion.div
      ref={ref}
      className={`inline-block ${className}`}
      style={{ x, y }}
      whileTap={{ scale: 0.96 }}
      onPointerMove={(e) => {
        if (coarse) return;
        const r = ref.current!.getBoundingClientRect();
        x.set((e.clientX - (r.left + r.width / 2)) * strength);
        y.set((e.clientY - (r.top + r.height / 2)) * strength);
      }}
      onPointerLeave={() => {
        x.set(0);
        y.set(0);
      }}
    >
      {children}
    </motion.div>
  );
}

/* ---------- Pill button with fill sweep ---------- */
export function SweepButton({
  children,
  tone = "dark",
  className = "",
}: {
  children: React.ReactNode;
  tone?: "dark" | "light" | "gold";
  className?: string;
}) {
  const tones = {
    dark: "border-ink text-ink [--fill:#1b1512] hover:text-ivory",
    light: "border-ivory/70 text-ivory [--fill:#f7f1e6] hover:text-ink",
    gold: "border-gold text-gold-soft [--fill:#b8914a] hover:text-maroon-deep",
  }[tone];
  return (
    <Magnetic>
      <button
        className={`group relative overflow-hidden rounded-full border px-8 py-4 text-[11px] tracking-[0.3em] uppercase transition-colors duration-500 ${tones} ${className}`}
      >
        <span className="absolute inset-0 translate-y-full rounded-full bg-[var(--fill)] transition-transform duration-500 ease-[cubic-bezier(.22,1,.36,1)] group-hover:translate-y-0" />
        <span className="relative">{children}</span>
      </button>
    </Magnetic>
  );
}

/* ---------- Animated underline link ---------- */
export function NavLink({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <a
      href="#"
      onClick={(e) => e.preventDefault()}
      // don't force inline-block when the caller hides it on mobile ("hidden md:inline-block")
      className={`group relative ${/\bhidden\b/.test(className) ? "" : "inline-block"} ${className}`}
    >
      {children}
      <span className="absolute -bottom-1 left-0 h-px w-full origin-right scale-x-0 bg-current transition-transform duration-500 group-hover:origin-left group-hover:scale-x-100" />
    </a>
  );
}

/* ---------- Infinite marquee ---------- */
export function Marquee({
  items,
  className = "",
  speed = 30,
  reverse = false,
  separator = "✦",
}: {
  items: string[];
  className?: string;
  speed?: number;
  reverse?: boolean;
  separator?: string;
}) {
  const row = (
    <div className="flex shrink-0 items-center">
      {items.map((t, i) => (
        <span key={i} className="flex items-center">
          <span className="px-8">{t}</span>
          <span className="text-gold">{separator}</span>
        </span>
      ))}
    </div>
  );
  return (
    <div className={`overflow-hidden whitespace-nowrap ${className}`}>
      <div
        className={`flex w-max ${reverse ? "animate-marquee-reverse" : "animate-marquee"}`}
        style={{ ["--marquee-speed" as string]: `${speed}s` }}
      >
        {row}
        {row}
      </div>
    </div>
  );
}

/* ---------- Vertical scroll -> horizontal track (pinned) ---------- */
export function HorizontalScroll({
  children,
  className = "",
  trackClassName = "",
  header,
  onProgress,
}: {
  children: React.ReactNode;
  className?: string;
  trackClassName?: string;
  header?: React.ReactNode;
  onProgress?: (p: MotionValue<number>) => void;
}) {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [distance, setDistance] = useState(0);
  const [vh, setVh] = useState(800);

  useLayoutEffect(() => {
    const measure = () => {
      if (!trackRef.current) return;
      setDistance(Math.max(0, trackRef.current.scrollWidth - window.innerWidth));
      setVh(window.innerHeight);
    };
    measure();
    const ro = new ResizeObserver(measure);
    if (trackRef.current) ro.observe(trackRef.current);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, []);

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end end"] });
  useEffect(() => onProgress?.(scrollYProgress), [onProgress, scrollYProgress]);
  const raw = useTransform(scrollYProgress, (v) => -v * distance);
  const x = useSpring(raw, { stiffness: 120, damping: 30, mass: 0.3 });

  return (
    <section ref={sectionRef} className={`relative ${className}`} style={{ height: distance + vh }}>
      <div className="sticky top-0 flex h-screen flex-col justify-center overflow-hidden">
        {header}
        <motion.div ref={trackRef} style={{ x }} className={`flex w-max will-change-transform ${trackClassName}`}>
          {children}
        </motion.div>
      </div>
    </section>
  );
}

/* ---------- 3D tilt card with glare ---------- */
export function TiltCard({
  children,
  className = "",
  max = 12,
  glare = true,
}: {
  children: React.ReactNode;
  className?: string;
  max?: number;
  glare?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const coarse = useCoarsePointer();
  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);
  const sx = useSpring(px, { stiffness: 180, damping: 18 });
  const sy = useSpring(py, { stiffness: 180, damping: 18 });
  const rotateY = useTransform(sx, [0, 1], [-max, max]);
  const rotateX = useTransform(sy, [0, 1], [max, -max]);
  const gx = useTransform(sx, (v) => `${v * 100}%`);
  const gy = useTransform(sy, (v) => `${v * 100}%`);
  const glareBg = useMotionTemplate`radial-gradient(circle at ${gx} ${gy}, rgba(255,240,210,.35), transparent 55%)`;

  return (
    <div style={{ perspective: 1000 }} className={className}>
      <motion.div
        ref={ref}
        className="relative h-full w-full [transform-style:preserve-3d]"
        style={{ rotateX, rotateY }}
        whileHover={{ scale: 1.02 }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
        whileTap={{ scale: 0.98 }}
        onPointerMove={(e) => {
          if (coarse) return;
          const r = ref.current!.getBoundingClientRect();
          px.set((e.clientX - r.left) / r.width);
          py.set((e.clientY - r.top) / r.height);
        }}
        onPointerLeave={() => {
          px.set(0.5);
          py.set(0.5);
        }}
      >
        {children}
        {glare && <motion.div className="pointer-events-none absolute inset-0 rounded-[inherit] mix-blend-soft-light" style={{ background: glareBg }} />}
      </motion.div>
    </div>
  );
}

/* ---------- Parallax image wrapper ---------- */
export function Parallax({ children, className = "", amount = 80 }: { children: React.ReactNode; className?: string; amount?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [-amount, amount]);
  return (
    <div ref={ref} className={`relative overflow-hidden ${className}`}>
      <motion.div style={{ y, top: -amount, bottom: -amount }} className="absolute inset-x-0">
        {children}
      </motion.div>
    </div>
  );
}

/* ---------- Count-up number ---------- */
export function CountUp({ to, suffix = "", className = "" }: { to: number; suffix?: string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10% 0px" });
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!inView) return;
    const c = animate(0, to, { duration: 2.2, ease: [0.16, 1, 0.3, 1], onUpdate: (v) => setVal(Math.round(v)) });
    return () => c.stop();
  }, [inView, to]);
  return (
    <span ref={ref} className={className}>
      {val.toLocaleString("en-IN")}
      {suffix}
    </span>
  );
}

/* ---------- Image curtain reveal on view ---------- */
export function CurtainReveal({
  children,
  className = "",
  color = "#f7f1e6",
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  color?: string;
  delay?: number;
}) {
  return (
    <div className={`relative overflow-hidden ${className}`}>
      <motion.div
        className="absolute inset-0"
        initial={{ scale: 1.25 }}
        whileInView={{ scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.6, ease, delay }}
      >
        {children}
      </motion.div>
      <motion.div
        className="absolute inset-0 z-10 origin-top"
        style={{ background: color }}
        initial={{ scaleY: 1 }}
        whileInView={{ scaleY: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 1.1, ease, delay }}
      />
    </div>
  );
}
