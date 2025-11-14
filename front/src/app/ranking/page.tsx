"use client";

import { RankingPage } from "@/components/feature/ranking/ranking-page";
import { BgCamera } from "@/components/shared/bg-camera";

export default function Ranking() {
  return (
    <div className="h-[100dvh] w-screen bg-cover bg-center bg-no-repeat flex flex-col items-center font-dotgothic">
      <BgCamera />
      <RankingPage />
    </div>
  );
}
