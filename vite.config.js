import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        target: import.meta.env.VITE_URL_DATE_RANGE,
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, "/dev/bills/date/range"),
      },
    },
  },
});
