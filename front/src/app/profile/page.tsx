"use client";

import Image from "next/image";
import { useGlobalContext } from "@/hooks/use-global-context";
import { UserIcon } from "@/components/shared/icons/user-icon";
import { Footer } from "@/components/shared/footer";
import { useState } from "react";
import { QrModal } from "@/components/feature/profile/qr-modal";
import { meUpdate } from "@/api/me-update";
import {
  MeWeapon,
  WeaponDrawer,
} from "@/components/feature/battle/weapon-drawer";
import { ItemDrawer } from "@/components/feature/battle/item-drawer";
import { MeItem } from "@/components/feature/battle/item-drawer";
import { meUseItem } from "@/api/me-use-item";
import { addToasts } from "@/utils/add-toasts";
import { ProfileConsole } from "@/components/feature/profile/profile-console";

export default function Page() {
  const { user, setUser, items, setItems } = useGlobalContext();
  const [name, setName] = useState(user.name);
  const [nameOpen, setNameOpen] = useState(false);
  const [qrModalOpen, setQrModalOpen] = useState(false);
  const [weaponDrawerOpen, setWeaponDrawerOpen] = useState(false);
  const [itemDrawerOpen, setItemDrawerOpen] = useState(false);

  const handleNameChange = (name: string) => {
    if (name === user.name || !name) return;
    setName(name);
    meUpdate({ name }).then(() => {
      addToasts(true, [`ユーザー名を「${name}」に変更しました！`]);
      setUser({ ...user, name });
    });
  };

  const handleImageChange = (imageFile?: File | null) => {
    if (!imageFile) return;
    const reader = new FileReader();
    meUpdate({ imageFile }).then(() => {
      addToasts(true, ["ユーザーアイコンを変更しました！"]);
      reader.onload = () => {
        const imageUrl = reader.result as string;
        setUser({ ...user, imageUrl });
      };
      reader.readAsDataURL(imageFile);
    });
  };

  const handleChangeWeapon = (weapon: MeWeapon) => {
    meUpdate({ weaponId: weapon.id }).then(() => {
      addToasts(true, [`${user.name}は「${weapon.name}」を装備しました！`]);
      setUser({ ...user, weapon });
    });
    setWeaponDrawerOpen(false);
  };

  const handleUseItem = (item: MeItem) => {
    setItemDrawerOpen(false);
    if (item.effectType !== "heal") {
      addToasts(false, ["戦闘外は回復アイテム以外使用できません！"]);
      return;
    }
    meUseItem({ itemId: item.id }).then(() => {
      addToasts(true, [`${user.name}は「${item.name}」を使用しました！`]);
      if (item.count === 1) {
        setItems(items.filter((prev) => prev.id !== item.id));
      } else {
        setItems(
          items.map((prev) =>
            prev.id === item.id ? { ...prev, count: prev.count - 1 } : prev
          )
        );
      }
    });
  };

  return (
    <div
      className="flex justify-center items-center h-screen w-screen bg-cover bg-center bg-no-repeat text-xl"
      style={{ backgroundImage: `url(${"/bg-battle.png"})` }}
    >
      <div
        className="w-[90%] aspect-[380/605] bg-cover bg-center bg-no-repeat flex justify-center"
        style={{ backgroundImage: `url(${"/bg-profile.png"})` }}
      >
        <div className="relative w-[90%] flex flex-col items-center">
          <div className="mt-[20%] text-xl">マイページ</div>
          <Image
            className="w-[70%] h-[2px]"
            width={100}
            height={100}
            src="/profile-border.png"
            alt="マイページの下線"
          />
          <div
            className="relative w-[60%] aspect-square mt-[8%] mr-[30%] bg-center bg-cover bg-no-repeat flex justify-center items-center"
            style={{ backgroundImage: `url(${"/bg-weapon.png"})` }}
          >
            <Image
              className="ascept-square w-full h-full"
              width={100}
              height={100}
              src={user.weapon.imageUrl}
              alt="武器画像"
            />
            <div className="absolute bottom-[8%] min-w-[70%] [clip-path:polygon(10%_0%,90%_0%,100%_50%,90%_100%,10%_100%,0%_50%)] bg-[#6F7060]/90 text-xs text-white flex justify-center items-center py-1 px-5">
              {user.weapon.name}
            </div>
          </div>
          <div className="absolute top-[50%] flex w-full px-[5%] justify-between items-end">
            <div
              className="relative flex w-[63%] h-6 rounded-full"
              onClick={() => setNameOpen(!nameOpen)}
            >
              <div className="absolute bottom-[50%] left-[108%] w-5 h-5 aspect-square z-10">
                <Image src="/change-me-name.png" alt="user" fill />
              </div>
              <div className="flex items-center justify-center [clip-path:polygon(17%_0,100%_0,91%_54%,83%_100%,17%_100%,0%_50%)] z-10 w-18 text-sm bg-[#553115] text-white">
                名前
              </div>
              <div className="absolute left-[20%] flex items-center top-0 w-[100%] h-full text-lg bg-white pl-10 rounded-full">
                {!nameOpen ? (
                  <div className="w-full truncate px-2">{user.name}</div>
                ) : (
                  <input
                    type="text"
                    className="w-[80%] truncate px-1"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    onBlur={(e) => handleNameChange(e.target.value)}
                    autoFocus
                  />
                )}
              </div>
            </div>
            <label className="relative rounded-full">
              <div className="rounded-full relative bg-gray-300 aspect-square flex items-center justify-center overflow-hidden text-white">
                {user.imageUrl ? (
                  <Image
                    className="object-cover w-16 h-16"
                    src={user.imageUrl}
                    alt="user"
                    width={150}
                    height={150}
                  />
                ) : (
                  <UserIcon className="w-16 h-16" />
                )}
              </div>
              <div className="absolute top-0 right-0 w-5 h-5 aspect-square z-30">
                <Image src="/change-weapon-btn.png" alt="user" fill />
              </div>
              <input
                type="file"
                className="hidden"
                accept="image/*"
                onChange={(e) =>
                  handleImageChange(e.target.files ? e.target.files[0] : null)
                }
              />
            </label>
          </div>
          <div className="w-full px-[5%] flex justify-between mt-[20%]">
            <div
              className="relative w-[45%] aspect-[111/45]"
              onClick={() => setWeaponDrawerOpen(true)}
            >
              <Image src="/weapon-btn.png" alt="武器変更表示画像" fill />
            </div>
            <div
              className="relative w-[45%] aspect-[111/45]"
              onClick={() => setItemDrawerOpen(true)}
            >
              <Image src="/item-btn.png" alt="アイテム一覧表示画像" fill />
            </div>
          </div>
          <div className="w-full flex justify-start px-[5%] mt-[6%]">
            <div
              className="relative w-[45%] aspect-[111/45]"
              onClick={() => setQrModalOpen(true)}
            >
              <Image src="/qr-btn.png" alt="QR表示画像" fill />
            </div>
          </div>
        </div>
      </div>
      <Footer />
      {qrModalOpen && <QrModal setOpen={setQrModalOpen} userId={user.id} />}
      {weaponDrawerOpen && (
        <ProfileConsole setClose={setWeaponDrawerOpen}>
          <WeaponDrawer
            onClose={() => {
              setWeaponDrawerOpen(false);
            }}
            changeWeapon={(w) => {
              handleChangeWeapon(w);
            }}
          />
        </ProfileConsole>
      )}
      {itemDrawerOpen && (
        <ProfileConsole setClose={setItemDrawerOpen}>
          <ItemDrawer
            onClose={() => setItemDrawerOpen(false)}
            useItem={(i) => {
              handleUseItem(i);
            }}
          />
        </ProfileConsole>
      )}
    </div>
  );
}
