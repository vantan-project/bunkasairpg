import { EffectType } from "@/types/effect-type";
import { ElementType } from "@/types/element-type";
import { PhysicsType } from "@/types/physics-type";
import axios from "axios";
import Cookies from "js-cookie";

export type MonsterShowResponse = {
  id: string;
  name: string;
  imageUrl: string;
  attack: number;
  hitPoint: number;
  experiencePoint: number;
  slash: number;
  blow: number;
  shoot: number;
  neutral: number;
  flame: number;
  water: number;
  wood: number;
  shine: number;
  dark: number;
  weapon: {
    id: number;
    name: string;
    imageUrl: string;
    physicsType: PhysicsType;
    elementType: ElementType;
  } | null;
  item: {
    id: number;
    name: string;
    imageUrl: string;
    effectType: EffectType;
  } | null;
};

export function monsterShow(id: string): Promise<MonsterShowResponse> {
  const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/monster/${id}`;
  const authToken = Cookies.get("authToken");

  return axios
    .get<MonsterShowResponse>(apiUrl, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    })
    .then((res) => {
      return res.data;
    });
}
