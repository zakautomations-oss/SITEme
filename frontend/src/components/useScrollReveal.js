import { useEffect } from "react";

// Enhance only offscreen content; server-rendered and restored viewport content stays visible.
export function useScrollReveal(scopeRef, selector) {
  useEffect(() => {
    const scope = scopeRef.current;
    if (!scope || !window.matchMedia || !window.IntersectionObserver) return;
    const media = window.matchMedia("(prefers-reduced-motion: no-preference)");
    const elements = [...scope.querySelectorAll(selector)];
    const seen = new Set();
    let observer;
    let disposed = false;

    const finish = (element) => {
      seen.add(element);
      observer?.unobserve(element);
      element.removeAttribute("data-scroll-reveal");
    };
    const configure = () => {
      observer?.disconnect();
      elements.forEach(element => element.removeAttribute("data-scroll-reveal"));
      if (!media.matches) {
        elements.forEach(element => seen.add(element));
        return;
      }
      observer = new IntersectionObserver((entries) => {
        if (disposed || !media.matches) return;
        entries.forEach(({ target, isIntersecting }) => {
          if (!isIntersecting || target.dataset.scrollReveal !== "pending") return;
          seen.add(target);
          observer.unobserve(target);
          target.dataset.scrollReveal = "revealing";
        });
      }, { threshold: 0, rootMargin: "0px 0px -32px 0px" });
      elements.forEach((element) => {
        if (seen.has(element)) return;
        if (element.getBoundingClientRect().top < window.innerHeight || element.contains(document.activeElement)) {
          seen.add(element);
          return;
        }
        element.dataset.scrollReveal = "pending";
        observer.observe(element);
      });
    };
    const onFocus = (event) => {
      const element = event.target.closest?.("[data-scroll-reveal]");
      if (element && scope.contains(element)) finish(element);
    };
    const onAnimationEnd = (event) => {
      if (event.animationName === "home-scroll-reveal" && event.target.dataset.scrollReveal === "revealing") finish(event.target);
    };

    // Let the route-ready effect restore scroll before measuring the first viewport.
    const initialFrame = requestAnimationFrame(configure);
    media.addEventListener("change", configure);
    scope.addEventListener("focusin", onFocus);
    scope.addEventListener("animationend", onAnimationEnd);
    return () => {
      disposed = true;
      cancelAnimationFrame(initialFrame);
      observer?.disconnect();
      media.removeEventListener("change", configure);
      scope.removeEventListener("focusin", onFocus);
      scope.removeEventListener("animationend", onAnimationEnd);
      elements.forEach(element => element.removeAttribute("data-scroll-reveal"));
    };
  }, [scopeRef, selector]);
}
