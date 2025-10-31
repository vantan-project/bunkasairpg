import Image from "next/image";
import { UserIcon } from "@/components/shared/icons/user-icon";
export function RankingCard() {
  return (
    <div className="flex h-full w-full bg-white border-2 border-black">
      <div className="flex justify-center items-center bg-red-400">
        <div className="relative mr-2">
          <div className="relative w-[90px] h-[100px]">
            <Image fill src="/bg-weapon.png" alt="ランキングカード" />
          </div>
          <div className="absolute inset-0 flex items-center justify-center text-4xl text-white z-10 text-shadow-outline">
            11
          </div>
        </div>
      </div>
      <div className="relative aspect-square w-auto h-full bg-gray-300">
        <UserIcon className="w-full h-full" />
      </div>
      <div className="bg-blue-500 flex-grow">名前が入ります</div>
    </div>
  );
}
