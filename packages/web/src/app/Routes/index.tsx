import { App as CapApp } from "@capacitor/app";
import { Browser } from "@capacitor/browser";
import type { PluginListenerHandle } from "@capacitor/core";
import { useEffect } from "react";
import { BrowserRouter, Route, Routes, useNavigate } from "react-router";

import App from "@/App";
import InitPrefetcher from "@/app/providers/QueryProvider/InitPrefetcher";
import AuthCallback from "@/features/auth/AuthCallback";
import Login from "@/features/auth/Login";
import { checkIfMobileNative } from "@/shared/lib/utils";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <DeepLinkListener />
      <Routes>
        <Route path={"/auth/callback"} element={<AuthCallback />} />
        <Route path={"/login"} element={<Login />} />
        <Route
          path={"/*"}
          element={
            <InitPrefetcher>
              <App />
            </InitPrefetcher>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

function DeepLinkListener() {
  const navigate = useNavigate();

  useEffect(() => {
    if (!checkIfMobileNative()) return;

    let listenerHandle: PluginListenerHandle | null = null;

    (async () => {
      listenerHandle = await CapApp.addListener("appUrlOpen", async (data) => {
        const url = new URL(data.url);

        // Android App Links (https://linkvault-dev.godcl.app/auth/callback?mobile=true&token=...)
        if (
          url.hostname === "linkvault-dev.godcl.app" ||
          url.hostname === "linkvault.godcl.app"
        ) {
          if (url.pathname === "/auth/callback") {
            navigate("/auth/callback" + url.search);
            return;
          }
        }

        // Legacy deep link support (linkvault://auth/...)
        if (url.hostname === "auth") {
          if (url.pathname === "/callback") {
            navigate("/auth/callback" + url.hash);
          } else if (url.pathname === "/success") {
            try {
              await Browser.close();
            } catch (error) {
              console.warn("Browser already closed or not open:", error);
            }
            navigate("/", { replace: true });
          }
        }
      });
    })();

    return () => {
      listenerHandle?.remove();
    };
  }, [navigate]);

  return null;
}
