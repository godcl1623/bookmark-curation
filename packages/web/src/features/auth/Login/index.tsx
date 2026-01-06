import { useEffect } from "react";
import toast from "react-hot-toast";
import { useSearchParams } from "react-router";

import Logo from "@/shared/components/molecules/Logo";
import { openOAuthUrl } from "@/shared/lib/auth/oauth";
import { checkIfMobileNative } from "@/shared/lib/utils";

export default function Login() {
  const [searchParams] = useSearchParams();

  // 에러 처리
  useEffect(() => {
    const error = searchParams.get("error");
    if (error) {
      const errorMessages: Record<string, string> = {
        authentication_failed: "로그인에 실패했습니다. 다시 시도해주세요.",
        server_error: "서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.",
      };
      toast.error(errorMessages[error] || "알 수 없는 오류가 발생했습니다.");
    }
  }, [searchParams]);

  const handleLogin = async () => {
    const endpoint = checkIfMobileNative()
      ? "/auth/google/mobile"
      : "/auth/google";
    await openOAuthUrl(import.meta.env.VITE_API_URL + endpoint);
  };

  return (
    <div className={"h-screen bg-blue-50/75"}>
      <div
        className={
          "screen-center flex-col-center-center w-9/10 max-w-[480px] gap-10 rounded-lg bg-white p-10 shadow-md md:w-[480px]"
        }
      >
        <Logo />
        <button onClick={handleLogin}>
          <img
            srcSet={
              "/images/google-signin/web_neutral_sq_ctn@1x.png 189w, /images/google-signin/web_neutral_sq_ctn@2x.png 378w, /images/google-signin/web_neutral_sq_ctn@3x.png 567w"
            }
            sizes={"(max-width: 640px) 189px, 378px"}
            alt={"Google Signin"}
            className={"h-7 md:h-10"}
          />
        </button>
      </div>
    </div>
  );
}
