import Logo from "@/shared/components/molecules/Logo";
import { openOAuthUrl } from "@/shared/lib/auth/oauth";

export default function Login() {
  const handleLogin = async () => {
    await openOAuthUrl(import.meta.env.VITE_API_URL + "/auth/google");
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
