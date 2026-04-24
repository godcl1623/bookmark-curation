import { useEffect } from "react";

import { autoA11yTest } from "@/shared/lib/utils";
import useGlobalStore from "@/stores/global.ts";

import BookmarkList from "./features/bookmarks/BookmarkList";
import DirectoryTree from "./features/bookmarks/DirectoryTree";
import Header from "./features/bookmarks/Header";
import ClientViewLayout from "./shared/components/layouts/client";

function App() {
  const isMobile = useGlobalStore((state) => state.isMobile);

  useA11yTest();

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

const useA11yTest = () => {
  useEffect(() => {
    void autoA11yTest();
  }, []);
};
