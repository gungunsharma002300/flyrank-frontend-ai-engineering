import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    setupFiles: "./src/test/setup.js",
    globals: true,
    css: false,
    clearMocks: true,
    include: ["tests/**/*.test.{js,jsx}"],
    exclude: ["e2e/**", "node_modules/**"],
  },
});
