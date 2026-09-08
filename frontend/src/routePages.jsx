import { lazy } from "react";

function page(importPage) {
  let request;
  const preload = () => request ??= importPage().catch((error) => {
    request = null;
    throw error;
  });
  return { Component: lazy(preload), preload };
}

export const routePages = {
  "/": page(() => import("./pages/Home")),
  "/services": page(() => import("./pages/Services")),
  "/about": page(() => import("./pages/About")),
  "/contact": page(() => import("./pages/Contact")),
  "/admin": page(() => import("./pages/Admin")),
  "/solutions/reduce-workload": page(() => import("./pages/SolutionReduceWorkload")),
  "/solutions/increase-conversion": page(() => import("./pages/SolutionIncreaseConversion")),
  "*": page(() => import("./pages/NotFound")),
};

export function preloadPage(pathname) {
  return routePages[pathname]?.preload() ?? Promise.resolve();
}
