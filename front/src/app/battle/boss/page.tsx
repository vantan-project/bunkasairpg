"use client";

import { BattleLog, BattlePage } from "@/components/feature/battle/battle-page";
import { ITEM_TARGET_LABEL_MAP } from "@/const/item-target-label-map";
import { useGlobalContext } from "@/hooks/use-global-context";
import { ElementType } from "@/types/element-type";
import { PhysicsType } from "@/types/physics-type";
import { BossBattle } from "@/utils/boss-battle";
import { useEffect, useState } from "react";

export default function Page() {
  const [battle, setBattle] = useState<BossBattle | null>(null);
  const { user, setUser } = useGlobalContext();
  const bossImageMap: Record<ElementType, string> = {
    neutral: "/boss-neutral.png",
    flame: "/boss-wood.png",
    water: "/boss-flame.png",
    wood: "/boss-water.png",
    shine: "/boss-dark.png",
    dark: "/boss-shine.png",
  };

  useEffect(() => {
    setBattle(
      new BossBattle(structuredClone({ ...user, maxHitPoint: user.hitPoint }))
    );
  }, []);

  if (!battle) return null;

  return (
    <BattlePage
      battle={battle}
      monsterAttackLogs={(setBattlePhase, setMonster) => {
        const monster = battle.getMonster();
        const takeDamageData = battle.takeDamage();
        const physicsTypes: PhysicsType[] = ["slash", "blow", "shoot"];
        const physicsType = physicsTypes[Math.floor(Math.random() * 3)];
        const elementTypes: ElementType[] = [
          "neutral",
          "flame",
          "water",
          "wood",
          "shine",
          "dark",
        ];
        const elementType = elementTypes[Math.floor(Math.random() * 6)];
        battle.shiftWeakness(physicsType, elementType);
        const logs: BattleLog[] = [
          {
            message: `${monster.name}の姿が変わっていく！`,
            action: () =>
              setMonster({ ...monster, imageUrl: bossImageMap[elementType] }),
          },
          {
            message: `${monster.name}の${ITEM_TARGET_LABEL_MAP[physicsType]}耐性が下がった！`,
            action: () => {},
          },
          {
            message: `${monster.name}の${ITEM_TARGET_LABEL_MAP[elementType]}耐性が下がった！`,
            action: () => {},
          },
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
            action: () => {
              location.href = "/camera";
            },
          });
        }
        return logs;
      }}
    />
  );
}
