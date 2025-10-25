"use client";

import Image from "next/image";
import { useSearchParams } from "next/navigation";

export default function () {
  const searchParams = useSearchParams();
  const isNotLoggedIn = searchParams.has("notLoggedIn");

  return (
    <>
      <div
        className="overflow-hidden"
        onClick={() => {
          location.href = "/camera";
        }}
      >
        <Image src="/start-page.png" alt="start-page" fill unoptimized />
      </div>
      {isNotLoggedIn ? (
        <div className="fixed w-full h-full flex items-center justify-center bg-black/70">
          <div className="relative w-[90%] h-[30vh] flex items-center justify-center">
            <Image
              className="absolute -z-10"
              src="/bg-reward.png"
              alt="bg-reward"
              fill
              priority
            />
            <p className="text-lg text-center text-yellow-950 font-bold leading-10 tracking-[3.04px] [text-shadow:_1px_1px_0_#F8E1CF,_-1px_-1px_0_#F8E1CF,_1px_-1px_0_#F8E1CF,_-1px_1px_0_#F8E1CF]">
              四階で勇者の
              <br />
              QRをもらって
              <br />
              冒険を始めよう!
            </p>
          </div>
        </div>
      ) : (
        <div></div>
      )}
    </>
  );
}
