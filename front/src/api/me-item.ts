import { ElementType } from "@/types/element-type";
import { PhysicsType } from "@/types/physics-type";
import axios from "axios";
import Cookie from "js-cookie";

export type MeItemResponse = (
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
)[];

export function meItem(): Promise<MeItemResponse> {
  const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/me/item`;
  const authToken = Cookie.get("authToken");

  return axios
    .get<MeItemResponse>(apiUrl, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    })
    .then((res) => {
      return res.data;
    });
}
