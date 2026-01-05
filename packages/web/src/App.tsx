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
        const url = new URL(data.url);

        if (url.hostname === "auth") {
          if (url.pathname === "/callback") {
            // Legacy deep link support (backward compatibility)
            navigate("/auth/callback" + url.hash);
          } else if (url.pathname === "/success") {
            // New flow: browser already handled token storage
            // Close the browser and navigate to home
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
