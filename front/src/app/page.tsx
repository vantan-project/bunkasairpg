"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

export default function () {
  const router = useRouter();
  return (
    <div className="overflow-hidden" onClick={() => router.push("/camera")}>
      <Image src="/start-page.png" alt="start-page" fill unoptimized />
    </div>
  );
}
