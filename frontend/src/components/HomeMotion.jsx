import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { HOME_MOTION_QUERY } from "./useHomeMotionEnabled";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export default function HomeMotion({ pageRef }) {
  useGSAP(() => {
    const media = gsap.matchMedia();
    media.add(HOME_MOTION_QUERY, () => {
      const page = pageRef.current;
      const introduction = page.querySelector(".home-process-intro");
      const steps = page.querySelector(".home-process-steps");
      ScrollTrigger.create({
        trigger: introduction,
        start: "top top+=112",
        end: () => `+=${Math.max(0, steps.offsetHeight - introduction.offsetHeight)}`,
        pin: true,
        pinSpacing: false,
        invalidateOnRefresh: true,
      });
      // Both endpoints use the current theme's readable text colors.
      gsap.fromTo(page.querySelectorAll(".statement-word"),
        { "--word-emphasis": 0 },
        {
          "--word-emphasis": 1, duration: 1, stagger: 0.16, ease: "none",
          scrollTrigger: { trigger: page.querySelector(".home-statement"), start: "top 80%", end: "bottom 52%", scrub: 0.5 },
        },
      );
      // Disclosures can change the height above the pinned section.
      const observer = new ResizeObserver(() => ScrollTrigger.refresh());
      observer.observe(page.querySelector(".capabilities-accordion"));
      return () => observer.disconnect();
    });
    return () => media.revert();
  }, { scope: pageRef });
  return null;
}
