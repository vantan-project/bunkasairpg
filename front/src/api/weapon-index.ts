import axios from "axios";
import Cookies from "js-cookie";
import { ElementType } from "@/types/element-type";
import { PhysicsType } from "@/types/physics-type";

export type WeaponIndexRequest = {
  currentPage: number;
  name: string;
  physicsType: PhysicsType;
  elementType: ElementType;
};

export type WeaponIndexResponse = {
  id: number;
  imageUrl: string;
  physicsType: PhysicsType;
  elementType: ElementType;
}[];

export function weaponIndex(req: WeaponIndexRequest): Promise<{
  data: WeaponIndexResponse;
  totalPage: number;
}> {
  const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/weapon`;
  const authToken = Cookies.get("authToken");

  return axios
    .get<WeaponIndexResponse>(apiUrl, {
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
