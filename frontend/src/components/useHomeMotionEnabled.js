import { useEffect, useState } from "react";

export const HOME_MOTION_QUERY = "(min-width: 1024px) and (min-height: 700px) and (prefers-reduced-motion: no-preference)";

// Keep the animation library outside the server render and mobile download path.
export function useHomeMotionEnabled() {
  const [enabled, setEnabled] = useState(false);
  useEffect(() => {
    if (!window.matchMedia) return;
    const media = window.matchMedia(HOME_MOTION_QUERY);
    const update = () => setEnabled(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);
  return enabled;
}
