import "./index.css";

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Toaster } from "react-hot-toast";

import AppRoutes from "@/app/Routes";

import ModalProvider from "./app/providers/ModalProvider";
import QueryProvider from "./app/providers/QueryProvider";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryProvider>
      <ModalProvider>
        <AppRoutes />
        <Toaster />
      </ModalProvider>
    </QueryProvider>
  </StrictMode>
);
