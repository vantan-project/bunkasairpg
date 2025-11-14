"use client";

import { authUserLogin } from "@/api/auth-user-login";
import { useParams } from "next/navigation";
import { useEffect } from "react";
import Cookies from "js-cookie";
import { LoadingScreen } from "@/components/shared/loading-screen";

export default function Page() {
  const { userId } = useParams();

  useEffect(() => {
    if (typeof userId !== "string") return;

    authUserLogin({ id: userId })
      .then((res) => {
        Cookies.set("authToken", res.authToken, { expires: 7, path: "/" });
        window.location.href = "/";
      })
      .catch(() => {
        window.location.href = "/?notLoggedIn=1";
      });
  }, [userId]);

  return <LoadingScreen />;
}
