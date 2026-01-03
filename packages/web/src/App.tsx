import { App as CapApp, type PluginListenerHandle } from "@capacitor/app";
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
      listenerHandle = await CapApp.addListener("appUrlOpen", (data) => {
        const url = new URL(data.url);
        if (url.hostname === "auth" && url.pathname === "/callback") {
          navigate("/auth/callback" + url.hash);
        }
      });
    })();

    return () => {
      listenerHandle?.remove();
    };
  }, [navigate]);
};
