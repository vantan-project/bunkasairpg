"use client";

import { UserStatus } from "@/components/shared/user-status";
import { useGlobalContext } from "@/hooks/use-global-context";
import { Footer } from "@/components/shared/footer";
import { BgCamera } from "@/components/shared/bg-camera";

export default function Page() {
  const { user } = useGlobalContext();

  return (
    <div>
      <BgCamera />

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

      <Footer />
    </div>
  );
}
