"use client";

import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { Battle } from "@/utils/battle";
import { useRouter } from "next/navigation";
import { useGlobalContext } from "@/hooks/use-global-context";
import { WeaponDrawer } from "@/components/feature/battle/weapon-drawer";
import { MonsterShowResponse } from "@/api/monster-show";
import { ItemDrawer } from "@/components/feature/battle/item-drawer";
import { Modal } from "@/components/feature/battle/modal";
import { monsterShow } from "@/api/monster-show";
import Image from "next/image";
import clsx from "clsx";
import { meUpdate } from "@/api/me-update";
import { WeaponCard } from "@/components/feature/battle/weapon-card";
import { meUseItem } from "@/api/me-use-item";

export type Mode =
  | "first"
  | "command"
  | "standBy"
  | "reward"
  | "defeat"
  | "levelUp";

export type BattleLog = {
  message: string;
  action: () => void;
};
type MonsterId = {
  monsterId: string;
};

export default function Page() {
  const { user, setUser, weapons, items, setItems } = useGlobalContext();

  const { monsterId } = useParams<MonsterId>();
  const [battleQueue, setBattleQueue] = useState<BattleLog[]>([]);
  const router = useRouter();
  const [battle, setBattle] = useState<Battle | null>(null);
  const [monster, setMonster] = useState<MonsterShowResponse | null>(null);
  const [item, setItem] = useState(items[0]);
  const [weapon, setWeapon] = useState(user.weapon);
  const [mode, setMode] = useState<Mode>("first");
  const [weaponDrawer, setWeaponDrawer] = useState(false);
  const [itemDrawer, setItemDrawer] = useState(false);
  const [awayModal, setAwayModal] = useState(false);
  const [standByWeaponDrawer, setStandByWeaponDrawer] = useState(false);
  const [rewardModal, setRewardModal] = useState(false);

  useEffect(() => {
    monsterShow(monsterId).then((data) => {
      setMonster(structuredClone(data));
      setBattle(new Battle(structuredClone(user), structuredClone(data)));
      console.log(weapon)
    });
  }, []);

  if (!monster || !battle) {
    return <div>Loading...</div>;
  }

  const handleAttack = () => {
    setMode("standBy");
    const player = battle.attack();
    const logs: BattleLog[] = [
      {
        message: `${monster.name}を攻撃した`,
        action: () => {},
      },
      {
        message: player.message,
        action: () =>
          setMonster({ ...monster, hitPoint: player.monsterHitPoint }),
      },
    ];

    if (player.isFinished) {
      setBattleQueue([
        ...logs,
        { message: `${monster.name}を倒した`, action: () => setMode("reward") },
      ]);
      return;
    }

    setBattleQueue([...logs, ...monsterAttackLogs()]);
  };

  const monsterAttackLogs = (): BattleLog[] => {
    const take = battle.takeDamage();
    const logs: BattleLog[] = [
      {
        message: `${monster.name}の攻撃！`,
        action: () => {},
      },
      {
        message: take.message,
        action: () => {
          if (!take.isFinished) {
            setMode("command");
          }
          setUser({ ...user, hitPoint: take.userHitPoint });
        },
      },
    ];
    if (take.isFinished){
      logs.push({
        message: `${monster.name}に倒された`,
        action: () => setMode("defeat"),
      });
    } else{
      // meUpdate({hitPoint: take.userHitPoint})
    }
    return logs;
  };

  const handleNextLog = () => {
    const [current, ...rest] = battleQueue;
    current?.action();
    setBattleQueue(rest);
  };

  const handleChangeWeapon = async () => {
    setMode("standBy");
    setWeaponDrawer(false);
    await meUpdate({ weaponId: weapon.id });
    const player = battle.changeWeapon(weapon);
    const logs: BattleLog[] = [
      {
        message: player.message,
        action: () => setUser({ ...user, weapon: weapon }),
      },
    ];
    setBattleQueue([...logs, ...monsterAttackLogs()]);
  };

  const handleStandbyWeaponChange = () => {
    setStandByWeaponDrawer(false);
    meUpdate({ weaponId: weapon.id });
    battle.changeWeapon(weapon);
    setUser({ ...user, weapon: weapon });
  };
  const handleUseItem = () => {
    setMode("standBy");
    setItemDrawer(false);
    meUseItem({ itemId: item.id });
    console.log(items);
    let logs: BattleLog[] = [
      {
        message: `${item.name}を使った！`,
        action: () => {},
      },
    ];
    if (item.effectType === "heal") {
      const player = battle.useHealItem(item);
      logs.push({
        message: player.message,
        action: () => setUser({ ...user, hitPoint: player.userHitPoint }),
      });
    }
    if (item.effectType === "buff") {
      const player = battle.useBuffItem(item);
      logs.push({
        message: player.message,
        action: () => {},
      });
    }
    if (item.effectType === "debuff") {
      const player = battle.useDebuffItem(item);
      logs.push({
        message: player.message,
        action: () => {},
      });
    }
    setBattleQueue([...logs, ...monsterAttackLogs()]);
    if (item.count === 1) {
      setItems(items.filter((prev) => prev.id !== item.id));
    } else {
      setItems(
        items.map((prev) =>
          prev.id === item.id ? { ...prev, count: prev.count - 1 } : prev
        )
      );
    }
  };

  const dotBorderClassName =
    "bg-[linear-gradient(to_right,#666_6px,transparent_2px,transparent_5px)] bg-[length:10px_2px] bg-bottom bg-repeat-x";
  const buttonGradationClassName =
    "bg-[linear-gradient(to_right,rgba(102,102,102,0)_0%,rgba(102,_102,_102,_0.8)_20%,rgba(102,102,102,0.8)_80%,rgba(102,102,102,0)_100%)]";
  return (
    <div
      className="h-screen w-screen bg-cover bg-center bg-no-repeat text-xl"
      style={{ backgroundImage: `url(${"/bg-battle.png"})` }}
    >
      {/* モンスター画面 */}
      <div className="h-[calc(100vh-340px)] flex flex-col items-center justify-center">
        <p className="">{monster.name}</p>
        <div className="relative w-[50%] h-auto aspect-square">
          <Image src={monster.imageUrl} alt="モンスター画像" fill priority />
        </div>
        <div className="w-[70%] bg-white/60 p-3">
          <div className="relative w-full bg-white border border-black h-3 flex items-center ">
            <div
              className={`h-full transition-all duration-300 ${
                monster.hitPoint / monster.maxHitPoint <= 0.1
                  ? "bg-hp-low"
                  : monster.hitPoint / monster.maxHitPoint <= 0.5
                  ? "bg-hp-middle"
                  : "bg-hp-height"
              }`}
              style={{
                width: `${(monster.hitPoint / monster.maxHitPoint) * 100}%`,
              }}
            />
            <div className="absolute inset-0 top-[100%] flex items-center text-base justify-end text-black">
              {monster.hitPoint}/{monster.maxHitPoint}
            </div>
          </div>
        </div>
      </div>
      {/* ユーザー画面 */}
      <div className="fixed bottom-0 w-full min-h-[340px] bg-black/70 px-3 text-white pt-4">
        {!weaponDrawer && !itemDrawer && mode !== "first" && (
          <div>
            <div className="flex justify-between">
              <p>Lv.{user.level}</p>
              <p>{user.name}</p>
            </div>
            <div className="relative w-full bg-white border border-white h-6 flex items-center">
              <div
                className={`h-full transition-all duration-300 ${
                  user.hitPoint / user.maxHitPoint <= 0.1
                    ? "bg-hp-low"
                    : user.hitPoint / user.maxHitPoint <= 0.5
                    ? "bg-hp-middle"
                    : "bg-hp-height"
                }`}
                style={{
                  width: `${(user.hitPoint / user.maxHitPoint) * 100}%`,
                }}
              />
              <div className="absolute inset-0 flex items-center justify-end text-base text-black">
                {user.hitPoint}/{user.maxHitPoint}
              </div>
            </div>
            <div className="flex items-center justify-center">
              <div className="relative flex-[2] w-[35%] aspect-square">
                <Image src={weapon.imageUrl} alt="武器画像" fill priority />
              </div>
              <div className="flex-[3] flex-col flex">
                <button onClick={handleAttack}>攻撃</button>
                <button onClick={() => setItemDrawer(true)}>アイテム</button>
                <button onClick={() => setWeaponDrawer(true)}>
                  装備の変更
                </button>
                <button onClick={() => setAwayModal(true)}>逃げる</button>
              </div>
            </div>
          </div>
        )}
        {!weaponDrawer &&
          !itemDrawer &&
          !standByWeaponDrawer &&
          mode === "first" && (
            <div className="h-full flex flex-col">
              <WeaponCard weapon={weapon} selectedWeaponId={weapon.id} />
              <div className="flex flex-col">
                <button
                  className={clsx(buttonGradationClassName, "h-12")}
                  onClick={() => setItemDrawer(true)}
                >
                  アイテム一覧
                </button>
                <div className={clsx(dotBorderClassName, "h-[2px]")} />
                <button
                  className={clsx(buttonGradationClassName, "h-12")}
                  onClick={() => setStandByWeaponDrawer(true)}
                >
                  装備変更
                </button>
                <div className={clsx(dotBorderClassName, "h-[2px]")} />
              </div>
              <div className="flex grow justify-between p-4">
                <button>
                  <Image
                    className="w-[130px] h-auto"
                    src={"/back-button.png"}
                    alt="戻る"
                    width={1000}
                    height={1000}
                  />
                </button>
                <button
                  onClick={() => {
                    setMode("standBy");
                    setBattleQueue([
                      {
                        message: `${monster.name}が現れた`,
                        action: () => setMode("command"),
                      },
                    ]);
                  }}
                >
                  <Image
                    className="w-[130px] h-auto"
                    src={"/start-button.png"}
                    alt="開始ボタン"
                    width={1000}
                    height={1000}
                  />
                </button>
              </div>
            </div>
          )}
        {standByWeaponDrawer && (
          <div>
            <WeaponDrawer
              weapons={weapons}
              weapon={weapon}
              setWeapon={setWeapon}
              handleChangeWeapon={handleStandbyWeaponChange}
            />
            <button
              className="flex justify-center w-full my-4"
              onClick={() => setStandByWeaponDrawer(false)}
            >
              <Image
                className="w-[130px] h-auto"
                src={"/back-button.png"}
                alt="戻る"
                width={1000}
                height={1000}
              />
            </button>
          </div>
        )}
        {weaponDrawer && (
          <div>
            <WeaponDrawer
              weapons={weapons}
              weapon={weapon}
              setWeapon={setWeapon}
              handleChangeWeapon={handleChangeWeapon}
            />
            <button
              className="flex justify-center w-full my-4"
              onClick={() => setWeaponDrawer(false)}
            >
              <Image
                className="w-[130px] h-auto"
                src={"/back-button.png"}
                alt="戻る"
                width={1000}
                height={1000}
              />
            </button>
          </div>
        )}
        {itemDrawer && (
          <ItemDrawer
            items={items}
            item={item}
            setItem={setItem}
            handleUseItem={handleUseItem}
          />
        )}
      </div>
      {mode === "standBy" && (
        <div
          className="fixed w-screen h-screen z-10 bg-gray-200/[0.8]"
          onClick={handleNextLog}
        >
          <div className="w-full text-center">{battleQueue[0]?.message}</div>
        </div>
      )}
      {awayModal && (
        <Modal
          onClose={() => setAwayModal(false)}
          onConfirm={() => router.push("/")}
          title={`本当に逃げますか？`}
        />
      )}

      {mode === "reward" && (
        <div className="fixed top-0 w-screen h-screen z-10 bg-black/60">
          {!rewardModal ? (
            <div
              className="flex flex-col w-full h-full items-center mt-[30%]"
              onClick={() => setRewardModal(true)}
            >
              <div className="w-[80%]">
                <Image
                  src={"/clear.png"}
                  alt="勝利画面"
                  width={1000}
                  height={1000}
                  priority
                />
              </div>
              <div className="text-xl text-white flex items-center gap-2 mt-[20%]">
                <div>タップして進む</div>
                <Image
                  src={"/triangle.svg"}
                  alt="タップ画像"
                  width={24}
                  height={24}
                  priority
                />
              </div>
            </div>
          ) : (
            <div className="flex justify-center items-center h-full">
              <div
                className="w-[90%] aspect-[380/605] bg-cover bg-center bg-no-repeat"
                style={{ backgroundImage: `url(${"/bg-reward.png"})` }}
              ></div>
            </div>
          )}
        </div>
      )}

      {mode === "defeat" && (
        <div className="fixed top-0 w-screen h-screen z-10 bg-black/60">
          <div className="flex w-full justify-center">
            <div className="relative w-[50%] h-40">
              <Image
                src={"/clear.png"}
                alt="勝利画面"
                width={1000}
                height={1000}
                priority
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
