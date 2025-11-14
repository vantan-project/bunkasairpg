import { EffectType } from "@/types/effect-type";
import { EffectMode } from "./change-attack-effect";

interface Props {
    setChangeEffect: React.Dispatch<React.SetStateAction<EffectMode>>;
    effectType: EffectType;
}
export function changeUseItemEffect({ setChangeEffect, effectType }: Props) {
    setChangeEffect(effectType);
    setTimeout(() => {
        setChangeEffect("none");
    }, 500);
}  