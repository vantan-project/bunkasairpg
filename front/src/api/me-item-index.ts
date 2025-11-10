import { ElementType } from "@/types/element-type";
import { PhysicsType } from "@/types/physics-type";
import axios from "axios";
import Cookie from "js-cookie";

export type MeItemIndexRequest = {
  currentPage: number;
};

export type MeItemIndexResponse = (
  | (
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
          count: number;
        }
    )
  | null
)[];

export function meItemIndex(req: MeItemIndexRequest): Promise<{
  data: MeItemIndexResponse;
  totalPage: number;
}> {
  const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/me/item-index`;
  const authToken = Cookie.get("authToken");

  return axios
    .get<MeItemIndexResponse>(apiUrl, {
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
