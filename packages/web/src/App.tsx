import axios from "axios";
import { useEffect } from "react";
import { Toaster } from "react-hot-toast";

import useGlobalStore from "@/stores/global.ts";

import BookmarkList from "./features/bookmarks/BookmarkList";
import DirectoryTree from "./features/bookmarks/DirectoryTree";
import Header from "./features/bookmarks/Header";
import ClientViewLayout from "./shared/components/layouts/client";

function App() {
  const isMobile = useGlobalStore((state) => state.isMobile);
  useTemporalHealthCheck();

  return (
    <>
      <Header />
      <ClientViewLayout>
        {!isMobile && <DirectoryTree />}
        <BookmarkList />
      </ClientViewLayout>
      <Toaster />
    </>
  );
}

export default App;

const useTemporalHealthCheck = () => {
  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_URL}/db-health`).then((res) => {
      console.log(res.data);
    });
  }, []);
};
