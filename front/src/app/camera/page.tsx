"use client";

import { UserStatus } from "@/components/shared/user-status";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useZxing } from "react-zxing";

export default function Page() {
  const router = useRouter();
  const { ref } = useZxing({
    onDecodeResult(result) {
      window.location.assign(result.getText());
    },
  });

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

      <div className="fixed top-0 w-full">
        <UserStatus />
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
