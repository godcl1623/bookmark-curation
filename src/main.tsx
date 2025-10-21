import "./index.css";

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import ModalProvider from "@/shared/providers/ModalProvider";

import App from "./App.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ModalProvider>
      <App />
    </ModalProvider>
  </StrictMode>
);
