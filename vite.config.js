import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  cacheDir: ".vite-cache",
  plugins: [react()],
  build: {
    rolldownOptions: {
      output: {
        codeSplitting: {
          groups: [
            {
              name: "translations",
              test: /[\\/]src[\\/]traducoes[\\/]dicionarios[\\/]/,
            },
          ],
        },
      },
    },
  },
});
