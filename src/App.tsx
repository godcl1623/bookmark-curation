import { Toaster } from "react-hot-toast";

import BookmarkList from "@/features/BookmarkList";
import DirectoryTree from "@/features/DirectoryTree";
import Header from "@/features/Header";
import ClientViewLayout from "@/shared/components/layouts/client";

function App() {
  return (
    <>
      <Header />
      <ClientViewLayout>
        <DirectoryTree />
        <BookmarkList />
      </ClientViewLayout>
      <Toaster />
    </>
  );
}

export default App;
