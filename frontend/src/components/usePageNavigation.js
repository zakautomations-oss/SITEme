import { useCallback, useEffect, useRef, useState } from "react";
import { flushSync } from "react-dom";
import { useLocation, useNavigate } from "react-router-dom";
import { PUBLIC_ROUTES } from "../config/routes";
import { preloadPage } from "../routePages";

export function usePageNavigation() {
  const location = useLocation();
  const navigate = useNavigate();
  const sequence = useRef(0);
  const alive = useRef(true);
  const animation = useRef(null);
  const pending = useRef(null);
  const [navigationPending, setNavigationPending] = useState(false);

  const finishPending = useCallback(() => {
    if (!pending.current) return;
    clearTimeout(pending.current.timeout);
    pending.current.resolve();
    pending.current = null;
  }, []);

  const onPageReady = useCallback((pathname) => {
    setNavigationPending(false);
    if (pending.current?.pathname === pathname) finishPending();
  }, [finishPending]);

  useEffect(() => { sequence.current += 1; }, [location.key]);
  useEffect(() => {
    alive.current = true;
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const reduce = () => { if (preference.matches) animation.current?.skipTransition(); };
    // Back can cancel a suspended route without committing a new React key.
    const cancelNavigation = () => {
      sequence.current += 1;
      animation.current?.skipTransition();
      finishPending();
      setNavigationPending(false);
    };
    preference.addEventListener("change", reduce);
    window.addEventListener("popstate", cancelNavigation);
    return () => {
      alive.current = false;
      sequence.current += 1;
      animation.current?.skipTransition();
      finishPending();
      preference.removeEventListener("change", reduce);
      window.removeEventListener("popstate", cancelNavigation);
    };
  }, [finishPending]);

  const destination = (event) => {
    const anchor = event.target.closest?.("a[href]");
    if (!anchor || anchor.hasAttribute("download") || (anchor.target && anchor.target !== "_self")) return;
    const url = new URL(anchor.href, window.location.href);
    if (url.origin !== window.location.origin || !PUBLIC_ROUTES[url.pathname]) return;
    return url;
  };

  const prefetch = (event) => {
    const url = destination(event);
    if (url && url.pathname !== location.pathname && !navigator.connection?.saveData) {
      // Intent only: this downloads page code, never page data or the admin route.
      preloadPage(url.pathname).catch(() => {});
    }
  };

  const onClickCapture = (event) => {
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const url = destination(event);
    if (!url) return;
    const intent = ++sequence.current;
    animation.current?.skipTransition();
    finishPending();
    setNavigationPending(url.pathname !== location.pathname);
    if (url.pathname === location.pathname || url.hash || location.pathname === "/admin"
      || !document.startViewTransition || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    event.preventDefault();
    const path = url.pathname + url.search;
    // Navigation starts immediately even if this request is slow or offline.
    preloadPage(url.pathname).catch(() => {});
    try {
      const transition = document.startViewTransition(() => {
        if (!alive.current || intent !== sequence.current) return;
        return new Promise((resolve) => {
          // Wait for content, focus, and scroll, with a bounded snapshot hold.
          // Slow routes retain the outgoing page and their loading indicator.
          pending.current = { pathname: url.pathname, resolve, timeout: setTimeout(finishPending, 650) };
          flushSync(() => navigate(path));
        });
      });
      animation.current = transition;
      transition.ready.catch(() => {});
      transition.finished.catch(() => {}).finally(() => {
        if (animation.current === transition) animation.current = null;
      });
    } catch {
      finishPending();
      navigate(path);
    }
  };

  return { onPageReady, navigationPending, onClickCapture, onPointerOverCapture: prefetch, onFocusCapture: prefetch };
}
