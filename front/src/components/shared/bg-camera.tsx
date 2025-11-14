import { Skeleton } from "@heroui/react";
import { usePathname, useRouter } from "next/navigation";
import { useZxing } from "react-zxing";

export function BgCamera() {
  const { ref } = useZxing();

  return (
    <>
      <div className="fixed inset-0 -z-10">
        <video
          ref={ref}
          className="w-full h-full object-cover"
          autoPlay
          muted
          playsInline
        />
      </div>
      <div className="fixed inset-0 -z-20">
        <Skeleton className="w-screen h-screen" />
      </div>
    </>
  );
}
