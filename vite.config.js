import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        target:
          "https://lzey6nhtd6.execute-api.us-east-1.amazonaws.com/dev/bills/date/range",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, "/dev/bills/date/range"),
      },
    },
  },
});
