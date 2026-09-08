"use client";
import React, { useEffect, useRef } from "react";

// Static HTML stays readable. Motion only adds a short entrance and never
// gates visibility; reduced-motion users receive the static version.
export function Reveal({ children, className = "", as: Tag = "div", immediate = false }) {
  const ref = useRef(null);
  useEffect(() => {
    const element = ref.current;
    if (!element || !window.IntersectionObserver || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (immediate) { element.classList.add("reveal-enter"); return; }
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { element.classList.add("reveal-enter"); observer.disconnect(); }
    }, { threshold: 0.1 });
    observer.observe(element);
    return () => observer.disconnect();
  }, [immediate]);
  return <Tag ref={ref} className={className}>{children}</Tag>;
}
export function Words({ text, className = "", as: Tag = "span" }) { return <Tag className={className}>{text}</Tag>; }
export function Chars({ text, className = "" }) { return <span className={className}>{text}</span>; }
export function CountUp({ to, suffix = "", className = "" }) { return <span className={className}>{to}{suffix}</span>; }
