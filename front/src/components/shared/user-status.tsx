import Image from "next/image";
import { UserIcon } from "./icons/user-icon";

type UserStatusProps = {
  name: string | null;
  imageUrl: string;
  level: number;
  hitPoint: number;
  maxHitPoint: number;
};

export function UserStatus({
  name,
  imageUrl,
  level = 0,
  hitPoint = 0,
  maxHitPoint = 0,
}: UserStatusProps) {
  const ratio = hitPoint / maxHitPoint;

  const getHpColor = () => {
    if (ratio > 0.5) return "oklch(89.7% 0.196 126.665)"; // 緑
    if (ratio > 0.25) return "oklch(90.5% 0.182 98.111)"; // 黄
    return "oklch(70.4% 0.191 22.216)"; // 赤
  };

  return (
    <div className="flex justify-center pt-3 px-10">
      <div className="w-full relative h-24 flex items-center p-2">
        <Image
          className="absolute -z-10"
          src="/user-status-backbrand.png"
          alt="backbrand"
          fill
        />

        <div className="w-full grid grid-cols-[64px_1fr] gap-2 items-center">
          <div className="rounded-full relative bg-gray-300 aspect-square flex items-center justify-center overflow-hidden text-white">
            {imageUrl ? (
              <Image
                className="object-cover w-full h-auto"
                src={imageUrl}
                alt="user"
                width={150}
                height={150}
              />
            ) : (
              <UserIcon className="w-full h-full" />
            )}
          </div>
          <div className="flex flex-col gap-2">
            <div className="flex justify-between px-1">
              <p className="whitespace-nowrap">{name}</p>
              <p>
                {"Lv. "}
                {level}
              </p>
            </div>
            <div className="relative w-full h-6 bg-gray-300 flex justify-end items-center">
              <div
                className="absolute top-0 right-0 h-full"
                style={{
                  width: `calc(${hitPoint} / ${maxHitPoint} * 100%)`,
                  backgroundColor: getHpColor(),
                }}
              />
              <p className="pr-2 z-10">
                {hitPoint}/{maxHitPoint}
              </p>
            </div>
          </div>
        </div>

        <div className="absolute -z-10 -bottom-0.5 right-[99%] w-10 h-[110px]">
          <Image src="/user-status-left.png" alt="left" fill />
        </div>

        <div className="absolute -z-10 -bottom-0.5 left-[99%] w-10 h-[110px]">
          <Image src="/user-status-right.png" alt="right" fill />
        </div>
      </div>
    </div>
  );
}
