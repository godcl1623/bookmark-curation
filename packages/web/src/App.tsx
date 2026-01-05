import { App as CapApp } from "@capacitor/app";
import { Browser } from "@capacitor/browser";
import type { PluginListenerHandle } from "@capacitor/core";
import { useEffect } from "react";
import { useNavigate } from "react-router";

import { checkIfMobileNative } from "@/shared/lib/utils";
import useGlobalStore from "@/stores/global.ts";

import BookmarkList from "./features/bookmarks/BookmarkList";
import DirectoryTree from "./features/bookmarks/DirectoryTree";
import Header from "./features/bookmarks/Header";
import ClientViewLayout from "./shared/components/layouts/client";

function App() {
  const isMobile = useGlobalStore((state) => state.isMobile);
  useDeepLinkListener();

  return (
    <>
      <Header />
      <ClientViewLayout>
        {!isMobile && <DirectoryTree />}
        <BookmarkList />
      </ClientViewLayout>
    </>
  );
}

export default App;

const useDeepLinkListener = () => {
  const navigate = useNavigate();

  useEffect(() => {
    if (!checkIfMobileNative()) return;

    let listenerHandle: PluginListenerHandle | null = null;

    (async () => {
      listenerHandle = await CapApp.addListener("appUrlOpen", async (data) => {
        console.log("[appUrlOpen] Received URL:", data.url);
        const url = new URL(data.url);

        // Android App Links (https://linkvault-dev.godcl.app/auth/callback?mobile=true&token=...)
        if (
          url.hostname === "linkvault-dev.godcl.app" ||
          url.hostname === "linkvault.godcl.app"
        ) {
          if (url.pathname === "/auth/callback") {
            console.log("[appUrlOpen] Navigating to /auth/callback with query:", url.search);
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
};
