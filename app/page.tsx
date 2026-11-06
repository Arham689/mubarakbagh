"use client";

import dynamic from "next/dynamic";
import { AnimatePresence, motion } from "motion/react";
import { useLenis } from "lenis/react";
import { useEffect, useState } from "react";
import TemplateTabs, { type TabDef } from "@/components/TemplateTabs";
import Rajwada from "@/templates/Rajwada";
import Jharokha from "@/templates/Jharokha";
import Mehfil from "@/templates/Mehfil";
import Noor from "@/templates/Noor";

// WebGL template is client-only and code-split so the other tabs stay light.
const Zari = dynamic(() => import("@/templates/Zari"), { ssr: false });

const TABS: (TabDef & { C: React.ComponentType })[] = [
  {
    key: "rajwada",
    name: "Rajwada",
    concept: "Editorial maison — giant serif, pinned horizontal collection, scroll-lit manifesto",
    inspiration: "Maison Alaïa, Dior, Martine Rose (Awwwards)",
    C: Rajwada,
  },
  {
    key: "zari",
    name: "Zari 3D",
    concept: "WebGL silk drape that ripples to your cursor, gold bangles, tilt-glare cards",
    inspiration: "Awwwards WebGL fashion heroes, Lusion",
    C: Zari,
  },
  {
    key: "jharokha",
    name: "Jharokha",
    concept: "Mughal-arch frames that open to full screen, parallax arches, drag lookbook",
    inspiration: "Rajasthani palace windows, Aesop calm minimalism",
    C: Jharokha,
  },
  {
    key: "mehfil",
    name: "Mehfil",
    concept: "Bento entrance, sticky stacking cards, cursor-follow image list",
    inspiration: "Awwwards hover-reveal indexes, stacked card SOTDs",
    C: Mehfil,
  },
  {
    key: "noor",
    name: "Noor",
    concept: "Dark gallery — scroll-driven 3D carousel ring and clip-path reveals",
    inspiration: "Louis Vuitton Collectibles, museum night-mode galleries",
    C: Noor,
  },
];

export default function Page() {
  const [active, setActive] = useState(TABS[0].key);
  const lenis = useLenis();

  useEffect(() => {
    const h = window.location.hash.slice(1);
    if (TABS.some((t) => t.key === h)) setActive(h);
  }, []);

  const select = (k: string) => {
    if (k === active) return;
    setActive(k);
    history.replaceState(null, "", `#${k}`);
  };

  const Current = TABS.find((t) => t.key === active)!.C;

  return (
    <>
      <AnimatePresence
        mode="wait"
        onExitComplete={() => {
          if (lenis) lenis.scrollTo(0, { immediate: true, force: true });
          else window.scrollTo(0, 0);
        }}
      >
        <motion.div
          key={active}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.45 }}
        >
          <Current />
        </motion.div>
      </AnimatePresence>
      <TemplateTabs tabs={TABS} active={active} onSelect={select} />
    </>
  );
}
