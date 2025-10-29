import { useState, useEffect } from "react";
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
import Image from "next/image";
import clsx from "clsx";
import { WeaponCard } from "@/components/feature/battle/weapon-card";
import { RewardModal } from "@/components/feature/battle/reward-modal";
import { UserStatus } from "@/components/shared/user-status";
import { motion } from "framer-motion";
import { BattleConsole } from "@/components/feature/battle/battle-console";
import { ITEM_TARGET_LABEL_MAP } from "@/const/item-target-label-map";
import {
  Drop,
  TreasureBoxButton,
} from "@/components/feature/battle/treasure-box-button";
import { hpBgColor } from "@/utils/hp-bg-color";
import { useZxing } from "react-zxing";

export type BattlePhase =
  | { status: "first"; action: null | "weapon" | "item" }
  | { status: "command"; action: null | "weapon" | "item" };

export type BattleLog = {
  message: string;
  action: () => void;
};

type Props = {
  battle: Battle;
  monsterAttackLogs: (setBattlePhase: (bp: BattlePhase) => void) => BattleLog[];
};

export function BattlePage({ battle, monsterAttackLogs }: Props) {
  const { user, setUser, weapons, items, setItems } = useGlobalContext();
  const router = useRouter();
  const [monster, setMonster] = useState<MonsterShowResponse>(
    structuredClone(battle.getMonster())
  );
  const [battlePhase, setBattlePhase] = useState<BattlePhase>({
    status: "first",
    action: null,
  });
  const [battleQueue, setBattleQueue] = useState<BattleLog[]>([]);
  const [isStandBy, setIsStandBy] = useState(false);
  const [isItemUsed, setIsItemUsed] = useState(false);
  const [showAwayModal, setShowAwayModal] = useState(false);
  const [reward, setReward] = useState<{
    restLevel: number;
    restExperiencePoint: number;
    level: number;
    experiencePoint: number;
    drop: Drop | null;
  } | null>(null);
  const [startDate, setStartDate] = useState<Date>();

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
        action: () =>
          setMonster({
            ...monster,
            hitPoint: attackData.monsterHitPoint,
          }),
      });
    } else {
      logs.push({
        message: `${attackData.damage}のダメージを\n与えた！`,
        action: () =>
          setMonster({
            ...monster,
            hitPoint: attackData.monsterHitPoint,
          }),
      });
    }
    if (attackData.monsterHitPoint !== 0) {
      setIsItemUsed(false);
      setBattleQueue([...logs, ...monsterAttackLogs(setBattlePhase)]);
      return;
    }

    const rewardData = battle.reward(weapons.map((weapon) => weapon.id));
    let drop: Drop | null = null;
    if (rewardData.drop === "weapon" && monster.weapon) {
      drop = {
        type: "weapon",
        physicsType: monster.weapon.physicsType,
        elementType: monster.weapon.elementType,
        imageUrl: monster.imageUrl,
      };
    }
    if (rewardData.drop === "item" && monster.item) {
      drop = {
        type: "item",
        effectType: monster.item.effectType,
        imageUrl: monster.imageUrl,
      };
    }
    logs.push({
      message: `${monster.name}を\n倒した！`,
      action: () => {
        setReward({
          restLevel: user.level,
          restExperiencePoint: user.experiencePoint,
          level: rewardData.level,
          experiencePoint: rewardData.experiencePoint,
          drop: drop,
        });
        setUser({
          ...user,
          level: rewardData.level,
          experiencePoint: rewardData.experiencePoint,
          hitPoint: rewardData.hitPoint,
          maxHitPoint: rewardData.maxHitPoint,
        });
      },
    });
    setBattleQueue(logs);
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

  const dotBorderClassName =
    "bg-[linear-gradient(to_right,#666_6px,transparent_2px,transparent_5px)] bg-[length:10px_2px] bg-bottom bg-repeat-x";
  const buttonGradationClassName =
    "bg-[linear-gradient(to_right,rgba(102,102,102,0)_0%,rgba(102,_102,_102,_0.8)_20%,rgba(102,102,102,0.8)_80%,rgba(102,102,102,0)_100%)]";
  const { ref } = useZxing();
  return (
    <div
    // className="h-screen w-screen bg-cover bg-center bg-no-repeat text-xl"
    // style={{ backgroundImage: `url(${"/bg-battle.png"})` }}
    >
      <div className="fixed inset-0 -z-10">
        <video
          ref={ref}
          className="w-full h-full object-cover"
          autoPlay
          muted
          playsInline
        />
      </div>
      {/* モンスター画面 */}
      <div
        className={`h-[calc(100vh-320px)] pt-18 flex flex-col items-center justify-center transition-opacity duration-[2000ms]`}
        style={{ opacity: monster.hitPoint > 0 ? 1 : 0 }}
      >
        <div className="relative w-[24vh] h-auto aspect-square">
          <Image src={monster.imageUrl} alt="モンスター画像" fill priority />
        </div>
        <div className="w-[70%] bg-white/60 p-3">
          <div className="relative w-full bg-white border border-black h-3 flex items-center ">
            <div
              className="h-full transition-all duration-300"
              style={{
                width: `${(monster.hitPoint / monster.maxHitPoint) * 100}%`,
                backgroundColor: hpBgColor(
                  monster.hitPoint,
                  monster.maxHitPoint
                ),
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
                    setStartDate(new Date());
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

      {reward && startDate && (
        <div className="fixed top-0 w-screen h-screen z-10 bg-black/70">
          <RewardModal
            restLevel={reward.restLevel}
            restExperiencePoint={reward.restExperiencePoint}
            level={reward.level}
            experiencePoint={reward.experiencePoint}
            drop={
              <div>
                {reward.drop && <TreasureBoxButton drop={reward.drop} />}
              </div>
            }
            startDate={startDate}
          />
        </div>
      )}
    </div>
  );
}
