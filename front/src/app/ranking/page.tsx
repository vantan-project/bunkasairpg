import { RankingPage } from "@/components/feature/ranking/ranking-page";

export default function Ranking() {
  return (
    <div
      className="h-screen w-screen bg-cover bg-center bg-no-repeat flex flex-col items-center font-dotgothic"
      style={{ backgroundImage: `url(${"/bg-ranking.png"})` }}
    >
      <RankingPage />
    </div>
  );
}
