"use client";

import { useEffect, useRef, useState } from "react";

type Props = {
  text: string;
  speed?: number;
  maxIterations?: number;
  sequential?: boolean;
  revealDirection?: "start" | "end" | "center";
  useOriginalCharsOnly?: boolean;
  characters?: string;
  className?: string;
  parentClassName?: string;
  encryptedClassName?: string;
  animateOn?: "hover" | "view";
};

export default function DecryptedText({
  text,
  speed = 50,
  maxIterations = 10,
  sequential = false,
  revealDirection = "start",
  useOriginalCharsOnly = false,
  characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()",
  className = "",
  parentClassName = "",
  encryptedClassName = "",
  animateOn = "hover",
}: Props) {
  const safeText = text ?? "";
  const [displayText, setDisplayText] = useState(safeText);
  const [isHovering, setIsHovering] = useState(false);
  const [isScrambling, setIsScrambling] = useState(false);
  const [revealedIndices, setRevealedIndices] = useState<Set<number>>(new Set());
  const [hasAnimated, setHasAnimated] = useState(false);
  const containerRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    setDisplayText(safeText);
    setRevealedIndices(new Set());
    setHasAnimated(false);
    setIsHovering(false);
    setIsScrambling(false);
  }, [safeText]);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    let currentIteration = 0;

    const getNextIndex = (revealed: Set<number>): number => {
      const total = safeText.length;
      switch (revealDirection) {
        case "end":
          return total - 1 - revealed.size;
        case "center": {
          const mid = Math.floor(total / 2);
          const offset = Math.floor(revealed.size / 2);
          const next = revealed.size % 2 === 0 ? mid + offset : mid - offset - 1;
          if (next >= 0 && next < total && !revealed.has(next)) return next;
          for (let i = 0; i < total; i++) if (!revealed.has(i)) return i;
          return 0;
        }
        default:
          return revealed.size;
      }
    };

    const availableChars = useOriginalCharsOnly
      ? Array.from(new Set(safeText.split(""))).filter((c) => !/\s/.test(c))
      : characters.split("");

    const shuffleText = (original: string, revealed: Set<number>) =>
      original
        .split("")
        .map((ch, i) => {
          if (/\s/.test(ch)) return ch;
          if (revealed.has(i)) return original[i];
          return availableChars[Math.floor(Math.random() * availableChars.length)];
        })
        .join("");

    if (isHovering) {
      setIsScrambling(true);
      interval = setInterval(() => {
        setRevealedIndices((prev) => {
          if (sequential) {
            if (prev.size < safeText.length) {
              const nextIndex = getNextIndex(prev);
              const next = new Set(prev);
              next.add(nextIndex);
              setDisplayText(shuffleText(safeText, next));
              return next;
            }
            clearInterval(interval);
            setIsScrambling(false);
            return prev;
          }
          setDisplayText(shuffleText(safeText, prev));
          currentIteration++;
          if (currentIteration >= maxIterations) {
            clearInterval(interval);
            setIsScrambling(false);
            setDisplayText(safeText);
          }
          return prev;
        });
      }, speed);
    } else {
      setDisplayText(safeText);
      setRevealedIndices(new Set());
      setIsScrambling(false);
    }
    return () => clearInterval(interval);
  }, [
    isHovering,
    safeText,
    speed,
    maxIterations,
    sequential,
    revealDirection,
    characters,
    useOriginalCharsOnly,
  ]);

  useEffect(() => {
    if (animateOn !== "view") return;
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting && !hasAnimated) {
            setIsHovering(true);
            setHasAnimated(true);
          }
        });
      },
      { threshold: 0.2 },
    );
    if (containerRef.current) obs.observe(containerRef.current);
    return () => obs.disconnect();
  }, [animateOn, hasAnimated]);

  const hoverProps =
    animateOn === "hover"
      ? {
          onMouseEnter: () => setIsHovering(true),
          onMouseLeave: () => setIsHovering(false),
        }
      : {};

  return (
    <span ref={containerRef} className={parentClassName} {...hoverProps}>
      <span className="sr-only">{safeText}</span>
      <span aria-hidden="true">
        {(displayText ?? safeText).split("").map((ch, i) => {
          const revealed = revealedIndices.has(i) || !isScrambling || !isHovering;
          return (
            <span key={i} className={revealed ? className : encryptedClassName}>
              {ch}
            </span>
          );
        })}
      </span>
    </span>
  );
}
