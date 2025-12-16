import { BrowserRouter, Route, Routes } from "react-router";

import App from "@/App";
import InitPrefetcher from "@/app/providers/QueryProvider/InitPrefetcher";
import AuthCallback from "@/features/auth/AuthCallback";
import Login from "@/features/auth/Login";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path={"/auth/callback"} element={<AuthCallback />} />
        <Route path={"/login"} element={<Login />} />
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
