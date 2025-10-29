import { AssetTypeIcon } from "@/components/shared/asset-type-icon";
import { EffectType } from "@/types/effect-type";
import { ElementType } from "@/types/element-type";
import { PhysicsType } from "@/types/physics-type";
import { assetGradation } from "@/utils/asset-gradation";
import clsx from "clsx";
import Image from "next/image";
import { useState, useEffect } from "react";

type Props = {
  drop: Drop;
};

export type Drop =
  | {
      type: "weapon";
      physicsType: PhysicsType;
      elementType: ElementType;
      imageUrl: string;
    }
  | {
      type: "item";
      effectType: EffectType;
      imageUrl: string;
    };

export function TreasureBoxButton({ drop }: Props) {
  const [showClosedBox, setShowClosedBox] = useState(true);
  const [showOpenedBox, setShowOpenedBox] = useState(false);
  const [showDrop, setShowDrop] = useState(false);

  useEffect(() => {
    const openTimer = setTimeout(() => {
      setShowClosedBox(false);
      setShowOpenedBox(true);
    }, 1000);

    const dropTimer = setTimeout(() => {
      setShowOpenedBox(false);
      setShowDrop(true);
    }, 1500);

    return () => {
      clearTimeout(openTimer);
      clearTimeout(dropTimer);
    };
  }, []);

  return (
    <div className="flex flex-col items-center">
      {showClosedBox && (
        <Image
          src="/treasure-box-close.png"
          width={180}
          height={180}
          alt="treasure-box-close"
          priority
        />
      )}

      {showOpenedBox && (
        <Image
          src="/treasure-box-open.png"
          width={180}
          height={180}
          alt="treasure-box-open"
          priority
        />
      )}

      <div
        className="pt-4 transition-opacity duration-700 opacity-100"
        style={{ opacity: showDrop ? 1 : 0 }}
      >
        {drop.type === "weapon" && (
          <div
            className={clsx(
              "p-1 rounded-md w-28 transition-opacity duration-700",
              assetGradation(drop.elementType)
            )}
          >
            <div className="relative aspect-square bg-gray-300">
              <div className="absolute w-full px-1 bottom-2 flex gap-2 z-10 justify-end">
                <AssetTypeIcon type={drop.physicsType} size="30%" />
                <AssetTypeIcon type={drop.elementType} size="30%" />
              </div>
              <Image src={drop.imageUrl} alt="武器画像" fill priority />
            </div>
          </div>
        )}

        {drop.type === "item" && (
          <div
            className={clsx(
              "p-1 rounded-md w-28 transition-opacity duration-700",
              assetGradation(drop.effectType)
            )}
          >
            <div className="relative aspect-square bg-gray-300">
              <div className="absolute w-full px-1 bottom-2 flex gap-2 z-10 justify-end">
                <AssetTypeIcon type={drop.effectType} size="30%" />
              </div>
              <Image src={drop.imageUrl} alt="アイテム画像" fill priority />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
