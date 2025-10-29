import { ElementType } from "@/types/element-type";
import { PhysicsType } from "@/types/physics-type";
import axios from "axios";
import Cookie from "js-cookie";

export type MeIndexResponse = {
  id: string;
  name: string;
  imageUrl: string;
  level: number;
  maxHitPoint: number;
  hitPoint: number;
  experiencePoint: number;
  weapon: {
    id: number;
    name: string;
    imageUrl: string;
    physicsAttack: number;
    elementAttack: number | null;
    physicsType: PhysicsType;
    elementType: ElementType;
  };
};

export function meIndex(): Promise<MeIndexResponse> {
  const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/me`;
  const authToken = Cookie.get("authToken");

  return axios
    .get<MeIndexResponse>(apiUrl, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    })
    .then((res) => {
      if (res.data.weapon === null) {
        return {
          ...res.data,
          weapon: {
            id: 0,
            name: "素手",
            imageUrl: "/hand_weapon.png",
            physicsAttack: 10,
            elementAttack: null,
            physicsType: "blow",
            elementType: "neutral",
          },
        };
      }
      return res.data;
    });
}
