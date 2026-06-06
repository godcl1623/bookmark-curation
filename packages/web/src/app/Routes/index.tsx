import { App as CapApp } from "@capacitor/app";
import { Browser } from "@capacitor/browser";
import type { PluginListenerHandle } from "@capacitor/core";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  BrowserRouter,
  Outlet,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from "react-router";

import App from "@/App";
import InitPrefetcher from "@/app/providers/QueryProvider/InitPrefetcher";
import AuthCallback from "@/features/auth/AuthCallback";
import Login from "@/features/auth/Login";
import useAuth from "@/shared/hooks/useAuth.ts";
import { checkIfMobileNative } from "@/shared/lib/utils";
import refreshToken from "@/shared/services/auth/refresh-token.ts";
import useAuthStore from "@/stores/auth.ts";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <DeepLinkListener />
      <Routes>
        <Route path={"/auth/callback"} element={<AuthCallback />} />

        <Route element={<CheckAuthentication />}>
          <Route path={"/"} element={<Login />} />
          <Route
            path={"/main/*"}
            element={
              <InitPrefetcher>
                <App />
              </InitPrefetcher>
            }
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

const useCheckAuthentication = () => {
  const accessToken = useAuthStore((state) => state.accessToken);
  const isLoggedOut = useAuthStore((state) => state.isLoggedOut);
  const setAccessToken = useAuthStore((state) => state.setAccessToken);
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (accessToken == null) {
      refreshToken()
        .then((response) => {
          if (response.access_token) {
            setAccessToken(response.access_token);
          }
        })
        .catch((error) => {
          if (!isLoggedOut) {
            toast.error("세션이 만료되었습니다. 다시 로그인해주세요.");
          }
          navigate("/", { replace: true });
          setIsReady(true);
          console.error(error);
        });
      return;
    }

    if (pathname === "/") {
      navigate("/main", { replace: true });
    } else {
      setIsReady(true);
    }
  }, [accessToken, setAccessToken, navigate, isLoggedOut, pathname]);

  return { isReady };
};

function CheckAuthentication() {
  useAuth();
  const { isReady } = useCheckAuthentication();

  if (!isReady) return null;

  return <Outlet />;
}

function DeepLinkListener() {
  const navigate = useNavigate();

  useEffect(() => {
    if (!checkIfMobileNative()) return;

    let listenerHandle: PluginListenerHandle | null = null;

    (async () => {
      listenerHandle = await CapApp.addListener("appUrlOpen", async (data) => {
        const url = new URL(data.url);

        // Android App Links (https://linkvault-dev.godcl.app/auth/callback?mobile=true&token=...)
        if (
          url.hostname === "linkvault-dev.godcl.app" ||
          url.hostname === "linkvault.godcl.app"
        ) {
          if (url.pathname === "/auth/callback") {
            navigate("/auth/callback" + url.search);
            return;
          }
        }

        // Legacy deep link support (linkvault://auth/...)
        if (url.hostname === "auth") {
          if (url.pathname === "/callback") {
            navigate("/auth/callback" + url.hash);
          } else if (url.pathname === "/success") {
            try {
              await Browser.close();
            } catch (error) {
              console.warn("Browser already closed or not open:", error);
            }
            navigate("/main", { replace: true });
          }
        }
      });
    })();

    return () => {
      listenerHandle?.remove();
    };
  }, [navigate]);

  return null;
}
