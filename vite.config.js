import react from "@vitejs/plugin-react";
import geo from "vite-plugin-geo";
import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    geo({
      domain: "https://reporeef.com",
    }),
  ],
  build: {
    chunkSizeWarningLimit: 800, // 500 → 800
  },
});
