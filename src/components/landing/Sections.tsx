"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

import { logoWhiteSrc } from "@/lib/assets";

/* ============================================================
   REASONING  — bold typographic statement (per ref image)
   ============================================================ */
export function Reasoning() {
  return (
    <section
      id="core-insight"
      className="relative py-section px-section bg-white text-black overflow-hidden"
    >
      <div className="mx-auto max-w-7xl text-center mb-10 sm:mb-16">
        <p className="text-[10px] font-semibold tracking-[0.4em] text-black/50 mb-6 sm:mb-10">
          [ CORE INSIGHT ]
        </p>

        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.9, ease: "easeOut" }}
          className="text-display-section mx-auto flex max-w-5xl flex-col items-center gap-1 font-display uppercase leading-[1.05] tracking-[-0.02em]"
        >
          <span className="text-center">The edge is not the position itself,</span>
          <span className="text-center sm:whitespace-nowrap">
            it's <span className="font-normal italic">everything underneath it.</span>
          </span>
        </motion.h2>
      </div>
    </section>
  );
}

/* ============================================================
   AGENTS SCROLL — typographic morph: dot → "AGENTS" word reveal
   ============================================================ */
export function AgentsScroll() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });

  // Dot expands into "AGENTS" wordmark
  const dotScale = useTransform(scrollYProgress, [0, 0.1, 0.35], [0, 1, 1]);
  const dotOpacity = useTransform(scrollYProgress, [0, 0.05, 0.32, 0.4], [0, 1, 1, 0]);
  const wordScale = useTransform(scrollYProgress, [0.3, 0.55], [0.05, 1]);
  const wordOpacity = useTransform(scrollYProgress, [0.3, 0.42, 0.95], [0, 1, 1]);
  const panelsOpacity = useTransform(scrollYProgress, [0.55, 0.72], [0, 1]);
  const panelsY = useTransform(scrollYProgress, [0.55, 0.72], [40, 0]);

  const concepts = [
    {
      title: "Query the mind",
      body: "Before every decision, the agent consults your mind graph. It finds all correlated nodes, weighs your connections, and reasons inside your worldview, not from scratch.",
      pos: "left-[6%] top-[16%]",
    },
    {
      title: "Trade logs",
      body: "Every trade logs its reasoning and exit rules to your graph. If the market turns, the agent knows when to exit, and you can update those rules anytime.",
      pos: "right-[6%] top-[16%]",
    },
    {
      title: "Learning loop",
      body: "The agent studies your mind graph and trade graph together. Past mistakes you flagged become encoded intuition. Every new decision is sharper than the last.",
      pos: "left-[6%] bottom-[16%]",
    },
    {
      title: "Wire any market tool",
      body: "Connect any prediction market data source, news feed, or venue API. Your orchestrator ingests it in milliseconds, so your agents reason with faster, better information.",
      pos: "right-[6%] bottom-[16%]",
    },
  ];

  return (
    <section
      id="agents"
      ref={ref}
      className="relative bg-black text-white"
      style={{ height: "320vh" }}
    >
      <div className="sticky top-0 h-screen overflow-hidden">
          {/* Subtle grid */}
          <div
            className="absolute inset-0 opacity-[0.07]"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,0.55) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.55) 1px, transparent 1px)",
              backgroundSize: "88px 88px",
              maskImage: "radial-gradient(circle at center, black 30%, transparent 80%)",
            }}
          />

          {/* Center stage */}
          <div className="absolute inset-0 flex items-center justify-center">
            {/* Initial dot */}
            <motion.div
              style={{ scale: dotScale, opacity: dotOpacity }}
              className="absolute h-4 w-4 rounded-full bg-white shadow-[0_0_60px_rgba(255,255,255,0.6)]"
            />

            {/* AGENTS wordmark expanding from center */}
            <motion.h2
              style={{
                scale: wordScale,
                opacity: wordOpacity,
              }}
              className="font-display text-[10vw] italic tracking-[-0.04em] leading-none text-white select-none sm:text-[vw] md:text-[12vw] lg:text-[20vw]"
            >
              AGENTS
            </motion.h2>
          </div>

          {/* Four floating concept panels at corners */}
          <motion.div
            style={{ opacity: panelsOpacity, y: panelsY }}
            className="absolute inset-0 pointer-events-none"
          >
            {concepts.map((c, i) => (
              <motion.div
                key={c.title}
                initial={false}
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 5 + i * 0.4, repeat: Infinity, ease: "easeInOut" }}
                className={`absolute ${c.pos} w-[22rem] border border-white/15 bg-white/[0.04] p-6 backdrop-blur-sm`}
              >
                <h3 className="mb-2 text-2xl font-display tracking-tight">{c.title}</h3>
                <p className="text-sm leading-relaxed text-white/66">{c.body}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
    </section>
  );
}

/* ============================================================
   CTA
   ============================================================ */
export function CTA() {
  return (
    <section id="cta" className="relative py-32 px-6 bg-black text-white">
      <div className="mx-auto max-w-4xl text-center">
        <h2 className="text-5xl sm:text-7xl font-display tracking-tight text-balance">
          Trade with the agents.
          <br />
          <span className="text-white/40">Not against them.</span>
        </h2>
        <p className="mt-8 text-lg text-white/60 max-w-xl mx-auto">
          CONDUENCE is in private beta. Join the waitlist for early access to the Canvas and
          Mind Agent.
        </p>
        <form
          className="mt-10 flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
          onSubmit={(e) => e.preventDefault()}
        >
          <input
            type="email"
            placeholder="you@strategy.io"
            className="flex-1 rounded-full border border-white/30 bg-transparent px-5 py-3 text-sm text-white placeholder:text-white/40 focus:outline-none focus:ring-1 focus:ring-white"
          />
          <button className="rounded-full bg-white text-black px-6 py-3 text-sm font-semibold hover:bg-white/90 transition">
            Reserve seat
          </button>
        </form>
      </div>
    </section>
  );
}

/* ============================================================
   FOOTER — Walbi-style giant wordmark
   ============================================================ */
export function Footer() {
  return (
    <footer className="bg-black text-white pt-12 pb-8 px-section overflow-hidden sm:pt-16 md:pt-20 md:pb-10">
      <div className="mx-auto max-w-[1600px]">
        {/* GIANT WORDMARK — centered logo */}
        <div className="flex justify-center">
          <img
            src={logoWhiteSrc}
            alt="CONDUENCE"
            className="w-full max-w-[1400px] h-auto select-none"
            draggable={false}
          />
        </div>

        {/* Bottom row */}
        <div className="mt-16 flex flex-col md:flex-row justify-between gap-6 text-xs text-white/40 border-t border-white/10 pt-6">
          <p className="max-w-3xl leading-relaxed">
            Trading on prediction markets involves significant risk. CONDUENCE does not provide
            financial advice; you are solely responsible for your trading decisions. Conduct your
            own research before participating.
          </p>
          <div className="flex items-center gap-6">
            <a href="#" className="hover:text-white">
              Twitter
            </a>
            <a href="#" className="hover:text-white">
              Discord
            </a>
            <a href="#" className="hover:text-white">
              GitHub
            </a>
            <span>© 2026 CONDUENCE Labs</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
