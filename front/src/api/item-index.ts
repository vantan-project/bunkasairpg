import axios from "axios";
import Cookies from "js-cookie";
import { EffectType } from "@/types/effect-type";

export type ItemIndexRequest = {
  currentPage: number;
  name: string;
  effectType: EffectType;
};

export type ItemIndexResponse = {
  id: number;
  imageUrl: string;
  effectType: EffectType;
}[];

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
