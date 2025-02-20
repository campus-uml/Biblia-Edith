import { defineConfig } from "vite";

export default defineConfig({
  optimizeDeps: {
    esbuildOptions: {
      define: {
        global: "globalThis", // Solución para algunas dependencias
        setupFiles: './src/setupTests.ts'
      },
    },
  },
});
