import { Modal } from "@/components/feature/battle/modal";
import { useState } from "react";
import { ElementType } from "@/types/element-type";
import { PhysicsType } from "@/types/physics-type";
import { MeItemResponse } from "@/api/me-item";


export type MeItem = (
    | {
        id: number;
        name: string;
        imageUrl: string;
        effectType: "heal";
        amount: number;
        count: number;
    }
    | {
        id: number;
        name: string;
        imageUrl: string;
        effectType: "buff";
        rate: number;
        target: PhysicsType | ElementType;
        count: number;
    }
    | {
        id: number;
        name: string;
        imageUrl: string;
        effectType: "debuff";
        rate: number;
        target: PhysicsType | ElementType;
        count: number;
    }
);

type Props = {
    items: MeItemResponse;
    item: MeItem;
    setItem: React.Dispatch<React.SetStateAction<MeItem>>;
    handleUseItem: () => void; 
};

export function ItemDrawer({ items, item, setItem, handleUseItem }: Props) {

    const [confirmModal, setConfirmModal] = useState(false);
    const handleConfirmItem = (item: MeItem) => {
        setConfirmModal(true);
        setItem(item)
    }
    return (
        <div className="flex overflow-x-hidden">
            {items.map((item, index) => (
                <div
                    key={index}
                    className="bg-red-300 p-5 mb-4"
                    onClick={() => handleConfirmItem(item)}
                >
                    {item.name}
                </div>
            ))}
            {confirmModal && (
                <Modal
                    onClose={() => setConfirmModal(false)}
                    onConfirm={handleUseItem}
                    title={`本当に「${item.name}」を\n使用しますか？`}
                />
            )}
        </div>
    )
}
