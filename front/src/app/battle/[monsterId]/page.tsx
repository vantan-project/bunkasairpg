"use client";

import { monsterShow } from "@/api/monster-show";
import { BattleLog, BattlePage } from "@/components/feature/battle/battle-page";
import { useGlobalContext } from "@/hooks/use-global-context";
import { Battle } from "@/utils/battle";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Page() {
  const [battle, setBattle] = useState<Battle | null>(null);
  const { user, setUser } = useGlobalContext();
  const router = useRouter();
  const { monsterId } = useParams<{
    monsterId: string;
  }>();

  useEffect(() => {
    monsterShow(monsterId).then((monster) => {
      setBattle(
        new Battle(structuredClone({ ...user, maxHitPoint: user.hitPoint }), {
          ...monster,
          maxHitPoint: monster.hitPoint,
        })
      );
    });
  }, []);

  if (!battle) return null;

  return (
    <BattlePage
      battle={battle}
      monsterAttackLogs={(setBattlePhase) => {
        const monster = battle.getMonster();
        const takeDamageData = battle.takeDamage();
        const logs: BattleLog[] = [
          {
            message: `${monster.name}の\n攻撃！`,
            action: () => {},
          },
          {
            message: `${takeDamageData.damage}のダメージを\n受けた！`,
            action: () => {
              if (takeDamageData.userHitPoint === 0) {
                setBattlePhase({
                  status: "command",
                  action: null,
                });
              }
              setUser({ ...user, hitPoint: takeDamageData.userHitPoint });
            },
          },
        ];
        if (takeDamageData.userHitPoint === 0) {
          logs.push({
            message: `${user.name}は死んでしまった！`,
            action: () => router.push("/camera"),
          });
        }
        return logs;
      }}
    />
  );
}
