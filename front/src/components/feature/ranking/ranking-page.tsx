import Image from "next/image";
import { RankingCard } from "./ranking-card";
export function RankingPage() {
  return (
    <div className="h-full w-full flex flex-col items-center justify-end">
      <h1 className="text-xl">ランキング</h1>
      <Image
        className="w-[70%] h-[2px]"
        width={100}
        height={100}
        src="/profile-border.png"
        alt="見出しの下線"
      />
      <div className="flex w-[80%] mt-10 items-end">
        <div className="relative w-[50%] h-14 text-white flex justify-center items-center">
          <Image
            fill
            src="/ranking-selected-btn.png"
            alt="ランキングボタン画像"
          />
          <div className="absolute text-lg">コンプリート</div>
        </div>
        <div className="relative w-[50%] h-12 flex justify-center items-center">
          <Image fill src="/ranking-btn.png" alt="ランキングボタン画像" />
          <div className="absolute">ボス討伐</div>
        </div>
      </div>
      <div
        className="relative h-[80%] w-full bg-cover bg-center bg-no-repeat flex flex-col items-center"
        style={{ backgroundImage: `url(${"/bg-reward.png"})` }}
      >
        <div className="h-[83%] w-full p-6">
          <div className="overflow-y-scroll h-full w-full [&::-webkit-scrollbar]:hidden">
            <div className="w-full h-18 mt-10">
                <RankingCard/>
            </div>
            <div className="w-full h-20 bg-white mb-10"></div>
            <div className="w-full h-20 bg-white mb-10"></div>
            <div className="w-full h-20 bg-white mb-10"></div>
            <div className="w-full h-20 bg-white mb-10"></div>
          </div>
        </div>
        <div className="absolute bottom-[13%] w-full h-20 px-6">
          <div className=" bg-white w-full h-full"></div>
        </div>
        <Image
        className="absolute bottom-[2%] w-[30%] h-auto"
        width={100}
        height={100}
        src="/back-button.png"
        alt="戻るボタン"
      />
      </div>
    </div>
  );
}
