import axios from "axios";
import Cookies from "js-cookie";

export type MonsterIndexRequest = {
  currentPage: number;
  name: string;
};

export type MonsterIndexResponse = {
  id: string;
  imageUrl: string;
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
