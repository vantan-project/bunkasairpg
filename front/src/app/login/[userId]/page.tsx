"use client";

import { authUserLogin } from "@/api/auth-user-login";
import { useParams } from "next/navigation";
import { useEffect } from "react";
import Cookies from "js-cookie";

export default function Page() {
  const { userId } = useParams();

  useEffect(() => {
    if (typeof userId !== "string") return;

    authUserLogin({ id: userId })
      .then((res) => {
        Cookies.set("authToken", res.authToken);
        window.location.href = "/";
      })
      .catch(() => {
        window.location.href = "/guide";
      });
  }, [userId]);

  return (
    <div className="h-screen flex justify-center items-center text-4xl">
      Loading...
    </div>
  );
}
