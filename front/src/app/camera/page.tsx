"use client";

import { UserStatus } from "@/components/shared/user-status";
import { useGlobalContext } from "@/hooks/use-global-context";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useZxing } from "react-zxing";

export default function Page() {
  const router = useRouter();
  const { ref } = useZxing({
    onDecodeResult(result) {
      const text = result.getText();

      const url = new URL(text, window.location.origin);
      const currentOrigin = window.location.origin;

      if (url.origin === currentOrigin && url.pathname.startsWith("/battle")) {
        router.push(url.pathname + url.search + url.hash);
      }
    },
  });

  const { user } = useGlobalContext();

  return (
    <div>
      <div className="fixed inset-0 -z-10">
        <video
          ref={ref}
          className="w-full h-full object-cover"
          autoPlay
          muted
          playsInline
        />
      </div>

      <div className="fixed top-0 w-full p-2">
        <UserStatus
          name={user.name}
          imageUrl={user.imageUrl}
          level={user.level}
          hitPoint={user.hitPoint}
          maxHitPoint={user.maxHitPoint}
        />
      </div>

      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <p className="text-white text-center pb-4">
          QRコードをスキャンしてください。
        </p>
        <div className="w-80 h-80 border-2 border-white" />
      </div>

      <div className="fixed bottom-0 w-full h-24 flex justify-center overflow-hidden">
        <Image
          className="w-[110%] h-full"
          width={100}
          height={100}
          src="/tab-bar-backgrand.png"
          alt="tab-bar"
        />
      </div>
      <div className="w-full flex justify-center gap-3 fixed bottom-5">
        <Link className="w-24 h-auto" href="/camera">
          <Image
            className="w-full h-full"
            width={100}
            height={100}
            src="/home-btn.png"
            alt="home"
          />
        </Link>
        <Link className="w-24 h-auto" href="/encyclopedia">
          <Image
            className="w-full h-full"
            width={100}
            height={100}
            src="/encyclopedia_btn.png"
            alt="home"
          />
        </Link>
        <Link className="w-24 h-auto" href="/profile">
          <Image
            className="w-full h-full"
            width={100}
            height={100}
            src="/profile_btn.png"
            alt="home"
          />
        </Link>
      </div>
    </div>
  );
}
