import axios from "axios";
import Cookie from "js-cookie";

export type MeMonsterIndexRequest = {
  currentPage: number;
};

export type MeMonsterIndexResponse = ({
  id: string;
  name: string;
  imageUrl: string;
} | null)[];

export function meMonsterIndex(req: MeMonsterIndexRequest): Promise<{
  data: MeMonsterIndexResponse;
  totalPage: number;
}> {
  const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/me/monster-index`;
  const authToken = Cookie.get("authToken");

  return axios
    .get<MeMonsterIndexResponse>(apiUrl, {
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
