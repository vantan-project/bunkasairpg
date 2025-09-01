import { Modal } from "@/components/layout/modal";
import { useState } from "react";
import { MeWeaponResponse } from "@/api/me-weapon";
import { ElementType } from "@/types/element-type";
import { PhysicsType } from "@/types/physics-type";

export type MeWeapon = {
    id: number;
    name: string;
    imageUrl: string;
    physicsAttack: number;
    elementAttack: number | null;
    physicsType: PhysicsType;
    elementType: ElementType;
};


type Props = {
    weapons: MeWeaponResponse;
    weapon: MeWeapon;
    setWeapon: React.Dispatch<React.SetStateAction<MeWeapon>>;
    handleChangeWeapon: () => void; 
};

export function WeaponDrawer({ weapons, weapon, setWeapon, handleChangeWeapon }: Props) {

    const [confirmModal, setConfirmModal] = useState(false);
    const handleConfirmWeapon = (weapon: MeWeapon) => {
        setConfirmModal(true);
        setWeapon(weapon)
    }
    return (
        <>
            {weapons.map((weapon, index) => (
                <div
                    key={index}
                    className="bg-red-300 p-5 mb-4"
                    onClick={() => handleConfirmWeapon(weapon)}
                >
                    {weapon.name}
                </div>
            ))}
            {confirmModal && (
                <Modal
                    onClose={() => setConfirmModal(false)}
                    onConfirm={handleChangeWeapon}
                    title={`本当に「${weapon.name}」に変更しますか？`}
                />
            )}
        </>
    )
}
