import type { CapacitorConfig } from "@capacitor/cli";

const isDev = process.env.NODE_ENV === "development";

const config: CapacitorConfig = {
  appId: "com.linkvault.app",
  appName: "LinkVault",
  webDir: "dist",
  server: {
    androidScheme: "https",
    ...(isDev && {
      // 개발 중에만 사용
      url: "http://localhost:5173",
      cleartext: true,
    }),
  },
};

export default config;
