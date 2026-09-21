import { defineConfig } from "vite";
import path from "path"; // Import path
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      // This maps the "@" symbol to your "src" folder
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
