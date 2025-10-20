"use client";

import { useParams } from "next/navigation";
import { useState, useEffect, useRef } from "react";
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
import { RewardModal } from "@/components/feature/battle/reward-modal";
import { meGetItem } from "@/api/me-get-item";
import { meGetWeapon } from "@/api/me-get-weapon";
import { UserStatus } from "@/components/shared/user-status";
import { LevelUpModal } from "@/components/feature/battle/level-up-modal";
import { motion } from "framer-motion";

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
  const [battleQueue, setBattleQueue] = useState<BattleLog[]>([]);
  const [rewardLogs, setRewardLogs] = useState<ReawrdLog[]>([]);
  const [battle, setBattle] = useState<Battle | null>(null);
  const [monster, setMonster] = useState<MonsterShowResponse | null>(null);
  const [item, setItem] = useState(items[0]);
  const [weapon, setWeapon] = useState(user.weapon);
  const [mode, setMode] = useState<Mode>("first");
  const [awayModal, setAwayModal] = useState(false);
  const [levelUpModal, setLevelUpModal] = useState(false);
  const [cameraAccessModal, setCameraAccessModal] = useState(false);
  const [weaponDrawer, setWeaponDrawer] = useState(false);
  const [itemDrawer, setItemDrawer] = useState(false);
  const [standByWeaponDrawer, setStandByWeaponDrawer] = useState(false);
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

  if (!monster || !battle) {
    return <div>Loading...</div>;
  }

  const handleAttack = () => {
    setMode("standBy");
    const player = battle.attack();
    const logs: BattleLog[] = [
      {
        message: `${monster.name}を\n攻撃した！`,
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
        {
          message: `${monster.name}を\n倒した！`,
          action: () => {
            setMode("reward");
            handleReward();
          },
        },
      ]);

      return;
    }

    setBattleQueue([...logs, ...monsterAttackLogs()]);
  };

  const monsterAttackLogs = (): BattleLog[] => {
    const take = battle.takeDamage();
    const logs: BattleLog[] = [
      {
        message: `${monster.name}の\n攻撃！`,
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
    if (take.isFinished) {
      logs.push({
        message: `${monster.name}に\n倒された！`,
        action: () => setMode("defeat"),
      });
    } else {
      meUpdate({hitPoint: take.userHitPoint})
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
    let logs: BattleLog[] = [
      {
        message: `${item.name}を\n使った！`,
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
        ? { maxHitPoint: user.level+levelUp.increasedHitPoint, level: levelUp.level }
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
            <div className={clsx(dotBorderClassName, "h-[2px]")} />
            <div className="flex justify-between">
              <p>Lv.{user.level}</p>
              <p>{user.name}</p>
            </div>
            <div className={clsx(dotBorderClassName, "h-[2px]")} />
            <div className="relative my-2 w-full bg-white border border-white h-6 flex items-center">
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
            <div className="relative flex items-center justify-center">
              <div className="absolute top-0 left-0 bg-[#666666]/80 z-10">
                装備中
              </div>
              <div className="relative flex-[2] w-[35%] aspect-square">
                <Image src={weapon.imageUrl} alt="武器画像" fill priority />
              </div>
              <div className="flex-[3] flex-col flex">
                <div className={clsx(dotBorderClassName, "h-[2px]")} />
                <button
                  className={clsx(buttonGradationClassName, "h-12")}
                  onClick={handleAttack}
                >
                  攻撃
                </button>
                <div className={clsx(dotBorderClassName, "h-[2px]")} />
                <button
                  className={clsx(buttonGradationClassName, "h-12")}
                  onClick={() => setItemDrawer(true)}
                >
                  アイテム
                </button>
                <div className={clsx(dotBorderClassName, "h-[2px]")} />
                <button
                  className={clsx(buttonGradationClassName, "h-12")}
                  onClick={() => setWeaponDrawer(true)}
                >
                  装備の変更
                </button>
                <div className={clsx(dotBorderClassName, "h-[2px]")} />
                <button
                  className={clsx(buttonGradationClassName, "h-12")}
                  onClick={() => setAwayModal(true)}
                >
                  逃げる
                </button>
                <div className={clsx(dotBorderClassName, "h-[2px]")} />
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
                        message: `${monster.name}が\n現れた！`,
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
            <button className="flex justify-center w-full my-4">
              <Image
                className="w-[130px] h-auto"
                src={"/back-button.png"}
                alt="戻る"
                width={1000}
                height={1000}
                onClick={() => setStandByWeaponDrawer(false)}
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
            <div>
              <button className="flex justify-center w-full my-4">
                <Image
                  className="w-[130px] h-auto"
                  src={"/back-button.png"}
                  alt="戻る"
                  width={1000}
                  height={1000}
                  onClick={() => setWeaponDrawer(false)}
                />
              </button>
            </div>
          </div>
        )}
        {itemDrawer && (
          <div>
            <ItemDrawer
              items={items}
              item={item}
              setItem={setItem}
              handleUseItem={handleUseItem}
            />
            <button className="flex justify-center w-full my-4">
              <Image
                className="w-[130px] h-auto"
                src={"/back-button.png"}
                alt="戻る"
                width={1000}
                height={1000}
                onClick={() => setItemDrawer(false)}
              />
            </button>
          </div>
        )}
      </div>
      {mode === "standBy" && (
        <div
          className="fixed h-1/2 w-full z-10 bg-black/80 text-white text-4xl "
          onClick={handleNextLog}
        >
          <div className="relative flex justify-center items-center w-full h-full">
            <div className="w-full text-center whitespace-pre-wrap">
              {battleQueue[0]?.message}
            </div>
            <motion.div
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
                className="absolute bottom-[15%] right-[8%]"
                src={"/triangle.svg"}
                alt="タップ画像"
                width={40}
                height={40}
                priority
              />
            </motion.div>
          </div>
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
      {(mode === "first" || weaponDrawer || itemDrawer) && (
        <div className="fixed top-0 w-full p-2">
          <UserStatus
            name={user.name}
            imageUrl={user.imageUrl}
            level={user.level}
            hitPoint={user.hitPoint}
            maxHitPoint={user.maxHitPoint}
          />
        </div>
      )}

      {mode === "defeat" && (
        <div className="fixed top-0 w-screen h-screen z-10 bg-black/60">
          <div
            className="flex flex-col w-full h-full items-center mt-[30%]"
            onClick={() => router.push("/camera")}
          >
            <div className="w-[80%]">
              <Image
                src={"/clear.png"}
                alt="敗北画面"
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
