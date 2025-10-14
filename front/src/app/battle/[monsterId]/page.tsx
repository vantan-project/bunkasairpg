"use client";

import { useParams } from "next/navigation";
import { useState } from "react";

export default function Page() {
  //　モンスターのIDをURLから取得
  const { monsterId } = useParams();
  // バトルログ
  const [battleLogs, setBattleLogs] = useState<string[]>([]);

  return (
    <div>
      {/* 背景にバトルログを表示 */}
      <div
        className="fixed w-screen h-screen -z-10 bg-gray-200"
        onClick={() => setBattleLogs(battleLogs.slice(1))}
      >
        <div className="w-full text-center">{battleLogs[0]}</div>
      </div>
      {monsterId}が現れた！
      <button
        onClick={() =>
          setBattleLogs([
            ...battleLogs,
            "モンスターを攻撃した！" + battleLogs.length,
          ])
        }
      >
        攻撃
      </button>
    </div>
  );
}
