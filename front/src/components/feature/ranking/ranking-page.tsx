"use client";
import Image from "next/image";
import { RankingCard } from "./ranking-card";
import { ClearRankingItem, userClearRanking } from "@/api/user-clear-ranking";
import { CollectedRankingItem, userCollectedRanking } from "@/api/user-collected-ranking";
import { useEffect, useState } from "react";
import { MeRankingCard } from "./me-ranking-card";
export function RankingPage() {
  const [collectedRankings, setCollectedRankings] = useState<CollectedRankingItem[]>([]);
  const [meCollectedRanking, setMeCollectedRanking] = useState<CollectedRankingItem>();
  const [clearRankings, setclearRankings] = useState<ClearRankingItem[]>([]);
  const [meClearRanking, setMeClearRanking] = useState<ClearRankingItem>();
  const [mode, setMode] = useState(true);

  useEffect(() => {
    userClearRanking().then((res) => {
      setMeClearRanking(res.userRanking);
      setclearRankings(res.rankings);
    });
    userCollectedRanking().then((res) => {
      setMeCollectedRanking(res.userRanking);
      setCollectedRankings(res.rankings);
    });
  }, []);

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
      {mode ? (
        <div className="flex w-[80%] mt-10 items-end">
          <div className="relative w-[50%] h-14 text-white flex justify-center items-center">
            <Image
              fill
              src="/ranking-selected-btn.png"
              alt="ランキングボタン画像"
            />
            <div className="absolute text-lg">コンプリート</div>
          </div>
          <div
            className="relative w-[50%] h-12 flex justify-center items-center"
            onClick={() => setMode(false)}
          >
            <Image fill src="/ranking-btn.png" alt="ランキングボタン画像" />
            <div className="absolute">ボス討伐</div>
          </div>
        </div>
      ) : (
        <div className="flex w-[80%] mt-10 items-end">
          <div
            className="relative w-[50%] h-12 flex justify-center items-center"
            onClick={() => setMode(true)}
          >
            <Image fill src="/ranking-btn.png" alt="ランキングボタン画像" />
            <div className="absolute">コンプリート</div>
          </div>
          <div className="relative w-[50%] h-14 text-white flex justify-center items-center">
            <Image
              fill
              src="/ranking-selected-btn.png"
              alt="ランキングボタン画像"
            />
            <div className="absolute text-lg">ボス討伐</div>
          </div>
        </div>
      )}

      <div
        className="relative h-[80%] w-full bg-cover bg-center bg-no-repeat flex flex-col items-center [box-shadow:0_-8px_10px_-1px_rgba(0,0,0,0.25)]"
        style={{ backgroundImage: `url(${"/bg-reward.png"})` }}
      >
        <div className="h-[83%] w-full p-6">
          <div className="overflow-y-scroll h-full w-full [&::-webkit-scrollbar]:hidden">
            <div className="mt-2" />
            {mode ? (
              <>
                {collectedRankings.map((collectedRanking) => (
                  <div className="w-full h-18 mb-5" key={collectedRanking.rank}>
                    <RankingCard
                      rank={collectedRanking.rank}
                      imageUrl={collectedRanking.image_url}
                      mode={true}
                      name={collectedRanking.name}
                      value={collectedRanking.collection_rate}
                    />
                  </div>
                ))}
              </>
            ) : (
              <>
                {clearRankings.map((clearRanking) => (
                  <div className="w-full h-18 mb-5" key={clearRanking.rank}>
                    <RankingCard
                      rank={clearRanking.rank}
                      imageUrl={clearRanking.imageUrl}
                      mode={false}
                      name={clearRanking.name}
                      value={clearRanking.clearTime}
                    />
                  </div>
                ))}
              </>
            )}
            <div className="mt-10" />
          </div>
        </div>
        <div className="absolute bottom-[13%] w-full h-20 px-6 z-50">
            {mode ? (
              <MeRankingCard
                rank={meCollectedRanking?.rank ?? 0}
                imageUrl={meCollectedRanking?.image_url ?? null}
                mode={true}
                name={meCollectedRanking?.name ?? ""}
                value={meCollectedRanking?.collection_rate ?? 0}
              />
            ) : (
              <MeRankingCard
                rank={meClearRanking?.rank ?? 0}
                imageUrl={meClearRanking?.imageUrl ?? null}
                mode={false}
                name={meClearRanking?.name ?? ""}
                value={meClearRanking?.clearTime ?? ""}
              />
            )}
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
