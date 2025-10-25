"use client";

import { useParams } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { Battle } from "@/utils/battle";
import { useRouter } from "next/navigation";
import { useGlobalContext } from "@/hooks/use-global-context";
import {
  MeWeapon,
  WeaponDrawer,
} from "@/components/feature/battle/weapon-drawer";
import { MonsterShowResponse } from "@/api/monster-show";
import { ItemDrawer, MeItem } from "@/components/feature/battle/item-drawer";
import { Modal } from "@/components/feature/battle/modal";
import { monsterShow } from "@/api/monster-show";
import Image from "next/image";
import clsx from "clsx";
import { meUpdate } from "@/api/me-update";
import { WeaponCard } from "@/components/feature/battle/weapon-card";
import { RewardModal } from "@/components/feature/battle/reward-modal";
import { meGetItem } from "@/api/me-get-item";
import { meGetWeapon } from "@/api/me-get-weapon";
import { UserStatus } from "@/components/shared/user-status";
import { LevelUpModal } from "@/components/feature/battle/level-up-modal";
import { motion } from "framer-motion";
import { BattleConsole } from "@/components/feature/battle/battle-console";
import { ITEM_TARGET_LABEL_MAP } from "@/const/item-target-label-map";

export type BattlePhase =
  | { status: "first"; action: null | "weapon" | "item" }
  | { status: "command"; action: null | "weapon" | "item" }
  | { status: "reward"; action: null }
  | { status: "defeat"; action: null }
  | { status: "levelUp"; action: null };

export type BattleLog = {
  message: string;
  action: () => void;
};
export type ReawrdLog = {
  action: () => void;
};
type MonsterId = {
  monsterId: string;
};

export default function Page() {
  const { user, setUser, weapons, items, setItems } = useGlobalContext();
  const router = useRouter();
  const { monsterId } = useParams<MonsterId>();
  const [monster, setMonster] = useState<MonsterShowResponse | null>(null);
  const [battle, setBattle] = useState<Battle | null>(null);
  const [battlePhase, setBattlePhase] = useState<BattlePhase>({
    status: "first",
    action: null,
  });
  const [battleQueue, setBattleQueue] = useState<BattleLog[]>([]);
  const [rewardLogs, setRewardLogs] = useState<ReawrdLog[]>([]);
  const [isStandBy, setIsStandBy] = useState(false);
  const [isItemUsed, setIsItemUsed] = useState(false);
  const [showAwayModal, setShowAwayModal] = useState(false);
  // TODO: リファクタ前
  const [levelUpModal, setLevelUpModal] = useState(false);
  const [cameraAccessModal, setCameraAccessModal] = useState(false);
  const [rewardImage, setRewardImage] = useState("");
  const [maxExp, setMaxExp] = useState(0);
  const [width, setWidth] = useState(0);
  const [previousWidth, setPreviousWidth] = useState(0);
  const [isIncreasing, setIsIncreasing] = useState(true);
  const stopExpRef = useRef(false);
  const [riseLevel, setRiseLevel] = useState(0);
  const [rustLevel, setRustLevel] = useState(0);

  useEffect(() => {
    monsterShow(monsterId).then((data) => {
      setMonster(structuredClone(data));
      setBattle(new Battle(structuredClone(user), structuredClone(data)));
    });
  }, []);
  useEffect(() => {
    setIsStandBy(!!battleQueue.length);
  }, [battleQueue]);
  if (!monster || !battle) return;

  // 攻撃メソッド
  const handleAttack = () => {
    const logs: BattleLog[] = [
      {
        message: `${monster.name}を\n攻撃した！`,
        action: () => {},
      },
    ];
    const attackData = battle.attack();
    if (attackData.damage === 0) {
      logs.push({
        message: "モンスターの防御に\n阻まれた！",
        action: () => {},
      });
    } else if (attackData.damage < 0) {
      logs.push({
        message: `${-attackData.damage}ダメージが\n吸収された！`,
        action: () => setMonster({ ...monster, hitPoint: attackData.damage }),
      });
    } else {
      logs.push({
        message: `${attackData.damage}のダメージを\n与えた！`,
        action: () => setMonster({ ...monster, hitPoint: attackData.damage }),
      });
    }
    if (attackData.monsterHitPoint === 0) {
      setBattleQueue([
        ...logs,
        {
          message: `${monster.name}を\n倒した！`,
          action: () => {
            setBattlePhase({
              status: "reward",
              action: null,
            });
            handleReward();
          },
        },
      ]);
      return;
    }
    setBattleQueue([...logs, ...monsterAttackLogs()]);
  };
  // モンスター攻撃ログ
  const monsterAttackLogs = (): BattleLog[] => {
    setIsItemUsed(false);
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
  };
  // 武器変更ログ
  const changeWeaponLogs = (weapon: MeWeapon) => {
    battle.changeWeapon(weapon);
    const logs: BattleLog[] = [
      {
        message: `${weapon.name}を\n装備した！`,
        action: () => {
          setUser({ ...user, weapon: weapon });
        },
      },
    ];
    return logs;
  };
  // アイテム使用ログ
  const useItemLogs = (item: MeItem) => {
    if (item.count === 1) {
      setItems(items.filter((prev) => prev.id !== item.id));
    } else {
      setItems(
        items.map((prev) =>
          prev.id === item.id ? { ...prev, count: prev.count - 1 } : prev
        )
      );
    }
    let logs: BattleLog[] = [
      {
        message: `${item.name}を\n使った！`,
        action: () => {},
      },
    ];
    if (item.effectType === "heal") {
      battle.useHealItem(item);
      const healedAmount = Math.min(
        item.amount,
        user.maxHitPoint - user.hitPoint
      );
      logs.push({
        message:
          healedAmount === 0
            ? "何も起こらなかった！"
            : `HPが${healedAmount}回復した！`,
        action: () => {
          setUser({ ...user, hitPoint: user.hitPoint + healedAmount });
        },
      });
    }
    if (item.effectType === "buff") {
      battle.useBuffItem(item);
      logs.push({
        message: `${user.name}の${
          ITEM_TARGET_LABEL_MAP[item.target]
        }火力が${Math.floor(item.rate * 100)}%上昇した!`,
        action: () => {},
      });
    }
    if (item.effectType === "debuff") {
      battle.useDebuffItem(item);
      logs.push({
        message: `${monster.name}の${
          ITEM_TARGET_LABEL_MAP[item.target]
        }耐性が$${Math.floor(item.rate * 100)}低下した！`,
        action: () => {},
      });
    }
    return logs;
  };

  // TODO: リファクタ前
  const handleReward = () => {
    const weaponIds = weapons.map((weapon) => weapon.id);
    const drop = battle.drop(weaponIds);

    if (drop.drop?.type === "weapon" && monster.weapon) {
      setRewardImage(monster.weapon.imageUrl);
      meGetWeapon({ weaponId: monster.weapon.id });
    } else if (drop.drop?.type === "item" && monster.item) {
      setRewardImage(monster.item.imageUrl);
      meGetItem({ itemId: monster.item.id });
    }
    const r = battle.changeExprience({ level: user.level });
    setPreviousWidth(r.currentExp / r.expToNextLevel);
    setWidth(r.currentExp / r.expToNextLevel);
    setMaxExp(r.remainingExp);
    const experiencePoint = battle.grantExperience();
    const levelUp = battle.levelUp();
    meUpdate({
      experiencePoint: experiencePoint.experiencePoint,
      ...(levelUp
        ? {
            maxHitPoint: user.level + levelUp.increasedHitPoint,
            level: levelUp.level,
          }
        : {}),
    });
    let rustLevel = null;
    let riseLevel = 0;
    if (levelUp) {
      rustLevel = levelUp.level;
      setRustLevel(rustLevel);
      riseLevel = levelUp.level - user.level;
      setRiseLevel(riseLevel);
    }

    const logs: ReawrdLog[] = [
      {
        action: () => {
          // ここにあるとタップしてから始まる。 アクセスした瞬間に始まるにはuseEffectに入れた方が良い。
          handleExp({ rustLevel, riseLevel });
        },
      },
      {
        action: () => {
          setLevelUpModal(true);
          stopExpRef.current = true;
        },
      },
    ];
    setRewardLogs(logs);
  };

  const handleExp = async ({
    rustLevel,
    riseLevel,
  }: {
    rustLevel: number | null;
    riseLevel: number;
  }) => {
    if (rustLevel) {
      stopExpRef.current = false;
      let level = user.level;
      for (let i = 0; i < riseLevel; i++) {
        setMaxExp(i * 100);
        if (stopExpRef.current) break;
        setIsIncreasing(true);
        setWidth(1);
        if (stopExpRef.current) break;
        await new Promise((resolve) => setTimeout(resolve, 800));
        if (stopExpRef.current) break;
        setIsIncreasing(false);
        setWidth(0);
        if (stopExpRef.current) break;
        level++;
        setUser({ ...user, level: level });
        if (stopExpRef.current) break;
        await new Promise((resolve) => setTimeout(resolve, 300));
      }
      setIsIncreasing(true);
      setUser({ ...user, level: rustLevel });
      const result = battle.changeExprience({ level: rustLevel });
      setMaxExp(result.remainingExp);
      setWidth(result.currentExp / result.expToNextLevel);
      await new Promise((resolve) => setTimeout(resolve, 2000));
      setLevelUpModal(true);
    } else {
      const result = battle.changeExprience({ level: user.level });
      setMaxExp(result.remainingExp);
      console.log(result.currentExp);
      setWidth(result.currentExp / result.expToNextLevel);
      await new Promise((resolve) => setTimeout(resolve, 2000));
      setCameraAccessModal(true);
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
      <div className="h-[calc(100vh-320px)] pt-18 flex flex-col items-center justify-center">
        <p className="">{monster.name}</p>
        <div className="relative w-[24vh] h-auto aspect-square">
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

      <div className="fixed top-0 w-full p-2">
        <UserStatus
          name={user.name}
          imageUrl={user.imageUrl}
          level={user.level}
          hitPoint={user.hitPoint}
          maxHitPoint={user.maxHitPoint}
        />
      </div>

      {battlePhase.status === "first" && (
        <>
          <BattleConsole>
            <div className="flex flex-col gap-2">
              <WeaponCard weapon={user.weapon} />
              <div className="flex flex-col">
                <div className={clsx("h-1", dotBorderClassName)} />
                {[
                  {
                    label: "アイテム使用",
                    onClick: () =>
                      setBattlePhase({ status: "first", action: "item" }),
                  },
                  {
                    label: "装備変更",
                    onClick: () => {
                      if (weapons.length === 0) {
                        setBattleQueue([
                          {
                            message: "武器がありません。",
                            action: () => {},
                          },
                        ]);
                        setIsStandBy(true);
                        return;
                      }
                      setBattlePhase({ status: "first", action: "weapon" });
                    },
                  },
                ].map(({ label, onClick }) => (
                  <div key={label}>
                    <button
                      key={label}
                      className={clsx(
                        buttonGradationClassName,
                        "text-base font-bold w-full h-10"
                      )}
                      onClick={onClick}
                    >
                      {label}
                    </button>
                    <div className={clsx(dotBorderClassName, "h-[2px]")} />
                  </div>
                ))}
              </div>

              <div className="flex grow justify-between px-4">
                <button onClick={() => router.push("/camera")}>
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
                    if (user.hitPoint <= 0) {
                      setBattleQueue([
                        {
                          message:
                            "アイテムもしくは4階の教会でHPを回復してください！",
                          action: () => {},
                        },
                      ]);
                      return;
                    }
                    setBattleQueue([
                      {
                        message: `${monster.name}が\n現れた！`,
                        action: () =>
                          setBattlePhase({
                            status: "command",
                            action: null,
                          }),
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
          </BattleConsole>
          {battlePhase.action === "weapon" && (
            <BattleConsole>
              <WeaponDrawer
                onClose={() =>
                  setBattlePhase({ status: "first", action: null })
                }
                changeWeapon={(w) => {
                  setBattlePhase({ status: "first", action: null });
                  const logs = changeWeaponLogs(w);
                  setBattleQueue(logs);
                }}
              />
            </BattleConsole>
          )}
          {battlePhase.action === "item" && (
            <BattleConsole>
              <ItemDrawer
                onClose={() =>
                  setBattlePhase({ status: "first", action: null })
                }
                useItem={(i) => {
                  if (i.effectType !== "heal") {
                    setBattlePhase({ status: "first", action: null });
                    setBattleQueue([
                      {
                        message: "戦闘前は回復アイテム以外使えない！",
                        action: () => {},
                      },
                    ]);
                    return;
                  }
                  setBattlePhase({ status: "first", action: null });
                  const logs = useItemLogs(i);
                  setBattleQueue(logs);
                }}
              />
            </BattleConsole>
          )}
        </>
      )}

      {battlePhase.status === "command" && (
        <>
          <BattleConsole>
            <div className="flex flex-col gap-2">
              <WeaponCard weapon={user.weapon} />
              <div>
                <div className={clsx(dotBorderClassName, "h-[2px]")} />
                {[
                  { label: "攻撃", onClick: handleAttack },
                  {
                    label: "アイテム",
                    onClick: () =>
                      setBattlePhase({ status: "command", action: "item" }),
                  },
                  {
                    label: "装備の変更",
                    onClick: () => {
                      if (weapons.length === 0) {
                        setBattleQueue([
                          {
                            message: "武器がありません。",
                            action: () => {},
                          },
                        ]);
                        setIsStandBy(true);
                        return;
                      }
                      setBattlePhase({ status: "command", action: "weapon" });
                    },
                  },
                  { label: "逃げる", onClick: () => setShowAwayModal(true) },
                ].map(({ label, onClick }) => (
                  <div key={label}>
                    <button
                      key={label}
                      className={clsx(
                        buttonGradationClassName,
                        "text-base font-bold w-full h-10"
                      )}
                      onClick={onClick}
                    >
                      {label}
                    </button>
                    <div className={clsx(dotBorderClassName, "h-[2px]")} />
                  </div>
                ))}
              </div>
            </div>
          </BattleConsole>

          {battlePhase.action === "weapon" && (
            <BattleConsole>
              <WeaponDrawer
                onClose={() =>
                  setBattlePhase({ status: "command", action: null })
                }
                changeWeapon={(w) => {
                  setBattlePhase({ status: "command", action: null });
                  const logs = changeWeaponLogs(w);
                  setBattleQueue(logs);
                }}
              />
            </BattleConsole>
          )}
          {battlePhase.action === "item" && (
            <BattleConsole>
              <ItemDrawer
                onClose={() =>
                  setBattlePhase({ status: "command", action: null })
                }
                useItem={(i) => {
                  if (isItemUsed) {
                    setBattlePhase({ status: "command", action: null });
                    setBattleQueue([
                      {
                        message: "アイテムは1ターンに1回しか使えない！",
                        action: () => {},
                      },
                    ]);
                    return;
                  }
                  setIsItemUsed(true);
                  setBattlePhase({ status: "command", action: null });
                  const logs = useItemLogs(i);
                  setBattleQueue(logs);
                }}
              />
            </BattleConsole>
          )}
        </>
      )}

      {isStandBy && (
        <BattleConsole>
          <div
            className="relative h-[340px] flex items-center justify-center px-10"
            onClick={() => {
              if (battleQueue.length === 0) return;
              const [current, ...rest] = battleQueue;
              current.action();
              setBattleQueue(rest);
            }}
          >
            <p className="text-center">{battleQueue[0]?.message}</p>
            <motion.div
              className="absolute right-5 bottom-5"
              animate={{
                opacity: [1, 0, 1],
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <Image
                src={"/triangle.svg"}
                alt="タップ画像"
                width={30}
                height={30}
                priority
              />
            </motion.div>
          </div>
        </BattleConsole>
      )}

      {showAwayModal && (
        <Modal
          onClose={() => setShowAwayModal(false)}
          onConfirm={() => {
            setShowAwayModal(false);
            setBattleQueue([
              {
                message: `${user.name}は逃げ出した！`,
                action: () => router.push("/camera"),
              },
            ]);
          }}
          title={`本当に逃げますか？`}
        />
      )}

      {/* TODO: リファクタ前 */}
      {battlePhase.status === "reward" && (
        <div className="fixed top-0 w-screen h-screen z-10 bg-black/60">
          <RewardModal
            level={user.level}
            imageUrl={rewardImage}
            setRewardLogs={setRewardLogs}
            rewardLogs={rewardLogs}
            maxExp={maxExp}
            width={width}
            previousWidth={previousWidth}
            isIncreasing={isIncreasing}
            riseLevel={riseLevel}
            battle={battle}
            rustLevel={rustLevel}
            stopExpRef={stopExpRef}
          />
        </div>
      )}
      {levelUpModal && (
        <LevelUpModal
          level={user.level}
          setLevelUpModal={setLevelUpModal}
          setCameraAccessModal={setCameraAccessModal}
        />
      )}
      {cameraAccessModal && (
        <div
          className="fixed top-0 left-0 w-screen h-screen flex items-center justify-center bg-black/60 bg-cover bg-opacity-50 z-50 bg-center"
          onClick={() => router.push("/camera")}
        >
          <div className="text-xl text-white flex items-center gap-2">
            <div>タップしてホームに戻る</div>
            <Image
              src={"/triangle.svg"}
              alt="タップ画像"
              width={24}
              height={24}
              priority
            />
          </div>
        </div>
      )}
    </div>
  );
}
