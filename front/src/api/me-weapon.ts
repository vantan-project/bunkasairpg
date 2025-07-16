import { ElementType } from "@/types/element-type";
import { PhysicsType } from "@/types/physics-type";
import axios from "axios";
import Cookie from "js-cookie";

export type MeWeaponResponse = {
  id: number;
  name: string;
  imageUrl: string;
  physicsAttack: number;
  elementAttack: number | null;
  physicsType: PhysicsType;
  elementType: ElementType;
}[];

export function meWeapon(): Promise<MeWeaponResponse> {
  const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/me/weapon`;
  const authToken = Cookie.get("authToken");

  return axios
    .get<MeWeaponResponse>(apiUrl, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    })
    .then((res) => {
      return res.data;
    });
}
