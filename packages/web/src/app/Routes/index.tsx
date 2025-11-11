import { BrowserRouter, Route, Routes } from "react-router";

import App from "@/App";
import InitPrefetcher from "@/app/providers/QueryProvider/InitPrefetcher";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
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
