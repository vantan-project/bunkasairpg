import { ElementType } from "@/types/element-type";
import { PhysicsType } from "@/types/physics-type";
import axios from "axios";
import Cookie from "js-cookie";

export type MeWeaponIndexRequest = {
  currentPage: number;
};

export type MeWeaponIndexResponse = ({
  id: number;
  name: string;
  imageUrl: string;
  physicsAttack: number;
  elementAttack: number | null;
  physicsType: PhysicsType;
  elementType: ElementType;
} | null)[];

export function meWeaponIndex(req: MeWeaponIndexRequest): Promise<{
  data: MeWeaponIndexResponse;
  totalPage: number;
}> {
  const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/me/weapon-index`;
  const authToken = Cookie.get("authToken");

  return axios
    .get<MeWeaponIndexResponse>(apiUrl, {
      params: req,
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    })
    .then((res) => ({
      data: res.data,
      totalPage: Number(res.headers["x-total-page"]),
    }));
}
