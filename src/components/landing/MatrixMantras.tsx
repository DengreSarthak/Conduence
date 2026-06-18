"use client";

import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import DecryptedText from "@/components/DecryptedText";

const MANTRAS = [
  "I\u2002recall",
  "I\u2002think",
  "I\u2002decide",
  "I\u2002execute",
  "I\u2002remember",
];

function MatrixCanvas() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    let w = (canvas.width = canvas.offsetWidth);
    let h = (canvas.height = canvas.offsetHeight);
    const fontSize = 14;
    let cols = Math.floor(w / fontSize);
    let drops = new Array(cols).fill(1);
    const glyphs =
      "アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホ0123456789ABCDEF<>/?*+";

    const onResize = () => {
      w = canvas.width = canvas.offsetWidth;
      h = canvas.height = canvas.offsetHeight;
      cols = Math.floor(w / fontSize);
      drops = new Array(cols).fill(1);
    };
    window.addEventListener("resize", onResize);

    let raf = 0;
    const draw = () => {
      ctx.fillStyle = "rgba(0,0,0,0.08)";
      ctx.fillRect(0, 0, w, h);
      ctx.fillStyle = "rgba(180,255,210,0.85)";
      ctx.font = `${fontSize}px monospace`;
      for (let i = 0; i < drops.length; i++) {
        const text = glyphs[Math.floor(Math.random() * glyphs.length)];
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);
        if (drops[i] * fontSize > h && Math.random() > 0.975) drops[i] = 0;
        drops[i]++;
      }
      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return <canvas ref={ref} className="absolute inset-0 h-full w-full opacity-40" aria-hidden />;
}

export function MatrixMantras() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const safeIndex = Math.min(activeIndex, MANTRAS.length - 1);
  const activeMantra = MANTRAS[safeIndex] ?? MANTRAS[0];

  useEffect(() => {
    const handler = () => {
      const el = sectionRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const total = rect.height - window.innerHeight;
      const scrolled = Math.min(Math.max(-rect.top, 0), total);
      const ratio = total > 0 ? scrolled / total : 0;
      const idx = Math.min(MANTRAS.length - 1, Math.floor(ratio * MANTRAS.length));
      setActiveIndex(idx);
    };
    handler();
    window.addEventListener("scroll", handler, { passive: true });
    window.addEventListener("resize", handler);
    return () => {
      window.removeEventListener("scroll", handler);
      window.removeEventListener("resize", handler);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative bg-black text-white"
      style={{ height: `${MANTRAS.length * 80}vh` }}
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        <MatrixCanvas />
        {/* vignette */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse at center, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.85) 70%, rgba(0,0,0,1) 100%)",
          }}
        />

        <div className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center">
          <h2
            className="font-display uppercase tracking-[-0.03em] leading-none"
            style={{ fontSize: "clamp(2.5rem, 12vw, 14rem)" }}
          >
            <DecryptedText
              key={safeIndex}
              text={activeMantra}
              animateOn="view"
              sequential
              revealDirection="start"
              speed={45}
              maxIterations={20}
              useOriginalCharsOnly={false}
              characters="アイウエオカキクケコ01<>/?*+ABCDEF"
              className="text-white"
              encryptedClassName="text-emerald-300/70"
              parentClassName="inline-flex"
            />
          </h2>

          {/* progress dots */}
          <div className="absolute bottom-12 left-0 right-0 flex justify-center gap-2">
            {MANTRAS.map((_, i) => (
              <span
                key={i}
                className={`h-1.5 w-6 rounded-full transition-all ${
                  i === safeIndex ? "bg-emerald-300" : "bg-white/15"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   AGENT VOICE — coda after agents scroll
   ============================================================ */
export function AgentVoice() {
  return (
    <section className="relative overflow-hidden bg-black px-section py-section text-white">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.55) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.55) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
          maskImage: "radial-gradient(ellipse at center, black 15%, transparent 70%)",
        }}
      />

      <div className="relative mx-auto max-w-4xl text-center">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, ease: "easeOut" }}
          className="text-display-medium font-display tracking-tight leading-[1.12]"
        >
          <span className="block">I am your reasoning and your attention,</span>
          <span className="block">
            <span className="font-normal italic text-white/55">scaled past every limit.</span>
          </span>
          <span className="mt-3 block sm:mt-4">We move as one.</span>
        </motion.h2>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mt-12 flex justify-center gap-2 sm:mt-16"
        >
          {["24", "7"].map((n) => (
            <div
              key={n}
              className="grid h-14 w-14 place-items-center rounded-full border border-white font-mono text-sm font-bold"
            >
              {n}
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
