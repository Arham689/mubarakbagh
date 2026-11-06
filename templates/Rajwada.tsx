"use client";

import { motion, useMotionValue, useScroll, useTransform } from "motion/react";
import { useEffect, useRef } from "react";
import Img from "@/components/ui/Img";
import { img, type Photo } from "@/lib/images";
import {
  ease,
  FadeUp,
  HorizontalScroll,
  Marquee,
  NavLink,
  Parallax,
  RevealLetters,
  RevealText,
  ScrollHighlight,
  SweepButton,
  useIsMobile,
} from "@/components/ui/motion-kit";

const collection: { p: Photo; name: string; craft: string; price: string }[] = [
  { p: img.roseSilk, name: "Gulabi Banarasi", craft: "Katan silk · Kadhua weave", price: "₹ 68,000" },
  { p: img.mintKanjivaram, name: "Pista Kanjivaram", craft: "Pure mulberry · Temple border", price: "₹ 54,500" },
  { p: img.mustardLehenga, name: "Haldi Lehenga", craft: "Gota patti · Raw silk", price: "₹ 1,12,000" },
  { p: img.violetSilk, name: "Jamuni Paithani", craft: "Peacock pallu · Zari", price: "₹ 72,000" },
  { p: img.ivory, name: "Chandni Chikankari", craft: "Hand-shadow work · Mul", price: "₹ 38,900" },
  { p: img.purpleBorder, name: "Raat Rani", craft: "Tussar · Woven gold border", price: "₹ 46,000" },
  { p: img.redBridal, name: "Shehnaai Bridal", craft: "Zardozi · Velvet", price: "₹ 3,40,000" },
];

const chapters = [
  { no: "I", title: "The Loom", body: "Every drape begins in Varanasi and Kanchipuram, where master weavers count threads by hand for sixty days.", p: img.zardozi2 },
  { no: "II", title: "The Gold", body: "Real zari — silver wire gilded in gold — is couched stitch by stitch into borders meant to outlive us.", p: img.goldZari },
  { no: "III", title: "The Bride", body: "Finished in our atelier, fitted in yours. An heirloom made for a single day and a hundred years.", p: img.bridePortrait },
];

export default function Rajwada() {
  const hero = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: hero, offset: ["start start", "end start"] });
  const imgScale = useTransform(scrollYProgress, [0, 1], [1, 1.25]);
  const isMobile = useIsMobile();
  const side = useMotionValue(30); // arch side margin in %, narrower on phones
  useEffect(() => side.set(isMobile ? 10 : 30), [isMobile, side]);
  const frameInset = useTransform([scrollYProgress, side], ([p, s]: number[]) => {
    const k = 1 - Math.min(p / 0.8, 1);
    return `inset(${12 * k}% ${s * k}% 0% ${s * k}% round ${400 * k}px ${400 * k}px 0 0)`;
  });
  const titleY = useTransform(scrollYProgress, [0, 1], ["0%", "-60%"]);
  const titleOpacity = useTransform(scrollYProgress, [0, 0.35], [1, 0]);

  return (
    <div className="bg-ivory text-ink">
      {/* NAV */}
      <motion.header
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1, ease, delay: 0.6 }}
        className="fixed inset-x-0 top-0 z-50 grid grid-cols-3 items-center px-6 py-5 text-[11px] tracking-[0.25em] uppercase mix-blend-difference text-ivory md:px-10"
      >
        <nav className="hidden gap-8 md:flex">
          <NavLink>Sarees</NavLink>
          <NavLink>Lehengas</NavLink>
          <NavLink>Bridal</NavLink>
        </nav>
        <span className="col-start-2 whitespace-nowrap text-center font-display text-xs tracking-[0.25em] md:text-sm md:tracking-[0.4em]">Mubarak Bagh</span>
        <nav className="flex justify-end gap-8">
          <NavLink className="hidden md:inline-block">Atelier</NavLink>
          <NavLink>Bag (0)</NavLink>
        </nav>
      </motion.header>

      {/* HERO: arched frame that opens to full-bleed on scroll */}
      <section ref={hero} className="relative h-[200vh]">
        <div className="sticky top-0 h-screen overflow-hidden">
          <motion.div style={{ clipPath: frameInset }} className="absolute inset-0">
            <motion.div style={{ scale: imgScale }} className="absolute inset-0">
              <Img p={img.archLehenga} priority className="object-[50%_30%]" />
              <div className="absolute inset-0 bg-gradient-to-t from-maroon-deep/60 via-transparent to-transparent" />
            </motion.div>
          </motion.div>
          <motion.div style={{ y: titleY, opacity: titleOpacity }} className="pointer-events-none absolute inset-x-0 bottom-[14vh] text-center md:bottom-[8vh]">
            <p className="mb-4 text-[11px] tracking-[0.5em] uppercase text-gold">Couture · Est. 2026</p>
            <h1 className="font-display text-[15vw] leading-[0.85] text-ivory drop-shadow-[0_2px_20px_rgba(34,7,10,.5)] md:text-[12vw] md:text-maroon md:mix-blend-multiply md:drop-shadow-none">
              <RevealLetters text="RAJWADA" delay={0.2} />
            </h1>
            <p className="mx-auto mt-6 max-w-md px-6 font-serif text-xl italic text-ivory/90 md:text-2xl md:text-ink/80">
              Heirloom sarees &amp; lehengas for the modern maharani
            </p>
          </motion.div>
        </div>
      </section>

      {/* MARQUEE */}
      <div className="border-y border-ink/10 py-6 font-serif text-3xl italic text-maroon md:text-5xl">
        <Marquee items={["Banarasi", "Kanjivaram", "Zardozi", "Chikankari", "Paithani", "Bandhani", "Gota Patti"]} speed={40} />
      </div>

      {/* MANIFESTO with scroll-lit words */}
      <section className="mx-auto max-w-5xl px-6 py-32 md:py-48">
        <p className="mb-10 text-[11px] tracking-[0.5em] uppercase text-gold">— The House</p>
        <ScrollHighlight
          className="font-serif text-4xl leading-[1.15] text-maroon md:text-6xl"
          text="We do not make fashion. We keep a promise between a weaver and a woman — that what is made slowly will be worn proudly, and handed down."
        />
      </section>

      {/* STICKY SPLIT: chapters */}
      <section className="mx-auto grid max-w-7xl gap-10 px-6 pb-32 md:grid-cols-2 md:gap-20 md:px-10">
        <div className="md:sticky md:top-0 md:flex md:h-screen md:flex-col md:justify-center">
          <RevealText text="Made the way it was made for queens" className="font-display text-4xl leading-tight text-maroon md:text-6xl" />
          <p className="mt-8 max-w-sm text-sm leading-relaxed text-ink/70">
            Three chapters, three hands. Scroll through the journey of a single Mubarak Bagh drape.
          </p>
          <div className="mt-10">
            <SweepButton>Visit the Atelier</SweepButton>
          </div>
        </div>
        <div className="space-y-28 md:py-[20vh]">
          {chapters.map((c) => (
            <FadeUp key={c.no}>
              <Parallax className="aspect-[4/5] w-full" amount={60}>
                <Img p={c.p} sizes="(min-width:768px) 45vw, 100vw" />
              </Parallax>
              <div className="mt-6 flex items-baseline gap-6">
                <span className="font-display text-gold">{c.no}</span>
                <div>
                  <h3 className="font-serif text-3xl text-maroon">{c.title}</h3>
                  <p className="mt-2 max-w-sm text-sm leading-relaxed text-ink/70">{c.body}</p>
                </div>
              </div>
            </FadeUp>
          ))}
        </div>
      </section>

      {/* HORIZONTAL COLLECTION */}
      <HorizontalScroll
        className="bg-maroon-deep text-ivory"
        trackClassName="gap-8 pl-6 pr-[20vw] md:gap-12 md:pl-[8vw]"
        header={
          <div className="mb-10 flex items-end justify-between px-6 md:px-[8vw]">
            <h2 className="font-display text-4xl md:text-7xl">The Collection</h2>
            <p className="hidden text-[11px] tracking-[0.4em] uppercase text-gold-soft/70 md:block">Scroll ⟶</p>
          </div>
        }
      >
        {collection.map((c, i) => (
          <article key={c.name} className="group w-[72vw] shrink-0 cursor-pointer sm:w-[42vw] md:w-[26vw]">
            <div className="relative aspect-[3/4] overflow-hidden">
              <div className="absolute inset-0 transition-transform duration-[1.4s] ease-[cubic-bezier(.22,1,.36,1)] group-hover:scale-110">
                <Img p={c.p} sizes="(min-width:768px) 26vw, 72vw" />
              </div>
              <span className="absolute left-4 top-4 font-display text-xs text-ivory/80">0{i + 1}</span>
              <div className="absolute inset-x-0 bottom-0 translate-y-full bg-ivory p-4 text-ink transition-transform duration-500 ease-[cubic-bezier(.22,1,.36,1)] group-hover:translate-y-0">
                <p className="text-[10px] tracking-[0.3em] uppercase">Quick view — {c.price}</p>
              </div>
            </div>
            <div className="mt-4 flex items-baseline justify-between">
              <h3 className="font-serif text-2xl">{c.name}</h3>
              <span className="text-xs text-gold-soft">{c.price}</span>
            </div>
            <p className="mt-1 text-xs tracking-wider text-ivory/50">{c.craft}</p>
          </article>
        ))}
      </HorizontalScroll>

      {/* EDITORIAL DUO */}
      <section className="grid md:grid-cols-[1.2fr_1fr]">
        <Parallax className="h-[80vh] md:h-screen" amount={100}>
          <Img p={img.palaceBride} sizes="(min-width:768px) 55vw, 100vw" />
        </Parallax>
        <div className="flex flex-col justify-center gap-8 bg-sand px-8 py-20 md:px-16">
          <p className="text-[11px] tracking-[0.5em] uppercase text-gold">Bridal 2026</p>
          <RevealText as="h2" text="Shaadi Season, Slowly Made" className="font-display text-4xl leading-tight text-maroon md:text-6xl" />
          <p className="max-w-md font-serif text-xl leading-relaxed text-ink/75">
            Private appointments at our Hyderabad salon. Bespoke lehengas begin twelve weeks before your day.
          </p>
          <div>
            <SweepButton>Book an Appointment</SweepButton>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="overflow-hidden bg-maroon pb-32 pt-24 text-ivory">
        <div className="mx-auto grid max-w-7xl gap-12 px-6 md:grid-cols-4 md:px-10">
          <div className="md:col-span-2">
            <p className="font-serif text-3xl italic text-gold-soft">Letters from the atelier</p>
            <form className="mt-6 flex max-w-md border-b border-ivory/30" onSubmit={(e) => e.preventDefault()}>
              <input placeholder="Your email" className="flex-1 bg-transparent py-3 text-sm outline-none placeholder:text-ivory/40" />
              <button className="text-[11px] tracking-[0.3em] uppercase transition hover:text-gold-soft">Join →</button>
            </form>
          </div>
          {[
            ["Shop", "Sarees", "Lehengas", "Bridal", "Dupattas"],
            ["House", "Atelier", "Weavers", "Journal", "Contact"],
          ].map(([h, ...l]) => (
            <div key={h}>
              <p className="mb-4 text-[11px] tracking-[0.3em] uppercase text-gold">{h}</p>
              <ul className="space-y-2 text-sm text-ivory/70">
                {l.map((x) => (
                  <li key={x}>
                    <NavLink>{x}</NavLink>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <p className="mt-24 whitespace-nowrap text-center font-display text-[17vw] leading-none text-ivory/10">MUBARAK BAGH</p>
      </footer>
    </div>
  );
}
