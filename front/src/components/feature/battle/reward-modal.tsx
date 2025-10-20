import { ReawrdLog } from "@/app/battle/[monsterId]/page";
import Image from "next/image";
import { motion, useMotionValue, animate, useMotionValueEvent } from "framer-motion";
import { useState, RefObject } from "react";
import { Battle } from "@/utils/battle";

type Props = {
  level: number;
  imageUrl: string;
  setRewardLogs: React.Dispatch<React.SetStateAction<ReawrdLog[]>>;
  rewardLogs: ReawrdLog[];
  maxExp: number;
  minExp: number;
  width: number;
  previousWidth: number;
  isIncreasing: boolean;
  riseLevel: number;
  battle: Battle;
  rustLevel: number;
  stopExpRef: RefObject<boolean>;
};

export function RewardModal({
  level,
  imageUrl,
  setRewardLogs,
  rewardLogs,
  maxExp,
  minExp,
  width,
  previousWidth,
  isIncreasing,
  riseLevel,
  rustLevel,
  battle,
  stopExpRef,
}: Props) {
  const count = useMotionValue(maxExp); // アニメーション対象の値
  const [displayValue, setDisplayValue] = useState(maxExp); // 表示用 state

  // count の値が変わるたびに React state に反映
  useMotionValueEvent(count, "change", (latest) => {
    setDisplayValue(Math.round(latest));
  });

  // 🎯 アニメーションをクリック時に実行する
  const handleNextRewardLog = async() => {
    const [current, ...rest] = rewardLogs;
    current?.action();
    setRewardLogs(rest);
    if (riseLevel !== 0) {
      for (let i = 0; i < riseLevel; i++) {
        if (stopExpRef.current) break;
        // アニメーション開始
        await animate(count, 0, { duration: 0.8, ease: "easeOut" }).finished;
        if (stopExpRef.current) break;
        // 0.3秒待つ
        await new Promise((resolve) => setTimeout(resolve, 300));
        if (stopExpRef.current) break;
        // 必要ならcountを初期化（例）
        count.set(3000);
        if (stopExpRef.current) break;
      }
      const result = battle.changeExprience({level:rustLevel});
      count.set(result.expToNextLevel)
      animate(count, result.remainingExp, {
        duration: 0.8,
        ease: "easeOut",
      });
    } else {
      const result = battle.changeExprience({level: level});
      count.set(result.expToNextLevel)
      animate(count, result.remainingExp, {
        duration: 0.8,
        ease: "easeOut",
      });
    }
  };


  const animateWidth = isIncreasing
    ? { width: `${width * 100}%` }
    : { width: `${width * 100}%`, transition: { duration: 0 } };

  return (
    <div className="w-full flex justify-center items-center h-full text-sm">
      {rewardLogs.length > 0 && (
        <div
          className="fixed w-screen h-screen z-10"
          onClick={handleNextRewardLog}
        ></div>
      )}
      <div
        className="w-[90%] aspect-[380/605] bg-cover bg-center bg-no-repeat flex justify-center"
        style={{ backgroundImage: `url(${"/bg-reward.png"})` }}
      >
        <div className="w-[90%] flex flex-col items-center">
          <div className="mt-[10%]">
            <Image
              src={"/clear.png"}
              alt="タップ画像"
              width={1000}
              height={1000}
              priority
            />
          </div>
          <div className="bg-reward border border-black rounded-xl p-4 w-[90%] flex flex-col items-center mt-[7%]">
            <div className="flex border-b-1 justify-between w-full">
              <div className="flex items-center space-x-3">
                <div>LV</div>
                <div>{level}</div>
              </div>
              <div>次のレベルまで</div>
              <div>{displayValue}</div>
            </div>

            {/* 経験値バー */}
            <div className="relative w-[90%] h-3 bg-black border-black border rounded-full my-3 overflow-hidden">
              <motion.div
                className="h-full bg-[#1FA2C6] rounded-full"
                initial={{ width: `${previousWidth * 100}%` }}
                animate={animateWidth}
                transition={
                  isIncreasing
                    ? { duration: 0.8, ease: "easeOut" }
                    : { duration: 0 }
                }
              />
            </div>

            <div className="flex border-b-1 justify-between w-full">
              <div>クリアタイム</div>
              <div>0:0:27.7</div>
            </div>
          </div>

          <div className="relative bg-[#D51F1F] aspect-square w-[40%] mt-[15%] rounded-lg flex justify-center items-center">
            <div className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 px-5 py-1 rounded-full bg-reward border whitespace-nowrap">
              取得武器&amp;アイテム
            </div>
            {imageUrl ? (
              <Image
                className="w-[70%] mt-[10%] aspect-square"
                src={imageUrl}
                alt="取得アイテムか武器画像"
                width={500}
                height={500}
              />
            ) : (
              <div className="w-[70%] mt-[10%] aspect-square bg-[#ADA18C] flex justify-center items-center text-white">
                なし
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
