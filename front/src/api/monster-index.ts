import axios from "axios";
import Cookies from "js-cookie";

export type MonsterIndexRequest = {
  currentPage: number;
  name: string;
};

export type MonsterIndexResponse = {
  id: string;
  name: string;
  imageUrl: string;
  attack: number;
  hitPoint: number;
  experiencePoint: number;

  // 物理耐性
  slash: number;
  blow: number;
  shoot: number;

  // 属性耐性
  neutral: number;
  flame: number;
  water: number;
  wood: number;
  shine: number;
  dark: number;

  // ドロップアイテム
  weapon: {
    id: number;
    name: string;
  } | null;
  item: {
    id: number;
    name: string;
  } | null;
}[];

export function monsetrIndex(req: MonsterIndexRequest): Promise<{
  data: MonsterIndexResponse;
  totalPage: number;
}> {
  const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/monster`;
  const authToken = Cookies.get("authToken");

  return axios
    .get<MonsterIndexResponse>(apiUrl, {
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
