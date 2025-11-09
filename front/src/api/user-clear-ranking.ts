import axios from "axios";
import Cookies from "js-cookie";

export type ClearRankingItem = {
    rank: number;
    name: string;
    imageUrl: string | null;
    clearTime: string;
  };
export type UserClearRankingResponse = {
    userRanking: ClearRankingItem;
    rankings: ClearRankingItem[];
};

export function userClearRanking(): Promise<UserClearRankingResponse> {
  const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/user/clear-ranking`;
  const authToken = Cookies.get("authToken");

  return axios
    .get<UserClearRankingResponse>(apiUrl, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    })
    .then((res) => {
      return res.data;
    })
}
