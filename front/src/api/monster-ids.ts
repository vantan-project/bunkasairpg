import axios from "axios";
import Cookies from "js-cookie";

export type MonsterIdsResponse = {
  ids: string[];
};

export function monsterIds(): Promise<MonsterIdsResponse> {
  const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/monster/ids`;
  const authToken = Cookies.get("authToken");

  return axios
    .get<MonsterIdsResponse>(apiUrl, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    })
    .then((res) => res.data);
}
