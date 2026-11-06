"use client";

import { motion, useMotionValue, useScroll, useSpring, useTransform } from "motion/react";
import { useEffect, useRef, useState } from "react";
import Img from "@/components/ui/Img";
import { img, type Photo } from "@/lib/images";
import { CurtainReveal, ease, FadeUp, NavLink, RevealText, SweepButton, useIsMobile } from "@/components/ui/motion-kit";

const lookbook: { p: Photo; name: string; note: string }[] = [
  { p: img.archLehenga, name: "Darwaza", note: "Blush lehenga, mirror work" },
  { p: img.ivory, name: "Moti", note: "Ivory tissue, pearl blouse" },
  { p: img.tieDye, name: "Basant", note: "Leheriya chiffon" },
  { p: img.mustardLehenga, name: "Haldi", note: "Gota patti on raw silk" },
  { p: img.forestLight, name: "Shaam", note: "Midnight chanderi" },
  { p: img.pinkBride, name: "Gulabo", note: "Rani pink bridal" },
  { p: img.purpleBorder, name: "Neelam", note: "Tussar, gold kinari" },
];

function Ornament({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 24" className={className} fill="none" stroke="currentColor" strokeWidth="1">
      <path d="M0 12h44M76 12h44" />
      <path d="M60 2l8 10-8 10-8-10z" />
      <circle cx="60" cy="12" r="2" fill="currentColor" />
      <circle cx="48" cy="12" r="1.5" fill="currentColor" />
      <circle cx="72" cy="12" r="1.5" fill="currentColor" />
    </svg>
  );
}

function ArchColumn({ p, label, speed, className = "" }: { p: Photo; label: string; speed: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [speed, -speed]);
  return (
    <motion.div ref={ref} style={{ y }} className={className}>
      <div className="arch group relative aspect-[1/2] overflow-hidden">
        <div className="absolute inset-0 transition-transform duration-[1.6s] ease-[cubic-bezier(.22,1,.36,1)] group-hover:scale-110">
          <Img p={p} sizes="33vw" />
        </div>
        <div className="arch absolute inset-2 border border-ivory/60 md:inset-3" />
      </div>
      <p className="mt-4 text-center font-serif text-lg italic text-maroon md:text-2xl">{label}</p>
    </motion.div>
  );
}

function DragLookbook() {
  const wrap = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const [max, setMax] = useState(0);
  const x = useMotionValue(0);
  const progress = useTransform(x, (v) => (max ? Math.min(1, Math.max(0, -v / max)) : 0));
  const bar = useSpring(progress, { stiffness: 200, damping: 30 });

  useEffect(() => {
    const m = () => setMax(Math.max(0, (track.current?.scrollWidth ?? 0) - (wrap.current?.offsetWidth ?? 0)));
    m();
    window.addEventListener("resize", m);
    return () => window.removeEventListener("resize", m);
  }, []);

  return (
    <div ref={wrap} className="overflow-hidden">
      <motion.div
        ref={track}
        drag="x"
        style={{ x }}
        dragConstraints={{ left: -max, right: 0 }}
        dragElastic={0.08}
        dragTransition={{ bounceStiffness: 300, bounceDamping: 30, power: 0.25 }}
        className="flex w-max cursor-grab gap-5 px-6 active:cursor-grabbing md:gap-8 md:px-[8vw]"
      >
        {lookbook.map((l, i) => (
          <motion.article
            key={l.name}
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease, delay: i * 0.08 }}
            className="group w-[62vw] shrink-0 select-none sm:w-[38vw] md:w-[22vw]"
          >
            <motion.div whileHover={{ y: -14 }} transition={{ type: "spring", stiffness: 250, damping: 20 }} className="arch-pointed relative aspect-[3/5] overflow-hidden bg-sand">
              <div className="pointer-events-none absolute inset-0">
                <Img p={l.p} sizes="(min-width:768px) 22vw, 62vw" />
              </div>
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-maroon-deep/80 to-transparent p-5 pt-16 text-ivory">
                <p className="text-[10px] tracking-[0.35em] uppercase opacity-70">Look {String(i + 1).padStart(2, "0")}</p>
              </div>
            </motion.div>
            <h3 className="mt-5 font-display text-xl tracking-[0.2em] text-maroon">{l.name}</h3>
            <p className="mt-1 text-sm text-ink/60">{l.note}</p>
          </motion.article>
        ))}
      </motion.div>
      <div className="mx-6 mt-12 h-px bg-ink/10 md:mx-[8vw]">
        <motion.div style={{ scaleX: bar }} className="h-px origin-left bg-maroon" />
      </div>
    </div>
  );
}

export default function Jharokha() {
  const mobile = useIsMobile();
  const hero = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: hero, offset: ["start start", "end end"] });
  const w = useTransform(scrollYProgress, [0, 0.7], [mobile ? "74vw" : "34vw", "100vw"]);
  const h = useTransform(scrollYProgress, [0, 0.7], [mobile ? "62vh" : "74vh", "100vh"]);
  const radius = useTransform(scrollYProgress, [0, 0.7], ["50vw 50vw 0 0", "0vw 0vw 0 0"]);
  const sideText = useTransform(scrollYProgress, [0, 0.35], [1, 0]);
  const leftX = useTransform(scrollYProgress, [0, 0.4], ["0vw", "-20vw"]);
  const rightX = useTransform(scrollYProgress, [0, 0.4], ["0vw", "20vw"]);
  const innerScale = useTransform(scrollYProgress, [0, 1], [1.3, 1]);
  const caption = useTransform(scrollYProgress, [0.6, 0.85], [0, 1]);

  return (
    <div className="bg-ivory text-ink">
      <header className="fixed inset-x-0 top-0 z-50 flex items-center justify-between bg-ivory/70 px-6 py-4 text-[11px] tracking-[0.3em] uppercase backdrop-blur-md md:px-10">
        <NavLink>Menu</NavLink>
        <div className="flex flex-col items-center text-maroon">
          <span className="font-display text-sm tracking-[0.4em]">Mubarak Bagh</span>
          <Ornament className="mt-1 h-2 w-16 text-gold" />
        </div>
        <NavLink>Bag</NavLink>
      </header>

      {/* HERO: an arched window that opens into the palace */}
      <section ref={hero} className="relative h-[260vh]">
        <div className="sticky top-0 flex h-screen items-end justify-center overflow-hidden">
          <motion.div style={{ opacity: sideText, x: leftX }} className="absolute left-6 top-1/2 hidden -translate-y-1/2 md:block">
            <p className="font-display text-7xl text-maroon lg:text-8xl">JHA</p>
            <p className="mt-4 max-w-[14rem] text-sm text-ink/60">A window onto the courts of Rajputana — and the women who held them.</p>
          </motion.div>
          <motion.div style={{ opacity: sideText, x: rightX }} className="absolute right-6 top-1/2 hidden -translate-y-1/2 text-right md:block">
            <p className="font-display text-7xl text-maroon lg:text-8xl">ROKHA</p>
            <p className="ml-auto mt-4 max-w-[14rem] text-sm text-ink/60">Festive &amp; bridal couture, Autumn — Winter 2026.</p>
          </motion.div>
          <motion.div style={{ opacity: sideText }} className="absolute inset-x-0 top-24 text-center md:hidden">
            <p className="font-display text-5xl text-maroon">JHAROKHA</p>
          </motion.div>

          <motion.div style={{ width: w, height: h, borderRadius: radius }} className="relative overflow-hidden">
            <motion.div style={{ scale: innerScale }} className="absolute inset-0">
              <Img p={img.palaceBride} priority className="object-[50%_25%]" />
            </motion.div>
            <motion.div style={{ opacity: caption }} className="absolute inset-0 flex flex-col items-center justify-end bg-gradient-to-t from-maroon-deep/70 to-transparent pb-28 text-center text-ivory">
              <p className="text-[10px] tracking-[0.5em] uppercase text-gold-soft">The Winter Court</p>
              <p className="mt-3 font-serif text-4xl italic md:text-6xl">Step inside</p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* INTRO */}
      <section className="mx-auto max-w-3xl px-6 py-28 text-center md:py-40">
        <Ornament className="mx-auto mb-10 h-4 w-32 text-gold" />
        <RevealText
          text="Symmetry, stillness and a little gold — the language of the palace, translated into silk."
          className="font-serif text-3xl leading-snug text-maroon md:text-5xl"
        />
      </section>

      {/* PARALLAX ARCH TRIPTYCH */}
      <section className="mx-auto grid max-w-6xl grid-cols-3 items-start gap-3 px-4 pb-32 sm:gap-6 md:gap-12 md:px-10">
        <ArchColumn p={img.ivory} label="Moti" speed={mobile ? 20 : 60} className="mt-16" />
        <ArchColumn p={img.mintKanjivaram} label="Pista" speed={mobile ? 40 : 120} />
        <ArchColumn p={img.roseSilk} label="Gulab" speed={mobile ? 20 : 60} className="mt-16" />
      </section>

      {/* DRAG LOOKBOOK */}
      <section className="bg-sand py-24 md:py-32">
        <div className="mb-12 flex flex-col items-start justify-between gap-4 px-6 md:flex-row md:items-end md:px-[8vw]">
          <RevealText text="The Lookbook" className="font-display text-4xl text-maroon md:text-7xl" />
          <p className="text-[11px] tracking-[0.35em] uppercase text-ink/50">← Drag to explore →</p>
        </div>
        <DragLookbook />
      </section>

      {/* PALACE GALLERY */}
      <section className="mx-auto max-w-7xl px-6 py-28 md:px-10">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
          <CurtainReveal className="col-span-2 row-span-2 aspect-square md:aspect-auto" color="#f7f1e6">
            <Img p={img.jaipurGate} sizes="(min-width:768px) 50vw, 100vw" />
          </CurtainReveal>
          <CurtainReveal className="aspect-[3/4]" delay={0.1}>
            <Img p={img.hawaDetail} sizes="25vw" />
          </CurtainReveal>
          <CurtainReveal className="aspect-[3/4]" delay={0.2}>
            <Img p={img.coralBride} sizes="25vw" />
          </CurtainReveal>
          <CurtainReveal className="col-span-2 aspect-[2/1]" delay={0.3}>
            <Img p={img.amerGarden} sizes="(min-width:768px) 50vw, 100vw" />
          </CurtainReveal>
        </div>
        <FadeUp className="mt-20 flex flex-col items-center gap-8 text-center">
          <p className="max-w-lg font-serif text-2xl italic text-ink/70">Shot in the courtyards of Jaipur, where every doorway is a frame.</p>
          <SweepButton>Shop the Collection</SweepButton>
        </FadeUp>
      </section>

      <footer className="border-t border-ink/10 px-6 pb-32 pt-16 text-center">
        <Ornament className="mx-auto h-4 w-32 text-gold" />
        <p className="mt-6 font-display text-3xl tracking-[0.3em] text-maroon md:text-5xl">MUBARAK BAGH</p>
        <div className="mt-8 flex flex-wrap justify-center gap-x-8 gap-y-3 text-[11px] tracking-[0.3em] uppercase text-ink/60">
          {["Sarees", "Lehengas", "Bridal", "Atelier", "Contact"].map((x) => (
            <NavLink key={x}>{x}</NavLink>
          ))}
        </div>
      </footer>
    </div>
  );
}
