import axios from "axios";
import Cookies from "js-cookie";
import { ElementType } from "@/types/element-type";
import { PhysicsType } from "@/types/physics-type";
import { EffectType } from "@/types/effect-type";

export type ItemIndexRequest = {
  currentPage: number;
  name: string;
  effectType: EffectType;
};

export type ItemIndexResponse = (
  | {
      id: number;
      name: string;
      imageUrl: string;
      effectType: "heal";
      amount: number;
    }
  | {
      id: number;
      name: string;
      imageUrl: string;
      effectType: "buff";
      rate: number;
      target: PhysicsType | ElementType;
    }
  | {
      id: number;
      name: string;
      imageUrl: string;
      effectType: "debuff";
      rate: number;
      target: PhysicsType | ElementType;
    }
)[];

export function itemIndex(req: ItemIndexRequest): Promise<{
  data: ItemIndexResponse;
  totalPage: number;
}> {
  const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/item`;
  const authToken = Cookies.get("authToken");

  return axios
    .get<ItemIndexResponse>(apiUrl, {
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
