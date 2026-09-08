import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ isSsrBuild }) => ({
  plugins: [react()],
  build: {
    outDir: "dist",
    sourcemap: false,
    copyPublicDir: !isSsrBuild,
  },
  server: {
    proxy: { "/api": process.env.API_ORIGIN || "http://127.0.0.1:8010" },
  },
  test: {
    environment: "jsdom",
    setupFiles: ["./src/test/setup.js"],
    include: ["src/**/*.test.{js,jsx}"],
    restoreMocks: true,
  },
}));
