import React from "react";
import { motion } from "framer-motion";

const EASE = [0.22, 1, 0.36, 1];

/**
 * Reveal: simple fade + translate on enter.
 */
export function Reveal({
  children,
  delay = 0,
  y = 16,
  className = "",
  as: Tag = "div",
  immediate = false,
}) {
  const MotionTag = motion[Tag] || motion.div;
  const motionProps = immediate
    ? {
        initial: { opacity: 0, y },
        animate: { opacity: 1, y: 0 },
      }
    : {
        initial: { opacity: 0, y },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true, amount: 0.15 },
      };
  return (
    <MotionTag
      {...motionProps}
      transition={{ duration: 0.7, delay, ease: EASE }}
      className={className}
    >
      {children}
    </MotionTag>
  );
}

/**
 * Words: split a string into words and reveal each with a mask + slide-up.
 */
export function Words({
  text,
  className = "",
  delay = 0,
  stagger = 0.055,
  duration = 0.85,
  as: Tag = "span",
  immediate = false,
}) {
  const words = String(text).split(/(\s+)/);
  return (
    <Tag className={className}>
      {words.map((w, i) => {
        if (/^\s+$/.test(w)) return <span key={i}>{w}</span>;
        const motionProps = immediate
          ? { initial: { y: "180%" }, animate: { y: 0 } }
          : {
              initial: { y: "180%" },
              whileInView: { y: 0 },
              viewport: { once: true, amount: 0.15 },
            };
        return (
          <span key={i} className="mask">
            <motion.span
              {...motionProps}
              transition={{
                duration,
                delay: delay + (i / 2) * stagger,
                ease: EASE,
              }}
            >
              {w}
            </motion.span>
          </span>
        );
      })}
    </Tag>
  );
}

/**
 * Chars: per-character reveal. Used sparingly.
 */
export function Chars({
  text,
  className = "",
  delay = 0,
  stagger = 0.04,
  immediate = false,
}) {
  const chars = String(text).split("");
  return (
    <span className={className}>
      {chars.map((c, i) => {
        const motionProps = immediate
          ? { initial: { y: "180%" }, animate: { y: 0 } }
          : {
              initial: { y: "180%" },
              whileInView: { y: 0 },
              viewport: { once: true, amount: 0.15 },
            };
        return (
          <span key={i} className="mask">
            <motion.span
              {...motionProps}
              transition={{
                duration: 0.7,
                delay: delay + i * stagger,
                ease: EASE,
              }}
            >
              {c === " " ? "\u00A0" : c}
            </motion.span>
          </span>
        );
      })}
    </span>
  );
}

/**
 * CountUp: numeric counter triggered on scroll-in.
 */
export function CountUp({
  to,
  suffix = "",
  duration = 1.4,
  delay = 0,
  className = "",
}) {
  const [v, setV] = React.useState(0);
  const ref = React.useRef(null);
  React.useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        const num = parseFloat(String(to).replace(/[^\d.]/g, "")) || 0;
        const start = performance.now() + delay * 1000;
        const step = (t) => {
          const p = Math.max(0, Math.min(1, (t - start) / (duration * 1000)));
          setV(num * (1 - Math.pow(1 - p, 3)));
          if (p < 1) requestAnimationFrame(step);
          else setV(num);
        };
        requestAnimationFrame(step);
        obs.disconnect();
      },
      { threshold: 0.1 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [to, duration, delay]);
  const isInt = !String(to).includes(".");
  return (
    <span ref={ref} className={className}>
      {isInt ? Math.floor(v) : v.toFixed(1)}
      {suffix}
    </span>
  );
}
