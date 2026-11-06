"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";

export type TabDef = { key: string; name: string; concept: string; inspiration: string };

export default function TemplateTabs({
  tabs,
  active,
  onSelect,
}: {
  tabs: TabDef[];
  active: string;
  onSelect: (k: string) => void;
}) {
  const [open, setOpen] = useState(false);
  // concept note starts open on desktop, collapsed on phones (tap + to show)
  useEffect(() => setOpen(window.innerWidth >= 768), []);
  const current = tabs.find((t) => t.key === active)!;

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-4 z-[100] flex flex-col items-center gap-2 px-4">
      <AnimatePresence mode="wait">
        {open && (
          <motion.div
            key={current.key}
            initial={{ opacity: 0, y: 8, filter: "blur(4px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -6, filter: "blur(4px)" }}
            transition={{ duration: 0.35 }}
            className="pointer-events-auto max-w-md rounded-2xl border border-white/10 bg-[#1b1512]/80 px-4 py-2.5 text-center text-[12px] leading-snug text-[#f7f1e6]/85 shadow-2xl backdrop-blur-xl"
          >
            <span className="text-[#e6cf9c]">{current.concept}</span>
            <span className="block text-[11px] text-[#f7f1e6]/50">Inspired by: {current.inspiration}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <nav
        aria-label="Template selector"
        className="no-scrollbar pointer-events-auto flex max-w-full items-center gap-1 overflow-x-auto rounded-full border border-white/10 bg-[#1b1512]/85 p-1.5 shadow-[0_20px_60px_-15px_rgba(0,0,0,.6)] backdrop-blur-xl"
      >
        {tabs.map((t, i) => {
          const isActive = t.key === active;
          return (
            <button
              key={t.key}
              onClick={() => onSelect(t.key)}
              className={`relative shrink-0 rounded-full px-4 py-2 text-[11px] tracking-[0.2em] uppercase transition-colors ${
                isActive ? "text-[#22070a]" : "text-[#f7f1e6]/70 hover:text-[#f7f1e6]"
              }`}
            >
              {isActive && (
                <motion.span
                  layoutId="tab-pill"
                  className="absolute inset-0 rounded-full bg-gradient-to-b from-[#ecd7a6] to-[#b8914a]"
                  transition={{ type: "spring", stiffness: 380, damping: 32 }}
                />
              )}
              <span className="relative">
                <span className="mr-1.5 opacity-60">0{i + 1}</span>
                {t.name}
              </span>
            </button>
          );
        })}
        <button
          onClick={() => setOpen((o) => !o)}
          aria-label={open ? "Hide concept note" : "Show concept note"}
          className="ml-1 grid size-8 shrink-0 place-items-center rounded-full text-[#f7f1e6]/70 transition hover:bg-white/10 hover:text-white"
        >
          <motion.span animate={{ rotate: open ? 45 : 0 }} className="text-lg leading-none">
            +
          </motion.span>
        </button>
      </nav>
    </div>
  );
}
