"use client";

import { AnimatePresence, motion, useScroll, useSpring, useTransform, type MotionValue } from "motion/react";
import { useRef, useState } from "react";
import Img from "@/components/ui/Img";
import { img, type Photo } from "@/lib/images";
import { ease, Magnetic, NavLink, RevealText, useCoarsePointer } from "@/components/ui/motion-kit";

const bento: { p: Photo; label: string; cls: string }[] = [
  { p: img.redBridal, label: "Bridal", cls: "col-span-2 row-span-2 md:col-span-1 md:row-span-2" },
  { p: img.mintKanjivaram, label: "Kanjivaram", cls: "md:col-span-1" },
  { p: img.zardozi2, label: "Zardozi", cls: "md:col-span-1" },
  { p: img.tieDye, label: "Leheriya", cls: "row-span-2 md:row-span-1" },
  { p: img.hawaPink, label: "Jaipur Edit", cls: "md:col-span-2" },
  { p: img.violetSilk, label: "Paithani", cls: "md:col-span-1" },
];

const stack: { p: Photo; title: string; body: string; bg: string; fg: string }[] = [
  { p: img.roseSilk, title: "Sarees", body: "Banarasi, Kanjivaram and Paithani — six yards of inheritance, woven by hand.", bg: "#f1e4cf", fg: "#4a0f14" },
  { p: img.mustardLehenga, title: "Lehengas", body: "Kalidar skirts with up to 24 panels, finished in gota, dabka and mirror.", bg: "#4a0f14", fg: "#f7f1e6" },
  { p: img.nightBride, title: "Bridal", body: "Bespoke couture with three fittings and a lifetime of restoration care.", bg: "#b0245a", fg: "#fff4ec" },
  { p: img.ivory, title: "Festive", body: "Light chikankari and tissue drapes for sangeet, haldi and every Diwali after.", bg: "#22070a", fg: "#e6cf9c" },
];

const index: { p: Photo; name: string; meta: string }[] = [
  { p: img.archLehenga, name: "Darbar", meta: "Lehenga · 12 looks" },
  { p: img.purpleBorder, name: "Neelambari", meta: "Saree · 9 looks" },
  { p: img.coralBride, name: "Gulnaar", meta: "Bridal · 6 looks" },
  { p: img.forestLight, name: "Shaam-e-Awadh", meta: "Chanderi · 8 looks" },
  { p: img.pinkSilk, name: "Basant Bahar", meta: "Banarasi · 11 looks" },
];

function StackCard({
  c,
  i,
  progress,
  range,
  targetScale,
}: {
  c: (typeof stack)[number];
  i: number;
  progress: MotionValue<number>;
  range: [number, number];
  targetScale: number;
}) {
  const scale = useTransform(progress, range, [1, targetScale]);
  const inner = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: inner, offset: ["start end", "start start"] });
  const imgScale = useTransform(scrollYProgress, [0, 1], [1.6, 1]);
  return (
    <div className="sticky top-0 flex h-screen items-center justify-center px-4 md:px-10">
      <motion.div
        ref={inner}
        style={{ scale, top: `calc(-4vh + ${i * 22}px)`, background: c.bg, color: c.fg }}
        className="relative flex h-[72vh] w-full max-w-6xl origin-top flex-col overflow-hidden rounded-[32px] shadow-[0_30px_80px_-30px_rgba(34,7,10,.5)] md:h-[68vh] md:flex-row"
      >
        <div className="flex flex-1 flex-col justify-between p-7 md:p-12">
          <span className="font-display text-sm opacity-60">0{i + 1} / 0{stack.length}</span>
          <div>
            <h3 className="font-display text-5xl md:text-8xl">{c.title}</h3>
            <p className="mt-4 max-w-sm text-sm leading-relaxed opacity-75 md:text-base">{c.body}</p>
            <button className="group mt-6 inline-flex items-center gap-3 text-[11px] tracking-[0.3em] uppercase">
              Explore
              <span className="inline-block transition-transform duration-300 group-hover:translate-x-2">⟶</span>
            </button>
          </div>
        </div>
        <div className="relative h-[42%] overflow-hidden md:h-auto md:w-[48%]">
          <motion.div style={{ scale: imgScale }} className="absolute inset-0">
            <Img p={c.p} sizes="(min-width:768px) 45vw, 100vw" />
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}

function HoverIndex() {
  const coarse = useCoarsePointer();
  const [active, setActive] = useState<number | null>(null);
  const x = useSpring(0, { stiffness: 150, damping: 20, mass: 0.5 });
  const y = useSpring(0, { stiffness: 150, damping: 20, mass: 0.5 });
  const rotate = useSpring(0, { stiffness: 100, damping: 15 });
  const last = useRef(0);

  return (
    <div
      className="relative"
      onPointerMove={(e) => {
        if (coarse) return;
        x.set(e.clientX - 140);
        y.set(e.clientY - 190);
        rotate.set(Math.max(-12, Math.min(12, (e.clientX - last.current) * 0.6)));
        last.current = e.clientX;
      }}
      onPointerLeave={() => setActive(null)}
    >
      {index.map((it, i) => (
        <div
          key={it.name}
          onPointerEnter={() => !coarse && setActive(i)}
          className="group relative flex cursor-pointer items-center gap-4 border-b border-ink/15 py-6 md:py-9"
        >
          <span className="absolute inset-0 origin-bottom scale-y-0 bg-maroon transition-transform duration-500 ease-[cubic-bezier(.22,1,.36,1)] group-hover:scale-y-100" />
          {/* thumbnail shown inline on touch screens */}
          <div className="relative size-16 shrink-0 overflow-hidden rounded-full md:hidden">
            <Img p={it.p} sizes="64px" />
          </div>
          <span className="relative hidden w-16 font-display text-sm text-gold transition-colors group-hover:text-gold-soft md:block">0{i + 1}</span>
          <h3 className="relative flex-1 font-serif text-3xl text-maroon transition-all duration-500 group-hover:translate-x-4 group-hover:text-ivory md:text-7xl">
            {it.name}
          </h3>
          <span className="relative hidden text-[11px] tracking-[0.3em] uppercase text-ink/50 transition-colors group-hover:text-ivory/70 md:block">
            {it.meta}
          </span>
        </div>
      ))}

      {/* cursor-following preview (desktop only) */}
      <motion.div style={{ x, y, rotate }} className="pointer-events-none fixed left-0 top-0 z-40 hidden h-[380px] w-[280px] md:block">
        <AnimatePresence>
          {active !== null && (
            <motion.div
              key={active}
              initial={{ opacity: 0, scale: 0.6, clipPath: "inset(50% 50% 50% 50% round 200px)" }}
              animate={{ opacity: 1, scale: 1, clipPath: "inset(0% 0% 0% 0% round 200px 200px 16px 16px)" }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.5, ease }}
              className="absolute inset-0 overflow-hidden"
            >
              <Img p={index[active].p} sizes="280px" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

export default function Mehfil() {
  const stackRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: stackRef, offset: ["start start", "end end"] });

  return (
    <div className="bg-ivory text-ink">
      <header className="fixed inset-x-0 top-0 z-50 flex items-center justify-between px-6 py-5 md:px-10">
        <span className="font-display text-sm tracking-[0.35em] text-maroon">MUBARAK BAGH</span>
        <nav className="hidden gap-8 text-[11px] tracking-[0.3em] uppercase md:flex">
          <NavLink>Collections</NavLink>
          <NavLink>Bridal</NavLink>
          <NavLink>Stories</NavLink>
        </nav>
        <span className="grid size-10 place-items-center rounded-full bg-maroon text-xs text-ivory">0</span>
      </header>

      {/* BENTO HERO */}
      <section className="px-4 pb-16 pt-24 md:px-10 md:pt-28">
        <div className="grid auto-rows-[22vh] grid-cols-2 gap-3 md:auto-rows-[26vh] md:grid-cols-4 md:gap-4">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease }}
            className="col-span-2 row-span-1 flex flex-col justify-between rounded-3xl bg-maroon p-6 text-ivory md:row-span-2 md:p-10"
          >
            <p className="text-[10px] tracking-[0.5em] uppercase text-gold-soft">Festive — Bridal 2026</p>
            <div>
              <h1 className="font-display text-5xl leading-none md:text-[7vw]">Mehfil</h1>
              <p className="mt-3 max-w-xs font-serif text-lg italic text-ivory/70 md:text-2xl">An evening gathering of silk, song and gold.</p>
            </div>
          </motion.div>
          {bento.map((b, i) => (
            <motion.div
              key={b.label}
              initial={{ opacity: 0, scale: 0.85, clipPath: "inset(20% 20% 20% 20% round 24px)" }}
              animate={{ opacity: 1, scale: 1, clipPath: "inset(0% 0% 0% 0% round 24px)" }}
              transition={{ duration: 1.2, ease, delay: 0.15 + i * 0.09 }}
              whileHover="hover"
              className={`group relative cursor-pointer overflow-hidden rounded-3xl ${b.cls}`}
            >
              <motion.div variants={{ hover: { scale: 1.08 } }} transition={{ duration: 0.8, ease }} className="absolute inset-0">
                <Img p={b.p} sizes="(min-width:768px) 25vw, 50vw" priority={i < 2} />
              </motion.div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
              <div className="absolute inset-x-4 bottom-4 flex items-center justify-between text-ivory">
                <span className="font-serif text-xl md:text-2xl">{b.label}</span>
                <motion.span
                  variants={{ hover: { rotate: -45, backgroundColor: "#f7f1e6", color: "#4a0f14" } }}
                  className="grid size-9 place-items-center rounded-full border border-ivory/60 text-sm"
                >
                  →
                </motion.span>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* STICKY STACKING CARDS */}
      <section ref={stackRef} className="relative">
        <div className="px-6 pt-16 text-center md:pt-24">
          <p className="text-[10px] tracking-[0.5em] uppercase text-gold">Four rooms of the house</p>
        </div>
        {stack.map((c, i) => (
          <StackCard
            key={c.title}
            c={c}
            i={i}
            progress={scrollYProgress}
            range={[i / stack.length, 1]}
            targetScale={1 - (stack.length - i) * 0.05}
          />
        ))}
      </section>

      {/* HOVER INDEX */}
      <section className="mx-auto max-w-7xl px-6 py-28 md:px-10 md:py-40">
        <div className="mb-12 flex items-end justify-between">
          <RevealText text="Collection Index" className="font-display text-4xl text-maroon md:text-6xl" />
          <span className="hidden text-[11px] tracking-[0.3em] uppercase text-ink/50 md:block">Hover to preview</span>
        </div>
        <HoverIndex />
      </section>

      {/* MAGNETIC CTA */}
      <section className="flex flex-col items-center gap-12 bg-sand px-6 pb-40 pt-28 text-center">
        <RevealText text="Join the mehfil" className="font-serif text-5xl italic text-maroon md:text-8xl" />
        <Magnetic strength={0.5}>
          <motion.button
            whileHover={{ scale: 1.08 }}
            className="grid size-40 place-items-center rounded-full bg-maroon text-[11px] tracking-[0.3em] uppercase text-ivory shadow-[0_20px_50px_-15px_rgba(74,15,20,.6)] md:size-48"
          >
            Book a visit
          </motion.button>
        </Magnetic>
      </section>
    </div>
  );
}
