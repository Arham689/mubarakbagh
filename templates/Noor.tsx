"use client";

import { animate, motion, useMotionTemplate, useMotionValue, useScroll, useSpring, useTransform } from "motion/react";
import { useEffect, useRef } from "react";
import Img from "@/components/ui/Img";
import { img, type Photo } from "@/lib/images";
import { ease, NavLink, RevealLetters, RevealText, SweepButton, useCoarsePointer, useIsMobile } from "@/components/ui/motion-kit";

const ring: Photo[] = [
  img.redBridal, img.mintKanjivaram, img.pinkBride, img.violetSilk, img.archLehenga,
  img.roseSilk, img.coralBride, img.mustardLehenga, img.purpleBorder, img.bridePortrait,
];

const gallery: { p: Photo; title: string; sub: string; dir: "left" | "right" | "up" }[] = [
  { p: img.nightBride, title: "Shab-e-Noor", sub: "Night of light — bridal reds under the mela lamps", dir: "left" },
  { p: img.forestLight, title: "Chandni", sub: "Moonlit chanderi with silver dabka", dir: "right" },
  { p: img.jalMahal, title: "Jal Mahal", sub: "Where the collection was imagined", dir: "up" },
];

const clipFrom = {
  left: "inset(0 100% 0 0)",
  right: "inset(0 0 0 100%)",
  up: "inset(100% 0 0 0)",
};

function SpotlightHero() {
  const coarse = useCoarsePointer();
  const mx = useMotionValue(50);
  const my = useMotionValue(45);
  const sx = useSpring(mx, { stiffness: 80, damping: 20 });
  const sy = useSpring(my, { stiffness: 80, damping: 20 });
  const mask = useMotionTemplate`radial-gradient(circle at ${sx}% ${sy}%, black 0%, black 14%, transparent 34%)`;

  // On touch screens the light wanders on its own.
  useEffect(() => {
    if (!coarse) return;
    const a = animate(0, Math.PI * 2, {
      duration: 9,
      repeat: Infinity,
      ease: "linear",
      onUpdate: (t) => {
        mx.set(50 + Math.cos(t) * 25);
        my.set(45 + Math.sin(t * 2) * 15);
      },
    });
    return () => a.stop();
  }, [coarse, mx, my]);

  return (
    <section
      className="relative h-[100svh] overflow-hidden"
      onPointerMove={(e) => {
        if (coarse) return;
        const r = e.currentTarget.getBoundingClientRect();
        mx.set(((e.clientX - r.left) / r.width) * 100);
        my.set(((e.clientY - r.top) / r.height) * 100);
      }}
    >
      <div className="absolute inset-0 opacity-25 grayscale">
        <Img p={img.bridePortrait} priority className="object-[50%_30%]" />
      </div>
      <motion.div className="absolute inset-0" style={{ WebkitMaskImage: mask, maskImage: mask }}>
        <Img p={img.bridePortrait} priority className="object-[50%_30%]" />
      </motion.div>
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-[#0d0605]" />
      <div className="pointer-events-none absolute inset-x-0 bottom-28 px-6 text-center md:bottom-20">
        <p className="mb-4 text-[10px] tracking-[0.6em] uppercase text-gold-soft/80">{coarse ? "Follow the light" : "Move to light her up"}</p>
        <h1 className="font-display text-[22vw] leading-[0.8] text-ivory md:text-[14vw]">
          <RevealLetters text="NOOR" delay={0.2} />
        </h1>
      </div>
    </section>
  );
}

function Ring() {
  const mobile = useIsMobile();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const rot = useSpring(useTransform(scrollYProgress, [0, 1], [0, -360]), { stiffness: 60, damping: 20 });
  const tilt = useTransform(scrollYProgress, [0, 0.5, 1], [-14, -4, -14]);
  const R = mobile ? 230 : 560;
  const cardW = mobile ? 120 : 220;
  const cardH = mobile ? 180 : 320;

  return (
    <section ref={ref} className="relative h-[320vh]">
      <div className="sticky top-0 flex h-screen items-center justify-center overflow-hidden" style={{ perspective: mobile ? 900 : 1600 }}>
        <div className="absolute inset-x-0 top-[14vh] z-10 text-center">
          <p className="text-[10px] tracking-[0.5em] uppercase text-gold">The circle of ten</p>
          <h2 className="mt-3 font-serif text-3xl italic text-ivory/90 md:text-5xl">Scroll to turn the ring</h2>
        </div>
        <motion.div style={{ rotateX: tilt, rotateY: rot, transformStyle: "preserve-3d" }} className="relative" >
          {ring.map((p, i) => (
            <div
              key={p.id}
              className="group absolute overflow-hidden rounded-2xl border border-gold/30 [backface-visibility:visible]"
              style={{
                width: cardW,
                height: cardH,
                left: -cardW / 2,
                top: -cardH / 2,
                transform: `rotateY(${(i * 360) / ring.length}deg) translateZ(${R}px)`,
              }}
            >
              <Img p={p} sizes={`${cardW}px`} className="transition-transform duration-700 group-hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
            </div>
          ))}
        </motion.div>
        <p className="pointer-events-none absolute bottom-[14vh] font-display text-[10vw] leading-none text-ivory/5">MUBARAK</p>
      </div>
    </section>
  );
}

export default function Noor() {
  return (
    <div className="bg-[#0d0605] text-ivory">
      <header className="fixed inset-x-0 top-0 z-50 flex items-center justify-between px-6 py-5 text-[11px] tracking-[0.3em] uppercase mix-blend-difference md:px-10">
        <span className="whitespace-nowrap font-display text-xs tracking-[0.25em] md:text-sm md:tracking-[0.35em]">Mubarak Bagh</span>
        <nav className="flex gap-6 md:gap-8">
          <NavLink className="hidden md:inline-block">Gallery</NavLink>
          <NavLink className="hidden md:inline-block">Salon</NavLink>
          <NavLink>Enquire</NavLink>
        </nav>
      </header>

      <SpotlightHero />

      <section className="mx-auto max-w-4xl px-6 py-28 text-center md:py-40">
        <RevealText
          text="Light is the oldest embroidery. We simply give it gold thread to hold on to."
          className="font-serif text-3xl leading-snug text-gold-soft md:text-5xl"
        />
      </section>

      <Ring />

      {/* CLIP-PATH REVEAL GALLERY */}
      <section className="mx-auto max-w-7xl space-y-28 px-6 py-28 md:space-y-40 md:px-10">
        {gallery.map((g, i) => (
          <div key={g.title} className={`grid items-center gap-8 md:grid-cols-12 ${i % 2 ? "md:[direction:rtl]" : ""}`}>
            <motion.div
              initial={{ clipPath: clipFrom[g.dir] }}
              whileInView={{ clipPath: "inset(0 0 0 0)" }}
              viewport={{ once: true, margin: "-15% 0px" }}
              transition={{ duration: 1.4, ease }}
              className="relative aspect-[4/5] overflow-hidden md:col-span-7 md:aspect-[5/6] [direction:ltr]"
            >
              <motion.div
                initial={{ scale: 1.3 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true, margin: "-15% 0px" }}
                transition={{ duration: 1.8, ease }}
                className="absolute inset-0"
              >
                <Img p={g.p} sizes="(min-width:768px) 58vw, 100vw" />
              </motion.div>
            </motion.div>
            <div className="md:col-span-5 md:px-10 [direction:ltr]">
              <p className="font-display text-sm text-gold">0{i + 1}</p>
              <RevealText text={g.title} className="mt-3 font-display text-4xl md:text-6xl" />
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 1, ease, delay: 0.3 }}
                className="mt-4 max-w-sm font-serif text-xl italic text-ivory/60"
              >
                {g.sub}
              </motion.p>
            </div>
          </div>
        ))}
      </section>

      <footer className="flex flex-col items-center gap-10 border-t border-ivory/10 px-6 pb-36 pt-24 text-center">
        <p className="font-display text-4xl tracking-[0.2em] text-gold-soft md:text-6xl">MUBARAK BAGH</p>
        <SweepButton tone="light">Enquire Privately</SweepButton>
        <p className="text-[10px] tracking-[0.3em] uppercase text-ivory/30">© 2026 · Hyderabad · Jaipur</p>
      </footer>
    </div>
  );
}
