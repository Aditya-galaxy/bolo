import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// All Firebase entry points are pre-bundled together so the page never ends up with two copies of @firebase/app.
export default defineConfig({
  plugins: [react()],
  optimizeDeps: { include: ["firebase/app", "firebase/app-check", "firebase/ai", "firebase/remote-config"] },
});
