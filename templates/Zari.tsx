"use client";

import { motion, useInView } from "motion/react";
import { Suspense, useRef } from "react";
import SilkScene from "@/components/three/SilkScene";
import Img from "@/components/ui/Img";
import { img, url, type Photo } from "@/lib/images";
import {
  CountUp,
  ease,
  FadeUp,
  HorizontalScroll,
  Marquee,
  NavLink,
  RevealLetters,
  RevealText,
  SweepButton,
  TiltCard,
  useIsMobile,
} from "@/components/ui/motion-kit";

const cards: { p: Photo; name: string; tag: string }[] = [
  { p: img.redBridal, name: "Rani Haar Lehenga", tag: "Bridal" },
  { p: img.violetSilk, name: "Jamuni Silk", tag: "Saree" },
  { p: img.coralBride, name: "Gulnaar Set", tag: "Bridal" },
  { p: img.mintKanjivaram, name: "Pista Kanjivaram", tag: "Saree" },
  { p: img.nightBride, name: "Sitara Lehenga", tag: "Bridal" },
  { p: img.pinkSilk, name: "Basant Banarasi", tag: "Saree" },
];

const swatches: { p: Photo; name: string; origin: string }[] = [
  { p: img.zardozi2, name: "Haathi Zardozi", origin: "Lucknow" },
  { p: img.goldZari, name: "Sona Tilla", origin: "Hyderabad" },
  { p: img.pearlsIkat, name: "Patola Ikat", origin: "Patan" },
  { p: img.zardozi3, name: "Kinari Border", origin: "Agra" },
  { p: img.redSilk, name: "Lal Katan", origin: "Varanasi" },
  { p: img.floralPrint, name: "Bagh Print", origin: "Madhya Pradesh" },
  { p: img.paisley, name: "Kairi Buta", origin: "Kashmir" },
  { p: img.zardozi1, name: "Dabka Work", origin: "Lucknow" },
];

export default function Zari() {
  const mobile = useIsMobile();
  const heroRef = useRef<HTMLElement>(null);
  const heroInView = useInView(heroRef, { margin: "0px 0px -10% 0px" });
  const tex = mobile ? `${url(img.zardozi2, 900)}&h=1200` : `${url(img.zardozi2, 1600)}&h=1050`;

  return (
    <div className="grain relative bg-maroon-deep text-ivory">
      <header className="fixed inset-x-0 top-0 z-50 flex items-center justify-between px-6 py-5 text-[11px] tracking-[0.3em] uppercase md:px-10">
        <span className="font-display text-sm tracking-[0.35em] text-gold-soft">Mubarak Bagh</span>
        <nav className="hidden gap-8 text-ivory/70 md:flex">
          <NavLink>Couture</NavLink>
          <NavLink>Craft</NavLink>
          <NavLink>Salon</NavLink>
        </nav>
        <button className="rounded-full border border-gold/50 px-4 py-2 text-gold-soft transition hover:bg-gold hover:text-maroon-deep">Menu</button>
      </header>

      {/* 3D HERO */}
      <section ref={heroRef} className="relative h-[100svh] overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,#5a1720_0%,#22070a_70%)]" />
        <div className="absolute inset-0">
          <Suspense fallback={null}>
            <SilkScene texUrl={tex} mobile={mobile} active={heroInView} />
          </Suspense>
        </div>
        <div className="pointer-events-none absolute inset-x-0 bottom-28 z-10 px-6 text-center md:bottom-16">
          <p className="mb-3 text-[10px] tracking-[0.6em] uppercase text-gold-soft/80">Woven in real gold</p>
          <h1 className="font-display text-[18vw] leading-[0.8] md:text-[11vw]">
            <RevealLetters
              text="ZARI"
              delay={0.3}
              letterClassName="bg-[linear-gradient(180deg,#f6e3b4,#b8914a_60%,#7a5a22)] bg-clip-text text-transparent [-webkit-background-clip:text]"
            />
          </h1>
          <p className="mt-4 font-serif text-lg italic text-ivory/70 md:text-2xl">Move your cursor across the silk.</p>
        </div>
      </section>

      <div className="border-y border-gold/20 py-5 text-sm tracking-[0.5em] uppercase text-gold-soft/70">
        <Marquee items={["Handwoven", "Real zari", "Heirloom", "Made in India", "Bespoke fittings"]} speed={35} separator="◆" />
      </div>

      {/* NUMBERS */}
      <section className="mx-auto grid max-w-6xl grid-cols-2 gap-y-14 px-6 py-24 md:grid-cols-4 md:py-36">
        {[
          { n: 60, s: "", l: "Days on the loom" },
          { n: 1200, s: "m", l: "Of zari per bridal" },
          { n: 14, s: "", l: "Weaver families" },
          { n: 100, s: "+", l: "Years of craft" },
        ].map((x, i) => (
          <FadeUp key={x.l} delay={i * 0.1} className="text-center">
            <CountUp to={x.n} suffix={x.s} className="font-display text-5xl text-gold-soft md:text-7xl" />
            <p className="mt-3 text-[10px] tracking-[0.35em] uppercase text-ivory/50">{x.l}</p>
          </FadeUp>
        ))}
      </section>

      {/* TILT CARDS */}
      <section className="mx-auto max-w-7xl px-6 pb-28 md:px-10">
        <div className="mb-14 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <RevealText text="The Gilded Edit" className="font-display text-4xl text-gold-soft md:text-7xl" />
          <p className="max-w-sm text-sm text-ivory/60">Hover a piece — light catches the zari the way it does in a candle-lit mehfil.</p>
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-10">
          {cards.map((c, i) => (
            <FadeUp key={c.name} delay={(i % 3) * 0.12}>
              <TiltCard className="aspect-[3/4] w-full">
                <div className="relative h-full w-full overflow-hidden rounded-[28px] border border-gold/30 bg-maroon">
                  <Img p={c.p} sizes="(min-width:1024px) 30vw, (min-width:640px) 45vw, 100vw" />
                  <div className="absolute inset-0 bg-gradient-to-t from-maroon-deep via-transparent to-transparent" />
                  <div className="absolute inset-x-5 bottom-5 flex items-end justify-between [transform:translateZ(40px)]">
                    <div>
                      <p className="text-[10px] tracking-[0.35em] uppercase text-gold-soft/80">{c.tag}</p>
                      <h3 className="mt-1 font-serif text-2xl md:text-3xl">{c.name}</h3>
                    </div>
                    <span className="grid size-11 place-items-center rounded-full border border-gold/60 text-gold-soft">→</span>
                  </div>
                </div>
              </TiltCard>
            </FadeUp>
          ))}
        </div>
      </section>

      {/* HORIZONTAL SWATCHES */}
      <HorizontalScroll
        trackClassName="items-center gap-6 pl-6 pr-[15vw] md:gap-10 md:pl-[8vw]"
        header={
          <div className="mb-10 px-6 md:px-[8vw]">
            <p className="text-[10px] tracking-[0.5em] uppercase text-gold">Textile library</p>
            <h2 className="mt-3 font-display text-4xl text-gold-soft md:text-6xl">Eight Crafts, One House</h2>
          </div>
        }
      >
        {swatches.map((s, i) => (
          <motion.div
            key={s.name}
            whileHover={{ rotate: i % 2 ? 2 : -2, y: -12 }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: "spring", stiffness: 260, damping: 18 }}
            className={`w-[64vw] shrink-0 sm:w-[34vw] md:w-[22vw] ${i % 2 ? "md:translate-y-12" : ""}`}
          >
            <div className="relative aspect-square overflow-hidden rounded-full border border-gold/30">
              <Img p={s.p} sizes="(min-width:768px) 22vw, 64vw" />
            </div>
            <div className="mt-5 text-center">
              <h3 className="font-serif text-2xl">{s.name}</h3>
              <p className="text-[10px] tracking-[0.35em] uppercase text-ivory/50">{s.origin}</p>
            </div>
          </motion.div>
        ))}
      </HorizontalScroll>

      {/* CTA */}
      <section className="relative flex min-h-[80vh] flex-col items-center justify-center gap-10 overflow-hidden px-6 pb-36 text-center">
        <motion.div
          aria-hidden
          className="absolute size-[120vw] rounded-full border border-gold/15 md:size-[60vw]"
          animate={{ rotate: 360 }}
          transition={{ duration: 80, repeat: Infinity, ease: "linear" }}
          style={{ borderStyle: "dashed" }}
        />
        <motion.p
          initial={{ opacity: 0, letterSpacing: "1em" }}
          whileInView={{ opacity: 1, letterSpacing: "0.5em" }}
          viewport={{ once: true }}
          transition={{ duration: 1.4, ease }}
          className="text-[10px] uppercase text-gold"
        >
          By appointment
        </motion.p>
        <RevealText text="Your heirloom begins with a conversation" className="max-w-4xl font-serif text-4xl italic leading-tight md:text-7xl" />
        <SweepButton tone="gold">Reserve a Private Viewing</SweepButton>
      </section>
    </div>
  );
}
