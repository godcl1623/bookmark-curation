import "./index.css";

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import App from "./App.tsx";
import ModalProvider from "./app/providers/ModalProvider";
import QueryProvider from "./app/providers/QueryProvider";
import InitPrefetcher from "./app/providers/QueryProvider/InitPrefetcher.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryProvider>
      <ModalProvider>
        <InitPrefetcher>
          <App />
        </InitPrefetcher>
      </ModalProvider>
    </QueryProvider>
  </StrictMode>
);
