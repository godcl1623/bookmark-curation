import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { defineConfig, loadEnv } from "vite";
import { VitePWA } from "vite-plugin-pwa";

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  const env = loadEnv(mode, process.cwd(), "");

  return {
    plugins: [
      react(),
      tailwindcss(),
      VitePWA({
        registerType: "autoUpdate",
        includeAssets: ["vite.svg"],
        devOptions: {
          enabled: false, // 로컬 개발에서 PWA 비활성화
        },
        manifest: {
          name: "LinkVault",
          short_name: "LinkVault",
          description: "북마크 큐레이션 서비스",
          theme_color: "#ffffff",
          background_color: "#ffffff",
          display: "standalone",
          start_url: "/",
          icons: [
            {
              src: "/icons/pwa-192x192.png",
              sizes: "192x192",
              type: "image/png",
            },
            {
              src: "/icons/pwa-512x512.png",
              sizes: "512x512",
              type: "image/png",
            },
            {
              src: "/icons/pwa-512x512.png",
              sizes: "512x512",
              type: "image/png",
              purpose: "any maskable",
            },
          ],
        },
        workbox: {
          globPatterns: ["**/*.{js,css,html,ico,png,svg}"],
          runtimeCaching: [
            {
              urlPattern: /^https:\/\/api\./i, // 프로덕션 API 캐싱 (api.로 시작하는 도메인)
              handler: "NetworkFirst",
              options: {
                cacheName: "api-cache",
                expiration: {
                  maxEntries: 10,
                  maxAgeSeconds: 60 * 60 * 24, // 24시간
                },
                cacheableResponse: {
                  statuses: [0, 200],
                },
              },
            },
          ],
        },
      }),
    ],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    server: {
      host: "0.0.0.0",
      hmr: {
        clientPort: 443,
      },
      proxy: {
        // /api로 시작하는 모든 요청은 백엔드로 프록시
        "/api": {
          target: env.VITE_BACKEND_URL || "http://localhost:3002",
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ""),
        },
      },
      allowedHosts: env.ALLOWED_HOSTS?.split(",").map((host) =>
        host.trim()
      ) ?? ["localhost"],
    },
    preview: {
      allowedHosts: env.ALLOWED_HOSTS?.split(",").map((host) =>
        host.trim()
      ) ?? ["localhost"],
    },
  };
});
