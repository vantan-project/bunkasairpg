"use client";

import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { Battle } from "@/utils/battle";
import { useRouter } from "next/navigation";
import { useGlobalContext } from "@/hooks/use-global-context";
import { WeaponDrawer } from "@/components/feature/battle/weapon-drawer";
import { MonsterShowRequest } from "@/api/monster-show";
import { ItemDrawer } from "@/components/feature/battle/item-drawer";
import { Modal } from "@/components/layout/modal";

export type Mode = 'command' | 'standBy' | 'win' | 'defeat';

export type BattleLog = {
  message: string;
  action: () => void;
};

export default function Page() {
  const { user, setUser, weapons, items } = useGlobalContext()
  const initialMonster: MonsterShowRequest = {
    name: "",
    imageFile: null,
    attack: 1,
    maxHitPoint: 200,
    hitPoint: 200,
    experiencePoint: 100,
    slash: 0,
    blow: 0,
    shoot: 0,
    neutral: 0,
    flame: 0,
    water: 0.4,
    wood: 0,
    shine: 0,
    dark: 0,
    weapon: null,
    item: null,
  };
  
  const { monsterId } = useParams();
  const [battleQueue, setBattleQueue] = useState<BattleLog[]>([]);
  const router = useRouter();
  const [battle, setBattle] = useState<Battle | null>(null);
  const [monster, setMonster] = useState(initialMonster);
  const [item, setItem] = useState(items[0]);
  const [weapon, setWeapon] = useState(weapons[0])
  const [mode, setMode] = useState<Mode>("standBy");
  const [weaponDrawer, setWeaponDrawer] = useState(false);
  const [itemDrawer, setItemDrawer] = useState(false);
  const [awayModal, setAwayModal] = useState(false)

  useEffect(() => {
    setBattle(new Battle(user, initialMonster));
    setBattleQueue([{ message: "モンスターが現れた", action: () => setMode("command") }]);
  }, []);
  if (!battle) return;

  const handleAttack = () => {
    setMode("standBy");

    const player = battle.attack();
    const logs: BattleLog[] = [
      {
        message: "〇〇を攻撃した",
        action: () => setMonster({ ...monster, hitPoint: player.monsterHitPoint }),
      },
      { message: player.message, action: () => { } },
    ];

    if (player.isFinished) {
      setBattleQueue([...logs, { message: "〇〇を倒した", action: () => setMode("win") }]);
      return;
    }

    setBattleQueue([...logs, ...monsterAttackLogs()]);
  };

  const monsterAttackLogs = (): BattleLog[] => {
    const monster = battle.takeDamage();
    const logs: BattleLog[] = [
      {
        message: "〇〇の攻撃！",
        action: () => setUser({ ...user, hitPoint: monster.userHitPoint }),
      },
      {
        message: monster.message,
        action: () => !monster.isFinished && setMode("command"),
      },
    ];

    if (monster.isFinished) logs.push({ message: "〇〇に倒された", action: () => setMode("defeat") });
    return logs;
  };

  const handleNextLog = () => {
    const [current, ...rest] = battleQueue;
    current.action();
    setBattleQueue(rest)
  }

  const handleChangeWeapon = () => {
    setMode("standBy");
    setWeaponDrawer(false);
    const player = battle.changeWeapon(weapon);
    const logs: BattleLog[] = [
        {
            message: player.message,
            action: () => setUser({ ...user, weapon: weapon }),
        },
    ];
    setBattleQueue([...logs, ...monsterAttackLogs()]);
  }

  const handleUseItem = () => {
    setMode("standBy");
    setItemDrawer(false);
    let logs: BattleLog[] = [];
    if (item.effectType === 'heal') {
      const player = battle.useHealItem(item);
      console.log(player)
      logs.push (
        {
          message: `${item.name}を使った！`,
          action: () => {},
        },
        {
          message: player.message,
          action: () => setUser({ ...user, hitPoint: player.userHitPoint }),
        }
      )
    }
    if (item.effectType === 'buff') {
      const player = battle.useBuffItem(item);
      logs.push (
        {
            message: player.message,
            action: () => {},
        }
      )
    }
    if (item.effectType === 'debuff') {
      const player = battle.useDebuffItem(item);
      logs.push (
        {
            message: player.message,
            action: () => {},
        }
      )
    }

    setBattleQueue([...logs, ...monsterAttackLogs()]);
  }

  return (
    <div>
      {mode === "standBy" && (
        <div
          className="fixed w-screen h-screen z-10 bg-gray-200/[0.8]"
          onClick={handleNextLog}
        >
          <div className="w-full text-center">{battleQueue[0]?.message}</div>
        </div>
      )}
      <div>
        <div>
          {monsterId}のモンスター：{monster.hitPoint}HP
        </div>
        <div>
          僕の：{user.hitPoint}HP
        </div>
        <div className="flex gap-5">
          <button onClick={handleAttack}>攻撃</button>
          <button
            onClick={() => setItemDrawer(true)}
          >
            アイテム
          </button>
          <button
            onClick={() => setWeaponDrawer(true)}
          >
            装備の変更
          </button>
          <button
            onClick={() => setAwayModal(true)}
          >
            逃げる
          </button>
        </div>

      </div>
      {weaponDrawer &&
        <WeaponDrawer
          weapons={weapons}
          weapon={weapon}
          setWeapon={setWeapon}
          handleChangeWeapon={handleChangeWeapon}
        />
      }
      {itemDrawer &&
        <ItemDrawer
          items={items}
          item={item}
          setItem={setItem}
          handleUseItem={handleUseItem}
        />
      }

      {awayModal && (
        <Modal
            onClose={() => setAwayModal(false)}
            onConfirm={() => router.push("/")}
            title={`本当に逃げますか？`}
        />
      )}

      {mode === "win" && 
        <div className="">
          報酬
        </div>
      }

      {mode === "defeat" && 
        <div className="">
          敗北
        </div>
      }
    </div>
  );
}
